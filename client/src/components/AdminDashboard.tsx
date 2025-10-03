import { useState } from "react";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AdminSidebar } from "./admin/AdminSidebar";
import UsersManagement from "./admin/UsersManagement";
import LandingManagement from "./admin/LandingManagement";
import AppManagement from "./admin/AppManagement";
import SystemManagement from "./admin/SystemManagement";
import ThemeToggle from "./ThemeToggle";
import { Separator } from "@/components/ui/separator";

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

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <AdminSidebar 
          currentPath={currentPath}
          onNavigate={setCurrentPath}
          onLogout={handleLogout}
        />
        
        <SidebarInset className="flex flex-col flex-1">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" data-testid="button-sidebar-toggle" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <div className="flex items-center justify-between flex-1">
              <h1 className="text-xl font-bold text-primary">Painel de Administração</h1>
              <ThemeToggle />
            </div>
          </header>
          
          <main className="flex-1 overflow-auto p-6">
            {renderContent()}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
