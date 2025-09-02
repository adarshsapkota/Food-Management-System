import { Link } from "react-router-dom";
import "./ItemManagement.css";

function ItemManagement() {
  const handleDelete = () => {};
  const handleUpdate = () => {};
  const items = [
    {
      id: 1,
      name: "Classic Burger",
      category: "Burgers",
      description: "Beef patty with lettuce, tomato, and special sauce",
      quantity: 45,
    },
    {
      id: 2,
      name: "Margherita Pizza",
      category: "Pizza",
      description: "Classic pizza with tomato, mozzarella, and basil",
      quantity: 28,
    },
  ];
  return (
    <div className="main-container">
      <div className="items-table-container">
        <h2>Menu Items Inventory</h2>
        <Link to="/form" className="btn-add">
          + Add Item
        </Link>
        <div className="table-wrapper">
          <table className="items-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Description</th>
                <th>Quantity</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td className="item-name">{item.name}</td>
                  <td className="item-category">{item.category}</td>
                  <td className="item-description">{item.description}</td>
                  <td className="item-quantity">{item.quantity}</td>
                  <td className="item-actions">
                    <button
                      className="btn-update"
                      onClick={() => handleUpdate(item)}
                    >
                      Update
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(item.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ItemManagement;
