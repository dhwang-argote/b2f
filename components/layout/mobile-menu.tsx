import { FC } from "react";
import { Link, useLocation } from "wouter";
import { IconClose } from "@/components/icons";
import { useAuth } from "@/hooks/useAuth";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu: FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  const [location] = useLocation();
  const { user, isAuthenticated } = useAuth();

  const navLinks = [
    { href: "/how-it-works", label: "How It Works" },
    { href: "/plans", label: "Challenges" },
    { href: "/odds", label: "Live Odds" },
    { href: "/leaderboard", label: "Leaderboard" },
    { href: "/faq", label: "FAQ" },
    { href: "/educational-center", label: "Educational Center" },
    { href: "/community-forum", label: "Community Forum" },
  ];

  const authNavLinks = [
    ...(isAuthenticated
      ? [{ href: "/funded-account", label: "Funded Account" }]
      : []),
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#121212] bg-opacity-95 backdrop-blur-sm flex flex-col">
      <div className="flex justify-between items-center px-4 py-4 border-b border-primary/20">
        <Link href="/">
          <img
            src="/assets/b2f/logo-menu.jpeg"
            alt="Bet2Fund Logo"
            className="h-16 logo-glow cursor-pointer"
          />
        </Link>
        <button
          type="button"
          className="p-2 text-primary hover:text-white transition-colors"
          onClick={onClose}
          aria-label="Close menu"
        >
          <IconClose />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <nav className="px-4 py-6 space-y-2">
          {navLinks.map((link) => (
            <MobileNavLink
              key={link.href}
              href={link.href}
              label={link.label}
              onClick={onClose}
              isActive={location === link.href}
            />
          ))}

          {authNavLinks.map((link) => (
            <MobileNavLink
              key={link.href}
              href={link.href}
              label={link.label}
              onClick={onClose}
              isActive={location === link.href}
            />
          ))}

          <div className="pt-6 border-t border-primary/10">
            {isAuthenticated ? (
              <>
                <MobileNavLink
                  href="/dashboard"
                  label="Dashboard"
                  onClick={onClose}
                  isActive={location === "/dashboard"}
                />
                <MobileNavLink
                  href="/account"
                  label="My Account"
                  onClick={onClose}
                  isActive={location === "/account"}
                />
              </>
            ) : (
              <>
                <MobileNavLink
                  href="/login"
                  label="Login"
                  onClick={onClose}
                  isActive={location === "/login"}
                />
                <MobileNavLink
                  href="/register"
                  label="Register"
                  onClick={onClose}
                  isActive={location === "/register"}
                />
              </>
            )}
          </div>
        </nav>
      </div>

      <div className="p-4 border-t border-primary/20">
        {isAuthenticated ? (
          <Link href="/dashboard">
            <div className="block w-full py-4 bg-primary hover:bg-primary/90 text-white text-center rounded-md font-semibold shadow-[0_0_15px_rgba(0,178,255,0.7)] transition-all text-lg cursor-pointer">
              Dashboard
            </div>
          </Link>
        ) : (
          <Link href="/#plans">
            <div className="block w-full py-4 bg-primary hover:bg-primary/90 text-white text-center rounded-md font-semibold shadow-[0_0_15px_rgba(0,178,255,0.7)] transition-all text-lg cursor-pointer">
              Get Started
            </div>
          </Link>
        )}
      </div>
    </div>
  );
};

interface MobileNavLinkProps {
  href: string;
  label: string;
  onClick: () => void;
  isActive: boolean;
}

const MobileNavLink: FC<MobileNavLinkProps> = ({
  href,
  label,
  onClick,
  isActive,
}) => {
  return (
    <Link href={href}>
      <div
        className={`block px-4 py-3 rounded-md text-base font-medium transition-colors cursor-pointer ${
          isActive
            ? "text-primary bg-primary/10"
            : "text-white hover:bg-primary/10 hover:text-primary"
        }`}
        onClick={onClick}
      >
        {label}
      </div>
    </Link>
  );
};

export default MobileMenu;
