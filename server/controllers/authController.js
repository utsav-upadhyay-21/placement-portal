const db = require("../config/db");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {

    const { email, password } = req.body;

    if (!email || !password) {

        return res.status(400).json({
            message: "Email and USN are required"
        });

    }

    try {

        const normalizedEmail = String(email).trim().toLowerCase();

        const [rows] = await db.query(
            `
            SELECT usn, student_name, branch, college_email
            FROM students
            WHERE college_email = ?
            `,
            [normalizedEmail]
        );

        if (rows.length === 0) {

            return res.status(401).json({
                message: "Invalid Email or USN"
            });

        }

        const student = rows[0];

        const enteredUsn = String(password).trim().toUpperCase();

        if (enteredUsn !== student.usn.toUpperCase()) {

            return res.status(401).json({
                message: "Invalid Email or USN"
            });

        }

        const token = jwt.sign(

            {
                id: student.usn,
                usn: student.usn,
                email: student.college_email,
                role: "student"
            },

            process.env.JWT_SECRET,

            {
                expiresIn: "7d"
            }

        );

        res.json({

            message: "Login Successful",

            token,

            student: {

                usn: student.usn,

                student_name: student.student_name,

                branch: student.branch,

                college_email: student.college_email

            }

        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

const getProfile = async (req, res) => {

    try {

        const [rows] = await db.query(
            `
            SELECT
                usn,
                student_name,
                branch,
                phone_number,
                personal_email,
                college_email,
                tenth_marks,
                twelfth_marks,
                cgpa,
                active_backlogs
            FROM students
            WHERE usn = ?
            `,
            [req.user.usn]
        );

        if (rows.length === 0) {

            return res.status(404).json({
                message: "Student not found"
            });

        }

        const student = rows[0];

        const [semesterMarks] = await db.query(
            `
            SELECT semester, sgpa, marks
            FROM semester_marks
            WHERE usn = ?
            ORDER BY semester ASC
            `,
            [req.user.usn]
        );

        res.json({
            ...student,
            semester_marks: semesterMarks
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

module.exports = {
    login,
    getProfile
};
