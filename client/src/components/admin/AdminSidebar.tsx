import { Users, Home, Smartphone, Settings, LogOut } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

const menuItems = [
  {
    title: "Gestão de Usuários",
    url: "/admin/users",
    icon: Users,
  },
  {
    title: "Gestão da Landing Page",
    url: "/admin/landing",
    icon: Home,
  },
  {
    title: "Gestão do App",
    url: "/admin/app",
    icon: Smartphone,
  },
  {
    title: "Gestão do Sistema",
    url: "/admin/system",
    icon: Settings,
  },
];

interface AdminSidebarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  onLogout: () => void;
}

export function AdminSidebar({ currentPath, onNavigate, onLogout }: AdminSidebarProps) {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Painel de Administração</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild
                    isActive={currentPath === item.url}
                    data-testid={`sidebar-${item.url.split('/').pop()}`}
                  >
                    <button onClick={() => onNavigate(item.url)} className="w-full">
                      <item.icon />
                      <span>{item.title}</span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Button 
                variant="ghost" 
                onClick={onLogout} 
                className="w-full justify-start"
                data-testid="button-admin-logout"
              >
                <LogOut />
                <span>Sair</span>
              </Button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
