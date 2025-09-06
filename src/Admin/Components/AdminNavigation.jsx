import { Link, useNavigate } from "react-router-dom";
import "./AdminNavigation.css";

function AdminNavigation() {
  const navigate = useNavigate();
  const handleSignOut = () => {
    localStorage.removeItem("token");
    navigate("/");
  };
  return (
    <div className="Nav-Bar">
      <h1> Welcome Admin</h1>
      <Link to="/admindash" className="link">
        Dashboard
      </Link>
      <Link to="/order" className="link">
        Order Report
      </Link>
      <Link to="/item" className="link">
        Item Management
      </Link>
      <Link to="/analytics" className="link">
        Analytics
      </Link>
      <button onClick={handleSignOut} className="link signout-btn">
        Sign Out
      </button>
    </div>
  );
}

export default AdminNavigation;
