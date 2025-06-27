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

module.exports = { getAdminDashboardData };