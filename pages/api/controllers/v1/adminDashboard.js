import { connectToDatabase } from '../../config/dbConnect';
import AdminDashboard from '../../models/AdminDashboard.model';

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
        const dashboard = await AdminDashboard.findOne();
        if (!dashboard) {
            return res.status(404).json({ message: 'Dashboard data not found' });
        }
        console.log("dashboard",dashboard);
        
        res.status(200).json({ userLimit: dashboard.userLimit });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

const updateUserLimit = async (req, res) => {
    try {
        const { newUserLimit } = req.body;

        if (!newUserLimit || isNaN(newUserLimit)) {
            return res.status(400).json({ message: 'Invalid user limit value' });
        }

        const dashboard = await AdminDashboard.findOne();
        if (!dashboard) {
            return res.status(404).json({ message: 'Dashboard data not found' });
        }

        dashboard.userLimit = newUserLimit;
        await dashboard.save();

        res.status(200).json({ message: 'User limit updated successfully', userLimit: dashboard.userLimit });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};


module.exports = { getAdminDashboardData,getUserLimit,updateUserLimit };