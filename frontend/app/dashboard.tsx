import React from 'react';

export default function DashboardHome() {
  return (
    <div className="flex min-h-screen bg-gray-100 font-sans text-gray-800">
      
      {/* 1. SIDEBAR NAVIGATION */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col">
        <div className="p-6 border-b border-slate-700">
          <h1 className="text-xl font-bold tracking-wider">INV SYS</h1>
          <p className="text-sm text-slate-400 mt-1">Inventory Manager</p>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <a href="#" className="block p-3 rounded bg-blue-600 font-medium">Dashboard</a>
          <a href="#" className="block p-3 rounded hover:bg-slate-800 transition">View Inventory</a>
          <a href="#" className="block p-3 rounded hover:bg-slate-800 transition">Manage Suppliers</a>
          <a href="#" className="block p-3 rounded hover:bg-slate-800 transition">Generate Reports</a>
        </nav>
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <main className="flex-1 p-8">
        
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold">Overview</h2>
            <p className="text-gray-500 text-sm">Welcome back. Here is your inventory status.</p>
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow transition">
            + Add New Product
          </button>
        </header>

        {/* 3. KPI RIBBON (Stats Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-gray-500 text-sm font-semibold mb-1">Total Products</h3>
            <p className="text-3xl font-bold">1,248</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-red-100 border-l-4 border-l-red-500">
            <h3 className="text-red-500 text-sm font-semibold mb-1">Low Stock Alerts</h3>
            <p className="text-3xl font-bold text-red-600">12</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-orange-100 border-l-4 border-l-orange-400">
            <h3 className="text-orange-500 text-sm font-semibold mb-1">Expiring Soon (30 Days)</h3>
            <p className="text-3xl font-bold text-orange-600">5</p>
          </div>
        </div>

        {/* 4. MAIN DATA VIEW (Alerts & Activity) */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-5 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
            <h3 className="font-semibold text-lg">Action Required: Low Stock</h3>
            <button className="text-sm text-blue-600 font-medium hover:underline">View All Alerts</button>
          </div>
          
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white border-b border-gray-200 text-sm text-gray-500">
                <th className="p-4 font-medium">Product Name</th>
                <th className="p-4 font-medium">SKU</th>
                <th className="p-4 font-medium">Current Stock</th>
                <th className="p-4 font-medium">Reorder Point</th>
                <th className="p-4 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              <tr className="border-b border-gray-100 hover:bg-gray-50">
                <td className="p-4 font-medium text-gray-900">Industrial Bearings (12mm)</td>
                <td className="p-4 text-gray-500">BRG-12-IND</td>
                <td className="p-4 text-red-600 font-bold">4</td>
                <td className="p-4 text-gray-500">20</td>
                <td className="p-4 text-right">
                  <button className="text-blue-600 border border-blue-600 px-3 py-1 rounded hover:bg-blue-50 transition">Order</button>
                </td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="p-4 font-medium text-gray-900">Synthetic Lubricant 5L</td>
                <td className="p-4 text-gray-500">LUB-SYN-5L</td>
                <td className="p-4 text-red-600 font-bold">1</td>
                <td className="p-4 text-gray-500">15</td>
                <td className="p-4 text-right">
                  <button className="text-blue-600 border border-blue-600 px-3 py-1 rounded hover:bg-blue-50 transition">Order</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

      </main>
    </div>
  );
}