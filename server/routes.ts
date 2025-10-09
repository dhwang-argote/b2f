import type { Express, Request, Response } from "express";
import cors from "cors";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import bcrypt from "bcrypt";
import session from "express-session";
import memorystore from "memorystore";
import connectPg from "connect-pg-simple";
import { userRegisterSchema, userLoginSchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import axios from "axios";
import multer from 'multer';
import crypto from "crypto";
import { MemStorage } from "./storage";

const MemoryStore = memorystore(session);
const PgStore = connectPg(session);

// Session type augmentation
declare module "express-session" {
  interface SessionData {
    userId: number;
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  try {
    // Enable CORS for all routes
    app.use(cors());
    // Setup session middleware
    // Using memory store for sessions to avoid connection issues with Supabase
    console.log("Using memory store for sessions");
    const sessionStore = new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    });

    // Set appropriate trust proxy settings to handle Replit's proxy
    app.set('trust proxy', 1);

    app.use(session({
      name: 'b2f.sid', // Custom name to avoid conflicts
      cookie: {
        maxAge: 86400000, // 24 hours
        secure: false, // Required for Replit environment
        httpOnly: true,
        sameSite: 'lax',
        path: '/'
      },
      store: sessionStore,
      resave: true, // Changed to true to ensure session is saved
      rolling: true, // Reset expiration on each request
      saveUninitialized: false,
      secret: process.env.SESSION_SECRET || "bet2fund-secret-key"
    }));

    // Authentication middleware
    const requireAuth = (req: Request, res: Response, next: Function) => {
      if (!req.session.userId) {
        return res.status(401).json({ message: "Authentication required" });
      }
      next();
    };

    // API routes
    app.get("/api/health", (req, res) => {
      res.json({ status: "ok" });
    });

    // Upload profile picture (server-side) - uses service role client
    // Accepts multipart/form-data with field 'file'
    const upload = multer();

    app.post('/api/upload-profile', upload.single('file'), async (req: Request, res: Response) => {
      try {
        const file = (req as any).file;
        if (!file) return res.status(400).json({ message: 'No file uploaded' });

        // Use the storage client created in storage.ts (service role)
        if (!storage || !(storage as any).supabase) {
          console.error('Supabase service client not initialized');
          return res.status(500).json({ message: 'Server storage not available' });
        }

        const timestamp = Date.now();
        const filePath = `${timestamp}_${file.originalname}`;

        const { data, error } = await (storage as any).supabase.storage
          .from('profilepictures')
          .upload(filePath, file.buffer, { upsert: false });

        if (error) {
          console.error('Error uploading to storage:', error);
          return res.status(500).json({ message: 'Upload failed', error });
        }

        const { data: publicData } = (storage as any).supabase.storage.from('profilepictures').getPublicUrl(filePath);
        return res.json({ publicUrl: publicData?.publicUrl });
      } catch (err) {
        console.error('Unexpected upload error:', err);
        return res.status(500).json({ message: 'Upload error' });
      }
    });

    app.post("/api/auth/login", async (req, res) => {
      try {
        console.log("Login attempt:", { email: req.body.email });
        const credentials = userLoginSchema.parse(req.body);

        // Find user by email
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

        // Special handling for development user
        if (credentials.email === 'btmgram@gmail.com') {
          console.log("Development user login detected - bypassing password check");

          // Set session
          req.session.userId = user.id;
          req.session.save((err) => {
            if (err) {
              console.error("Error saving session:", err);
              return res.status(500).json({ message: "Session error" });
            }

            console.log("Session created and saved for dev user:", user.id);

            // Return user without password
            const { password, ...userWithoutPassword } = user;
            return res.json(userWithoutPassword);
          });
          return; // Important to return here and let the session.save callback handle the response
        }

        // Normal password verification for other users
        const passwordValid = await bcrypt.compare(credentials.password, user.password);
        console.log("Password verification result:", { passwordValid });

        if (!passwordValid) {
          return res.status(401).json({ message: "Invalid email or password" });
        }

        // Set session
        req.session.userId = user.id;
        req.session.save((err) => {
          if (err) {
            console.error("Error saving session:", err);
            return res.status(500).json({ message: "Session error" });
          }

          console.log("Session created and saved for user:", user.id);

          // Return user without password
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

    app.post("/api/auth/logout", (req, res) => {
      req.session.destroy(() => {
        res.clearCookie("b2f.sid"); // Updated cookie name to match our session name
        res.json({ message: "Logged out successfully" });
      });
    });

    // Allow logged-in users to claim a purchase by transactionId/purchaseToken (for returning buyers)
    app.post('/api/auth/claim-purchase', requireAuth, async (req, res) => {
      try {
        const transactionId = (req.body.transactionId || req.body.purchaseToken || req.body.transaction_id) as string | undefined;
        const txHash = (req.body.txHash || req.body.purchaseTxHash) as string | undefined;

        if (!transactionId && !txHash) return res.status(400).json({ message: 'transactionId or txHash is required' });

        const supabase = (storage as any).supabase;
        if (!supabase) return res.status(500).json({ message: 'Server storage not available' });

        // Query transaction by id or hash
        let txQuery = supabase.from('transactions').select('*');
        if (transactionId) txQuery = txQuery.eq('id', transactionId);
        else txQuery = txQuery.eq('tx_hash', txHash);

        const { data: tx, error: txErr } = await txQuery.single();
        if (txErr || !tx) return res.status(404).json({ message: 'Purchase not found' });
        if (tx.status !== 'completed') return res.status(400).json({ message: 'Purchase not completed' });
        if (tx.user_id && tx.user_id !== req.session.userId) return res.status(400).json({ message: 'Purchase already claimed by another user' });

        // Ensure there is a user_challenges row for this tx and that it is not already claimed (user_id IS NULL)
        const { data: uc, error: ucErr } = await supabase
          .from('user_challenges')
          .select('*')
          .eq('transaction_id', tx.id)
          .single();

        if (ucErr || !uc) return res.status(404).json({ message: 'Associated challenge not found' });
        if (uc.user_id && uc.user_id !== null && uc.user_id !== undefined && uc.user_id !== req.session.userId) {
          return res.status(400).json({ message: 'Challenge already claimed by another user' });
        }

        // Attach transaction to current user
        const { error: claimErr } = await supabase
          .from('transactions')
          .update({ user_id: req.session.userId })
          .eq('id', tx.id);

        if (claimErr) {
          console.error('Failed to claim transaction for user:', claimErr);
          return res.status(500).json({ message: 'Failed to claim purchase' });
        }

        // Attach user to user_challenges by updating user_id
        try {
          const { error: attachErr } = await supabase
            .from('user_challenges')
            .update({ user_id: req.session.userId })
            .eq('id', uc.id);

          if (attachErr) {
            console.error('Failed to attach user to user_challenges during claim:', attachErr);
          }
        } catch (attachErr) {
          console.error('Failed to attach user to user_challenges during claim (unexpected):', attachErr);
        }

        return res.json({ message: 'Purchase claimed' });
      } catch (err) {
        console.error('Claim purchase error:', err);
        res.status(500).json({ message: 'Failed to claim purchase' });
      }
    });

    app.get("/api/auth/session", async (req, res) => {
      // Include detailed console logging for troubleshooting
      console.log("Session check - Session ID:", req.sessionID);
      console.log("Session check - User ID:", req.session.userId);

      if (!req.session.userId) {
        console.log("No user ID in session, returning unauthenticated");
        return res.status(200).json({ authenticated: false });  // Changed to 200 to avoid browser fetch errors
      }

      try {
        const user = await storage.getUser(req.session.userId);
        console.log("Session check - Found user:", user ? "yes" : "no");

        if (!user) {
          console.log("User not found in database, destroying session");
          return req.session.destroy(() => {
            res.status(200).json({ authenticated: false });  // Changed to 200
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

    // Plans routes
    app.get("/api/plans", async (req, res) => {
      try {
        const plans = await storage.getPlans();
        res.json(plans);
      } catch (error) {
        console.error("Error fetching plans:", error);
        res.status(500).json({ message: "Failed to fetch plans" });
      }
    });

    app.get("/api/plans/:id", async (req, res) => {
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

    // FAQs route
    app.get("/api/faqs", async (req, res) => {
      try {
        const faqs = await storage.getFAQs();
        res.json(faqs);
      } catch (error) {
        res.status(500).json({ message: "Failed to fetch FAQs" });
      }
    });


    // Testimonials route
    app.get("/api/testimonials", async (req, res) => {
      try {
        const testimonials = await storage.getTestimonials();
        res.json(testimonials);
      } catch (error) {
        res.status(500).json({ message: "Failed to fetch testimonials" });
      }
    });

    // Profile route
    app.get("/api/profile", requireAuth, async (req, res) => {
      try {
        // Debug: log userId
        const userId = req.session.userId;
        console.log('[PROFILE API] userId from session:', userId);
        if (!userId) {
          return res.status(401).json({ message: "Authentication required" });
        }
        let profile;
        if (typeof storage.getProfile === 'function') {
          profile = await storage.getProfile(String(userId));
          console.log('[PROFILE API] profile from getProfile:', profile);
          console.log('[PROFILE API] profile from getProfile:', profile);
        } else {
          if (typeof (storage as any).getSupabase === 'function') {
            const supabase = (storage as any).getSupabase();
            const { data, error } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', userId)
              .single();
            if (error) {
              console.log('[PROFILE API] Supabase error:', error);
              return res.status(500).json({ message: "Failed to fetch profile", error });
            }
            profile = data;
            console.log('[PROFILE API] profile from Supabase:', profile);
          } else {
            console.log('[PROFILE API] Profile fetch not implemented');
            return res.status(500).json({ message: "Profile fetch not implemented" });
          }
        }
        if (!profile) {
          console.log('[PROFILE API] Profile not found for userId:', userId);
          return res.status(404).json({ message: "Profile not found" });
        }
        res.json(profile);
      } catch (error) {
        console.log('[PROFILE API] Exception:', error);
        res.status(500).json({ message: "Failed to fetch profile" });
      }
    });

    // User challenges routes
    // Guest purchase endpoint: create an unclaimed transaction and user_challenge
    app.post('/api/guest/purchase', async (req, res) => {
      try {
        const { planId, amount, txHash, paymentMethod } = req.body;
        if (!planId || !amount) return res.status(400).json({ message: 'planId and amount are required' });

        const supabase = (storage as any).supabase;
        if (!supabase) return res.status(500).json({ message: 'Server storage not available' });

        // Generate a purchase token for the guest (UUID)
        const purchaseToken = crypto.randomUUID();

        // Normalize planId and related_entity_id to match DB types:
        // - transactions.related_entity_id is UUID in the DB; callers may pass numeric plan IDs (e.g. 1).
        // - user_challenges.plan_id is integer. Compute safe values for both.
        let relatedEntityId: string | null = null;
        let planIdInt: number | null = null;
        try {
          if (typeof planId === 'string') {
            // If the planId looks like a UUID (canonical form), use it as related_entity_id
            if (/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(planId)) {
              relatedEntityId = planId;
            }
            // Try parse int for plan_id
            const n = parseInt(planId, 10);
            planIdInt = Number.isFinite(n) ? n : null;
          } else if (typeof planId === 'number') {
            planIdInt = planId;
          }
        } catch (e) {
          relatedEntityId = null;
          planIdInt = null;
        }

        // Create transaction with no user_id (unclaimed)
        let tx: any = null;
        try {
          const txResp = await supabase
            .from('transactions')
            .insert([
              {
                user_id: null,
                type: 'purchase',
                amount: -Math.abs(amount),
                description: `Guest purchase for plan ${planId}`,
                related_entity: 'challenge',
                related_entity_id: relatedEntityId,
                status: 'completed',
                tx_hash: txHash || null,
                payment_method: paymentMethod || null,
                purchase_token: purchaseToken,
              },
            ])
            .select()
            .single();

          if (txResp.error || !txResp.data) {
            throw txResp.error || new Error('No data returned');
          }
          tx = txResp.data;
        } catch (txErr: any) {
          console.error('Initial create transaction error:', txErr);
          // If error indicates missing column `purchase_token`, retry without that field for now
          const msg = txErr?.message || txErr?.details || String(txErr);
          if (typeof msg === 'string' && msg.toLowerCase().includes('purchase_token')) {
            try {
              console.log('Retrying transaction insert without purchase_token column');
              const txResp2 = await supabase
                .from('transactions')
                .insert([
                  {
                    user_id: null,
                    type: 'purchase',
                    amount: -Math.abs(amount),
                    description: `Guest purchase for plan ${planId}`,
                    related_entity: 'challenge',
                    related_entity_id: relatedEntityId,
                    status: 'completed',
                    tx_hash: txHash || null,
                    payment_method: paymentMethod || null,
                  },
                ])
                .select()
                .single();

              if (txResp2.error || !txResp2.data) {
                console.error('Retry without purchase_token failed:', txResp2.error);
                return res.status(500).json({ message: 'Failed to create transaction (retry)', detail: txResp2.error });
              }
              tx = txResp2.data;
            } catch (retryErr) {
              console.error('Retry transaction error:', retryErr);
              return res.status(500).json({ message: 'Failed to create transaction (retry)', detail: retryErr });
            }
          } else {
            return res.status(500).json({ message: 'Failed to create transaction', detail: txErr });
          }
        }

        // Create an unclaimed user_challenges row (user_id = NULL)
        const { data: uc, error: ucErr } = await supabase
          .from('user_challenges')
          .insert([
            {
              user_id: null,
              plan_id: planIdInt,
              status: 'in_progress',
              transaction_id: tx.id,
              payment_status: 'completed',
              start_date: new Date().toISOString(),
              end_date: null,
              current_profit: 0,
              current_drawdown: 0,
              trading_days: 0,
            },
          ])
          .select()
          .single();

        if (ucErr || !uc) {
          console.error('Failed to create guest user_challenge:', ucErr);
          // Attempt to cleanup the transaction we created
          try {
            await supabase.from('transactions').delete().eq('id', tx.id);
          } catch (cleanupErr) {
            console.error('Cleanup error after failed user_challenge insert:', cleanupErr);
          }
          // If this is a NOT NULL violation coming from activity_log trigger, provide a helpful message
          const errMsg = ucErr?.message || ucErr;
          if (typeof errMsg === 'string' && errMsg.toLowerCase().includes('activity_log') && errMsg.toLowerCase().includes('null value in column "user_id"')) {
            return res.status(500).json({
              message: 'Failed to create challenge due to DB trigger requiring non-null user_id. Run server/migration to allow guest purchases or set SYSTEM_USER_ID env var.',
              hint: 'Either run server/migrations/20250918_fix_activity_triggers.sql to make the trigger skip NULL user_id, or set SYSTEM_USER_ID to an existing profile UUID.'
            });
          }

          return res.status(500).json({ message: 'Failed to create challenge' });
        }

        return res.status(201).json({ purchaseToken, transactionId: tx.id });
      } catch (err) {
        console.error('Guest purchase error:', err);
        res.status(500).json({ message: 'Failed to create guest purchase' });
      }
    });

    app.post("/api/user-challenges", requireAuth, async (req, res) => {
      try {
        const { planId, transactionId } = req.body;
        if (!planId || !transactionId) {
          return res.status(400).json({ message: "Plan ID and transaction ID are required" });
        }

        const challenge = await storage.createUserChallenge(
          req.session.userId!,
          parseInt(planId),
          transactionId
        );

        res.status(201).json(challenge);
      } catch (error) {
        res.status(500).json({ message: "Failed to create challenge" });
      }
    });

    app.get("/api/user-challenges", requireAuth, async (req, res) => {
      try {
        const challenges = await storage.getUserChallenges(req.session.userId!);
        res.json(challenges);
      } catch (error) {
        res.status(500).json({ message: "Failed to fetch challenges" });
      }
    });

    app.get("/api/user-challenges/:id", requireAuth, async (req, res) => {
      try {
        const challenge = await storage.getUserChallenge(parseInt(req.params.id));
        if (!challenge) {
          return res.status(404).json({ message: "Challenge not found" });
        }

        // Check if the challenge belongs to the logged-in user
        if (challenge.userId !== req.session.userId) {
          return res.status(403).json({ message: "Unauthorized" });
        }

        res.json(challenge);
      } catch (error) {
        res.status(500).json({ message: "Failed to fetch challenge" });
      }
    });

    // Trade routes
    app.post("/api/trades", requireAuth, async (req, res) => {
      try {
        const { challengeId, sport, market, selection, odds, stake } = req.body;
        if (!challengeId || !sport || !market || !selection || !odds || !stake) {
          return res.status(400).json({ message: "Missing required fields" });
        }

        // Validate challenge belongs to user
        const challenge = await storage.getUserChallenge(parseInt(challengeId));
        if (!challenge || challenge.userId !== req.session.userId) {
          return res.status(403).json({ message: "Unauthorized" });
        }

        const trade = await storage.createTrade({
          challengeId: parseInt(challengeId),
          userId: req.session.userId!,
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

    app.get("/api/trades/challenge/:id", requireAuth, async (req, res) => {
      try {
        const challengeId = parseInt(req.params.id);

        // Validate challenge belongs to user
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

    // DEVELOPMENT ROUTE: Create a professional account for testing
    app.get("/api/dev/create-pro-account", async (req, res) => {
      try {
        // For development purposes only - create professional account for btmgram@gmail.com
        let user = await storage.getUserByEmail("btmgram@gmail.com");

        // If user doesn't exist, create it
        if (!user) {
          // Generate a password hash
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash("password123", salt);

          // Create the user
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

        // Get the plans
        const plans = await storage.getPlans();
        // Find the Professional plan ($100K)
        const professionalPlan = plans.find(plan =>
          plan.name === "Professional" && plan.accountSize === 100000
        );

        // If we can't find the exact Professional plan, use plan id 2 (should be the Professional one)
        const planId = professionalPlan ? professionalPlan.id : 2;

        // Check if the user already has this professional challenge
        const existingChallenges = await storage.getUserChallenges(user.id);
        let proChallenge = existingChallenges.find(c => c.planId === planId);

        if (!proChallenge) {
          // Create start date (15 days ago)
          const startDate = new Date();
          startDate.setDate(startDate.getDate() - 15);

          // Create a new challenge
          const challenge = await storage.createUserChallenge(
            user.id,
            planId,
            "dev_tx_pro_" + Date.now().toString()
          );

          if (challenge) {
            // Update the challenge with professional progress
            // Modify the challenge directly (for development)
            const modifiedChallenge = {
              ...challenge,
              status: 'in_progress',
              tradingDays: 9,
              currentProfit: 8.5,  // 8.5% profit (getting close to the 10% target)
              currentDrawdown: 1.2, // Very low drawdown
              startDate: startDate
            };

            // For memory store, directly update the challenge
            if ((storage as any).userChallenges instanceof Map) {
              (storage as any).userChallenges.set(challenge.id, modifiedChallenge);
              proChallenge = modifiedChallenge;
            }

            // Create some impressive sample trades for this Professional challenge
            const tradeData = [
              {
                challengeId: challenge.id,
                userId: user.id,
                sport: "NBA Basketball",
                market: "Money Line",
                selection: "Golden State Warriors",
                odds: 2.45,
                stake: 2000,
                result: "win",
                profitLoss: 2900,
                createdAt: new Date(startDate.getTime() + 2 * 24 * 60 * 60 * 1000),
                settledAt: new Date(startDate.getTime() + 2 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000)
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
                createdAt: new Date(startDate.getTime() + 4 * 24 * 60 * 60 * 1000),
                settledAt: new Date(startDate.getTime() + 4 * 24 * 60 * 60 * 1000 + 6 * 60 * 60 * 1000)
              },
              {
                challengeId: challenge.id,
                userId: user.id,
                sport: "MLB Baseball",
                market: "Total",
                selection: "Over 8.5 Runs",
                odds: 1.85,
                stake: 2000,
                result: "loss",
                profitLoss: -2000,
                createdAt: new Date(startDate.getTime() + 6 * 24 * 60 * 60 * 1000),
                settledAt: new Date(startDate.getTime() + 6 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000)
              },
              {
                challengeId: challenge.id,
                userId: user.id,
                sport: "UFC",
                market: "Money Line",
                selection: "Sean O'Malley",
                odds: 2.20,
                stake: 3000,
                result: "win",
                profitLoss: 3600,
                createdAt: new Date(startDate.getTime() + 8 * 24 * 60 * 60 * 1000),
                settledAt: new Date(startDate.getTime() + 8 * 24 * 60 * 60 * 1000 + 5 * 60 * 60 * 1000)
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
                createdAt: new Date(startDate.getTime() + 12 * 24 * 60 * 60 * 1000),
                settledAt: new Date(startDate.getTime() + 12 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000)
              }
            ];

            for (const trade of tradeData) {
              await storage.createTrade(trade);
            }

            console.log("Created Professional $100K challenge with trades");
          }
        }

        // Return success with login details
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

    // Proxy endpoint with Shark Picks AI logic
    app.get("/api/odds/:sport", async (req, res) => {
      try {
        const { sport } = req.params;
        const apiKey = process.env.ODDS_API_KEY;
        // Fail fast with a clear error when the API key is not configured
        if (!apiKey) {
          console.error("Missing ODDS_API_KEY environment variable");
          return res.status(500).json({ error: "Missing Odds API key (ODDS_API_KEY). Set this environment variable and restart the server." });
        }

        const response = await axios.get(
          `https://api.the-odds-api.com/v4/sports/${sport}/odds`,
          {
            params: { apiKey, regions: "us", markets: "h2h", oddsFormat: "decimal", dateFormat: "iso" },
          }
        );

        // Return the raw games array so frontend components can render full details
        const games = response.data;
        res.json(games);
      } catch (error: any) {
        // Detailed logging for debugging external API failures
        console.error("Error fetching odds - message:", error?.message);
        if (error.response) {
          console.error("Error fetching odds - response status:", error.response.status);
          console.error("Error fetching odds - response data:", JSON.stringify(error.response.data));
        } else {
          console.error("Error fetching odds - no response object, possible network error or DNS issue");
        }

        // If the upstream API returned a JSON body, forward it for easier debugging in development
        const upstream = error.response?.data;

        // If the upstream error indicates an unknown sport, fetch the list of available sports
        // from the Odds API to help debugging and return that to the client.
        if (upstream && upstream.error_code === 'UNKNOWN_SPORT') {
          try {
            const apiKey = process.env.ODDS_API_KEY;
            const sportsResp = await axios.get('https://api.the-odds-api.com/v4/sports', {
              params: { apiKey }
            });
            const available = sportsResp.data;
            return res.status(400).json({
              error: 'Unknown sport slug',
              upstream,
              available_sports: available
            });
          } catch (innerErr: any) {
            console.error('Failed to fetch available sports from Odds API:', innerErr?.message || innerErr);
            return res.status(500).json({ error: upstream || 'Failed to fetch odds' });
          }
        }

        return res.status(500).json({ error: upstream || "Failed to fetch odds" });
      }
    });

    app.get("/api/shark-picks/:sport", async (req, res) => {
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
              dateFormat: "iso",
            },
          }
        );

        const games = response.data;

        if (!Array.isArray(games) || games.length === 0) {
          return res.json({ message: `No games available for ${sport}` });
        }

        const picks = games.map((game: any) => {
          if (!game.bookmakers || game.bookmakers.length === 0) return null;
          let bestPick: { price: number; name: string } | null = null;
          let bestBookmaker: string | null = null;
          game.bookmakers.forEach((bookmaker: any) => {
            const outcomes = Array.isArray(bookmaker.markets?.[0]?.outcomes) ? bookmaker.markets[0].outcomes : [];
            // Only consider outcomes with valid price and name
            const validOutcomes = outcomes.filter((o: any) => typeof o.price === "number" && typeof o.name === "string");
            if (validOutcomes.length === 0) return;
            const favorite = validOutcomes.reduce((a: any, b: any) => (a.price < b.price ? a : b), validOutcomes[0]);
            if (!bestPick || favorite.price < bestPick.price) {
              bestPick = favorite;
              bestBookmaker = bookmaker.title;
            }
          });
          if (!bestPick || !bestBookmaker) return null;
          const pick = bestPick as { price: number; name: string };
          const pickObj = {
            matchup: `${game.home_team} vs ${game.away_team}`,
            recommended_pick: pick.name,
            best_odds: pick.price,
            bookmaker: bestBookmaker,
            start_time: game.commence_time,
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
      } catch (err: any) {
        console.error("Shark Picks error:", err.response?.data || err.message || err);
        res.status(500).json({ error: "Failed to fetch Shark Picks" });
      }
    });

    // Helper: list available sports from the Odds API
    app.get('/api/odds/sports', async (req, res) => {
      try {
        const apiKey = process.env.ODDS_API_KEY;
        if (!apiKey) return res.status(500).json({ error: 'Missing Odds API key (ODDS_API_KEY)' });
        const response = await axios.get('https://api.the-odds-api.com/v4/sports', { params: { apiKey } });
        return res.json(response.data);
      } catch (err: any) {
        console.error('Error fetching sports list from Odds API:', err.response?.data || err.message || err);
        return res.status(500).json({ error: err.response?.data || err.message || 'Failed to fetch sports list' });
      }
    });



    const httpServer = createServer(app);
    return httpServer;
  } catch (err) {
    console.error("Error in registerRoutes:", err);
    // Return a dummy server to satisfy the return type, or throw to propagate error
    throw err;
  }
}
