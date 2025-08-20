const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    phone: { type: String, trim: true, default: "" },
    address: {
        street: { type: String, trim: true, default: "" },
        city: { type: String, trim: true, default: "" },
        state: { type: String, trim: true, default: "" },
        zipcode: { type: String, trim: true, default: "" },
        country: { type: String, trim: true, default: "" }
    },
    profileImage: { type: String, default: ""}
}, {
    timestamps: { createdAt: 'joinedAt', updatedAt: 'updatedAt' },
    minimize: false
});

const userModel = mongoose.models.User || mongoose.model("User", userSchema);
module.exports = userModel
