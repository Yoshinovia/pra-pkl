"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/inventory", label: "View Inventory" },
  { href: "/suppliers", label: "Manage Suppliers" },
  { href: "/reports", label: "Generate Reports" },
];

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="w-64 bg-black/60 text-white backdrop-blur-2xl border-r border-white/20 flex flex-col shadow-2xl">
      <div className="p-6 border-b border-white/20">
        <h1 className="text-xl font-bold tracking-wider text-[#edde53]">
          INV SYS
        </h1>
        <p className="text-sm text-gray-300 mt-1">Inventory Manager</p>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {/* Active state using the yellow accent color */}
        {navItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block p-3 rounded-xl text-black font-medium transition-colors ${
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
    </aside>
  );
}
