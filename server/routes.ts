
import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUserSchema, 
  loginUserSchema, 
  requestPasswordResetSchema, 
  resetPasswordSchema,
  changePasswordSchema 
} from "@shared/schema";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET must be set. Please configure a strong secret key.");
}

const JWT_SECRET = process.env.JWT_SECRET;

// Middleware to verify JWT token
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token de acesso necessário' });
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return res.status(403).json({ message: 'Token inválido' });
    req.user = user;
    next();
  });
};

// Middleware to verify admin status
const requireAdmin = async (req: any, res: any, next: any) => {
  try {
    const user = await storage.getUserById(req.user.id);
    if (!user?.isAdmin) {
      return res.status(403).json({ message: 'Acesso negado' });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth routes
  app.post("/api/register", async (req, res) => {
    try {
      console.log('Registration request received:', req.body);
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByPhone(userData.phone);
      if (existingUser) {
        return res.status(400).json({ message: 'Usuário já existe com este número de telefone' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      
      // Create user
      const newUser = await storage.insertUser({
        ...userData,
        password: hashedPassword,
      });

      // Generate token
      const token = jwt.sign({ id: newUser.id, phone: newUser.phone }, JWT_SECRET);

      res.status(201).json({
        token,
        user: {
          id: newUser.id,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          phone: newUser.phone,
          email: newUser.email,
          isPremium: newUser.isPremium,
          isAdmin: newUser.isAdmin,
        }
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(400).json({ message: 'Erro ao registrar usuário' });
    }
  });

  app.post("/api/login", async (req, res) => {
    try {
      console.log('Login request received for phone:', req.body.phone);
      const { phone, password } = loginUserSchema.parse(req.body);
      
      const user = await storage.getUserByPhone(phone);
      if (!user || !user.isActive) {
        return res.status(401).json({ message: 'Credenciais inválidas' });
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ message: 'Credenciais inválidas' });
      }

      const token = jwt.sign({ id: user.id, phone: user.phone }, JWT_SECRET);

      res.json({
        token,
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          phone: user.phone,
          email: user.email,
          isPremium: user.isPremium,
          isAdmin: user.isAdmin,
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(400).json({ message: 'Erro ao fazer login' });
    }
  });

  // Password recovery routes
  app.post("/api/auth/request-password-reset", async (req, res) => {
    try {
      const { phone } = requestPasswordResetSchema.parse(req.body);
      
      const user = await storage.getUserByPhone(phone);
      if (!user || !user.isActive) {
        return res.status(404).json({ message: 'Telefone não encontrado' });
      }

      // Check if user already has a request from today
      if (user.resetPasswordRequestedAt) {
        const requestedDate = new Date(user.resetPasswordRequestedAt);
        const now = new Date();
        const timeDiff = now.getTime() - requestedDate.getTime();
        const hoursDiff = timeDiff / (1000 * 3600);
        
        if (hoursDiff < 24) {
          return res.status(429).json({ 
            message: 'Você já solicitou recuperação de senha hoje. Tente novamente amanhã.' 
          });
        }
      }

      const result = await storage.createPasswordResetRequest(phone);
      
      if (!result.success) {
        return res.status(400).json({ message: result.message });
      }

      console.log(`Password reset requested for ${phone}`);
      
      res.json({ 
        message: 'Solicitação enviada com sucesso. O administrador receberá sua solicitação.'
      });
    } catch (error) {
      console.error('Request password reset error:', error);
      res.status(400).json({ message: 'Erro ao processar solicitação' });
    }
  });

  app.post("/api/auth/reset-password", async (req, res) => {
    try {
      const { phone, token, newPassword } = resetPasswordSchema.parse(req.body);
      
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      
      const result = await storage.resetPasswordWithToken(phone, token, hashedPassword);
      
      if (!result.success) {
        return res.status(400).json({ message: result.message });
      }

      res.json({ message: 'Senha redefinida com sucesso' });
    } catch (error) {
      console.error('Password reset error:', error);
      res.status(400).json({ message: 'Erro ao redefinir senha' });
    }
  });

  // Direct password reset (after master key verification)
  app.post("/api/auth/reset-password-direct", async (req, res) => {
    try {
      const { resetToken, newPassword } = req.body;
      
      if (!resetToken || !newPassword) {
        return res.status(400).json({ message: 'Token e nova senha são obrigatórios' });
      }

      if (newPassword.length < 8) {
        return res.status(400).json({ message: 'Senha deve ter pelo menos 8 caracteres' });
      }

      // Verify reset token
      let decoded: any;
      try {
        decoded = jwt.verify(resetToken, JWT_SECRET);
        
        // Verify token purpose
        if (decoded.purpose !== 'password_reset') {
          return res.status(403).json({ message: 'Token inválido' });
        }
      } catch (err) {
        return res.status(403).json({ message: 'Token inválido ou expirado' });
      }

      const user = await storage.getUserById(decoded.userId);
      if (!user || !user.isActive) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      const result = await storage.updatePassword(user.id, hashedPassword);
      
      if (!result.success) {
        return res.status(400).json({ message: result.message });
      }

      console.log(`Password reset successfully for ${user.phone}`);
      res.json({ message: 'Senha redefinida com sucesso' });
    } catch (error) {
      console.error('Direct password reset error:', error);
      res.status(400).json({ message: 'Erro ao redefinir senha' });
    }
  });

  app.post("/api/auth/change-password", authenticateToken, async (req: any, res) => {
    try {
      const { currentPassword, newPassword } = changePasswordSchema.parse(req.body);
      
      const user = await storage.getUserById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
      }

      const validPassword = await bcrypt.compare(currentPassword, user.password);
      if (!validPassword) {
        return res.status(401).json({ message: 'Senha atual incorreta' });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      const result = await storage.updatePassword(user.id, hashedPassword);
      
      if (!result.success) {
        return res.status(400).json({ message: result.message });
      }

      res.json({ message: 'Senha alterada com sucesso' });
    } catch (error) {
      console.error('Password change error:', error);
      res.status(400).json({ message: 'Erro ao alterar senha' });
    }
  });

  // User routes
  app.get("/api/user/profile", authenticateToken, async (req: any, res) => {
    try {
      const user = await storage.getUserById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
      }

      res.json({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        sector: user.sector,
        salaryLevel: user.salaryLevel,
        grade: user.grade,
        currentProvince: user.currentProvince,
        currentDistrict: user.currentDistrict,
        desiredProvince: user.desiredProvince,
        desiredDistrict: user.desiredDistrict,
        phone: user.phone,
        email: user.email,
        isPremium: user.isPremium,
        isAdmin: user.isAdmin,
        createdAt: user.createdAt,
      });
    } catch (error) {
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  });

  app.get("/api/users/search", authenticateToken, async (req: any, res) => {
    try {
      const { sector, currentProvince, desiredProvince } = req.query;
      const currentUserId = req.user.id;
      
      let users = await storage.getAllUsers();
      
      // Filter out current user, inactive users, admin users and banned users
      users = users.filter(user => 
        user.id !== currentUserId && 
        user.isActive && 
        !user.isAdmin && 
        !user.isBanned
      );
      
      // Apply filters
      if (sector) {
        users = users.filter(user => user.sector === sector);
      }
      
      if (currentProvince) {
        users = users.filter(user => user.currentProvince === currentProvince);
      }
      
      if (desiredProvince) {
        users = users.filter(user => user.desiredProvince === desiredProvince);
      }
      
      // Return filtered users
      const filteredUsers = users.map(user => ({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        sector: user.sector,
        salaryLevel: user.salaryLevel,
        grade: user.grade,
        currentProvince: user.currentProvince,
        currentDistrict: user.currentDistrict,
        desiredProvince: user.desiredProvince,
        desiredDistrict: user.desiredDistrict,
        rating: 0, // TODO: Calculate from ratings table
        reviewCount: 0 // TODO: Calculate from ratings table
      }));
      
      res.json(filteredUsers);
    } catch (error) {
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  });

  app.put("/api/user/location", authenticateToken, async (req: any, res) => {
    try {
      const { type, province, district } = req.body;
      
      if (!type || !province || !district) {
        return res.status(400).json({ message: 'Dados incompletos' });
      }

      const result = await storage.updateUserLocation(req.user.id, type, province, district);
      
      if (result.success) {
        res.json({ message: 'Localização atualizada com sucesso' });
      } else {
        res.status(400).json({ message: result.message });
      }
    } catch (error) {
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  });

  app.put("/api/user/salary", authenticateToken, async (req: any, res) => {
    try {
      const { salaryLevel, grade } = req.body;
      
      const result = await storage.updateUser(req.user.id, { salaryLevel, grade });
      
      if (result) {
        res.json({ message: 'Nível salarial atualizado com sucesso' });
      } else {
        res.status(400).json({ message: 'Erro ao atualizar nível salarial' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  });

  app.put("/api/user/password", authenticateToken, async (req: any, res) => {
    try {
      const { currentPassword, newPassword } = req.body;
      
      const user = await storage.getUserById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
      }

      const validPassword = await bcrypt.compare(currentPassword, user.password);
      if (!validPassword) {
        return res.status(401).json({ message: 'Senha atual incorreta' });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      const result = await storage.updatePassword(req.user.id, hashedPassword);
      
      if (result.success) {
        res.json({ message: 'Senha atualizada com sucesso' });
      } else {
        res.status(400).json({ message: result.message });
      }
    } catch (error) {
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  });

  app.delete("/api/user/account", authenticateToken, async (req: any, res) => {
    try {
      const result = await storage.deleteUser(req.user.id);
      
      if (result) {
        res.json({ message: 'Conta deletada com sucesso' });
      } else {
        res.status(400).json({ message: 'Erro ao deletar conta' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  });

  // Feedback routes
  app.post("/api/feedback", authenticateToken, async (req: any, res) => {
    try {
      const { type, subject, message, email, name } = req.body;
      
      if (!type || !message) {
        return res.status(400).json({ message: 'Tipo e mensagem são obrigatórios' });
      }

      // Log feedback for now (in a real app, you'd save to database)
      console.log('Feedback recebido:', {
        userId: req.user.id,
        type,
        subject,
        message,
        email,
        name,
        timestamp: new Date()
      });

      res.json({ message: 'Feedback enviado com sucesso' });
    } catch (error) {
      console.error('Erro ao processar feedback:', error);
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  });

  // Admin routes
  app.get("/api/admin/users", authenticateToken, requireAdmin, async (req: any, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  });

  app.get("/api/admin/location-history", authenticateToken, requireAdmin, async (req: any, res) => {
    try {
      const history = await storage.getLocationHistory();
      res.json(history);
    } catch (error) {
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  });

  app.get("/api/admin/stats", authenticateToken, requireAdmin, async (req: any, res) => {
    try {
      const stats = await storage.getUserStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  });

  app.put("/api/admin/user/:id/status", authenticateToken, requireAdmin, async (req: any, res) => {
    try {
      const { id } = req.params;
      const { isActive } = req.body;
      
      const result = await storage.toggleUserStatus(id, isActive);
      
      if (result) {
        res.json({ message: 'Status do usuário atualizado' });
      } else {
        res.status(400).json({ message: 'Erro ao atualizar status' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  });

  app.put("/api/admin/user/:id/ban", authenticateToken, requireAdmin, async (req: any, res) => {
    try {
      const { id } = req.params;
      
      const result = await storage.banUser(id);
      
      if (result) {
        res.json({ message: 'Usuário banido com sucesso' });
      } else {
        res.status(400).json({ message: 'Erro ao banir usuário' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  });

  app.post("/api/admin/user/:id/promote-premium", authenticateToken, requireAdmin, async (req: any, res) => {
    try {
      const { id } = req.params;
      const { duration } = req.body; // duration in days: 7, 30, 90, 180, 365
      
      if (!duration || ![7, 30, 90, 180, 365].includes(duration)) {
        return res.status(400).json({ message: 'Duração inválida' });
      }

      const result = await storage.promoteToPremium(id, duration, req.user.id);
      
      if (result) {
        res.json({ message: 'Usuário promovido para Premium com sucesso' });
      } else {
        res.status(400).json({ message: 'Erro ao promover usuário' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  });

  app.post("/api/admin/user/:id/demote-premium", authenticateToken, requireAdmin, async (req: any, res) => {
    try {
      const { id } = req.params;
      
      const result = await storage.demoteFromPremium(id);
      
      if (result) {
        res.json({ message: 'Usuário despromovido de Premium com sucesso' });
      } else {
        res.status(400).json({ message: 'Erro ao despromover usuário' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  });

  app.get("/api/admin/password-reset-requests", authenticateToken, requireAdmin, async (req: any, res) => {
    try {
      const requests = await storage.getPasswordResetRequests();
      res.json(requests);
    } catch (error) {
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  });

  app.post("/api/admin/generate-reset-token/:userId", authenticateToken, requireAdmin, async (req: any, res) => {
    try {
      const { userId } = req.params;
      
      const user = await storage.getUserById(userId);
      if (!user) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
      }

      const result = await storage.generatePasswordResetToken(user.phone, user.id);
      
      if (!result.success) {
        return res.status(400).json({ message: result.message });
      }

      // Generate JWT token with 1-hour expiry
      const resetToken = jwt.sign(
        { userId: user.id, phone: user.phone, purpose: 'password_reset' },
        JWT_SECRET,
        { expiresIn: '1h' }
      );

      // Generate the reset link
      const resetLink = `${req.protocol}://${req.get('host')}/reset-password?token=${encodeURIComponent(resetToken)}`;
      
      console.log(`Password reset link for ${user.phone}: ${resetLink}`);
      console.log(`Token expires in 1 hour`);
      
      res.json({ 
        message: 'Token gerado com sucesso',
        resetLink,
        expiresAt: result.expiresAt,
        expiresIn: '1 hora',
        phone: user.phone,
        email: user.email
      });
    } catch (error) {
      console.error('Generate reset token error:', error);
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
