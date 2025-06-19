import mongoose from 'mongoose';

const QuestionSchema = new mongoose.Schema({
    questionText: {
        type: String,
        required: false,
        trim: true
    },
    option1: {
        optionValue: {
            type: String,
            required: false,
            trim: true
        },
        totalCount: {
            type: Number,
            required: false,
            default: 0
        },
    },
    option2: {
        optionValue: {
            type: String,
            required: false,
            trim: true
        },
        totalCount: {
            type: Number,
            required: false,
            default: 0
        },
    },
    option3: {
        optionValue: {
            type: String,
            required: false,
            trim: true
        },
        totalCount: {
            type: Number,
            required: false,
            default: 0
        },
    },
    option4: {
       optionValue: {
            type: String,
            required: false,
            trim: true
        },
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
    },
    demographicStats: {
        type: {
            ageGroups: {
                age18_24: {
                    male: { type: Number, default: 0 },
                    female: { type: Number, default: 0 },
                    other: { type: Number, default: 0 }
                },
                age25_33: {
                    male: { type: Number, default: 0 },
                    female: { type: Number, default: 0 },
                    other: { type: Number, default: 0 }
                },
                age35_44: {
                    male: { type: Number, default: 0 },
                    female: { type: Number, default: 0 },
                    other: { type: Number, default: 0 }
                },
                age45Plus: {
                    male: { type: Number, default: 0 },
                    female: { type: Number, default: 0 },
                    other: { type: Number, default: 0 }
                }
            }
        },
        required: false
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
    },
    countStats: {
        // totalcount : {
        //     [{
        //         countmymaleofage1: Number,
        //         countmyfemalemaleofage1: Number,
        //         countmyotherofage1: Number,
        //         countmymaleofage2: Number,
        //         countmyfemalemaleofage2: Number,
        //         countmyotherofage2: Number,
        //         countmymaleofage3: Number,
        //         countmyfemalemaleofage3: Number,
        //         countmyotherofage3: Number,
        //         countmymaleofage4: Number,
        //         countmyfemalemaleofage4: Number,
        //         countmyotherofage4: Number,
        //     }]
        // }
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
    reason: {
        type: String,
        required: function () { return this.status === "Rejected"; }
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
    videoWatchTime: {
        type: Number,
        required: false,
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