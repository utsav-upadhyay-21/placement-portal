const db = require("../config/db");

const getAllFolders = async (req, res) => {

    try {

        const [rows] = await db.query(
            `
            SELECT
                f.id,
                f.name,
                f.description,
                f.created_at,
                COUNT(m.id) AS material_count
            FROM placement_folders f
            LEFT JOIN placement_materials m ON m.folder_id = f.id
            GROUP BY f.id
            ORDER BY f.name ASC
            `
        );

        res.status(200).json(rows);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

const createFolder = async (req, res) => {

    const {
        name,
        description
    } = req.body;

    if (!name) {

        return res.status(400).json({
            message: "Folder name is required"
        });

    }

    try {

        await db.query(
            `
            INSERT INTO placement_folders
            (
                name,
                description
            )
            VALUES
            (?, ?)
            `,
            [
                name,
                description || null
            ]
        );

        res.status(201).json({
            message: "Folder Created Successfully"
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

const updateFolder = async (req, res) => {

    const { id } = req.params;

    const {
        name,
        description
    } = req.body;

    if (!name) {

        return res.status(400).json({
            message: "Folder name is required"
        });

    }

    try {

        const [result] = await db.query(
            `
            UPDATE placement_folders
            SET
                name = ?,
                description = ?
            WHERE id = ?
            `,
            [
                name,
                description || null,
                id
            ]
        );

        if (result.affectedRows === 0) {

            return res.status(404).json({
                message: "Folder not found"
            });

        }

        res.json({
            message: "Folder Updated Successfully"
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

const deleteFolder = async (req, res) => {

    const { id } = req.params;

    try {

        const [result] = await db.query(
            `
            DELETE FROM placement_folders
            WHERE id = ?
            `,
            [id]
        );

        if (result.affectedRows === 0) {

            return res.status(404).json({
                message: "Folder not found"
            });

        }

        res.status(200).json({
            message: "Folder Deleted Successfully"
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

module.exports = {
    getAllFolders,
    createFolder,
    updateFolder,
    deleteFolder
};
