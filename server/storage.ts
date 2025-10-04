import { eq, and, sql, desc, isNotNull } from "drizzle-orm";
import { db } from "./db";
import { users, reports, ratings, locationHistory } from "@shared/schema";
import type { insertUserSchema, loginUserSchema } from "@shared/schema";
import { z } from "zod";

export type User = typeof users.$inferSelect;
export type NewUser = z.infer<typeof insertUserSchema>;
export type LoginUser = z.infer<typeof loginUserSchema>;
export type InsertUser = typeof users.$inferInsert;

export const storage = {
  // User operations
  async insertUser(userData: Omit<InsertUser, "id" | "createdAt"> & {
    isAdmin?: boolean;
    isPremium?: boolean;
    isActive?: boolean;
  }): Promise<User> {
    try {
      const [newUser] = await db.insert(users).values({
        ...userData,
      }).returning();

      return newUser;
    } catch (error) {
      console.error("Error inserting user:", error);
      throw error;
    }
  },

  async getUserByPhone(phone: string): Promise<User | null> {
    const [user] = await db.select().from(users).where(eq(users.phone, phone));
    return user || null;
  },

  async getUserById(id: string): Promise<User | null> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || null;
  },

  async updateUser(id: string, updates: Partial<User>): Promise<User | null> {
    const [user] = await db.update(users).set(updates).where(eq(users.id, id)).returning();
    return user || null;
  },

  async deleteUser(id: string): Promise<boolean> {
    const result = await db.delete(users).where(eq(users.id, id));
    return (result.rowCount ?? 0) > 0;
  },

  // Location update with history tracking
  async updateUserLocation(
    userId: string,
    type: 'current' | 'desired',
    province: string,
    district: string
  ): Promise<{ success: boolean; message?: string }> {
    const user = await this.getUserById(userId);
    if (!user) return { success: false, message: 'Usuário não encontrado' };

    // Check if user can update location based on their plan and last update
    const canUpdate = await this.canUpdateLocation(userId, type, user.isPremium || false);

    if (!canUpdate.allowed) {
      return { success: false, message: canUpdate.reason };
    }

    try {
      // Store history before updating
      await this.addLocationHistory(userId, type, user, province, district);

      // Update user location
      const updates = type === 'current'
        ? { currentProvince: province, currentDistrict: district }
        : { desiredProvince: province, desiredDistrict: district };

      await db.update(users).set(updates).where(eq(users.id, userId));
      return { success: true };
    } catch (error) {
      return { success: false, message: 'Erro ao atualizar localização' };
    }
  },

  async canUpdateLocation(
    userId: string,
    type: 'current' | 'desired',
    isPremium: boolean
  ): Promise<{ allowed: boolean; reason?: string }> {
    // Current location can only be updated once
    if (type === 'current') {
      // Check if already updated (would need a flag in user table)
      return { allowed: true }; // Simplified for now
    }

    // Desired location rules
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);

    if (isPremium) {
      // Premium: once per day
      // Check last update was more than 1 day ago
      return { allowed: true }; // Simplified - would check actual history
    } else {
      // Free: once per month
      // Check last update was more than 30 days ago
      return { allowed: true }; // Simplified - would check actual history
    }
  },

  async addLocationHistory(
    userId: string,
    type: 'current' | 'desired',
    user: User,
    newProvince: string,
    newDistrict: string
  ): Promise<void> {
    const oldProvince = type === 'current' ? user.currentProvince : user.desiredProvince;
    const oldDistrict = type === 'current' ? user.currentDistrict : user.desiredDistrict;

    await db.insert(locationHistory).values({
      userId,
      type,
      oldProvince: oldProvince || '',
      oldDistrict: oldDistrict || '',
      newProvince,
      newDistrict,
      editedAt: new Date(),
    });
  },

  async getLocationHistory(): Promise<any[]> {
    try {
      const history = await db
        .select({
          id: locationHistory.id,
          userId: locationHistory.userId,
          type: locationHistory.type,
          oldProvince: locationHistory.oldProvince,
          oldDistrict: locationHistory.oldDistrict,
          newProvince: locationHistory.newProvince,
          newDistrict: locationHistory.newDistrict,
          editedAt: locationHistory.editedAt,
          firstName: users.firstName,
          lastName: users.lastName,
          isPremium: users.isPremium
        })
        .from(locationHistory)
        .leftJoin(users, eq(locationHistory.userId, users.id))
        .orderBy(desc(locationHistory.editedAt));

      return history.map(edit => ({
        id: edit.id,
        userId: edit.userId,
        userName: `${edit.firstName} ${edit.lastName}`,
        editType: edit.type === 'current' ? 'current_location' : 'desired_location',
        oldValue: edit.oldProvince && edit.oldDistrict ? `${edit.oldProvince}, ${edit.oldDistrict}` : 'N/A',
        newValue: `${edit.newProvince}, ${edit.newDistrict}`,
        editDate: edit.editedAt || new Date(),
        userType: edit.isPremium ? 'Premium' : 'Free'
      }));
    } catch (error) {
      console.error("Error getting location history:", error);
      throw error;
    }
  },

  // Password operations
  async updatePassword(userId: string, newPassword: string): Promise<{ success: boolean; message?: string }> {
    try {
      await db.update(users).set({ password: newPassword }).where(eq(users.id, userId));
      return { success: true };
    } catch (error) {
      return { success: false, message: 'Erro ao atualizar senha' };
    }
  },

  async createPasswordResetRequest(phone: string) {
    const user = await this.getUserByPhone(phone);
    if (!user || !user.isActive) {
      return { success: false, message: 'Usuário não encontrado' };
    }

    // Just mark that a request was made
    const requestedAt = new Date();
    await db.update(users)
      .set({
        resetPasswordExpires: requestedAt // Using this field to track request time
      })
      .where(eq(users.phone, phone));

    return { success: true };
  },

  async getPasswordResetRequests() {
    // Get users who have requested password reset (resetPasswordExpires is set but resetPasswordToken is null)
    const requests = await db.select()
      .from(users)
      .where(
        and(
          eq(users.isActive, true),
          isNotNull(users.resetPasswordExpires)
        )
      );

    return requests.map(user => ({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      email: user.email,
      requestedAt: user.resetPasswordExpires,
      hasActiveToken: !!user.resetPasswordToken
    }));
  },

  async generatePasswordResetToken(phone: string) {
    const user = await this.getUserByPhone(phone);
    if (!user || !user.isActive) {
      return { success: false, message: 'Usuário não encontrado' };
    }

    // Generate 6-digit token
    const token = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    await db.update(users)
      .set({
        resetPasswordToken: token,
        resetPasswordExpires: expiresAt
      })
      .where(eq(users.phone, phone));

    return { success: true, token };
  },


  async verifyResetToken(phone: string, token: string): Promise<{ valid: boolean; userId?: string }> {
    try {
      const [user] = await db.select()
        .from(users)
        .where(
          and(
            eq(users.phone, phone),
            eq(users.resetPasswordToken, token)
          )
        );

      if (!user || !user.resetPasswordExpires) {
        return { valid: false };
      }

      if (new Date() > user.resetPasswordExpires) {
        return { valid: false };
      }

      return { valid: true, userId: user.id };
    } catch (error) {
      return { valid: false };
    }
  },

  async resetPasswordWithToken(phone: string, token: string, newPassword: string): Promise<{ success: boolean; message?: string }> {
    try {
      const verification = await this.verifyResetToken(phone, token);

      if (!verification.valid) {
        return { success: false, message: 'Código inválido ou expirado' };
      }

      await db.update(users)
        .set({
          password: newPassword,
          resetPasswordToken: null,
          resetPasswordExpires: null
        })
        .where(eq(users.phone, phone));

      return { success: true };
    } catch (error) {
      return { success: false, message: 'Erro ao resetar senha' };
    }
  },

  // Admin operations
  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users).orderBy(users.createdAt);
  },

  async toggleUserStatus(id: string, isActive: boolean): Promise<boolean> {
    const result = await db.update(users).set({ isActive }).where(eq(users.id, id));
    return (result.rowCount ?? 0) > 0;
  },

  async banUser(userId: string): Promise<boolean> {
    try {
      await db.update(users)
        .set({ isBanned: true, isActive: false })
        .where(eq(users.id, userId));
      return true;
    } catch (error) {
      return false;
    }
  },

  async promoteToPremium(userId: string, durationDays: number, adminId: string): Promise<boolean> {
    try {
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + durationDays);

      await db.update(users)
        .set({
          isPremium: true,
          premiumExpiresAt: expiresAt,
          premiumPromotedBy: adminId
        })
        .where(eq(users.id, userId));
      return true;
    } catch (error) {
      console.error("Error promoting user to premium:", error);
      return false;
    }
  },

  async demoteFromPremium(userId: string): Promise<boolean> {
    try {
      await db.update(users)
        .set({
          isPremium: false,
          premiumExpiresAt: null,
          premiumPromotedBy: null
        })
        .where(eq(users.id, userId));
      return true;
    } catch (error) {
      console.error("Error demoting user from premium:", error);
      return false;
    }
  },

  async checkExpiredPremiumAccounts(): Promise<void> {
    try {
      const now = new Date();
      await db.update(users)
        .set({
          isPremium: false,
          premiumExpiresAt: null,
          premiumPromotedBy: null
        })
        .where(sql`${users.premiumExpiresAt} IS NOT NULL AND ${users.premiumExpiresAt} < ${now}`);
    } catch (error) {
      console.error("Error checking expired premium accounts:", error);
    }
  },

  // Reports operations
  async createReport(reportData: {
    reporterId: string;
    reportedUserId: string;
    reason: string;
    description?: string;
  }): Promise<boolean> {
    try {
      await db.insert(reports).values(reportData);
      return true;
    } catch (error) {
      return false;
    }
  },

  async getReports(): Promise<any[]> {
    return await db.select().from(reports).orderBy(reports.createdAt);
  },

  // Ratings operations
  async createRating(ratingData: {
    raterId: string;
    ratedUserId: string;
    rating: number;
    comment?: string;
  }): Promise<boolean> {
    try {
      await db.insert(ratings).values(ratingData);
      return true;
    } catch (error) {
      return false;
    }
  },

  async getUserRatings(userId: string): Promise<any[]> {
    return await db.select().from(ratings).where(eq(ratings.ratedUserId, userId));
  },

  // Statistics
  async getUserStats(): Promise<{
    totalUsers: number;
    activeUsers: number;
    premiumUsers: number;
    freeUsers: number;
    editsToday: number;
    editsThisWeek: number;
    editsThisMonth: number;
  }> {
    try {
      const allUsers = await this.getAllUsers();
      const totalUsers = allUsers.length;
      const activeUsers = allUsers.filter(user => user.isActive).length;
      const premiumUsers = allUsers.filter(user => user.isPremium).length;
      const freeUsers = totalUsers - premiumUsers;

      // Get edit counts from location history
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

      const allHistory = await db.select().from(locationHistory);

      const editsToday = allHistory.filter(edit =>
        edit.editedAt && edit.editedAt >= today
      ).length;

      const editsThisWeek = allHistory.filter(edit =>
        edit.editedAt && edit.editedAt >= weekAgo
      ).length;

      const editsThisMonth = allHistory.filter(edit =>
        edit.editedAt && edit.editedAt >= monthAgo
      ).length;

      return {
        totalUsers,
        activeUsers,
        premiumUsers,
        freeUsers,
        editsToday,
        editsThisWeek,
        editsThisMonth
      };
    } catch (error) {
      console.error("Error getting user stats:", error);
      throw error;
    }
  },
};