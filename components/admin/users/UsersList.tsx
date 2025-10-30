import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Edit, Trash2, Eye } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { format } from "date-fns";

interface User {
  id: string;
  email: string;
  username: string;
  role: string;
  created_at?: string | null;
  date_of_birth?: string | null;
  balance?: number | string | null;
  total_winnings?: number | null;
  total_losses?: number | null;
  achievements?: any;
  active_plans?: any;
  completed_plans?: any;
  challenge_progress?: any;
  status?: string | null;
  phone?: string | null;
  tier?: string | null;
  avatar_url?: string | null;
  full_name?: string | null;
  total_bets?: number; // Added to match UserPayload
}

const UsersList = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // fetch users then fetch profiles separately (no FK relationship in DB)
      const { data: usersData, error: usersError } = await supabase
        .from("users")
        .select("id, email, username, role, created_at, date_of_birth")
        .order("created_at", { ascending: false });

      if (usersError) throw usersError;

      const userList = (usersData || []) as any[];
      const ids = userList.map((u) => u.id).filter(Boolean);

      // fetch profiles for these ids
      let profilesById: Record<string, any> = {};
      if (ids.length > 0) {
        const { data: profilesData, error: profilesError } = await supabase
          .from("profiles")
          .select(
            "id, balance, total_winnings, total_losses, achievements, active_plans, completed_plans, challenge_progress, status, phone, tier, avatar_url, full_name, total_bets, total_challenges, total_winnings"
          )
          .in("id", ids as any[]);

        if (profilesError) {
          console.warn("Could not fetch profiles:", profilesError);
        } else if (profilesData) {
          profilesById = profilesData.reduce((acc: any, p: any) => {
            acc[p.id] = p;
            return acc;
          }, {});
        }
      }

      const merged = userList.map((u) => {
        const p = profilesById[u.id] || {};
        return {
          id: u.id,
          email: u.email,
          username: u.username,
          role: u.role,
          created_at: u.created_at,
          // date_of_birth lives on users table now; fall back to profiles if needed
          date_of_birth: u.date_of_birth ?? p.date_of_birth ?? null,
          balance: p.balance ?? 0,
          total_winnings: p.total_winnings ?? 0,
          total_losses: p.total_losses ?? 0,
          achievements: p.achievements ?? null,
          active_plans: p.active_plans ?? null,
          completed_plans: p.completed_plans ?? null,
          challenge_progress: p.challenge_progress ?? null,
          status: p.status ?? null,
          phone: p.phone ?? null,
          tier: p.tier ?? null,
          avatar_url: p.avatar_url ?? null,
          full_name: p.full_name ?? null,
          total_bets: p.total_bets ?? 0,
          total_challenges: p.total_challenges ?? 0,
        } as User;
      });

      setUsers(merged);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      (user.username || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.email || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (userId: string) => {
    // deprecated; modal flow handles deletion now
    openDeleteById(userId);
  };

  // modal state for deletion
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);

  const openDelete = (user: User) => {
    setDeletingUser(user);
    setDeleteModalOpen(true);
  };

  const openDeleteById = (userId: string) => {
    const u = users.find((x) => x.id === userId) || null;
    if (u) openDelete(u);
  };

  const confirmDelete = async () => {
    if (!deletingUser) return;
    const userId = deletingUser.id;
    try {
      // delete profile (if exists)
      const { error: profileDeleteError } = await supabase
        .from("profiles")
        .delete()
        .eq("id", userId);

      if (profileDeleteError) {
        console.warn("Profile delete warning:", profileDeleteError);
      }

      // then delete user
      const { data, error } = await supabase
        .from("users")
        .delete()
        .eq("id", userId)
        .select()
        .single();

      if (error) {
        console.error("Delete error:", error);
        toast({
          title: "Delete failed",
          description: error.message || String(error),
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "User deleted",
        description: `${data?.email || "User"} removed.`,
        variant: "default",
      });
      // Refresh
      fetchUsers();
    } catch (err: any) {
      console.error("Delete error:", err);
      toast({
        title: "Delete failed",
        description: err?.message || String(err),
        variant: "destructive",
      });
    } finally {
      setDeleteModalOpen(false);
      setDeletingUser(null);
    }
  };

  const openEdit = (user: User) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const onSaved = (updated: any) => {
    setIsModalOpen(false);
    setEditingUser(null);
    // Update locally for snappy UI
    setUsers((prev) =>
      prev.map((u) => (u.id === updated.id ? { ...u, ...updated } : u))
    );
    // Also refetch to ensure consistency
    fetchUsers();
  };

  if (loading) {
    return <div className="text-white">Loading users...</div>;
  }

  return (
    <div>
      <div className="flex flex-col  sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Users Management</h2>
          <p className="text-gray-400">Manage all platform users</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-800 border-gray-700 text-white w-full sm:w-64"
            />
          </div>
        </div>
      </div>

      <Card className="bg-gray-900 border-gray-800 p-4">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead>
              <tr className="text-left text-sm text-gray-300">
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">DOB</th>
                <th className="px-4 py-3">Balance</th>
                <th className="px-4 py-3">Wins</th>
                <th className="px-4 py-3">Losses</th>
                <th className="px-4 py-3">Joined</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="text-sm text-gray-200 hover:bg-white/2"
                >
                  <td className="px-4 py-3">{user.username}</td>
                  <td className="px-4 py-3">{user.email}</td>
                  <td className="px-4 py-3">{user.role}</td>
                  <td className="px-4 py-3">
                    {user.date_of_birth
                      ? format(new Date(user.date_of_birth), "MMM d, yyyy")
                      : "—"}
                  </td>
                  <td className="px-4 py-3">
                    ${Number(user.balance ?? 0).toFixed(2)}
                  </td>
                  <td className="px-4 py-3">{user.total_winnings ?? 0}</td>
                  <td className="px-4 py-3">{user.total_losses ?? 0}</td>
                  <td className="px-4 py-3">
                    {user.created_at
                      ? format(new Date(user.created_at), "MMM d, yyyy")
                      : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex  gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => openEdit(user)}
                        title="Edit"
                      >
                        <Edit size={16} />
                      </Button>

                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-red-400"
                        onClick={() => openDelete(user)}
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredUsers.length === 0 && (
          <div className="text-center py-8 text-gray-400">No users found.</div>
        )}
      </Card>

      {editingUser && (
        <EditUserModalInline
          open={isModalOpen}
          onOpenChange={(v: boolean) => {
            setIsModalOpen(v);
            if (!v) setEditingUser(null);
          }}
          user={{
            ...editingUser,
            total_bets: editingUser.total_bets ?? 0,
            total_challenges: (editingUser as any).total_challenges ?? 0,
          }}
          onSaved={onSaved}
        />
      )}
      {deletingUser && (
        <DeleteConfirmModal
          open={deleteModalOpen}
          user={deletingUser}
          onOpenChange={setDeleteModalOpen}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  );
};

export default UsersList;

// Inline modal component to avoid cross-file import issues
interface UserPayload {
  total_challenges: number;
  total_bets: number;
  id: string;
  email?: string;
  username?: string;
  role?: string;
  date_of_birth?: string | null;
  balance?: number | string | null;
  total_winnings?: number | null;
  total_losses?: number | null;
  achievements?: any;
  active_plans?: any;
  completed_plans?: any;
  challenge_progress?: any;
  status?: string | null;
  phone?: string | null;
  tier?: string | null;
  avatar_url?: string | null;
  full_name?: string | null;
}

interface EditUserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: UserPayload;
  onSaved: (user: any) => void;
}

function EditUserModalInline({
  open,
  onOpenChange,
  user,
  onSaved,
}: EditUserModalProps) {
  const [form, setForm] = useState<UserPayload>({ ...user });
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setForm({ ...user });
  }, [user]);

  const handleChange = (field: keyof UserPayload, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const validateEmail = (email?: string) => {
    if (!email) return false;
    return /^\S+@\S+\.\S+$/.test(email);
  };

  const handleSave = async () => {
    // basic validation
    if (!form.username || !form.username.trim()) {
      toast({
        title: "Validation",
        description: "Username is required",
        variant: "destructive",
      });
      return;
    }
    if (!validateEmail(form.email)) {
      toast({
        title: "Validation",
        description: "Valid email is required",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      // normalize role
      const role =
        (form.role || "user").toLowerCase() === "admin" ? "admin" : "user";
      const balanceNum =
        typeof form.balance === "string"
          ? Number(form.balance)
          : Number(form.balance ?? 0);

      const userPatch: any = {
        email: form.email,
        username: form.username,
        role,
        date_of_birth: form.date_of_birth || null,
      };

      // Update users table
      const { data: userData, error: userError } = await supabase
        .from("users")
        .update(userPatch)
        .eq("id", form.id)
        .select()
        .single();

      if (userError) {
        console.error("Update user error:", userError);
        toast({
          title: "Update failed",
          description: userError.message || String(userError),
          variant: "destructive",
        });
        return;
      }

      // Upsert profile fields into profiles table
      const profilePayload = {
        id: form.id, // profiles.id equals users.id in this schema
        balance: Number.isFinite(balanceNum) ? balanceNum : 0,
        total_winnings: Number(form.total_winnings ?? 0),
        total_losses: Number(form.total_losses ?? 0),
        achievements: form.achievements ?? null,
        active_plans: form.active_plans ?? null,
        completed_plans: form.completed_plans ?? null,
        challenge_progress: form.challenge_progress ?? null,
        status: form.status ?? null,
        phone: form.phone ?? null,
        tier: form.tier ?? null,
        avatar_url: form.avatar_url ?? null,
        full_name: form.full_name ?? null,
        total_bets: Number(form.total_bets ?? 0),
        total_challenges: Number(form.total_challenges ?? 0),
      };

      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .upsert(profilePayload, { onConflict: "id" })
        .select()
        .single();

      if (profileError) {
        console.error("Profile upsert error:", profileError);
        toast({
          title: "Profile update failed",
          description: profileError.message || String(profileError),
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "User updated",
        description: `${
          userData?.email || userData?.username || "User"
        } saved.`,
        variant: "default",
      });
      onSaved({ ...userData, profiles: profileData });
      onOpenChange(false);
    } catch (err: any) {
      console.error("Error updating user:", err);
      toast({
        title: "Save failed",
        description: err?.message || String(err),
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[80vh] w-[min(90vw,640px)] flex flex-col">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
        </DialogHeader>

        <style>{`.hide-scrollbar::-webkit-scrollbar{display:none}.hide-scrollbar{-ms-overflow-style:none;scrollbar-width:none;}`}</style>
        <div className="space-y-4 px-3 overflow-auto py-4 flex-1 hide-scrollbar">
          <div>
            <label className="text-sm text-gray-300">Username</label>
            <Input
              value={form.username || ""}
              onChange={(e) => handleChange("username", e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm text-gray-300">Email</label>
            <Input
              value={form.email || ""}
              onChange={(e) => handleChange("email", e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm text-gray-300">Role</label>
            <select
              value={form.role || "user"}
              onChange={(e) => handleChange("role", e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 text-white p-2 rounded"
            >
              <option value="user">user</option>
              <option value="admin">admin</option>
            </select>
          </div>

          <div>
            <label className="text-sm text-gray-300">Phone</label>
            <Input
              value={form.phone ?? ""}
              onChange={(e) => handleChange("phone", e.target.value)}
              readOnly
            />
          </div>
        </div>

        <DialogFooter>
          <div className="flex gap-2 w-full">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving} className="ml-auto">
              {saving ? "Saving..." : "Save changes"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Use the inline modal component in place of external import
// Replace usage by referring to EditUserModalInline

// Delete confirmation modal (separate from edit modal)
function DeleteConfirmModal({
  open,
  user,
  onOpenChange,
  onConfirm,
}: {
  open: boolean;
  user: User | null;
  onOpenChange: (v: boolean) => void;
  onConfirm: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[min(90vw,420px)]">
        <DialogHeader>
          <DialogTitle>Confirm delete</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-gray-300">
            Are you sure you want to delete{" "}
            <strong className="text-white">
              {user?.username || user?.email || "this user"}
            </strong>
            ? This action cannot be undone.
          </p>
        </div>
        <DialogFooter>
          <div className="flex gap-2 w-full">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              className="ml-auto"
              onClick={onConfirm}
              variant="destructive"
            >
              Delete
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
