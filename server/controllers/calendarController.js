const db = require("../config/db");

const getAllEvents = async (req, res) => {

    try {

        const [events] = await db.query(`
            SELECT *
            FROM calendar_events
            ORDER BY visit_date ASC
        `);

        res.status(200).json(events);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};
const getEventById = async (req, res) => {

    try {

        const { id } = req.params;

        const [rows] = await db.query(
            `
            SELECT *
            FROM calendar_events
            WHERE id = ?
            `,
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                message: "Event not found"
            });
        }

        res.status(200).json(rows[0]);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};
const createEvent = async (req, res) => {

    const {
        company_name,
        visit_date,
        description
    } = req.body;

    if (!company_name || !visit_date) {

        return res.status(400).json({
            message: "Company Name and Visit Date are required"
        });

    }

    try {

        await db.query(

            `
            INSERT INTO calendar_events
            (
                company_name,
                visit_date,
                description
            )

            VALUES
            (?, ?, ?)
            `,

            [
                company_name,
                visit_date,
                description
            ]

        );

        res.status(201).json({

            message: "Event Created Successfully"

        });

    }

    catch(error){

        res.status(500).json({

            message:error.message

        });

    }

};
const updateEvent = async (req, res) => {

    const { id } = req.params;

    const {
        company_name,
        visit_date,
        description
    } = req.body;

    if (!company_name || !visit_date) {

        return res.status(400).json({
            message: "Company Name and Visit Date are required"
        });

    }

    try {

        const [result] = await db.query(

            `
            UPDATE calendar_events
            SET
                company_name = ?,
                visit_date = ?,
                description = ?
            WHERE id = ?
            `,

            [
                company_name,
                visit_date,
                description,
                id
            ]

        );

        if (result.affectedRows === 0) {

            return res.status(404).json({
                message: "Event not found"
            });

        }

        res.status(200).json({
            message: "Event Updated Successfully"
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};
const deleteEvent = async (req, res) => {

    const { id } = req.params;

    try {

        const [result] = await db.query(

            `
            DELETE FROM calendar_events
            WHERE id = ?
            `,

            [id]

        );

        if (result.affectedRows === 0) {

            return res.status(404).json({
                message: "Event not found"
            });

        }

        res.status(200).json({
            message: "Event Deleted Successfully"
        });

    }

    catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};
module.exports = {
    getAllEvents,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent
};