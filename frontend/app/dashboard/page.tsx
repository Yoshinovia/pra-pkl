import React from 'react';

export default function DashboardHome() {
  return (
    // 1. Applied the same background gradient as the login page
    <div className="flex min-h-screen font-sans bg-gradient-to-r from-white to-[#edde53]">
      
      {/* 2. SIDEBAR - Tinted dark glass effect */}
      <aside className="w-64 bg-black/60 text-white backdrop-blur-2xl border-r border-white/20 flex flex-col shadow-2xl">
        <div className="p-6 border-b border-white/20">
          <h1 className="text-xl font-bold tracking-wider text-[#edde53]">INV SYS</h1>
          <p className="text-sm text-gray-300 mt-1">Inventory Manager</p>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {/* Active state using the yellow accent color */}
          <a href="#" className="block p-3 rounded-xl bg-[#edde53] text-black font-medium shadow-md">Dashboard</a>
          <a href="#" className="block p-3 rounded-xl hover:bg-white/10 transition-colors text-gray-200">View Inventory</a>
          <a href="#" className="block p-3 rounded-xl hover:bg-white/10 transition-colors text-gray-200">Manage Suppliers</a>
          <a href="#" className="block p-3 rounded-xl hover:bg-white/10 transition-colors text-gray-200">Generate Reports</a>
        </nav>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 p-8">
        
        {/* Header - Using dark text because it sits directly on the light gradient background */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Overview</h2>
            <p className="text-gray-700 text-sm mt-1">Welcome back. Here is your inventory status.</p>
          </div>
          {/* Primary Action Button matching the login button style */}
          <button className="bg-[#edde53] hover:bg-yellow-400 text-black font-bold px-5 py-3 rounded-xl shadow-lg transition-colors border border-yellow-300">
            + Add New Product
          </button>
        </header>

        {/* 3. KPI RIBBON (Stats Cards) - Tinted glass effect */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-black/50 text-white backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-white/20">
            <h3 className="text-gray-300 text-sm font-semibold mb-1">Total Products</h3>
            <p className="text-3xl font-bold text-white">1,248</p>
          </div>
          <div className="bg-black/50 text-white backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-white/20 border-l-4 border-l-red-500">
            <h3 className="text-red-400 text-sm font-semibold mb-1">Low Stock Alerts</h3>
            <p className="text-3xl font-bold text-red-400">12</p>
          </div>
          <div className="bg-black/50 text-white backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-white/20 border-l-4 border-l-orange-400">
            <h3 className="text-orange-300 text-sm font-semibold mb-1">Expiring Soon (30 Days)</h3>
            <p className="text-3xl font-bold text-orange-300">5</p>
          </div>
        </div>

        {/* 4. MAIN DATA VIEW (Alerts & Activity) - Tinted glass table */}
        <div className="bg-black/50 text-white backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 overflow-hidden">
          <div className="p-5 border-b border-white/20 bg-black/20 flex justify-between items-center">
            <h3 className="font-semibold text-lg tracking-wide">Action Required: Low Stock</h3>
            <button className="text-sm text-[#edde53] font-medium hover:underline">View All Alerts</button>
          </div>
          
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/20 text-sm text-gray-300 bg-black/30">
                <th className="p-4 font-medium">Product Name</th>
                <th className="p-4 font-medium">SKU</th>
                <th className="p-4 font-medium">Current Stock</th>
                <th className="p-4 font-medium">Reorder Point</th>
                <th className="p-4 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              <tr className="border-b border-white/10 hover:bg-white/5 transition-colors">
                <td className="p-4 font-medium text-white">Industrial Bearings (12mm)</td>
                <td className="p-4 text-gray-400">BRG-12-IND</td>
                <td className="p-4 text-red-400 font-bold">4</td>
                <td className="p-4 text-gray-400">20</td>
                <td className="p-4 text-right">
                  <button className="text-black bg-[#edde53] hover:bg-yellow-400 px-4 py-1.5 rounded-lg transition-colors font-medium">Order</button>
                </td>
              </tr>
              <tr className="hover:bg-white/5 transition-colors">
                <td className="p-4 font-medium text-white">Synthetic Lubricant 5L</td>
                <td className="p-4 text-gray-400">LUB-SYN-5L</td>
                <td className="p-4 text-red-400 font-bold">1</td>
                <td className="p-4 text-gray-400">15</td>
                <td className="p-4 text-right">
                  <button className="text-black bg-[#edde53] hover:bg-yellow-400 px-4 py-1.5 rounded-lg transition-colors font-medium">Order</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

      </main>
    </div>
  );
}