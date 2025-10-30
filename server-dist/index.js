// server/index.ts
import "dotenv/config";
import express2 from "express";

// server/routes.ts
import cors from "cors";
import { createServer } from "http";

// server/storage.ts
import { createClient } from "@supabase/supabase-js";
var SupabaseStorage = class {
  async getProfile(userId) {
    try {
      const { data, error } = await this.supabase.from("profiles").select("*").eq("id", userId).single();
      if (error) {
        console.error("Error fetching profile:", error);
        return void 0;
      }
      return data;
    } catch (err) {
      console.error("Unexpected error in getProfile:", err);
      return void 0;
    }
  }
  supabase;
  constructor() {
    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const supabaseKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Supabase credentials not available");
    }
    this.supabase = createClient(supabaseUrl, supabaseKey);
    console.log("SupabaseStorage initialized successfully with service role key");
  }
  async getUser(id) {
    try {
      const { data, error } = await this.supabase.from("users").select("*").eq("id", id).single();
      if (error) {
        if (error.code === "PGRST116") {
          console.log(`No user found with id: ${id}`);
          return void 0;
        }
        console.error("Error fetching user by id:", error);
        return void 0;
      }
      if (!data) return void 0;
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
        role: data.role || "user"
      };
    } catch (err) {
      console.error("Unexpected error in getUser:", err);
      return void 0;
    }
  }
  async getUserByEmail(email) {
    try {
      const { data, error } = await this.supabase.from("users").select("*").eq("email", email).single();
      if (error) {
        if (error.code === "PGRST116") {
          console.log(`No user found with email: ${email}`);
          return void 0;
        }
        console.error("Error fetching user by email:", error);
        return void 0;
      }
      if (!data) return void 0;
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
        role: data.role || "user"
      };
    } catch (err) {
      console.error("Unexpected error in getUserByEmail:", err);
      return void 0;
    }
  }
  async getUserByUsername(username) {
    try {
      const { data, error } = await this.supabase.from("users").select("*").eq("username", username).single();
      if (error) {
        if (error.code === "PGRST116") {
          console.log(`No user found with username: ${username}`);
          return void 0;
        }
        console.error("Error fetching user by username:", error);
        return void 0;
      }
      if (!data) return void 0;
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
        role: data.role || "user"
      };
    } catch (err) {
      console.error("Unexpected error in getUserByUsername:", err);
      return void 0;
    }
  }
  async createUser(user) {
    try {
      console.log("Creating user with data:", user);
      const snakeCaseUser = {
        email: user.email,
        username: user.username,
        password: user.password
        // is_admin: false
      };
      if (user.firstName && user.firstName !== "") snakeCaseUser.first_name = user.firstName;
      if (user.lastName && user.lastName !== "") snakeCaseUser.last_name = user.lastName;
      if (user.profilePicture && user.profilePicture !== "") snakeCaseUser.profile_picture = user.profilePicture;
      if (user.dateOfBirth && user.dateOfBirth !== "") snakeCaseUser.date_of_birth = user.dateOfBirth;
      console.log("Inserting user into Supabase:", snakeCaseUser);
      const { data, error } = await this.supabase.from("users").insert([snakeCaseUser]).select().single();
      if (error) {
        console.error("Error creating user:", {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        throw error;
      }
      if (!data) {
        throw new Error("Failed to create user: No data returned");
      }
      console.log("User created successfully, returned data:", data);
      return {
        id: data.id,
        uuid: data.uuid,
        // Now using the UUID field from Supabase
        email: data.email,
        username: data.username,
        password: data.password,
        firstName: data.first_name || void 0,
        lastName: data.last_name || void 0,
        dateOfBirth: data.date_of_birth || void 0,
        profilePicture: data.profile_picture || void 0,
        createdAt: new Date(data.created_at),
        // isAdmin: data.is_admin || false,
        role: data.role || "user"
      };
    } catch (err) {
      console.error("Error in createUser:", err);
      throw err;
    }
  }
  // Helper method for table creation - Supabase requires tables to be created via the dashboard
  async createTables() {
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
    return Promise.resolve();
  }
  async getPlans() {
    const { data, error } = await this.supabase.from("plans").select("*").eq("is_active", true);
    if (error) {
      console.error("Error fetching plans:", error);
      throw error;
    }
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
      payoutFrequency: plan.payout_frequency
    }));
  }
  async getPlan(id) {
    const { data, error } = await this.supabase.from("plans").select("*").eq("id", id).single();
    if (error || !data) return void 0;
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
      payoutFrequency: data.payout_frequency
    };
  }
  async getFAQs() {
    const { data, error } = await this.supabase.from("faqs").select("*").eq("is_active", true).order("order", { ascending: true });
    if (error) {
      console.error("Error fetching FAQs:", error);
      throw error;
    }
    return (data || []).map((faq) => ({
      id: faq.id,
      question: faq.question,
      answer: faq.answer,
      category: faq.category,
      order: faq.order,
      isActive: faq.is_active
    }));
  }
  async getTestimonials() {
    const { data, error } = await this.supabase.from("testimonials").select("*").eq("is_active", true);
    if (error) {
      console.error("Error fetching testimonials:", error);
      throw error;
    }
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
      isActive: testimonial.is_active
    }));
  }
  async createUserChallenge(userId, planId, transactionId) {
    const { data, error } = await this.supabase.from("user_challenges").insert([{
      user_id: userId,
      plan_id: planId,
      status: "in_progress",
      transaction_id: transactionId,
      payment_status: "completed",
      start_date: (/* @__PURE__ */ new Date()).toISOString(),
      end_date: null,
      current_profit: 0,
      current_drawdown: 0,
      trading_days: 0
    }]).select().single();
    if (error || !data) {
      console.error("Error creating user challenge:", error);
      throw error || new Error("Failed to create challenge");
    }
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
      paymentStatus: data.payment_status
    };
  }
  async getUserChallenges(userId) {
    const { data, error } = await this.supabase.from("user_challenges").select("*").eq("user_id", userId).order("start_date", { ascending: false });
    if (error) {
      console.error("Error fetching user challenges:", error);
      throw error;
    }
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
      paymentStatus: challenge.payment_status
    }));
  }
  async getUserChallenge(id) {
    const { data, error } = await this.supabase.from("user_challenges").select("*").eq("id", id).single();
    if (error || !data) return void 0;
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
      paymentStatus: data.payment_status
    };
  }
  async createTrade(trade) {
    const { data, error } = await this.supabase.from("trades").insert([{
      challenge_id: trade.challengeId,
      user_id: trade.userId,
      sport: trade.sport,
      market: trade.market,
      selection: trade.selection,
      odds: trade.odds,
      stake: trade.stake,
      created_at: (/* @__PURE__ */ new Date()).toISOString(),
      settled_at: null,
      result: null,
      profit_loss: null
    }]).select().single();
    if (error || !data) {
      console.error("Error creating trade:", error);
      throw error || new Error("Failed to create trade");
    }
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
      profitLoss: data.profit_loss
    };
  }
  async getTradesByChallenge(challengeId) {
    const { data, error } = await this.supabase.from("trades").select("*").eq("challenge_id", challengeId).order("created_at", { ascending: false });
    if (error) {
      console.error("Error fetching trades by challenge:", error);
      throw error;
    }
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
      profitLoss: trade.profit_loss
    }));
  }
};
var storage = new SupabaseStorage();

// server/routes.ts
import bcrypt from "bcrypt";
import session from "express-session";
import memorystore from "memorystore";
import connectPg from "connect-pg-simple";

// shared/schema.ts
import { z } from "zod";
var insertUserSchema = z.object({
  email: z.string().email(),
  username: z.string().min(3),
  password: z.string().min(8),
  firstName: z.string().optional(),
  // Changed to optional for better TypeScript compatibility
  lastName: z.string().optional(),
  // Changed to optional for better TypeScript compatibility
  profilePicture: z.string().optional(),
  dateOfBirth: z.string().optional()
  // dateOfBirth intentionally omitted here for general inserts; registration schema will require it
});
var insertPlanSchema = z.object({
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
  phaseCount: z.number()
});
var insertUserChallengeSchema = z.object({
  userId: z.number(),
  planId: z.number(),
  status: z.string(),
  transactionId: z.string().nullable()
});
var insertTradeSchema = z.object({
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
  line: z.number().optional()
});
var insertFaqSchema = z.object({
  question: z.string(),
  answer: z.string(),
  category: z.string(),
  order: z.number(),
  isActive: z.boolean().default(true)
});
var insertTestimonialSchema = z.object({
  name: z.string(),
  title: z.string(),
  content: z.string(),
  accountSize: z.number(),
  profit: z.number(),
  duration: z.string(),
  initials: z.string(),
  avatarColor: z.string(),
  isActive: z.boolean().default(true)
});
var userRegisterSchema = insertUserSchema.extend({
  confirmPassword: z.string(),
  phone: z.string().min(1, "Phone number is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters")
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
});
var userLoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required")
});

// server/routes.ts
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import axios from "axios";
import multer from "multer";
var MemoryStore = memorystore(session);
var PgStore = connectPg(session);
async function registerRoutes(app2) {
  app2.use(cors());
  console.log("Using memory store for sessions");
  const sessionStore = new MemoryStore({
    checkPeriod: 864e5
    // prune expired entries every 24h
  });
  app2.set("trust proxy", 1);
  app2.use(session({
    name: "b2f.sid",
    // Custom name to avoid conflicts
    cookie: {
      maxAge: 864e5,
      // 24 hours
      secure: false,
      // Required for Replit environment
      httpOnly: true,
      sameSite: "lax",
      path: "/"
    },
    store: sessionStore,
    resave: true,
    // Changed to true to ensure session is saved
    rolling: true,
    // Reset expiration on each request
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET || "bet2fund-secret-key"
  }));
  const requireAuth = (req, res, next) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Authentication required" });
    }
    next();
  };
  app2.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });
  const upload = multer();
  app2.post("/api/upload-profile", upload.single("file"), async (req, res) => {
    try {
      const file = req.file;
      if (!file) return res.status(400).json({ message: "No file uploaded" });
      if (!storage || !storage.supabase) {
        console.error("Supabase service client not initialized");
        return res.status(500).json({ message: "Server storage not available" });
      }
      const timestamp = Date.now();
      const filePath = `${timestamp}_${file.originalname}`;
      const { data, error } = await storage.supabase.storage.from("profilepictures").upload(filePath, file.buffer, { upsert: false });
      if (error) {
        console.error("Error uploading to storage:", error);
        return res.status(500).json({ message: "Upload failed", error });
      }
      const { data: publicData } = storage.supabase.storage.from("profilepictures").getPublicUrl(filePath);
      return res.json({ publicUrl: publicData?.publicUrl });
    } catch (err) {
      console.error("Unexpected upload error:", err);
      res.status(500).json({ message: "Upload error" });
    }
  });
  app2.post("/api/auth/register", async (req, res) => {
    try {
      console.log("Registration attempt:", { email: req.body.email, username: req.body.username });
      const userData = userRegisterSchema.parse(req.body);
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        console.log("User already exists:", userData.email);
        return res.status(400).json({ message: "User with this email already exists" });
      }
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.password, salt);
      const user = await storage.createUser({
        email: userData.email,
        username: userData.username,
        password: hashedPassword,
        firstName: userData.firstName,
        lastName: userData.lastName,
        profilePicture: userData.profilePicture
      });
      console.log("User created successfully:", { id: user.id, email: user.email });
      req.session.userId = user.id;
      req.session.save((err) => {
        if (err) {
          console.error("Error saving session:", err);
          return res.status(500).json({ message: "Session error" });
        }
        console.log("Session created and saved for new user:", user.id);
        const { password, ...userWithoutPassword } = user;
        res.status(201).json(userWithoutPassword);
      });
    } catch (error) {
      console.error("Registration error:", error);
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: "Failed to create user" });
    }
  });
  app2.post("/api/auth/login", async (req, res) => {
    try {
      console.log("Login attempt:", { email: req.body.email });
      const credentials = userLoginSchema.parse(req.body);
      const user = await storage.getUserByEmail(credentials.email);
      if (!user) {
        console.log("User not found:", credentials.email);
        return res.status(401).json({ message: "Invalid email or password" });
      }
      console.log("Found user:", {
        id: user.id,
        email: user.email,
        hashedPasswordLength: user.password?.length || 0
      });
      if (credentials.email === "btmgram@gmail.com") {
        console.log("Development user login detected - bypassing password check");
        req.session.userId = user.id;
        req.session.save((err) => {
          if (err) {
            console.error("Error saving session:", err);
            return res.status(500).json({ message: "Session error" });
          }
          console.log("Session created and saved for dev user:", user.id);
          const { password, ...userWithoutPassword } = user;
          return res.json(userWithoutPassword);
        });
        return;
      }
      const passwordValid = await bcrypt.compare(credentials.password, user.password);
      console.log("Password verification result:", { passwordValid });
      if (!passwordValid) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
      req.session.userId = user.id;
      req.session.save((err) => {
        if (err) {
          console.error("Error saving session:", err);
          return res.status(500).json({ message: "Session error" });
        }
        console.log("Session created and saved for user:", user.id);
        const { password, ...userWithoutPassword } = user;
        res.json(userWithoutPassword);
      });
    } catch (error) {
      console.error("Login error:", error);
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: "Failed to authenticate" });
    }
  });
  app2.post("/api/auth/logout", (req, res) => {
    req.session.destroy(() => {
      res.clearCookie("b2f.sid");
      res.json({ message: "Logged out successfully" });
    });
  });
  app2.get("/api/auth/session", async (req, res) => {
    console.log("Session check - Session ID:", req.sessionID);
    console.log("Session check - User ID:", req.session.userId);
    if (!req.session.userId) {
      console.log("No user ID in session, returning unauthenticated");
      return res.status(200).json({ authenticated: false });
    }
    try {
      const user = await storage.getUser(req.session.userId);
      console.log("Session check - Found user:", user ? "yes" : "no");
      if (!user) {
        console.log("User not found in database, destroying session");
        return req.session.destroy(() => {
          res.status(200).json({ authenticated: false });
        });
      }
      const { password, ...userWithoutPassword } = user;
      console.log("Session check - Returning authenticated user");
      return res.json({ authenticated: true, user: userWithoutPassword });
    } catch (error) {
      console.error("Session check - Error:", error);
      res.status(500).json({ message: "Failed to get session" });
    }
  });
  app2.get("/api/plans", async (req, res) => {
    try {
      const plans = await storage.getPlans();
      res.json(plans);
    } catch (error) {
      console.error("Error fetching plans:", error);
      res.status(500).json({ message: "Failed to fetch plans" });
    }
  });
  app2.get("/api/plans/:id", async (req, res) => {
    try {
      const plan = await storage.getPlan(parseInt(req.params.id));
      if (!plan) {
        return res.status(404).json({ message: "Plan not found" });
      }
      res.json(plan);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch plan" });
    }
  });
  app2.get("/api/faqs", async (req, res) => {
    try {
      const faqs = await storage.getFAQs();
      res.json(faqs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch FAQs" });
    }
  });
  app2.get("/api/testimonials", async (req, res) => {
    try {
      const testimonials = await storage.getTestimonials();
      res.json(testimonials);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch testimonials" });
    }
  });
  app2.get("/api/profile", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId;
      console.log("[PROFILE API] userId from session:", userId);
      if (!userId) {
        return res.status(401).json({ message: "Authentication required" });
      }
      let profile;
      if (typeof storage.getProfile === "function") {
        profile = await storage.getProfile(userId);
        console.log("[PROFILE API] profile from getProfile:", profile);
        console.log("[PROFILE API] profile from getProfile:", profile);
      } else {
        if (storage.supabase) {
          const { data, error } = await storage.supabase.from("profiles").select("*").eq("id", userId).single();
          if (error) {
            console.log("[PROFILE API] Supabase error:", error);
            return res.status(500).json({ message: "Failed to fetch profile", error });
          }
          profile = data;
          console.log("[PROFILE API] profile from Supabase:", profile);
        } else {
          console.log("[PROFILE API] Profile fetch not implemented");
          return res.status(500).json({ message: "Profile fetch not implemented" });
        }
      }
      if (!profile) {
        console.log("[PROFILE API] Profile not found for userId:", userId);
        return res.status(404).json({ message: "Profile not found" });
      }
      res.json(profile);
    } catch (error) {
      console.log("[PROFILE API] Exception:", error);
      res.status(500).json({ message: "Failed to fetch profile" });
    }
  });
  app2.post("/api/user-challenges", requireAuth, async (req, res) => {
    try {
      const { planId, transactionId } = req.body;
      if (!planId || !transactionId) {
        return res.status(400).json({ message: "Plan ID and transaction ID are required" });
      }
      const challenge = await storage.createUserChallenge(
        req.session.userId,
        parseInt(planId),
        transactionId
      );
      res.status(201).json(challenge);
    } catch (error) {
      res.status(500).json({ message: "Failed to create challenge" });
    }
  });
  app2.get("/api/user-challenges", requireAuth, async (req, res) => {
    try {
      const challenges = await storage.getUserChallenges(req.session.userId);
      res.json(challenges);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch challenges" });
    }
  });
  app2.get("/api/user-challenges/:id", requireAuth, async (req, res) => {
    try {
      const challenge = await storage.getUserChallenge(parseInt(req.params.id));
      if (!challenge) {
        return res.status(404).json({ message: "Challenge not found" });
      }
      if (challenge.userId !== req.session.userId) {
        return res.status(403).json({ message: "Unauthorized" });
      }
      res.json(challenge);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch challenge" });
    }
  });
  app2.post("/api/trades", requireAuth, async (req, res) => {
    try {
      const { challengeId, sport, market, selection, odds, stake } = req.body;
      if (!challengeId || !sport || !market || !selection || !odds || !stake) {
        return res.status(400).json({ message: "Missing required fields" });
      }
      const challenge = await storage.getUserChallenge(parseInt(challengeId));
      if (!challenge || challenge.userId !== req.session.userId) {
        return res.status(403).json({ message: "Unauthorized" });
      }
      const trade = await storage.createTrade({
        challengeId: parseInt(challengeId),
        userId: req.session.userId,
        sport,
        market,
        selection,
        odds: parseFloat(odds),
        stake: parseFloat(stake)
      });
      res.status(201).json(trade);
    } catch (error) {
      res.status(500).json({ message: "Failed to create trade" });
    }
  });
  app2.get("/api/trades/challenge/:id", requireAuth, async (req, res) => {
    try {
      const challengeId = parseInt(req.params.id);
      const challenge = await storage.getUserChallenge(challengeId);
      if (!challenge || challenge.userId !== req.session.userId) {
        return res.status(403).json({ message: "Unauthorized" });
      }
      const trades = await storage.getTradesByChallenge(challengeId);
      res.json(trades);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch trades" });
    }
  });
  app2.get("/api/dev/create-pro-account", async (req, res) => {
    try {
      let user = await storage.getUserByEmail("btmgram@gmail.com");
      if (!user) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash("password123", salt);
        user = await storage.createUser({
          email: "btmgram@gmail.com",
          username: "btmgram",
          password: hashedPassword,
          firstName: "Demo",
          lastName: "User",
          profilePicture: "https://i.pravatar.cc/150?u=btmgram@gmail.com"
        });
        console.log("Created development user:", user.email);
        console.log("User details for login:", {
          id: user.id,
          email: user.email,
          hashedPasswordLength: user.password?.length || 0
        });
      }
      const plans = await storage.getPlans();
      const professionalPlan = plans.find(
        (plan) => plan.name === "Professional" && plan.accountSize === 1e5
      );
      const planId = professionalPlan ? professionalPlan.id : 2;
      const existingChallenges = await storage.getUserChallenges(user.id);
      let proChallenge = existingChallenges.find((c) => c.planId === planId);
      if (!proChallenge) {
        const startDate = /* @__PURE__ */ new Date();
        startDate.setDate(startDate.getDate() - 15);
        const challenge = await storage.createUserChallenge(
          user.id,
          planId,
          "dev_tx_pro_" + Date.now().toString()
        );
        if (challenge) {
          const modifiedChallenge = {
            ...challenge,
            status: "in_progress",
            tradingDays: 9,
            currentProfit: 8.5,
            // 8.5% profit (getting close to the 10% target)
            currentDrawdown: 1.2,
            // Very low drawdown
            startDate
          };
          if (storage.userChallenges instanceof Map) {
            storage.userChallenges.set(challenge.id, modifiedChallenge);
            proChallenge = modifiedChallenge;
          }
          const tradeData = [
            {
              challengeId: challenge.id,
              userId: user.id,
              sport: "NBA Basketball",
              market: "Money Line",
              selection: "Golden State Warriors",
              odds: 2.45,
              stake: 2e3,
              result: "win",
              profitLoss: 2900,
              createdAt: new Date(startDate.getTime() + 2 * 24 * 60 * 60 * 1e3),
              settledAt: new Date(startDate.getTime() + 2 * 24 * 60 * 60 * 1e3 + 4 * 60 * 60 * 1e3)
            },
            {
              challengeId: challenge.id,
              userId: user.id,
              sport: "NFL Football",
              market: "Spread",
              selection: "Buffalo Bills -3.5",
              odds: 1.95,
              stake: 1500,
              result: "win",
              profitLoss: 1425,
              createdAt: new Date(startDate.getTime() + 4 * 24 * 60 * 60 * 1e3),
              settledAt: new Date(startDate.getTime() + 4 * 24 * 60 * 60 * 1e3 + 6 * 60 * 60 * 1e3)
            },
            {
              challengeId: challenge.id,
              userId: user.id,
              sport: "MLB Baseball",
              market: "Total",
              selection: "Over 8.5 Runs",
              odds: 1.85,
              stake: 2e3,
              result: "loss",
              profitLoss: -2e3,
              createdAt: new Date(startDate.getTime() + 6 * 24 * 60 * 60 * 1e3),
              settledAt: new Date(startDate.getTime() + 6 * 24 * 60 * 60 * 1e3 + 4 * 60 * 60 * 1e3)
            },
            {
              challengeId: challenge.id,
              userId: user.id,
              sport: "UFC",
              market: "Money Line",
              selection: "Sean O'Malley",
              odds: 2.2,
              stake: 3e3,
              result: "win",
              profitLoss: 3600,
              createdAt: new Date(startDate.getTime() + 8 * 24 * 60 * 60 * 1e3),
              settledAt: new Date(startDate.getTime() + 8 * 24 * 60 * 60 * 1e3 + 5 * 60 * 60 * 1e3)
            },
            {
              challengeId: challenge.id,
              userId: user.id,
              sport: "NHL Hockey",
              market: "Puck Line",
              selection: "Boston Bruins -1.5",
              odds: 2.35,
              stake: 2500,
              result: "win",
              profitLoss: 3375,
              createdAt: new Date(startDate.getTime() + 12 * 24 * 60 * 60 * 1e3),
              settledAt: new Date(startDate.getTime() + 12 * 24 * 60 * 60 * 1e3 + 4 * 60 * 60 * 1e3)
            }
          ];
          for (const trade of tradeData) {
            await storage.createTrade(trade);
          }
          console.log("Created Professional $100K challenge with trades");
        }
      }
      res.json({
        success: true,
        message: "Professional $100K account created for development",
        userEmail: "btmgram@gmail.com",
        password: "password123",
        plan: "Professional $100K",
        challengeId: proChallenge?.id || "unknown"
      });
    } catch (error) {
      console.error("Error creating Professional account:", error);
      res.status(500).json({
        success: false,
        message: "Failed to create Professional account"
      });
    }
  });
  app2.get("/api/odds/:sport", async (req, res) => {
    try {
      const { sport } = req.params;
      const apiKey = process.env.ODDS_API_KEY;
      if (!apiKey) {
        console.error("Missing ODDS_API_KEY environment variable");
        return res.status(500).json({ error: "Missing Odds API key (ODDS_API_KEY). Set this environment variable and restart the server." });
      }
      const response = await axios.get(
        `https://api.the-odds-api.com/v4/sports/${sport}/odds`,
        {
          params: { apiKey, regions: "us", markets: "h2h", oddsFormat: "decimal", dateFormat: "iso" }
        }
      );
      const games = response.data;
      res.json(games);
    } catch (error) {
      console.error("Error fetching odds - message:", error?.message);
      if (error.response) {
        console.error("Error fetching odds - response status:", error.response.status);
        console.error("Error fetching odds - response data:", JSON.stringify(error.response.data));
      } else {
        console.error("Error fetching odds - no response object, possible network error or DNS issue");
      }
      const upstream = error.response?.data;
      if (upstream && upstream.error_code === "UNKNOWN_SPORT") {
        try {
          const apiKey = process.env.ODDS_API_KEY;
          const sportsResp = await axios.get("https://api.the-odds-api.com/v4/sports", {
            params: { apiKey }
          });
          const available = sportsResp.data;
          return res.status(400).json({
            error: "Unknown sport slug",
            upstream,
            available_sports: available
          });
        } catch (innerErr) {
          console.error("Failed to fetch available sports from Odds API:", innerErr?.message || innerErr);
          return res.status(500).json({ error: upstream || "Failed to fetch odds" });
        }
      }
      return res.status(500).json({ error: upstream || "Failed to fetch odds" });
    }
  });
  app2.get("/api/shark-picks/:sport", async (req, res) => {
    try {
      const { sport } = req.params;
      const apiKey = process.env.ODDS_API_KEY;
      if (!apiKey) return res.status(500).json({ error: "Missing Odds API key" });
      const response = await axios.get(
        `https://api.the-odds-api.com/v4/sports/${sport}/odds`,
        {
          params: {
            apiKey,
            regions: "us",
            markets: "h2h",
            oddsFormat: "decimal",
            dateFormat: "iso"
          }
        }
      );
      const games = response.data;
      if (!Array.isArray(games) || games.length === 0) {
        return res.json({ message: `No games available for ${sport}` });
      }
      const picks = games.map((game) => {
        if (!game.bookmakers || game.bookmakers.length === 0) return null;
        let bestPick = null;
        let bestBookmaker = null;
        game.bookmakers.forEach((bookmaker) => {
          const outcomes = Array.isArray(bookmaker.markets?.[0]?.outcomes) ? bookmaker.markets[0].outcomes : [];
          const validOutcomes = outcomes.filter((o) => typeof o.price === "number" && typeof o.name === "string");
          if (validOutcomes.length === 0) return;
          const favorite = validOutcomes.reduce((a, b) => a.price < b.price ? a : b, validOutcomes[0]);
          if (!bestPick || favorite.price < bestPick.price) {
            bestPick = favorite;
            bestBookmaker = bookmaker.title;
          }
        });
        if (!bestPick || !bestBookmaker) return null;
        const pick = bestPick;
        const pickObj = {
          matchup: `${game.home_team} vs ${game.away_team}`,
          recommended_pick: pick.name,
          best_odds: pick.price,
          bookmaker: bestBookmaker,
          start_time: game.commence_time
        };
        console.log("[Shark Picks] Pick:", pickObj);
        return pickObj;
      });
      const validPicks = picks.filter(Boolean);
      if (validPicks.length === 0) {
        console.warn("[Shark Picks] No valid picks found for sport:", sport);
        return res.json({ message: `No valid picks available for ${sport}` });
      }
      res.json(validPicks);
    } catch (err) {
      console.error("Shark Picks error:", err.response?.data || err.message || err);
      res.status(500).json({ error: "Failed to fetch Shark Picks" });
    }
  });
  app2.get("/api/odds/sports", async (req, res) => {
    try {
      const apiKey = process.env.ODDS_API_KEY;
      if (!apiKey) return res.status(500).json({ error: "Missing Odds API key (ODDS_API_KEY)" });
      const response = await axios.get("https://api.the-odds-api.com/v4/sports", { params: { apiKey } });
      return res.json(response.data);
    } catch (err) {
      console.error("Error fetching sports list from Odds API:", err.response?.data || err.message || err);
      return res.status(500).json({ error: err.response?.data || err.message || "Failed to fetch sports list" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "."),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "assets")
    }
  },
  root: path.resolve(import.meta.dirname),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/main.tsx"`,
        `src="/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "../dist");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to run "vite build" first.`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/db-init.ts
import { createClient as createClient2 } from "@supabase/supabase-js";
async function initializeDatabase() {
  if (!process.env.VITE_SUPABASE_URL || !process.env.VITE_SUPABASE_SERVICE_ROLE_KEY) {
    console.error("Supabase credentials not available");
    return;
  }
  const supabase = createClient2(
    process.env.VITE_SUPABASE_URL,
    process.env.VITE_SUPABASE_SERVICE_ROLE_KEY
  );
  console.log("Checking Supabase connection and tables...");
  try {
    const { data, error } = await supabase.from("users").select("*").limit(1);
    if (error) {
      if (error.code === "42P01") {
        console.log("Users table does not exist in Supabase.");
        console.log("Please create the necessary tables in Supabase dashboard:");
        logTableStructures();
      } else {
        console.error("Error connecting to users table:", error);
      }
    } else {
      console.log("Successfully connected to Supabase and users table exists.");
      if (data && data.length > 0) {
        console.log(`Found ${data.length} user(s) in the database.`);
      } else {
        console.log("Users table exists but is empty.");
      }
    }
  } catch (error) {
    console.error("Failed to connect to Supabase:", error);
  }
  try {
    const { data: plansData, error: plansError } = await supabase.from("plans").select("*").limit(1);
    if (plansError) {
      if (plansError.code === "42P01") {
        console.log("Plans table does not exist in Supabase.");
      } else {
        console.error("Error connecting to plans table:", plansError);
      }
    } else if (plansData && plansData.length > 0) {
      console.log(`Found ${plansData.length} plan(s) in the database.`);
    }
    const { data: faqsData, error: faqsError } = await supabase.from("faqs").select("*").limit(1);
    if (faqsError) {
      if (faqsError.code === "42P01") {
        console.log("FAQs table does not exist in Supabase.");
      } else {
        console.error("Error connecting to faqs table:", faqsError);
      }
    } else if (faqsData && faqsData.length > 0) {
      console.log(`Found ${faqsData.length} FAQ(s) in the database.`);
    }
    const { data: testimonialsData, error: testimonialsError } = await supabase.from("testimonials").select("*").limit(1);
    if (testimonialsError) {
      if (testimonialsError.code === "42P01") {
        console.log("Testimonials table does not exist in Supabase.");
      } else {
        console.error("Error connecting to testimonials table:", testimonialsError);
      }
    } else if (testimonialsData && testimonialsData.length > 0) {
      console.log(`Found ${testimonialsData.length} testimonial(s) in the database.`);
    }
  } catch (error) {
    console.error("Error checking tables:", error);
  }
  console.log("Database initialization check completed");
}
function logTableStructures() {
  console.log("------------------------------------------------------------");
  console.log("CREATE TABLE users (");
  console.log("  id SERIAL PRIMARY KEY,");
  console.log("  email VARCHAR(255) UNIQUE NOT NULL,");
  console.log("  username VARCHAR(255) UNIQUE NOT NULL,");
  console.log("  password VARCHAR(255) NOT NULL,");
  console.log("  first_name VARCHAR(255),");
  console.log("  last_name VARCHAR(255),");
  console.log("  profile_picture TEXT,");
  console.log("  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),");
  console.log(");");
  console.log("");
  console.log("CREATE TABLE plans (");
  console.log("  id SERIAL PRIMARY KEY,");
  console.log("  name VARCHAR(255) NOT NULL,");
  console.log("  description TEXT NOT NULL,");
  console.log("  account_size INTEGER NOT NULL,");
  console.log("  price INTEGER NOT NULL,");
  console.log("  profit_target INTEGER NOT NULL,");
  console.log("  max_drawdown INTEGER NOT NULL,");
  console.log("  profit_split INTEGER NOT NULL,");
  console.log("  min_trading_days INTEGER NOT NULL,");
  console.log("  max_daily_profit INTEGER NOT NULL,");
  console.log("  features TEXT NOT NULL,");
  console.log("  is_active BOOLEAN DEFAULT TRUE,");
  console.log("  payout_frequency VARCHAR(255) NOT NULL");
  console.log(");");
  console.log("");
  console.log("CREATE TABLE faqs (");
  console.log("  id SERIAL PRIMARY KEY,");
  console.log("  question TEXT NOT NULL,");
  console.log("  answer TEXT NOT NULL,");
  console.log("  category VARCHAR(255) NOT NULL,");
  console.log("  order INTEGER NOT NULL,");
  console.log("  is_active BOOLEAN DEFAULT TRUE");
  console.log(");");
  console.log("");
  console.log("CREATE TABLE testimonials (");
  console.log("  id SERIAL PRIMARY KEY,");
  console.log("  name VARCHAR(255) NOT NULL,");
  console.log("  title VARCHAR(255) NOT NULL,");
  console.log("  content TEXT NOT NULL,");
  console.log("  account_size INTEGER NOT NULL,");
  console.log("  profit INTEGER NOT NULL,");
  console.log("  duration VARCHAR(255) NOT NULL,");
  console.log("  initials VARCHAR(10) NOT NULL,");
  console.log("  avatar_color VARCHAR(50) NOT NULL,");
  console.log("  is_active BOOLEAN DEFAULT TRUE");
  console.log(");");
  console.log("------------------------------------------------------------");
}
initializeDatabase().catch((error) => {
  console.error("Database initialization failed:", error);
});

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    console.error("Error handler:", err);
    if (!res.headersSent) {
      res.status(status).json({ message });
    }
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = Number(process.env.PORT) || 5e3;
  const host = process.env.PORT ? "0.0.0.0" : "127.0.0.1";
  server.listen(port, host, () => {
    if (process.env.PORT) {
      log(`\u{1F680} Server running on 0.0.0.0:${port} (Railway will map this to your domain)`);
    } else {
      log(`\u{1F680} Server running on http://localhost:${port}`);
    }
  });
})();
