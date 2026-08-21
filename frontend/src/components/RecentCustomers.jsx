function RecentCustomers({ data = [] }) {
  return (
    <div className="recent-customers">
      <h3>Recent Customers</h3>

      {data.length === 0 ? (
        <p>No customers available</p>
      ) : (
        data.map((customer, index) => (
          <div
            className="customer-row"
            key={index}
          >
            <strong>
              {customer.name}
            </strong>

            <span>
              {customer.city}
              {customer.state
                ? `, ${customer.state}`
                : ""}
            </span>
          </div>
        ))
      )}
    </div>
  );
}

export default RecentCustomers;