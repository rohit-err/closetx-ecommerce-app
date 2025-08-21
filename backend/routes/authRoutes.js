


const express = require("express")
const { signUp, login, checkAuth, getProfile, editProfile, logout } = require("../controllers/authController")
const verifyToken = require("../middleware/verifyToken")
const authRoutes = express.Router()



authRoutes.post("/signup", signUp)
authRoutes.post("/login", login)
authRoutes.post("/logout", logout)
authRoutes.get("/check-auth", verifyToken, checkAuth)
authRoutes.put("/edit-profile", verifyToken, editProfile)



module.exports = authRoutes