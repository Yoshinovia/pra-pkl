'use client'

import { useState, useEffect } from 'react'
import Sidebar from '../components/dashboard/sidebar'
import StatusBadge from '../components/ui/status-badge'
import { getAlerts, resolveAlert, logAction } from '../lib/api'
import type { StockAlert } from '../lib/types'

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<StockAlert[]>([])
  const [tab, setTab] = useState<'low_stock' | 'expiring_soon'>('low_stock')

  useEffect(() => {
    getAlerts().then(setAlerts)
  }, [])

  const lowStockAlerts = alerts.filter(a => a.type === 'low_stock')
  const expiringAlerts = alerts.filter(a => a.type === 'expiring_soon')

  async function handleResolve(id: number, name: string) {
    await resolveAlert(id)
    setAlerts(prev => prev.filter(a => a.id !== id))
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    await logAction(user.id || 0, user.name || '', 'Resolve Alert', 'Alert', `Resolved alert for ${name}`)
  }

  return (
    <div className="flex min-h-screen font-sans bg-gradient-to-r from-white to-[#edde53]">
      <Sidebar />
      <main className="flex-1 p-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Stock Alerts</h2>
            <p className="text-gray-700 text-sm mt-1">Monitor low stock and expiring products</p>
          </div>
        </header>

        <div className="bg-black/50 text-white backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 overflow-hidden mb-8">
          <div className="flex border-b border-white/20">
            <button onClick={() => setTab('low_stock')}
              className={`flex-1 p-4 text-center font-medium transition-colors ${tab === 'low_stock' ? 'bg-[#edde53] text-black' : 'text-gray-300 hover:bg-white/5'}`}>
              Low Stock ({lowStockAlerts.length})
            </button>
            <button onClick={() => setTab('expiring_soon')}
              className={`flex-1 p-4 text-center font-medium transition-colors ${tab === 'expiring_soon' ? 'bg-[#edde53] text-black' : 'text-gray-300 hover:bg-white/5'}`}>
              Expiring Soon ({expiringAlerts.length})
            </button>
          </div>

          {tab === 'low_stock' && (
            <div className="p-6">
              {lowStockAlerts.length === 0 ? (
                <p className="text-gray-400 text-center py-8">No low stock alerts. All products are well-stocked.</p>
              ) : (
                <div className="space-y-4">
                  {lowStockAlerts.map(alert => (
                    <div key={alert.id} className="bg-black/30 rounded-xl p-5 border border-white/10 flex items-center justify-between gap-4">
                      <div className="flex-1">
                        <h4 className="font-bold text-white">{alert.product_name}</h4>
                        <p className="text-sm text-gray-400 mt-1">Stock: <span className="text-red-400 font-bold">{alert.current_stock}</span> / Reorder at: {alert.reorder_point}</p>
                        <p className="text-xs text-gray-500 mt-1">Triggered: {new Date(alert.triggered_at).toLocaleDateString()}</p>
                      </div>
                      <button onClick={() => handleResolve(alert.id, alert.product_name)}
                        className="bg-[#edde53] hover:bg-yellow-400 text-black font-medium px-4 py-2 rounded-xl transition-colors text-sm whitespace-nowrap">
                        Restocked
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {tab === 'expiring_soon' && (
            <div className="p-6">
              {expiringAlerts.length === 0 ? (
                <p className="text-gray-400 text-center py-8">No products expiring soon.</p>
              ) : (
                <div className="space-y-4">
                  {expiringAlerts.map(alert => (
                    <div key={alert.id} className="bg-black/30 rounded-xl p-5 border border-white/10 flex items-center justify-between gap-4">
                      <div className="flex-1">
                        <h4 className="font-bold text-white">{alert.product_name}</h4>
                        <p className="text-sm text-gray-400 mt-1">Expires: <span className="text-orange-300 font-bold">{alert.expiry_date}</span> (Stock: {alert.current_stock})</p>
                        <p className="text-xs text-gray-500 mt-1">Triggered: {new Date(alert.triggered_at).toLocaleDateString()}</p>
                      </div>
                      <button onClick={() => handleResolve(alert.id, alert.product_name)}
                        className="bg-[#edde53] hover:bg-yellow-400 text-black font-medium px-4 py-2 rounded-xl transition-colors text-sm whitespace-nowrap">
                        Resolved
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
