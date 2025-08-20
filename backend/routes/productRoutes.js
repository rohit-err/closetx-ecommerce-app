
const express = require("express")
const { addProduct, removeProduct, listProducts, myListedProducts, viewSingleProduct, markAsSold} = require("../controllers/productController")
const upload = require("../middleware/multer")
const verifyToken = require("../middleware/verifyToken")
const adminOrUserMiddleware = require("../middleware/adminOrUserMiddleware")

const productRoutes = express.Router()

productRoutes.post("/add", verifyToken, adminOrUserMiddleware, upload.fields([{ name: 'image1', maxCount: 1 }, { name: 'image2', maxCount: 1 }, { name: 'image3', maxCount: 1 }, { name: 'image4', maxCount: 1 }, { name: 'image5', maxCount: 1 }]), addProduct)
productRoutes.delete("/:id", verifyToken, adminOrUserMiddleware, removeProduct)

productRoutes.get("/list", listProducts)
productRoutes.get("/my-listings", verifyToken, adminOrUserMiddleware, myListedProducts)
productRoutes.get("/:id", viewSingleProduct)
productRoutes.post("/mark-sold", verifyToken, adminOrUserMiddleware, markAsSold)


module.exports = productRoutes