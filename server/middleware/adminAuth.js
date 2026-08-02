const verifyToken = require("./authMiddleware");

const adminAuth = (req, res, next) => {

    verifyToken(req, res, () => {

        if (req.user.role !== "admin") {

            return res.status(403).json({
                message: "Admin access required"
            });

        }

        next();

    });

};

module.exports = adminAuth;
