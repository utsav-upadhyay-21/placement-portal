const db = require("../config/db");

async function setup() {

    try {

        await db.query(
            `
            CREATE TABLE IF NOT EXISTS placement_materials
            (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(200) NOT NULL,
                description TEXT,
                file_url VARCHAR(500) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
            `
        );

        await db.query(
            `
            CREATE TABLE IF NOT EXISTS placement_folders
            (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(200) NOT NULL,
                description TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
            `
        );

        const [materialColumns] = await db.query(
            `
            SELECT COLUMN_NAME
            FROM information_schema.COLUMNS
            WHERE TABLE_SCHEMA = DATABASE()
              AND TABLE_NAME = 'placement_materials'
              AND COLUMN_NAME = 'folder_id'
            `
        );

        if (materialColumns.length === 0) {

            await db.query(
                `
                ALTER TABLE placement_materials
                ADD COLUMN folder_id INT NULL,
                ADD CONSTRAINT fk_material_folder
                    FOREIGN KEY (folder_id) REFERENCES placement_folders(id)
                    ON DELETE SET NULL
                `
            );

            console.log("Added folder_id column to placement_materials");

        }

        await db.query(
            `
            CREATE TABLE IF NOT EXISTS semester_marks
            (
                id INT AUTO_INCREMENT PRIMARY KEY,
                usn VARCHAR(20) NOT NULL,
                semester INT NOT NULL,
                sgpa DECIMAL(4,2),
                marks DECIMAL(5,2),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE KEY uq_usn_semester (usn, semester),
                CONSTRAINT fk_semester_marks_usn
                    FOREIGN KEY (usn) REFERENCES students(usn)
                    ON DELETE CASCADE
            )
            `
        );

        console.log("Tables created successfully");

        const [tables] = await db.query("SHOW TABLES");

        console.log("Tables:", tables.map(t => Object.values(t)[0]).join(", "));

        process.exit(0);

    } catch (error) {

        console.error("Error creating tables:", error.message);

        process.exit(1);

    }

}

setup();
