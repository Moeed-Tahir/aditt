import connectToDatabase from '../../config/dbConnect';
import Compaign from '../../models/Campaign.model';

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

        if (!campaignTitle || !websiteLink || !campaignVideoUrl || !companyLogo ||
            !genderType || !genderRatio || !age ||
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