import { z } from "zod";

// Define schema interfaces instead of using Drizzle's pgTable
export interface User {
  id: number;
  uuid?: string;
  email: string;
  username: string;
  password: string;
  firstName?: string;
  lastName?: string;
  profilePicture?: string | null;
  dateOfBirth?: string | null;
  createdAt: Date;
  role?: string;
}

export interface Plan {
  id: number;
  name: string;
  description: string;
  accountSize: number;
  price: number; // in cents
  profitTarget: number; // percentage
  maxDrawdown: number; // percentage
  profitSplit: number; // percentage
  minTradingDays: number;
  maxDailyProfit: number; // percentage
  features: string; // JSON string
  isActive: boolean;
  payoutFrequency: string;
  challengeType?: string; // '2-step', '3-step', 'blitz'
  phaseCount?: number; // number of phases in challenge
}

export interface UserChallenge {
  id: number;
  userId: number;
  planId: number;
  status: string; // 'in_progress', 'completed', 'failed', 'funded'
  startDate: Date;
  endDate: Date | null;
  currentProfit: number;
  currentDrawdown: number;
  tradingDays: number;
  transactionId: string | null;
  paymentStatus: string; // 'pending', 'completed', 'refunded'
  currentPhase?: number; // which phase of challenge (1, 2, 3)
  virtualBalance?: number; // virtual account balance for demo trading
  maxVirtualBalance?: number; // high water mark for drawdown calculation
  passedPhases?: number[]; // array of completed phase numbers
  fundedAccountActive?: boolean; // if passed all phases and has funded account
}

export interface Trade {
  id: number;
  challengeId: number;
  userId: number;
  sport: string;
  market: string;
  selection: string;
  odds: number;
  stake: number;
  createdAt: Date;
  settledAt: Date | null;
  result: string | null; // 'win', 'loss', 'void', null if pending
  profitLoss: number | null;
  phase?: number; // which phase of challenge this trade was placed in
  marketType?: string; // 'moneyline', 'spread', 'total', 'prop'
  teamType?: string; // 'home', 'away' for team-based bets
  line?: number; // point spread or total line
}

export interface FAQ {
  id: number;
  question: string;
  answer: string;
  category: string;
  order: number;
  isActive: boolean;
}

export interface Testimonial {
  id: number;
  name: string;
  title: string;
  content: string;
  accountSize: number;
  profit: number;
  duration: string;
  initials: string;
  avatarColor: string;
  isActive: boolean;
}

export interface FundedAccount {
  id: number;
  userId: number;
  challengeId: number;
  accountSize: number;
  currentBalance: number;
  maxBalance: number;
  totalProfits: number;
  totalPayouts: number;
  profitSplit: number;
  status: string; // 'active', 'suspended', 'closed'
  createdAt: Date;
  lastPayoutAt: Date | null;
}

export interface Payout {
  id: number;
  userId: number;
  fundedAccountId: number;
  amount: number;
  profitAmount: number;
  traderShare: number;
  status: string; // 'pending', 'processed', 'failed'
  requestedAt: Date;
  processedAt: Date | null;
  transactionId: string | null;
}

export interface Leaderboard {
  id: number;
  userId: number;
  username: string;
  totalProfit: number;
  winRate: number;
  totalTrades: number;
  accountSize: number;
  rank: number;
  period: string; // 'daily', 'weekly', 'monthly', 'all-time'
  updatedAt: Date;
}

// Zod schemas for validation
export const insertUserSchema = z.object({
  email: z.string().email(),
  username: z.string().min(3),
  password: z.string().min(8),
  firstName: z.string().optional(), // Changed to optional for better TypeScript compatibility
  lastName: z.string().optional(), // Changed to optional for better TypeScript compatibility
  profilePicture: z.string().optional(), // Changed to optional for better TypeScript compatibility
  dateOfBirth: z.string().optional(),
  // dateOfBirth intentionally omitted here for general inserts; registration schema will require it
});

export const insertPlanSchema = z.object({
  name: z.string(),
  description: z.string(),
  accountSize: z.number(),
  price: z.number(),
  profitTarget: z.number(),
  maxDrawdown: z.number(),
  profitSplit: z.number(),
  minTradingDays: z.number(),
  maxDailyProfit: z.number(),
  features: z.string(),
  isActive: z.boolean().default(true),
  payoutFrequency: z.string(),
  challengeType: z.string(),
  phaseCount: z.number(),
});

export const insertUserChallengeSchema = z.object({
  userId: z.number(),
  planId: z.number(),
  status: z.string(),
  transactionId: z.string().nullable(),
});

export const insertTradeSchema = z.object({
  challengeId: z.number(),
  userId: z.number(),
  sport: z.string(),
  market: z.string(),
  selection: z.string(),
  odds: z.number(),
  stake: z.number(),
  phase: z.number(),
  marketType: z.string(),
  teamType: z.string().optional(),
  line: z.number().optional(),
});

export const insertFaqSchema = z.object({
  question: z.string(),
  answer: z.string(),
  category: z.string(),
  order: z.number(),
  isActive: z.boolean().default(true),
});

export const insertTestimonialSchema = z.object({
  name: z.string(),
  title: z.string(),
  content: z.string(),
  accountSize: z.number(),
  profit: z.number(),
  duration: z.string(),
  initials: z.string(),
  avatarColor: z.string(),
  isActive: z.boolean().default(true),
});

// Schemas with validation
export const userRegisterSchema = insertUserSchema
  .extend({
    confirmPassword: z.string(),
    phone: z.string().min(1, "Phone number is required"),
    dateOfBirth: z.string().min(1, "Date of birth is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const userLoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type UserRegister = z.infer<typeof userRegisterSchema>;
export type UserLogin = z.infer<typeof userLoginSchema>;
