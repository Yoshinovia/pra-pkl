"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation"; // 1. Import useRouter

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/inventory", label: "View Inventory" },
  { href: "/suppliers", label: "Manage Suppliers" },
  { href: "/reports", label: "Generate Reports" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter(); // 2. Initialize the router

  const handleLogout = () => {
    // Note: Later on, you can add logic here to clear tokens or cookies
    router.push("/"); // 3. Push the user back to the login page
  };

  return (
    <aside className="w-64 bg-black/60 text-white backdrop-blur-2xl border-r border-white/20 flex flex-col shadow-2xl">
      <div className="p-6 border-b border-white/20">
        <h1 className="text-xl font-bold tracking-wider text-[#edde53]">
          Inventory Kreanova
        </h1>
        <p className="text-sm text-gray-300 mt-1">Inventory Manager</p>
      </div>
      
      {/* Navigation Links - flex-1 pushes everything below it to the bottom */}
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
      </nav>

      {/* 4. Logout Button Section - Pinned to bottom */}
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