const db = require("../config/db");

const getAllStudents = async (req, res) => {

    try {

        const [students] = await db.query(
            "SELECT * FROM students"
        );

        res.json(students);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

const getStudentByUSN = async (req, res) => {

    try {

        const { usn } = req.params;

        const [student] = await db.query(
            `
            SELECT *
            FROM students
            WHERE usn = ?
            `,
            [usn]
        );

        if (student.length === 0) {

            return res.status(404).json({
                message: "Student not found"
            });

        }

        res.status(200).json(student[0]);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};
const updateStudent = async (req, res) => {

    const { usn } = req.params;

    const {

        student_name,

        branch,

        college_email,

        phone_number,

        personal_email,

        tenth_marks,

        twelfth_marks,

        cgpa,

        active_backlogs

    } = req.body;

    if (!student_name) {

        return res.status(400).json({
            message: "Student Name is required"
        });

    }

    try {

        const [result] = await db.query(

            `
            UPDATE students

            SET

            student_name=?,
            branch=?,
            college_email=?,
            phone_number=?,
            personal_email=?,
            tenth_marks=?,
            twelfth_marks=?,
            cgpa=?,
            active_backlogs=?

            WHERE usn=?
            `,

            [

                student_name,

                branch,

                college_email,

                phone_number,

                personal_email,

                tenth_marks,

                twelfth_marks,

                cgpa,

                active_backlogs,

                usn

            ]

        );

        if (result.affectedRows === 0) {

            return res.status(404).json({
                message: "Student not found"
            });

        }

        res.json({
            message: "Student Updated Successfully"
        });

    }

    catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};
module.exports = {

    getAllStudents,

    getStudentByUSN,

    updateStudent

};