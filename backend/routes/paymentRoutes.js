const express = require("express")
const paymentRoutes = express.Router()
const {createRazorpayOrder,verifyRazorpayPayment}=require("../controllers/paymentController")


paymentRoutes.post('/create-razorpay-order', createRazorpayOrder)
paymentRoutes.post('/verify-razorpay-payment', verifyRazorpayPayment)




module.exports = paymentRoutes