import { z } from "zod";

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

// Zod schemas for validation
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
