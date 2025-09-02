import AdminNavigation from "./Components/AdminNavigation";
import "./AdminDashboard.css";

function AdminDashboard() {
  return (
    <div className="admin-dashboard">
      <AdminNavigation />
      <div className="admin-content">
        <h1>Dashboard</h1>
      </div>
    </div>
  );
}

export default AdminDashboard;
