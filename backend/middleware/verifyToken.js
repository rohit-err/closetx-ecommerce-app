const jwt = require("jsonwebtoken")

const verifyToken = async (req, res, next) => {
    const token = req.cookies.token

    if (!token) return res.status(401).json({ success: false, message: "Unauthorized" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.userId = decoded.userId
        req.userRole = decoded.role
        next()
    } catch (error) {
        return res.status(401).json({ success: false, message: "Invalid token" });
    }
}

module.exports = verifyToken