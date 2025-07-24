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
    user:  process.env.EMAIL_USER,
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
    let client;
    try {
        const { newUserLimit } = req.body;

        if (typeof newUserLimit !== 'number' || newUserLimit < 0) {
            return res.status(400).json({ message: 'Invalid user limit value' });
        }

        const dashboard = await AdminDashboard.findOneAndUpdate(
            {},
            { $set: { userLimit: newUserLimit } },
            { new: true }
        );

        if (!dashboard) {
            return res.status(404).json({ message: 'Dashboard not found' });
        }

        client = await MongoClient.connect(process.env.MONGO_URI);
        const db = client.db();

        const [activeCount, waitlistCount] = await Promise.all([
            db.collection('consumerusers').countDocuments({ status: 'active' }),
            db.collection('consumerusers').countDocuments({ status: 'waitlist' })
        ]);

        if (activeCount > newUserLimit) {
            const excess = activeCount - newUserLimit;
            const activeUsers = await db.collection('consumerusers')
                .find({ status: 'active' })
                .sort({ createdAt: -1 })
                .limit(excess)
                .toArray();

            await db.collection('consumerusers').updateMany(
                { _id: { $in: activeUsers.map(u => u._id) } },
                { $set: { status: 'waitlist' } }
            );
        } else if (activeCount < newUserLimit) {
            const needed = newUserLimit - activeCount;
            const waitlistUsers = await db.collection('consumerusers')
                .find({ status: 'waitlist' })
                .sort({ createdAt: 1 })
                .limit(needed)
                .toArray();

            const usersWithEmails = waitlistUsers.filter(user => user.email);

            await db.collection('consumerusers').updateMany(
                { _id: { $in: waitlistUsers.map(u => u._id) } },
                { $set: { status: 'active' } }
            );

            const welcomeEmailPromises = usersWithEmails.map(user => {
                const mailOptions = {
                    from: process.env.EMAIL_USER,
                    to: user.email,
                    subject: "You're In — Welcome to Aditt 🚀",
                    html: `
                        <p>Hello ${user.name || 'there'},</p>
                        <p>The wait is over — your Aditt account is now live!</p>
                        <p>Start earning real money for watching ads and helping brands grow.</p>
                        <p>Best regards,<br/>The Aditt Team</p>
                    `
                };

                return transporter.sendMail(mailOptions)
                    .catch(error => {
                        console.error(`Failed to send welcome email to ${user.email}:`, error);
                    });
            });

            await Promise.all(welcomeEmailPromises);
        }

        const [finalActive, finalWaitlist] = await Promise.all([
            db.collection('consumerusers').countDocuments({ status: 'active' }),
            db.collection('consumerusers').countDocuments({ status: 'waitlist' })
        ]);

        res.status(200).json({
            message: 'User statuses updated successfully',
            userLimit: newUserLimit,
            activeUsers: finalActive,
            waitlistUsers: finalWaitlist
        });

    } catch (error) {
        console.error('Update error:', error);
        res.status(500).json({
            message: 'Server error',
            error: error.message
        });
    } finally {
        if (client) await client.close();
    }
};

module.exports = { getAdminDashboardData, getUserLimit, updateUserLimit };