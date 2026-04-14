export const DEMO_PRODUCTS = [
  { id: '1', name: 'Harmonie Abstraite No.3', sku: 'AW-001', category: 'Tableaux', price: 1890, stock: 5, active: true, featured: true, img: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100&q=60' },
  { id: '2', name: 'Sable d\'Or', sku: 'AW-002', category: 'Papiers Peints', price: 450, stock: 12, active: true, featured: false, img: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=100&q=60' },
  { id: '3', name: 'Forêt Éclatante', sku: 'AW-003', category: 'Tableaux', price: 2450, stock: 0, active: false, featured: true, img: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=100&q=60' },
  { id: '4', name: 'Océan de Soie', sku: 'AW-004', category: 'Nature & Botanique', price: 1200, stock: 3, active: true, featured: false, img: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=100&q=60' },
  { id: '5', name: 'Portrait Minimaliste', sku: 'AW-005', category: 'Tableaux', price: 1450, stock: 8, active: true, featured: false, img: 'https://images.unsplash.com/photo-1541123437800-1bb1317badc2?w=100&q=60' },
];

export const DEMO_ORDERS = [
  { id: 'ORD-001', customer: 'Amina Benali', email: 'amina@example.com', total: 4340, status: 'delivered', items: 2, date: '2024-11-15' },
  { id: 'ORD-002', customer: 'Youssef Alami', email: 'youssef@example.com', total: 1180, status: 'shipped', items: 1, date: '2024-12-01' },
  { id: 'ORD-003', customer: 'Fatima Zahra', email: 'fatima@example.com', total: 5890, status: 'processing', items: 3, date: '2024-12-08' },
  { id: 'ORD-004', customer: 'Karim Tahiri', email: 'karim@example.com', total: 890, status: 'pending', items: 1, date: '2024-12-10' },
  { id: 'ORD-005', customer: 'Nadia Bensouda', email: 'nadia@example.com', total: 3200, status: 'confirmed', items: 2, date: '2024-12-12' },
];

export const DEMO_CUSTOMERS = [
  { id: 'CUST-001', name: 'Amina Benali', email: 'amina@example.com', orders: 12, total: 24500, joined: '2023-05-12' },
  { id: 'CUST-002', name: 'Youssef Alami', email: 'youssef@example.com', orders: 5, total: 8900, joined: '2023-08-22' },
  { id: 'CUST-003', name: 'Fatima Zahra', email: 'fatima@example.com', orders: 2, total: 3200, joined: '2024-01-10' },
  { id: 'CUST-004', name: 'Karim Tahiri', email: 'karim@example.com', orders: 8, total: 15400, joined: '2023-11-05' },
  { id: 'CUST-005', name: 'Nadia Bensouda', email: 'nadia@example.com', orders: 15, total: 32100, joined: '2023-04-18' },
];
