
const userModel = require("../models/userModel")
const bcrypt = require("bcrypt")
const generateTokenAndSetCookies = require("../utils/generateTokenAndSetCookies")
const jwt = require("jsonwebtoken")
const signUp = async (req, res) => {
    const { name, email, password } = req.body
    try {
        if (!name || !email || !password) {
            throw new Error("All fields are required")
        }

        const userAlreadyExists = await userModel.findOne({ email })
        if (userAlreadyExists) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await new userModel({
            name: name,
            email: email,
            password: hashedPassword
        })

        await user.save()
        await generateTokenAndSetCookies(res, user._id, user.role)
        res.status(201).json({
            success: true,
            message: "Account created successfully",
            user: {
                ...user._doc,
                password: undefined
            }
        })
    } catch (error) {
        console.error("Signup Error:", error.message);

        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
}

const login = async (req, res) => {
    const { email, password } = req.body
    try {
        if (!email || !password) {
            return res.status(400).json({
                "success": false,
                "message": "Email and password are required"
            });
        }
        const user = await userModel.findOne({ email })
        if (!user) {
            return res.status(404).json({
                "success": false,
                "message": "User not found"
            });
        }
        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            return res.status(401).json({
                "success": false,
                "message": "Invalid credentials"
            }
            );
        }


        await generateTokenAndSetCookies(res, user._id, user.role)



        res.status(200).json({
            success: true,
            message: "Logged in successfully",
            user: {
                ...user._doc,
                password: undefined
            }
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }
}


const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body
        if (email !== process.env.ADMIN_EMAIL) {
            return res.status(404).json({
                "success": false,
                "message": "Admin not found"
            });

        }

        if (password !== process.env.ADMIN_PASSWORD) {
            return res.status(401).json({
                "success": false,
                "message": "Incorrect password"
            });
        }
        const admin = await userModel.findOne({ email })
        await generateTokenAndSetCookies(res, admin._id, admin.role)
        res.status(200).json({
            success: true,
            message: "Admin login successful",
            admin: {
                ...admin._doc,
                password: undefined
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error during admin login",
            error: error.message
        });
    }
}
const checkAuth = async (req, res) => {
    try {
        const user = await userModel.findById(req.userId)
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found"
            })
        }

        res.status(200).json({
            success: true,
            user: {
                ...user._doc,
                password: undefined
            }
        })
    } catch (error) {
        console.log("Error in checkAuth", error)
        return res.status(400).json({
            success: false,
            message: error.message
        })
    }
}
const getProfile = async (req, res) => {
    try {
        const user = await userModel.findById(req.userId).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            user: user
        });

    } catch (error) {
        console.log("Error in getProfile:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};
const editProfile = async (req, res) => {
    console.log(req.body)
    try {
        const updatedUser = await userModel.findByIdAndUpdate(
            req.userId,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user: {
                ...updatedUser._doc, password: undefined
            },
        });

    } catch (error) {
        console.log("Error in editProfile:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};


const logout = async (req, res) => {
    res.clearCookie("token")
    res.status(200).json({ success: true, message: "Logged out successfully" })

}



module.exports = { signUp, login, adminLogin, checkAuth, getProfile, editProfile, logout }
