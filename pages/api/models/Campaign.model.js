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
        // clickCount: 0
    },
    option2: {
        type: String,
        required: false,
        trim: true,
        // clickCount: 0
    },
    option3: {
        type: String,
        required: false,
        trim: true,
        // clickCount: 0
    },
    option4: {
        type: String,
        required: false,
        trim: true,
        // clickCount: 0
    },
    answer: {
        type: String,
        required: false,
        trim: true
    }
});

const CardDetailSchema = new mongoose.Schema({
    cardNumber: {
        type: String,
        required: true,
    },
    cvc: {
        type: String,
        required: true,
    },
    nameOnCard: {
        type: String,
        required: true,
        trim: true
    },
    dateOnCard: {
        type: String,
        required: true,
        trim: true
    },
    country: {
        type: String,
        required: true,
        trim: true
    },
    zip: {
        type: String,
        required: true,
        trim: true
    }
});

const BankDetailSchema = new mongoose.Schema({
    accountNumber: {
        type: String,
        required: true,
    },
    routingNumber: {
        type: String,
        required: true,
    },
    accountType: {
        type: String,
        required: true,
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
        require: false,
    },
    surveyQuestion1: {
        type: QuestionSchema,
        require: false,

    },
    surveyQuestion2: {
        type: QuestionSchema,
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
    age: {
        type: String,
        required: true,
    },
    campaignStartDate: {
        type: String,
        required: true,
    },
    campaignEndDate: {
        type: String,
        required: true,
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
}, { timestamps: true });

const Compaign = mongoose.models.Compaign || mongoose.model('Compaign', CompaignSchema);

export default Compaign;