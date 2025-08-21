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
const port = process.env.PORT

app.use(cors({ 
    origin: true, 
    credentials: true 
}))
app.use(express.json())
app.use(cookieParser())
app.use("/api/user", authRoutes)
app.use("/api/product", productRoutes)
app.use("/api/admin", adminRoutes)
app.use("/api/payment", paymentRoutes)




const startServer = async () => {
    try {
        await connectDB()
        await connectCloudinary()
        app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        }
        )
    } catch (error) {
        console.error('Error starting server:', error);
    }
}
startServer()