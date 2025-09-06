import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import instance from "../../axios/axiosinstance";
import "./Cateform.css";

function Cateform() {
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    description: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state && location.state.category) {
      const category = location.state.category;
      setFormData({
        id: category.id,
        name: category.name,
        description: category.description,
      });
      setIsEditing(true);
    }
  }, [location.state]);

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
    if (!formData.name.trim()) newErrors.name = "Category name is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";

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
        description: formData.description.trim(),
      };

      let response;
      if (isEditing) {
        response = await instance.put(
          `/api/category/update/${formData.id}`,
          payload
        );
        console.log("Category updated:", response.data);
        alert("Category updated successfully!");
      } else {
        response = await instance.post("/api/category/create", payload);
        console.log("Category created:", response.data);
        alert("Category created successfully!");
      }

      navigate("/category");
    } catch (error) {
      console.error("Error saving category:", error);
      alert(
        "Error: " + (error.response?.data?.message || "Failed to save category")
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/category");
  };

  return (
    <div className="main-container">
      <div className="food-form-container">
        <h2>{isEditing ? "Edit Category" : "Add New Category"}</h2>

        <form onSubmit={handleSubmit} className="food-form">
          <div className="form-group">
            <label>Category Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? "error" : ""}
              placeholder="Enter category name"
              disabled={loading}
            />
            {errors.name && (
              <span className="error-message">{errors.name}</span>
            )}
          </div>

          <div className="form-group">
            <label>Description *</label>
            <textarea
              rows="3"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className={errors.description ? "error" : ""}
              placeholder="Enter description"
              maxLength="200"
              disabled={loading}
            />
            {errors.description && (
              <span className="error-message">{errors.description}</span>
            )}
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-add" disabled={loading}>
              {loading
                ? "Processing..."
                : isEditing
                ? "Update Category"
                : "Add Category"}
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

export default Cateform;
