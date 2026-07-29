'use client'

import { useState } from 'react'
import ReportsTable from '../components/reports/reports_table'
import type { Movement } from '../lib/types'

interface ReportsClientProps {
  data: Movement[]
}

export default function ReportsClient({ data }: ReportsClientProps) {
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const filtered = data.filter(m => {
    if (startDate && m.date < startDate) return false
    if (endDate && m.date > endDate) return false
    return true
  })

  const totalIn = filtered.filter(r => r.type === 'Stock In').reduce((sum, r) => sum + r.quantity, 0)
  const totalOut = filtered.filter(r => r.type === 'Stock Out').reduce((sum, r) => sum + r.quantity, 0)

  function exportCSV() {
    const headers = ['Product Name,Category,Type,Quantity,Date,Reference']
    const rows = filtered.map(r => `${r.productName},${r.category},${r.type},${r.quantity},${r.date},${r.reference}`)
    const csv = [...headers, ...rows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `inventory-report-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  function exportPDF() {
    const printWindow = window.open('', '_blank')
    if (!printWindow) return
    const rows = filtered.map(r => `<tr><td>${r.productName}</td><td>${r.category}</td><td>${r.type}</td><td>${r.quantity}</td><td>${r.date}</td><td>${r.reference}</td></tr>`).join('')
    printWindow.document.write(`
      <html><head><title>Inventory Report</title>
      <style>body{font-family:sans-serif;padding:40px}
      h1{color:#333;font-size:24px;margin-bottom:8px}
      p{color:#666;margin-bottom:24px}
      table{width:100%;border-collapse:collapse}
      th{background:#f5f5f5;text-align:left;padding:10px 12px;border-bottom:2px solid #ddd;font-size:13px}
      td{padding:10px 12px;border-bottom:1px solid #eee;font-size:13px}
      .summary{display:flex;gap:32px;margin-bottom:24px}
      .stat{background:#f9f9f9;padding:16px 24px;border-radius:8px}
      .stat-label{font-size:12px;color:#666;margin-bottom:4px}
      .stat-value{font-size:20px;font-weight:bold;color:#333}
      @media print{body{padding:20px}}</style></head><body>
      <h1>Inventory Report</h1>
      <p>Generated on ${new Date().toLocaleDateString()}</p>
      <div class="summary">
        <div class="stat"><div class="stat-label">Total Stock In</div><div class="stat-value">+${totalIn}</div></div>
        <div class="stat"><div class="stat-label">Total Stock Out</div><div class="stat-value">-${totalOut}</div></div>
        <div class="stat"><div class="stat-label">Net Movement</div><div class="stat-value">${totalIn - totalOut}</div></div>
      </div>
      <table><thead><tr><th>Product</th><th>Category</th><th>Type</th><th>Qty</th><th>Date</th><th>Ref</th></tr></thead><tbody>${rows}</tbody></table>
      </body></html>`)
    printWindow.document.close()
    printWindow.print()
  }

  return (
    <>
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-black/50 text-white backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-white/20">
          <h3 className="text-gray-300 text-sm font-semibold mb-1">Total Stock In</h3>
          <p className="text-3xl font-bold text-green-400">+{totalIn}</p>
        </div>
        <div className="bg-black/50 text-white backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-white/20">
          <h3 className="text-gray-300 text-sm font-semibold mb-1">Total Stock Out</h3>
          <p className="text-3xl font-bold text-red-400">-{totalOut}</p>
        </div>
        <div className="bg-black/50 text-white backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-white/20">
          <h3 className="text-gray-300 text-sm font-semibold mb-1">Net Movement</h3>
          <p className={`text-3xl font-bold ${totalIn - totalOut >= 0 ? 'text-[#edde53]' : 'text-red-400'}`}>
            {totalIn - totalOut >= 0 ? '+' : ''}{totalIn - totalOut}
          </p>
        </div>
      </div>

      <div className="bg-black/50 text-white backdrop-blur-xl p-5 rounded-2xl shadow-xl border border-white/20 mb-6 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex gap-4 items-center">
          <div>
            <label className="text-xs text-gray-400 block mb-1">From</label>
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)}
              className="bg-black/30 border border-white/20 text-sm text-white rounded-lg px-3 py-2 focus:outline-none focus:border-[#edde53]" />
          </div>
          <div>
            <label className="text-xs text-gray-400 block mb-1">To</label>
            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)}
              className="bg-black/30 border border-white/20 text-sm text-white rounded-lg px-3 py-2 focus:outline-none focus:border-[#edde53]" />
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={exportCSV} className="bg-black/40 hover:bg-black/60 text-gray-200 font-medium px-4 py-2 rounded-xl border border-white/20 transition-colors text-sm">Export CSV</button>
          <button onClick={exportPDF} className="bg-[#edde53] hover:bg-yellow-400 text-black font-bold px-4 py-2 rounded-xl transition-colors text-sm">Export PDF</button>
        </div>
      </div>

      <ReportsTable data={filtered} />
    </>
  )
}
