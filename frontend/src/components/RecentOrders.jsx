function RecentOrders({ data = [] }) {
  const getStatusText = (status) => {
    if (status === "delivered") return "Completed";
    if (status === "canceled" || status === "cancelled") {
      return "Cancelled";
    }

    return status
      ? status.charAt(0).toUpperCase() + status.slice(1)
      : "Unknown";
  };

  const getStatusClass = (status) => {
    if (status === "delivered") return "completed";
    if (status === "canceled" || status === "cancelled") {
      return "pending";
    }

    return "processing";
  };

  return (
    <div className="recent-orders">
      <h2>Recent Orders</h2>

      <table className="orders-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Amount</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {data.map((order, index) => (
            <tr key={order.id || index}>
              <td>{order.id}</td>

              <td>{order.customer}</td>

              <td>
                ₹
                {Number(order.amount || 0).toLocaleString("en-IN", {
                  maximumFractionDigits: 2,
                })}
              </td>

              <td className={getStatusClass(order.status)}>
                {getStatusText(order.status)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default RecentOrders;