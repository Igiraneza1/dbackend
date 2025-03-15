import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import mainRouter from './routes/indexRouting.js';

const { DB_USER, DB_NAME, DB_PASS, PORT } = process.env;

if (!DB_USER || !DB_PASS || !DB_NAME) {
    console.error('Missing required environment variables: DB_USER, DB_PASS, or DB_NAME');
    process.exit(1);
}

const app = express();


app.use(cors());
app.use(bodyParser.json());
app.use(express.json());


app.use('/', mainRouter);


const dbUri = `mongodb+srv://${DB_USER}:${DB_PASS}@cluster0.g4lhj.mongodb.net/${DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.set('strictQuery', false);

mongoose
    .connect(dbUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 10000, 
    })
    .then(() => {
        console.log('✅ Connected to MongoDB Atlas successfully');
        app.listen(PORT || 3000, () => {
            console.log(`Server is running on http://localhost:${PORT || 3000}`);
        });
    })
    .catch((err) => {
        console.error('MongoDB Connection Error:', err.message);
        process.exit(1); 
    });

export default app;
