const db = require("../config/db");

const getAllJobs = async (req, res) => {

    try {

        const [jobs] = await db.query(`
            SELECT *
            FROM jobs
            WHERE deadline >= NOW()
            ORDER BY deadline ASC;
        `);

        res.status(200).json(jobs);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};
const getJobById = async (req, res) => {

    try {

        const { id } = req.params;

        const [rows] = await db.query(
            `
            SELECT *
            FROM jobs
            WHERE id = ?
            AND deadline >= NOW();
            `,
            [id]
        );

        if (rows.length === 0) {

            return res.status(404).json({
                message: "Job not found"
            });

        }

        res.status(200).json(rows[0]);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};
const createJob = async (req, res) => {

    const {
        company_name,
        role,
        package,
        deadline,
        work_mode,
        branch_eligibility,
        minimum_cgpa,
        active_backlogs_allowed,
        skills_required,
        additional_notes,
        registration_link
    } = req.body;

    if (!company_name || !registration_link) {
        return res.status(400).json({
            message: "Company Name and Registration Link are required"
        });
    }

    try {

        await db.query(
            `
            INSERT INTO jobs
            (
                company_name,
                role,
                package,
                deadline,
                work_mode,
                branch_eligibility,
                minimum_cgpa,
                active_backlogs_allowed,
                skills_required,
                additional_notes,
                registration_link
            )

            VALUES
            (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `,
            [
                company_name,
                role,
                package,
                deadline,
                work_mode,
                branch_eligibility,
                minimum_cgpa,
                active_backlogs_allowed,
                skills_required,
                additional_notes,
                registration_link
            ]
        );

        res.status(201).json({
            message: "Job Created Successfully"
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};
const updateJob = async (req, res) => {

    const { id } = req.params;

    const {
        company_name,
        role,
        package,
        deadline,
        work_mode,
        branch_eligibility,
        minimum_cgpa,
        active_backlogs_allowed,
        skills_required,
        additional_notes,
        registration_link
    } = req.body;

    try {

        const [result] = await db.query(

            `
            UPDATE jobs
            SET
                company_name=?,
                role=?,
                package=?,
                deadline=?,
                work_mode=?,
                branch_eligibility=?,
                minimum_cgpa=?,
                active_backlogs_allowed=?,
                skills_required=?,
                additional_notes=?,
                registration_link=?
            WHERE id=?
            `,

            [
                company_name,
                role,
                package,
                deadline,
                work_mode,
                branch_eligibility,
                minimum_cgpa,
                active_backlogs_allowed,
                skills_required,
                additional_notes,
                registration_link,
                id
            ]

        );

        if(result.affectedRows===0){

            return res.status(404).json({
                message:"Job not found"
            });

        }

        res.json({
            message:"Job Updated Successfully"
        });

    }

    catch(error){

        res.status(500).json({
            message:error.message
        });

    }

};
const deleteJob = async (req, res) => {

    const { id } = req.params;

    try {

        const [result] = await db.query(

            `
            DELETE FROM jobs
            WHERE id = ?
            `,
            [id]

        );

        if (result.affectedRows === 0) {

            return res.status(404).json({
                message: "Job not found"
            });

        }

        res.status(200).json({
            message: "Job Deleted Successfully"
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};
module.exports = {
    getAllJobs,
    getJobById,
    createJob,
    updateJob,
    deleteJob
};