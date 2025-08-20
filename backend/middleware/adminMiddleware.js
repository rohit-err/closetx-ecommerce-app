const adminMiddleware = (req, res, next) => {
    if (req.userRole === "admin") {
        next()
    }
    else {
        return res.status(403).json({
            success: false,
            message: "Access denied: Only admin allowed"
        });
    }

}

module.exports = adminMiddleware