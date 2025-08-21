const Razorpay = require("razorpay")
const crypto = require("crypto")


const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
})


const createRazorpayOrder = async (req, res) => {
    try {
        console.log("Creating order for amount:", req.body.amount) // ADD THIS
        const { amount } = req.body
        const options = {
            amount: amount * 100,
            currency: 'INR',
            receipt: `order_${Date.now()}`
        }
        const order = await razorpayInstance.orders.create(options)
        console.log("Order created successfully:", order.id) // ADD THIS
        res.json({
            success: true,
            orderId: order.id,
            orderAmount: order.amount,
            keyId: process.env.RAZORPAY_KEY_ID,
        })
    } catch (error) {
        console.error("❌ ORDER CREATION ERROR:", error) // ADD THIS
        res.status(500).json({
            success: false,
            message: 'Order creation failed'
        })
    }
}


const verifyRazorpayPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body
        const body = razorpay_order_id + "|" + razorpay_payment_id
        const expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET).update(body).digest('hex')
        if (expectedSignature === razorpay_signature) {
            res.json({
                success: true,
                message: 'Payment verified'
            })
        } else {
            res.status(400).json({
                success: false,
                message: 'Invalid signature'
            })
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Verification failed'
        })
    }
}

module.exports={createRazorpayOrder,verifyRazorpayPayment}