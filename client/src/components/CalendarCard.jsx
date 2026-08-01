function CalendarCard({ event, onClick }) {
  return (
    <div className="calendar-card" onClick={() => onClick(event)}>
      <h3>{event.company_name}</h3>
      <p className="calendar-date">
        {new Date(event.visit_date).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })}
      </p>
    </div>
  );
}

export default CalendarCard;
