export interface User {
  id: number
  name: string
  email: string
  password: string
  role: 'admin' | 'inventory_manager'
  created_at: string
}

export interface Product {
  id: string
  name: string
  sku: string
  category: string
  price: number
  quantity: number
  reorder_point: number
  expiry_date: string | null
  supplier_id: number
  supplier_name?: string
  created_at: string
  updated_at: string
}

export interface Supplier {
  id: number
  name: string
  contact_person: string
  email: string
  phone: string
  products_supplied: number
  status: 'active' | 'inactive'
}
export interface Inventory {
  id: number
  name: string
  category: string
  stock: number
  price: number
  status: string
}


export interface InventoryPayload {
  name?: string
  category?: string
  stock?: number
  price?: number
  status?: string
}

// Threshold stok rendah murni untuk tampilan (backend tidak punya reorder_point).
const LOW_STOCK_THRESHOLD = 10

export type StockLevel = 'Out of Stock' | 'Low Stock' | 'In Stock'

export function getStockLevel(item: Inventory): StockLevel {
  if (item.stock <= 0) return 'Out of Stock'
  if (item.stock < LOW_STOCK_THRESHOLD) return 'Low Stock'
  return 'In Stock'
}

export interface StockAlert {
  id: number
  product_id: string
  product_name: string
  type: 'low_stock' | 'expiring_soon'
  current_stock?: number
  reorder_point?: number
  expiry_date?: string
  triggered_at: string
  resolved: boolean
}

export interface ActivityLog {
  id: number
  user_id: number
  user_name: string
  action: string
  target_entity: string
  details: string
  timestamp: string
}

export interface Movement {
  id: string
  productName: string
  category: string
  type: 'Stock In' | 'Stock Out'
  quantity: number
  date: string
  reference: string
}

export interface DashboardStats {
  totalProducts: number
  lowStockCount: number
  expiringCount: number
  recentAlerts: StockAlert[]
}

export function getProductStatus(product: Product): string {
  if (product.quantity <= 0) return 'Out of Stock'
  if (product.quantity <= product.reorder_point) return 'Low Stock'
  return 'In Stock'
}
