'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  LayoutDashboard,
  Receipt,
  Package,
  Users,
  BarChart3,
  Settings,
  Plus,
  Search,
  Bell,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  Sun,
  Moon,
  TrendingUp,
  TrendingDown,
  Filter,
  MoreVertical,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Building2,
  Download,
  RefreshCw,
  FileText,
  Lock,
  ArrowUpDown,
  X,
  PlusCircle,
  FolderMinus,
  Check,
  Briefcase
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

// --- TS Types ---
interface Invoice {
  id: string;
  customer: string;
  email: string;
  date: string;
  dueDate: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  category: 'Sales' | 'Consulting' | 'Subscriptions' | 'Hardware';
}

interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  stock: number;
  minStock: number;
  price: number;
  cost: number;
}

interface Customer {
  id: string;
  name: string;
  email: string;
  company: string;
  totalBilled: number;
  outstanding: number;
  status: 'active' | 'inactive';
}

// --- Mock Data ---
const initialInvoices: Invoice[] = [
  { id: 'INV-2026-001', customer: 'Acme Corporation', email: 'billing@acme.com', date: '2026-06-12', dueDate: '2026-07-12', amount: 12450.00, status: 'paid', category: 'Consulting' },
  { id: 'INV-2026-002', customer: 'Globex Industries', email: 'accounting@globex.com', date: '2026-06-18', dueDate: '2026-07-18', amount: 8200.00, status: 'pending', category: 'Sales' },
  { id: 'INV-2026-003', customer: 'Stark Industries', email: 'pepper@stark.com', date: '2026-05-28', dueDate: '2026-06-28', amount: 15900.00, status: 'overdue', category: 'Hardware' },
  { id: 'INV-2026-004', customer: 'Wayne Enterprises', email: 'accounts@wayne.com', date: '2026-06-20', dueDate: '2026-07-20', amount: 6300.00, status: 'paid', category: 'Subscriptions' },
  { id: 'INV-2026-005', customer: 'Initech LLC', email: 'lumbergh@initech.com', date: '2026-06-25', dueDate: '2026-07-25', amount: 2450.00, status: 'pending', category: 'Sales' },
  { id: 'INV-2026-006', customer: 'Umbrella Corp', email: 'finance@umbrella.com', date: '2026-06-05', dueDate: '2026-07-05', amount: 24000.00, status: 'paid', category: 'Hardware' },
  { id: 'INV-2026-007', customer: 'Tyrell Corporation', email: 'rachael@tyrell.com', date: '2026-06-22', dueDate: '2026-07-22', amount: 18500.00, status: 'pending', category: 'Consulting' },
  { id: 'INV-2026-008', customer: 'Cyberdyne Systems', email: 'dyson@cyberdyne.com', date: '2026-05-15', dueDate: '2026-06-15', amount: 9800.00, status: 'overdue', category: 'Sales' },
  { id: 'INV-2026-009', customer: 'Hooli Inc', email: 'gavin@hooli.xyz', date: '2026-06-24', dueDate: '2026-07-24', amount: 4120.00, status: 'paid', category: 'Subscriptions' },
  { id: 'INV-2026-010', customer: 'Virtucon Group', email: 'numbertwo@virtucon.net', date: '2026-06-27', dueDate: '2026-07-27', amount: 7340.00, status: 'paid', category: 'Sales' },
];

const initialProducts: Product[] = [
  { id: 'PROD-001', name: 'Premium Ergonomic Office Chair', sku: 'FUR-CH-01', category: 'Furniture', stock: 42, minStock: 15, price: 299.00, cost: 140.00 },
  { id: 'PROD-002', name: 'UltraWide 34" Curved Monitor', sku: 'ELE-MN-34', category: 'Electronics', stock: 8, minStock: 10, price: 699.00, cost: 420.00 },
  { id: 'PROD-003', name: 'Wireless Mechanical Keyboard', sku: 'ACC-KB-99', category: 'Accessories', stock: 65, minStock: 20, price: 129.00, cost: 60.00 },
  { id: 'PROD-004', name: 'Height Adjustable Sit-Stand Desk', sku: 'FUR-DS-05', category: 'Furniture', stock: 12, minStock: 10, price: 499.00, cost: 250.00 },
  { id: 'PROD-005', name: 'USB-C Multi-Port Docking Station', sku: 'ACC-DK-12', category: 'Accessories', stock: 4, minStock: 12, price: 89.00, cost: 40.00 },
  { id: 'PROD-006', name: 'Active Noise Cancelling Headphones', sku: 'ELE-HP-08', category: 'Electronics', stock: 28, minStock: 15, price: 349.00, cost: 180.00 },
];

const initialCustomers: Customer[] = [
  { id: 'CUST-001', name: 'John Doe', email: 'billing@acme.com', company: 'Acme Corporation', totalBilled: 12450.00, outstanding: 0.00, status: 'active' },
  { id: 'CUST-002', name: 'Sarah Connor', email: 'accounting@globex.com', company: 'Globex Industries', totalBilled: 8200.00, outstanding: 8200.00, status: 'active' },
  { id: 'CUST-003', name: 'Tony Stark', email: 'pepper@stark.com', company: 'Stark Industries', totalBilled: 31800.00, outstanding: 15900.00, status: 'active' },
  { id: 'CUST-004', name: 'Bruce Wayne', email: 'accounts@wayne.com', company: 'Wayne Enterprises', totalBilled: 18600.00, outstanding: 0.00, status: 'active' },
  { id: 'CUST-005', name: 'Peter Gibbons', email: 'lumbergh@initech.com', company: 'Initech LLC', totalBilled: 2450.00, outstanding: 2450.00, status: 'active' },
  { id: 'CUST-006', name: 'Eldon Tyrell', email: 'rachael@tyrell.com', company: 'Tyrell Corporation', totalBilled: 18500.00, outstanding: 18500.00, status: 'active' },
  { id: 'CUST-007', name: 'Miles Dyson', email: 'dyson@cyberdyne.com', company: 'Cyberdyne Systems', totalBilled: 9800.00, outstanding: 9800.00, status: 'inactive' },
];

// Financial metrics chart data
const chartData = [
  { month: 'Jan', Revenue: 45000, Expenses: 32000, Profit: 13000 },
  { month: 'Feb', Revenue: 52000, Expenses: 34000, Profit: 18000 },
  { month: 'Mar', Revenue: 49000, Expenses: 36000, Profit: 13000 },
  { month: 'Apr', Revenue: 63000, Expenses: 41000, Profit: 22000 },
  { month: 'May', Revenue: 58000, Expenses: 39000, Profit: 19000 },
  { month: 'Jun', Revenue: 71000, Expenses: 43000, Profit: 28000 },
];

const categoryPieData = [
  { name: 'Hardware', value: 39900, color: '#2563EB' },
  { name: 'Sales', value: 25340, color: '#16A34A' },
  { name: 'Consulting', value: 30950, color: '#D97706' },
  { name: 'Subscriptions', value: 10420, color: '#8B5CF6' },
];

export default function SmartERPPage() {
  // --- Local Theme and Responsive States ---
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'invoices' | 'inventory' | 'customers' | 'reports' | 'settings'>('dashboard');
  const [selectedCompany, setSelectedCompany] = useState('Acme Corporation');
  const [companyDropdownOpen, setCompanyDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  // --- Core CRUD States ---
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);

  // --- Dynamic UI State ---
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showToast, setShowToast] = useState<{ visible: boolean; message: string; type: 'success' | 'info' | 'error' }>({ visible: false, message: '', type: 'success' });

  // --- Table Interaction States (Invoices Tab) ---
  const [invoiceFilterStatus, setInvoiceFilterStatus] = useState<string>('all');
  const [invoiceSortField, setInvoiceSortField] = useState<keyof Invoice>('date');
  const [invoiceSortOrder, setInvoiceSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedInvoiceIds, setSelectedInvoiceIds] = useState<string[]>([]);
  const [invoicePage, setInvoicePage] = useState(1);
  const invoicePageSize = 6;

  // --- Table Interaction States (Products Tab) ---
  const [productSearch, setProductSearch] = useState('');
  const [productStockFilter, setProductStockFilter] = useState<'all' | 'low'>('all');

  // --- Modals ---
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  // --- Create Invoice Form State ---
  const [newInvoice, setNewInvoice] = useState({
    customer: '',
    email: '',
    date: new Date().toISOString().split('T')[0],
    dueDate: '',
    amount: '',
    category: 'Sales' as Invoice['category'],
    status: 'pending' as Invoice['status']
  });
  const [invoiceFormErrors, setInvoiceFormErrors] = useState<{ [key: string]: string }>({});

  // --- Create Product Form State ---
  const [newProduct, setNewProduct] = useState({
    name: '',
    sku: '',
    category: 'Furniture',
    stock: '',
    minStock: '',
    price: '',
    cost: ''
  });
  const [productFormErrors, setProductFormErrors] = useState<{ [key: string]: string }>({});

  // --- Settings Form State ---
  const [settingsForm, setSettingsForm] = useState({
    companyName: 'Acme Corporation',
    taxId: 'TX-9988221-A',
    currency: 'USD',
    invoicePrefix: 'INV-2026-',
    emailAlerts: true,
    fiscalYearStart: '01-01'
  });

  // --- System notifications mock ---
  const mockNotifications = [
    { id: 1, text: 'Invoice INV-2026-003 is overdue by 12 days', type: 'error', read: false },
    { id: 2, text: 'Product PROD-005 (USB-C Dock) reached low stock threshold', type: 'warning', read: false },
    { id: 3, text: 'Received payment of $6,300.00 from Wayne Enterprises', type: 'success', read: true },
  ];

  // Prevent SSR mismatch on Recharts
  useEffect(() => {
    setMounted(true);
    // Load theme setting
    if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined' && typeof window.localStorage.getItem === 'function') {
      const savedTheme = window.localStorage.getItem('smarterp-theme');
      if (savedTheme === 'dark') {
        setTheme('dark');
      }
    }
  }, []);

  // Sync theme to localStorage
  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined' && typeof window.localStorage.setItem === 'function') {
      window.localStorage.setItem('smarterp-theme', nextTheme);
    }
    triggerToast(`Switched to ${nextTheme} theme`, 'info');
  };

  // Keyboard Shortcuts Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // CMD/Ctrl + K to focus search
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      // Esc to close active modals
      if (e.key === 'Escape') {
        setIsInvoiceModalOpen(false);
        setIsProductModalOpen(false);
        setCompanyDropdownOpen(false);
        setProfileDropdownOpen(false);
        setNotificationsOpen(false);
      }
      // 'N' key when not focused in input/textarea to open Create Invoice
      if (e.key === 'n' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        if (activeTab === 'inventory') {
          setIsProductModalOpen(true);
        } else {
          setIsInvoiceModalOpen(true);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTab]);

  // Toast helper
  const triggerToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setShowToast({ visible: true, message, type });
    setTimeout(() => {
      setShowToast(prev => ({ ...prev, visible: false }));
    }, 3000);
  };

  // Simulated Loading Skeleton Refresh Action
  const triggerRefresh = () => {
    setLoading(true);
    triggerToast('Fetching latest financial ledger...', 'info');
    setTimeout(() => {
      setLoading(false);
      triggerToast('ERP metrics fully synchronized', 'success');
    }, 850);
  };

  // --- Financial Calculations (Memoized) ---
  const financialTotals = useMemo(() => {
    let revenue = 0;
    let pending = 0;
    let overdue = 0;
    
    invoices.forEach(inv => {
      if (inv.status === 'paid') {
        revenue += inv.amount;
      } else if (inv.status === 'pending') {
        pending += inv.amount;
      } else if (inv.status === 'overdue') {
        overdue += inv.amount;
      }
    });

    const inventoryValue = products.reduce((acc, p) => acc + (p.stock * p.cost), 0);
    const totalSalesCount = invoices.length;

    return {
      revenue,
      pending,
      overdue,
      inventoryValue,
      totalSalesCount
    };
  }, [invoices, products]);

  // --- Invoices Table Filter & Sort & Pagination Logic ---
  const sortedAndFilteredInvoices = useMemo(() => {
    let result = [...invoices];

    // Status filtering
    if (invoiceFilterStatus !== 'all') {
      result = result.filter(inv => inv.status === invoiceFilterStatus);
    }

    // Search query filtering
    if (globalSearch.trim() !== '') {
      const query = globalSearch.toLowerCase();
      result = result.filter(inv => 
        inv.id.toLowerCase().includes(query) ||
        inv.customer.toLowerCase().includes(query) ||
        inv.category.toLowerCase().includes(query) ||
        inv.amount.toString().includes(query)
      );
    }

    // Sorting
    result.sort((a, b) => {
      let aVal = a[invoiceSortField];
      let bVal = b[invoiceSortField];

      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = (bVal as string).toLowerCase();
      }

      if (aVal < bVal) return invoiceSortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return invoiceSortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [invoices, invoiceFilterStatus, globalSearch, invoiceSortField, invoiceSortOrder]);

  const paginatedInvoices = useMemo(() => {
    const startIndex = (invoicePage - 1) * invoicePageSize;
    return sortedAndFilteredInvoices.slice(startIndex, startIndex + invoicePageSize);
  }, [sortedAndFilteredInvoices, invoicePage]);

  const totalInvoicePages = Math.ceil(sortedAndFilteredInvoices.length / invoicePageSize) || 1;

  // Reset page when filters change
  useEffect(() => {
    setInvoicePage(1);
  }, [invoiceFilterStatus, globalSearch]);

  const handleInvoiceSort = (field: keyof Invoice) => {
    if (invoiceSortField === field) {
      setInvoiceSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setInvoiceSortField(field);
      setInvoiceSortOrder('desc');
    }
  };

  // --- Products Table Filter Logic ---
  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (productStockFilter === 'low') {
      result = result.filter(p => p.stock <= p.minStock);
    }

    if (globalSearch.trim() !== '') {
      const query = globalSearch.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.sku.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
      );
    }

    return result;
  }, [products, productStockFilter, globalSearch]);

  // Stock Alarms for Dashboard
  const stockAlarms = useMemo(() => {
    return products.filter(p => p.stock <= p.minStock);
  }, [products]);

  // --- Handlers for Creation Modals ---
  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: { [key: string]: string } = {};

    if (!newInvoice.customer.trim()) errors.customer = 'Company name is required';
    if (!newInvoice.email.trim() || !newInvoice.email.includes('@')) errors.email = 'Valid billing email is required';
    if (!newInvoice.dueDate) errors.dueDate = 'Due date is required';
    if (!newInvoice.amount || isNaN(Number(newInvoice.amount)) || Number(newInvoice.amount) <= 0) {
      errors.amount = 'Valid positive invoice amount is required';
    }

    if (Object.keys(errors).length > 0) {
      setInvoiceFormErrors(errors);
      triggerToast('Please correct form errors before saving.', 'error');
      return;
    }

    const created: Invoice = {
      id: `${settingsForm.invoicePrefix}${String(invoices.length + 1).padStart(3, '0')}`,
      customer: newInvoice.customer,
      email: newInvoice.email,
      date: newInvoice.date,
      dueDate: newInvoice.dueDate,
      amount: Number(newInvoice.amount),
      status: newInvoice.status,
      category: newInvoice.category
    };

    setInvoices([created, ...invoices]);
    
    // Add to CRM customer index if new
    if (!customers.some(c => c.company.toLowerCase() === created.customer.toLowerCase())) {
      const newCust: Customer = {
        id: `CUST-0${customers.length + 1}`,
        name: created.customer.split(' ')[0] + ' Billing',
        email: created.email,
        company: created.customer,
        totalBilled: created.amount,
        outstanding: created.status !== 'paid' ? created.amount : 0,
        status: 'active'
      };
      setCustomers([...customers, newCust]);
    } else {
      // Update existing customer totals
      setCustomers(prev => prev.map(c => {
        if (c.company.toLowerCase() === created.customer.toLowerCase()) {
          return {
            ...c,
            totalBilled: c.totalBilled + created.amount,
            outstanding: c.outstanding + (created.status !== 'paid' ? created.amount : 0)
          };
        }
        return c;
      }));
    }

    setIsInvoiceModalOpen(false);
    triggerToast(`Invoice ${created.id} generated successfully`, 'success');
    // Reset form
    setNewInvoice({
      customer: '',
      email: '',
      date: new Date().toISOString().split('T')[0],
      dueDate: '',
      amount: '',
      category: 'Sales',
      status: 'pending'
    });
    setInvoiceFormErrors({});
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: { [key: string]: string } = {};

    if (!newProduct.name.trim()) errors.name = 'Product name is required';
    if (!newProduct.sku.trim()) errors.sku = 'SKU identifier is required';
    if (newProduct.stock === '' || isNaN(Number(newProduct.stock)) || Number(newProduct.stock) < 0) {
      errors.stock = 'Invalid stock value';
    }
    if (newProduct.minStock === '' || isNaN(Number(newProduct.minStock)) || Number(newProduct.minStock) < 0) {
      errors.minStock = 'Invalid stock limit';
    }
    if (!newProduct.price || isNaN(Number(newProduct.price)) || Number(newProduct.price) <= 0) {
      errors.price = 'Invalid retail price';
    }
    if (!newProduct.cost || isNaN(Number(newProduct.cost)) || Number(newProduct.cost) <= 0) {
      errors.cost = 'Invalid wholesale cost';
    }

    if (Object.keys(errors).length > 0) {
      setProductFormErrors(errors);
      triggerToast('Please correct form errors.', 'error');
      return;
    }

    const created: Product = {
      id: `PROD-${String(products.length + 1).padStart(3, '0')}`,
      name: newProduct.name,
      sku: newProduct.sku.toUpperCase(),
      category: newProduct.category,
      stock: Number(newProduct.stock),
      minStock: Number(newProduct.minStock),
      price: Number(newProduct.price),
      cost: Number(newProduct.cost)
    };

    setProducts([created, ...products]);
    setIsProductModalOpen(false);
    triggerToast(`${created.name} added to catalog`, 'success');
    setNewProduct({
      name: '',
      sku: '',
      category: 'Furniture',
      stock: '',
      minStock: '',
      price: '',
      cost: ''
    });
    setProductFormErrors({});
  };

  // Bulk Actions
  const handleBulkMarkPaid = () => {
    if (selectedInvoiceIds.length === 0) return;
    setInvoices(prev => prev.map(inv => 
      selectedInvoiceIds.includes(inv.id) ? { ...inv, status: 'paid' } : inv
    ));
    // Clear outstanding charges on customer metrics
    const listToUpdate = invoices.filter(inv => selectedInvoiceIds.includes(inv.id) && inv.status !== 'paid');
    listToUpdate.forEach(inv => {
      setCustomers(prev => prev.map(c => {
        if (c.company.toLowerCase() === inv.customer.toLowerCase()) {
          return { ...c, outstanding: Math.max(0, c.outstanding - inv.amount) };
        }
        return c;
      }));
    });

    triggerToast(`Marked ${selectedInvoiceIds.length} invoices as Paid`, 'success');
    setSelectedInvoiceIds([]);
  };

  const handleBulkDelete = () => {
    if (selectedInvoiceIds.length === 0) return;
    setInvoices(prev => prev.filter(inv => !selectedInvoiceIds.includes(inv.id)));
    triggerToast(`Archived ${selectedInvoiceIds.length} invoices`, 'info');
    setSelectedInvoiceIds([]);
  };

  const handleToggleSelectAllInvoices = () => {
    const pageIds = paginatedInvoices.map(inv => inv.id);
    const allSelected = pageIds.every(id => selectedInvoiceIds.includes(id));
    
    if (allSelected) {
      setSelectedInvoiceIds(prev => prev.filter(id => !pageIds.includes(id)));
    } else {
      setSelectedInvoiceIds(prev => [...new Set([...prev, ...pageIds])]);
    }
  };

  const handleToggleSelectInvoice = (id: string) => {
    setSelectedInvoiceIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  // Currency Formatter
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: settingsForm.currency,
      minimumFractionDigits: 2
    }).format(val);
  };

  // Settings Save
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSelectedCompany(settingsForm.companyName);
    triggerToast('Company profiles and settings fully saved', 'success');
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      theme === 'dark' ? 'bg-[#0B0F19] text-[#E5E7EB] dark' : 'bg-[#F8FAFC] text-[#334155]'
    }`}>
      {/* Dynamic Toast System */}
      <div className={`fixed top-5 right-5 z-[100] max-w-sm rounded-lg border p-4 shadow-lg flex items-start gap-3 transition-all duration-300 ${
        showToast.visible ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0 pointer-events-none'
      } ${
        theme === 'dark'
          ? 'bg-[#111827] border-[#1F2937] text-white'
          : 'bg-white border-[#E2E8F0] text-[#0F172A]'
      }`}>
        {showToast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-[#16A34A] shrink-0 mt-0.5" />}
        {showToast.type === 'info' && <Bell className="w-5 h-5 text-[#2563EB] shrink-0 mt-0.5" />}
        {showToast.type === 'error' && <AlertCircle className="w-5 h-5 text-[#DC2626] shrink-0 mt-0.5" />}
        <div>
          <h4 className="text-sm font-semibold">
            {showToast.type === 'success' ? 'Operation Success' : showToast.type === 'error' ? 'Attention Required' : 'ERP Notification'}
          </h4>
          <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            {showToast.message}
          </p>
        </div>
      </div>

      {/* Main SaaS Wrapper */}
      <div className="flex h-screen overflow-hidden">
        
        {/* ================= LEFT SIDEBAR ================= */}
        <aside className={`h-full border-r shrink-0 flex flex-col justify-between transition-all duration-300 z-30 ${
          sidebarOpen ? 'w-64' : 'w-20'
        } ${
          theme === 'dark' ? 'bg-[#111827] border-[#1F2937]' : 'bg-white border-[#E2E8F0]'
        }`}>
          {/* Logo Brand Header */}
          <div>
            <div className={`h-16 flex items-center px-5 gap-3 border-b ${
              theme === 'dark' ? 'border-[#1F2937]' : 'border-[#E2E8F0]'
            }`}>
              <div className="w-8 h-8 rounded-lg bg-[#2563EB] flex items-center justify-center text-white font-bold shrink-0">
                S
              </div>
              {sidebarOpen && (
                <div className="flex flex-col">
                  <span className={`text-sm font-bold tracking-tight leading-none ${theme === 'dark' ? 'text-white' : 'text-[#0F172A]'}`}>
                    SmartERP
                  </span>
                  <span className="text-[10px] text-[#64748B] mt-1 font-mono">v1.2.6</span>
                </div>
              )}
            </div>

            {/* Nav Menu */}
            <nav className="p-3 space-y-1">
              {[
                { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
                { id: 'invoices', label: 'Invoices & Ledger', icon: Receipt },
                { id: 'inventory', label: 'Inventory Catalog', icon: Package },
                { id: 'customers', label: 'Customer CRM', icon: Users },
                { id: 'reports', label: 'Reports & Analytics', icon: BarChart3 },
                { id: 'settings', label: 'Portal Settings', icon: Settings },
              ].map(item => {
                const IconComponent = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id as any);
                      setGlobalSearch('');
                    }}
                    className={`w-full flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 group relative ${
                      isActive
                        ? theme === 'dark'
                          ? 'bg-[#1F2937] text-white'
                          : 'bg-[#F5F7FA] text-[#2563EB]'
                        : theme === 'dark'
                          ? 'text-gray-400 hover:text-white hover:bg-[#16E1F] hover:bg-opacity-5'
                          : 'text-[#64748B] hover:text-[#0F172A] hover:bg-[#F5F7FA]'
                    }`}
                  >
                    {/* Active Left Indicator */}
                    {isActive && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r bg-[#2563EB]" />
                    )}

                    <IconComponent className={`w-5 h-5 shrink-0 ${
                      isActive ? 'text-[#2563EB]' : 'text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300'
                    } ${sidebarOpen ? 'mr-3' : 'mx-auto'}`} />

                    {sidebarOpen && (
                      <span className="truncate">{item.label}</span>
                    )}

                    {/* Low Stock Indicator count */}
                    {item.id === 'inventory' && stockAlarms.length > 0 && sidebarOpen && (
                      <span className="ml-auto bg-[#DC2626] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                        {stockAlarms.length}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Collapsible toggle / footer guide */}
          <div className={`p-4 border-t ${theme === 'dark' ? 'border-[#1F2937]' : 'border-[#E2E8F0]'}`}>
            {sidebarOpen && (
              <div className={`p-3 rounded-lg text-xs leading-relaxed mb-3 ${theme === 'dark' ? 'bg-[#161E2E] text-gray-400' : 'bg-[#F1F5F9] text-gray-500'}`}>
                <div className="font-semibold mb-1 flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
                  <Briefcase className="w-3.5 h-3.5" />
                  Keyboard Shortcuts
                </div>
                <div className="space-y-1 mt-1 font-mono text-[10px]">
                  <div><span className="border px-1 rounded dark:bg-gray-800">Ctrl+K</span> focus search</div>
                  <div><span className="border px-1 rounded dark:bg-gray-800">N</span> create new record</div>
                  <div><span className="border px-1 rounded dark:bg-gray-800">Esc</span> close dialogue</div>
                </div>
              </div>
            )}

            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className={`w-full flex items-center justify-center p-2 rounded-lg border transition-all duration-200 ${
                theme === 'dark'
                  ? 'bg-[#1F2937] hover:bg-[#2D3748] border-[#374151] text-gray-300'
                  : 'bg-white hover:bg-gray-50 border-[#E2E8F0] text-gray-600'
              }`}
            >
              {sidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
          </div>
        </aside>

        {/* ================= MAIN CONTENT SPACE ================= */}
        <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          
          {/* ================= TOP NAVIGATION BAR ================= */}
          <header className={`h-16 shrink-0 border-b flex items-center justify-between px-6 sticky top-0 z-20 ${
            theme === 'dark' ? 'bg-[#111827] border-[#1F2937]' : 'bg-white border-[#E2E8F0]'
          }`}>
            
            {/* Left side: Company Selector & Search */}
            <div className="flex items-center gap-6">
              {/* Company Selector Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setCompanyDropdownOpen(!companyDropdownOpen)}
                  className={`flex items-center gap-2 text-sm font-semibold rounded-md px-3 py-1.5 transition-all duration-150 ${
                    theme === 'dark' ? 'hover:bg-[#1F2937] text-white' : 'hover:bg-[#F5F7FA] text-[#0F172A]'
                  }`}
                >
                  <Building2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>{selectedCompany}</span>
                  <ChevronsUpDown className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                </button>

                {companyDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setCompanyDropdownOpen(false)} />
                    <div className={`absolute left-0 mt-2 w-56 rounded-lg border shadow-xl z-50 p-1.5 focus:outline-none ${
                      theme === 'dark' ? 'bg-[#111827] border-[#1F2937] text-gray-300' : 'bg-white border-[#E2E8F0] text-[#334155]'
                    }`}>
                      <div className="px-3 py-2 text-xs font-semibold text-gray-400 border-b dark:border-gray-800 mb-1">
                        Select Ledger Group
                      </div>
                      {['Acme Corporation', 'Globex Industries', 'Stark Industries', 'Wayne Enterprises'].map(name => (
                        <button
                          key={name}
                          onClick={() => {
                            setSelectedCompany(name);
                            setSettingsForm(prev => ({ ...prev, companyName: name }));
                            setCompanyDropdownOpen(false);
                            triggerToast(`Switched ledger to ${name}`, 'info');
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-md text-left transition-colors duration-150 ${
                            selectedCompany === name
                              ? 'bg-blue-50 dark:bg-blue-900/20 text-[#2563EB] font-medium'
                              : theme === 'dark'
                                ? 'hover:bg-[#1F2937] hover:text-white'
                                : 'hover:bg-[#F5F7FA] hover:text-[#0F172A]'
                          }`}
                        >
                          <span>{name}</span>
                          {selectedCompany === name && <Check className="w-4 h-4" />}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* General Search Input */}
              <div className="relative w-64 md:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder={
                    activeTab === 'invoices' ? "Search client, ID, status (Ctrl+K)..." :
                    activeTab === 'inventory' ? "Search catalog SKU, names..." :
                    activeTab === 'customers' ? "Search customer CRM..." : "Search ledgers, tools..."
                  }
                  value={globalSearch}
                  onChange={(e) => setGlobalSearch(e.target.value)}
                  className={`w-full pl-9 pr-4 py-1.5 text-sm rounded-lg border transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] ${
                    theme === 'dark'
                      ? 'bg-[#1F2937] border-[#374151] text-white placeholder-gray-500'
                      : 'bg-white border-[#E2E8F0] text-[#0F172A] placeholder-gray-400'
                  }`}
                />
                {globalSearch && (
                  <button 
                    onClick={() => setGlobalSearch('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Right side: Sync tool, Alerts, Theme, Profile */}
            <div className="flex items-center gap-4">
              {/* Force data synchronize spinner */}
              <button
                onClick={triggerRefresh}
                className={`p-2 rounded-lg border transition-all duration-200 hover:scale-[1.03] ${
                  loading ? 'animate-spin text-[#2563EB]' : 'text-gray-400 hover:text-gray-600'
                } ${
                  theme === 'dark' ? 'bg-[#1F2937] border-[#374151]' : 'bg-white border-[#E2E8F0]'
                }`}
                title="Synchronize ERP Database"
              >
                <RefreshCw className="w-4 h-4" />
              </button>

              {/* Notification Alerts Center */}
              <div className="relative">
                <button
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className={`p-2 rounded-lg border relative transition-all duration-200 ${
                    theme === 'dark'
                      ? 'bg-[#1F2937] border-[#374151] text-gray-300 hover:text-white'
                      : 'bg-white border-[#E2E8F0] text-gray-600 hover:text-[#0F172A]'
                  }`}
                >
                  <Bell className="w-4 h-4" />
                  {mockNotifications.some(n => !n.read) && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#DC2626]" />
                  )}
                </button>

                {notificationsOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setNotificationsOpen(false)} />
                    <div className={`absolute right-0 mt-2 w-80 rounded-lg border shadow-xl z-50 p-2 focus:outline-none ${
                      theme === 'dark' ? 'bg-[#111827] border-[#1F2937] text-gray-300' : 'bg-white border-[#E2E8F0] text-[#334155]'
                    }`}>
                      <div className="px-3 py-2 text-xs font-semibold text-gray-400 border-b dark:border-gray-800 mb-1 flex items-center justify-between">
                        <span>Notifications</span>
                        <span className="text-[10px] text-blue-500 font-mono cursor-pointer" onClick={() => triggerToast('Marked all as read', 'info')}>Mark all read</span>
                      </div>
                      <div className="space-y-1 max-h-60 overflow-y-auto">
                        {mockNotifications.map(n => (
                          <div key={n.id} className={`p-2.5 rounded-md text-xs transition-colors duration-150 ${
                            !n.read ? (theme === 'dark' ? 'bg-[#1F2937]' : 'bg-blue-50/50') : ''
                          }`}>
                            <div className="flex items-start gap-2">
                              {n.type === 'error' && <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />}
                              {n.type === 'warning' && <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />}
                              {n.type === 'success' && <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />}
                              <p className="leading-tight">{n.text}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Theme Selector */}
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg border transition-all duration-200 ${
                  theme === 'dark'
                    ? 'bg-[#1F2937] border-[#374151] text-yellow-400'
                    : 'bg-white border-[#E2E8F0] text-gray-600 hover:text-[#0F172A]'
                }`}
                title="Toggle Dashboard Theme"
              >
                {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>

              <div className="h-6 w-[1px] bg-[#E2E8F0] dark:bg-gray-800" />

              {/* User Profile Mini Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 text-left focus:outline-none"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold ring-2 ring-offset-2 ring-blue-500 dark:ring-offset-[#111827]">
                    AS
                  </div>
                </button>

                {profileDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setProfileDropdownOpen(false)} />
                    <div className={`absolute right-0 mt-2 w-56 rounded-lg border shadow-xl z-50 p-1.5 focus:outline-none ${
                      theme === 'dark' ? 'bg-[#111827] border-[#1F2937] text-gray-300' : 'bg-white border-[#E2E8F0] text-[#334155]'
                    }`}>
                      <div className="px-3 py-2 text-xs border-b dark:border-gray-800 mb-1">
                        <p className="font-semibold text-gray-900 dark:text-white">Akanksha Sahu</p>
                        <p className="text-[10px] text-gray-400 truncate mt-0.5">akanksha@smarterp.io</p>
                      </div>
                      <button
                        onClick={() => { setActiveTab('settings'); setProfileDropdownOpen(false); }}
                        className="w-full text-left px-3 py-2 text-xs rounded hover:bg-gray-100 dark:hover:bg-gray-800"
                      >
                        Company Settings
                      </button>
                      <button
                        onClick={() => triggerToast('License key active: Lifetime portfolio demo', 'info')}
                        className="w-full text-left px-3 py-2 text-xs rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-blue-600"
                      >
                        Enterprise Active
                      </button>
                    </div>
                  </>
                )}
              </div>

            </div>
          </header>

          {/* ================= CENTRAL CONTENT WORKSPACE ================= */}
          <div className="p-8 max-w-[1600px] w-full mx-auto space-y-8 animate-fade-up">

            {/* View Heading Title */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className={`text-3xl font-bold tracking-tight ${theme === 'dark' ? 'text-white' : 'text-[#0F172A]'}`}>
                  {activeTab === 'dashboard' && 'Dashboard Center'}
                  {activeTab === 'invoices' && 'Invoices & Client Ledgers'}
                  {activeTab === 'inventory' && 'Inventory Catalog'}
                  {activeTab === 'customers' && 'Customer CRM Directory'}
                  {activeTab === 'reports' && 'Reports & Analytical Statements'}
                  {activeTab === 'settings' && 'Enterprise System Settings'}
                </h1>
                <p className={`text-sm mt-1.5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  {activeTab === 'dashboard' && 'Real-time overview of business revenue, purchases, outstanding receivables, and active inventory.'}
                  {activeTab === 'invoices' && 'Manage generated sales invoices, collect balances, filter records, and create adjustments.'}
                  {activeTab === 'inventory' && 'Track raw stock levels, set reorder warnings, adjust valuations, and manage warehouse products.'}
                  {activeTab === 'customers' && 'Manage contacts, client billing statistics, outstanding balances, and account logs.'}
                  {activeTab === 'reports' && 'View structured balance sheets, monthly profits, revenue streams, and export raw analytical CSVs.'}
                  {activeTab === 'settings' && 'Configure company details, fiscal configuration, currencies, tax tokens, and system prefixes.'}
                </p>
              </div>

              {/* Action buttons based on active view */}
              <div className="flex items-center gap-3">
                {activeTab === 'invoices' && (
                  <>
                    <button
                      onClick={() => setIsInvoiceModalOpen(true)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#2563EB] text-white hover:bg-blue-700 text-sm font-semibold rounded-lg shadow-sm transition-all duration-150 cursor-pointer active:scale-[0.98]"
                    >
                      <Plus className="w-4 h-4" />
                      Create Invoice
                    </button>
                  </>
                )}
                {activeTab === 'inventory' && (
                  <button
                    onClick={() => setIsProductModalOpen(true)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#2563EB] text-white hover:bg-blue-700 text-sm font-semibold rounded-lg shadow-sm transition-all duration-150 cursor-pointer active:scale-[0.98]"
                  >
                    <Plus className="w-4 h-4" />
                    Add Product
                  </button>
                )}
              </div>
            </div>

            {/* ================= VIEW 1: DASHBOARD OVERVIEW ================= */}
            {activeTab === 'dashboard' && (
              <div className="space-y-8">
                
                {/* 5 Beautiful Statistic Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                  {[
                    { title: 'Total Revenue', value: financialTotals.revenue, type: 'currency', desc: 'Received payments', trend: '+12.4%', up: true },
                    { title: 'Total Invoiced Sales', value: financialTotals.revenue + financialTotals.pending + financialTotals.overdue, type: 'currency', desc: 'Aggregate billing', trend: '+8.3%', up: true },
                    { title: 'Outstanding Receivables', value: financialTotals.pending + financialTotals.overdue, type: 'currency', desc: 'Unpaid billing assets', trend: '-2.1%', up: false, status: 'warning' },
                    { title: 'Cost of Capital Outlay', value: financialTotals.revenue * 0.42, type: 'currency', desc: 'Simulated operations spend', trend: '+1.5%', up: true },
                    { title: 'Inventory Asset Value', value: financialTotals.inventoryValue, type: 'currency', desc: 'Wholesale valuation cost', trend: 'Rebalanced', up: true },
                  ].map((stat, i) => (
                    <div
                      key={i}
                      className={`p-6 rounded-xl border shadow-[0_2px_8px_rgba(0,0,0,0.02)] transition-all duration-200 ${
                        theme === 'dark' ? 'bg-[#111827] border-[#1F2937]' : 'bg-white border-[#E2E8F0]'
                      }`}
                    >
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{stat.title}</p>
                      
                      {loading ? (
                        <div className="space-y-2 mt-3">
                          <div className="h-7 w-28 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                          <div className="h-4 w-36 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
                        </div>
                      ) : (
                        <>
                          <h3 className={`text-2xl font-bold tracking-tight mt-2 ${theme === 'dark' ? 'text-white' : 'text-[#0F172A]'}`}>
                            {stat.type === 'currency' ? formatCurrency(stat.value) : stat.value}
                          </h3>
                          <div className="flex items-center gap-2 mt-2">
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded flex items-center gap-0.5 ${
                              stat.up 
                                ? 'bg-green-50 dark:bg-green-950/20 text-[#16A34A]'
                                : 'bg-red-50 dark:bg-red-950/20 text-[#DC2626]'
                            }`}>
                              {stat.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                              {stat.trend}
                            </span>
                            <span className="text-[11px] text-gray-400 font-medium">{stat.desc}</span>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>

                {/* Grid layout for Charts and secondary widgets */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  
                  {/* Left Area Chart Component */}
                  <div className={`lg:col-span-2 p-6 rounded-xl border shadow-[0_2px_8px_rgba(0,0,0,0.02)] ${
                    theme === 'dark' ? 'bg-[#111827] border-[#1F2937]' : 'bg-white border-[#E2E8F0]'
                  }`}>
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className={`text-base font-bold ${theme === 'dark' ? 'text-white' : 'text-[#0F172A]'}`}>Financial Ledger Overview</h3>
                        <p className="text-xs text-gray-400 mt-1">Monthly comparison of revenue flow vs structural operational costs.</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="inline-block w-2.5 h-2.5 rounded bg-[#2563EB] mr-1" />
                        <span className="text-[11px] font-semibold text-gray-500 mr-4">Revenue</span>
                        <span className="inline-block w-2.5 h-2.5 rounded bg-[#D97706] mr-1" />
                        <span className="text-[11px] font-semibold text-gray-500">Expenses</span>
                      </div>
                    </div>

                    <div className="h-80 w-full">
                      {loading ? (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="h-6 w-6 border-2 border-[#2563EB] border-t-transparent rounded-full animate-spin" />
                        </div>
                      ) : mounted ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                              <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#2563EB" stopOpacity={0.15}/>
                                <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                              </linearGradient>
                              <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#D97706" stopOpacity={0.15}/>
                                <stop offset="95%" stopColor="#D97706" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme === 'dark' ? '#1F2937' : '#E2E8F0'} />
                            <XAxis dataKey="month" stroke={theme === 'dark' ? '#4B5563' : '#94A3B8'} fontSize={11} tickLine={false} />
                            <YAxis stroke={theme === 'dark' ? '#4B5563' : '#94A3B8'} fontSize={11} tickLine={false} />
                            <Tooltip 
                              contentStyle={{ 
                                backgroundColor: theme === 'dark' ? '#111827' : '#FFFFFF',
                                border: `1px solid ${theme === 'dark' ? '#1F2937' : '#E2E8F0'}`,
                                borderRadius: '8px',
                                color: theme === 'dark' ? '#F9FAFB' : '#0F172A',
                                fontSize: '12px'
                              }}
                            />
                            <Area type="monotone" dataKey="Revenue" stroke="#2563EB" strokeWidth={2} fillOpacity={1} fill="url(#colorRev)" />
                            <Area type="monotone" dataKey="Expenses" stroke="#D97706" strokeWidth={2} fillOpacity={1} fill="url(#colorExp)" />
                          </AreaChart>
                        </ResponsiveContainer>
                      ) : null}
                    </div>
                  </div>

                  {/* Right Pie Chart Component */}
                  <div className={`p-6 rounded-xl border shadow-[0_2px_8px_rgba(0,0,0,0.02)] ${
                    theme === 'dark' ? 'bg-[#111827] border-[#1F2937]' : 'bg-white border-[#E2E8F0]'
                  }`}>
                    <h3 className={`text-base font-bold ${theme === 'dark' ? 'text-white' : 'text-[#0F172A]'}`}>Revenue Streams by Stream Category</h3>
                    <p className="text-xs text-gray-400 mt-1">Breakdown of gross invoiced income assets.</p>

                    <div className="h-60 w-full mt-6 relative flex items-center justify-center">
                      {loading ? (
                        <div className="h-6 w-6 border-2 border-[#2563EB] border-t-transparent rounded-full animate-spin" />
                      ) : mounted ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={categoryPieData}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={80}
                              paddingAngle={4}
                              dataKey="value"
                            >
                              {categoryPieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip 
                              contentStyle={{ 
                                backgroundColor: theme === 'dark' ? '#111827' : '#FFFFFF',
                                border: `1px solid ${theme === 'dark' ? '#1F2937' : '#E2E8F0'}`,
                                borderRadius: '8px',
                                color: theme === 'dark' ? '#F9FAFB' : '#0F172A',
                                fontSize: '12px'
                              }}
                              formatter={(value) => formatCurrency(Number(value))}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      ) : null}
                      <div className="absolute flex flex-col items-center justify-center">
                        <span className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">Aggregate Assets</span>
                        <span className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-[#0F172A]'}`}>
                          {formatCurrency(categoryPieData.reduce((acc, c) => acc + c.value, 0))}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1.5 mt-2">
                      {categoryPieData.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded" style={{ backgroundColor: item.color }} />
                            <span className="text-gray-500 font-semibold">{item.name}</span>
                          </div>
                          <span className={`font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-[#0F172A]'}`}>
                            {formatCurrency(item.value)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Row for Recent Invoices, Stock Alarms & Quick Actions */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  
                  {/* Recent Ledgers */}
                  <div className={`lg:col-span-2 p-6 rounded-xl border shadow-[0_2px_8px_rgba(0,0,0,0.02)] ${
                    theme === 'dark' ? 'bg-[#111827] border-[#1F2937]' : 'bg-white border-[#E2E8F0]'
                  }`}>
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className={`text-base font-bold ${theme === 'dark' ? 'text-white' : 'text-[#0F172A]'}`}>Recent Accounts Ledger</h3>
                        <p className="text-xs text-gray-400 mt-1">Latest billing invoices sent out to corporate accounts.</p>
                      </div>
                      <button
                        onClick={() => setActiveTab('invoices')}
                        className="text-xs font-semibold text-[#2563EB] hover:underline"
                      >
                        View Full Ledger
                      </button>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className={`border-b text-xs uppercase tracking-wider text-gray-400 ${theme === 'dark' ? 'border-[#1F2937]' : 'border-gray-100'}`}>
                            <th className="pb-3 font-semibold">Ledger ID</th>
                            <th className="pb-3 font-semibold">Account customer</th>
                            <th className="pb-3 font-semibold">Valuation</th>
                            <th className="pb-3 font-semibold">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-xs">
                          {invoices.slice(0, 5).map((inv, idx) => (
                            <tr key={idx} className={`hover:bg-[#F5F7FA] dark:hover:bg-gray-800/40 transition-colors duration-150`}>
                              <td className="py-3 font-mono font-medium">{inv.id}</td>
                              <td className={`py-3 font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{inv.customer}</td>
                              <td className="py-3 font-semibold">{formatCurrency(inv.amount)}</td>
                              <td className="py-3">
                                <span className={`inline-flex items-center px-2 py-0.5 rounded font-semibold capitalize text-[10px] ${
                                  inv.status === 'paid' ? 'bg-green-50 dark:bg-green-950/20 text-[#16A34A]' :
                                  inv.status === 'pending' ? 'bg-amber-50 dark:bg-amber-950/20 text-[#D97706]' :
                                  'bg-red-50 dark:bg-red-950/20 text-[#DC2626]'
                                }`}>
                                  {inv.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Stock Alarms & Quick actions */}
                  <div className="space-y-6">
                    {/* Quick Tools */}
                    <div className={`p-6 rounded-xl border shadow-[0_2px_8px_rgba(0,0,0,0.02)] ${
                      theme === 'dark' ? 'bg-[#111827] border-[#1F2937]' : 'bg-white border-[#E2E8F0]'
                    }`}>
                      <h3 className={`text-base font-bold ${theme === 'dark' ? 'text-white' : 'text-[#0F172A]'}`}>Quick Corporate Actions</h3>
                      <p className="text-xs text-gray-400 mt-1">One-click shortcut actions for daily ledger management.</p>
                      
                      <div className="grid grid-cols-2 gap-3 mt-4">
                        <button
                          onClick={() => setIsInvoiceModalOpen(true)}
                          className="flex flex-col items-center justify-center p-3 rounded-lg border text-center transition-all duration-150 hover:bg-[#F5F7FA] dark:hover:bg-gray-800 cursor-pointer active:scale-95 group"
                          style={{ borderColor: theme === 'dark' ? '#1F2937' : '#E2E8F0' }}
                        >
                          <PlusCircle className="w-5 h-5 text-[#2563EB] mb-1.5 transition-transform group-hover:scale-110" />
                          <span className={`text-[11px] font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>New Invoice</span>
                        </button>
                        
                        <button
                          onClick={() => setIsProductModalOpen(true)}
                          className="flex flex-col items-center justify-center p-3 rounded-lg border text-center transition-all duration-150 hover:bg-[#F5F7FA] dark:hover:bg-gray-800 cursor-pointer active:scale-95 group"
                          style={{ borderColor: theme === 'dark' ? '#1F2937' : '#E2E8F0' }}
                        >
                          <Plus className="w-5 h-5 text-[#16A34A] mb-1.5 transition-transform group-hover:scale-110" />
                          <span className={`text-[11px] font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Add Stock Product</span>
                        </button>

                        <button
                          onClick={triggerRefresh}
                          className="flex flex-col items-center justify-center p-3 rounded-lg border text-center transition-all duration-150 hover:bg-[#F5F7FA] dark:hover:bg-gray-800 cursor-pointer active:scale-95 group"
                          style={{ borderColor: theme === 'dark' ? '#1F2937' : '#E2E8F0' }}
                        >
                          <RefreshCw className="w-5 h-5 text-[#D97706] mb-1.5 transition-transform group-hover:rotate-180 duration-500" />
                          <span className={`text-[11px] font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Sync Database</span>
                        </button>

                        <button
                          onClick={() => { setActiveTab('reports'); triggerToast('Generating statements...', 'info'); }}
                          className="flex flex-col items-center justify-center p-3 rounded-lg border text-center transition-all duration-150 hover:bg-[#F5F7FA] dark:hover:bg-gray-800 cursor-pointer active:scale-95 group"
                          style={{ borderColor: theme === 'dark' ? '#1F2937' : '#E2E8F0' }}
                        >
                          <FileText className="w-5 h-5 text-purple-500 mb-1.5 transition-transform group-hover:scale-110" />
                          <span className={`text-[11px] font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Export Report</span>
                        </button>
                      </div>
                    </div>

                    {/* Stock reorder warnings */}
                    <div className={`p-6 rounded-xl border shadow-[0_2px_8px_rgba(0,0,0,0.02)] ${
                      theme === 'dark' ? 'bg-[#111827] border-[#1F2937]' : 'bg-white border-[#E2E8F0]'
                    }`}>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className={`text-base font-bold ${theme === 'dark' ? 'text-white' : 'text-[#0F172A]'}`}>Warehouse Alarms</h3>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-50 dark:bg-red-950/20 text-[#DC2626]">
                          {stockAlarms.length} Active Alerts
                        </span>
                      </div>
                      
                      <div className="space-y-3">
                        {stockAlarms.length === 0 ? (
                          <div className="text-center py-6 text-xs text-gray-400">
                            <CheckCircle2 className="w-8 h-8 text-green-500 mx-auto mb-2 opacity-50" />
                            All catalog products fully stocked.
                          </div>
                        ) : (
                          stockAlarms.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between p-2.5 rounded-lg border border-red-500/10 bg-red-500/[0.02] text-xs">
                              <div>
                                <h4 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>{item.name}</h4>
                                <p className="text-[10px] text-gray-400 font-mono mt-0.5">SKU: {item.sku} | limit: {item.minStock}</p>
                              </div>
                              <div className="text-right">
                                <span className="font-bold text-[#DC2626]">{item.stock} left</span>
                                <p className="text-[10px] text-gray-400 font-semibold mt-0.5">Price: {formatCurrency(item.price)}</p>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>

                </div>

              </div>
            )}

            {/* ================= VIEW 2: INVOICES & LEDGER ================= */}
            {activeTab === 'invoices' && (
              <div className="space-y-6">
                
                {/* Search, Filter tabs and Bulk Action Row */}
                <div className={`p-4 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  theme === 'dark' ? 'bg-[#111827] border-[#1F2937]' : 'bg-white border-[#E2E8F0]'
                }`}>
                  {/* Status filter selection tabs */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    {[
                      { id: 'all', label: 'All Invoices' },
                      { id: 'paid', label: 'Paid Assets' },
                      { id: 'pending', label: 'Pending Collections' },
                      { id: 'overdue', label: 'Overdue Receivables' }
                    ].map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => setInvoiceFilterStatus(tab.id)}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all duration-150 ${
                          invoiceFilterStatus === tab.id
                            ? 'bg-[#2563EB] text-white shadow-sm'
                            : theme === 'dark'
                              ? 'text-gray-400 hover:bg-[#1F2937] hover:text-white'
                              : 'text-gray-600 hover:bg-[#F5F7FA] hover:text-[#0F172A]'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* Bulk action buttons */}
                  {selectedInvoiceIds.length > 0 && (
                    <div className="flex items-center gap-3 animate-fade-in">
                      <span className="text-xs text-gray-400 font-medium">
                        {selectedInvoiceIds.length} Selected:
                      </span>
                      <button
                        onClick={handleBulkMarkPaid}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-[#16A34A]/30 bg-[#16A34A]/5 hover:bg-[#16A34A]/10 text-[#16A34A] text-xs font-semibold rounded-md transition-all duration-150"
                      >
                        <Check className="w-3.5 h-3.5" />
                        Mark Paid
                      </button>
                      <button
                        onClick={handleBulkDelete}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-[#DC2626]/30 bg-[#DC2626]/5 hover:bg-[#DC2626]/10 text-[#DC2626] text-xs font-semibold rounded-md transition-all duration-150"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Archived
                      </button>
                    </div>
                  )}
                </div>

                {/* Ledger Invoices Table */}
                <div className={`rounded-xl border overflow-hidden shadow-sm ${
                  theme === 'dark' ? 'bg-[#111827] border-[#1F2937]' : 'bg-white border-[#E2E8F0]'
                }`}>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      
                      {/* Sticky header table */}
                      <thead>
                        <tr className={`border-b text-xs font-semibold uppercase tracking-wider text-gray-400 ${
                          theme === 'dark' ? 'bg-[#161E2E] border-[#1F2937]' : 'bg-gray-50 border-[#E2E8F0]'
                        }`}>
                          <th className="p-4 w-12 text-center">
                            <input
                              type="checkbox"
                              checked={paginatedInvoices.length > 0 && paginatedInvoices.every(inv => selectedInvoiceIds.includes(inv.id))}
                              onChange={handleToggleSelectAllInvoices}
                              className="rounded border-gray-300 dark:border-gray-700 text-blue-600 focus:ring-blue-500"
                            />
                          </th>
                          <th className="p-4 cursor-pointer hover:text-[#0F172A] dark:hover:text-white select-none" onClick={() => handleInvoiceSort('id')}>
                            <div className="flex items-center gap-1">
                              Invoice ID
                              <ArrowUpDown className="w-3.5 h-3.5" />
                            </div>
                          </th>
                          <th className="p-4 cursor-pointer hover:text-[#0F172A] dark:hover:text-white select-none" onClick={() => handleInvoiceSort('customer')}>
                            <div className="flex items-center gap-1">
                              Client Account
                              <ArrowUpDown className="w-3.5 h-3.5" />
                            </div>
                          </th>
                          <th className="p-4 cursor-pointer hover:text-[#0F172A] dark:hover:text-white select-none" onClick={() => handleInvoiceSort('date')}>
                            <div className="flex items-center gap-1">
                              Billing Date
                              <ArrowUpDown className="w-3.5 h-3.5" />
                            </div>
                          </th>
                          <th className="p-4 cursor-pointer hover:text-[#0F172A] dark:hover:text-white select-none" onClick={() => handleInvoiceSort('dueDate')}>
                            <div className="flex items-center gap-1">
                              Due Date
                              <ArrowUpDown className="w-3.5 h-3.5" />
                            </div>
                          </th>
                          <th className="p-4 cursor-pointer hover:text-[#0F172A] dark:hover:text-white select-none" onClick={() => handleInvoiceSort('amount')}>
                            <div className="flex items-center gap-1 justify-end">
                              Total Value
                              <ArrowUpDown className="w-3.5 h-3.5" />
                            </div>
                          </th>
                          <th className="p-4">Classification</th>
                          <th className="p-4 text-center">Actions</th>
                        </tr>
                      </thead>

                      {/* Table row list */}
                      <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-xs">
                        {loading ? (
                          Array.from({ length: 6 }).map((_, idx) => (
                            <tr key={idx}>
                              <td className="p-4 w-12"><div className="h-4 w-4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse mx-auto" /></td>
                              <td className="p-4"><div className="h-4 w-20 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" /></td>
                              <td className="p-4"><div className="h-4 w-32 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" /></td>
                              <td className="p-4"><div className="h-4 w-20 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" /></td>
                              <td className="p-4"><div className="h-4 w-20 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" /></td>
                              <td className="p-4 text-right"><div className="h-4 w-16 bg-gray-200 dark:bg-gray-800 rounded animate-pulse ml-auto" /></td>
                              <td className="p-4"><div className="h-5 w-16 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" /></td>
                              <td className="p-4"><div className="h-6 w-10 bg-gray-200 dark:bg-gray-800 rounded animate-pulse mx-auto" /></td>
                            </tr>
                          ))
                        ) : paginatedInvoices.length === 0 ? (
                          <tr>
                            <td colSpan={8} className="p-8 text-center text-gray-400 font-medium">
                              <FolderMinus className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-700 mb-3" />
                              No invoices match your search query filters.
                            </td>
                          </tr>
                        ) : (
                          paginatedInvoices.map((inv) => {
                            const isSelected = selectedInvoiceIds.includes(inv.id);
                            return (
                              <tr
                                key={inv.id}
                                className={`hover:bg-[#F5F7FA] dark:hover:bg-gray-800/30 transition-colors duration-150 ${
                                  isSelected ? 'bg-blue-50/10 dark:bg-blue-900/5' : ''
                                }`}
                              >
                                <td className="p-4 text-center">
                                  <input
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={() => handleToggleSelectInvoice(inv.id)}
                                    className="rounded border-gray-300 dark:border-gray-700 text-blue-600 focus:ring-blue-500"
                                  />
                                </td>
                                <td className="p-4 font-mono font-semibold">{inv.id}</td>
                                <td className="p-4 font-medium">
                                  <div className="font-semibold text-gray-900 dark:text-white">{inv.customer}</div>
                                  <div className="text-[10px] text-gray-400">{inv.email}</div>
                                </td>
                                <td className="p-4 text-gray-500">{inv.date}</td>
                                <td className="p-4 text-gray-500">{inv.dueDate}</td>
                                <td className="p-4 text-right font-bold text-gray-900 dark:text-white">
                                  {formatCurrency(inv.amount)}
                                </td>
                                <td className="p-4">
                                  <span className={`inline-flex items-center px-2 py-0.5 rounded font-semibold capitalize text-[10px] ${
                                    inv.status === 'paid' ? 'bg-green-50 dark:bg-green-950/20 text-[#16A34A]' :
                                    inv.status === 'pending' ? 'bg-amber-50 dark:bg-amber-950/20 text-[#D97706]' :
                                    'bg-red-50 dark:bg-red-950/20 text-[#DC2626]'
                                  }`}>
                                    {inv.status}
                                  </span>
                                </td>
                                <td className="p-4 text-center">
                                  <div className="relative inline-block text-left">
                                    <button
                                      onClick={() => {
                                        setInvoices(prev => prev.map(i => i.id === inv.id ? { ...i, status: i.status === 'paid' ? 'pending' : 'paid' } : i));
                                        triggerToast(`Status updated for ${inv.id}`, 'info');
                                      }}
                                      className="px-2 py-1 border rounded dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-[10px] font-semibold text-gray-500"
                                    >
                                      Toggle Status
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination footer */}
                  <div className={`p-4 border-t flex items-center justify-between text-xs font-semibold ${
                    theme === 'dark' ? 'border-[#1F2937]' : 'border-gray-100'
                  }`}>
                    <span className="text-gray-400">
                      Showing {Math.min(sortedAndFilteredInvoices.length, (invoicePage - 1) * invoicePageSize + 1)} to {Math.min(sortedAndFilteredInvoices.length, invoicePage * invoicePageSize)} of {sortedAndFilteredInvoices.length} invoices
                    </span>
                    
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setInvoicePage(prev => Math.max(1, prev - 1))}
                        disabled={invoicePage === 1}
                        className="p-1.5 rounded border dark:border-gray-700 disabled:opacity-50"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <span className="px-2 font-mono">
                        Page {invoicePage} of {totalInvoicePages}
                      </span>
                      <button
                        onClick={() => setInvoicePage(prev => Math.min(totalInvoicePages, prev + 1))}
                        disabled={invoicePage === totalInvoicePages}
                        className="p-1.5 rounded border dark:border-gray-700 disabled:opacity-50"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* ================= VIEW 3: INVENTORY CATALOG ================= */}
            {activeTab === 'inventory' && (
              <div className="space-y-6">
                
                {/* Search & Stock Level filter tabs */}
                <div className={`p-4 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  theme === 'dark' ? 'bg-[#111827] border-[#1F2937]' : 'bg-white border-[#E2E8F0]'
                }`}>
                  <div className="flex items-center gap-1.5">
                    {[
                      { id: 'all', label: 'All Warehouse Stock' },
                      { id: 'low', label: 'Low Stock Warnings' }
                    ].map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => setProductStockFilter(tab.id as any)}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all duration-150 ${
                          productStockFilter === tab.id
                            ? 'bg-[#2563EB] text-white shadow-sm'
                            : theme === 'dark'
                              ? 'text-gray-400 hover:bg-[#1F2937]'
                              : 'text-gray-600 hover:bg-[#F5F7FA]'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  <span className="text-xs text-gray-400 font-semibold font-mono">
                    Catalog Total Value: {formatCurrency(financialTotals.inventoryValue)}
                  </span>
                </div>

                {/* Catalog Table */}
                <div className={`rounded-xl border overflow-hidden shadow-sm ${
                  theme === 'dark' ? 'bg-[#111827] border-[#1F2937]' : 'bg-white border-[#E2E8F0]'
                }`}>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className={`border-b text-xs font-semibold uppercase tracking-wider text-gray-400 ${
                          theme === 'dark' ? 'bg-[#161E2E] border-[#1F2937]' : 'bg-gray-50 border-[#E2E8F0]'
                        }`}>
                          <th className="p-4">SKU / ID</th>
                          <th className="p-4">Product details</th>
                          <th className="p-4">Category</th>
                          <th className="p-4 text-right">Unit retail price</th>
                          <th className="p-4 text-right">Cost price</th>
                          <th className="p-4 text-center">In Stock</th>
                          <th className="p-4">Stock status</th>
                          <th className="p-4 text-center">Increase Stock</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-xs">
                        {filteredProducts.length === 0 ? (
                          <tr>
                            <td colSpan={8} className="p-8 text-center text-gray-400 font-medium">
                              <FolderMinus className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-700 mb-3" />
                              No catalog products matched filter parameters.
                            </td>
                          </tr>
                        ) : (
                          filteredProducts.map(p => {
                            const isLow = p.stock <= p.minStock;
                            return (
                              <tr key={p.id} className="hover:bg-[#F5F7FA] dark:hover:bg-gray-800/30 transition-colors duration-150">
                                <td className="p-4 font-mono font-semibold">{p.sku}</td>
                                <td className="p-4">
                                  <div className="font-semibold text-gray-900 dark:text-white">{p.name}</div>
                                  <div className="text-[10px] text-gray-400">ID: {p.id}</div>
                                </td>
                                <td className="p-4 font-medium text-gray-500">{p.category}</td>
                                <td className="p-4 text-right font-bold text-gray-900 dark:text-white">{formatCurrency(p.price)}</td>
                                <td className="p-4 text-right text-gray-500">{formatCurrency(p.cost)}</td>
                                <td className="p-4 text-center font-mono font-bold">{p.stock}</td>
                                <td className="p-4">
                                  <span className={`inline-flex items-center px-2 py-0.5 rounded font-semibold text-[10px] ${
                                    isLow ? 'bg-red-50 dark:bg-red-950/20 text-[#DC2626]' : 'bg-green-50 dark:bg-green-950/20 text-[#16A34A]'
                                  }`}>
                                    {isLow ? `Low Stock (Limit ${p.minStock})` : 'Satisfactory'}
                                  </span>
                                </td>
                                <td className="p-4 text-center">
                                  <button
                                    onClick={() => {
                                      setProducts(prev => prev.map(prod => prod.id === p.id ? { ...prod, stock: prod.stock + 10 } : prod));
                                      triggerToast(`Restocked 10 units for ${p.name}`, 'success');
                                    }}
                                    className="px-2 py-1 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border dark:border-gray-700 rounded text-[10px] font-semibold transition-colors duration-150"
                                  >
                                    +10 Units
                                  </button>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            )}

            {/* ================= VIEW 4: CUSTOMERS CRM ================= */}
            {activeTab === 'customers' && (
              <div className="space-y-6">
                
                <div className={`rounded-xl border overflow-hidden shadow-sm ${
                  theme === 'dark' ? 'bg-[#111827] border-[#1F2937]' : 'bg-white border-[#E2E8F0]'
                }`}>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className={`border-b text-xs font-semibold uppercase tracking-wider text-gray-400 ${
                          theme === 'dark' ? 'bg-[#161E2E] border-[#1F2937]' : 'bg-gray-50 border-[#E2E8F0]'
                        }`}>
                          <th className="p-4">Customer ID</th>
                          <th className="p-4">Customer Contact</th>
                          <th className="p-4">Corporation Name</th>
                          <th className="p-4 text-right">Aggregate Sales Billed</th>
                          <th className="p-4 text-right">Outstanding Balance</th>
                          <th className="p-4">CRM Account Status</th>
                          <th className="p-4 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-xs">
                        {customers.map(c => (
                          <tr key={c.id} className="hover:bg-[#F5F7FA] dark:hover:bg-gray-800/30 transition-colors duration-150">
                            <td className="p-4 font-mono font-semibold">{c.id}</td>
                            <td className="p-4">
                              <div className="font-semibold text-gray-900 dark:text-white">{c.name}</div>
                              <div className="text-[10px] text-gray-400">{c.email}</div>
                            </td>
                            <td className="p-4 font-semibold text-gray-600 dark:text-gray-300">{c.company}</td>
                            <td className="p-4 text-right font-bold text-gray-900 dark:text-white">{formatCurrency(c.totalBilled)}</td>
                            <td className={`p-4 text-right font-bold ${c.outstanding > 0 ? 'text-[#D97706]' : 'text-gray-500'}`}>
                              {formatCurrency(c.outstanding)}
                            </td>
                            <td className="p-4">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded font-semibold text-[10px] capitalize ${
                                c.status === 'active' ? 'bg-green-50 dark:bg-green-950/20 text-[#16A34A]' : 'bg-gray-100 dark:bg-gray-800 text-gray-400'
                              }`}>
                                {c.status}
                              </span>
                            </td>
                            <td className="p-4 text-center">
                              <button
                                onClick={() => {
                                  setCustomers(prev => prev.map(cust => cust.id === c.id ? { ...cust, status: cust.status === 'active' ? 'inactive' : 'active' } : cust));
                                  triggerToast(`Updated account status for ${c.company}`, 'info');
                                }}
                                className="px-2 py-1 border dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 rounded text-[10px] font-semibold text-gray-500"
                              >
                                Toggle CRM
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            )}

            {/* ================= VIEW 5: REPORTS & ANALYTICS ================= */}
            {activeTab === 'reports' && (
              <div className="space-y-8">
                
                {/* Reports top filter options */}
                <div className={`p-6 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-6 ${
                  theme === 'dark' ? 'bg-[#111827] border-[#1F2937]' : 'bg-white border-[#E2E8F0]'
                }`}>
                  <div>
                    <h3 className={`text-base font-bold ${theme === 'dark' ? 'text-white' : 'text-[#0F172A]'}`}>Export Accounting ledger Reports</h3>
                    <p className="text-xs text-gray-400 mt-1">Download official balance sheets, sales indices, and tax statements.</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => triggerToast('Generating PDF statement...', 'info')}
                      className="inline-flex items-center gap-1.5 px-4 py-2 border dark:border-gray-700 hover:bg-[#F5F7FA] dark:hover:bg-gray-800 text-xs font-semibold rounded-lg shadow-sm transition-all duration-150"
                    >
                      <Download className="w-3.5 h-3.5" />
                      PDF Valuation Summary
                    </button>
                    
                    <button
                      onClick={() => triggerToast('CSV file download started', 'success')}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#2563EB] text-white hover:bg-blue-700 text-xs font-semibold rounded-lg shadow-sm transition-all duration-150"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      Export Raw Ledger CSV
                    </button>
                  </div>
                </div>

                {/* Analytical Charts and breakdowns */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Detailed Profit Margins */}
                  <div className={`p-6 rounded-xl border ${
                    theme === 'dark' ? 'bg-[#111827] border-[#1F2937]' : 'bg-white border-[#E2E8F0]'
                  }`}>
                    <h3 className={`text-sm font-bold uppercase tracking-wider text-gray-400 mb-6`}>Estimated Net Profit Margins</h3>
                    
                    <div className="h-72 w-full">
                      {mounted && (
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme === 'dark' ? '#1F2937' : '#E2E8F0'} />
                            <XAxis dataKey="month" stroke={theme === 'dark' ? '#4B5563' : '#94A3B8'} fontSize={11} />
                            <YAxis stroke={theme === 'dark' ? '#4B5563' : '#94A3B8'} fontSize={11} />
                            <Tooltip
                              contentStyle={{ 
                                backgroundColor: theme === 'dark' ? '#111827' : '#FFFFFF',
                                border: `1px solid ${theme === 'dark' ? '#1F2937' : '#E2E8F0'}`,
                                borderRadius: '8px',
                                color: theme === 'dark' ? '#F9FAFB' : '#0F172A'
                              }}
                            />
                            <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                            <Bar dataKey="Profit" fill="#16A34A" radius={[4, 4, 0, 0]} name="Operational Profit" />
                          </BarChart>
                        </ResponsiveContainer>
                      )}
                    </div>
                  </div>

                  {/* Financial Ratios card */}
                  <div className={`p-6 rounded-xl border ${
                    theme === 'dark' ? 'bg-[#111827] border-[#1F2937]' : 'bg-white border-[#E2E8F0]'
                  }`}>
                    <h3 className={`text-sm font-bold uppercase tracking-wider text-gray-400 mb-6`}>Key Operational Ratios</h3>
                    
                    <div className="space-y-4">
                      {[
                        { name: 'Gross Profit Margin Ratio', ratio: '39.4%', status: 'excellent', detail: 'Gross Profit / Revenues' },
                        { name: 'Quick Acid Test Ratio', ratio: '1.82', status: 'satisfactory', detail: 'Liquid Assets / Liabilities' },
                        { name: 'Accounts Receivable Turnover', ratio: '11.5 days', status: 'excellent', detail: 'Average days to collect balance' },
                        { name: 'Inventory Reorder Frequency', ratio: '24.2 days', status: 'average', detail: 'Stock turnover timeframe' }
                      ].map((ratio, idx) => (
                        <div key={idx} className="p-4 rounded-lg border dark:border-gray-800 flex items-center justify-between text-xs">
                          <div>
                            <h4 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>{ratio.name}</h4>
                            <p className="text-[10px] text-gray-400 mt-0.5">{ratio.detail}</p>
                          </div>
                          <div className="text-right">
                            <span className="text-base font-bold text-blue-600 dark:text-blue-400">{ratio.ratio}</span>
                            <div className="mt-1">
                              <span className={`inline-block w-2 h-2 rounded-full mr-1.5 ${
                                ratio.status === 'excellent' ? 'bg-green-500' :
                                ratio.status === 'satisfactory' ? 'bg-blue-500' : 'bg-amber-500'
                              }`} />
                              <span className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold capitalize">{ratio.status}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

              </div>
            )}

            {/* ================= VIEW 6: PORTAL SETTINGS ================= */}
            {activeTab === 'settings' && (
              <div className="max-w-3xl">
                
                <form onSubmit={handleSaveSettings} className={`p-8 rounded-xl border shadow-sm space-y-6 ${
                  theme === 'dark' ? 'bg-[#111827] border-[#1F2937]' : 'bg-white border-[#E2E8F0]'
                }`}>
                  <h3 className={`text-base font-bold pb-4 border-b dark:border-gray-800 ${theme === 'dark' ? 'text-white' : 'text-[#0F172A]'}`}>
                    Enterprise Settings Configuration
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-medium">
                    
                    {/* Company Legal name */}
                    <div className="space-y-2">
                      <label className="text-gray-500">Corporate Legal Name</label>
                      <input
                        type="text"
                        value={settingsForm.companyName}
                        onChange={(e) => setSettingsForm({ ...settingsForm, companyName: e.target.value })}
                        className={`w-full p-2.5 rounded-lg border transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 ${
                          theme === 'dark' ? 'bg-[#1F2937] border-gray-700 text-white' : 'bg-white border-gray-300 text-[#0F172A]'
                        }`}
                        required
                      />
                    </div>

                    {/* Tax ID ID */}
                    <div className="space-y-2">
                      <label className="text-gray-500">Tax Identification ID (EIN/VAT)</label>
                      <input
                        type="text"
                        value={settingsForm.taxId}
                        onChange={(e) => setSettingsForm({ ...settingsForm, taxId: e.target.value })}
                        className={`w-full p-2.5 rounded-lg border transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 ${
                          theme === 'dark' ? 'bg-[#1F2937] border-gray-700 text-white' : 'bg-white border-gray-300 text-[#0F172A]'
                        }`}
                        required
                      />
                    </div>

                    {/* Invoice Prefix */}
                    <div className="space-y-2">
                      <label className="text-gray-500">Invoice Ledger ID Prefix</label>
                      <input
                        type="text"
                        value={settingsForm.invoicePrefix}
                        onChange={(e) => setSettingsForm({ ...settingsForm, invoicePrefix: e.target.value })}
                        className={`w-full p-2.5 rounded-lg border transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 ${
                          theme === 'dark' ? 'bg-[#1F2937] border-gray-700 text-white' : 'bg-white border-gray-300 text-[#0F172A]'
                        }`}
                        required
                      />
                    </div>

                    {/* Currency selector */}
                    <div className="space-y-2">
                      <label className="text-gray-500">Base Portal Currency</label>
                      <select
                        value={settingsForm.currency}
                        onChange={(e) => setSettingsForm({ ...settingsForm, currency: e.target.value })}
                        className={`w-full p-2.5 rounded-lg border transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 ${
                          theme === 'dark' ? 'bg-[#1F2937] border-gray-700 text-white' : 'bg-white border-gray-300 text-[#0F172A]'
                        }`}
                      >
                        <option value="USD">USD ($) United States Dollar</option>
                        <option value="EUR">EUR (€) Euro</option>
                        <option value="GBP">GBP (£) British Pound</option>
                        <option value="JPY">JPY (¥) Japanese Yen</option>
                      </select>
                    </div>

                  </div>

                  {/* Switch Option */}
                  <div className="flex items-center justify-between p-4 rounded-lg border dark:border-gray-800 text-xs">
                    <div>
                      <h4 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>Email Alerts System</h4>
                      <p className="text-[10px] text-gray-400 mt-0.5">Send alerts automatically for outstanding balance warnings.</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settingsForm.emailAlerts}
                      onChange={(e) => setSettingsForm({ ...settingsForm, emailAlerts: e.target.checked })}
                      className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4"
                    />
                  </div>

                  {/* Save Settings Button */}
                  <div className="pt-4 border-t dark:border-gray-800 flex justify-end">
                    <button
                      type="submit"
                      className="px-5 py-2 bg-[#2563EB] text-white hover:bg-blue-700 text-sm font-semibold rounded-lg shadow-sm transition-colors duration-150 cursor-pointer active:scale-95"
                    >
                      Save portal Configuration
                    </button>
                  </div>
                </form>

              </div>
            )}

          </div>
        </main>
      </div>

      {/* ================= MODAL 1: CREATE INVOICE ================= */}
      {isInvoiceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop screen lock */}
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity" onClick={() => setIsInvoiceModalOpen(false)} />
          
          <div className={`relative w-full max-w-lg rounded-xl border shadow-2xl z-10 p-6 overflow-hidden animate-explode-in ${
            theme === 'dark' ? 'bg-[#111827] border-[#1F2937]' : 'bg-white border-[#E2E8F0]'
          }`}>
            <div className="flex items-center justify-between pb-4 border-b dark:border-gray-800 mb-4">
              <h3 className={`text-base font-bold ${theme === 'dark' ? 'text-white' : 'text-[#0F172A]'}`}>Generate Customer Invoice</h3>
              <button onClick={() => setIsInvoiceModalOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateInvoice} className="space-y-4 text-xs font-semibold">
              {/* Account selection */}
              <div className="space-y-1.5">
                <label className="text-gray-500">Corporate Account Name</label>
                <input
                  type="text"
                  placeholder="e.g. Wayne Enterprises"
                  value={newInvoice.customer}
                  onChange={(e) => {
                    setNewInvoice({ ...newInvoice, customer: e.target.value });
                    if (invoiceFormErrors.customer) {
                      setInvoiceFormErrors(prev => { const c = { ...prev }; delete c.customer; return c; });
                    }
                  }}
                  className={`w-full p-2.5 rounded-lg border transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 ${
                    invoiceFormErrors.customer ? 'border-red-500' : ''
                  } ${
                    theme === 'dark' ? 'bg-[#1F2937] border-gray-700 text-white' : 'bg-white border-gray-300 text-[#0F172A]'
                  }`}
                />
                {invoiceFormErrors.customer && <span className="text-[10px] text-red-500">{invoiceFormErrors.customer}</span>}
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-gray-500">Billing Department Email Address</label>
                <input
                  type="email"
                  placeholder="billing@wayne.com"
                  value={newInvoice.email}
                  onChange={(e) => {
                    setNewInvoice({ ...newInvoice, email: e.target.value });
                    if (invoiceFormErrors.email) {
                      setInvoiceFormErrors(prev => { const c = { ...prev }; delete c.email; return c; });
                    }
                  }}
                  className={`w-full p-2.5 rounded-lg border transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 ${
                    invoiceFormErrors.email ? 'border-red-500' : ''
                  } ${
                    theme === 'dark' ? 'bg-[#1F2937] border-gray-700 text-white' : 'bg-white border-gray-300 text-[#0F172A]'
                  }`}
                />
                {invoiceFormErrors.email && <span className="text-[10px] text-red-500">{invoiceFormErrors.email}</span>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Category */}
                <div className="space-y-1.5">
                  <label className="text-gray-500">Billing Category</label>
                  <select
                    value={newInvoice.category}
                    onChange={(e) => setNewInvoice({ ...newInvoice, category: e.target.value as any })}
                    className={`w-full p-2.5 rounded-lg border transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 ${
                      theme === 'dark' ? 'bg-[#1F2937] border-gray-700 text-white' : 'bg-white border-gray-300 text-[#0F172A]'
                    }`}
                  >
                    <option value="Sales">Retail Sales</option>
                    <option value="Consulting">Consulting services</option>
                    <option value="Subscriptions">Software Subscription</option>
                    <option value="Hardware">Hardware Supplies</option>
                  </select>
                </div>

                {/* Status */}
                <div className="space-y-1.5">
                  <label className="text-gray-500">Initial Invoice status</label>
                  <select
                    value={newInvoice.status}
                    onChange={(e) => setNewInvoice({ ...newInvoice, status: e.target.value as any })}
                    className={`w-full p-2.5 rounded-lg border transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 ${
                      theme === 'dark' ? 'bg-[#1F2937] border-gray-700 text-white' : 'bg-white border-gray-300 text-[#0F172A]'
                    }`}
                  >
                    <option value="pending">Pending collection</option>
                    <option value="paid">Pre-paid balance</option>
                    <option value="overdue">Overdue collection</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Due Date */}
                <div className="space-y-1.5">
                  <label className="text-gray-500">Term Payment Limit Date</label>
                  <input
                    type="date"
                    value={newInvoice.dueDate}
                    onChange={(e) => {
                      setNewInvoice({ ...newInvoice, dueDate: e.target.value });
                      if (invoiceFormErrors.dueDate) {
                        setInvoiceFormErrors(prev => { const c = { ...prev }; delete c.dueDate; return c; });
                      }
                    }}
                    className={`w-full p-2.5 rounded-lg border transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 ${
                      invoiceFormErrors.dueDate ? 'border-red-500' : ''
                    } ${
                      theme === 'dark' ? 'bg-[#1F2937] border-gray-700 text-white' : 'bg-white border-gray-300 text-[#0F172A]'
                    }`}
                  />
                  {invoiceFormErrors.dueDate && <span className="text-[10px] text-red-500">{invoiceFormErrors.dueDate}</span>}
                </div>

                {/* Amount */}
                <div className="space-y-1.5">
                  <label className="text-gray-500">Gross Invoice Amount ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="2500.00"
                    value={newInvoice.amount}
                    onChange={(e) => {
                      setNewInvoice({ ...newInvoice, amount: e.target.value });
                      if (invoiceFormErrors.amount) {
                        setInvoiceFormErrors(prev => { const c = { ...prev }; delete c.amount; return c; });
                      }
                    }}
                    className={`w-full p-2.5 rounded-lg border transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 ${
                      invoiceFormErrors.amount ? 'border-red-500' : ''
                    } ${
                      theme === 'dark' ? 'bg-[#1F2937] border-gray-700 text-white' : 'bg-white border-gray-300 text-[#0F172A]'
                    }`}
                  />
                  {invoiceFormErrors.amount && <span className="text-[10px] text-red-500">{invoiceFormErrors.amount}</span>}
                </div>
              </div>

              {/* Submit panel */}
              <div className="pt-4 border-t dark:border-gray-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsInvoiceModalOpen(false)}
                  className="px-4 py-2 border dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-sm rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#2563EB] text-white hover:bg-blue-700 text-sm rounded-lg transition-colors cursor-pointer active:scale-95"
                >
                  Authorize Ledger Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL 2: ADD PRODUCT ================= */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity" onClick={() => setIsProductModalOpen(false)} />
          
          <div className={`relative w-full max-w-lg rounded-xl border shadow-2xl z-10 p-6 overflow-hidden animate-explode-in ${
            theme === 'dark' ? 'bg-[#111827] border-[#1F2937]' : 'bg-white border-[#E2E8F0]'
          }`}>
            <div className="flex items-center justify-between pb-4 border-b dark:border-gray-800 mb-4">
              <h3 className={`text-base font-bold ${theme === 'dark' ? 'text-white' : 'text-[#0F172A]'}`}>Add Product to Warehouse Catalog</h3>
              <button onClick={() => setIsProductModalOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4 text-xs font-semibold">
              <div className="grid grid-cols-2 gap-4">
                {/* Product Name */}
                <div className="col-span-2 space-y-1.5">
                  <label className="text-gray-500">Commercial Product Name</label>
                  <input
                    type="text"
                    placeholder="Ultra Curved Laptop Stand"
                    value={newProduct.name}
                    onChange={(e) => {
                      setNewProduct({ ...newProduct, name: e.target.value });
                      if (productFormErrors.name) {
                        setProductFormErrors(prev => { const c = { ...prev }; delete c.name; return c; });
                      }
                    }}
                    className={`w-full p-2.5 rounded-lg border transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 ${
                      productFormErrors.name ? 'border-red-500' : ''
                    } ${
                      theme === 'dark' ? 'bg-[#1F2937] border-gray-700 text-white' : 'bg-white border-gray-300 text-[#0F172A]'
                    }`}
                  />
                  {productFormErrors.name && <span className="text-[10px] text-red-500">{productFormErrors.name}</span>}
                </div>

                {/* SKU Code */}
                <div className="space-y-1.5">
                  <label className="text-gray-500">Warehouse SKU ID Code</label>
                  <input
                    type="text"
                    placeholder="ACC-LS-04"
                    value={newProduct.sku}
                    onChange={(e) => {
                      setNewProduct({ ...newProduct, sku: e.target.value });
                      if (productFormErrors.sku) {
                        setProductFormErrors(prev => { const c = { ...prev }; delete c.sku; return c; });
                      }
                    }}
                    className={`w-full p-2.5 rounded-lg border transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 ${
                      productFormErrors.sku ? 'border-red-500' : ''
                    } ${
                      theme === 'dark' ? 'bg-[#1F2937] border-gray-700 text-white' : 'bg-white border-gray-300 text-[#0F172A]'
                    }`}
                  />
                  {productFormErrors.sku && <span className="text-[10px] text-red-500">{productFormErrors.sku}</span>}
                </div>

                {/* Category selection */}
                <div className="space-y-1.5">
                  <label className="text-gray-500">Stock Category classification</label>
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    className={`w-full p-2.5 rounded-lg border transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 ${
                      theme === 'dark' ? 'bg-[#1F2937] border-gray-700 text-white' : 'bg-white border-gray-300 text-[#0F172A]'
                    }`}
                  >
                    <option value="Furniture">Furniture</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Apparel">Apparel</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Stock Quantity */}
                <div className="space-y-1.5">
                  <label className="text-gray-500">Initial Physical Stock Count</label>
                  <input
                    type="number"
                    placeholder="25"
                    value={newProduct.stock}
                    onChange={(e) => {
                      setNewProduct({ ...newProduct, stock: e.target.value });
                      if (productFormErrors.stock) {
                        setProductFormErrors(prev => { const c = { ...prev }; delete c.stock; return c; });
                      }
                    }}
                    className={`w-full p-2.5 rounded-lg border transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 ${
                      productFormErrors.stock ? 'border-red-500' : ''
                    } ${
                      theme === 'dark' ? 'bg-[#1F2937] border-gray-700 text-white' : 'bg-white border-gray-300 text-[#0F172A]'
                    }`}
                  />
                  {productFormErrors.stock && <span className="text-[10px] text-red-500">{productFormErrors.stock}</span>}
                </div>

                {/* Min Reorder Stock */}
                <div className="space-y-1.5">
                  <label className="text-gray-500">Minimum Reorder Limit</label>
                  <input
                    type="number"
                    placeholder="10"
                    value={newProduct.minStock}
                    onChange={(e) => {
                      setNewProduct({ ...newProduct, minStock: e.target.value });
                      if (productFormErrors.minStock) {
                        setProductFormErrors(prev => { const c = { ...prev }; delete c.minStock; return c; });
                      }
                    }}
                    className={`w-full p-2.5 rounded-lg border transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 ${
                      productFormErrors.minStock ? 'border-red-500' : ''
                    } ${
                      theme === 'dark' ? 'bg-[#1F2937] border-gray-700 text-white' : 'bg-white border-gray-300 text-[#0F172A]'
                    }`}
                  />
                  {productFormErrors.minStock && <span className="text-[10px] text-red-500">{productFormErrors.minStock}</span>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Retail Price */}
                <div className="space-y-1.5">
                  <label className="text-gray-500">Retail Unit Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="150.00"
                    value={newProduct.price}
                    onChange={(e) => {
                      setNewProduct({ ...newProduct, price: e.target.value });
                      if (productFormErrors.price) {
                        setProductFormErrors(prev => { const c = { ...prev }; delete c.price; return c; });
                      }
                    }}
                    className={`w-full p-2.5 rounded-lg border transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 ${
                      productFormErrors.price ? 'border-red-500' : ''
                    } ${
                      theme === 'dark' ? 'bg-[#1F2937] border-gray-700 text-white' : 'bg-white border-gray-300 text-[#0F172A]'
                    }`}
                  />
                  {productFormErrors.price && <span className="text-[10px] text-red-500">{productFormErrors.price}</span>}
                </div>

                {/* Wholesale Cost */}
                <div className="space-y-1.5">
                  <label className="text-gray-500">Wholesale Unit Cost ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="80.00"
                    value={newProduct.cost}
                    onChange={(e) => {
                      setNewProduct({ ...newProduct, cost: e.target.value });
                      if (productFormErrors.cost) {
                        setProductFormErrors(prev => { const c = { ...prev }; delete c.cost; return c; });
                      }
                    }}
                    className={`w-full p-2.5 rounded-lg border transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 ${
                      productFormErrors.cost ? 'border-red-500' : ''
                    } ${
                      theme === 'dark' ? 'bg-[#1F2937] border-gray-700 text-white' : 'bg-white border-gray-300 text-[#0F172A]'
                    }`}
                  />
                  {productFormErrors.cost && <span className="text-[10px] text-red-500">{productFormErrors.cost}</span>}
                </div>
              </div>

              {/* Submit buttons */}
              <div className="pt-4 border-t dark:border-gray-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 border dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-sm rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#2563EB] text-white hover:bg-blue-700 text-sm rounded-lg transition-colors cursor-pointer active:scale-95"
                >
                  Record Warehouse Stock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
