import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import mainRouter from './routes/indexRouting.js';

dotenv.config(); // Load environment variables

const db_user = process.env.DB_USER;
const db_name = process.env.DB_NAME;
const db_pass = process.env.DB_PASS;
const PORT = process.env.PORT || 3000;

if (!db_user || !db_pass || !db_name) {
    console.error('Missing required environment variables: DB_USER, DB_PASS, or DB_NAME');
    process.exit(1);
}

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// Routes
app.use('/', mainRouter);

// MongoDB Connection URI
const dbUri = `mongodb+srv://${db_user}:${db_pass}@cluster0.g4lhj.mongodb.net/${db_name}?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.set('strictQuery', false);

mongoose
    .connect(dbUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 10000, // Set timeout to avoid long waits
    })
    .then(() => {
        console.log('Connected to MongoDB Atlas successfully');
        app.listen(PORT, () => {
            console.log(` Server is running on http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error('MongoDB Connection Error:', err.message);
        process.exit(1); // Stop the process if MongoDB fails to connect
    });

export default app;
