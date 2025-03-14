import User from "../modals/UserModal.js";
import bcrypt from "bcryptjs";
import { generateAccessToken } from "../utils/tokenGeneration.js";

export const Register = async (req, res) => {
    try {
        const { userName, userEmail, userPassword, userRole } = req.body;

        // Check if the email already exists
        const existingUser = await User.findOne({ userEmail });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(userPassword, 10); 

        // Create a new user instance
        const user = new User({
            userName,
            userEmail,
            userPassword: hashedPassword,
            userRole,
            tokens: {} 
        });

        // Generate access token
        const accessToken = generateAccessToken(user);
        user.tokens.accessToken = accessToken;

        // Save the user
        await user.save();

        res.status(201).json({
            message: "Account created successfully!",
            user: {
                id: user._id,
                userName: user.userName,
                userEmail: user.userEmail,
                userRole: user.userRole,
                tokens: {
                    accessToken: user.tokens.accessToken,
                },
            },
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to register user", error: error.message });
    }
};

export const Login = async (req, res) => {
    try {
        const { userEmail, userPassword } = req.body;

        // Find user by email
        const user = await User.findOne({ userEmail });
        console.log("User found:", user); // Debugging

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(userPassword, user.userPassword);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Generate new access token
        const accessToken = generateAccessToken(user);
        user.tokens.accessToken = accessToken;

        // Save the updated user token
        await user.save();

        res.json({
            message: "Login successful",
            user: {
                id: user._id,
                userName: user.userName,
                userEmail: user.userEmail,
                userRole: user.userRole,
                tokens: {
                    accessToken: user.tokens.accessToken,
                },
            },
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
