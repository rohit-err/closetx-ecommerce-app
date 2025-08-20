const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, 
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    condition: { type: String, enum: ["new", "like new", "good", "fair", "poor"], required: true },
    images: { type: Array, required: true }, 
    category: { type: String, enum: ["Men", "Women", "Kids"], required: true },
    subCategory: { type: String, enum: ["Topwear", "Bottomwear", "Winterwear", "Footwear", "Accessories"], required: true },
    sizes: { type: Array, required: true }, 
    size: { type: String, trim: true }, 
    brand: { type: String, trim: true, default: "Unknown" },
    status: { type: String, enum: ["available", "sold"], default: "available" },
    soldAt: { type: Date, default: null },
    soldTo: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    contactInfo: {
        phone: { type: String, required: true },
        email: { type: String, required: true },
        preferredContact: { type: String, enum: ["phone", "email", "both"], default: "both" }
    },
    pickupAddress: {
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        zipcode: { type: String, required: true },
        landmark: { type: String } 
    },
}, {
    timestamps: { createdAt: 'listedAt', updatedAt: 'updatedAt' },
    minimize: false
});

const productModel = mongoose.models.Product || mongoose.model("Product", productSchema);
module.exports = productModel;

