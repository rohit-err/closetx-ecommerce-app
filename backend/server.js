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
const allowedOrigins = process.env.NODE_ENV === 'production' 
    ? [
        process.env.FRONTEND_URL,
        process.env.ADMIN_URL
      ]
    : [
        "http://localhost:5173", 
        "http://localhost:5174",
        "http://localhost:3000"
      ];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (mobile apps, etc.)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

app.use(express.json())
app.use(cookieParser())

// Health check
app.get('/health', (req, res) => {
    res.status(200).json({ 
        status: 'OK', 
        message: 'Server is running',
        timestamp: new Date().toISOString()
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
        })
    } catch (error) {
        console.error('❌ Error starting server:', error);
        process.exit(1);
    }
}

startServer()