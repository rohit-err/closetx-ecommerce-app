const mongoose = require('mongoose')


const connectDB = async (params) => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI)
        console.log('Connected to MongoDB Atlas successfully!');
        console.log(`MongoDB Connected: ${conn.connection.host}`)
    } catch (error) {
        console.log("Error connection to MongoDb: ", error.message)
    }
}


module.exports = connectDB