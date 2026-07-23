'use client'

import { useState, useEffect } from 'react'
import type { Product } from '../lib/types'
import { getProductStatus } from '../lib/types'
import { getSuppliers, createProduct, updateProduct, deleteProduct, logAction } from '../lib/api'
import type { Supplier } from '../lib/types'
import Modal from '../components/ui/modal'
import ConfirmDialog from '../components/ui/confirm-dialog'
import StatusBadge from '../components/ui/status-badge'

interface ProductTableProps {
  initialProducts: Product[]
}

const categories = ['All', 'Electronics', 'Accessories', 'Furniture', 'Machinery Parts', 'Chemicals', 'Supplies', 'Safety']

export default function ProductTable({ initialProducts }: ProductTableProps) {
  const [products, setProducts] = useState(initialProducts)
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [supplierFilter, setSupplierFilter] = useState<number | null>(null)

  const [modalMode, setModalMode] = useState<'add' | 'edit' | null>(null)
  const [editProduct, setEditProduct] = useState<Product | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null)

  const [form, setForm] = useState({ name: '', sku: '', category: 'Electronics', price: 0, quantity: 0, reorder_point: 0, supplier_id: 1, expiry_date: '' })

  useEffect(() => { getSuppliers().then(setSuppliers) }, [])

  const filtered = products.filter(p => {
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase())
    const matchCat = categoryFilter === 'All' || p.category === categoryFilter
    const matchSup = !supplierFilter || p.supplier_id === supplierFilter
    return matchSearch && matchCat && matchSup
  })

  function openAdd() {
    setForm({ name: '', sku: '', category: 'Electronics', price: 0, quantity: 0, reorder_point: 0, supplier_id: 1, expiry_date: '' })
    setModalMode('add')
  }

  function openEdit(p: Product) {
    setEditProduct(p)
    setForm({ name: p.name, sku: p.sku, category: p.category, price: p.price, quantity: p.quantity, reorder_point: p.reorder_point, supplier_id: p.supplier_id, expiry_date: p.expiry_date || '' })
    setModalMode('edit')
  }

  async function handleSave() {
    if (modalMode === 'add') {
      const created = await createProduct({ name: form.name, sku: form.sku, category: form.category, price: form.price, quantity: form.quantity, reorder_point: form.reorder_point, supplier_id: form.supplier_id, expiry_date: form.expiry_date || null })
      setProducts(prev => [...prev, created])
      const user = JSON.parse(localStorage.getItem('user') || '{}')
      await logAction(user.id || 0, user.name || '', 'Add Product', 'Product', `Added ${created.name} (${created.id})`)
    } else if (modalMode === 'edit' && editProduct) {
      const updated = await updateProduct(editProduct.id, { name: form.name, sku: form.sku, category: form.category, price: form.price, quantity: form.quantity, reorder_point: form.reorder_point, supplier_id: form.supplier_id, expiry_date: form.expiry_date || null })
      if (updated) setProducts(prev => prev.map(p => p.id === updated.id ? updated : p))
      const user = JSON.parse(localStorage.getItem('user') || '{}')
      await logAction(user.id || 0, user.name || '', 'Update Product', 'Product', `Updated ${editProduct.name} (${editProduct.id})`)
    }
    setModalMode(null)
    setEditProduct(null)
  }

  async function handleDelete() {
    if (!deleteTarget) return
    await deleteProduct(deleteTarget.id)
    setProducts(prev => prev.filter(p => p.id !== deleteTarget.id))
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    await logAction(user.id || 0, user.name || '', 'Delete Product', 'Product', `Deleted ${deleteTarget.name} (${deleteTarget.id})`)
    setDeleteTarget(null)
  }

  async function adjustStock(p: Product, delta: number) {
    const newQty = Math.max(0, p.quantity + delta)
    const updated = await updateProduct(p.id, { quantity: newQty })
    if (updated) setProducts(prev => prev.map(x => x.id === updated.id ? updated : x))
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    await logAction(user.id || 0, user.name || '', 'Update Stock', 'Product', `${delta > 0 ? 'Increased' : 'Decreased'} stock of ${p.name} from ${p.quantity} to ${newQty}`)
  }

  return (
    <>
      <div className="bg-black/50 text-white backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-white/20 mb-8 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex-1 max-w-md">
          <input type="text" placeholder="Search by name or SKU..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full bg-black/30 border border-white/30 text-white placeholder-gray-400 py-3 px-4 rounded-xl focus:outline-none focus:border-[#edde53] transition-colors" />
        </div>
        <div className="flex gap-3 flex-wrap">
          <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}
            className="bg-black/40 border border-white/20 text-sm text-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-[#edde53]">
            {categories.map(c => <option key={c} value={c} className="bg-gray-900">{c}</option>)}
          </select>
          <select value={supplierFilter ?? ''} onChange={e => setSupplierFilter(e.target.value ? Number(e.target.value) : null)}
            className="bg-black/40 border border-white/20 text-sm text-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-[#edde53]">
            <option value="" className="bg-gray-900">All Suppliers</option>
            {suppliers.map(s => <option key={s.id} value={s.id} className="bg-gray-900">{s.name}</option>)}
          </select>
          <button onClick={openAdd} className="bg-[#edde53] hover:bg-yellow-400 text-black font-bold px-4 py-2 rounded-xl transition-colors">+ Add</button>
        </div>
      </div>

      <div className="bg-black/50 text-white backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/20 text-sm text-gray-300 bg-black/30">
                <th className="px-6 py-4 font-semibold">Product</th>
                <th className="px-6 py-4 font-semibold">Category</th>
                <th className="px-6 py-4 font-semibold">Stock</th>
                <th className="px-6 py-4 font-semibold">Price</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => {
                const status = getProductStatus(p)
                return (
                  <tr key={p.id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-medium text-white">{p.name}</td>
                    <td className="px-6 py-4 text-gray-300">{p.category}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => adjustStock(p, -1)} className="w-6 h-6 flex items-center justify-center rounded bg-white/10 hover:bg-white/20 text-gray-300 text-sm transition-colors">&minus;</button>
                        <span className={`font-bold ${status === 'Low Stock' ? 'text-yellow-300' : status === 'Out of Stock' ? 'text-red-400' : 'text-white'}`}>{p.quantity}</span>
                        <button onClick={() => adjustStock(p, 1)} className="w-6 h-6 flex items-center justify-center rounded bg-white/10 hover:bg-white/20 text-gray-300 text-sm transition-colors">+</button>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-300">${p.price.toFixed(2)}</td>
                    <td className="px-6 py-4"><StatusBadge status={status} /></td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <button onClick={() => openEdit(p)} className="text-[#edde53] hover:text-yellow-300 text-sm font-medium mr-3 transition-colors">Edit</button>
                      <button onClick={() => setDeleteTarget(p)} className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors">Delete</button>
                    </td>
                  </tr>
                )
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-400">No products found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={modalMode !== null} onClose={() => { setModalMode(null); setEditProduct(null) }} title={modalMode === 'add' ? 'Add Product' : 'Edit Product'}>
        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-300 block mb-1">Name</label>
            <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
              className="w-full bg-black/30 border border-white/30 text-white placeholder-gray-400 py-2.5 px-4 rounded-xl focus:outline-none focus:border-[#edde53]" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-300 block mb-1">SKU</label>
              <input type="text" value={form.sku} onChange={e => setForm({ ...form, sku: e.target.value })}
                className="w-full bg-black/30 border border-white/30 text-white placeholder-gray-400 py-2.5 px-4 rounded-xl focus:outline-none focus:border-[#edde53]" />
            </div>
            <div>
              <label className="text-sm text-gray-300 block mb-1">Category</label>
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                className="w-full bg-black/30 border border-white/30 text-white py-2.5 px-4 rounded-xl focus:outline-none focus:border-[#edde53]">
                {categories.filter(c => c !== 'All').map(c => <option key={c} value={c} className="bg-gray-900">{c}</option>)}
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
              <label className="text-sm text-gray-300 block mb-1">Quantity</label>
              <input type="number" min="0" value={form.quantity} onChange={e => setForm({ ...form, quantity: Number(e.target.value) })}
                className="w-full bg-black/30 border border-white/30 text-white py-2.5 px-4 rounded-xl focus:outline-none focus:border-[#edde53]" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-300 block mb-1">Reorder Point</label>
              <input type="number" min="0" value={form.reorder_point} onChange={e => setForm({ ...form, reorder_point: Number(e.target.value) })}
                className="w-full bg-black/30 border border-white/30 text-white py-2.5 px-4 rounded-xl focus:outline-none focus:border-[#edde53]" />
            </div>
            <div>
              <label className="text-sm text-gray-300 block mb-1">Supplier</label>
              <select value={form.supplier_id} onChange={e => setForm({ ...form, supplier_id: Number(e.target.value) })}
                className="w-full bg-black/30 border border-white/30 text-white py-2.5 px-4 rounded-xl focus:outline-none focus:border-[#edde53]">
                {suppliers.map(s => <option key={s.id} value={s.id} className="bg-gray-900">{s.name}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="text-sm text-gray-300 block mb-1">Expiry Date <span className="text-gray-500">(optional)</span></label>
            <input type="date" value={form.expiry_date} onChange={e => setForm({ ...form, expiry_date: e.target.value })}
              className="w-full bg-black/30 border border-white/30 text-white py-2.5 px-4 rounded-xl focus:outline-none focus:border-[#edde53]" />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => { setModalMode(null); setEditProduct(null) }} className="px-4 py-2 rounded-xl font-medium text-gray-300 hover:text-white hover:bg-white/10 transition-colors">Cancel</button>
            <button onClick={handleSave} className="px-4 py-2 rounded-xl font-medium bg-[#edde53] hover:bg-yellow-400 text-black transition-colors">Save</button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Delete Product"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        danger
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  )
}
