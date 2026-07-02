function StatCard({ title, value }) {
  return (
    <div className="col-md-6 col-lg-3">
      <div className="card dark-card stat-card">
        <div className="card-body">
          <h6 className="card-title">{title}</h6>
          <h3 className="card-value">{value}</h3>
        </div>
      </div>
    </div>
  );
}

export default StatCard;
