import { useState } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { queryClient } from "./lib/queryClient";
import LandingPage from "@/components/LandingPage";
import UserDashboard from "@/components/UserDashboard";
import AdminDashboard from "@/components/AdminDashboard";

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

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);

        // Get user profile
        const profileResponse = await fetch('/api/user/profile', {
          headers: {
            'Authorization': `Bearer ${data.token}`,
          },
        });

        if (profileResponse.ok) {
          const userData = await profileResponse.json();
          const user: User = {
            id: userData.id,
            name: `${userData.firstName} ${userData.lastName}`,
            phone: userData.phone,
            isAdmin: userData.isAdmin || false
          };
          setCurrentUser(user);
        }
      } else {
        const error = await response.json();
        alert(error.message || 'Erro ao fazer login');
      }
    } catch (error) {
      alert('Erro de conexão');
    }

    setIsLoading(false);
  };

  const handleRegister = async (data: any) => {
    setIsLoading(true);

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: data.firstName,
          lastName: data.lastName,
          sector: data.sector,
          salaryLevel: parseInt(data.salaryLevel),
          grade: data.grade,
          currentProvince: data.currentProvince,
          currentDistrict: data.currentDistrict,
          desiredProvince: data.desiredProvince,
          desiredDistrict: data.desiredDistrict,
          phone: data.phone,
          email: data.email,
          password: data.password,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        localStorage.setItem('token', result.token);

        const user: User = {
          id: result.user.id,
          name: `${result.user.firstName} ${result.user.lastName}`,
          phone: result.user.phone,
          isAdmin: result.user.isAdmin || false
        };
        setCurrentUser(user);
      } else {
        const error = await response.json();
        alert(error.message || 'Erro ao criar conta');
      }
    } catch (error) {
      alert('Erro de conexão');
    }

    setIsLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
  };

  // This function was not present in the original code, but it's used in the changes.
  // Assuming it's meant to be called after a successful login.
  const handleLoginSuccess = (userData: User) => {
    setCurrentUser(userData);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        {currentUser ? (
          currentUser.isAdmin ? (
            <AdminDashboard onLogout={handleLogout} />
          ) : (
            <UserDashboard onLogout={handleLogout} />
          )
        ) : (
          <LandingPage onLoginSuccess={handleLoginSuccess} />
        )}
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;