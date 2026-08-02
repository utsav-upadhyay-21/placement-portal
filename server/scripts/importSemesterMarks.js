const fs = require("fs");
const csv = require("csv-parser");
const db = require("../config/db");

const marks = [];

// Convert empty string -> null
function clean(value) {
    if (value === undefined || value === null || value.trim() === "") {
        return null;
    }
    return value.trim();
}

fs.createReadStream("semester_marks.csv")
    .pipe(csv())

    .on("data", (row) => {
        marks.push(row);
    })

    .on("end", async () => {

        let imported = 0;
        let skipped = 0;

        for (const row of marks) {

            try {

                if (!row.usn || row.usn.trim() === "") {
                    console.log("❌ Skipping row (Missing USN)");
                    skipped++;
                    continue;
                }

                await db.query(
                    `
                    INSERT INTO semester_marks
                    (
                        usn,
                        semester,
                        sgpa,
                        marks
                    )
                    VALUES
                    (?, ?, ?, ?)
                    `,
                    [
                        clean(row.usn),
                        parseInt(row.semester),
                        clean(row.sgpa),
                        clean(row.marks)
                    ]
                );

                imported++;

                console.log(`✅ Imported ${row.usn} - Sem ${row.semester}`);

            } catch (err) {

                skipped++;

                console.log(`❌ Failed : ${row.usn} - Sem ${row.semester}`);
                console.log(err.message);

            }

        }

        console.log("\n==========================");
        console.log(`Imported : ${imported}`);
        console.log(`Skipped  : ${skipped}`);
        console.log("==========================");

        process.exit();

    });
