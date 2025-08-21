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

// CORS configuration for production
app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (mobile apps, etc.)
        if (!origin) return callback(null, true);
        
        // In production, allow Vercel domains
        if (process.env.NODE_ENV === 'production') {
            if (origin.includes('vercel.app') || 
                origin.includes('closetx-frontend') ||
                origin === process.env.FRONTEND_URL) {
                return callback(null, true);
            }
        } else {
            // Development origins
            const devOrigins = [
                "http://localhost:5173", 
                "http://localhost:5174",
                "http://localhost:3000"
            ];
            if (devOrigins.includes(origin)) {
                return callback(null, true);
            }
        }
        
        callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
}));

// Handle preflight requests
app.options('*', cors());

app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true, limit: '50mb' }))
app.use(cookieParser())

// Health check
app.get('/health', (req, res) => {
    res.status(200).json({ 
        status: 'OK', 
        message: 'Server is running',
        timestamp: new Date().toISOString(),
        env: process.env.NODE_ENV
    })
})

// Add error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err.message);
    res.status(500).json({ 
        success: false, 
        message: err.message || 'Internal Server Error' 
    });
});

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
            console.log(`📍 Environment: ${process.env.NODE_ENV}`);
            console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL}`);
        })
    } catch (error) {
        console.error('❌ Error starting server:', error);
        process.exit(1);
    }
}

startServer()