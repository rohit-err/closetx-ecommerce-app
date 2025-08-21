// utils/generateTokenAndSetCookies.js
const jwt = require("jsonwebtoken")

const generateTokenAndSetCookies = async (res, userId, role) => {
    const token = jwt.sign({ userId, role }, process.env.JWT_SECRET, { expiresIn: "7d" })
   
    // Production-ready cookie settings
    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // HTTPS only in production
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict", // Allow cross-site in production
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        path: "/" // Make sure cookie is available on all paths
    })

    return token
}

module.exports = generateTokenAndSetCookies