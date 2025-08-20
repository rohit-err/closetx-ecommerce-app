

const adminOrUserMiddleware = (req, res, next) => {
    if (req.userRole === "user" || req.userRole === "admin") {
        next()
    }
    else {
        return res.status(403).json({
            success: false,
            message: "Access denied: Only admin or user allowed"
        });
    }
    
}
module.exports = adminOrUserMiddleware
