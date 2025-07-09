import mongoose from 'mongoose';

const VideoWatchTimeSchema = new mongoose.Schema({
    seconds: {
        type: Number,
        required: true
    },
    count: {
        type: Number,
        default: 1
    }
}, { _id: false });

const OptionStatsSchema = new mongoose.Schema({
    totalCount: {
        type: Number,
        default: 0
    },
    demographics: {
        age18_24: { male: { type: Number, default: 0 }, female: { type: Number, default: 0 }, other: { type: Number, default: 0 } },
        age25_33: { male: { type: Number, default: 0 }, female: { type: Number, default: 0 }, other: { type: Number, default: 0 } },
        age35_44: { male: { type: Number, default: 0 }, female: { type: Number, default: 0 }, other: { type: Number, default: 0 } },
        age45Plus: { male: { type: Number, default: 0 }, female: { type: Number, default: 0 }, other: { type: Number, default: 0 } }
    }
}, { _id: false });

const SurveyOptionStatsSchema = new mongoose.Schema({
    totalCount: {
        type: Number,
        default: 0
    },
}, { _id: false });

const QuestionSchema = new mongoose.Schema({
    questionText: {
        type: String,
        required: true,
        trim: true
    },
    option1: {
        type: String,
        required: true,
        trim: true
    },
    option2: {
        type: String,
        required: true,
        trim: true
    },
    option3: {
        type: String,
        required: true,
        trim: true
    },
    option4: {
        type: String,
        required: true,
        trim: true
    },
    answer: {
        type: String,
        required: true,
        trim: true
    },
    optionStats: {
        option1: { type: OptionStatsSchema, default: () => ({}) },
        option2: { type: OptionStatsSchema, default: () => ({}) },
        option3: { type: OptionStatsSchema, default: () => ({}) },
        option4: { type: OptionStatsSchema, default: () => ({}) }
    }
}, { _id: true });

const SurveyQuestionSchema = new mongoose.Schema({
    questionText: {
        type: String,
        required: false,
        trim: true
    },
    option1: {
        type: String,
        required: false,
        trim: true
    },
    option2: {
        type: String,
        required: false,
        trim: true
    },
    option3: {
        type: String,
        required: false,
        trim: true
    },
    option4: {
        type: String,
        required: false,
        trim: true
    },
    optionStats: {
        option1: { type: SurveyOptionStatsSchema, default: () => ({}) },
        option2: { type: SurveyOptionStatsSchema, default: () => ({}) },
        option3: { type: SurveyOptionStatsSchema, default: () => ({}) },
        option4: { type: SurveyOptionStatsSchema, default: () => ({}) }
    }
}, { _id: true });

const CardDetailSchema = new mongoose.Schema({
    cardNumber: {
        type: String,
        required: false,
        default: ""
    },
    cvc: {
        type: String,
        required: false,
        default: ""
    },
    nameOnCard: {
        type: String,
        required: false,
        default: "",
        trim: true
    },
    dateOnCard: {
        type: String,
        required: false,
        default: "",
        trim: true
    },
    country: {
        type: String,
        required: false,
        default: "",
        trim: true
    },
    zip: {
        type: String,
        required: false,
        default: "",
        trim: true
    }
}, { _id: true });

const BankDetailSchema = new mongoose.Schema({
    accountNumber: {
        type: String,
        required: false,
        default: ""
    },
    routingNumber: {
        type: String,
        required: false,
        default: ""
    },
    accountType: {
        type: String,
        required: false,
        default: ""
    }
}, { _id: true });

const EngagementSchema = new mongoose.Schema({
    totalCount: {
        type: Number,
        default: 0
    },
    totalEngagementValue: {
        type: Number,
        default: 0
    },
    dailyCounts: {
        type: [{
            date: {
                type: Date,
                required: true
            },
            count: {
                type: Number,
                default: 0
            }
        }],
        default: []
    }
}, { _id: false });

const ClickCountSchema = new mongoose.Schema({
    totalCount: {
        type: Number,
        default: 0
    },
    dailyCounts: {
        type: [{
            date: Date,
            count: {
                type: Number,
                default: 0
            }
        }],
        default: []
    }
}, { _id: false });

const CampaignSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    campaignTitle: {
        type: String,
        required: true
    },
    brandName: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: "Pending"
    },
    reason: {
        type: String,
        required: function () { return this.status === "Rejected"; }
    },
    websiteLink: {
        type: String,
        required: true
    },
    campaignVideoUrl: {
        type: String,
        required: true,
        unique: true
    },
    companyLogo: {
        type: String,
        required: false
    },
    quizQuestion: {
        type: QuestionSchema,
        required: true
    },
    surveyQuestion1: {
        type: SurveyQuestionSchema,
        required: false
    },
    surveyQuestion2: {
        type: SurveyQuestionSchema,
        required: false
    },
    genderType: {
        type: String,
        required: true
    },
    genderRatio: {
        type: String,
        required: true
    },
    ageRange: {
        type: [Number],
        required: true,
        validate: {
            validator: function (arr) {
                return arr.length === 2 && arr[0] < arr[1];
            },
            message: props => `Age range must contain exactly 2 numbers (min and max)`
        }
    },
    campaignStartDate: {
        type: Date,
        required: true
    },
    campaignEndDate: {
        type: Date,
        required: false
    },
    cardDetail: {
        type: CardDetailSchema,
        default: () => ({})
    },
    bankDetail: {
        type: BankDetailSchema,
        default: () => ({})
    },
    couponCode: {
        type: String,
        default: ""
    },
    campaignBudget: {
        type: Number,
        default: 0
    },
    totalViews: {
        type: Number,
        default: 0
    },
    impressions: {
        type: Number,
        default: 0
    },
    engagements: {
        type: EngagementSchema,
        default: () => ({})
    },
    videoWatchTime: {
        type: [VideoWatchTimeSchema],
        default: []
    },
    clickCount: {
        type: ClickCountSchema,
        default: () => ({})
    },
    videoVerified: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const Campaign = mongoose.models.Campaign || mongoose.model('Campaign', CampaignSchema);

export default Campaign;