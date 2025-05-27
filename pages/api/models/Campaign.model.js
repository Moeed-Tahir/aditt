import mongoose from 'mongoose';

const QuestionSchema = new mongoose.Schema({
    questionText: {
        type: String,
        required: false,
        trim: true
    },
    option1: {
        type: String,
        required: false,
        trim: true,
        totalCount: {
            type: Number,
            required: false,
            default: 0
        },
    },
    option2: {
        type: String,
        required: false,
        trim: true,
        totalCount: {
            type: Number,
            required: false,
            default: 0
        },
    },
    option3: {
        type: String,
        required: false,
        trim: true,
        totalCount: {
            type: Number,
            required: false,
            default: 0
        },
    },
    option4: {
        type: String,
        required: false,
        trim: true,
        totalCount: {
            type: Number,
            required: false,
            default: 0
        },
    },
    answer: {
        type: String,
        required: false,
        trim: true
    }
});

const SurveyQuestionSchema = new mongoose.Schema({
    questionText: {
        type: String,
        required: false,
        trim: true
    },
    option1: {
        type: String,
        required: false,
        trim: true,
        totalCount: {
            type: Number,
            required: false,
            default: 0
        },
    },
    option2: {
        type: String,
        required: false,
        trim: true,
        totalCount: {
            type: Number,
            required: false,
            default: 0
        },
    },
    option3: {
        type: String,
        required: false,
        trim: true,
        totalCount: {
            type: Number,
            required: false,
            default: 0
        },
    },
    option4: {
        type: String,
        required: false,
        trim: true,
        totalCount: {
            type: Number,
            required: false,
            default: 0
        },
    }
});

const CardDetailSchema = new mongoose.Schema({
    cardNumber: {
        type: String,
        required: false,
    },
    cvc: {
        type: String,
        required: false,
    },
    nameOnCard: {
        type: String,
        required: false,
        trim: true
    },
    dateOnCard: {
        type: String,
        required: false,
        trim: true
    },
    country: {
        type: String,
        required: false,
        trim: true
    },
    zip: {
        type: String,
        required: false,
        trim: true
    }
});

const BankDetailSchema = new mongoose.Schema({
    accountNumber: {
        type: String,
        required: false,
    },
    routingNumber: {
        type: String,
        required: false,
    },
    accountType: {
        type: String,
        required: false,
    },
});

const CompaignSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    campaignTitle: {
        type: String,
        required: true,
    },
    brandName: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: false,
        default: "Pending"
    },
    websiteLink: {
        type: String,
        required: true,
    },
    campaignVideoUrl: {
        type: String,
        required: true,
        unique: true,
    },
    companyLogo: {
        type: String,
        required: false,
    },
    quizQuestion: {
        type: QuestionSchema,
        require: true,
    },
    surveyQuestion1: {
        type: SurveyQuestionSchema,
        require: false,

    },
    surveyQuestion2: {
        type: SurveyQuestionSchema,
        require: false,

    },
    genderType: {
        type: String,
        required: true,
    },
    genderRatio: {
        type: String,
        required: true,
    },
    ageRange: {
        type: [Number],
        required: false,
    },
    campaignStartDate: {
        type: String,
        required: true,
    },
    campaignEndDate: {
        type: String,
    },
    cardDetail: {
        type: CardDetailSchema,
    },
    bankDetail: {
        type: BankDetailSchema,
    },
    couponCode: {
        type: String,
        required: false,
    },
    campaignBudget: {
        type: String,
        required: false,
    },
    totalViews: {
        type: Number,
        required: false,
        default: 0
    },
    impressions: {
        type: Number,
        required: false,
        default: 0
    },
    engagements: {
        totalCount: {
            type: Number,
            required: false,
            default: 0
        },
        countData: {
            type: String,
            required: false
        }
    },
    clickCount: {
        totalCount: {
            type: Number,
            required: false,
            default: 0
        },
        dailyCounts: [{
            date: {
                type: Date,
                required: false
            },
            count: {
                type: Number,
                required: false,
                default: 0
            }
        }]
    }
}, { timestamps: true });

const Compaign = mongoose.models.Compaign || mongoose.model('Compaign', CompaignSchema);

export default Compaign;