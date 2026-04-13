"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

const NAV_LINKS = [
  { href: "/tech-news",        label: "Tech",       icon: "⚡" },
  { href: "/finance-news",     label: "Finance",    icon: "📊" },
  { href: "/finance-learning", label: "Learning",   icon: "🎓" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="flat-nav sticky top-0 z-50" id="main-navbar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/tech-news"
          className="flex items-center gap-2 group"
          id="navbar-logo"
        >
          <div className="w-6 h-6 bg-[var(--foreground)] rounded flex items-center justify-center">
            <span className="text-[10px] sm:text-xs text-[var(--surface)] select-none">NB</span>
          </div>
          <span className="text-base font-bold tracking-tight text-[var(--foreground)] hidden sm:block">
            NewsBoard
          </span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map((link) => {
            const active = pathname.includes(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                id={`nav-${link.href.replace("/", "")}`}
                className={`text-[13px] font-medium transition-colors outline-none pb-0.5 border-b-2 flex flex-col justify-center h-14 ${
                  active
                    ? "text-[var(--foreground)] border-[var(--foreground)]"
                    : "text-[var(--muted)] border-transparent hover:text-[var(--foreground)]"
                }`}
              >
                <span className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-xs opacity-75">{link.icon}</span>
                  {link.label}
                </span>
              </Link>
            );
          })}
        </div>

        {/* Right side: theme toggle + mobile hamburger */}
        <div className="flex items-center gap-1.5">
          <ThemeToggle />
          <button
            className="md:hidden p-1.5 rounded hover:bg-[var(--surface-2)] text-[var(--muted)] transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation menu"
            id="mobile-menu-toggle"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out bg-[var(--surface)] border-b border-[var(--border)] ${
          mobileOpen ? "max-h-80" : "max-h-0 border-transparent"
        }`}
      >
        <div className="px-4 pb-4 pt-2 space-y-1">
          {NAV_LINKS.map((link) => {
            const active = pathname.includes(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-2 py-2 px-3 rounded text-[13px] font-medium transition-colors ${
                  active
                    ? "text-[var(--foreground)] bg-[var(--surface-2)]"
                    : "text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-2)]/50"
                }`}
              >
                <span className="opacity-75">{link.icon}</span>
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
