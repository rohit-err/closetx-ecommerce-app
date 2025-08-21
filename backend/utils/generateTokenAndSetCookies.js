
const jwt = require("jsonwebtoken")

const generateTokenAndSetCookies = async (res, userId, role) => {
    const token = jwt.sign({ userId, role }, process.env.JWT_SECRET, { expiresIn: "7d" })
    
    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // Changed this
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: '/'
    })

    return token
}

module.exports = generateTokenAndSetCookies
