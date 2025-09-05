import { Link } from "react-router-dom";
import "./AdminNavigation.css";

function AdminNavigation() {
  return (
    <div className="Nav-Bar">
      <h1> Welcome Admin</h1>
      <Link to="/" className="link">
        Dashboard
      </Link>
      <Link to="/order" className="link">
        Order Management
      </Link>
      <Link to="/item" className="link">
        Item Management
      </Link>
      <Link to="/analytics" className="link">
        Analytics
      </Link>
    </div>
  );
}

export default AdminNavigation;
