import { useState, useEffect } from "react";
import { User, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/lib/supabase";

const AdminHeader = () => {
  const [adminUser, setAdminUser] = useState<any>(null);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const storedUser = localStorage.getItem("b2f_user");
        if (storedUser) {
          const userObj = JSON.parse(storedUser);

          const { data: userData } = await supabase
            .from("users")
            .select("id, email, role")
            .eq("id", userObj.id)
            .single();

          // profiles table has richer metadata
          const { data: profileData } = await supabase
            .from("profiles")
            .select("username, full_name, avatar_url")
            .eq("id", userObj.id)
            .single();

          setAdminUser({ ...(userData || {}), ...(profileData || {}) });
        }
      } catch (error) {
        console.error("Error fetching admin data:", error);
      }
    };

    fetchAdminData();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("b2f_user");
    window.location.href = "/login";
  };

  return (
    <header className="bg-gray-900 border-b border-gray-800 p-4">
      <div className="flex items-center justify-between">
        {/* Search Bar (optional) */}
        <div className="flex-1 max-w-md text-2xl font-bold">
          <h1>Welcome To Admin Dashboard</h1>
        </div>

        {/* User Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center space-x-2 text-white"
            >
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center overflow-hidden">
                {adminUser?.avatar_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={adminUser.avatar_url}
                    alt="avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User size={16} />
                )}
              </div>
              <span className="hidden md:block">
                {adminUser?.username || adminUser?.full_name || "Admin"}
              </span>
            </Button>
          </DropdownMenuTrigger>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default AdminHeader;
