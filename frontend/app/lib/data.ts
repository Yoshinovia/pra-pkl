import type { User, Product, Supplier, StockAlert, ActivityLog, Movement } from './types'

export const users: User[] = [
  { id: 1, name: 'Admin', email: 'admin@example.com', password: 'admin123', role: 'admin', created_at: '2026-01-15T08:00:00Z' },
  { id: 2, name: 'Budi Santoso', email: 'manager@example.com', password: 'manager123', role: 'inventory_manager', created_at: '2026-02-20T10:30:00Z' },
]

export const products: Product[] = [
  { id: 'PRD-001', name: 'Wireless Mouse', sku: 'WM-001', category: 'Electronics', price: 24.99, quantity: 128, reorder_point: 20, expiry_date: null, supplier_id: 4, created_at: '2026-01-10', updated_at: '2026-07-15' },
  { id: 'PRD-002', name: 'Mechanical Keyboard', sku: 'MK-002', category: 'Electronics', price: 89.99, quantity: 42, reorder_point: 15, expiry_date: null, supplier_id: 4, created_at: '2026-01-10', updated_at: '2026-07-14' },
  { id: 'PRD-003', name: 'USB-C Hub', sku: 'UC-003', category: 'Accessories', price: 34.50, quantity: 8, reorder_point: 15, expiry_date: null, supplier_id: 4, created_at: '2026-02-05', updated_at: '2026-07-20' },
  { id: 'PRD-004', name: 'Office Chair', sku: 'OC-004', category: 'Furniture', price: 199.00, quantity: 0, reorder_point: 5, expiry_date: null, supplier_id: 1, created_at: '2026-01-20', updated_at: '2026-07-18' },
  { id: 'PRD-005', name: 'Desk Lamp', sku: 'DL-005', category: 'Furniture', price: 18.75, quantity: 76, reorder_point: 20, expiry_date: null, supplier_id: 1, created_at: '2026-03-01', updated_at: '2026-07-19' },
  { id: 'PRD-006', name: 'Monitor Stand', sku: 'MS-006', category: 'Accessories', price: 45.00, quantity: 15, reorder_point: 25, expiry_date: null, supplier_id: 1, created_at: '2026-03-10', updated_at: '2026-07-20' },
  { id: 'BRG-12-IND', name: 'Industrial Bearings (12mm)', sku: 'BRG-12', category: 'Machinery Parts', price: 12.50, quantity: 4, reorder_point: 20, expiry_date: null, supplier_id: 2, created_at: '2026-04-01', updated_at: '2026-07-21' },
  { id: 'LUB-SYN-5L', name: 'Synthetic Lubricant 5L', sku: 'LUB-5L', category: 'Chemicals', price: 45.00, quantity: 1, reorder_point: 15, expiry_date: '2026-12-31', supplier_id: 2, created_at: '2026-04-15', updated_at: '2026-07-22' },
  { id: 'SHL-500', name: 'Shipping Labels (500pk)', sku: 'SHL-001', category: 'Supplies', price: 8.99, quantity: 200, reorder_point: 50, expiry_date: null, supplier_id: 3, created_at: '2026-05-01', updated_at: '2026-07-10' },
  { id: 'SFG-100', name: 'Safety Goggles', sku: 'SFG-001', category: 'Safety', price: 6.50, quantity: 34, reorder_point: 20, expiry_date: '2026-09-01', supplier_id: 5, created_at: '2026-05-15', updated_at: '2026-07-20' },
  { id: 'WEB-4K', name: 'HD Webcam', sku: 'WEB-001', category: 'Electronics', price: 79.99, quantity: 22, reorder_point: 10, expiry_date: null, supplier_id: 4, created_at: '2026-06-01', updated_at: '2026-07-19' },
  { id: 'MAT-001', name: 'Ergonomic Mat', sku: 'EM-001', category: 'Furniture', price: 29.99, quantity: 7, reorder_point: 15, expiry_date: '2026-08-15', supplier_id: 1, created_at: '2026-06-15', updated_at: '2026-07-22' },
]

export const suppliers: Supplier[] = [
  { id: 1, name: 'Global Parts Co.', contact_person: 'Michael Chen', email: 'm.chen@globalparts.com', phone: '+1 (555) 123-4567', products_supplied: 4, status: 'active' },
  { id: 2, name: 'Apex Fluids Ltd.', contact_person: 'Sarah Jenkins', email: 's.jenkins@apexfluids.net', phone: '+44 20 7946 0958', products_supplied: 2, status: 'active' },
  { id: 3, name: 'Old Town Packaging', contact_person: 'Robert Vance', email: 'rvance@otp.com', phone: '+1 (555) 987-6543', products_supplied: 1, status: 'inactive' },
  { id: 4, name: 'TechSource Electronics', contact_person: 'Lisa Wong', email: 'lwong@techsource.com', phone: '+1 (555) 456-7890', products_supplied: 4, status: 'active' },
  { id: 5, name: 'SafetyFirst Supplies', contact_person: 'James Rodriguez', email: 'jrodriguez@safetyfirst.com', phone: '+1 (555) 789-0123', products_supplied: 1, status: 'active' },
]

export const stockAlerts: StockAlert[] = [
  { id: 1, product_id: 'PRD-003', product_name: 'USB-C Hub', type: 'low_stock', current_stock: 8, reorder_point: 15, triggered_at: '2026-07-18T09:00:00Z', resolved: false },
  { id: 2, product_id: 'PRD-006', product_name: 'Monitor Stand', type: 'low_stock', current_stock: 15, reorder_point: 25, triggered_at: '2026-07-19T10:30:00Z', resolved: false },
  { id: 3, product_id: 'BRG-12-IND', product_name: 'Industrial Bearings (12mm)', type: 'low_stock', current_stock: 4, reorder_point: 20, triggered_at: '2026-07-20T08:15:00Z', resolved: false },
  { id: 4, product_id: 'LUB-SYN-5L', product_name: 'Synthetic Lubricant 5L', type: 'low_stock', current_stock: 1, reorder_point: 15, triggered_at: '2026-07-21T14:00:00Z', resolved: false },
  { id: 5, product_id: 'MAT-001', product_name: 'Ergonomic Mat', type: 'expiring_soon', current_stock: 7, expiry_date: '2026-08-15', triggered_at: '2026-07-22T06:00:00Z', resolved: false },
  { id: 6, product_id: 'SFG-100', product_name: 'Safety Goggles', type: 'expiring_soon', current_stock: 34, expiry_date: '2026-09-01', triggered_at: '2026-07-22T06:00:00Z', resolved: false },
]

export const activityLogs: ActivityLog[] = [
  { id: 1, user_id: 2, user_name: 'Budi Santoso', action: 'Login', target_entity: 'System', details: 'User logged in', timestamp: '2026-07-22T07:00:00Z' },
  { id: 2, user_id: 2, user_name: 'Budi Santoso', action: 'Add Product', target_entity: 'Product', details: 'Added HD Webcam (WEB-4K)', timestamp: '2026-07-22T07:15:00Z' },
  { id: 3, user_id: 2, user_name: 'Budi Santoso', action: 'Update Stock', target_entity: 'Product', details: 'Increased stock of USB-C Hub from 5 to 8', timestamp: '2026-07-22T07:30:00Z' },
  { id: 4, user_id: 2, user_name: 'Budi Santoso', action: 'Add Supplier', target_entity: 'Supplier', details: 'Added SafetyFirst Supplies', timestamp: '2026-07-21T14:00:00Z' },
  { id: 5, user_id: 2, user_name: 'Budi Santoso', action: 'Delete Product', target_entity: 'Product', details: 'Removed Printer Ink (INK-001)', timestamp: '2026-07-21T13:45:00Z' },
  { id: 6, user_id: 2, user_name: 'Budi Santoso', action: 'Update Supplier', target_entity: 'Supplier', details: 'Updated contact info for Old Town Packaging', timestamp: '2026-07-21T11:20:00Z' },
  { id: 7, user_id: 2, user_name: 'Budi Santoso', action: 'Generate Report', target_entity: 'Report', details: 'Generated stock summary report', timestamp: '2026-07-20T16:00:00Z' },
  { id: 8, user_id: 2, user_name: 'Budi Santoso', action: 'Export Data', target_entity: 'Export', details: 'Exported inventory to CSV', timestamp: '2026-07-20T15:30:00Z' },
  { id: 9, user_id: 2, user_name: 'Budi Santoso', action: 'Resolve Alert', target_entity: 'Alert', details: 'Restocked Industrial Bearings, resolved alert', timestamp: '2026-07-19T10:00:00Z' },
  { id: 10, user_id: 1, user_name: 'Admin', action: 'Create User', target_entity: 'User', details: 'Created inventory manager account for Budi Santoso', timestamp: '2026-02-20T10:30:00Z' },
  { id: 11, user_id: 1, user_name: 'Admin', action: 'View Logs', target_entity: 'System', details: 'Reviewed activity logs', timestamp: '2026-07-22T08:00:00Z' },
  { id: 12, user_id: 2, user_name: 'Budi Santoso', action: 'Batch Import', target_entity: 'Product', details: 'Imported 15 products via CSV', timestamp: '2026-07-18T09:30:00Z' },
  { id: 13, user_id: 2, user_name: 'Budi Santoso', action: 'Set Reorder Point', target_entity: 'Product', details: 'Changed reorder point for Ergonomic Mat from 10 to 15', timestamp: '2026-07-17T14:00:00Z' },
  { id: 14, user_id: 2, user_name: 'Budi Santoso', action: 'Login', target_entity: 'System', details: 'User logged in', timestamp: '2026-07-17T08:00:00Z' },
  { id: 15, user_id: 2, user_name: 'Budi Santoso', action: 'Logout', target_entity: 'System', details: 'User logged out', timestamp: '2026-07-17T17:00:00Z' },
]

export const movements: Movement[] = [
  { id: '1', productName: 'Industrial Bearings (12mm)', sku: 'BRG-12-IND', category: 'Machinery Parts', type: 'Stock In', quantity: 150, date: '2026-07-18', reference: 'PO-2026-0091' },
  { id: '2', productName: 'Synthetic Lubricant 5L', sku: 'LUB-SYN-5L', category: 'Chemicals', type: 'Stock Out', quantity: 25, date: '2026-07-19', reference: 'SO-2026-0433' },
  { id: '3', productName: 'Wireless Mouse', sku: 'PRD-001', category: 'Electronics', type: 'Stock In', quantity: 200, date: '2026-07-19', reference: 'PO-2026-0092' },
  { id: '4', productName: 'Mechanical Keyboard', sku: 'PRD-002', category: 'Electronics', type: 'Stock Out', quantity: 12, date: '2026-07-20', reference: 'SO-2026-0434' },
  { id: '5', productName: 'Office Chair', sku: 'PRD-004', category: 'Furniture', type: 'Stock Out', quantity: 5, date: '2026-07-20', reference: 'SO-2026-0435' },
  { id: '6', productName: 'USB-C Hub', sku: 'PRD-003', category: 'Accessories', type: 'Stock In', quantity: 80, date: '2026-07-21', reference: 'PO-2026-0093' },
  { id: '7', productName: 'HD Webcam', sku: 'WEB-4K', category: 'Electronics', type: 'Stock In', quantity: 50, date: '2026-07-21', reference: 'PO-2026-0094' },
  { id: '8', productName: 'Desk Lamp', sku: 'PRD-005', category: 'Furniture', type: 'Stock Out', quantity: 10, date: '2026-07-21', reference: 'SO-2026-0436' },
  { id: '9', productName: 'Safety Goggles', sku: 'SFG-100', category: 'Safety', type: 'Stock In', quantity: 100, date: '2026-07-22', reference: 'PO-2026-0095' },
  { id: '10', productName: 'Industrial Bearings (12mm)', sku: 'BRG-12-IND', category: 'Machinery Parts', type: 'Stock Out', quantity: 30, date: '2026-07-22', reference: 'SO-2026-0437' },
]
