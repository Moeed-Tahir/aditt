import mongoose from 'mongoose';
const generateRandomId = () => Math.random().toString(36).substr(2, 9);

const UserSchema = new mongoose.Schema({
    userId: {
        type: String,
        default: generateRandomId,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: false,
    },
    companyName: {
        type: String,
        required: false,
    },
    brandName: {
        type: String,
        required: false,
    },
    businessWebsite: {
        type: String,
        required: false,
    },
    profileType: {
        type: String,
    },
    businessEmail: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    otp: {
        type: String,
        trim: true,
    },
    otpExpires: {
        type: Date,
        default: Date.now,
        expires: '5m'
    },
    isOtpVerified: {
        type: Boolean,
        default: false
    },
    deletionRequest: {
        requested: {
            type: Boolean,
            default: false
        },
        status: {
            type: String,
            enum: ['pending', 'approved', 'rejected', null],
            default: null
        },
        requestedAt: {
            type: Date
        },
        processedAt: {
            type: Date
        },
        processedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    }
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', UserSchema);

export default User;