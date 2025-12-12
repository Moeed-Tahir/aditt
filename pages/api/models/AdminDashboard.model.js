import mongoose from 'mongoose';

const AdminDashboardSchema = new mongoose.Schema({
    totalCampaigns: {
        type: Number,
        default: 0
    },
    activeCampaigns: {
        type: Number,
        default: 0
    },
    pendingCampaigns: {
        type: Number,
        default: 0
    },
    completedCampaigns: {
        type: Number,
        default: 0
    },

    dailyEarnings: [{
        day: {
            type: String,
        },
        amount: {
            type: Number,
            default: 0
        },
        date: {
            type: Date
        }
    }],

    totalEarnings: {
        type: Number,
        default: 0
    },
    currentWeekEarnings: {
        type: Number,
        default: 0
    },
    lastWeekEarnings: {
        type: Number,
        default: 0
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    },
    userLimit: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const AdminDashboard = mongoose.models.AdminDashboard ||
    mongoose.model('AdminDashboard', AdminDashboardSchema);

export default AdminDashboard;