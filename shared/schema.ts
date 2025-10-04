import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table for public servants
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  // Personal data
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  // Professional data
  sector: text("sector").notNull(),
  salaryLevel: integer("salary_level").notNull(), // 1-21
  grade: text("grade").notNull(), // A, B, C
  // Location data
  currentProvince: text("current_province").notNull(),
  currentDistrict: text("current_district").notNull(),
  desiredProvince: text("desired_province").notNull(),
  desiredDistrict: text("desired_district").notNull(),
  // Contact data
  phone: text("phone").notNull().unique(),
  email: text("email"),
  // Security
  password: text("password").notNull(),
  resetPasswordToken: text("reset_password_token"),
  resetPasswordExpires: timestamp("reset_password_expires"),
  // Profile settings
  isActive: boolean("is_active").default(true),
  isPremium: boolean("is_premium").default(false),
  premiumExpiresAt: timestamp("premium_expires_at"),
  premiumPromotedBy: text("premium_promoted_by"),
  profileLastUpdated: timestamp("profile_last_updated").defaultNow(),
  whatsappContactsToday: integer("whatsapp_contacts_today").default(0),
  lastContactReset: timestamp("last_contact_reset").defaultNow(),
  // Permutation status
  permutationCompleted: boolean("permutation_completed").default(false),
  // Admin fields
  isAdmin: boolean("is_admin").default(false),
  isBanned: boolean("is_banned").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Reports table for user reports/complaints
export const reports = pgTable("reports", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  reporterId: text("reporter_id").notNull(),
  reportedUserId: text("reported_user_id").notNull(),
  reason: text("reason").notNull(),
  description: text("description"),
  status: text("status").default("pending"), // pending, reviewed, resolved
  createdAt: timestamp("created_at").defaultNow(),
});

// User ratings table
export const ratings = pgTable("ratings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  raterId: text("rater_id").notNull(),
  ratedUserId: text("rated_user_id").notNull(),
  rating: integer("rating").notNull(), // 1-5 stars
  comment: text("comment"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Location history table
export const locationHistory = pgTable("location_history", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: text("user_id").notNull(),
  type: text("type").notNull(), // 'current' or 'desired'
  oldProvince: text("old_province"),
  oldDistrict: text("old_district"),
  newProvince: text("new_province").notNull(),
  newDistrict: text("new_district").notNull(),
  editedAt: timestamp("edited_at").defaultNow(),
});

// Schema for user registration
export const insertUserSchema = createInsertSchema(users).pick({
  firstName: true,
  lastName: true,
  sector: true,
  salaryLevel: true,
  grade: true,
  currentProvince: true,
  currentDistrict: true,
  desiredProvince: true,
  desiredDistrict: true,
  phone: true,
  email: true,
  password: true,
}).extend({
  phone: z.string().regex(/^\+258[0-9]{9}$/, "Número de telefone deve ser no formato +258XXXXXXXXX"),
  email: z.string().email().optional().or(z.literal("")),
  password: z.string().min(8, "Senha deve ter pelo menos 8 caracteres"),
});

// Schema for user login
export const loginUserSchema = z.object({
  phone: z.string(),
  password: z.string(),
});

// Schema for user search
export const searchUsersSchema = z.object({
  sector: z.string().optional(),
  salaryLevel: z.number().optional(),
  currentProvince: z.string().optional(),
  currentDistrict: z.string().optional(),
  desiredProvince: z.string().optional(),
  desiredDistrict: z.string().optional(),
});

// Schema for password reset request
export const requestPasswordResetSchema = z.object({
  phone: z.string().regex(/^\+258[0-9]{9}$/, "Número deve ser no formato +258XXXXXXXXX"),
  confirmationDigits: z.string().optional(),
});

// Schema for password reset
export const resetPasswordSchema = z.object({
  phone: z.string(),
  token: z.string().length(6, "Código deve ter 6 dígitos"),
  newPassword: z.string().min(8, "Senha deve ter pelo menos 8 caracteres"),
});

// Schema for password change (logged in user)
export const changePasswordSchema = z.object({
  currentPassword: z.string(),
  newPassword: z.string().min(8, "Senha deve ter pelo menos 8 caracteres"),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type LoginUser = z.infer<typeof loginUserSchema>;
export type SearchUsers = z.infer<typeof searchUsersSchema>;
export type Report = typeof reports.$inferSelect;
export type Rating = typeof ratings.$inferSelect;
export type RequestPasswordReset = z.infer<typeof requestPasswordResetSchema>;
export type ResetPassword = z.infer<typeof resetPasswordSchema>;
export type ChangePassword = z.infer<typeof changePasswordSchema>;