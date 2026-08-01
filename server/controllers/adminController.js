const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {

    const { username, password } = req.body;

    try {

        const [rows] = await db.query(
            "SELECT * FROM admins WHERE username=?",
            [username]
        );

        if(rows.length===0){

            return res.status(401).json({
                message:"Invalid Username"
            });

        }

        const admin=rows[0];

        const valid=await bcrypt.compare(
            password,
            admin.password_hash
        );

        if(!valid){

            return res.status(401).json({
                message:"Invalid Password"
            });

        }

        const token=jwt.sign(

            {
                id:admin.id,
                username:admin.username
            },

            process.env.JWT_SECRET,

            {
                expiresIn:"1d"
            }

        );

        res.json({

            message:"Login Successful",

            token

        });

    }

    catch(error){

        res.status(500).json({

            message:error.message

        });

    }

}

module.exports = {
    login
};