import mongoose from 'mongoose';

const UserChatSupportSchema = new mongoose.Schema({
    userId: {
        type: String,
        require: true,
    },
    queryTitle: {
        type: String,
        require: true,
    },
    queryDetail: {
        type: String,
        require: true,

    },
}, { timestamps: true });

const UserChatSupport = mongoose.models.UserChatSupport || mongoose.model('UserChatSupport', UserChatSupportSchema);

export default UserChatSupport;