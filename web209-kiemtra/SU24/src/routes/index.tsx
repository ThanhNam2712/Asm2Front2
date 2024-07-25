import LayoutAdmin from "@/pages/(admin)/layout";
import ProductManagementPage from "@/pages/(admin)/product/page";
import { Route, Routes } from "react-router-dom";
import ProductAddPage from "@/pages/(admin)/product/add/page";
import ProductEditPage from "@/pages/(admin)/product/edit/page";


const Router = () => {
    return (
     <Routes>
        <Route path="admin" element={<LayoutAdmin />}>
                {/* <Route index element={<Dashboard />} /> */}
                <Route path="products" element={<ProductManagementPage />} />
                <Route path="products/add" element={<ProductAddPage />} />
                <Route path="products/:id/edit" element={<ProductEditPage />} />
            </Route>
     </Routes>
    );
};
export default Router;
