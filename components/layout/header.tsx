import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { IconMenu } from "@/components/icons";
import { FiUser, FiLogOut } from "react-icons/fi";
import MobileMenu from "./mobile-menu";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import headerIcon from "../../assets/b2f/logo-main.png";

const Header = () => {
  const [showDropdown, setShowDropdown] = useState(false);

  const handleProfileClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate("/profile");
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    setSessionUser(null);
    setIsAuthenticated(false);
    setShowDropdown(false);
    navigate("/");
  };
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location, navigate] = useLocation();
  const [sessionUser, setSessionUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Fetch session info from backend
    fetch("/api/auth/session", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.user) {
          setSessionUser(data.user);
          setIsAuthenticated(true);
        } else {
          setSessionUser(null);
          setIsAuthenticated(false);
        }
      });
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    // Close mobile menu when location changes
    setIsMobileMenuOpen(false);
  }, [location]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 border-b transition-all duration-200 ${
          isScrolled
            ? "bg-[#121212]/95 backdrop-blur-sm border-primary/20"
            : "bg-transparent border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 sm:h-24 md:h-28 items-center">
            {/* Logo - smaller on mobile */}
            <div className="flex-shrink-0 flex items-center">
              <Link href="/">
                <img
                  src={headerIcon}
                  alt="Bet2Fund Logo"
                  className="h-16 sm:h-20 md:h-24 logo-glow cursor-pointer"
                />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex md:items-center md:space-x-4">
              <NavLink href="/how-it-works" label="How It Works" />
              <a
                href="/#plans"
                className="relative text-white hover:text-primary hover:border hover:border-primary hover:bg-primary/10 rounded-md transition-all px-3 py-2 font-medium text-sm cursor-pointer"
              >
                Challenges
              </a>
              <NavLink href="/odds" label="Live Odds" />
              <NavLink href="/leaderboard" label="Leaderboard" />
              {isAuthenticated && (
                <NavLink href="/funded-account" label="Funded" />
              )}
              <NavLink href="/faq" label="FAQ" />
              <NavLink href="/educational-center" label="Education" />
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center space-x-3">
              <>
                {isAuthenticated && sessionUser ? (
                  <div className="relative">
                    <div
                      className="flex items-center cursor-pointer"
                      onClick={() => setShowDropdown((prev) => !prev)}
                      tabIndex={0}
                      role="button"
                      aria-label="Open profile menu"
                    >
                      {/* Profile Avatar (use profilePicture if available, else fallback to first letter of name/email) */}
                      <div className="mr-2">
                        <Avatar>
                          {sessionUser.profilePicture ? (
                            <AvatarImage
                              src={sessionUser.profilePicture}
                              alt={sessionUser.username ?? "Profile"}
                            />
                          ) : (
                            <AvatarFallback>
                              {sessionUser.firstName?.[0] ??
                                sessionUser.username?.[0] ??
                                sessionUser.email?.[0]?.toUpperCase() ??
                                "U"}
                            </AvatarFallback>
                          )}
                        </Avatar>
                      </div>
                      <span className="hidden sm:inline text-white font-medium">
                        {sessionUser.firstName ||
                          sessionUser.username ||
                          sessionUser.email ||
                          "Profile"}
                      </span>
                    </div>
                    {showDropdown && (
                      <div className="absolute right-0 mt-2 w-44 bg-[#222] border border-primary/30 rounded-lg shadow-lg z-50">
                        <button
                          onClick={handleProfileClick}
                          className="flex items-center gap-2 w-full text-left px-4 py-2 text-white hover:bg-primary/10"
                        >
                          <FiUser className="text-lg" />
                          Profile
                        </button>
                        <button
                          className="flex items-center gap-2 w-full text-left px-4 py-2 text-white hover:bg-primary/10"
                          onClick={handleLogout}
                        >
                          <FiLogOut className="text-lg" />
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link href="/login">
                    <Button
                      variant="outline"
                      className="inline-flex border-transparent text-primary hover:bg-primary/10 hover:text-primary transition-all"
                    >
                      Login
                    </Button>
                  </Link>
                )}
              </>
              <button
                type="button"
                className="md:hidden p-2 rounded-md text-primary hover:text-white focus:outline-none"
                onClick={toggleMobileMenu}
                aria-label="Open main menu"
              >
                <IconMenu />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </>
  );
};

interface NavLinkProps {
  href: string;
  label: string;
}

const NavLink = ({ href, label }: NavLinkProps) => {
  return (
    <Link href={href}>
      <span className="relative text-white hover:text-primary hover:border hover:border-primary hover:bg-primary/10 rounded-md transition-all px-3 py-2 font-medium text-sm cursor-pointer after:content-[''] after:absolute after:w-0 after:h-0.5 after:bg-primary after:left-0 after:bottom-0 after:transition-all after:duration-300">
        {label}
      </span>
    </Link>
  );
};

export default Header;
