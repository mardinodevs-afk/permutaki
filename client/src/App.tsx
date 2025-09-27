import { useState } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { queryClient } from "./lib/queryClient";
import LandingPage from "@/components/LandingPage";
import UserDashboard from "@/components/UserDashboard";

// todo: remove mock functionality - user authentication state
type User = {
  id: string;
  name: string;
  phone: string;
  isAdmin: boolean;
};

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (phone: string, password: string) => {
    setIsLoading(true);
    console.log("Login attempt:", { phone, password: "***" });
    
    // todo: remove mock functionality - simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // todo: remove mock functionality - mock user data
    const mockUser: User = {
      id: "user123",
      name: "João Silva", 
      phone: phone,
      isAdmin: phone === "+258123456789" // Mock admin check
    };
    
    setCurrentUser(mockUser);
    setIsLoading(false);
  };

  const handleRegister = async (data: any) => {
    setIsLoading(true);
    console.log("Registration data:", data);
    
    // todo: remove mock functionality - simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // todo: remove mock functionality - mock user creation
    const newUser: User = {
      id: "new-user",
      name: `${data.firstName} ${data.lastName}`,
      phone: data.phone,
      isAdmin: false
    };
    
    setCurrentUser(newUser);
    setIsLoading(false);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        {currentUser ? (
          <UserDashboard onLogout={handleLogout} />
        ) : (
          <LandingPage onLogin={handleLogin} onRegister={handleRegister} />
        )}
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
