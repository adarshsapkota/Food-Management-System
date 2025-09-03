import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import instance from "../axios/axiosinstance";
import "./ItemManagement.css";

function ItemManagement() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await instance.get("/api/food");
      console.log("Fetched food ", response.data.data.content);
      setItems(response.data.data.content);
      setError(null);
    } catch (error) {
      console.error("Error fetching items:", error);
      setError(
        error.formattedMessage || "Failed to load items. Please try again."
      );
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (itemId) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await instance.delete(`/api/food/delete/${itemId}`);
        setItems(items.filter((item) => item.id !== itemId));
        alert("Item deleted successfully");
      } catch (error) {
        console.error("Error deleting item:", error);
        alert(error.formattedMessage || "Failed to delete item");
      }
    }
  };

  const handleUpdate = (item) => {
    navigate(`/form/update/${item.id}`);
  };

  if (loading) {
    return (
      <div className="main-container">
        <div className="loading">Loading items...</div>
      </div>
    );
  }

  return (
    <div className="main-container">
      <div className="items-table-container">
        <div className="table-header">
          <h2>Menu Items Inventory</h2>
          <Link to="/form" className="btn-add">
            + Add New Item
          </Link>
        </div>

        {error && <div className="error-message global-error">{error}</div>}

        <div className="table-wrapper">
          <table className="items-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Description</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.length > 0 ? (
                items.map((item) => (
                  <tr key={item.id}>
                    <td className="item-name">{item.name}</td>
                    <td className="item-category">{item.categoryName}</td>
                    <td className="item-description">{item.description}</td>
                    <td className="item-price">${item.price?.toFixed(2)}</td>
                    <td className="item-quantity">{item.quantity}</td>
                    <td className="item-actions">
                      <button
                        className="btn-update"
                        onClick={() => handleUpdate(item)}
                        title="Edit item"
                      >
                        Edit
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => handleDelete(item.id)}
                        title="Delete item"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="no-items">
                    No items found. <Link to="/form">Add your first item</Link>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {items.length > 0 && (
          <div className="table-footer">
            <p>
              Showing {items.length} item{items.length !== 1 ? "s" : ""}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ItemManagement;
