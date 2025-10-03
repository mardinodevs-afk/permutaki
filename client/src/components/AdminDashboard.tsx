import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "./admin/AdminSidebar";
import UsersManagement from "./admin/UsersManagement";
import LandingManagement from "./admin/LandingManagement";
import AppManagement from "./admin/AppManagement";
import SystemManagement from "./admin/SystemManagement";
import ThemeToggle from "./ThemeToggle";

interface AdminDashboardProps {
  onLogout: () => void;
}

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [currentPath, setCurrentPath] = useState("/admin/users");

  const handleLogout = () => {
    if (confirm("Tem certeza que deseja sair?")) {
      onLogout();
    }
  };

  const renderContent = () => {
    switch (currentPath) {
      case "/admin/users":
        return <UsersManagement />;
      case "/admin/landing":
        return <LandingManagement />;
      case "/admin/app":
        return <AppManagement />;
      case "/admin/system":
        return <SystemManagement />;
      default:
        return <UsersManagement />;
    }
  };

  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AdminSidebar 
          currentPath={currentPath}
          onNavigate={setCurrentPath}
          onLogout={handleLogout}
        />
        
        <div className="flex flex-col flex-1 overflow-hidden">
          <header className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-4">
              <SidebarTrigger data-testid="button-sidebar-toggle" />
              <div>
                <h1 className="text-xl font-bold text-primary">Permutaki Admin</h1>
              </div>
            </div>
            
            <ThemeToggle />
          </header>
          
          <main className="flex-1 overflow-auto p-6">
            {renderContent()}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
