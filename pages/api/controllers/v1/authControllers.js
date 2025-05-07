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
            if (existingUser.otpVerified === true) {
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
            otpVerified: false
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

        const user = await User.findOne({ _id:userId });

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

        const token = jwt.sign(
            { userId: user._id },
            process.env.SECRET_KEY,
            { expiresIn: '1h' }
        );

        res.status(200).json({
            message: "OTP verified successfully",
            user: user,
            token,
            role: user.role
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};