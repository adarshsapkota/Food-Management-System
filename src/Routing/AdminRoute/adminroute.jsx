import { Route } from "react-router-dom";
import AdminDashboard from "../../Admin/AdminDashboard";
import AdminLayout from "./adminlayout";
import ItemManagement from "../../Admin/ItemManagement";
import OrderManagement from "../../Admin/OrderManagement";
import Analytics from "../../Admin/Analytics";
import FoodItemForm from "../../Admin/FoodItemForm";

export default function adminroute() {
  return (
    <Route element={<AdminLayout />}>
      <Route path="/admindash" element={<AdminDashboard />} />
      <Route path="/item" element={<ItemManagement />} />
      <Route path="/order" element={<OrderManagement />} />
      <Route path="/analytics" element={<Analytics />} />
      <Route path="/form" element={<FoodItemForm />} />
      <Route path="/form/ :id" element={<FoodItemForm />} />
    </Route>
  );
}
