import { eq, and, sql, desc } from "drizzle-orm";
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

  // Admin operations
  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users).orderBy(users.createdAt);
  },

  async toggleUserStatus(id: string, isActive: boolean): Promise<boolean> {
    const result = await db.update(users).set({ isActive }).where(eq(users.id, id));
    return (result.rowCount ?? 0) > 0;
  },

  async banUser(id: string): Promise<boolean> {
    const result = await db.update(users).set({ isBanned: true, isActive: false }).where(eq(users.id, id));
    return (result.rowCount ?? 0) > 0;
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