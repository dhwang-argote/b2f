import React, { useEffect, useState } from "react";
import { Card } from "../components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "../components/ui/avatar";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Skeleton } from "../components/ui/skeleton";
import { Progress } from "../components/ui/progress";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { supabase } from "../lib/supabase";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { motion } from "framer-motion";
import { Link } from "wouter";
import SharkPicksWidget from "@/components/ui/shark-picks-widget.tsx.tsx";

const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [activity, setActivity] = useState<any[]>([]);
  const [loadingActivity, setLoadingActivity] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("b2f_user");
    const userObj = storedUser ? JSON.parse(storedUser) : null;
    setUser(userObj);

    if (!userObj) {
      setProfile(null);
      setLoading(false);
      return;
    }

    fetchProfile(userObj);
  }, []);

  // Replace the fetchProfile function in your profile page with this:
  const fetchProfile = async (userObj: any) => {
    try {
      setLoading(true);

      // Fetch profile
      let { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userObj.id)
        .single();

      if (profileError && profileError.code === "PGRST116") {
        // Create profile if it doesn't exist
        const { data: newProfile, error: insertError } = await supabase
          .from("profiles")
          .insert({
            id: userObj.id,
            username:
              userObj.username || userObj.email?.split("@")[0] || "user",
            email: userObj.email,
            full_name: userObj.user_metadata?.full_name || "",
            status: "active",
            balance: 0,
            total_winnings: 0,
            total_losses: 0,
            total_bets: 0,
            total_challenges: 0,
            tier: "bronze",
            created_at: new Date().toISOString(),
          })
          .select()
          .single();

        if (insertError) {
          console.error("Error inserting new profile:", insertError);
          setProfile(null);
          return;
        }
        profileData = newProfile;
      } else if (profileError) {
        console.error("Error fetching profile:", profileError);
        setProfile(null);
        return;
      }

      // Fetch active challenges
      const { data: activeChallenges, error: challengesError } = await supabase
        .from("user_challenges")
        .select("*")
        .eq("user_id", userObj.id)
        .eq("status", "active");

      if (challengesError) {
        console.error("Error fetching challenges:", challengesError);
      }

      // Fetch completed challenges
      const { data: completedChallenges, error: completedError } =
        await supabase
          .from("user_challenges")
          .select("*")
          .eq("user_id", userObj.id)
          .eq("status", "completed");

      if (completedError) {
        console.error("Error fetching completed challenges:", completedError);
      }

      // Combine all data
      setProfile({
        ...profileData,
        active_challenges: activeChallenges || [],
        completed_challenges: completedChallenges || [],
      });

      // fetch activity for profile
      fetchActivity(userObj.id);
    } catch (err) {
      console.error("Profile fetch error:", err);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchActivity = async (userId: string) => {
    try {
      setLoadingActivity(true);
      const { data, error } = await supabase
        .from("activity_log")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(3);

      if (error) {
        console.error("Error fetching activity:", error);
        setActivity([]);
        return;
      }

      setActivity(data || []);
    } catch (err) {
      console.error("Fetch activity error:", err);
      setActivity([]);
    } finally {
      setLoadingActivity(false);
    }
  };

  // subscribe to realtime activity for the current user
  useEffect(() => {
    if (!profile || !profile.id) return;

    const channel = supabase
      .channel(`activity_log_user_${profile.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "activity_log",
          filter: `user_id=eq.${profile.id}`,
        },
        (payload: any) => {
          setActivity((prev) => [payload.new, ...prev].slice(0, 3));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [profile]);

  // subscribe to realtime changes for user_challenges so Active and History tabs update live
  useEffect(() => {
    if (!profile || !profile.id) return;

    const channel = supabase
      .channel(`user_challenges_user_${profile.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "user_challenges",
          filter: `user_id=eq.${profile.id}`,
        },
        (payload: any) => {
          const newRow = payload.new;
          setProfile((prev: any) => {
            if (!prev) return prev;
            const active = Array.isArray(prev.active_challenges)
              ? [...prev.active_challenges]
              : [];
            const completed = Array.isArray(prev.completed_challenges)
              ? [...prev.completed_challenges]
              : [];
            if (newRow.status === "completed") {
              // prepend to completed
              completed.unshift(newRow);
            } else {
              // prepend to active
              active.unshift(newRow);
            }
            return {
              ...prev,
              active_challenges: active,
              completed_challenges: completed,
            };
          });
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "user_challenges",
          filter: `user_id=eq.${profile.id}`,
        },
        (payload: any) => {
          const newRow = payload.new;
          const oldRow = payload.old;
          setProfile((prev: any) => {
            if (!prev) return prev;
            const active = Array.isArray(prev.active_challenges)
              ? [...prev.active_challenges]
              : [];
            const completed = Array.isArray(prev.completed_challenges)
              ? [...prev.completed_challenges]
              : [];

            // If status changed to completed, move from active to completed
            if (
              oldRow?.status !== newRow?.status &&
              newRow?.status === "completed"
            ) {
              // remove from active if present
              const idx = active.findIndex((c: any) => c.id === newRow.id);
              if (idx !== -1) active.splice(idx, 1);
              // add to completed (prepend)
              completed.unshift(newRow);
            } else if (
              oldRow?.status !== newRow?.status &&
              newRow?.status !== "completed"
            ) {
              // moved out of completed (or changed), ensure it's in active and remove from completed
              const idx = completed.findIndex((c: any) => c.id === newRow.id);
              if (idx !== -1) completed.splice(idx, 1);
              // update or add in active
              const aIdx = active.findIndex((c: any) => c.id === newRow.id);
              if (aIdx !== -1) active[aIdx] = newRow;
              else active.unshift(newRow);
            } else {
              // other update (progress etc.) update whichever list contains it
              let found = false;
              const aIdx = active.findIndex((c: any) => c.id === newRow.id);
              if (aIdx !== -1) {
                active[aIdx] = newRow;
                found = true;
              }
              const cIdx = completed.findIndex((c: any) => c.id === newRow.id);
              if (!found && cIdx !== -1) {
                completed[cIdx] = newRow;
                found = true;
              }
            }

            return {
              ...prev,
              active_challenges: active,
              completed_challenges: completed,
            };
          });
        }
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "user_challenges",
          filter: `user_id=eq.${profile.id}`,
        },
        (payload: any) => {
          const oldRow = payload.old;
          setProfile((prev: any) => {
            if (!prev) return prev;
            const active = Array.isArray(prev.active_challenges)
              ? prev.active_challenges.filter((c: any) => c.id !== oldRow.id)
              : [];
            const completed = Array.isArray(prev.completed_challenges)
              ? prev.completed_challenges.filter((c: any) => c.id !== oldRow.id)
              : [];
            return {
              ...prev,
              active_challenges: active,
              completed_challenges: completed,
            };
          });
        }
      )
      .subscribe();

    return () => {
      try {
        supabase.removeChannel(channel);
      } catch (e) {}
    };
  }, [profile]);

  const handleActivatePlan = async (planData: any) => {
    if (!user) return;

    try {
      // Deduct the fee from user's balance
      const newBalance = (profile.balance || 0) - planData.fee;

      // Add the plan to active plans
      const newActivePlans = [
        ...(profile.active_plans || []),
        {
          ...planData,
          activated_at: new Date().toISOString(),
          progress: 0,
          current_step: 0,
          status: "active",
        },
      ];

      const { error } = await supabase
        .from("profiles")
        .update({
          balance: newBalance,
          active_plans: newActivePlans,
          total_challenges: (profile.total_challenges || 0) + 1,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (error) {
        console.error("Error activating plan:", error);
        return;
      }

      // Update local state
      setProfile({
        ...profile,
        balance: newBalance,
        active_plans: newActivePlans,
        total_challenges: (profile.total_challenges || 0) + 1,
      });

      alert("Plan activated successfully!");
    } catch (err) {
      console.error("Error activating plan:", err);
    }
  };

  // Dummy achievements to show when the user has no real achievements yet
  const dummyAchievements = [
    {
      name: "Bronze Trophy",
      description:
        "Completed your first challenge and earned the Bronze trophy",
      level: "bronze",
      awarded_at: new Date().toISOString(),
    },
    {
      name: "Silver Streak",
      description: "Won 5 challenges in a row — Silver achievement unlocked",
      level: "silver",
      awarded_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
    },
    {
      name: "Gold Trophy",
      description: "Top performer of the week — Gold trophy awarded",
      level: "gold",
      awarded_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
    },
  ];

  const achievementsToShow =
    profile?.achievements && profile.achievements.length > 0
      ? profile.achievements
      : dummyAchievements;

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black py-36 px-4">
          <div className="max-w-4xl mx-auto">
            <Skeleton className="w-full h-96 rounded-xl" />
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!user) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center py-36 px-4">
          <Card className="p-8 text-center max-w-md w-full">
            <h2 className="text-2xl font-bold text-white mb-4">
              Authentication Required
            </h2>
            <p className="text-gray-400 mb-6">
              You need to be logged in to view your profile.
            </p>
            <Link to="/login">
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                Login
              </Button>
            </Link>
          </Card>
        </div>
        <Footer />
      </>
    );
  }

  if (!profile) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center py-36 px-4">
          <Card className="p-8 text-center max-w-md w-full">
            <h2 className="text-2xl font-bold text-white mb-4">
              Profile Error
            </h2>
            <p className="text-gray-400 mb-6">
              There was an error loading your profile.
            </p>
            <Button
              className="w-full bg-blue-600 hover:bg-blue-700"
              onClick={() => window.location.reload()}
            >
              Try Again
            </Button>
          </Card>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black py-36 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Profile Header */}
            <Card className="p-8 mb-8 bg-gradient-to-r from-blue-900/30 to-blue-900/30 border-blue-500/20">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <Avatar className="w-24 h-24 border-4 border-blue-500/30">
                  <AvatarImage
                    src={profile.avatar_url}
                    alt={profile.username}
                  />
                  <AvatarFallback className="text-2xl bg-blue-600">
                    {profile.username?.charAt(0)?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                    <h2 className="text-2xl md:text-3xl font-bold text-white">
                      {profile.username}
                    </h2>
                    <Badge
                      className={`
                        ${
                          profile.status === "active"
                            ? "bg-green-500"
                            : profile.status === "pending"
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        }
                      `}
                    >
                      {profile.status}
                    </Badge>
                    {/* <Badge
                      className={`
                      ${
                        profile.tier === "bronze"
                          ? "bg-amber-700"
                          : profile.tier === "silver"
                          ? "bg-gray-400"
                          : "bg-yellow-400 text-black"
                      }
                    `}
                    >
                      {profile.tier}
                    </Badge> */}
                  </div>
                  <p className="text-gray-400 mb-4">{profile.email}</p>
                  <div className="text-sm text-gray-500">
                    Joined: {new Date(profile.created_at).toLocaleDateString()}
                  </div>
                </div>
                <div className="bg-blue-600/20 p-4 rounded-lg">
                  <div className="text-sm text-blue-300">Balance</div>
                  <div className="text-2xl font-bold text-white">
                    ${profile.balance?.toLocaleString() ?? "0"}
                  </div>
                </div>
              </div>
            </Card>

            <SharkPicksWidget sport="americanfootball_nfl" limit={3} />

            {/* Stats Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <Card className="p-4 text-center bg-gray-800/50 border-gray-700">
                <div className="text-sm text-gray-400">Total Bets</div>
                <div className="text-xl font-bold text-white">
                  {profile.total_bets ?? 0}
                </div>
              </Card>
              <Card className="p-4 text-center bg-gray-800/50 border-gray-700">
                <div className="text-sm text-gray-400">Winnings</div>
                <div className="text-xl font-bold text-green-400">
                  ${profile.total_winnings?.toLocaleString() ?? "0"}
                </div>
              </Card>
              <Card className="p-4 text-center bg-gray-800/50 border-gray-700">
                <div className="text-sm text-gray-400">Losses</div>
                <div className="text-xl font-bold text-red-400">
                  ${profile.total_losses?.toLocaleString() ?? "0"}
                </div>
              </Card>
              <Card className="p-4 text-center bg-gray-800/50 border-gray-700">
                <div className="text-sm text-gray-400">Completed</div>
                <div className="text-xl font-bold text-blue-400">
                  {profile.total_challenges ?? 0}
                </div>
              </Card>
            </div>

            {/* Tabs Navigation */}
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="mb-8"
            >
              <TabsList className="grid grid-cols-3 mb-8 bg-gray-800/50">
                <TabsTrigger
                  value="overview"
                  className="data-[state=active]:bg-blue-600"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger
                  value="active"
                  className="data-[state=active]:bg-blue-600"
                >
                  Active Plans
                </TabsTrigger>
                <TabsTrigger
                  value="history"
                  className="data-[state=active]:bg-blue-600"
                >
                  History
                </TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview">
                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="p-6 bg-gray-800/50 border-gray-700">
                    <h3 className="text-lg font-semibold text-white mb-4">
                      Recent Activity
                    </h3>
                    <div className="space-y-3">
                      {loadingActivity ? (
                        <p className="text-gray-400">Loading activity...</p>
                      ) : activity && activity.length > 0 ? (
                        activity.map((act) => (
                          <div
                            key={act.id}
                            className="flex justify-between items-start bg-gray-800/30 p-3 rounded-lg"
                          >
                            <div className="flex items-start gap-3">
                              <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-sm">
                                {act.type === "transaction"
                                  ? "💳"
                                  : act.type === "bet"
                                  ? "🎯"
                                  : act.type === "challenge"
                                  ? "🏁"
                                  : "•"}
                              </div>
                              <div>
                                <div className="text-sm text-white font-medium">
                                  {act.title || act.description || act.type}
                                </div>
                                <div className="text-xs text-gray-400">
                                  {act.description || ""}
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                  {new Date(act.created_at).toLocaleString()}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              {act.amount ? (
                                <div
                                  className={`text-sm font-semibold ${
                                    act.amount > 0
                                      ? "text-green-400"
                                      : "text-red-400"
                                  }`}
                                >
                                  $
                                  {Math.abs(
                                    Number(act.amount)
                                  ).toLocaleString()}
                                </div>
                              ) : (
                                <div className="text-xs text-gray-400">
                                  {act.sub_type || act.type}
                                </div>
                              )}
                              {act.tx_hash && (
                                <div className="text-xs text-gray-500 mt-1">
                                  tx: {String(act.tx_hash).slice(0, 10)}...
                                </div>
                              )}
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500 text-center py-4">
                          No recent activity
                        </p>
                      )}
                    </div>
                  </Card>

                  <Card className="p-6 bg-gray-800/50 border-gray-700">
                    <h3 className="text-lg font-semibold text-white mb-4">
                      Achievements
                    </h3>
                    <div className="space-y-3">
                      {achievementsToShow && achievementsToShow.length > 0 ? (
                        achievementsToShow.map((ach: any, index: number) => (
                          <div key={index} className="flex items-center gap-3">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                ach.level === "silver"
                                  ? "bg-gray-400"
                                  : ach.level === "gold"
                                  ? "bg-yellow-400 text-black"
                                  : "bg-amber-700"
                              }`}
                            >
                              <span className="text-xs">🏆</span>
                            </div>
                            <div>
                              <div className="text-white font-medium">
                                {ach.name}
                              </div>
                              <div className="text-gray-400 text-sm">
                                {ach.description}
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500 text-center py-4">
                          No achievements yet
                        </p>
                      )}
                    </div>
                  </Card>
                </div>
              </TabsContent>

              {/* Active Plans Tab */}
              <TabsContent value="active">
                <Card className="p-6 bg-gray-800/50 border-gray-700">
                  <h3 className="text-lg font-semibold text-white mb-4">
                    Active Challenges
                  </h3>
                  <div className="space-y-4">
                    {profile.active_challenges &&
                    profile.active_challenges.length > 0 ? (
                      profile.active_challenges.map(
                        (challenge: {
                          id: React.Key | null | undefined;
                          account_size:
                            | string
                            | number
                            | boolean
                            | React.ReactElement<
                                any,
                                string | React.JSXElementConstructor<any>
                              >
                            | Iterable<React.ReactNode>
                            | React.ReactPortal
                            | null
                            | undefined;
                          challenge_type:
                            | string
                            | number
                            | boolean
                            | React.ReactElement<
                                any,
                                string | React.JSXElementConstructor<any>
                              >
                            | Iterable<React.ReactNode>
                            | React.ReactPortal
                            | null
                            | undefined;
                          status:
                            | string
                            | number
                            | boolean
                            | React.ReactElement<
                                any,
                                string | React.JSXElementConstructor<any>
                              >
                            | Iterable<React.ReactNode>
                            | null
                            | undefined;
                          progress: any;
                          current_step: number;
                          steps: string | any[];
                          activated_at: string | number | Date;
                        }) => (
                          <div
                            key={challenge.id}
                            className="p-4 rounded-lg bg-gray-700/50"
                          >
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <h4 className="text-white font-semibold">
                                  {challenge.account_size} Challenge
                                </h4>
                                <p className="text-gray-400 text-sm">
                                  {challenge.challenge_type}
                                </p>
                              </div>
                              <Badge
                                className={
                                  challenge.status === "active"
                                    ? "bg-green-500"
                                    : challenge.status === "completed"
                                    ? "bg-blue-500"
                                    : "bg-gray-500"
                                }
                              >
                                {challenge.status}
                              </Badge>
                            </div>
                            <Progress
                              value={challenge.progress || 0}
                              className="mb-2 h-2"
                            />
                            <div className="flex justify-between text-sm text-gray-400">
                              <span>Progress: {challenge.progress || 0}%</span>
                              <span>
                                Step {challenge.current_step + 1} of{" "}
                                {challenge.steps.length}
                              </span>
                            </div>
                            <div className="mt-3 text-xs text-gray-500">
                              Activated:{" "}
                              {new Date(
                                challenge.activated_at
                              ).toLocaleDateString()}
                            </div>
                          </div>
                        )
                      )
                    ) : (
                      <p className="text-gray-500 text-center py-8">
                        No active challenges
                      </p>
                    )}
                  </div>
                </Card>
              </TabsContent>

              {/* History Tab */}
              <TabsContent value="history">
                <Card className="p-6 bg-gray-800/50 border-gray-700">
                  <h3 className="text-lg font-semibold text-white mb-4">
                    Challenge History
                  </h3>
                  <div className="space-y-4">
                    {profile.completed_challenges &&
                    profile.completed_challenges.length > 0 ? (
                      profile.completed_challenges.map((plan: any) => (
                        <div
                          key={plan.id}
                          className="p-4 rounded-lg bg-gray-700/50"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="text-white font-semibold">
                                {plan.account_size} Challenge
                              </h4>
                              <p className="text-gray-400 text-sm">
                                {plan.challenge_type}
                              </p>
                            </div>
                            <Badge className="bg-blue-500">Completed</Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-gray-400">Completed: </span>
                              <span className="text-white">
                                {new Date(
                                  plan.completed_at ||
                                    plan.activated_at ||
                                    Date.now()
                                ).toLocaleDateString()}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-400">Profit: </span>
                              <span className="text-green-400">
                                $
                                {(
                                  plan.profit_earned ??
                                  plan.profit ??
                                  0
                                ).toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-center py-8">
                        No completed challenges
                      </p>
                    )}
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProfilePage;
