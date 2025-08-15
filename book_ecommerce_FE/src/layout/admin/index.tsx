import { Outlet, useNavigate } from "react-router-dom";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";

const AdminLayout = () => {
  const navigate = useNavigate();
  const {user} = useSelector((state: RootState) => state.auth);
  useEffect(() => {
    if (user?.role !== "admin") {
      navigate("/");
    }
  }, []);



  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <AppSidebar />
        <main className="flex-1 flex flex-col">
          {/* Header bar with trigger */}
          <div className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4">
            <SidebarTrigger className="h-8 w-8" />
            <div className="flex-1">
              <h1 className="font-semibold text-lg">Admin Dashboard</h1>
            </div>
          </div>
          
          {/* Main content */}
          <div className="flex-1">
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;