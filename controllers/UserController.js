import User from "../modals/UserModal.js";
import bcrypt from "bcryptjs";
import { generateAccessToken } from "../utils/tokenGeneration.js";
import Sendemail from "../utils/Sendemail.js";


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


export const createContact = async (req, res) => {
    try {
        const { names, email, message } = req.body;

        // Create a new contact entry
        const newContact = new Contact({ names, email, message });
        const savedContact = await newContact.save();

        // Create HTML content for the email
        const htmlContent = `
            <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                <h2 style="color: #ea7b30;">Thank You for Contacting Us!</h2>
                <p>Hi ${names},</p>
                <p>Thank you for making registration. We will notify you about upcoming events.</p>
                <p>We for,<br>Blood Donation Rwanda</p>
            </div>
        `;

        // Send the email
        const emailSent = await Sendemail(email, subject, htmlContent);
        if (emailSent) {
            console.log("Confirmation email sent to:", email);
        }

        res.status(201).json(savedContact);
    } catch (error) {
        console.error("Error creating contact:", error);
        res.status(500).json({ error: "Failed to create contact" });
    }
};


export const sendEmail = async (to, subject, htmlContent) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER, // Use environment variables
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to,
            subject,
            html: htmlContent,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent:", info.response);
        return true;
    } catch (error) {
        console.error("Error sending email:", error);
        return false;
    }
};

