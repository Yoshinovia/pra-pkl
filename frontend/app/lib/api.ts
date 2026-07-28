import type { Product, Supplier, StockAlert, ActivityLog, Movement, DashboardStats, User } from './types'
import { users, products, suppliers, stockAlerts, activityLogs, movements } from './data'
import type { Inventory, InventoryPayload } from './types'

function delay(ms: number = 150): Promise<void> {
  return new Promise(r => setTimeout(r, ms))
}
const BASE_URL = 'http://localhost:8080/api'
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8080'
let _products = [...products]
let _suppliers = [...suppliers]
let _alerts = [...stockAlerts]
let _logs = [...activityLogs]
let _movements = [...movements]
let _nextProductId = 1
let _nextSupplierId = 6
let _nextAlertId = 7
let _nextLogId = 16

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText)
    throw new Error(text || `Request gagal (${res.status})`)
  }
  return res.json() as Promise<T>
}

export async function getInventories(): Promise<Inventory[]> {
  const res = await fetch(`${API_BASE}/api/inventory/get`, {
    credentials: 'include',
    cache: 'no-store',
  })
  return handle<Inventory[]>(res)
}

export async function createInventory(payload: InventoryPayload): Promise<Inventory> {
  const res = await fetch(`${API_BASE}/api/inventory`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  return handle<Inventory>(res)
}

export async function updateInventory(id: number, payload: InventoryPayload): Promise<Inventory> {
  const res = await fetch(`${API_BASE}/api/inventory/update?id=${id}`, {
    method: 'PUT',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  return handle<Inventory>(res)
}

export async function deleteInventory(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/api/inventory/delete?id=${id}`, {
    method: 'DELETE',
    credentials: 'include',
  })
  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText)
    throw new Error(text || `Gagal menghapus (${res.status})`)
  }
}

export async function login(email: string, password: string): Promise<{ user: User; token: string } | null> {
  await delay(300)
  const user = users.find(u => u.email === email && u.password === password)
  if (!user) return null
  const { password: _, ...safeUser } = user
  await _log(user.id, user.name, 'Login', 'System', 'User logged in')
  return { user: safeUser as User, token: `mock-jwt-${user.id}-${user.role}` }
}

export async function getProducts(): Promise<Product[]> {
  const res = await fetch(`${BASE_URL}/inventory/get`, { cache: 'no-store' })
  if (!res.ok) throw new Error('Gagal mengambil data dari server')
  
  const rawData = await res.json()
  
  return rawData.map((item: any) => ({
    id: item.id,
    name: item.name,
    category: item.category,
    price: item.price,
    quantity: item.stock, 
    reorder_point: item.reorder_point || 0,
    supplier_id: item.supplier_id || 1,
    status: item.status
  }))
}
export async function getProduct(id: string): Promise<Product | null> {
  await delay()
  const p = _products.find(p => p.id === id)
  if (!p) return null
  return { ...p, supplier_name: _suppliers.find(s => s.id === p.supplier_id)?.name }
}

export async function createProduct(data: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product> {
  await delay(200)
  const id = `PRD-${String(_nextProductId++).padStart(3, '0')}`
  const product: Product = { ...data, id, created_at: new Date().toISOString().slice(0, 10), updated_at: new Date().toISOString().slice(0, 10) }
  _products.push(product)
  if (product.expiry_date) {
    const daysUntilExpiry = Math.ceil((new Date(product.expiry_date).getTime() - Date.now()) / 86400000)
    if (daysUntilExpiry <= 30) {
      _alerts.push({ id: _nextAlertId++, product_id: product.id, product_name: product.name, type: 'expiring_soon', current_stock: product.quantity, expiry_date: product.expiry_date, triggered_at: new Date().toISOString(), resolved: false })
    }
  }
  return { ...product, supplier_name: _suppliers.find(s => s.id === product.supplier_id)?.name }
}

export async function updateProduct(id: string, data: Partial<Product>): Promise<Product | null> {
  await delay(200)
  const idx = _products.findIndex(p => p.id === id)
  if (idx === -1) return null
  _products[idx] = { ..._products[idx], ...data, updated_at: new Date().toISOString().slice(0, 10) }
  if (data.quantity !== undefined && _products[idx].quantity <= _products[idx].reorder_point) {
    const existing = _alerts.find(a => a.product_id === id && a.type === 'low_stock' && !a.resolved)
    if (!existing) {
      _alerts.push({ id: _nextAlertId++, product_id: id, product_name: _products[idx].name, type: 'low_stock', current_stock: _products[idx].quantity, reorder_point: _products[idx].reorder_point, triggered_at: new Date().toISOString(), resolved: false })
    } else {
      existing.current_stock = _products[idx].quantity
    }
  }
  return { ..._products[idx], supplier_name: _suppliers.find(s => s.id === _products[idx].supplier_id)?.name }
}

export async function deleteProduct(id: string): Promise<boolean> {
  await delay(200)
  const idx = _products.findIndex(p => p.id === id)
  if (idx === -1) return false
  _products.splice(idx, 1)
  return true
}

export async function getSuppliers(): Promise<Supplier[]> {
  const res = await fetch(`${BASE_URL}/suppliers/get`, { cache: 'no-store' })
  if (!res.ok) throw new Error('Gagal mengambil data supplier')

  const rawData = await res.json()

  return rawData.map((item: any) => ({
    id: `SUP-${String(item.id).padStart(3, '0')}`,
    name: item.name,
    contact_person: item.contact_person,
    email: item.email,
    phone: item.phone,
    products_supplied: item.products_supplied,
    status: item.status,
  }))
}

export async function createSupplier(data: Omit<Supplier, 'id'>): Promise<Supplier> {
  const res = await fetch(`${BASE_URL}/suppliers/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    const errorText = await res.text()
    throw new Error(`Gagal membuat supplier: ${errorText}`)
  }

  const created = await res.json()
  return {
    id: created.id,  // Keep as number, not formatted string
    name: created.name,
    contact_person: created.contact_person,
    email: created.email,
    phone: created.phone,
    products_supplied: created.products_supplied,
    status: created.status,
  }
}

export async function updateSupplier(id: string, data: Omit<Supplier, 'id'>): Promise<Supplier | null> {
  const numericId = id.replace('SUP-', '').replace(/^0+/, '')

  const res = await fetch(`${BASE_URL}/suppliers/update?id=${numericId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  if (!res.ok) return null

  const updated = await res.json()
  return {
    id: updated.id,  // Keep as number, not formatted string
    name: updated.name,
    contact_person: updated.contact_person,
    email: updated.email,
    phone: updated.phone,
    products_supplied: updated.products_supplied,
    status: updated.status,
  }
}

export async function deleteSupplier(id: string): Promise<boolean> {
  const numericId = id.replace('SUP-', '').replace(/^0+/, '')
  const res = await fetch(`${BASE_URL}/suppliers/delete?id=${numericId}`, {
    method: 'DELETE',
  })
  return res.ok
}

export async function getAlerts(type?: 'low_stock' | 'expiring_soon'): Promise<StockAlert[]> {
  await delay()
  let result = _alerts.filter(a => !a.resolved)
  if (type) result = result.filter(a => a.type === type)
  return result.sort((a, b) => new Date(a.triggered_at).getTime() - new Date(b.triggered_at).getTime())
}

export async function resolveAlert(id: number): Promise<boolean> {
  await delay(200)
  const alert = _alerts.find(a => a.id === id)
  if (!alert) return false
  alert.resolved = true
  return true
}

export async function getActivityLogs(): Promise<ActivityLog[]> {
  try {
    const res = await fetch(`${API_BASE}/api/activity-logs`, {
      credentials: 'include',
      cache: 'no-store',
    })
    return handle<ActivityLog[]>(res)
  } catch {
    return []
  }
}

export async function getMovements(): Promise<Movement[]> {
  await delay()
  return _movements
}

export async function getDashboardStats(): Promise<DashboardStats> {
  await delay()
  const lowStockCount = _products.filter(p => p.quantity > 0 && p.quantity <= p.reorder_point).length
  const expiringCount = _alerts.filter(a => a.type === 'expiring_soon' && !a.resolved).length
  const recentAlerts = _alerts.filter(a => !a.resolved).sort((a, b) => new Date(b.triggered_at).getTime() - new Date(a.triggered_at).getTime()).slice(0, 5)
  return { totalProducts: _products.length, lowStockCount, expiringCount, recentAlerts }
}

export async function getUsers(): Promise<User[]> {
  const res = await fetch(`${API_BASE}/api/users`, {
    credentials: 'include',
    cache: 'no-store',
  })
  return handle<User[]>(res)
}

async function _log(userId: number, userName: string, action: string, target: string, details: string) {
  _logs.push({ id: _nextLogId++, user_id: userId, user_name: userName, action, target_entity: target, details, timestamp: new Date().toISOString() })
}

export async function logAction(userId: number, userName: string, action: string, target: string, details: string) {
  await fetch(`${API_BASE}/api/activity-logs/create`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: userId, user_name: userName, action, target_entity: target, details }),
  })
}

export async function createUser(name: string, email: string, password: string): Promise<{ id: number; message: string }> {
  const res = await fetch(`${API_BASE}/api/users/create`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password, role: 'inventory_manager' }),
  })
  return handle<{ id: number; message: string }>(res)
}
