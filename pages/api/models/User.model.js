const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    businessWebsite: {
        type: String,
        required: true,
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
    }
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);

export default User;