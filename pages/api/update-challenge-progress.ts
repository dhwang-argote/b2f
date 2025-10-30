// server/routes/update-challenge-progress.ts
import { Request, Response } from "express";
import { supabase } from "@/lib/supabase";

export async function updateChallengeProgress(req: Request, res: Response) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { challengeId, progress, currentStep, status } = req.body as {
      challengeId: string | number;
      progress: number;
      currentStep: number;
      status: "active" | "completed";
    };

    // Update challenge progress
    const { data, error } = await supabase
      .from("user_challenges")
      .update({
        progress,
        current_step: currentStep,
        status,
        updated_at: new Date().toISOString(),
        ...(status === "completed" ? { completed_at: new Date().toISOString() } : {}),
      })
      .eq("id", challengeId)
      .select()
      .single();

    if (error || !data) {
      console.error("Error updating challenge:", error);
      return res.status(500).json({ message: "Error updating challenge" });
    }

    if (status === "completed") {
      const profitEarned = calculateProfit(data);

      // Update challenge with profit
      await supabase
        .from("user_challenges")
        .update({ profit_earned: profitEarned })
        .eq("id", challengeId);

      // Fetch user profile
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("balance, total_winnings")
        .eq("id", data.user_id)
        .single();

      if (profileError || !profile) {
        return res.status(500).json({ message: "Error fetching profile" });
      }

      await supabase
        .from("profiles")
        .update({
          balance: (profile.balance || 0) + profitEarned,
          total_winnings: (profile.total_winnings || 0) + profitEarned,
        })
        .eq("id", data.user_id);

      await supabase.from("transactions").insert({
        user_id: data.user_id,
        type: "winning",
        amount: profitEarned,
        description: `Profit from ${data.account_size} ${data.challenge_type} challenge`,
        related_entity: "challenge",
        related_entity_id: challengeId,
        status: "completed",
      });
    }

    return res.status(200).json({ message: "Challenge updated successfully" });
  } catch (error) {
    console.error("Error in update-challenge-progress:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

function calculateProfit(challenge: any): number {
  const accountSize =
    typeof challenge.account_size === "string"
      ? parseInt(challenge.account_size.replace("k", "000"))
      : Number(challenge.account_size);

  return isNaN(accountSize) ? 0 : accountSize * 0.1;
}
