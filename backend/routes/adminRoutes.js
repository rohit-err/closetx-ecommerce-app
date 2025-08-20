

const express = require("express")
const { adminLogin, checkAuth, logout } = require("../controllers/authController")
const verifyToken = require("../middleware/verifyToken")
const adminRoutes = express.Router()
const adminMiddleware = require("../middleware/adminMiddleware")
const { editProduct, adminViewSingleProduct } = require("../controllers/productController")

adminRoutes.post("/login", adminLogin)
adminRoutes.post("/logout", logout)
adminRoutes.get("/check-auth", verifyToken,adminMiddleware, checkAuth)
adminRoutes.put("/product/:id", verifyToken, adminMiddleware, editProduct)  
adminRoutes.get("/product/:id", verifyToken, adminMiddleware, adminViewSingleProduct)




module.exports = adminRoutes