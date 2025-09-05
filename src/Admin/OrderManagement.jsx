import React from "react";
import "./OrderManagement.css";

function OrderManagement() {
  const orderdetails = [
    {
      id: 1,
      totalprice: 50,
      name: "Chicken Momo",
      category: "Momo",
    },
    {
      id: 2,
      totalprice: 69,
      name: "Veg Chowmein",
      category: "Pizza",
    },
    {
      id: 3,
      totalprice: 90,
      name: "Club Sandwich",
      category: "Sandwich",
    },
  ];
  return (
    <div className="main-content">
      <div className="order-container">
        <h2>Order Report</h2>
        <div className="table-wrapper">
          <table className="order-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Price</th>
                <th>Category</th>
              </tr>
            </thead>
            <tbody>
              {orderdetails.map((order) => (
                <tr key={order.id}>
                  <td classname="order-id">{order.id}</td>
                  <td className="order-name">{order.name}</td>
                  <td className="order-price">${order.totalprice}</td>
                  <td className="order-category">{order.category}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default OrderManagement;
