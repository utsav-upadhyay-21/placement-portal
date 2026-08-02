const db = require("../config/db");

const getAllMaterials = async (req, res) => {

    try {

        const [rows] = await db.query(
            `
            SELECT
                m.id,
                m.title,
                m.description,
                m.file_url,
                m.folder_id,
                m.created_at,
                f.name AS folder_name
            FROM placement_materials m
            LEFT JOIN placement_folders f ON f.id = m.folder_id
            ORDER BY m.created_at DESC
            `
        );

        res.status(200).json(rows);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

const createMaterial = async (req, res) => {

    const {
        title,
        description,
        file_url,
        folder_id
    } = req.body;

    if (!title || !file_url) {

        return res.status(400).json({
            message: "Title and File URL are required"
        });

    }

    try {

        if (folder_id) {

            const [folder] = await db.query(
                "SELECT id FROM placement_folders WHERE id = ?",
                [folder_id]
            );

            if (folder.length === 0) {

                return res.status(400).json({
                    message: "Folder not found"
                });

            }

        }

        await db.query(
            `
            INSERT INTO placement_materials
            (
                title,
                description,
                file_url,
                folder_id
            )
            VALUES
            (?, ?, ?, ?)
            `,
            [
                title,
                description || null,
                file_url,
                folder_id || null
            ]
        );

        res.status(201).json({
            message: "Material Created Successfully"
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

const updateMaterial = async (req, res) => {

    const { id } = req.params;

    const {
        title,
        description,
        file_url,
        folder_id
    } = req.body;

    if (!title || !file_url) {

        return res.status(400).json({
            message: "Title and File URL are required"
        });

    }

    try {

        if (folder_id) {

            const [folder] = await db.query(
                "SELECT id FROM placement_folders WHERE id = ?",
                [folder_id]
            );

            if (folder.length === 0) {

                return res.status(400).json({
                    message: "Folder not found"
                });

            }

        }

        const [result] = await db.query(
            `
            UPDATE placement_materials
            SET
                title = ?,
                description = ?,
                file_url = ?,
                folder_id = ?
            WHERE id = ?
            `,
            [
                title,
                description || null,
                file_url,
                folder_id || null,
                id
            ]
        );

        if (result.affectedRows === 0) {

            return res.status(404).json({
                message: "Material not found"
            });

        }

        res.json({
            message: "Material Updated Successfully"
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

const deleteMaterial = async (req, res) => {

    const { id } = req.params;

    try {

        const [result] = await db.query(
            `
            DELETE FROM placement_materials
            WHERE id = ?
            `,
            [id]
        );

        if (result.affectedRows === 0) {

            return res.status(404).json({
                message: "Material not found"
            });

        }

        res.status(200).json({
            message: "Material Deleted Successfully"
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

module.exports = {
    getAllMaterials,
    createMaterial,
    updateMaterial,
    deleteMaterial
};
