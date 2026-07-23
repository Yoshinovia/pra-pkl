'use client'

import { useState } from 'react'
import type { Inventory, InventoryPayload } from '../lib/types'
import { getStockLevel } from '../lib/types'
import { createInventory, updateInventory, deleteInventory } from '../lib/api'
import Modal from '../components/ui/modal'
import ConfirmDialog from '../components/ui/confirm-dialog'
import StatusBadge from '../components/ui/status-badge'

interface InventoryTableProps {
  initialItems: Inventory[]
}

const categories = ['All', 'Electronics', 'Accessories', 'Furniture', 'Machinery Parts', 'Chemicals', 'Supplies', 'Safety']
const statusOptions = ['active', 'inactive']

export default function InventoryTable({ initialItems }: InventoryTableProps) {
  const [items, setItems] = useState<Inventory[]>(initialItems)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')

  const [modalMode, setModalMode] = useState<'add' | 'edit' | null>(null)
  const [editItem, setEditItem] = useState<Inventory | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Inventory | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState<InventoryPayload>({
    name: '', category: 'Electronics', stock: 0, price: 0, status: 'active',
  })

  const filtered = items.filter(item => {
    const matchSearch = !search || item.name.toLowerCase().includes(search.toLowerCase())
    const matchCat = categoryFilter === 'All' || item.category === categoryFilter
    return matchSearch && matchCat
  })

  function openAdd() {
    setForm({ name: '', category: 'Electronics', stock: 0, price: 0, status: 'active' })
    setError(null)
    setModalMode('add')
  }

  function openEdit(item: Inventory) {
    setEditItem(item)
    setForm({ name: item.name, category: item.category, stock: item.stock, price: item.price, status: item.status })
    setError(null)
    setModalMode('edit')
  }

  async function handleSave() {
    if (!form.name || !form.category) {
      setError('Name dan Category wajib diisi')
      return
    }
    setSaving(true)
    setError(null)
    try {
      if (modalMode === 'add') {
        const created = await createInventory(form)
        setItems(prev => [...prev, created])
      } else if (modalMode === 'edit' && editItem) {
        const updated = await updateInventory(editItem.id, form)
        setItems(prev => prev.map(i => i.id === updated.id ? updated : i))
      }
      setModalMode(null)
      setEditItem(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal menyimpan data')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return
    try {
      await deleteInventory(deleteTarget.id)
      setItems(prev => prev.filter(i => i.id !== deleteTarget.id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal menghapus data')
    } finally {
      setDeleteTarget(null)
    }
  }

  async function adjustStock(item: Inventory, delta: number) {
    const newStock = Math.max(0, item.stock + delta)
    try {
      const updated = await updateInventory(item.id, { stock: newStock })
      setItems(prev => prev.map(i => i.id === updated.id ? updated : i))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal mengubah stok')
    }
  }

  return (
    <>
      {error && (
        <div className="mb-4 bg-red-500/20 border border-red-400/40 text-red-100 text-sm rounded-xl px-4 py-3">
          {error}
        </div>
      )}

      <div className="bg-black/50 text-white backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-white/20 mb-8 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex-1 max-w-md">
          <input type="text" placeholder="Search by name..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full bg-black/30 border border-white/30 text-white placeholder-gray-400 py-3 px-4 rounded-xl focus:outline-none focus:border-[#edde53] transition-colors" />
        </div>
        <div className="flex gap-3 flex-wrap">
          <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}
            className="bg-black/40 border border-white/20 text-sm text-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-[#edde53]">
            {categories.map(c => <option key={c} value={c} className="bg-gray-900">{c}</option>)}
          </select>
          <button onClick={openAdd} className="bg-[#edde53] hover:bg-yellow-400 text-black font-bold px-4 py-2 rounded-xl transition-colors">+ Add</button>
        </div>
      </div>

      <div className="bg-black/50 text-white backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/20 text-sm text-gray-300 bg-black/30">
                <th className="px-6 py-4 font-semibold">Name</th>
                <th className="px-6 py-4 font-semibold">Category</th>
                <th className="px-6 py-4 font-semibold">Stock</th>
                <th className="px-6 py-4 font-semibold">Price</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(item => {
                const level = getStockLevel(item)
                return (
                  <tr key={item.id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-medium text-white">{item.name}</td>
                    <td className="px-6 py-4 text-gray-300">{item.category}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => adjustStock(item, -1)} className="w-6 h-6 flex items-center justify-center rounded bg-white/10 hover:bg-white/20 text-gray-300 text-sm transition-colors">&minus;</button>
                        <span className={`font-bold ${level === 'Low Stock' ? 'text-yellow-300' : level === 'Out of Stock' ? 'text-red-400' : 'text-white'}`}>{item.stock}</span>
                        <button onClick={() => adjustStock(item, 1)} className="w-6 h-6 flex items-center justify-center rounded bg-white/10 hover:bg-white/20 text-gray-300 text-sm transition-colors">+</button>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-300">${item.price.toFixed(2)}</td>
                    <td className="px-6 py-4"><StatusBadge status={level} /></td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <button onClick={() => openEdit(item)} className="text-[#edde53] hover:text-yellow-300 text-sm font-medium mr-3 transition-colors">Edit</button>
                      <button onClick={() => setDeleteTarget(item)} className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors">Delete</button>
                    </td>
                  </tr>
                )
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-400">No items found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={modalMode !== null} onClose={() => { setModalMode(null); setEditItem(null) }} title={modalMode === 'add' ? 'Add Item' : 'Edit Item'}>
        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-300 block mb-1">Name</label>
            <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
              className="w-full bg-black/30 border border-white/30 text-white placeholder-gray-400 py-2.5 px-4 rounded-xl focus:outline-none focus:border-[#edde53]" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-300 block mb-1">Category</label>
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                className="w-full bg-black/30 border border-white/30 text-white py-2.5 px-4 rounded-xl focus:outline-none focus:border-[#edde53]">
                {categories.filter(c => c !== 'All').map(c => <option key={c} value={c} className="bg-gray-900">{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm text-gray-300 block mb-1">Status</label>
              <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}
                className="w-full bg-black/30 border border-white/30 text-white py-2.5 px-4 rounded-xl focus:outline-none focus:border-[#edde53]">
                {statusOptions.map(s => <option key={s} value={s} className="bg-gray-900">{s}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-300 block mb-1">Price ($)</label>
              <input type="number" step="0.01" min="0" value={form.price} onChange={e => setForm({ ...form, price: Number(e.target.value) })}
                className="w-full bg-black/30 border border-white/30 text-white py-2.5 px-4 rounded-xl focus:outline-none focus:border-[#edde53]" />
            </div>
            <div>
              <label className="text-sm text-gray-300 block mb-1">Stock</label>
              <input type="number" min="0" value={form.stock} onChange={e => setForm({ ...form, stock: Number(e.target.value) })}
                className="w-full bg-black/30 border border-white/30 text-white py-2.5 px-4 rounded-xl focus:outline-none focus:border-[#edde53]" />
            </div>
          </div>
          {error && <p className="text-red-300 text-sm">{error}</p>}
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => { setModalMode(null); setEditItem(null) }} className="px-4 py-2 rounded-xl font-medium text-gray-300 hover:text-white hover:bg-white/10 transition-colors">Cancel</button>
            <button onClick={handleSave} disabled={saving} className="px-4 py-2 rounded-xl font-medium bg-[#edde53] hover:bg-yellow-400 text-black transition-colors disabled:opacity-50">
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Delete Item"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        danger
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  )
}
