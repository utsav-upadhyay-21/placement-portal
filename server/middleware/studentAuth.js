const verifyToken = require("./authMiddleware");

const studentAuth = (req, res, next) => {

    verifyToken(req, res, () => {

        if (req.user.role !== "student") {

            return res.status(403).json({
                message: "Student access required"
            });

        }

        next();

    });

};

module.exports = studentAuth;
