import { Users, Home, Smartphone, Settings, LogOut, Shield } from "lucide-react";
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
  SidebarHeader,
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
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <div className="flex items-center gap-2">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Shield className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Permutaki</span>
                  <span className="truncate text-xs text-muted-foreground">Admin</span>
                </div>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Painel de Gestão</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild
                    isActive={currentPath === item.url}
                    tooltip={item.title}
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
            <SidebarMenuButton asChild tooltip="Sair">
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
