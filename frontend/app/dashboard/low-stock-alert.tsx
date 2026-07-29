'use client'

import { useEffect, useState } from 'react'
import type { DashboardAlert } from '../lib/api'

interface LowStockAlertProps {
  alerts: DashboardAlert[]
}

export default function LowStockAlert({ alerts }: LowStockAlertProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (alerts.length > 0) setVisible(true)
  }, [alerts.length])

  if (!visible || alerts.length === 0) return null

  const names = alerts.slice(0, 3).map(a => a.product_name).join(', ')
  const extra = alerts.length > 3 ? `, +${alerts.length - 3} lainnya` : ''

  return (
    <div className="mb-6 bg-red-500/20 border border-red-400/40 text-red-100 backdrop-blur-xl rounded-2xl px-5 py-4 flex items-start justify-between gap-4 shadow-xl">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 text-red-900 text-lg leading-none">&#9888;</span>
        <div>
          <p className="font-semibold text-black">
            {alerts.length} product stock is running low, with fewer than 10 units remaining.
          </p>
          <p className="text-sm text-black mt-1">
            {names}{extra}
          </p>
        </div>
      </div>
      <button
        onClick={() => setVisible(false)}
        className="text-black text-sm font-medium shrink-0 transition-colors"
      >
        Dismiss
      </button>
    </div>
  )
}
