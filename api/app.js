import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import authRoute from './routes/auth.route.js'
dotenv.config();

const app = express();

app.use(express.json());
app.use(cors({
    origin: 'localhost:5173', credentials: true}))
app.use(cookieParser());

app.use("/api/auth", authRoute);

app.use("/api/test", (req, res) => {
    res.send("it works")
})

app.listen(4000, () => {
    console.log('server is running')
})