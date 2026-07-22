import React from 'react';
import Sidebar from '../components/dashboard/sidebar';
import Link from 'next/link';
import { getDashboardStats } from '../lib/api';

export default async function DashboardHome() {
  const stats = await getDashboardStats();

  return (
    <div className="flex min-h-screen font-sans bg-gradient-to-r from-white to-[#edde53]">
      <Sidebar />

      <main className="flex-1 p-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Overview</h2>
            <p className="text-gray-700 text-sm mt-1">Welcome back. Here is your inventory status.</p>
          </div>
          <Link href="/inventory" className="bg-[#edde53] hover:bg-yellow-400 text-black font-bold px-5 py-3 rounded-xl shadow-lg transition-colors border border-yellow-300 inline-block">
            + Add New Product
          </Link>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-black/50 text-white backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-white/20">
            <h3 className="text-gray-300 text-sm font-semibold mb-1">Total Products</h3>
            <p className="text-3xl font-bold text-white">{stats.totalProducts.toLocaleString()}</p>
          </div>
          <div className="bg-black/50 text-white backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-white/20 border-l-4 border-l-red-500">
            <h3 className="text-red-400 text-sm font-semibold mb-1">Low Stock Alerts</h3>
            <p className="text-3xl font-bold text-red-400">{stats.lowStockCount}</p>
          </div>
          <div className="bg-black/50 text-white backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-white/20 border-l-4 border-l-orange-400">
            <h3 className="text-orange-300 text-sm font-semibold mb-1">Expiring Soon</h3>
            <p className="text-3xl font-bold text-orange-300">{stats.expiringCount}</p>
          </div>
        </div>

        <div className="bg-black/50 text-white backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 overflow-hidden">
          <div className="p-5 border-b border-white/20 bg-black/20 flex justify-between items-center">
            <h3 className="font-semibold text-lg tracking-wide">Action Required: Low Stock</h3>
            <Link href="/alerts" className="text-sm text-[#edde53] font-medium hover:underline">View All Alerts</Link>
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
              {stats.recentAlerts.filter(a => a.type === 'low_stock').map((alert) => (
                <tr key={alert.id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                  <td className="p-4 font-medium text-white">{alert.product_name}</td>
                  <td className="p-4 text-gray-400">{alert.product_id}</td>
                  <td className="p-4 text-red-400 font-bold">{alert.current_stock}</td>
                  <td className="p-4 text-gray-400">{alert.reorder_point}</td>
                  <td className="p-4 text-right">
                    <Link href="/inventory" className="text-black bg-[#edde53] hover:bg-yellow-400 px-4 py-1.5 rounded-lg transition-colors font-medium inline-block">Order</Link>
                  </td>
                </tr>
              ))}
              {stats.recentAlerts.filter(a => a.type === 'low_stock').length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-400">No low stock alerts.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </main>
    </div>
  );
}