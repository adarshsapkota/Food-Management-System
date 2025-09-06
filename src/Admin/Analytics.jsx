import React, { useEffect, useState } from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { PieChart } from "@mui/x-charts/PieChart";
import { LineChart } from "@mui/x-charts/LineChart";
import "./Analytics.css";
import instance from "../axios/axiosinstance";

function Analytics() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await instance.get("/api/order");
      setOrders(res.data.data);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Failed to fetch orders.");
    } finally {
      setLoading(false);
    }
  };

  const ordersByDay = () => {
    const grouped = {};
    orders.forEach((order) => {
      const day = new Date(order.createdAt).toLocaleDateString();
      grouped[day] = (grouped[day] || 0) + 1;
    });
    return Object.entries(grouped).map(([day, count]) => ({
      day,
      orders: count,
    }));
  };

  const mostSoldItems = () => {
    const itemsMap = {};
    orders.forEach((order) => {
      order.items.forEach((item) => {
        itemsMap[item.foodName] =
          (itemsMap[item.foodName] || 0) + item.quantity;
      });
    });
    return Object.entries(itemsMap).map(([name, value], i) => ({
      id: i,
      value,
      label: name,
    }));
  };

  const revenueTrend = () => {
    const grouped = {};
    orders.forEach((order) => {
      const day = new Date(order.createdAt).toLocaleDateString();
      grouped[day] = (grouped[day] || 0) + order.totalPrice;
    });
    return Object.entries(grouped).map(([day, revenue]) => ({
      day,
      revenue,
    }));
  };

  const totalToday = () => {
    const today = new Date().toLocaleDateString();
    return orders
      .filter(
        (order) => new Date(order.createdAt).toLocaleDateString() === today
      )
      .reduce((sum, order) => sum + order.totalPrice, 0);
  };

  return (
    <div className="main-content">
      <div className="analytics-container">
        <h2>Analytics Dashboard</h2>
        {loading ? (
          <p>Loading analytics...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : (
          <>
            <div className="stats-card">
              <h3>Total Revenue Today</h3>
              <p className="revenue">Rs. {totalToday().toFixed(2)}</p>
            </div>

            <div className="charts-grid">
              <div className="chart-card">
                <h3>Orders by Day</h3>
                <BarChart
                  dataset={ordersByDay()}
                  xAxis={[{ scaleType: "band", dataKey: "day" }]}
                  series={[{ dataKey: "orders", label: "Orders" }]}
                  height={300}
                />
              </div>

              <div className="chart-card">
                <h3>Most Sold Items</h3>
                <PieChart
                  series={[
                    {
                      data: mostSoldItems(),
                    },
                  ]}
                  height={300}
                />
              </div>

              <div className="chart-card">
                <h3>Revenue Trend</h3>
                <LineChart
                  dataset={revenueTrend()}
                  xAxis={[{ dataKey: "day", scaleType: "point" }]}
                  series={[{ dataKey: "revenue", label: "Revenue (Rs.)" }]}
                  height={300}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Analytics;
