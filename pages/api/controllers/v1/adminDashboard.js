import { connectToDatabase } from '../../config/dbConnect';
import AdminDashboard from '../../models/AdminDashboard.model';
const { MongoClient } = require('mongodb');
const nodemailer = require('nodemailer');
const dotenv = require("dotenv");
dotenv.config();

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

const getAdminDashboardData = async (req, res) => {
    try {
        await connectToDatabase();

        let dashboardData = await AdminDashboard.findOne({});

        if (!dashboardData) {
            dashboardData = await AdminDashboard.create({
                totalCampaigns: 0,
                activeCampaigns: 0,
                pausedCampaigns: 0,
                completedCampaigns: 0,
                dailyEarnings: [
                    { day: 'Mo', amount: 0, date: new Date() },
                    { day: 'Tu', amount: 0, date: new Date() },
                    { day: 'We', amount: 0, date: new Date() },
                    { day: 'Th', amount: 0, date: new Date() },
                    { day: 'Fr', amount: 0, date: new Date() },
                    { day: 'Sa', amount: 0, date: new Date() },
                    { day: 'Su', amount: 0, date: new Date() }
                ],
                totalEarnings: 0,
                currentWeekEarnings: 0,
                lastWeekEarnings: 0
            });
        }

        res.status(200).json({ message: "Admin Dashboard Data Fetched Successfully", dashboardData });

    } catch (error) {
        console.error('Error fetching admin dashboard data:', error);
        res.status(500).json({
            error: 'An error occurred while fetching dashboard data',
            details: error.message
        });
    }
}

const getUserLimit = async (req, res) => {
    try {
        await connectToDatabase();

        const dashboard = await AdminDashboard.findOne();
        if (!dashboard) {
            return res.status(404).json({ message: 'Dashboard data not found' });
        }

        res.status(200).json({ userLimit: dashboard.userLimit });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

const updateUserLimit = async (req, res) => {
    try {
        await connectToDatabase();

        const { userLimit } = req.body;

        if (typeof userLimit !== 'boolean') {
            return res.status(400).json({ 
                message: 'Invalid user limit value. Must be true or false' 
            });
        }

        const currentDashboard = await AdminDashboard.findOne({});
        if (!currentDashboard) {
            return res.status(404).json({ message: 'Dashboard not found' });
        }

        const dashboard = await AdminDashboard.findOneAndUpdate(
            {},
            { $set: { userLimit: userLimit } },
            { new: true }
        );

        res.status(200).json({
            message: `User limit ${userLimit ? 'enabled' : 'disabled'} successfully`,
            userLimit: userLimit
        });

    } catch (error) {
        console.error('Update error:', error);
        res.status(500).json({
            message: 'Server error',
            error: error.message
        });
    }
};

module.exports = { getAdminDashboardData, getUserLimit, updateUserLimit };