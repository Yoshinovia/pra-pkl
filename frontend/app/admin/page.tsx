'use client'

import { useState, useEffect } from 'react'
import Sidebar from '../components/dashboard/sidebar'
import Modal from '../components/ui/modal'
import { getUsers, logAction } from '../lib/api'
import type { User } from '../lib/types'

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([])
  const [logs, setLogs] = useState<{ id: number; user_name: string; action: string; target_entity: string; details: string; timestamp: string }[]>([])
  const [tab, setTab] = useState<'managers' | 'logs'>('managers')
  const [showCreate, setShowCreate] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [message, setMessage] = useState('')

  useEffect(() => {
    getUsers().then(setUsers)
    import('../lib/api').then(m => m.getActivityLogs().then(setLogs))
  }, [])

  const managers = users.filter(u => u.role === 'inventory_manager')

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name || !form.email || !form.password) {
      setMessage('All fields are required.')
      return
    }
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}')
    await logAction(currentUser.id || 0, currentUser.name || '', 'Create User', 'User', `Created inventory manager account for ${form.name} (${form.email})`)
    setMessage(`Manager "${form.name}" created successfully! (Mock: account saved to session)`)
    setForm({ name: '', email: '', password: '' })
    setTimeout(() => setMessage(''), 3000)
    setShowCreate(false)
  }

  return (
    <div className="flex min-h-screen font-sans bg-gradient-to-r from-white to-[#edde53]">
      <Sidebar />
      <main className="flex-1 p-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Admin Panel</h2>
            <p className="text-gray-700 text-sm mt-1">Manage inventory managers and review activity logs</p>
          </div>
        </header>

        {message && (
          <div className="bg-green-500/20 text-green-300 border border-green-500/30 p-4 rounded-xl mb-6 text-sm">{message}</div>
        )}

        <div className="bg-black/50 text-white backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 overflow-hidden mb-8">
          <div className="flex border-b border-white/20">
            <button onClick={() => setTab('managers')}
              className={`flex-1 p-4 text-center font-medium transition-colors ${tab === 'managers' ? 'bg-[#edde53] text-black' : 'text-gray-300 hover:bg-white/5'}`}>
              Inventory Managers
            </button>
            <button onClick={() => setTab('logs')}
              className={`flex-1 p-4 text-center font-medium transition-colors ${tab === 'logs' ? 'bg-[#edde53] text-black' : 'text-gray-300 hover:bg-white/5'}`}>
              Activity Log
            </button>
          </div>

          {tab === 'managers' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <p className="text-gray-300 text-sm">{managers.length} inventory manager(s)</p>
                <button onClick={() => setShowCreate(true)}
                  className="bg-[#edde53] hover:bg-yellow-400 text-black font-bold px-4 py-2 rounded-xl transition-colors text-sm">
                  + Create Manager
                </button>
              </div>

              <div className="space-y-3">
                {managers.map(m => (
                  <div key={m.id} className="bg-black/30 rounded-xl p-4 border border-white/10 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-white">{m.name}</p>
                      <p className="text-sm text-gray-400">{m.email}</p>
                    </div>
                    <span className="bg-blue-500/20 text-blue-300 border border-blue-500/30 px-3 py-1 rounded-full text-xs font-medium">Inventory Manager</span>
                  </div>
                ))}
                {managers.length === 0 && (
                  <p className="text-gray-400 text-center py-4">No inventory managers created yet.</p>
                )}
              </div>
            </div>
          )}

          {tab === 'logs' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/20 text-sm text-gray-300 bg-black/30">
                    <th className="px-6 py-4 font-semibold">User</th>
                    <th className="px-6 py-4 font-semibold">Action</th>
                    <th className="px-6 py-4 font-semibold">Target</th>
                    <th className="px-6 py-4 font-semibold">Details</th>
                    <th className="px-6 py-4 font-semibold">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {logs.map(log => (
                    <tr key={log.id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 text-white font-medium">{log.user_name}</td>
                      <td className="px-6 py-4">
                        <span className="bg-white/10 px-3 py-1 rounded-full text-xs font-medium text-gray-200">{log.action}</span>
                      </td>
                      <td className="px-6 py-4 text-gray-300">{log.target_entity}</td>
                      <td className="px-6 py-4 text-gray-400 max-w-xs truncate">{log.details}</td>
                      <td className="px-6 py-4 text-gray-400 whitespace-nowrap">{new Date(log.timestamp).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Create Inventory Manager">
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="text-sm text-gray-300 block mb-1">Name</label>
              <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                className="w-full bg-black/30 border border-white/30 text-white py-2.5 px-4 rounded-xl focus:outline-none focus:border-[#edde53]" />
            </div>
            <div>
              <label className="text-sm text-gray-300 block mb-1">Email</label>
              <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                className="w-full bg-black/30 border border-white/30 text-white py-2.5 px-4 rounded-xl focus:outline-none focus:border-[#edde53]" />
            </div>
            <div>
              <label className="text-sm text-gray-300 block mb-1">Password</label>
              <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                className="w-full bg-black/30 border border-white/30 text-white py-2.5 px-4 rounded-xl focus:outline-none focus:border-[#edde53]" />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setShowCreate(false)}
                className="px-4 py-2 rounded-xl font-medium text-gray-300 hover:text-white hover:bg-white/10 transition-colors">Cancel</button>
              <button type="submit"
                className="px-4 py-2 rounded-xl font-medium bg-[#edde53] hover:bg-yellow-400 text-black transition-colors">Create</button>
            </div>
          </form>
        </Modal>
      </main>
    </div>
  )
}
