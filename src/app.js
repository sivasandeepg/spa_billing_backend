// src/app.js

import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { errorHandler } from './middleware/errorHandler.js';
import routes from './routes/index.js';

const app = express();

// Current INCORRECT Code:
// app.use(cors({
//   origin: process.env.FRONTEND_URL ||'https://spa-billing-frontend.vercel.app/login' ||'http://localhost:5173',
//   credentials: true
// }));   


// Set the array of origins explicitly, including your deployed Vercel frontend.
const allowedOrigins = [
'http://localhost:5173', // Your development frontend
'https://spabillingbackend-production.up.railway.app' // Your deployed Vercel frontend
];
                
// Add the environment variable URL if it exists (for Railway setup flexibility)
if (process.env.FRONTEND_URL) {
allowedOrigins.push(process.env.FRONTEND_URL);
}
  
// Middleware: CORS is correctly configured using the array of allowed origins.
app.use(cors({
origin: allowedOrigins, 
credentials: true
}));   

app.use(express.json({ limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
// app.use(limiter);
 
// Routes 
app.use('/api', routes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Global error handler
app.use(errorHandler);

export default app; 