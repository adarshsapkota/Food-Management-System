import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import instance from "../axios/axiosinstance";
import "./FoodItemForm.css";

function FoodItemForm() {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    description: "",
    quantity: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  useEffect(() => {
    if (id) {
      fetchItemData();
    }
  }, [id]);

  const fetchItemData = async () => {
    try {
      setLoading(true);
      const response = await instance.get(`/api/food/${id}`);
      const item = response.data;

      setFormData({
        name: item.name || "",
        category: item.category || "",
        price: item.price || "",
        description: item.description || "",
        quantity: item.quantity || "",
      });
    } catch (error) {
      console.error("Error fetching item:", error);
      alert("Failed to load item data");
      navigate("/items");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Item name is required";
    if (!formData.category.trim()) newErrors.category = "Category is required";
    if (!formData.price || parseFloat(formData.price) <= 0)
      newErrors.price = "Price must be greater than 0";
    if (!formData.quantity || parseInt(formData.quantity) < 0)
      newErrors.quantity = "Quantity cannot be negative";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const payload = {
        name: formData.name.trim(),
        category: formData.category.trim(),
        price: parseFloat(formData.price),
        description: formData.description.trim(),
        quantity: parseInt(formData.quantity),
        isAvailable: parseInt(formData.quantity) > 0,
      };

      let response;
      if (isEditing) {
        response = await instance.put(`/api/food/update/${id}`, payload);
      } else {
        response = await instance.post("/api/food/create", payload);
      }

      console.log("Item saved successfully:", response.data);
      alert(
        isEditing ? "Item updated successfully!" : "Item created successfully!"
      );
      navigate("/items");
    } catch (error) {
      console.error("Error saving item:", error);
      alert(
        "Error: " + (error.response?.data?.message || "Failed to save item")
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/items");
  };

  return (
    <div className="main-container">
      <div className="food-form-container">
        <h2>{isEditing ? "Edit Food Item" : "Add New Food Item"}</h2>

        <form onSubmit={handleSubmit} className="food-form">
          <div className="form-group">
            <label>Item Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? "error" : ""}
              placeholder="Enter item name"
              disabled={loading}
            />
            {errors.name && (
              <span className="error-message">{errors.name}</span>
            )}
          </div>

          <div className="form-group">
            <label>Category *</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={errors.category ? "error" : ""}
              placeholder="Enter category"
              disabled={loading}
            />
            {errors.category && (
              <span className="error-message">{errors.category}</span>
            )}
          </div>

          <div className="form-group">
            <label>Price ($) *</label>
            <input
              type="number"
              step="0.01"
              min="0"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className={errors.price ? "error" : ""}
              placeholder="0.00"
              disabled={loading}
            />
            {errors.price && (
              <span className="error-message">{errors.price}</span>
            )}
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              rows="3"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Brief description of the item"
              maxLength="200"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Stock Quantity *</label>
            <input
              type="number"
              min="0"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              className={errors.quantity ? "error" : ""}
              placeholder="0"
              disabled={loading}
            />
            {errors.quantity && (
              <span className="error-message">{errors.quantity}</span>
            )}
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading
                ? "Processing..."
                : isEditing
                ? "Update Item"
                : "Add Item"}
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={handleCancel}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default FoodItemForm;
