function StudentCard({ student }) {
  return (
    <div className="student-card">
      <h3>{student.student_name}</h3>
      <p><strong>USN:</strong> {student.usn}</p>
      <p><strong>Branch:</strong> {student.branch}</p>
      <p><strong>CGPA:</strong> {student.cgpa}</p>
      <p><strong>Email:</strong> {student.college_email || student.personal_email || "N/A"}</p>
      <p><strong>Phone:</strong> {student.phone_number}</p>
      <p><strong>Backlogs:</strong> {student.active_backlogs}</p>
    </div>
  );
}

export default StudentCard;
