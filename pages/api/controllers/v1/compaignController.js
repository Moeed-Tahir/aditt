import connectToDatabase from '../../config/dbConnect';
import Compaign from '../../models/Campaign.model';
import Stripe from 'stripe';
const dotenv = require("dotenv");
dotenv.config();
const ffmpeg = require('fluent-ffmpeg');

const getVideoDurationFromUrl = (videoUrl) => {
    return new Promise((resolve, reject) => {
        ffmpeg.ffprobe(videoUrl, (err, metadata) => {
            if (err) return reject(err);
            const duration = metadata.format.duration;
            resolve(duration);
        });
    });
};

const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);
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
            age,
            campaignStartDate,
            campaignEndDate,
            cardDetail,
            bankDetail,
            couponCode,
            userId,
            campaignBudget
        } = req.body;

        if (!campaignTitle || !websiteLink || !campaignVideoUrl ||
            !genderType ||
            !campaignStartDate || !campaignEndDate || !userId) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const newCampaign = new Compaign({
            campaignTitle,
            websiteLink,
            campaignVideoUrl,
            companyLogo,
            quizQuestion,
            surveyQuestion1,
            surveyQuestion2,
            genderType,
            genderRatio,
            age,
            campaignStartDate,
            campaignEndDate,
            cardDetail,
            bankDetail,
            couponCode,
            userId,
            campaignBudget
        });

        const savedCampaign = await newCampaign.save();

        res.status(201).json({
            message: 'Campaign created successfully',
            campaign: savedCampaign
        });

    } catch (error) {
        console.error('Error creating campaign:', error);

        res.status(500).json({
            message: 'Failed to create campaign',
            error: error.message
        });
    }
};

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
