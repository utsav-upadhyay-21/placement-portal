const fs = require("fs");
const csv = require("csv-parser");
const db = require("../config/db");

const students = [];

// Convert empty string -> null
function clean(value) {
    if (value === undefined || value === null || value.trim() === "") {
        return null;
    }
    return value.trim();
}

// Convert "95%" -> 95
function cleanDecimal(value) {
    if (!value || value.trim() === "") {
        return null;
    }

    return parseFloat(value.replace("%", "").trim());
}

fs.createReadStream("student_details.csv")
    .pipe(csv())

    .on("data", (row) => {
        students.push(row);
    })

    .on("end", async () => {

        let imported = 0;
        let skipped = 0;

        for (const row of students) {

            try {

                // Skip rows with no USN
                if (!row.usn || row.usn.trim() === "") {
                    console.log("❌ Skipping row (Missing USN)");
                    skipped++;
                    continue;
                }

                await db.query(
                    `
                    INSERT INTO students
                    (
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
                    )
                    VALUES
                    (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    `,
                    [
                        clean(row.usn),
                        clean(row.student_name),
                        clean(row.branch),
                        clean(row.phone_number),
                        clean(row.personal_email),
                        clean(row.college_email),

                        cleanDecimal(row.tenth_marks),
                        cleanDecimal(row["twelfth _marks"]),

                        cleanDecimal(row.cgpa),

                        row.active_backlogs
                            ? parseInt(row.active_backlogs)
                            : 0
                    ]
                );

                imported++;

                console.log(`✅ Imported ${row.usn}`);

            } catch (err) {

                skipped++;

                console.log(`❌ Failed : ${row.usn}`);
                console.log(err.message);

            }

        }

        console.log("\n==========================");
        console.log(`Imported : ${imported}`);
        console.log(`Skipped  : ${skipped}`);
        console.log("==========================");

        process.exit();

    });