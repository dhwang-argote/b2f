import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Edit,
  Trash2,
  Eye,
  Mail,
  Calendar,
  DollarSign,
  User,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

interface User {
  id: string;
  email: string;
  username: string;
  role: string;
  created_at?: string;
  date_of_birth?: string;
  balance?: number | string;
  total_winnings?: number;
  total_losses?: number;
  achievements?: any;
  active_plans?: any;
  completed_plans?: any;
  challenge_progress?: any;
  status?: string | null;
  phone?: string | null;
  tier?: string | null;
  avatar_url?: string | null;
  full_name?: string | null;
  total_bets?: number | null;
  total_challenges?: number | null;
}

interface UserCardProps {
  user: User;
  onUpdate: () => void;
}

const UserCard = ({ user, onUpdate }: UserCardProps) => {
  const calculateAge = (dob?: string) => {
    if (!dob) return "—";
    const birthDate = new Date(dob);
    if (Number.isNaN(birthDate.getTime())) return "—";
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const { toast } = useToast();

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      // delete profile first
      await supabase.from("profiles").delete().eq("id", user.id);
      const { error } = await supabase.from("users").delete().eq("id", user.id);

      if (error) {
        toast({
          title: "Delete failed",
          description: error.message || String(error),
          variant: "destructive",
        });
        return;
      }
      toast({
        title: "User deleted",
        description: `${user.email} removed.`,
        variant: "default",
      });
      onUpdate();
    } catch (err: any) {
      console.error("Error deleting user:", err);
      toast({
        title: "Delete failed",
        description: err?.message || String(err),
        variant: "destructive",
      });
    }
  };

  const wins = user.total_winnings ?? 0;
  const losses = user.total_losses ?? 0;
  const winRate =
    wins + losses > 0 ? Math.round((wins / (wins + losses)) * 100) : 0;

  // Safely coerce balance to number for display
  const balanceNumber = Number(user.balance ?? 0) || 0;

  return (
    <Card className="bg-gray-900 border-gray-800 p-6 hover:border-blue-500/50 transition-all">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-600 rounded-full overflow-hidden flex items-center justify-center">
            {user.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.avatar_url}
                alt="avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <User size={20} />
            )}
          </div>
          <div>
            <h3 className="font-semibold text-white">
              {user.username || user.full_name || "—"}
            </h3>
            <div className="flex items-center gap-2">
              <Badge
                className={user.role === "admin" ? "bg-red-500" : "bg-blue-500"}
              >
                {user.role}
              </Badge>
              {user.tier && (
                <span className="text-xs text-gray-400">{user.tier}</span>
              )}
            </div>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button
            size="sm"
            variant="ghost"
            className="text-gray-400 hover:text-white"
          >
            <Eye size={16} />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="text-gray-400 hover:text-white"
          >
            <Edit size={16} />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="text-red-400 hover:text-red-300"
            onClick={handleDelete}
          >
            <Trash2 size={16} />
          </Button>
        </div>
      </div>

      {/* User Info */}
      <div className="space-y-3">
        <div className="flex items-center text-sm text-gray-400">
          <Mail size={14} className="mr-2" />
          <span className="truncate">{user.email || "—"}</span>
        </div>
        +
        <div className="flex items-center text-sm text-gray-400">
          <Calendar size={14} className="mr-2" />
          <span>
            {calculateAge(user.date_of_birth) !== "\u2014"
              ? `${calculateAge(user.date_of_birth)} years old`
              : "—"}
          </span>
        </div>
        <div className="flex items-center text-sm text-gray-400">
          <DollarSign size={14} className="mr-2" />
          <span>${balanceNumber.toFixed(2)}</span>
        </div>
        <div className="flex items-center text-sm text-gray-400">
          <span className="mr-2">{user.phone ?? "—"}</span>
          <span className="text-xs text-gray-500">{user.status ?? ""}</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-gray-800">
        <div className="text-center">
          <div className="text-white font-bold">{wins}</div>
          <div className="text-xs text-green-400">Wins</div>
        </div>
        <div className="text-center">
          <div className="text-white font-bold">{losses}</div>
          <div className="text-xs text-red-400">Losses</div>
        </div>
        <div className="text-center">
          <div className="text-white font-bold">
            {(user.total_bets ?? 0).toString()}
          </div>
          <div className="text-xs text-blue-400">Bets</div>
        </div>
      </div>
    </Card>
  );
};

export default UserCard;
