import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import instance from "../../axios/axiosinstance";
import "./Category.css";

function Category() {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await instance.get("/api/category");
      setCategories(response.data.data);
      setError("");
    } catch (err) {
      setError("Failed to fetch categories. Please try again later.");
      console.error("Error fetching categories:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = (category) => {
    navigate("/cateform", { state: { category } });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await instance.delete(`/api/category/${id}`);
        setCategories(categories.filter((category) => category.id !== id));
      } catch (err) {
        setError("Failed to delete category. Please try again.");
        console.error("Error deleting category:", err);
      }
    }
  };

  if (loading) {
    return <div className="main-container">Loading categories...</div>;
  }

  return (
    <div className="main-container">
      <div className="items-table-container">
        <div className="table-header">
          <h2>Categories</h2>
          <Link to="/cateform" className="btn-add">
            + Add New Category
          </Link>
        </div>

        {error && <div className="error-message global-error">{error}</div>}

        <div className="table-wrapper">
          <table className="items-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.length > 0 ? (
                categories.map((category) => (
                  <tr key={category.id}>
                    <td className="category-id">{category.id}</td>
                    <td className="category-name">{category.name}</td>
                    <td className="category-description">
                      {category.description}
                    </td>
                    <td className="category-actions">
                      <button
                        className="btn-update"
                        onClick={() => handleUpdate(category)}
                        title="Edit category"
                      >
                        Edit
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => handleDelete(category.id)}
                        title="Delete category"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="no-items">
                    No categories found.{" "}
                    <Link to="/cateform">Add your first category</Link>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {categories.length > 0 && (
          <div className="table-footer">
            <p>
              Showing {categories.length} categor
              {categories.length !== 1 ? "ies" : "y"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Category;
