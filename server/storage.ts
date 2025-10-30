import {
  type User,
  type InsertUser,
  type Plan,
  type Testimonial,
  type FAQ,
  type UserChallenge,
  type Trade,
} from "@shared/schema";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Plan operations
  getPlans(): Promise<Plan[]>;
  getPlan(id: number): Promise<Plan | undefined>;

  // FAQ operations
  getFAQs(): Promise<FAQ[]>;

  // Testimonial operations
  getTestimonials(): Promise<Testimonial[]>;

  // User challenge operations
  createUserChallenge(
    userId: number,
    planId: number,
    transactionId: string
  ): Promise<UserChallenge>;
  getUserChallenges(userId: number): Promise<UserChallenge[]>;
  getUserChallenge(id: number): Promise<UserChallenge | undefined>;

  // Trade operations
  createTrade(
    trade: Omit<
      Trade,
      "id" | "createdAt" | "settledAt" | "result" | "profitLoss"
    >
  ): Promise<Trade>;
  getTradesByChallenge(challengeId: number): Promise<Trade[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private plans: Map<number, Plan>;
  private faqs: Map<number, FAQ>;
  private testimonials: Map<number, Testimonial>;
  private userChallenges: Map<number, UserChallenge>;
  private trades: Map<number, Trade>;

  private userId: number;
  private planId: number;
  private faqId: number;
  private testimonialId: number;
  private challengeId: number;
  private tradeId: number;

  constructor() {
    this.users = new Map();
    this.plans = new Map();
    this.faqs = new Map();
    this.testimonials = new Map();
    this.userChallenges = new Map();
    this.trades = new Map();

    this.userId = 1;
    this.planId = 1;
    this.faqId = 1;
    this.testimonialId = 1;
    this.challengeId = 1;
    this.tradeId = 1;

    // Initialize with some default plans
    this.seedPlans();
    this.seedFAQs();
    this.seedTestimonials();
  }

  private seedPlans() {
    const plansData: Omit<Plan, "id">[] = [
      {
        name: "Starter Challenge",
        description:
          "Perfect for new sports strategists looking to prove their skills.",
        accountSize: 10000,
        price: 9900, // $99.00
        profitTarget: 8,
        maxDrawdown: 5,
        profitSplit: 70,
        minTradingDays: 5,
        maxDailyProfit: 5,
        features: JSON.stringify([
          "$10K Demo Account",
          "8% Profit Target (30 Days)",
          "5% Maximum Drawdown",
          "70% Profit Split",
          "5 Minimum Trading Days",
          "Bi-weekly Payouts",
          "2-Step Challenge",
        ]),
        isActive: true,
        payoutFrequency: "bi-weekly",
        challengeType: "2-step",
        phaseCount: 2,
      },
      {
        name: "Advanced Challenge",
        description:
          "For experienced sports strategists seeking significant capital.",
        accountSize: 50000,
        price: 29900, // $299.00
        profitTarget: 10,
        maxDrawdown: 8,
        profitSplit: 75,
        minTradingDays: 5,
        maxDailyProfit: 5,
        features: JSON.stringify([
          "$50K Demo Account",
          "10% Profit Target (30 Days)",
          "8% Maximum Drawdown",
          "75% Profit Split",
          "5 Minimum Trading Days",
          "Weekly Payouts",
          "Premium Analytics",
          "3-Step Challenge",
        ]),
        isActive: true,
        payoutFrequency: "weekly",
        challengeType: "3-step",
        phaseCount: 3,
      },
      {
        name: "Professional Challenge",
        description:
          "For elite sports strategists with proven performance history.",
        accountSize: 100000,
        price: 49900, // $499.00
        profitTarget: 10,
        maxDrawdown: 6,
        profitSplit: 80,
        minTradingDays: 10,
        maxDailyProfit: 5,
        features: JSON.stringify([
          "$100K Demo Account",
          "10% Profit Target (30 Days)",
          "6% Maximum Drawdown",
          "80% Profit Split",
          "10 Minimum Trading Days",
          "Daily Payouts",
          "Premium Analytics",
          "Dedicated Support",
          "Blitz Challenge",
        ]),
        isActive: true,
        payoutFrequency: "daily",
        challengeType: "blitz",
        phaseCount: 1,
      },
    ];

    plansData.forEach((plan) => {
      const id = this.planId++;
      this.plans.set(id, { ...plan, id });
    });
  }

  private seedFAQs() {
    const faqsData: Omit<FAQ, "id">[] = [
      {
        question: "How does the funding process work?",
        answer:
          "Our funding process is straightforward: First, you purchase a challenge based on your desired account size. You'll need to meet the profit target while following our risk management rules. Once successful, you'll receive access to a funded account with our capital, and you can start trading immediately while keeping up to 80% of the profits you generate.",
        category: "general",
        order: 1,
        isActive: true,
      },
      {
        question: "What happens if I lose money?",
        answer:
          "If you exceed the maximum drawdown limit during the evaluation or funded phase, your account will be closed. However, you can always purchase a new challenge and try again. The key advantage is that you're never risking your own capital once funded - we take all the financial risk.",
        category: "general",
        order: 2,
        isActive: true,
      },
      {
        question: "How quickly will I receive payouts?",
        answer:
          "Payouts are processed according to your account tier - weekly for Professional and Advanced accounts, and bi-weekly for Starter accounts. All payouts are subject to a minimum threshold of $100 and are typically processed within 1-2 business days after the payout period ends.",
        category: "general",
        order: 3,
        isActive: true,
      },
      {
        question: "Can I trade multiple sports simultaneously?",
        answer:
          "Yes, you can trade any sports and markets that are permitted under our rules. Many of our successful traders specialize in multiple sports to capitalize on various seasons and opportunities throughout the year.",
        category: "general",
        order: 4,
        isActive: true,
      },
      {
        question: "Is there a time limit to complete the challenge?",
        answer:
          "Yes, you have 30 calendar days to complete the evaluation phase and reach your profit target. You must also trade on a minimum of 10 different days during this period to demonstrate consistency.",
        category: "general",
        order: 5,
        isActive: true,
      },
      {
        question: "Can I have more than 1 account?",
        answer:
          "You may participate in up to five challenges simultaneously, regardless of your account size. This limit is in place to ensure a balanced and manageable experience.",
        category: "general",
        order: 6,
        isActive: true,
      },
      {
        question: "What trading platform do you use?",
        answer:
          "We've developed a proprietary trading platform that integrates with major sportsbooks and provides advanced analytics tools. The platform allows you to execute trades, track performance, and access real-time odds across multiple bookmakers.",
        category: "platform",
        order: 6,
        isActive: true,
      },
      {
        question: "Do you offer refunds if I don't pass the challenge?",
        answer:
          "We do not offer refunds for challenges that aren't successfully completed. The challenge fee covers the costs of providing you with the simulation environment, tools, and evaluation services. However, we do offer a 50% discount on a second attempt if you fail your first challenge.",
        category: "payment",
        order: 7,
        isActive: true,
      },
      {
        question: "Where can I trade from? Are there country restrictions?",
        answer:
          "You can trade from most countries worldwide. However, due to regulatory constraints, we cannot accept traders from certain jurisdictions. Please check our Terms of Service for the current list of restricted countries, or contact our support team for clarification.",
        category: "legal",
        order: 8,
        isActive: true,
      },
      {
        question: "Can I have multiple funded accounts?",
        answer:
          "Yes, successful traders can manage multiple funded accounts. However, each account must be earned by passing a separate challenge. Many of our traders start with one account and add more as they prove their profitability and develop different strategies.",
        category: "account",
        order: 9,
        isActive: true,
      },
      {
        question: "What support do you provide to traders?",
        answer:
          "We provide comprehensive support including 24/7 technical assistance, educational resources, market analysis tools, and access to our trader community. Professional and Advanced account holders also receive personalized coaching sessions and priority support.",
        category: "support",
        order: 10,
        isActive: true,
      },
      {
        question: "Can I have more than 1 account?",
        answer:
          "You may participate in up to five challenges simultaneously, regardless of your account size. This limit is in place to ensure a balanced and manageable experience.",
        category: "account",
        order: 11,
        isActive: true,
      },
    ];

    faqsData.forEach((faq) => {
      const id = this.faqId++;
      this.faqs.set(id, { ...faq, id });
    });
  }

  private seedTestimonials() {
    const testimonialsData: Omit<Testimonial, "id">[] = [
      {
        name: "James R.",
        title: "NFL & NBA Specialist",
        content:
          "Honestly wasn't sure about this at first but man, I'm glad I tried it. Been betting NFL and NBA for years, making decent money but always worried about variance wiping me out. With Bet2Fund I can actually sleep at night lol. Passed their 50K challenge in 3 weeks, been trading their money for 8 months now. Payouts hit my account every time, no bs.",
        accountSize: 150000,
        profit: 87500,
        duration: "8-Month",
        initials: "JR",
        avatarColor: "#0039B3",
        isActive: true,
      },
      {
        name: "Sarah K.",
        title: "Soccer Analyst",
        content:
          "Real talk - I was super skeptical. Too many scammy prop firms out there. But these guys are legit. Started with their 10K challenge, passed it pretty quick, now I'm on a 25K account. The soccer data they have is actually solid, way better than what I was using before. Best part? I don't stress about losing my rent money anymore lmao.",
        accountSize: 25000,
        profit: 18350,
        duration: "5-Month",
        initials: "SK",
        avatarColor: "#00B2FF",
        isActive: true,
      },
      {
        name: "Michael T.",
        title: "Multi-sport Trader",
        content:
          "Been doing this for 6 months now and it's been a game changer. I trade multiple sports - NBA, NFL, tennis, whatever looks good. Having their capital behind me means I can actually size my bets properly instead of betting scared money. Made more profit in these 6 months than I did in 2 years betting my own cash. The community is pretty cool too, bunch of sharp guys.",
        accountSize: 75000,
        profit: 42000,
        duration: "6-Month",
        initials: "MT",
        avatarColor: "#0039B3",
        isActive: true,
      },
    ];

    testimonialsData.forEach((testimonial) => {
      const id = this.testimonialId++;
      this.testimonials.set(id, { ...testimonial, id });
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email.toLowerCase() === email.toLowerCase()
    );
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username.toLowerCase() === username.toLowerCase()
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const now = new Date();
    const uuid = crypto.randomUUID();

    const user: User = {
      ...insertUser,
      id,
      uuid,
      createdAt: now,
      // isAdmin: false
    };

    this.users.set(id, user);
    return user;
  }

  async getPlans(): Promise<Plan[]> {
    return Array.from(this.plans.values()).filter((plan) => plan.isActive);
  }

  async getPlan(id: number): Promise<Plan | undefined> {
    return this.plans.get(id);
  }

  async getFAQs(): Promise<FAQ[]> {
    return Array.from(this.faqs.values())
      .filter((faq) => faq.isActive)
      .sort((a, b) => a.order - b.order);
  }

  async getTestimonials(): Promise<Testimonial[]> {
    return Array.from(this.testimonials.values()).filter(
      (testimonial) => testimonial.isActive
    );
  }

  async createUserChallenge(
    userId: number,
    planId: number,
    transactionId: string
  ): Promise<UserChallenge> {
    const user = await this.getUser(userId);
    if (!user) throw new Error("User not found");

    const plan = await this.getPlan(planId);
    if (!plan) throw new Error("Plan not found");

    const id = this.challengeId++;
    const startDate = new Date();

    const userChallenge: UserChallenge = {
      id,
      userId,
      planId,
      startDate,
      endDate: null,
      status: "in_progress",
      currentProfit: 0,
      currentDrawdown: 0,
      tradingDays: 0,
      transactionId,
      paymentStatus: "completed", // Assume payment is completed for demo purposes
    };

    this.userChallenges.set(id, userChallenge);
    return userChallenge;
  }

  async getUserChallenges(userId: number): Promise<UserChallenge[]> {
    return Array.from(this.userChallenges.values())
      .filter((challenge) => challenge.userId === userId)
      .sort((a, b) => b.startDate.getTime() - a.startDate.getTime()); // Newest first
  }

  async getUserChallenge(id: number): Promise<UserChallenge | undefined> {
    return this.userChallenges.get(id);
  }

  async createTrade(
    trade: Omit<
      Trade,
      "id" | "createdAt" | "settledAt" | "result" | "profitLoss"
    >
  ): Promise<Trade> {
    const id = this.tradeId++;
    const createdAt = new Date();

    const newTrade: Trade = {
      ...trade,
      id,
      createdAt,
      result: null,
      profitLoss: null,
      settledAt: null,
    };

    this.trades.set(id, newTrade);
    return newTrade;
  }

  async getTradesByChallenge(challengeId: number): Promise<Trade[]> {
    return Array.from(this.trades.values())
      .filter((trade) => trade.challengeId === challengeId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()); // Newest first
  }
}

export class SupabaseStorage implements IStorage {
  async getProfile(userId: string): Promise<any> {
    try {
      const { data, error } = await this.supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();
      if (error) {
        console.error("Error fetching profile:", error);
        return undefined;
      }
      return data;
    } catch (err) {
      console.error("Unexpected error in getProfile:", err);
      return undefined;
    }
  }
  private supabase;

  constructor() {
    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const supabaseKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Supabase credentials not available");
    }

    this.supabase = createClient(supabaseUrl, supabaseKey);
    console.log(
      "SupabaseStorage initialized successfully with service role key"
    );
  }

  async getUser(id: number): Promise<User | undefined> {
    try {
      const { data, error } = await this.supabase
        .from("users")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        // If the error is because no rows were found, that's expected for non-existent users
        if (error.code === "PGRST116") {
          console.log(`No user found with id: ${id}`);
          return undefined;
        }

        console.error("Error fetching user by id:", error);
        return undefined;
      }

      if (!data) return undefined;

      // Convert snake_case to camelCase
      return {
        id: data.id,
        uuid: data.uuid,
        email: data.email,
        username: data.username,
        password: data.password,
        firstName: data.first_name,
        lastName: data.last_name,
        profilePicture: data.profile_picture,
        dateOfBirth: data.date_of_birth || null,
        createdAt: new Date(data.created_at),
        // isAdmin: data.is_admin,
        role: data.role || "user",
      };
    } catch (err) {
      console.error("Unexpected error in getUser:", err);
      return undefined;
    }
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    try {
      const { data, error } = await this.supabase
        .from("users")
        .select("*")
        .eq("email", email)
        .single();

      if (error) {
        // If the error is because no rows were found, that's expected for non-existent users
        if (error.code === "PGRST116") {
          console.log(`No user found with email: ${email}`);
          return undefined;
        }

        console.error("Error fetching user by email:", error);
        return undefined;
      }

      if (!data) return undefined;

      // Convert snake_case to camelCase
      return {
        id: data.id,
        uuid: data.uuid || data.id.toString(),
        email: data.email,
        username: data.username,
        password: data.password,
        firstName: data.first_name,
        lastName: data.last_name,
        profilePicture: data.profile_picture,
        dateOfBirth: data.date_of_birth || null,
        createdAt: new Date(data.created_at),
        // isAdmin: data.is_admin,
        role: data.role || "user",
      };
    } catch (err) {
      console.error("Unexpected error in getUserByEmail:", err);
      return undefined;
    }
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    try {
      const { data, error } = await this.supabase
        .from("users")
        .select("*")
        .eq("username", username)
        .single();

      if (error) {
        // If the error is because no rows were found, that's expected for non-existent users
        if (error.code === "PGRST116") {
          console.log(`No user found with username: ${username}`);
          return undefined;
        }

        console.error("Error fetching user by username:", error);
        return undefined;
      }

      if (!data) return undefined;

      // Convert snake_case to camelCase
      return {
        id: data.id,
        uuid: data.uuid || data.id.toString(),
        email: data.email,
        username: data.username,
        password: data.password,
        firstName: data.first_name,
        lastName: data.last_name,
        profilePicture: data.profile_picture,
        dateOfBirth: data.date_of_birth || null,
        createdAt: new Date(data.created_at),
        // isAdmin: data.is_admin,
        role: data.role || "user",
      };
    } catch (err) {
      console.error("Unexpected error in getUserByUsername:", err);
      return undefined;
    }
  }

  async createUser(user: InsertUser): Promise<User> {
    try {
      console.log("Creating user with data:", user);

      // Convert camelCase to snake_case for the database
      // Only include optional fields when they are non-empty to avoid inserting unknown/empty values
      const snakeCaseUser: any = {
        email: user.email,
        username: user.username,
        password: user.password,
        // is_admin: false
      };

      if (user.firstName && user.firstName !== "")
        snakeCaseUser.first_name = user.firstName;
      if (user.lastName && user.lastName !== "")
        snakeCaseUser.last_name = user.lastName;
      if ((user as any).profilePicture && (user as any).profilePicture !== "")
        snakeCaseUser.profile_picture = (user as any).profilePicture;
      if ((user as any).dateOfBirth && (user as any).dateOfBirth !== "")
        snakeCaseUser.date_of_birth = (user as any).dateOfBirth;

      console.log("Inserting user into Supabase:", snakeCaseUser);

      // Insert the user
      const { data, error } = await this.supabase
        .from("users")
        .insert([snakeCaseUser])
        .select()
        .single();

      if (error) {
        // Log detailed Supabase error info to help debugging
        console.error("Error creating user:", {
          message: error.message,
          details: (error as any).details,
          hint: (error as any).hint,
          code: (error as any).code,
        });
        throw error;
      }

      if (!data) {
        throw new Error("Failed to create user: No data returned");
      }

      console.log("User created successfully, returned data:", data);

      // Convert snake_case back to camelCase for the frontend
      return {
        id: data.id,
        uuid: data.uuid, // Now using the UUID field from Supabase
        email: data.email,
        username: data.username,
        password: data.password,
        firstName: data.first_name || undefined,
        lastName: data.last_name || undefined,
        dateOfBirth: data.date_of_birth || undefined,
        profilePicture: data.profile_picture || undefined,
        createdAt: new Date(data.created_at),
        // isAdmin: data.is_admin || false,
        role: data.role || "user",
      };
    } catch (err: any) {
      // Log the original error for server-side debugging
      console.error("Error in createUser:", err);
      // Re-throw the original error so callers can inspect details (useful during development)
      // Keep the original error object when possible instead of wrapping with a generic message
      throw err;
    }
  }

  // Helper method for table creation - Supabase requires tables to be created via the dashboard
  private async createTables() {
    console.log("---------------------------------------------");
    console.log("Tables need to be created in Supabase dashboard.");
    console.log("Please run the following SQL in the Supabase SQL editor:");
    console.log("");
    console.log("-- Users table");
    console.log("CREATE TABLE IF NOT EXISTS users (");
    console.log("  id SERIAL PRIMARY KEY,");
    console.log("  email VARCHAR(255) UNIQUE NOT NULL,");
    console.log("  username VARCHAR(255) UNIQUE NOT NULL,");
    console.log("  password VARCHAR(255) NOT NULL,");
    console.log("  first_name VARCHAR(255),");
    console.log("  last_name VARCHAR(255),");
    console.log("  profile_picture TEXT,");
    console.log("  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),");
    console.log(");");
    console.log("---------------------------------------------");

    // We can't directly create tables via the API, so we just log the schema
    return Promise.resolve();
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

  async createUserChallenge(
    userId: number,
    planId: number,
    transactionId: string
  ): Promise<UserChallenge> {
    const { data, error } = await this.supabase
      .from("user_challenges")
      .insert([
        {
          user_id: userId,
          plan_id: planId,
          status: "in_progress",
          transaction_id: transactionId,
          payment_status: "completed",
          start_date: new Date().toISOString(),
          end_date: null,
          current_profit: 0,
          current_drawdown: 0,
          trading_days: 0,
        },
      ])
      .select()
      .single();

    if (error || !data) {
      console.error("Error creating user challenge:", error);
      throw error || new Error("Failed to create challenge");
    }

    // Convert snake_case to camelCase
    return {
      id: data.id,
      userId: data.user_id,
      planId: data.plan_id,
      status: data.status,
      startDate: new Date(data.start_date),
      endDate: data.end_date ? new Date(data.end_date) : null,
      currentProfit: data.current_profit,
      currentDrawdown: data.current_drawdown,
      tradingDays: data.trading_days,
      transactionId: data.transaction_id,
      paymentStatus: data.payment_status,
    };
  }

  async getUserChallenges(userId: number): Promise<UserChallenge[]> {
    const { data, error } = await this.supabase
      .from("user_challenges")
      .select("*")
      .eq("user_id", userId)
      .order("start_date", { ascending: false });

    if (error) {
      console.error("Error fetching user challenges:", error);
      throw error;
    }

    // Convert snake_case to camelCase
    return (data || []).map((challenge) => ({
      id: challenge.id,
      userId: challenge.user_id,
      planId: challenge.plan_id,
      status: challenge.status,
      startDate: new Date(challenge.start_date),
      endDate: challenge.end_date ? new Date(challenge.end_date) : null,
      currentProfit: challenge.current_profit,
      currentDrawdown: challenge.current_drawdown,
      tradingDays: challenge.trading_days,
      transactionId: challenge.transaction_id,
      paymentStatus: challenge.payment_status,
    }));
  }

  async getUserChallenge(id: number): Promise<UserChallenge | undefined> {
    const { data, error } = await this.supabase
      .from("user_challenges")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) return undefined;

    // Convert snake_case to camelCase
    return {
      id: data.id,
      userId: data.user_id,
      planId: data.plan_id,
      status: data.status,
      startDate: new Date(data.start_date),
      endDate: data.end_date ? new Date(data.end_date) : null,
      currentProfit: data.current_profit,
      currentDrawdown: data.current_drawdown,
      tradingDays: data.trading_days,
      transactionId: data.transaction_id,
      paymentStatus: data.payment_status,
    };
  }

  async createTrade(
    trade: Omit<
      Trade,
      "id" | "createdAt" | "settledAt" | "result" | "profitLoss"
    >
  ): Promise<Trade> {
    const { data, error } = await this.supabase
      .from("trades")
      .insert([
        {
          challenge_id: trade.challengeId,
          user_id: trade.userId,
          sport: trade.sport,
          market: trade.market,
          selection: trade.selection,
          odds: trade.odds,
          stake: trade.stake,
          created_at: new Date().toISOString(),
          settled_at: null,
          result: null,
          profit_loss: null,
        },
      ])
      .select()
      .single();

    if (error || !data) {
      console.error("Error creating trade:", error);
      throw error || new Error("Failed to create trade");
    }

    // Convert snake_case to camelCase
    return {
      id: data.id,
      challengeId: data.challenge_id,
      userId: data.user_id,
      sport: data.sport,
      market: data.market,
      selection: data.selection,
      odds: data.odds,
      stake: data.stake,
      createdAt: new Date(data.created_at),
      settledAt: data.settled_at ? new Date(data.settled_at) : null,
      result: data.result,
      profitLoss: data.profit_loss,
    };
  }

  async getTradesByChallenge(challengeId: number): Promise<Trade[]> {
    const { data, error } = await this.supabase
      .from("trades")
      .select("*")
      .eq("challenge_id", challengeId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching trades by challenge:", error);
      throw error;
    }

    // Convert snake_case to camelCase
    return (data || []).map((trade) => ({
      id: trade.id,
      challengeId: trade.challenge_id,
      userId: trade.user_id,
      sport: trade.sport,
      market: trade.market,
      selection: trade.selection,
      odds: trade.odds,
      stake: trade.stake,
      createdAt: new Date(trade.created_at),
      settledAt: trade.settled_at ? new Date(trade.settled_at) : null,
      result: trade.result,
      profitLoss: trade.profit_loss,
    }));
  }
}

// Always use SupabaseStorage for all data operations
export const storage = new SupabaseStorage();
