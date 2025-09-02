import { Outlet, outlet } from "react-router-dom";
import AdminNavigation from "../../Admin/Components/AdminNavigation";

const AdminLayout = () => {
  return (
    <div>
      <AdminNavigation />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
