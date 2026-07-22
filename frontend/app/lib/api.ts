import type { Product, Supplier, StockAlert, ActivityLog, Movement, DashboardStats, User } from './types'
import { users, products, suppliers, stockAlerts, activityLogs, movements } from './data'

function delay(ms: number = 150): Promise<void> {
  return new Promise(r => setTimeout(r, ms))
}

let _products = [...products]
let _suppliers = [...suppliers]
let _alerts = [...stockAlerts]
let _logs = [...activityLogs]
let _movements = [...movements]
let _nextProductId = 1
let _nextSupplierId = 6
let _nextAlertId = 7
let _nextLogId = 16

export async function login(email: string, password: string): Promise<{ user: User; token: string } | null> {
  await delay(300)
  const user = users.find(u => u.email === email && u.password === password)
  if (!user) return null
  const { password: _, ...safeUser } = user
  await _log(user.id, user.name, 'Login', 'System', 'User logged in')
  return { user: safeUser as User, token: `mock-jwt-${user.id}-${user.role}` }
}

export async function getProducts(search?: string, category?: string, supplierId?: number): Promise<Product[]> {
  await delay()
  let result = [..._products]
  if (search) {
    const q = search.toLowerCase()
    result = result.filter(p => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q) || p.category.toLowerCase().includes(q))
  }
  if (category && category !== 'All') result = result.filter(p => p.category === category)
  if (supplierId) result = result.filter(p => p.supplier_id === supplierId)
  return result.map(p => ({ ...p, supplier_name: _suppliers.find(s => s.id === p.supplier_id)?.name }))
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

export async function getSuppliers(search?: string, status?: string): Promise<Supplier[]> {
  await delay()
  let result = [..._suppliers]
  if (search) {
    const q = search.toLowerCase()
    result = result.filter(s => s.name.toLowerCase().includes(q) || s.contact_person.toLowerCase().includes(q))
  }
  if (status && status !== 'All') result = result.filter(s => s.status === status)
  return result
}

export async function getSupplier(id: number): Promise<Supplier | null> {
  await delay()
  return _suppliers.find(s => s.id === id) || null
}

export async function createSupplier(data: Omit<Supplier, 'id'>): Promise<Supplier> {
  await delay(200)
  const supplier: Supplier = { ...data, id: _nextSupplierId++ }
  _suppliers.push(supplier)
  return supplier
}

export async function updateSupplier(id: number, data: Partial<Supplier>): Promise<Supplier | null> {
  await delay(200)
  const idx = _suppliers.findIndex(s => s.id === id)
  if (idx === -1) return null
  _suppliers[idx] = { ..._suppliers[idx], ...data }
  return _suppliers[idx]
}

export async function deleteSupplier(id: number): Promise<boolean> {
  await delay(200)
  const idx = _suppliers.findIndex(s => s.id === id)
  if (idx === -1) return false
  _suppliers.splice(idx, 1)
  const linkedProducts = _products.filter(p => p.supplier_id === id)
  for (const p of linkedProducts) {
    const existingAlert = _alerts.find(a => a.product_id === p.id && !a.resolved)
    if (existingAlert) existingAlert.resolved = true
  }
  return true
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
  await delay()
  return [..._logs].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
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
  await delay()
  return users
}

async function _log(userId: number, userName: string, action: string, target: string, details: string) {
  _logs.push({ id: _nextLogId++, user_id: userId, user_name: userName, action, target_entity: target, details, timestamp: new Date().toISOString() })
}

export async function logAction(userId: number, userName: string, action: string, target: string, details: string) {
  await _log(userId, userName, action, target, details)
}
