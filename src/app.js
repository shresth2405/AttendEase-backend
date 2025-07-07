import express from 'express';
import cors from 'cors';
import userRoutes from "./routes/user.route.js"
import subjectRoutes from './routes/subject.route.js'
import scheduleRoutes from './routes/schedule.router.js'
import historyRoutes from './routes/history.route.js'
import cookieParser from 'cookie-parser';
// const subjectRoutes = require('./routes/subjectRoutes');
// const scheduleRoutes = require('./routes/scheduleRoutes');

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}))
app.use(express.json());
app.use(cookieParser());

// // Routes
app.use('/api/user', userRoutes);
app.use('/api/subject', subjectRoutes);
app.use('/api/schedule', scheduleRoutes);
app.use('/api/history', historyRoutes)

export default app;