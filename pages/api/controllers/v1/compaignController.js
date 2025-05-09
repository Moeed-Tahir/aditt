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
            categories,
            campaignStartDate,
            campaignEndDate,
            cardDetail,
            bankDetail
        } = req.body;

        if (!campaignTitle || !websiteLink || !campaignVideoUrl || !companyLogo || 
            !genderType || !genderRatio || !age || !categories || 
            !campaignStartDate || !campaignEndDate ) {
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
            categories,
            campaignStartDate,
            campaignEndDate,
            cardDetail,
            bankDetail
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