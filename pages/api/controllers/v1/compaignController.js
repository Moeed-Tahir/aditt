import { connectToDatabase } from '../../config/dbConnect';
import Compaign from '../../models/Campaign.model';
import CampaignFeedback from '../../models/CampaignFeedback';
import AdminDashboard from '../../models/AdminDashboard.model';
import Stripe from 'stripe';
import { getVideoDurationFromUrl } from '../../services/campaignServices';
const dotenv = require("dotenv");
dotenv.config();
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
      ageRange,
      campaignStartDate,
      campaignEndDate,
      cardDetail,
      bankDetail,
      couponCode,
      userId,
      campaignBudget,
      brandName,
      totalEngagementValue
    } = req.body;

    if (!campaignTitle || !websiteLink || !campaignVideoUrl || !brandName || 
        !genderType || !Array.isArray(ageRange) || ageRange.length !== 2 || 
        !campaignStartDate || !userId) {
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
      companyLogo: companyLogo || null,
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
      bankDetail: bankDetail || null,
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

  } catch (error) {
    console.error('Campaign creation error:', error);
    res.status(500).json({
      success: false,
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
        const { id, ...updateData } = req.body;
        console.log(JSON.stringify(updateData), "updateData");

        const campaign = await Compaign.findById(id);
        if (!campaign) {
            return res.status(404).json({ message: 'Campaign not found.' });
        }

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

        Object.assign(campaign, updateData);
        
        const updatedCampaign = await campaign.save();

        res.status(200).json({
            message: 'Campaign updated successfully.',
            campaign: updatedCampaign
        });

    } catch (error) {
        console.error('Error updating campaign:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};

exports.campaignStatusUpdate = async (req, res) => {
    try {
        const { status, id } = req.body;

        if (!status) {
            return res.status(400).json({ message: 'Status is required.' });
        }

        const updatedCampaign = await Compaign.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!updatedCampaign) {
            return res.status(404).json({ message: 'Campaign not found.' });
        }

        res.status(200).json({ message: 'Campaign status updated.', campaign: updatedCampaign });
    } catch (error) {
        console.error('Error updating campaign status:', error);
        res.status(500).json({ message: 'Internal server error.' });
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

        const updateFields = {
            status: status,
            updatedAt: new Date()
        };

        if (status === "Rejected") {
            updateFields.reason = reason;
        } else {
            updateFields.reason = null;
        }

        const updatedCampaign = await Compaign.findOneAndUpdate(
            {
                _id: id,
                status: "Pending"
            },
            {
                $set: updateFields
            },
            { new: true }
        );

        if (!updatedCampaign) {
            return res.status(404).json({
                success: false,
                message: "Campaign not found or not in Pending status"
            });
        }

        res.status(200).json({
            success: true,
            message: `Campaign status successfully updated to ${status}`,
            data: updatedCampaign
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error updating campaign status",
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