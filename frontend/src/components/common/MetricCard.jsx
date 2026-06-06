function MetricCard({
  title,
  value,
  note,
  icon: Icon,
  danger = false
}) {
  return (
    <div className="card metric-card">
      <div>
        <p className="muted">{title}</p>

        <h2>{value}</h2>

        <span className={danger ? "down" : "up"}>
          {note}
        </span>
      </div>

      <div className="icon-bubble">
        <Icon size={22} />
      </div>
    </div>
  );
}

export default MetricCard;