const bcrypt = require("bcrypt");
import User from '../../models/User.model';
const { generateOTP, sendOTP } = require("../../services/otpServices");
const jwt = require("jsonwebtoken");
const connectToDatabase = require("../../config/dbConnect");




exports.signUp = async (req, res) => {

    try {
        await connectToDatabase();

        const { name, businessWebsite, businessEmail, password } = req.body;

        if (!name || !businessWebsite || !businessEmail || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingUser = await User.findOne({ businessEmail });
        
        if (existingUser) {
            if (existingUser.isOtpVerified === true) {
                return res.status(400).json({ 
                    message: "User with this email already exists",
                    code: "EMAIL_EXISTS"
                });
            } else {
                existingUser.otp = generateOTP();
                existingUser.otpExpires = Date.now() + 5 * 60 * 1000;
                await existingUser.save();
                
                await sendOTP(businessEmail, existingUser.otp);
                
                return res.status(200).json({ 
                    message: "OTP resent successfully",
                    userId: existingUser._id
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

        res.status(201).json({
            message: "User created successfully. OTP sent to your email.",
            userId: newUser._id,
            email: businessEmail
        });

    } catch (error) {
        console.error('[ERROR] Signup failed:', {
            message: error.message,
            stack: error.stack,
            fullError: error
        });
        res.status(500).json({ 
            message: "Server error during registration",
            error: error.message
        });
    }
};

// Verify OTP===============================
exports.verifyOTP = async (req, res) => {
    try {
        const { userId, otp } = req.body;

        const user = await User.findOne({ _id: userId });

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

        // ✅ Mark user as verified
        console.log('Before verification:', user.isOtpVerified);
        user.isOtpVerified = true;
        user.otp = null;
        user.otpExpires = null;
        await user.save();
        console.log('After verification:', user.isOtpVerified);

        const token = jwt.sign(
            { userId: user._id },
            process.env.SECRET_KEY,
            { expiresIn: '1h' }
        );

        res.status(200).json({
            message: "OTP verified successfully",
            user: {
                _id: user._id,
                name: user.name,
                email: user.businessEmail,
                role: user.role
            },
            token,
            role: user.role
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


// Sign In ===============================
exports.signIn = async (req, res) => {
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
                message: "User not found",
                code: "USER_NOT_FOUND"
            });
        }

        if (!user.isOtpVerified) {
            // Resend OTP if not verified
            user.otp = generateOTP();
            user.otpExpires = Date.now() + 5 * 60 * 1000;
            await user.save();
            
            await sendOTP(email, user.otp);
            
            return res.status(403).json({ 
                message: "Account not verified. OTP resent to your email.",
                code: "ACCOUNT_NOT_VERIFIED",
                userId: user._id,
                requiresVerification: true
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ 
                message: "Invalid password",
                code: "INVALID_PASSWORD"
            });
        }

        const token = jwt.sign(
            { userId: user._id },
            process.env.SECRET_KEY,
            { expiresIn: '1h' }
        );

        res.status(200).json({
            message: "Sign in successful",
            user: {
                _id: user._id,
                name: user.name,
                email: user.businessEmail,
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

// Forgot Password - Initiate ===============================
exports.forgotPassword = async (req, res) => {
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

        // Generate and save OTP
        user.otp = generateOTP();
        user.otpExpires = Date.now() + 5 * 60 * 1000;
        await user.save();

        await sendOTP(email, user.otp);

        res.status(200).json({
            message: "OTP sent to your email for password reset",
            userId: user._id
        });

    } catch (error) {
        console.error('[ERROR] Forgot password failed:', error);
        res.status(500).json({ 
            message: "Server error during password reset",
            error: error.message
        });
    }
};

// Reset Password ===============================
exports.resetPassword = async (req, res) => {
    try {
        await connectToDatabase();

        const { userId, otp, newPassword } = req.body;

        if (!userId || !otp || !newPassword) {
            return res.status(400).json({ 
                message: "All fields are required",
                code: "MISSING_FIELDS"
            });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ 
                message: "User not found",
                code: "USER_NOT_FOUND"
            });
        }

        // Verify OTP
        if (user.otp !== otp) {
            return res.status(400).json({ 
                message: "Invalid OTP",
                code: "INVALID_OTP",
                requiresResend: true
            });
        }

        if (user.otpExpires < Date.now()) {
            return res.status(400).json({ 
                message: "OTP has expired",
                code: "OTP_EXPIRED",
                requiresResend: true
            });
        }

        // Update password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.otp = null;
        user.otpExpires = null;
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