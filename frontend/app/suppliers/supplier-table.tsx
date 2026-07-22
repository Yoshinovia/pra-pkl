'use client'

import { useState } from 'react'
import type { Supplier } from '../lib/types'
import { createSupplier, updateSupplier, deleteSupplier, logAction } from '../lib/api'
import Modal from '../components/ui/modal'
import ConfirmDialog from '../components/ui/confirm-dialog'
import StatusBadge from '../components/ui/status-badge'

interface SupplierTableProps {
  initialSuppliers: Supplier[]
}

export default function SupplierTable({ initialSuppliers }: SupplierTableProps) {
  const [suppliers, setSuppliers] = useState(initialSuppliers)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')

  const [modalMode, setModalMode] = useState<'add' | 'edit' | null>(null)
  const [editSupplier, setEditSupplier] = useState<Supplier | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Supplier | null>(null)

  const [form, setForm] = useState({ name: '', contact_person: '', email: '', phone: '', status: 'active' as 'active' | 'inactive' })

  const filtered = suppliers.filter(s => {
    const matchSearch = !search || s.name.toLowerCase().includes(search.toLowerCase()) || s.contact_person.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'All' || s.status === statusFilter
    return matchSearch && matchStatus
  })

  const activeCount = suppliers.filter(s => s.status === 'active').length
  const inactiveCount = suppliers.filter(s => s.status === 'inactive').length

  function openAdd() {
    setForm({ name: '', contact_person: '', email: '', phone: '', status: 'active' })
    setModalMode('add')
  }

  function openEdit(s: Supplier) {
    setEditSupplier(s)
    setForm({ name: s.name, contact_person: s.contact_person, email: s.email, phone: s.phone, status: s.status })
    setModalMode('edit')
  }

  async function handleSave() {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    if (modalMode === 'add') {
      const created = await createSupplier({ name: form.name, contact_person: form.contact_person, email: form.email, phone: form.phone, products_supplied: 0, status: form.status })
      setSuppliers(prev => [...prev, created])
      await logAction(user.id || 0, user.name || '', 'Add Supplier', 'Supplier', `Added ${created.name}`)
    } else if (modalMode === 'edit' && editSupplier) {
      const updated = await updateSupplier(editSupplier.id, form)
      if (updated) setSuppliers(prev => prev.map(s => s.id === updated.id ? updated : s))
      await logAction(user.id || 0, user.name || '', 'Update Supplier', 'Supplier', `Updated ${editSupplier.name}`)
    }
    setModalMode(null)
    setEditSupplier(null)
  }

  async function handleDelete() {
    if (!deleteTarget) return
    await deleteSupplier(deleteTarget.id)
    setSuppliers(prev => prev.filter(s => s.id !== deleteTarget.id))
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    await logAction(user.id || 0, user.name || '', 'Delete Supplier', 'Supplier', `Deleted ${deleteTarget.name}`)
    setDeleteTarget(null)
  }

  return (
    <>
      <div className="bg-black/50 text-white backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-white/20 mb-8 flex flex-col md:flex-row gap-8 md:items-center justify-between">
        <div className="flex-1 max-w-xl">
          <input type="text" placeholder="Search suppliers by company name or contact..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full bg-black/30 border border-white/30 text-white placeholder-gray-400 py-3 px-4 rounded-xl focus:outline-none focus:border-[#edde53] transition-colors" />
        </div>
        <div className="flex gap-3 items-center">
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
            className="bg-black/40 border border-white/20 text-sm text-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-[#edde53]">
            <option value="All" className="bg-gray-900">All Status</option>
            <option value="active" className="bg-gray-900">Active</option>
            <option value="inactive" className="bg-gray-900">Inactive</option>
          </select>
          <div className="flex gap-4 items-center ml-2">
            <div className="text-center px-3">
              <p className="text-xl font-bold text-white">{activeCount}</p>
              <p className="text-xs text-gray-300 uppercase tracking-wider mt-0.5">Active</p>
            </div>
            <div className="w-px h-8 bg-white/20"></div>
            <div className="text-center px-3">
              <p className="text-xl font-bold text-gray-400">{inactiveCount}</p>
              <p className="text-xs text-gray-400 uppercase tracking-wider mt-0.5">Inactive</p>
            </div>
          </div>
          <button onClick={openAdd} className="bg-[#edde53] hover:bg-yellow-400 text-black font-bold px-4 py-2 rounded-xl transition-colors ml-2">+ Add</button>
        </div>
      </div>

      <div className="bg-black/50 text-white backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 overflow-hidden">
        <div className="p-5 border-b border-white/20 bg-black/20">
          <h3 className="font-semibold text-lg tracking-wide">Supplier Directory</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/20 text-sm text-gray-300 bg-black/30">
                <th className="p-4 font-medium">Supplier Name</th>
                <th className="p-4 font-medium">Contact Person</th>
                <th className="p-4 font-medium">Email / Phone</th>
                <th className="p-4 font-medium">Products</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {filtered.map(s => (
                <tr key={s.id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                  <td className="p-4">
                    <p className="font-medium text-white text-base">{s.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">ID: SUP-{String(s.id).padStart(3, '0')}</p>
                  </td>
                  <td className="p-4 text-gray-300">{s.contact_person}</td>
                  <td className="p-4">
                    <p className="text-gray-300">{s.email}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{s.phone}</p>
                  </td>
                  <td className="p-4 text-gray-300">{s.products_supplied}</td>
                  <td className="p-4"><StatusBadge status={s.status === 'active' ? 'Active' : 'Inactive'} /></td>
                  <td className="p-4 text-right space-x-3 whitespace-nowrap">
                    <button onClick={() => openEdit(s)} className="text-black bg-[#edde53] hover:bg-yellow-400 px-4 py-1.5 rounded-lg transition-colors font-medium">Edit</button>
                    <button onClick={() => setDeleteTarget(s)} className="text-white bg-red-500/80 hover:bg-red-500 px-4 py-1.5 rounded-lg transition-colors font-medium border border-red-500/50">Delete</button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-400">No suppliers found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={modalMode !== null} onClose={() => { setModalMode(null); setEditSupplier(null) }} title={modalMode === 'add' ? 'Add Supplier' : 'Edit Supplier'}>
        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-300 block mb-1">Company Name</label>
            <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
              className="w-full bg-black/30 border border-white/30 text-white py-2.5 px-4 rounded-xl focus:outline-none focus:border-[#edde53]" />
          </div>
          <div>
            <label className="text-sm text-gray-300 block mb-1">Contact Person</label>
            <input type="text" value={form.contact_person} onChange={e => setForm({ ...form, contact_person: e.target.value })}
              className="w-full bg-black/30 border border-white/30 text-white py-2.5 px-4 rounded-xl focus:outline-none focus:border-[#edde53]" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-300 block mb-1">Email</label>
              <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                className="w-full bg-black/30 border border-white/30 text-white py-2.5 px-4 rounded-xl focus:outline-none focus:border-[#edde53]" />
            </div>
            <div>
              <label className="text-sm text-gray-300 block mb-1">Phone</label>
              <input type="text" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                className="w-full bg-black/30 border border-white/30 text-white py-2.5 px-4 rounded-xl focus:outline-none focus:border-[#edde53]" />
            </div>
          </div>
          <div>
            <label className="text-sm text-gray-300 block mb-1">Status</label>
            <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value as 'active' | 'inactive' })}
              className="w-full bg-black/30 border border-white/30 text-white py-2.5 px-4 rounded-xl focus:outline-none focus:border-[#edde53]">
              <option value="active" className="bg-gray-900">Active</option>
              <option value="inactive" className="bg-gray-900">Inactive</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => { setModalMode(null); setEditSupplier(null) }} className="px-4 py-2 rounded-xl font-medium text-gray-300 hover:text-white hover:bg-white/10 transition-colors">Cancel</button>
            <button onClick={handleSave} className="px-4 py-2 rounded-xl font-medium bg-[#edde53] hover:bg-yellow-400 text-black transition-colors">Save</button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Delete Supplier"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? Stock alerts for linked products will be refreshed.`}
        confirmLabel="Delete"
        danger
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  )
}
