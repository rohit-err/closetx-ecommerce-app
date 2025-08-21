const express = require('express')
const cookieParser = require("cookie-parser");
const cors = require("cors")
const connectDB = require('./config/connectDB')
require("dotenv").config()
const connectCloudinary = require('./config/cloudinary')
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const adminRoutes = require('./routes/adminRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

const app = express()
const port = process.env.PORT || 8000

// Allowed origins
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:3000',
    process.env.FRONTEND_URL,
    process.env.ADMIN_URL
].filter(Boolean); // Remove undefined values

console.log('Allowed Origins:', allowedOrigins);

// Enhanced CORS configuration
app.use(cors({
    origin: function (origin, callback) {
        console.log('Request from origin:', origin);
        
        // Allow requests with no origin (mobile apps, Postman, etc.)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.log('CORS blocked origin:', origin);
            callback(new Error(`Not allowed by CORS. Origin: ${origin}`));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: [
        'Origin',
        'X-Requested-With', 
        'Content-Type', 
        'Accept', 
        'Authorization',
        'Cookie'
    ],
    exposedHeaders: ['Set-Cookie'],
    optionsSuccessStatus: 200
}));

// Pre-flight OPTIONS handler
app.options('*', (req, res) => {
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.header('Access-Control-Allow-Origin', origin);
    }
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Cookie');
    res.sendStatus(200);
});

app.use(express.json())
app.use(cookieParser())

// Health check with debug info
app.get('/health', (req, res) => {
    res.status(200).json({ 
        status: 'OK', 
        message: 'Server is running',
        timestamp: new Date().toISOString(),
        allowedOrigins: allowedOrigins,
        environment: process.env.NODE_ENV
    })
})

// Debug route to check cookies
app.get('/debug/cookies', (req, res) => {
    res.json({
        cookies: req.cookies,
        headers: req.headers
    })
})

app.use("/api/user", authRoutes)
app.use("/api/product", productRoutes)
app.use("/api/admin", adminRoutes)
app.use("/api/payment", paymentRoutes)

const startServer = async () => {
    try {
        await connectDB()
        await connectCloudinary()
        app.listen(port, () => {
            console.log(`🚀 Server running on port ${port}`);
            console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
            console.log(`🔒 Allowed Origins: ${allowedOrigins.join(', ')}`);
        })
    } catch (error) {
        console.error('❌ Error starting server:', error);
        process.exit(1);
    }
}

startServer()