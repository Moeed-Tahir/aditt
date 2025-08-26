const bcrypt = require("bcrypt");
import User from '../../models/User.model';
import Campaign from '../../models/Campaign.model';
import { sendApprovedIdentityEmail, sendRejectedIdentityEmail } from '../../services/emailServices';
const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');
const { generateOTP, sendOTP } = require("../../services/otpServices");
const jwt = require("jsonwebtoken");
const { getConsumerUsersCollection, connectToDatabase } = require("../../config/dbConnect");
const { MongoClient } = require('mongodb');
const dotenv = require("dotenv");
dotenv.config();

export const signUp = async (req, res) => {
    try {
        await connectToDatabase();

        const { name, businessWebsite, businessEmail, password } = req.body;

        if (!name || !businessWebsite || !businessEmail || !password) {
            return res.status(400).json({
                message: "All fields are required",
                code: "VALIDATION_ERROR"
            });
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(businessEmail)) {
            return res.status(400).json({
                message: "Please enter a valid email address",
                code: "INVALID_EMAIL"
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                message: "Password must be at least 8 characters",
                code: "WEAK_PASSWORD"
            });
        }

        const existingUser = await User.findOne({ businessEmail });
        if (existingUser) {
            if (existingUser.isOtpVerified) {
                return res.status(400).json({
                    message: "An account with this email already exists. Please log in instead.",
                    code: "EMAIL_EXISTS"
                });
            } else {
                existingUser.otp = generateOTP();
                existingUser.otpExpires = Date.now() + 5 * 60 * 1000;
                await existingUser.save();
                await sendOTP(businessEmail, existingUser.otp);

                return res.status(200).json({
                    message: "We found an unverified account with this email. A new verification code has been sent.",
                    userId: existingUser._id,
                    code: "OTP_RESENT"
                });
            }
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const otp = generateOTP();

        const newUser = new User({
            name,
            businessWebsite,
            businessEmail,
            password: hashedPassword,
            otp,
            otpExpires: Date.now() + 5 * 60 * 1000,
            isOtpVerified: false
        });

        await newUser.save();
        await sendOTP(businessEmail, otp);

        const token = jwt.sign(
            { userId: newUser.userId },
            process.env.SECRET_KEY,
            { expiresIn: '1h' }
        );

        res.status(201).json({
            message: "Account created successfully! Please check your email for the verification code.",
            user: {
                userId: newUser.userId,
                name: newUser.name,
                email: newUser.businessEmail,
                website: newUser.businessWebsite,
            },
            token,
        });

    } catch (error) {
        console.error('[ERROR] Signup failed:', {
            message: error.message,
            stack: error.stack,
            fullError: error
        });

        res.status(500).json({
            message: "An unexpected error occurred. Please try again later.",
            code: "SERVER_ERROR"
        });
    }
};

export const verifyOTP = async (req, res) => {
    try {
        await connectToDatabase();
        const { userId, otp } = req.body;

        const user = await User.findOne({ userId });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.otp !== otp) {
            return res.status(400).json({
                message: "Invalid OTP",
                requiresResend: true
            });
        }

        if (user.otpExpires < Date.now()) {
            return res.status(400).json({
                message: "OTP has expired",
                requiresResend: true
            });
        }

        user.isOtpVerified = true;
        user.otp = null;
        user.otpExpires = null;
        await user.save();

        const token = jwt.sign(
            { userId: user._id },
            process.env.SECRET_KEY,
            { expiresIn: '1h' }
        );

        res.status(200).json({
            message: "OTP verified successfully",
            user: {
                userId: user._id,
                name: user.name,
                email: user.businessEmail,
                website: user.businessWebsite,
                role: user.role
            },
            token,
            role: user.role,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const signIn = async (req, res) => {
    try {
        await connectToDatabase();

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required",
                code: "MISSING_FIELDS"
            });
        }

        const user = await User.findOne({ businessEmail: email });

        if (!user) {
            return res.status(404).json({
                message: "User not found. Sign up to create an account.",
                code: "USER_NOT_FOUND"
            });
        }

        if (user.deletionRequest?.requested && user.deletionRequest?.status === 'pending') {
            return res.status(403).json({
                message: "Your account deletion is under process. Please contact support for more information.",
                code: "ACCOUNT_DELETION_PENDING"
            });
        }

        if (!user.isOtpVerified) {
            user.otp = generateOTP();
            user.otpExpires = Date.now() + 5 * 60 * 1000;
            await user.save();

            await sendOTP(email, user.otp);

            return res.status(403).json({
                message: "User not verified. Please check your email for the verification code.",
                code: "ACCOUNT_NOT_VERIFIED",
                userId: user._id,
                requiresVerification: true
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Invalid password. Please try again.",
                code: "INVALID_PASSWORD"
            });
        }

        const token = jwt.sign(
            { userId: user.userId },
            process.env.SECRET_KEY,
            { expiresIn: '1h' }
        );

        res.status(200).json({
            message: "Sign in successful",
            user: {
                userId: user.userId,
                name: user.name,
                email: user.businessEmail,
                website: user.businessWebsite,
                role: user.role
            },
            token
        });

    } catch (error) {
        console.error('[ERROR] Sign in failed:', error);
        res.status(500).json({
            message: "Server error during sign in",
            error: error.message
        });
    }
};

export const forgotPassword = async (req, res) => {
    try {
        await connectToDatabase();

        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                message: "Email is required",
                code: "EMAIL_REQUIRED"
            });
        }

        const user = await User.findOne({ businessEmail: email });

        if (!user) {
            return res.status(404).json({
                message: "User with this email not found",
                code: "USER_NOT_FOUND"
            });
        }

        user.otp = generateOTP();
        user.otpExpires = Date.now() + 5 * 60 * 1000;
        await user.save();

        await sendOTP(email, user.otp);

        res.status(200).json({
            message: "OTP sent to your email for password reset",
            userId: user.userId
        });

    } catch (error) {
        console.error('[ERROR] Forgot password failed:', error);
        res.status(500).json({
            message: "Server error during password reset",
            error: error.message
        });
    }
};

export const resetPassword = async (req, res) => {
    try {
        await connectToDatabase();

        const { userId, newPassword } = req.body;

        if (!userId || !newPassword) {
            return res.status(400).json({
                message: "User ID and new password are required",
                code: "MISSING_FIELDS"
            });
        }

        const user = await User.findOne({ userId: userId });

        if (!user) {
            return res.status(404).json({
                message: "User not found",
                code: "USER_NOT_FOUND"
            });
        }

        if (!user.isOtpVerified) {
            return res.status(400).json({
                message: "OTP not verified",
                code: "OTP_NOT_VERIFIED",
                requiresVerification: true
            });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.otp = null;
        user.otpExpires = null;
        user.isOtpVerified = true;
        await user.save();

        res.status(200).json({
            message: "Password reset successfully"
        });

    } catch (error) {
        console.error('[ERROR] Password reset failed:', error);
        res.status(500).json({
            message: "Server error during password reset",
            error: error.message
        });
    }
};

export const updateProfile = async (req, res) => {
    try {
        await connectToDatabase();
        const { userId, name, email, website, companyName, phone, currentPassword, newPassword, profileType } = req.body;

        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        const user = await User.findOne({ userId });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (currentPassword && newPassword) {
            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: "Current password is incorrect" });
            }
            user.password = await bcrypt.hash(newPassword, 10);
        }

        user.name = name || user.name;
        user.businessEmail = email || user.businessEmail;
        user.businessWebsite = website || user.businessWebsite;
        user.companyName = companyName || user.companyName;
        user.phone = phone || user.phone;
        user.profileType = profileType || user.profileType;

        await user.save();

        res.status(200).json({
            message: "Profile updated successfully",
            user: {
                name: user.name,
                email: user.businessEmail,
                website: user.businessWebsite,
                companyName: user.companyName,
                phone: user.phone,
                profileType: user.profileType,
            }
        });

    } catch (error) {
        console.error("[ERROR] Update failed:", error);
        res.status(500).json({ message: "Server error during update" });
    }
};

export const updatePassword = async (req, res) => {
    try {
        await connectToDatabase();

        const { userId, currentPassword, newPassword } = req.body;

        if (!userId || !currentPassword || !newPassword) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Current password is incorrect" });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        return res.status(200).json({ message: "Password updated successfully" });

    } catch (error) {
        console.error("[ERROR] Password update failed:", error);
        res.status(500).json({ message: "Server error during password update" });
    }
};

export const deleteAccount = async (req, res) => {
    try {
        await connectToDatabase();

        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({
                message: "User ID is required",
                code: "USER_ID_REQUIRED"
            });
        }

        const user = await User.findOneAndDelete({ userId });


        if (!user) {
            return res.status(404).json({
                message: "User not found",
                code: "USER_NOT_FOUND"
            });
        }

        res.status(200).json({
            message: "Account deleted successfully"
        });

    } catch (error) {
        console.error('[ERROR] Account deletion failed:', error);
        res.status(500).json({
            message: "Server error during account deletion",
            error: error.message
        });
    }
};

export const resendOTP = async (req, res) => {
    try {
        await connectToDatabase();

        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({
                message: "User ID is required",
                code: "USER_ID_REQUIRED"
            });
        }

        const user = await User.findOne({ userId });

        if (!user) {
            return res.status(404).json({
                message: "User not found",
                code: "USER_NOT_FOUND"
            });
        }

        user.otp = generateOTP();
        user.otpExpires = Date.now() + 5 * 60 * 1000;
        await user.save();

        await sendOTP(user.businessEmail, user.otp);

        res.status(200).json({
            message: "OTP resent successfully",
            userId: user.userId
        });

    } catch (error) {
        console.error('[ERROR] Resend OTP failed:', error);
        res.status(500).json({
            message: "Server error during OTP resend",
            error: error.message
        });
    }
};

export const getProfile = async (req, res) => {
    try {
        await connectToDatabase();
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).send({ message: "User Id not present" });
        }

        const user = await User.findOne({ userId });

        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }

        const userProfile = {
            userId: user.userId,
            name: user.name,
            phone: user.phone,
            companyName: user.companyName,
            businessWebsite: user.businessWebsite,
            businessEmail: user.businessEmail,
            profileType: user.profileType,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        };

        return res.status(200).json({

            message: "Profile fetched successfully",
            profile: userProfile
        });

    } catch (error) {
        console.error("Error fetching profile:", error);
        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
}

export const getAllUsers = async (req, res) => {
    try {
        await connectToDatabase();
        const verifiedUsers = await User.find({ isOtpVerified: true });

        res.status(200).json({
            success: true,
            message: "Verified users retrieved successfully",
            data: verifiedUsers
        });
    } catch (error) {
        console.error("Error fetching verified users:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

export const requestAccountDeletion = async (req, res) => {
    try {
        await connectToDatabase();

        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        const user = await User.findOne({ userId: userId });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.deletionRequest && user.deletionRequest.requested && user.deletionRequest.status === 'pending') {
            return res.status(400).json({ message: 'Deletion request already pending' });
        }

        user.deletionRequest = {
            requested: true,
            status: 'pending',
            requestedAt: new Date()
        };

        await user.save();

        res.status(200).json({
            message: 'Account deletion request submitted. Waiting for admin approval.',
            requestStatus: 'pending'
        });
    } catch (error) {
        console.error('Account deletion request error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const getPendingDeletionRequests = async (req, res) => {
    try {
        await connectToDatabase();

        const pendingRequests = await User.find({
            'deletionRequest.requested': true,
            'deletionRequest.status': 'pending'
        }).select('-password -otp');

        res.status(200).json({ message: "Recieved Successfully Deletion Request", pendingRequests });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const approveDeletionRequest = async (req, res) => {
    try {
        await connectToDatabase();

        const { userId } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!user.deletionRequest.requested || user.deletionRequest.status !== 'pending') {
            return res.status(400).json({ message: 'No pending deletion request for this user' });
        }

        user.deletionRequest.status = 'approved';
        user.deletionRequest.processedAt = new Date();

        await user.save();

        await User.findByIdAndDelete(userId);

        res.status(200).json({ message: 'Account deletion approved and user account removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const rejectDeletionRequest = async (req, res) => {
    try {
        await connectToDatabase();
        const { reason, userId } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!user.deletionRequest.requested || user.deletionRequest.status !== 'pending') {
            return res.status(400).json({ message: 'No pending deletion request for this user' });
        }

        user.deletionRequest.status = 'rejected';
        user.deletionRequest.processedAt = new Date();

        await user.save();

        res.status(200).json({
            message: 'Account deletion request rejected',
            reason: reason || 'No reason provided'
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const getAllUserDataAgainstId = async (req, res) => {
    try {
        await connectToDatabase();
        const { userId } = req.body;

        const user = await User.findOne({ userId });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const campaigns = await Campaign.find({ userId });

        const userData = {
            user: user.toObject(),
            campaigns
        };

        res.status(200).json({ success: true, data: userData });
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

export const getConsumerUser = async (req, res) => {
    try {

        await connectToDatabase();
        const consumerUsers = await getConsumerUsersCollection();

        const latestUsers = await consumerUsers.find()
            .sort({ createdAt: -1 })
            .limit(3)
            .toArray();

        if (latestUsers.length === 0) {
            return res.status(404).json({ message: 'No users found' });
        }

        res.status(200).json({ message: "Consumer User Retrieved Successfully", latestUsers });
    } catch (error) {
        console.error('Error fetching latest consumer users:', error);
        res.status(500).json({
            message: 'Error fetching latest consumer users',
            error: error.message
        });
    }
}

export const getAllConsumerUser = async (req, res) => {
    try {

        await connectToDatabase();
        const consumerUsers = await getConsumerUsersCollection();

        const latestUsers = await consumerUsers.find().toArray();

        if (latestUsers.length === 0) {
            return res.status(404).json({ message: 'No users found' });
        }

        res.status(200).json({ message: "Consumer User Retrieved Successfully", latestUsers });
    } catch (error) {
        console.error('Error fetching latest consumer users:', error);
        res.status(500).json({
            message: 'Error fetching latest consumer users',
            error: error.message
        });
    }
}

export const getUnverifiedConsumerUser = async (req, res) => {
    try {
        await connectToDatabase();
        const consumerUsers = await getConsumerUsersCollection();

        const unverifiedUsers = await consumerUsers.find({
            identityVerificationStatus: { $ne: 'verified' }
        }).toArray();

        if (unverifiedUsers.length === 0) {
            return res.status(404).json({ message: 'No unverified users found' });
        }

        res.status(200).json({
            message: "Unverified Consumer Users Retrieved Successfully",
            unverifiedUsers
        });
        
    } catch (error) {
        console.error('Error fetching unverified consumer users:', error);
        res.status(500).json({
            message: 'Error fetching unverified consumer users',
            error: error.message
        });
    }
}

export const approveConsumerVerification = async (req, res) => {
    try {
        await connectToDatabase();
        const { userId } = req.body;
        console.log("userId", userId);

        if (!userId) {
            return res.status(400).json({ message: 'UserId not found' });
        }

        await connectToDatabase();
        const consumerUsers = await getConsumerUsersCollection();

        const updatedUser = await consumerUsers.findOneAndUpdate(
            { _id: new mongoose.Types.ObjectId(userId) },
            {
                $set: {
                    identityVerificationStatus: 'verified',
                    isVerified: true
                }
            },
            { returnDocument: 'after' }
        );

        console.log("updatedUser", updatedUser);

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({
            message: "User verification approved successfully",
            user: updatedUser
        });

    } catch (error) {
        console.error('Error approving user verification:', error);
        res.status(500).json({
            message: 'Error approving user verification',
            error: error.message
        });
    }
}

export const rejectConsumerVerification = async (req, res) => {
    try {
        const { userId } = req.body;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }

        await connectToDatabase();
        const consumerUsers = await getConsumerUsersCollection();

        const updateData = {
            identityVerificationStatus: 'rejected',
            isVerified: false
        };

        const updatedUser = await consumerUsers.findOneAndUpdate(
            { _id: new mongoose.Types.ObjectId(userId) },
            { $set: updateData },
            { returnDocument: 'after' }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({
            message: "User verification rejected successfully",
            user: updatedUser
        });

    } catch (error) {
        console.error('Error rejecting user verification:', error);
        res.status(500).json({
            message: 'Error rejecting user verification',
            error: error.message
        });
    }
}

export const getLatestUsers = async (req, res) => {
    try {
        await connectToDatabase();
        const verifiedUsers = await User.find({ isOtpVerified: true })
            .sort({ createdAt: -1 })
            .limit(3);

        res.status(200).json({
            success: true,
            message: "Latest 3 verified users retrieved successfully",
            data: verifiedUsers
        });
    } catch (error) {
        console.error("Error fetching verified users:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

export const getLatestPendingDeletionRequests = async (req, res) => {
    try {
        await connectToDatabase();

        const users = await User.find({
            "deletionRequest.requested": true,
            "deletionRequest.status": "pending"
        })
            .sort({ "deletionRequest.requestedAt": -1 })
            .limit(3);

        if (!users || users.length === 0) {
            return res.status(404).json({ message: 'No pending deletion requests found' });
        }

        res.status(200).json({
            success: true,
            count: users.length,
            data: users
        });

    } catch (error) {
        console.error('Error fetching pending deletion requests:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const deleteAdvertiserUser = async (req, res) => {
    try {
        await connectToDatabase();
        const { id } = req.body;

        const deletedUser = await User.findByIdAndDelete(id);

        if (!deletedUser) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "User deleted successfully",
            data: deletedUser
        });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

export const deleteConsumerUser = async (req, res) => {
    try {
        await connectToDatabase();
        const { id } = req.body;

        const consumerUsers = await getConsumerUsersCollection();

        const result = await consumerUsers.deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            return res.status(404).json({
                message: 'Consumer user not found'
            });
        }

        res.status(200).json({
            message: "Consumer user deleted successfully",
            deletedCount: result.deletedCount
        });
    } catch (error) {
        console.error('Error deleting consumer user:', error);
        res.status(500).json({
            message: 'Error deleting consumer user',
            error: error.message
        });
    }
}

export const listAllConsumerUsers = async (req, res) => {
    let client;
    try {
        await connectToDatabase();
        client = await MongoClient.connect(process.env.MONGO_URI);
        const db = client.db();

        const userList = await db.collection('consumerusers')
            .find({ identityVerificationStatus: 'verified' })
            .toArray();

        res.status(200).json({
            status: 'success',
            results: userList.length,
            data: userList
        });
    } catch (error) {
        console.error('Error fetching consumer users:', error);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    } finally {
        if (client) {
            await client.close();
        }
    }
};

export const verifiedConsumer = async (req, res) => {
    let client;
    try {
        await connectToDatabase();

        const { userId } = req.body;

        client = await MongoClient.connect(process.env.MONGO_URI);
        const db = client.db();

        const result = await db.collection('consumerusers').findOneAndUpdate(
            { _id: new ObjectId(userId) },
            {
                $set: {
                    identityVerificationStatus: 'approved',
                    isVerified: true
                }
            },
            { returnDocument: 'after' }
        );

        const updatedUser = result;

        if (!updatedUser) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        await sendApprovedIdentityEmail(
            updatedUser.email,
            `${updatedUser.firstName} ${updatedUser.lastName}`
        );

        res.status(200).json({
            success: true,
            message: 'User verification status updated to verified',
            user: updatedUser
        });

    } catch (error) {
        console.error('Error in verifiedConsumer:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    } finally {
        if (client) {
            await client.close();
        }
    }
};

export const rejectedConsumer = async (req, res) => {
    let client;
    try {
        await connectToDatabase();

        
        const { userId } = req.body;

        client = await MongoClient.connect(process.env.MONGO_URI);
        const db = client.db();

        
        const result = await db.collection('consumerusers').findOneAndUpdate(
            { _id: new ObjectId(userId) },
            {
                $set: {
                    identityVerificationStatus: 'denied',
                    isVerified: false
                }
            },
            { returnDocument: 'after' }
        );

        const updatedUser = result;

        if (!updatedUser) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        await sendRejectedIdentityEmail(
            updatedUser.email,
            `${updatedUser.firstName} ${updatedUser.lastName}`
        );

        res.status(200).json({
            success: true,
            message: 'User verification status updated to rejected',
            user: updatedUser
        });

    } catch (error) {
        console.error('Error in rejectedConsumer:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    } finally {
        if (client) {
            await client.close();
        }
    }
};