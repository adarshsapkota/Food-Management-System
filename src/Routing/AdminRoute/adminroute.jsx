import { Route } from "react-router-dom";
import AdminDashboard from "../../Admin/AdminDashboard";
import AdminLayout from "./adminlayout";
import ItemManagement from "../../Admin/ItemManagement";
import OrderManagement from "../../Admin/OrderManagement";
import Analytics from "../../Admin/Analytics";
import FoodItemForm from "../../Admin/FoodItemForm";
import Category from "../../Admin/Components/Category";
import Cateform from "../../Admin/Components/cateform";

export default function adminroute() {
  return (
    <Route element={<AdminLayout />}>
      <Route path="/admindash" element={<AdminDashboard />} />
      <Route path="/item" element={<ItemManagement />} />
      <Route path="/order" element={<OrderManagement />} />
      <Route path="/analytics" element={<Analytics />} />
      <Route path="/form" element={<FoodItemForm />} />
      <Route path="/form/update/:id" element={<FoodItemForm />} />
      <Route path="/category" element={<Category />} />
      <Route path="/cateform" element={<Cateform />} />
    </Route>
  );
}
