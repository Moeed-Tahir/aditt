import mongoose from 'mongoose';

const CampaignFeedbackSechema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    campaignId: {
        type: String,
        required: true,
    },
    conversion: {
        type: String,
        required: true,
    },
    conversionType: {
        type: String,
        required: true,
    },
    campaignRate: {
        type: Number,
        required: true,
    },
    campaignFeedback: {
        type: String,
        required: true,
    },
}, { timestamps: true });

const CampaignFeedback = mongoose.models.CampaignFeedback || mongoose.model('CampaignFeedback', CampaignFeedbackSechema);

export default CampaignFeedback;