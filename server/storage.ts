import {
  type Plan,
  type Testimonial,
  type FAQ,
} from "@shared/schema";
import { createClient } from "@supabase/supabase-js";

export interface IStorage {
  // Plan operations
  getPlans(): Promise<Plan[]>;
  getPlan(id: number): Promise<Plan | undefined>;

  // FAQ operations
  getFAQs(): Promise<FAQ[]>;

  // Testimonial operations
  getTestimonials(): Promise<Testimonial[]>;
}

export class SupabaseStorage implements IStorage {
  private supabase;

  constructor() {
    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const supabaseKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Supabase credentials not available");
    }

    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  async getPlans(): Promise<Plan[]> {
    const { data, error } = await this.supabase
      .from("plans")
      .select("*")
      .eq("is_active", true);

    if (error) {
      console.error("Error fetching plans:", error);
      throw error;
    }

    // Convert snake_case to camelCase for frontend
    return (data || []).map((plan) => ({
      id: plan.id,
      name: plan.name,
      description: plan.description,
      accountSize: plan.account_size,
      price: plan.price,
      profitTarget: plan.profit_target,
      maxDrawdown: plan.max_drawdown,
      profitSplit: plan.profit_split,
      minTradingDays: plan.min_trading_days,
      maxDailyProfit: plan.max_daily_profit,
      features: plan.features,
      isActive: plan.is_active,
      payoutFrequency: plan.payout_frequency,
      challengeType: plan.challenge_type,
      phaseCount: plan.phase_count,
    }));
  }

  async getPlan(id: number): Promise<Plan | undefined> {
    const { data, error } = await this.supabase
      .from("plans")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) return undefined;

    // Convert snake_case to camelCase
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      accountSize: data.account_size,
      price: data.price,
      profitTarget: data.profit_target,
      maxDrawdown: data.max_drawdown,
      profitSplit: data.profit_split,
      minTradingDays: data.min_trading_days,
      maxDailyProfit: data.max_daily_profit,
      features: data.features,
      isActive: data.is_active,
      payoutFrequency: data.payout_frequency,
      challengeType: data.challenge_type,
      phaseCount: data.phase_count,
    };
  }

  async getFAQs(): Promise<FAQ[]> {
    const { data, error } = await this.supabase
      .from("faqs")
      .select("*")
      .eq("is_active", true)
      .order("order", { ascending: true });

    if (error) {
      console.error("Error fetching FAQs:", error);
      throw error;
    }

    // Convert snake_case to camelCase
    return (data || []).map((faq) => ({
      id: faq.id,
      question: faq.question,
      answer: faq.answer,
      category: faq.category,
      order: faq.order,
      isActive: faq.is_active,
    }));
  }

  async getTestimonials(): Promise<Testimonial[]> {
    const { data, error } = await this.supabase
      .from("testimonials")
      .select("*")
      .eq("is_active", true);

    if (error) {
      console.error("Error fetching testimonials:", error);
      throw error;
    }

    // Convert snake_case to camelCase
    return (data || []).map((testimonial) => ({
      id: testimonial.id,
      name: testimonial.name,
      title: testimonial.title,
      content: testimonial.content,
      accountSize: testimonial.account_size,
      profit: testimonial.profit,
      duration: testimonial.duration,
      initials: testimonial.initials,
      avatarColor: testimonial.avatar_color,
      isActive: testimonial.is_active,
    }));
  }
}

// Always use SupabaseStorage for all data operations
export const storage = new SupabaseStorage();
