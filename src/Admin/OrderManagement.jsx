import React, { useEffect, useState } from "react";
import instance from "../axios/axiosinstance";
import "./OrderManagement.css";

function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await instance.get("/api/admin/order");
      console.log("Fetched orders: ", response.data.data);
      setOrders(response.data.data);
      setError(null);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError(error.message || "Failed to load orders.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
      case "completed":
        return "status-badge success";
      case "pending":
        return "status-badge pending";
      case "canceled":
        return "status-badge danger";
      default:
        return "status-badge";
    }
  };

  return (
    <div className="main-content">
      <div className="order-container">
        <h2>Order's</h2>

        {loading ? (
          <p className="loading">Loading orders...</p>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : (
          <div className="table-wrapper">
            <table className="order-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Status</th>
                  <th>Total Price</th>
                  <th>Customer Phone</th>
                  <th>Delivery Address</th>
                  <th>Created At</th>
                  <th>Items</th>
                </tr>
              </thead>
              <tbody>
                {orders.length > 0 ? (
                  orders.map((order) => (
                    <tr key={order.id}>
                      <td>{order.id}</td>
                      <td>
                        <span className={getStatusClass(order.status)}>
                          {order.status}
                        </span>
                      </td>
                      <td>{order.totalPrice?.toFixed(2)}</td>
                      <td>{order.phoneNumber}</td>
                      <td>{order.deliveryAddress}</td>
                      <td>
                        {new Date(order.createdAt).toLocaleString("en-US", {
                          dateStyle: "short",
                          timeStyle: "medium",
                        })}
                      </td>
                      <td>
                        <ul className="items-list">
                          {order.items.map((item, idx) => (
                            <li key={idx}>
                              {item.foodName} × {item.quantity} =
                              {item.lineTotal?.toFixed(2)}
                            </li>
                          ))}
                        </ul>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="no-orders">
                      No orders found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default OrderManagement;
