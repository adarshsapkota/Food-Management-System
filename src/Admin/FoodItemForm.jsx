import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import instance from "../axios/axiosinstance";
import "./FoodItemForm.css";

function FoodItemForm() {
  const [formData, setFormData] = useState({
    name: "",
    categoryId: "",
    price: "",
    description: "",
    quantity: "",
    isActive: "true",
  });
  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      setIsEditMode(true);
      fetchItemData(id);
    }
  }, [id]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await instance.get("/api/category");
        console.log("Fetched categories:", response.data.data);
        setCategories(response.data.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const fetchItemData = async (itemId) => {
    try {
      setLoading(true);
      const response = await instance.get(`/api/food/${itemId}`);
      console.log(response.data.data);
      const item = response.data.data;

      setFormData({
        name: item.name || "",
        categoryId: item.categoryId || "",
        price: item.price || "",
        description: item.description || "",
        quantity: item.quantity || "",
        isActive: item.isActive ? "true" : "false",
      });
    } catch (error) {
      console.error("Error fetching item data:", error);
      alert("Failed to load item data");
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
    if (!formData.categoryId.trim())
      newErrors.categoryId = "Category is required";
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
        categoryId: formData.categoryId,
        price: parseFloat(formData.price),
        description: formData.description.trim(),
        quantity: parseInt(formData.quantity),
        isActive: formData.isActive === "true",
      };

      console.log("Submitting payload:", payload);

      let response;
      if (isEditMode) {
        response = await instance.put(`/api/food/update/${id}`, payload);
        console.log("Item updated successfully:", response.data.data);
        alert("Item updated successfully!");
      } else {
        response = await instance.post("/api/food/create", payload);
        console.log("Item created successfully:", response.data);
        alert("Item created successfully!");
      }

      navigate("/item");
    } catch (error) {
      console.error(
        "Error saving item:",
        error.response?.data || error.message
      );
      alert(
        "Error: " + (error.response?.data?.message || "Failed to save item")
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/item");
  };

  return (
    <div className="main-container">
      <div className="food-form-container">
        <h2>{isEditMode ? "Edit Food Item" : "Add New Food Item"}</h2>

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
            <select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              className={errors.categoryId ? "error" : ""}
              disabled={loading}
            >
              <option value="">-- Select Category --</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {errors.categoryId && (
              <span className="error-message">{errors.categoryId}</span>
            )}
          </div>

          <div className="form-group">
            <label>Price *</label>
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

          <div className="form-group">
            <label>Item Status *</label>
            <select
              name="isActive"
              value={formData.isActive}
              onChange={handleChange}
              disabled={loading}
            >
              <option value="true">Active (Visible to customers)</option>
              <option value="false">Inactive (Hidden from customers)</option>
            </select>
            <p className="dropdown-help">
              Active items will be visible to customers
            </p>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading
                ? "Processing..."
                : isEditMode
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
