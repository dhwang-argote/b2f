"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { IconMenu } from "@/components/icons";
import MobileMenu from "./mobile-menu";
import headerIcon from "../../assets/b2f/logo-main.png";
import { usePathname } from "next/navigation";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

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
    // Close mobile menu when pathname changes
    setIsMobileMenuOpen(false);
  }, [pathname]);

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
                  src={headerIcon.src}
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
              <NavLink href="/faq" label="FAQ" />
              <NavLink href="/educational-center" label="Education" />
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center space-x-3">
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
