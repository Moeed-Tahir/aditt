const bcrypt = require("bcrypt");
const User = require("../../../models/User");
const { generateToken } = require("../../../utils/generateToken");
const { generateOTP, sendOTP } = require("../../../services/otpServices");
const jwt = require("jsonwebtoken");
const connectDB = require("../../../config/dbConnect");


exports.signUp = async (req, res) => {
    try {


        // Connect to the database
        await connectDB.connectDB();
        const { name, businessWebsite, businessEmail, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ businessEmail });
        if (existingUser && existingUser.otpVerified === true) {
            return res.status(400).json({ message: "User with entered email already exists" });
        }
        else if (existingUser && existingUser.otpVerified === false) {
            existingUser.otp = generateOTP();
            existingUser.otpExpires = Date.now() + 5 * 60 * 1000;
            await existingUser.save();
            // Send OTP to the existing user
            await sendOTP(businessEmail, existingUser.otp);
            return res.status(200).json({ message: "OTP resent successfully" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new User({
            name,
            businessWebsite,
            businessEmail,
            password: hashedPassword,
            otp: generateOTP(),
            otpExpires: Date.now() + 5 * 60 * 1000, // OTP valid for 5 minutes
            isOtpVerified: false
        });

        await newUser.save();

        // Send OTP to the new user
        await sendOTP(businessEmail, newUser.otp);

        res.status(201).json({
            message: "User created successfully. OTP sent to your email.",
            userId: newUser._id,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
}

// Verify OTP===============================
exports.verifyOTP = async (req, res) => {
    try {
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

        const token = jwt.sign(
            { userId: user._id },
            process.env.SECRET_KEY,
            { expiresIn: '1h' }
        );

        const { password: _, ...userData } = foundUser.toObject();
        res.status(200).json({
            message: "OTP verified successfully",
            user: userData,
            token,
            role: userData.role
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};