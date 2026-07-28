'use client'

import { useState } from 'react'
import type { Supplier } from '../lib/types'
import { createSupplier, updateSupplier, deleteSupplier } from '../lib/api'
import Modal from '../components/ui/modal'
import ConfirmDialog from '../components/ui/confirm-dialog'
import StatusBadge from '../components/ui/status-badge'

interface SupplierTableProps {
  initialSuppliers: Supplier[]
}

export default function SupplierTable({ initialSuppliers }: SupplierTableProps) {
  const [suppliers, setSuppliers] = useState(initialSuppliers)
  const [search, setSearch] = useState('')

  const [modalMode, setModalMode] = useState<'add' | 'edit' | null>(null)
  const [editTarget, setEditTarget] = useState<Supplier | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Supplier | null>(null)

  const [form, setForm] = useState({
    name: '',
    contact_person: '',
    email: '',
    phone: '',
    products_supplied: 0,
    status: 'active' as Supplier['status'],
  })

  const filtered = suppliers.filter(s =>
    !search ||
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.contact_person.toLowerCase().includes(search.toLowerCase())
  )

  function openAdd() {
    setForm({ name: '', contact_person: '', email: '', phone: '', products_supplied: 0, status: 'active' })
    setModalMode('add')
  }

  function openEdit(s: Supplier) {
    setEditTarget(s)
    setForm({
      name: s.name,
      contact_person: s.contact_person,
      email: s.email,
      phone: s.phone,
      products_supplied: s.products_supplied,
      status: s.status,
    })
    setModalMode('edit')
  }

  async function handleSave() {
    if (modalMode === 'add') {
      const created = await createSupplier(form)
      setSuppliers(prev => [...prev, created])
    } else if (modalMode === 'edit' && editTarget) {
      const updated = await updateSupplier(editTarget.id, form)
      if (updated) setSuppliers(prev => prev.map(s => s.id === updated.id ? updated : s))
    }
    setModalMode(null)
    setEditTarget(null)
  }

  async function handleDelete() {
    if (!deleteTarget) return
    await deleteSupplier(deleteTarget.id)
    setSuppliers(prev => prev.filter(s => s.id !== deleteTarget.id))
    setDeleteTarget(null)
  }

  return (
    <>
      <div className="bg-black/50 text-white backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-white/20 mb-8 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search by name or contact person..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-black/30 border border-white/30 text-white placeholder-gray-400 py-3 px-4 rounded-xl focus:outline-none focus:border-[#edde53] transition-colors"
          />
        </div>
        <button onClick={openAdd} className="bg-[#edde53] hover:bg-yellow-400 text-black font-bold px-4 py-2 rounded-xl transition-colors">
          + Add
        </button>
      </div>

      <div className="bg-black/50 text-white backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/20 text-sm text-gray-300 bg-black/30">
                <th className="px-6 py-4 font-semibold">Supplier</th>
                <th className="px-6 py-4 font-semibold">Contact Person</th>
                <th className="px-6 py-4 font-semibold">Email / Phone</th>
                <th className="px-6 py-4 font-semibold">Products</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(s => (
                <tr key={s.id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 font-medium text-white">{s.name}</td>
                  <td className="px-6 py-4 text-gray-300">{s.contact_person}</td>
                  <td className="px-6 py-4 text-gray-400 text-sm">
                    <div>{s.email}</div>
                    <div>{s.phone}</div>
                  </td>
                  <td className="px-6 py-4 text-gray-300">{s.products_supplied}</td>
                  <td className="px-6 py-4"><StatusBadge status={s.status} /></td>
                  <td className="px-6 py-4 text-right whitespace-nowrap">
                    <button onClick={() => openEdit(s)} className="text-[#edde53] hover:text-yellow-300 text-sm font-medium mr-3 transition-colors">Edit</button>
                    <button onClick={() => setDeleteTarget(s)} className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors">Delete</button>
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

      <Modal open={modalMode !== null} onClose={() => { setModalMode(null); setEditTarget(null) }} title={modalMode === 'add' ? 'Add Supplier' : 'Edit Supplier'}>
        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-300 block mb-1">Supplier Name</label>
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
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-300 block mb-1">Products Supplied</label>
              <input type="number" min="0" value={form.products_supplied} onChange={e => setForm({ ...form, products_supplied: Number(e.target.value) })}
                className="w-full bg-black/30 border border-white/30 text-white py-2.5 px-4 rounded-xl focus:outline-none focus:border-[#edde53]" />
            </div>
            <div>
              <label className="text-sm text-gray-300 block mb-1">Status</label>
              <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value as Supplier['status'] })}
                className="w-full bg-black/30 border border-white/30 text-white py-2.5 px-4 rounded-xl focus:outline-none focus:border-[#edde53]">
                <option value="active" className="bg-gray-900">Active</option>
                <option value="inactive" className="bg-gray-900">Inactive</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => { setModalMode(null); setEditTarget(null) }} className="px-4 py-2 rounded-xl font-medium text-gray-300 hover:text-white hover:bg-white/10 transition-colors">Cancel</button>
            <button onClick={handleSave} className="px-4 py-2 rounded-xl font-medium bg-[#edde53] hover:bg-yellow-400 text-black transition-colors">Save</button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Delete Supplier"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        danger
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  )
}