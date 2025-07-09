import { connectToDatabase } from '../../config/dbConnect';
import AdminUser from '../../models/AdminUser.model';
import User from '../../models/User.model';
import { sendUserEmail } from '../../services/emailServices';

async function initializeAdminSettings() {
    const allUsers = await User.find({}).select('_id').lean();
    
    const adminSettings = new AdminUser({
        activeUsers: allUsers.map(user => user._id),
        waitlistUsers: [], 
        activeUserLimit: 1000
    });
    
    await adminSettings.save();
    return adminSettings;
}

export const getAllUsersController = async (req, res) => {
    try {
        await connectToDatabase();

        let adminSettings = await AdminUser.findOne({});
        if (!adminSettings) {
            adminSettings = await initializeAdminSettings();
        }

        const allUsers = await User.find({})
            .select('userId name companyName businessEmail businessWebsite profileType')
            .lean();

        const activeUsers = allUsers.filter(user =>
            adminSettings.activeUsers.some(id => id.equals(user._id))
        );
        const waitlistUsers = allUsers.filter(user =>
            adminSettings.waitlistUsers.some(id => id.equals(user._id))
        );

        res.status(200).json({
            success: true,
            data: {
                activeUsers,
                waitlistUsers,
                activeUserLimit: adminSettings.activeUserLimit,
                currentActiveCount: activeUsers.length,
                currentWaitlistCount: waitlistUsers.length,
                allUsers
            }
        });

    } catch (error) {
        console.error('Error in getAllUsersController:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch users',
            error: error.message
        });
    }
};

export const updateActiveUserLimitController = async (req, res) => {
    try {
        await connectToDatabase();
        const { newLimit } = req.body;

        if (typeof newLimit !== 'number' || newLimit < 0) {
            return res.status(400).json({
                success: false,
                message: 'Valid newLimit is required (must be a positive number)'
            });
        }

        let adminSettings = await AdminUser.findOne({});
        if (!adminSettings) {
            adminSettings = await initializeAdminSettings();
        }

        const allUsers = await User.find({}).lean();

        const previousLimit = adminSettings.activeUserLimit;
        adminSettings.activeUserLimit = newLimit;

        if (newLimit > previousLimit) {
            const availableSlots = newLimit - adminSettings.activeUsers.length;
            const usersToPromote = adminSettings.waitlistUsers.splice(0, availableSlots);
            
            for (const userId of usersToPromote) {
                const user = allUsers.find(u => u._id.equals(userId));
                if (user && user.businessEmail) {
                    const emailSubject = 'Your Account Has Been Activated!';
                    const emailBody = `
                        <h1>Welcome to Our Platform!</h1>
                        <p>Dear ${user.name || 'Valued User'},</p>
                        <p>Great news! Your account has been activated.</p>
                        <p>You can now log in and start using all the features of our platform.</p>
                        <p><a href="${process.env.FRONTEND_URL}/login">Click here to login</a></p>
                        <p>If you have any questions, please contact our support team.</p>
                        <p>Best regards,<br/>The Team</p>
                    `;

                    await sendUserEmail({
                        to: user.businessEmail,
                        subject: emailSubject,
                        html: emailBody
                    });
                }
            }
            
            adminSettings.activeUsers.push(...usersToPromote);
        } else if (newLimit < previousLimit) {
            const excessUsers = adminSettings.activeUsers.splice(newLimit);
            
            for (const userId of excessUsers) {
                const user = allUsers.find(u => u._id.equals(userId));
                if (user && user.businessEmail) {
                    const emailSubject = 'You\'re on the Waitlist!';
                    const emailBody = `
                        <h1>Welcome to Our Platform!</h1>
                        <p>Dear ${user.name || 'Valued User'},</p>
                        <p>Thank you for joining our platform. You're currently on our waitlist.</p>
                        <p>We'll notify you as soon as your account is activated.</p>
                        <p>In the meantime, feel free to explore our website.</p>
                        <p>Best regards,<br/>The Team</p>
                    `;

                    await sendUserEmail({
                        to: user.businessEmail,
                        subject: emailSubject,
                        html: emailBody
                    });
                }
            }
            
            adminSettings.waitlistUsers.unshift(...excessUsers);
        }

        await adminSettings.save();

        const activeUsers = allUsers.filter(user =>
            adminSettings.activeUsers.some(id => id.equals(user._id))
        );
        const waitlistUsers = allUsers.filter(user =>
            adminSettings.waitlistUsers.some(id => id.equals(user._id))
        );

        res.status(200).json({
            success: true,
            message: 'Active user limit updated successfully',
            data: {
                activeUserLimit: adminSettings.activeUserLimit,
                activeUsers,
                waitlistUsers,
                currentActiveCount: activeUsers.length,
                currentWaitlistCount: waitlistUsers.length
            }
        });

    } catch (error) {
        console.error('Error in updateActiveUserLimitController:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update active user limit',
            error: error.message
        });
    }
};