import { connectToDatabase } from '../../config/dbConnect';
import Compaign from '../../models/Campaign.model';
import CampaignFeedback from '../../models/CampaignFeedback';
import AdminDashboard from '../../models/AdminDashboard.model';
import Stripe from 'stripe';
import { getVideoDurationFromUrl } from '../../services/campaignServices';
import { sendEmail } from '../../services/emailServices';
import User from '../../models/User.model';
const dotenv = require("dotenv");
dotenv.config();
const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);
const { Storage } = require('@google-cloud/storage');
const { MongoClient,ObjectId } = require('mongodb');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

exports.createCampaign = async (req, res) => {
    try {
        await connectToDatabase();
        const {
            campaignTitle,
            websiteLink,
            campaignVideoUrl,
            companyLogo,
            quizQuestion,
            surveyQuestion1,
            surveyQuestion2,
            genderType,
            genderRatio,
            ageRange,
            videoDuration,
            campaignStartDate,
            campaignEndDate,
            cardDetail,
            couponCode,
            userId,
            campaignBudget,
            brandName,
            totalEngagementValue,
            videoUrlId,
            videoUrlIntelligenceStatus
        } = req.body;

        if (!campaignTitle || !websiteLink || !campaignVideoUrl || !brandName ||
            !genderType || !Array.isArray(ageRange) || ageRange.length !== 2 ||
            !campaignStartDate || !userId || !videoUrlIntelligenceStatus || !videoUrlId) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        if (!quizQuestion || !quizQuestion.questionText || !quizQuestion.option1 ||
            !quizQuestion.option2 || !quizQuestion.answer) {
            return res.status(400).json({ message: 'Invalid quiz question data' });
        }

        const processedAgeRange = ageRange.map(age => {
            const num = Number(age);
            return isNaN(num) ? 18 : num;
        }).sort((a, b) => a - b);

        const newCampaign = new Compaign({
            campaignTitle,
            websiteLink,
            campaignVideoUrl,
            videoUrlId,
            videoUrlIntelligenceStatus,
            companyLogo: companyLogo || null,
            videoDuration,
            quizQuestion: {
                questionText: quizQuestion.questionText,
                option1: quizQuestion.option1,
                option2: quizQuestion.option2,
                option3: quizQuestion.option3 || null,
                option4: quizQuestion.option4 || null,
                answer: quizQuestion.answer
            },
            surveyQuestion1: surveyQuestion1 || null,
            surveyQuestion2: surveyQuestion2 || null,
            genderType,
            genderRatio: genderRatio || '50-50',
            ageRange: processedAgeRange,
            campaignStartDate: new Date(campaignStartDate),
            campaignEndDate: campaignEndDate ? new Date(campaignEndDate) : null,
            cardDetail: cardDetail || null,
            couponCode: couponCode || null,
            userId,
            campaignBudget: campaignBudget ? Number(campaignBudget) : 0,
            brandName,
            status: 'Pending',
            engagements: {
                totalCount: 0,
                totalEngagementValue: totalEngagementValue ? Number(totalEngagementValue) : 0,
                dailyCounts: []
            }
        });

        const savedCampaign = await newCampaign.save();

        try {
            const campaignStats = await Compaign.aggregate([
                {
                    $group: {
                        _id: null,
                        totalCampaigns: { $sum: 1 },
                        pendingCampaigns: {
                            $sum: { $cond: [{ $eq: ["$status", "Pending"] }, 1, 0] }
                        },
                        activeCampaigns: {
                            $sum: { $cond: [{ $eq: ["$status", "Active"] }, 1, 0] }
                        },
                        totalBudget: { $sum: "$campaignBudget" }
                    }
                }
            ]);

            if (campaignStats.length > 0) {
                const stats = campaignStats[0];

                await AdminDashboard.findOneAndUpdate(
                    {},
                    {
                        $set: {
                            totalCampaigns: stats.totalCampaigns,
                            pendingCampaigns: stats.pendingCampaigns,
                            activeCampaigns: stats.activeCampaigns,
                            totalEarnings: stats.totalBudget,
                            lastUpdated: new Date()
                        },
                        $inc: {
                            currentWeekEarnings: campaignBudget ? Number(campaignBudget) : 0
                        },
                        $push: {
                            dailyEarnings: {
                                $each: [{
                                    day: new Date().toLocaleDateString('en-US', { weekday: 'short' }),
                                    amount: campaignBudget ? Number(campaignBudget) : 0,
                                    date: new Date()
                                }],
                                $slice: -7
                            }
                        }
                    },
                    { upsert: true, new: true }
                );
            }
        } catch (dashboardError) {
            console.error('Dashboard update error:', dashboardError);
        }

        res.status(201).json({
            success: true,
            message: 'Campaign created successfully',
            data: savedCampaign
        });

        setTimeout(async () => {
            try {
                await verifyCampaignVideos();
            } catch (error) {
                console.error('Error in scheduled video verification:', error);
            }
        }, 10000);

    } catch (error) {
        console.error('Campaign creation error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create campaign',
            error: error.message
        });
    }
};

async function verifyCampaignVideos() {
    let client;
    try {
        const storage = new Storage({
            projectId: 'aditt-app',
            credentials: {
                client_email: process.env.GOOGLE_CLIENT_EMAIL || 'aditt-video-chacker@aditt-app.iam.gserviceaccount.com',
                private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
            }
        });
        const bucketName = 'aditt-video-tester';
        const bucket = storage.bucket(bucketName);

        client = await MongoClient.connect(process.env.MONGO_URI);
        const db = client.db();

        const unverifiedCampaigns = await db.collection('campaigns').find({
            videoUrlIntelligenceStatus: "FAILED",
            status: { $ne: "Rejected" }
        }).toArray();

        for (const campaign of unverifiedCampaigns) {
            try {
                await db.collection('campaigns').updateOne(
                    { _id: campaign._id },
                    {
                        $set: {
                            status: "Rejected",
                            rejectionReason: "Video is Rejected due to not passed by intelligence",
                            updatedAt: new Date()
                        }
                    }
                );

                if (campaign.videoUrlId) {
                    try {
                        const file = bucket.file(campaign.videoUrlId);
                        const [exists] = await file.exists();

                        if (exists) {
                            await file.delete();
                            console.log(`Deleted video ${campaign.videoUrlId} for campaign ${campaign._id}`);
                        }
                    } catch (storageError) {
                        console.error(`Error deleting video ${campaign.videoUrlId} for campaign ${campaign._id}:`, storageError);
                    }
                }
            } catch (campaignError) {
                console.error(`Error processing campaign ${campaign._id}:`, campaignError);
            }
        }
    } catch (error) {
        console.error('Error in video verification:', error);
    } finally {
        if (client) await client.close();
    }
}

exports.getCampaign = async (req, res) => {
    try {
        await connectToDatabase();

        const { userId } = req.body;

        const campaign = await Compaign.find({ userId: userId });

        if (!campaign) {
            return res.status(404).json({
                message: 'Campaign not found'
            });
        }
        res.status(200).json({
            message: 'Campaign Retrieved Successfully',
            campaign: campaign
        });

    } catch (error) {
        console.error('Error retrieving campaign:', error);

        res.status(500).json({
            message: 'Failed to retrieve campaign',
            error: error.message
        });
    }
};

exports.getCampaignAgainstId = async (req, res) => {
    try {
        await connectToDatabase();

        const { id } = req.body;

        const campaign = await Compaign.findOne({ _id: id });

        if (!campaign) {
            return res.status(404).json({
                message: 'Campaign not found'
            });
        }

        const campaignFeedback = await CampaignFeedback.findOne({ campaignId: id });
        const isCompleted = !!campaignFeedback;

        res.status(200).json({
            message: 'Campaign Retrieved Successfully',
            campaign: campaign,
            isCompleted: isCompleted,
            ...(isCompleted && {
                feedback: {
                    conversion: campaignFeedback.conversion,
                    conversionType: campaignFeedback.conversionType,
                    campaignRate: campaignFeedback.campaignRate,
                    campaignFeedback: campaignFeedback.campaignFeedback
                }
            })
        });

    } catch (error) {
        console.error('Error retrieving campaign:', error);

        res.status(500).json({
            message: 'Failed to retrieve campaign',
            error: error.message
        });
    }
};

exports.sendPaymentOnClick = async (req, res) => {
    try {
        await connectToDatabase();

        const { campaignId } = req.body;

        if (!campaignId) {
            return res.status(400).json({ error: 'Campaign ID is required' });
        }

        const campaign = await Compaign.findById({ _id: campaignId });
        if (!campaign) {
            return res.status(404).json({ error: 'Campaign not found' });
        }

        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);

        const clickDate = new Date(req.body.clickDate || new Date());
        clickDate.setUTCHours(0, 0, 0, 0);

        if (clickDate.getTime() !== today.getTime()) {
            return res.status(200).json({ message: 'No clicks today, no payment processed' });
        }

        const todayStats = campaign.clickCount.dailyCounts.find(item => {
            const itemDate = new Date(item.date);
            itemDate.setUTCHours(0, 0, 0, 0);
            return itemDate.getTime() === today.getTime();
        });

        const todayClicks = todayStats ? todayStats.count : 0;

        if (todayClicks < 1) {
            return res.status(200).json({ message: 'No clicks today, no payment processed' });
        }

        const duration = await getVideoDurationFromUrl(campaign.campaignVideoUrl);
        const paymentRate = 0.01 * duration + 0.05;
        const amount = Math.round(todayClicks * paymentRate * 100);


        const paymentIntent = await stripeInstance.paymentIntents.create({
            amount,
            currency: 'usd',
            payment_method_types: ['card'],
            description: `Payment for ${todayClicks} clicks on ${campaign.campaignTitle}`,
            metadata: {
                campaignId: campaign._id.toString(),
                userId: campaign.userId,
                clickDate: today.toISOString(),
                clickCount: todayClicks
            }
        });

        const confirmedIntent = await stripeInstance.paymentIntents.confirm(
            paymentIntent.id,
            {
                payment_method: "pm_card_visa"
            }
        );

        return res.status(200).json({
            success: true,
            amount: amount / 100,
            clicks: todayClicks,
            paymentId: confirmedIntent.id,
            status: confirmedIntent.status
        });

    } catch (error) {
        console.error('Stripe payment error:', error);

        if (error.type === 'StripeCardError') {
            return res.status(400).json({
                error: 'Payment failed',
                message: error.message
            });
        }

        return res.status(500).json({
            error: 'Payment processing failed',
            details: error.message
        });
    }
};

exports.addCountInCampaign = async (req, res) => {
    try {
        await connectToDatabase();
        const { campaignId } = req.body;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const updatedCampaign = await Compaign.findOneAndUpdate(
            {
                _id: campaignId,
                "clickCount.dailyCounts.date": today
            },
            {
                $inc: {
                    "clickCount.totalCount": 1,
                    "totalViews": 1,
                    "clickCount.dailyCounts.$.count": 1
                }
            },
            { new: true }
        );

        if (updatedCampaign) {
            return res.status(200).json({
                success: true,
                message: "Click count updated successfully",
                data: updatedCampaign
            });
        }

        const campaignWithNewDate = await Compaign.findOneAndUpdate(
            { _id: campaignId },
            {
                $inc: {
                    "clickCount.totalCount": 1,
                    "totalViews": 1
                },
                $push: {
                    "clickCount.dailyCounts": { date: today, count: 1 }
                }
            },
            { new: true }
        );

        if (!campaignWithNewDate) {
            const newCampaign = await Compaign.create({
                _id: campaignId,
                clickCount: {
                    totalCount: 1,
                    dailyCounts: [{ date: today, count: 1 }]
                },
                totalViews: 1
            });

            return res.status(200).json({
                success: true,
                message: "New campaign created with click count",
                data: newCampaign
            });
        }

        return res.status(200).json({
            success: true,
            message: "Click count updated successfully with new date",
            data: campaignWithNewDate
        });

    } catch (error) {
        console.error("Error updating click count:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
}

exports.updateCampaign = async (req, res) => {
    try {
        await connectToDatabase();
        const { id, ...updateData } = req.body;

        const campaign = await Compaign.findById(id);
        if (!campaign) {
            return res.status(404).json({ message: 'Campaign not found.' });
        }

        const editableFields = [
            'genderType',
            'genderRatio',
            'ageRange',
            'campaignTitle',
            'cardDetail',
            'bankDetail',
            'campaignBudget',
            'campaignStartDate',
            'campaignEndDate'
        ];

        const hasNonEditableChanges = (original, updated) => {
            for (const key in updated) {
                if (editableFields.includes(key)) continue;

                if (typeof updated[key] === 'object' && updated[key] !== null && !(updated[key] instanceof Date)) {
                    if (hasNonEditableChanges(original[key] || {}, updated[key])) {
                        return true;
                    }
                } else if (JSON.stringify(original[key]) !== JSON.stringify(updated[key])) {
                    return true;
                }
            }
            return false;
        };

        const currentDate = new Date();
        if (updateData.campaignStartDate) {
            const newStartDate = new Date(updateData.campaignStartDate);
            if (newStartDate < currentDate && newStartDate.toISOString() !== campaign.campaignStartDate.toISOString()) {
                return res.status(400).json({
                    message: 'Cannot change start date after campaign has begun.'
                });
            }
        }

        if (updateData.campaignEndDate) {
            const newEndDate = new Date(updateData.campaignEndDate);
            if (newEndDate < currentDate) {
                return res.status(400).json({
                    message: 'Cannot set end date in the past.'
                });
            }
        }

        if (updateData.campaignBudget) {
            if (updateData.campaignBudget < campaign.amountSpent) {
                return res.status(400).json({
                    message: 'Budget cannot be reduced below the amount already spent.'
                });
            }
        }

        const logChanges = (original, updated, prefix = '') => {
            for (const key in updated) {
                const fullPath = prefix ? `${prefix}.${key}` : key;

                if (typeof updated[key] === 'object' && updated[key] !== null && !(updated[key] instanceof Date)) {
                    if (original && original[key] !== undefined && original[key] !== null) {
                        logChanges(original[key], updated[key], fullPath);
                    } else {
                        console.log(`New field added: ${fullPath}`, updated[key]);
                    }
                } else {
                    if (original === null || original[key] === undefined) {
                        console.log(`New field added: ${fullPath}`, updated[key]);
                    } else if (JSON.stringify(original[key]) !== JSON.stringify(updated[key])) {
                        console.log(`Field changed: ${fullPath}`);
                        console.log(`- Old value:`, original[key]);
                        console.log(`- New value:`, updated[key]);
                    }
                }
            }
        };

        logChanges(campaign.toObject(), updateData);

        if (updateData.quizQuestion && updateData.quizQuestion.optionStats) {
            for (const option of ['option1', 'option2', 'option3', 'option4']) {
                if (updateData.quizQuestion.optionStats[option]) {
                    if (campaign.quizQuestion.optionStats[option]?.demographics) {
                        updateData.quizQuestion.optionStats[option].demographics = {
                            ...campaign.quizQuestion.optionStats[option].demographics,
                            ...(updateData.quizQuestion.optionStats[option].demographics || {})
                        };
                    }
                }
            }
        }

        const requiresReapproval = hasNonEditableChanges(campaign.toObject(), updateData);

        Object.assign(campaign, updateData);

        if (requiresReapproval) {
            if (!['Active', 'Paused'].includes(campaign.status)) {
                campaign.status = 'Pending';
            }
        }

        const updatedCampaign = await campaign.save();

        res.status(200).json({
            message: 'Campaign updated successfully.',
            campaign: updatedCampaign,
            requiresReapproval: requiresReapproval
        });

    } catch (error) {
        console.error('Error updating campaign:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};

const processPaymentDeduction = async (campaignId) => {
    let client;
    try {
        client = await MongoClient.connect(process.env.MONGO_URI);
        const db = client.db();
        console.log("campaignId",campaignId);

        const campaign = await db.collection('campaigns').findOne({ _id: new ObjectId(campaignId) });
        console.log("campaign",campaign);

        if (!campaign) {
            throw new Error('Campaign not found');
        }

        // if (!campaign.cardDetail || !campaign.cardDetail.paymentMethodId) {
        //     throw new Error('No payment method associated with this campaign');
        // }

        const totalEngagements = campaign.engagements?.totalCount || 0;

        if (totalEngagements <= 0) {
            return {
                success: true,
                message: 'No engagements to charge',
                engagements: 0,
            };
        }

        if (campaign.campaignBudget < totalEngagements) {
            throw new Error(`Insufficient campaign budget. Required: ${totalEngagements}, Available: ${campaign.campaignBudget}`);
        }

        let customerId = campaign.cardDetail.customerId;
        const paymentMethodId = campaign.cardDetail.paymentMethodId;

        if (!customerId) {
            const customer = await stripe.customers.create({
                payment_method: paymentMethodId,
                invoice_settings: {
                    default_payment_method: paymentMethodId
                }
            });
            customerId = customer.id;

            await db.collection('campaigns').updateOne(
                { _id: campaign._id },
                { $set: { 'cardDetail.customerId': customerId } }
            );
        }

        const paymentIntent = await stripe.paymentIntents.create({
            amount: totalEngagements * 100,
            currency: 'usd',
            customer: customerId,
            payment_method: paymentMethodId,
            confirm: true,
            description: `Final charge for ${totalEngagements} engagements on ${campaign.campaignTitle}`,
            metadata: {
                campaignId: campaign._id.toString(),
                userId: campaign.userId,
                type: 'final_payment'
            },
            off_session: true,
        });

        await db.collection('campaigns').updateOne(
            { _id: campaign._id },
            {
                $inc: { campaignBudget: -totalEngagements },
                $push: {
                    paymentHistory: {
                        date: new Date(),
                        amount: totalEngagements,
                        status: 'success',
                        stripeChargeId: paymentIntent.id,
                        type: 'final_payment',
                        description: `Final payment for completed campaign`
                    },
                },
            }
        );

        return {
            success: true,
            message: 'Final payment processed successfully',
            paymentIntentId: paymentIntent.id,
            amount: totalEngagements,
            remainingBudget: campaign.campaignBudget - totalEngagements,
        };

    } catch (error) {
        console.error('Final payment error:', error);
        throw error;
    } finally {
        if (client) client.close();
    }
};

exports.campaignStatusUpdate = async (req, res) => {
    try {
        const { status, id, rejectionReason, to } = req.body;

        if (!status || !id) {
            return res.status(400).json({
                success: false,
                message: 'Status and campaign ID are required',
                code: 'MISSING_REQUIRED_FIELDS'
            });
        }

        const currentCampaign = await Compaign.findById(id);

        if (!currentCampaign) {
            return res.status(404).json({
                success: false,
                message: 'Campaign not found',
                code: 'CAMPAIGN_NOT_FOUND'
            });
        }

        if (currentCampaign.status === status) {
            return res.status(200).json({
                success: true,
                message: 'No status change detected',
                campaign: currentCampaign
            });
        }

        const updateData = {
            status,
            updatedAt: new Date()
        };

        if (status === 'Rejected') {
            updateData.reason = rejectionReason || 'Does not meet our guidelines';
        }

        const updatedCampaign = await Compaign.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        let paymentResult = null;
        if (status === 'Completed') {
            try {
                paymentResult = await processPaymentDeduction(id);
                console.log('Final payment processed:', paymentResult);
            } catch (paymentError) {
                console.error('Failed to process final payment:', paymentError);

                await Compaign.findByIdAndUpdate(
                    id,
                    {
                        status: currentCampaign.status,
                        updatedAt: new Date()
                    }
                );

                return res.status(400).json({
                    success: false,
                    message: 'Campaign completion failed due to payment error',
                    error: paymentError.message,
                    code: 'PAYMENT_PROCESSING_FAILED'
                });
            }
        }

        await sendStatusEmailNotification({
            newStatus: status,
            previousStatus: currentCampaign.status,
            campaign: updatedCampaign,
            userEmail: to,
            rejectionReason: status === 'Rejected' ? rejectionReason : undefined,
            paymentInfo: status === 'Completed' ? paymentResult : undefined
        });

        return res.status(200).json({
            success: true,
            message: `Campaign status updated to ${status}`,
            campaign: updatedCampaign,
            paymentResult: status === 'Completed' ? paymentResult : undefined
        });

    } catch (error) {
        console.error('Error updating campaign status:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            code: 'INTERNAL_SERVER_ERROR',
            ...(process.env.NODE_ENV === 'development' && { error: error.message })
        });
    }
};

exports.activeOrRejectCampaign = async (req, res) => {
    try {
        const { status, id, reason } = req.body;

        if (!status || (status !== "Active" && status !== "Rejected")) {
            return res.status(400).json({
                success: false,
                message: "Invalid status. Must be either 'Active' or 'Rejected'"
            });
        }

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Please provide a campaign ID"
            });
        }

        if (status === "Rejected" && !reason) {
            return res.status(400).json({
                success: false,
                message: "Reason is required when rejecting a campaign"
            });
        }

        const currentCampaign = await Compaign.findById(id);

        if (!currentCampaign) {
            return res.status(404).json({
                success: false,
                message: "Campaign not found"
            });
        }

        const user = await User.findOne({ userId: currentCampaign.userId });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        if (currentCampaign.status !== "Pending") {
            return res.status(400).json({
                success: false,
                message: "Only Pending campaigns can be activated or rejected"
            });
        }

        const updateFields = {
            status: status,
            updatedAt: new Date()
        };

        if (status === "Rejected") {
            updateFields.rejectionReason = reason;
        } else {
            updateFields.rejectionReason = null;
        }

        const updatedCampaign = await Compaign.findByIdAndUpdate(
            id,
            { $set: updateFields },
            { new: true, runValidators: true }
        );

        await sendStatusEmailNotification({
            newStatus: status,
            previousStatus: currentCampaign.status,
            campaign: updatedCampaign,
            userEmail: user.businessEmail,
            rejectionReason: reason
        });

        res.status(200).json({
            success: true,
            message: `Campaign status successfully updated to ${status}`,
            data: updatedCampaign
        });

    } catch (error) {
        console.error('Error updating campaign status:', error);
        res.status(500).json({
            success: false,
            message: "Error updating campaign status",
            error: error.message
        });
    }
}

const sendStatusEmailNotification = async ({
    newStatus,
    previousStatus,
    campaign,
    userEmail,
    rejectionReason
}) => {
    const emailTemplates = {
        Active: {
            subject: `Your Aditt Campaign Is Now Live 🎉`,
            template: 'campaign-activated',
            context: {
                header: 'Your Campaign Is Now Live!',
                body: `Great news — your campaign "${campaign.campaignTitle}" has been approved and is now live on Aditt!
Users can now start engaging with your content and driving results.
You can track performance and manage your campaign anytime in your dashboard.`,
                footer: 'Thanks for advertising with us — we\'re excited to have you on board.'
            }
        },
        Rejected: {
            subject: `Action Needed: Campaign Not Approved`,
            template: 'campaign-rejected',
            context: {
                header: 'Campaign Not Approved',
                body: `Unfortunately, your campaign "${campaign.campaignTitle}" was not approved due to the following reason:
${rejectionReason || 'Does not meet our guidelines'}

Please review our Aditt guidelines and update your campaign accordingly. Once resubmitted, we'll review it again promptly.`,
                footer: 'Need help? Reach out to us anytime — we\'re happy to assist.'
            }
        },
        Paused: {
            subject: `Your Aditt Campaign Has Been Paused`,
            template: 'campaign-paused',
            context: {
                header: 'Campaign Paused',
                body: `Your campaign "${campaign.campaignTitle}" has been paused.
${previousStatus === 'Active' ?
                        'You can resume it anytime from your dashboard.' :
                        'The campaign has been automatically paused by our system.'}`,
                footer: 'If you have any questions, we\'re just a message away.'
            }
        },
        Completed: {
            subject: `Your Aditt Campaign Has Ended`,
            template: 'campaign-completed',
            context: {
                header: 'Campaign Completed',
                body: `Your campaign "${campaign.campaignTitle}" has officially ended and is no longer active.
You can view performance metrics and engagement data in your dashboard.`,
                footer: 'Thanks for being part of the Aditt community!'
            }
        }
    };

    const templateConfig = emailTemplates[newStatus];
    if (!templateConfig) return;

    try {
        await sendEmail({
            to: userEmail,
            subject: templateConfig.subject,
            template: templateConfig.template,
            context: {
                ...templateConfig.context,
                supportEmail: 'support@aditt.com',
                companyName: 'Aditt',
                currentYear: new Date().getFullYear()
            }
        });
    } catch (emailError) {
        console.error('Failed to send status email:', emailError);
    }
};

exports.submitFeedback = async (req, res) => {
    try {
        const {
            userId,
            campaignId,
            conversion,
            conversionType,
            campaignRate,
            campaignFeedback,
        } = req.body;

        if (!userId || !campaignId || !conversion || !conversionType || !campaignRate || !campaignFeedback) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        const newFeedback = new CampaignFeedback({
            userId,
            campaignId,
            conversion,
            conversionType,
            campaignRate,
            campaignFeedback,
        });

        await newFeedback.save();

        res.status(201).json({ message: 'Feedback submitted successfully.' });
    } catch (error) {
        console.error('Error submitting feedback:', error);
        res.status(500).json({ message: 'Server error.' });
    }
};

exports.getPendingCampaign = async (req, res) => {
    try {
        const pendingCampaigns = await Compaign.find({ status: "Pending" });

        if (!pendingCampaigns || pendingCampaigns.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No pending campaigns found"
            });
        }

        res.status(200).json({
            success: true,
            count: pendingCampaigns.length,
            data: pendingCampaigns
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching pending campaigns",
            error: error.message
        });
    }
}

exports.getAllCampaign = async (req, res) => {
    try {
        await connectToDatabase();

        const campaigns = await Compaign.find({ status: { $ne: "Pending" } });

        res.status(200).json({
            success: true,
            data: campaigns,
            message: "Campaigns retrieved successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to retrieve campaigns",
            error: error.message
        });
    }
}

exports.getLatestPendingCampaign = async (req, res) => {
    try {
        const pendingCampaigns = await Compaign.find({ status: "Pending" })
            .sort({ createdAt: -1 })
            .limit(3);

        if (!pendingCampaigns || pendingCampaigns.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No pending campaigns found"
            });
        }

        res.status(200).json({
            success: true,
            count: pendingCampaigns.length,
            data: pendingCampaigns
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching pending campaigns",
            error: error.message
        });
    }
};

exports.deleteCampaignAgainstId = async (req, res) => {
    try {
        const { campaignId } = req.body;

        if (!campaignId) {
            return res.status(400).json({
                success: false,
                message: "Campaign ID is required"
            });
        }

        const existingCampaign = await Compaign.findById(campaignId);
        if (!existingCampaign) {
            return res.status(404).json({
                success: false,
                message: "Campaign not found"
            });
        }

        const deletedCampaign = await Compaign.findByIdAndDelete(campaignId);

        if (!deletedCampaign) {
            return res.status(500).json({
                success: false,
                message: "Failed to delete campaign"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Campaign deleted successfully",
            data: deletedCampaign
        });

    } catch (error) {
        console.error("Error deleting campaign:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
}

exports.verifyCardDetail = async (req, res) => {
    try {
        const { paymentMethodId } = req.body;

        const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId);

        if (!paymentMethod) {
            return res.status(400).json({
                success: false,
                message: 'Invalid payment method'
            });
        }

        let customerId = paymentMethod.customer;

        if (!customerId) {
            const customer = await stripe.customers.create({
                payment_method: paymentMethodId,
                invoice_settings: {
                    default_payment_method: paymentMethodId
                }
            });

            customerId = customer.id;

            await stripe.paymentMethods.attach(paymentMethodId, {
                customer: customerId
            });
        }

        return res.status(200).json({
            success: true,
            paymentMethodId: paymentMethod.id,
            customerId: customerId,
            cardDetails: {
                brand: paymentMethod.card.brand,
                last4: paymentMethod.card.last4,
                exp_month: paymentMethod.card.exp_month,
                exp_year: paymentMethod.card.exp_year
            },
            fingerprint: paymentMethod.card.fingerprint
        });

    } catch (error) {
        console.error('Payment verification error:', error);

        if (error.type === 'StripeCardError') {
            return res.status(400).json({
                success: false,
                message: 'Card verification failed',
                error: error.message
            });
        }

        return res.status(500).json({
            success: false,
            message: error.message || 'Payment verification failed'
        });
    }
};

exports.totalCampaignsStat = async (req, res) => {
    try {
        const { userId } = req.body;
        console.log("userId", userId);

        if (!userId) {
            return res.status(400).json({ success: false, message: "userId is required" });
        }

        const activeCampaigns = await Compaign.find({ userId: userId, status: "Active" });

        const totalBudget = activeCampaigns.reduce(
            (sum, campaign) => sum + (campaign.campaignBudget || 0),
            0
        );

        let totalSpent = 0;
        for (const campaign of activeCampaigns) {
            const totalEngagements = campaign.engagements?.totalCount || 0;
            if (totalEngagements === 0) continue;

            const [minutes, seconds] = (campaign.videoDuration || "0:0").split(":").map(Number);
            const videoLengthInSeconds = (minutes * 60) + (seconds || 0);

            const costPerEngagementInCents = videoLengthInSeconds + 5;
            const spentForCampaign = (totalEngagements * costPerEngagementInCents) / 100;

            totalSpent += spentForCampaign;

            console.log(
                `Campaign ${campaign._id}: engagements=${totalEngagements}, duration=${videoLengthInSeconds}s, spent=${spentForCampaign}`
            );
        }

        const totalRemaining = totalBudget - totalSpent;


        return res.status(200).json({
            success: true,
            totalBudget: Number(totalBudget.toFixed(2)),
            totalSpent: Number(totalSpent.toFixed(2)),
            totalRemaining: Number(totalRemaining.toFixed(2))
        });

    } catch (error) {
        console.error("❌ Error fetching campaign stats:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch campaign stats",
            error: error.message
        });
    }
};

