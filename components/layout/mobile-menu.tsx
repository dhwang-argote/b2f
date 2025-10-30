import { FC } from "react";
import Link from "next/link";
import { IconClose } from "@/components/icons";
import { usePathname } from "next/navigation";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu: FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname();

  const navLinks = [
    { href: "/how-it-works", label: "How It Works" },
    { href: "/plans", label: "Challenges" },
    { href: "/odds", label: "Live Odds" },
    { href: "/leaderboard", label: "Leaderboard" },
    { href: "/faq", label: "FAQ" },
    { href: "/educational-center", label: "Educational Center" },
    { href: "/community-forum", label: "Community Forum" },
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
              isActive={pathname === link.href}
            />
          ))}
        </nav>
      </div>

      <div className="p-4 border-t border-primary/20">
        <Link href="/#plans">
          <div className="block w-full py-4 bg-primary hover:bg-primary/90 text-white text-center rounded-md font-semibold shadow-[0_0_15px_rgba(0,178,255,0.7)] transition-all text-lg cursor-pointer">
            Get Started
          </div>
        </Link>
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
