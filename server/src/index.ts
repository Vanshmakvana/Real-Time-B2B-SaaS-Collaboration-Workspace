import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { responseFormatter } from './middleware/response';
import apiRouter from './routes';

// Load environment variables
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

// Security and Parsing Middleware
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Custom JSON Formatter Middleware
app.use(responseFormatter);

// Bind Master API Router
app.use('/api/v1', apiRouter);

// Start the server
app.listen(PORT, () => {
  console.log(`[🚀 Server]: Running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
