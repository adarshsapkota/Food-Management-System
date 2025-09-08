import { useState, useEffect } from "react";
import AdminNavigation from "./Components/AdminNavigation";
import "./AdminDashboard.css";
import instance from "../axios/axiosinstance";

function AdminDashboard() {
  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchFoods();
    fetchCategories();
    fetchOrders();
  }, []);

  const fetchFoods = async () => {
    try {
      const res = await instance.get("/api/food");
      setFoods(res.data.data.content);
    } catch (err) {
      setError("Failed to fetch foods.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await instance.get("/api/category");
      setCategories(res.data.data);
    } catch (err) {
      setError("Failed to fetch categories.");
      console.error(err);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await instance.get("/api/admin/order");
      setOrders(res.data.data);
    } catch (err) {
      setError("Failed to fetch orders.");
      console.error(err);
    }
  };

  const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0);

  const mostSoldItems = () => {
    const itemMap = {};
    orders.forEach((order) => {
      order.items.forEach((item) => {
        itemMap[item.foodName] = (itemMap[item.foodName] || 0) + item.quantity;
      });
    });

    return Object.entries(itemMap)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([name, quantity]) => ({ name, quantity }));
  };

  return (
    <div className="admin-dashboard">
      <AdminNavigation />
      <div className="admin-content">
        <div className="grid-container">
          <div className="grid-item food-items">
            <h2>Recently Added Foods</h2>
            {loading ? (
              <p>Loading foods...</p>
            ) : foods.length > 0 ? (
              <ul className="recent-food-list">
                {foods
                  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                  .slice(0, 5)
                  .map((food) => (
                    <li key={food.id} className="recent-food-card">
                      <div className="food-left">
                        <h3>{food.name}</h3>
                        <small className="food-date">
                          {new Date(food.createdAt).toLocaleDateString()}{" "}
                          {new Date(food.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </small>
                      </div>
                      <span
                        className={`status-badge ${
                          food.isActive ? "active" : "inactive"
                        }`}
                      >
                        {food.isActive ? "Active" : "Inactive"}
                      </span>
                    </li>
                  ))}
              </ul>
            ) : (
              <p>No foods available.</p>
            )}
          </div>

          <div className="grid-item analytics-top">
            <h2>Total Revenue</h2>
            {orders.length > 0 ? (
              <div className="revenue-card">
                <p className="revenue-amount">Rs. {totalRevenue.toFixed(2)}</p>
                <p className="revenue-note">Total earnings from all orders</p>
              </div>
            ) : loading ? (
              <p>Loading orders...</p>
            ) : (
              <p>No orders available.</p>
            )}
          </div>

          <div className="grid-item analytics-bottom">
            <h2>Most Sold Items</h2>
            {orders.length > 0 ? (
              <ul className="item-list">
                {mostSoldItems().map((item, index) => (
                  <li key={index} className="item-card">
                    <h3>{item.name}</h3>
                    <p className="item-quantity">Sold: {item.quantity}</p>
                  </li>
                ))}
              </ul>
            ) : loading ? (
              <p>Loading orders...</p>
            ) : (
              <p>No order data available.</p>
            )}
          </div>

          <div className="grid-item categories-section">
            <h2>Categories</h2>
            {loading ? (
              <p>Loading categories...</p>
            ) : categories.length > 0 ? (
              <ul className="item-list">
                {categories.map((cat) => (
                  <li key={cat.id} className="item-card">
                    <h3>{cat.name}</h3>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No categories available.</p>
            )}
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}
      </div>
    </div>
  );
}

export default AdminDashboard;
