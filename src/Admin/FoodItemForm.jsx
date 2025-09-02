import React from "react";
import { useForm } from "react-hook-form";
import "./FoodItemForm.css";

function FoodItemForm({ onSubmit, editingItem }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm();

  React.useEffect(() => {
    if (editingItem) {
      Object.keys(editingItem).forEach((key) => {
        setValue(key, editingItem[key]);
      });
    }
  }, [editingItem, setValue]);

  const onFormSubmit = (data) => {
    onSubmit(data);
    if (!editingItem) reset();
  };

  return (
    <div className="main-container">
      <div className="food-form-container">
        <h2>{editingItem ? "Edit Food Item" : "Add New Food Item"}</h2>

        <form onSubmit={handleSubmit(onFormSubmit)} className="food-form">
          <div className="form-group">
            <label>Item Name *</label>
            <input
              {...register("name", {
                required: "Item name is required",
                minLength: {
                  value: 2,
                  message: "Name must be at least 2 characters",
                },
              })}
              className={errors.name ? "error" : ""}
              placeholder="Enter item name"
            />
            {errors.name && (
              <span className="error-message">{errors.name.message}</span>
            )}
          </div>

          <div className="form-group">
            <label>Category *</label>
            <select
              {...register("category", { required: "Category is required" })}
              className={errors.category ? "error" : ""}
            >
              <option value="">Select Category</option>
              <option value="Burgers">Burgers</option>
              <option value="Pizza">Pizza</option>
              <option value="Salads">Salads</option>
              <option value="Pasta">Pasta</option>
              <option value="Beverages">Beverages</option>
            </select>
            {errors.category && (
              <span className="error-message">{errors.category.message}</span>
            )}
          </div>

          <div className="form-group">
            <label>Price ($) *</label>
            <input
              type="number"
              step="0.01"
              min="0"
              {...register("price", {
                required: "Price is required",
                min: { value: 0.01, message: "Price must be greater than 0" },
              })}
              className={errors.price ? "error" : ""}
              placeholder="0.00"
            />
            {errors.price && (
              <span className="error-message">{errors.price.message}</span>
            )}
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              rows="3"
              {...register("description", {
                maxLength: {
                  value: 200,
                  message: "Description cannot exceed 200 characters",
                },
              })}
              className={errors.description ? "error" : ""}
              placeholder="Brief description of the item"
            />
            {errors.description && (
              <span className="error-message">
                {errors.description.message}
              </span>
            )}
          </div>

          <div className="form-group">
            <label>Availability *</label>
            <select
              {...register("availability", {
                required: "Availability is required",
              })}
              className={errors.availability ? "error" : ""}
            >
              <option value="">Select Status</option>
              <option value="available">Available</option>
              <option value="unavailable">Unavailable</option>
            </select>
            {errors.availability && (
              <span className="error-message">
                {errors.availability.message}
              </span>
            )}
          </div>

          <div className="form-group">
            <label>Stock Quantity *</label>
            <input
              type="number"
              min="0"
              {...register("quantity", {
                required: "Stock quantity is required",
                min: { value: 0, message: "Quantity cannot be negative" },
              })}
              className={errors.quantity ? "error" : ""}
              placeholder="0"
            />
            {errors.quantity && (
              <span className="error-message">{errors.quantity.message}</span>
            )}
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-primary">
              {editingItem ? "Update Item" : "Add Item"}
            </button>
            {editingItem && (
              <button
                type="button"
                className="btn-secondary"
                onClick={() => reset()}
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default FoodItemForm;
