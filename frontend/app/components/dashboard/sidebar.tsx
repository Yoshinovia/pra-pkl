"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/inventory", label: "View Inventory" },
  { href: "/suppliers", label: "Manage Suppliers" },
  { href: "/reports", label: "Generate Reports" },
  { href: "/alerts", label: "Stock Alerts" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const isAdmin = user?.role === 'admin';

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:8080/api/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error("Logout failed:", error);
    }
    localStorage.removeItem('user');
    document.cookie = 'token=; path=/; max-age=0';
    window.location.href = "/";
  };
  return (
    <aside className="w-64 bg-black/60 text-white backdrop-blur-2xl border-r border-white/20 flex flex-col shadow-2xl">
      <div className="p-6 border-b border-white/20">
        <h1 className="text-xl font-bold tracking-wider text-[#edde53]">
          Inventory Kreanova
        </h1>
        {user && <p className="text-sm text-gray-300 mt-1">{user.name}</p>}
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block p-3 rounded-xl font-medium transition-colors ${
                isActive
                  ? "bg-[#edde53] text-black shadow-md"
                  : "text-gray-200 hover:bg-white/10"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
        {isAdmin && (
          <Link
            href="/admin"
            className={`block p-3 rounded-xl font-medium transition-colors ${
              pathname === "/admin"
                ? "bg-[#edde53] text-black shadow-md"
                : "text-gray-200 hover:bg-white/10"
            }`}
          >
            Admin Panel
          </Link>
        )}
      </nav>

      <div className="p-4 border-t border-white/20">
        <button
          onClick={handleLogout}
          className="w-full text-left p-3 rounded-xl font-medium transition-colors text-red-400 hover:bg-red-500/20 hover:text-red-300"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}
