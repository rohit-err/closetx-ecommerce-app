const productModel = require("../models/productModel")
const listingModel = require("../models/userListingModel")
const userModel = require("../models/userModel")
const cloudinary = require("cloudinary").v2

const addProduct = async (req, res) => {
    try {
        const Id = req.userId
        const role = req.userRole
        console.log(role)
        const {
            name,
            description,
            price,
            condition,
            category,
            subCategory,
            size,
            brand,
            'contactInfo.phone': phone,
            'contactInfo.email': email,
            'pickupAddress.street': street,
            'pickupAddress.city': city,
            'pickupAddress.state': state,
            'pickupAddress.zipcode': zipcode,
            'pickupAddress.landmark': landmark,
        } = req.body
        console.log(name,
            description,
            price,
            condition,
            category,
            subCategory,
            size,
            brand,
            phone,
            email,
            street,
            city,
            state,
            zipcode,
            landmark)
        let contactInfo = {
            phone,
            email,
            preferredContact: 'both',

        }

        let pickupAddress = {
            street,
            city,
            state,
            zipcode,
            landmark
        }

        if (role === "admin") {
            contactInfo = {
                phone: phone || "XXXXXXXXXX",
                email: email || `${process.env.ADMIN_EMAIL}`,
                preferredContact: "both"
            };

            pickupAddress = {
                street: street || "Admin Street",
                city: city || "Admin City",
                state: state || "Admin State",
                zipcode: zipcode || "000000",
                landmark: landmark || "xxxxxxxxxxxxxxx"
            };
        }
        const image1 = req.files.image1 && req.files.image1[0]
        const image2 = req.files.image2 && req.files.image2[0]
        const image3 = req.files.image3 && req.files.image3[0]
        const image4 = req.files.image4 && req.files.image4[0]
        const image5 = req.files.image5 && req.files.image5[0]

        const images = [image1, image2, image3, image4, image5].filter((item) => item !== undefined)

        //hmlog database me directly image ko store ni kr skte esliye hmlog images ko cloudinary pr upload krenga and then jo URL milega usko DB me save krenga...

        let imagesUrl = await Promise.all(
            images.map(async (item) => {
                let result = await cloudinary.uploader.upload(item.path, { resource_type: 'image' })
                return result.secure_url
            })
        )

        console.log(imagesUrl)


        const sizes = [size]
        const product = await new productModel({
            userId: Id,
            name,
            description,
            price,
            condition,
            images: imagesUrl,
            category,
            subCategory,
            sizes,
            size,
            brand,
            contactInfo,
            pickupAddress
        })
        await product.save()

        res.status(201).json({
            success: true,
            message: "Product listed successfully",
            productData: product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error creating product"
        })
    }
}
const removeProduct = async (req, res) => {
    console.log(req.params.id)
    try {
        let deleteResult;
        if (req.userRole === "admin") {
            deleteResult = await productModel.findByIdAndDelete(req.params.id)
        }
        else {
            deleteResult = await productModel.findOneAndDelete({ _id: req.params.id, userId: req.userId })
        }
        if (!deleteResult) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });

        }
        res.status(200).json({
            success: true,
            message: "Product removed successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to remove product",
            error: error.message
        });
    }
}
const editProduct = async (req, res) => {
    console.log(req.body)
    try {
        if (req.userRole !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Unauthorized"
            });
        }

        const updateResult = await productModel.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        )

        if (!updateResult) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Product updated successfully",
            data: updateResult
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update product",
            error: error.message
        });
    }
}
const markAsSold = async (req, res) => {
    console.log(req.body);
    try {
        const { productId } = req.body;

        const product = await productModel.findById(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        product.status = "sold";
        product.soldAt = new Date();

        await product.save();

        res.status(200).json({
            success: true,
            message: "Successfully marked as sold",
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update statust",
            error: error.message
        });
    }
};
const listProducts = async (req, res) => {

    try {
        const products = await productModel.find().populate('userId', 'name')
        res.json({ success: true, productList: products })
    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            message: error.message
        })
    }
}
const myListedProducts = async (req, res) => {

    try {
        const Id = req.userId
        const myListedProducts = await productModel.find({ userId: Id })
        res.json({ success: true, myListedProducts: myListedProducts })
    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            message: error.message
        })
    }
}


const viewSingleProduct = async (req, res) => {
    try {
        const productId = req.params.id
        const productData = await productModel.findById(productId).populate('userId', 'name')
        if (!productData) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        res.status(200).json({
            success: true,
            product: productData
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch product",
            error: error.message
        });

    }

}
const adminViewSingleProduct = async (req, res) => {
    try {
        const productId = req.params.id
        const productData = await productModel.findOne({ _id: productId })
        if (!productData) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }


        const sellerData = await userModel.findById(productData.userId)
        res.status(200).json({
            success: true,
            product: productData,
            seller: {
                sellerName: sellerData.name,
                sellerEmail: sellerData.email
            }
        })


    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch product",
            error: error.message
        });

    }

}






module.exports = { addProduct, removeProduct, editProduct, listProducts, viewSingleProduct, myListedProducts, adminViewSingleProduct, markAsSold }


