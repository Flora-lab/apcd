import Sidebar from "../components/admin/Sidebar";
import Topbar from "../components/admin/Topbar";
import { Outlet } from "react-router-dom";

const AdminDashboard = () => {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Topbar />
        <div className="p-6 bg-gray-100 flex-1 overflow-y-auto">
          <Outlet /> {/* Contenu des sous-pages */}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
