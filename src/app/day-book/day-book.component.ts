import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

interface MedicineItem {
  id: string;
  name: string;
  defaultHsn: string;
  defaultGst: number;
  defaultExpiry: string;
}

interface PurchaseItem {
  medicineId: string;
  medicineName: string;
  batch: string;
  expiry: string;
  hsn: string;
  qty: number;
  rate: number | null;
  discPercent: number;
  gstPercent: number;
  amount: number;
}

interface Supplier {
  id: string;
  name: string;
  gstin?: string;
  phone?: string;
}

interface Customer {
  id: string;
  name: string;
  phone?: string;
  address?: string;
}

interface JournalLine {
  account: string;
  debit: number | null;
  credit: number | null;
}

@Component({
  selector: 'app-day-book',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './day-book.component.html',
  styleUrls: ['./day-book.component.css']
})
export class DayBookComponent implements OnInit {
  // Tabs configuration
  tabs = [
    { id: 'sales', label: 'Sales' },
    { id: 'sales-return', label: 'Sales Return' },
    { id: 'purchase', label: 'Purchase' },
    { id: 'purchase-return', label: 'Purchase Return' },
    { id: 'receipt', label: 'Receipt' },
    { id: 'payment', label: 'Payment' },
    { id: 'expense', label: 'Expense' },
    { id: 'journal', label: 'Journal' },
    { id: 'contra', label: 'Contra (Cash--Bank)' }
  ];
  activeTab = 'purchase';

  // Form main fields
  voucherDate = '2026-05-19';
  voucherNo = 'PUR-0001';
  narration = '';
  isItemized = true;
  isGstApplicable = true;

  // Inventory-based active tab state (Sales, Sales Return, Purchase, Purchase Return)
  selectedSupplierId = '';
  selectedCustomerId = '';

  // Contra Tab states
  contraDirection = 'withdraw'; // 'withdraw' (Bank -> Cash) or 'deposit' (Cash -> Bank)
  contraAmount: number | null = null;

  // Expense Tab states
  expenseHead = '';
  expenseMode = 'Cash';
  expenseAmount: number | null = null;

  // Receipt Tab states
  receiptCustomerId = '';
  receiptSupplierId = '';
  receiptMode = 'Cash';
  receiptAmount: number | null = null;

  // Payment Tab states
  paymentSupplierId = '';
  paymentCustomerId = '';
  paymentMode = 'Cash';
  paymentAmount: number | null = null;

  // Journal Tab states
  journalLines: JournalLine[] = [];

  // Mock database options
  expenseHeadsDb = [
    'Rent Expense',
    'Salary Expense',
    'Electricity Expense',
    'Office Maintenance',
    'Telephone & Internet Expense',
    'Miscellaneous Expense',
    'Staff Welfare Expense',
    'Printing & Stationery'
  ];

  generalAccountsDb = [
    'Cash',
    'Bank',
    'Purchase Account',
    'Sales Account',
    'Input CGST Account',
    'Input SGST Account',
    'Output CGST Account',
    'Output SGST Account',
    'Purchase Return Account',
    'Sales Return Account',
    'Rent Expense',
    'Salary Expense',
    'Electricity Expense',
    'Apex Pharma Distributors',
    'MedLife Wholesalers Ltd',
    'Reddy Laboratories Agency',
    'CarePlus Pharmaceuticals',
    'Poornachandran (Sundry Debtor)',
    'Ramesh Kumar (Sundry Debtor)',
    'Anjali Sharma (Sundry Debtor)'
  ];

  medicinesDb: MedicineItem[] = [
    { id: 'med-01', name: 'Paracetamol 650mg', defaultHsn: '300490', defaultGst: 12, defaultExpiry: '2028-12' },
    { id: 'med-02', name: 'Amoxicillin 500mg', defaultHsn: '300410', defaultGst: 18, defaultExpiry: '2027-08' },
    { id: 'med-03', name: 'Atorvastatin 10mg', defaultHsn: '300490', defaultGst: 12, defaultExpiry: '2028-04' },
    { id: 'med-04', name: 'Metformin 500mg', defaultHsn: '300420', defaultGst: 12, defaultExpiry: '2027-10' },
    { id: 'med-05', name: 'Ibuprofen 400mg', defaultHsn: '300490', defaultGst: 12, defaultExpiry: '2029-05' },
    { id: 'med-06', name: 'Cetirizine 10mg', defaultHsn: '300490', defaultGst: 5, defaultExpiry: '2028-11' },
    { id: 'med-07', name: 'Pantoprazole 40mg', defaultHsn: '300490', defaultGst: 12, defaultExpiry: '2028-09' },
    { id: 'med-08', name: 'Azithromycin 500mg', defaultHsn: '300410', defaultGst: 12, defaultExpiry: '2027-06' }
  ];

  suppliersDb: Supplier[] = [
    { id: 'sup-01', name: 'Apex Pharma Distributors', gstin: '33AABCA1234F1Z0', phone: '+91 98765 43210' },
    { id: 'sup-02', name: 'MedLife Wholesalers Ltd', gstin: '27AABCM5678B2Z1', phone: '+91 98765 99999' },
    { id: 'sup-03', name: 'Reddy Laboratories Agency', gstin: '36AABCR9012A3Z2', phone: '+91 99999 88888' },
    { id: 'sup-04', name: 'CarePlus Pharmaceuticals', gstin: '29AABCC4567C4Z3', phone: '+91 91234 56789' }
  ];

  customersDb: Customer[] = [
    { id: 'cust-01', name: 'Poornachandran', phone: '+91 94444 12345', address: '12, Gandhi Road, Chennai' },
    { id: 'cust-02', name: 'Ramesh Kumar', phone: '+91 95555 67890', address: '45, Nehru St, Madurai' },
    { id: 'cust-03', name: 'Anjali Sharma', phone: '+91 98888 11111', address: '78, Ring Rd, Coimbatore' }
  ];

  // Inventory list items
  items: PurchaseItem[] = [];

  // Inventory tab aggregations
  taxableTotal = 0;
  gstTotal = 0;
  grandTotal = 0;

  // New Supplier/Customer Dialog
  showSupplierModal = false;
  showCustomerModal = false;
  
  newSupplierName = '';
  newSupplierPhone = '';
  newSupplierGst = '';

  newCustomerName = '';
  newCustomerPhone = '';
  newCustomerAddress = '';

  // Autocomplete medicine dropdown tracking per index
  activeMedDropdownIndex: number | null = null;
  medSearchQuery = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['tab']) {
        this.activeTab = params['tab'];
      } else {
        this.activeTab = 'sales'; // Default to sales to match screenshot
      }
      this.resetVoucher();
    });
  }

  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  getActiveTabLabel(): string {
    const tab = this.tabs.find(t => t.id === this.activeTab);
    return tab ? tab.label : '';
  }

  // Triggered when switching active tab
  selectTab(tabId: string) {
    this.activeTab = tabId;
    this.narration = '';
    this.generateDefaultVoucherNo();
    this.resetVoucherData();
  }

  generateDefaultVoucherNo() {
    const prefixMap: { [key: string]: string } = {
      sales: 'SAL',
      'sales-return': 'SLR',
      purchase: 'PUR',
      'purchase-return': 'PRR',
      receipt: 'REC',
      payment: 'PAY',
      expense: 'EXP',
      journal: 'JOU',
      contra: 'CON'
    };
    const prefix = prefixMap[this.activeTab] || 'VOU';
    const rand = Math.floor(1000 + Math.random() * 9000);
    this.voucherNo = `${prefix}-${rand}`;
  }

  resetVoucherData() {
    this.taxableTotal = 0;
    this.gstTotal = 0;
    this.grandTotal = 0;
    this.items = [];

    // Reset simple tab models
    this.contraAmount = null;
    this.expenseAmount = null;
    this.expenseHead = '';
    this.receiptAmount = null;
    this.receiptCustomerId = '';
    this.receiptSupplierId = '';
    this.paymentAmount = null;
    this.paymentSupplierId = '';
    this.paymentCustomerId = '';

    if (['sales', 'sales-return', 'purchase', 'purchase-return'].includes(this.activeTab)) {
      this.addItem(); // add first item row
    } else if (this.activeTab === 'journal') {
      this.journalLines = [
        { account: '', debit: null, credit: null },
        { account: '', debit: null, credit: null }
      ];
    }
  }

  resetVoucher() {
    this.generateDefaultVoucherNo();
    this.resetVoucherData();
  }

  // Row controls
  addItem() {
    this.items.push({
      medicineId: '',
      medicineName: '',
      batch: 'B' + Math.floor(1000 + Math.random() * 9000),
      expiry: '2028-12',
      hsn: '300490',
      qty: 1,
      rate: null,
      discPercent: 0,
      gstPercent: 12,
      amount: 0
    });
    this.calculateTotals();
  }

  removeItem(index: number) {
    if (this.items.length > 1) {
      this.items.splice(index, 1);
    } else {
      this.resetVoucherData();
    }
    this.calculateTotals();
  }

  // Autocomplete search
  openMedDropdown(index: number) {
    this.activeMedDropdownIndex = index;
    this.medSearchQuery = this.items[index].medicineName || '';
  }

  closeMedDropdown() {
    setTimeout(() => {
      this.activeMedDropdownIndex = null;
    }, 200);
  }

  selectMedicine(index: number, med: MedicineItem) {
    const item = this.items[index];
    item.medicineId = med.id;
    item.medicineName = med.name;
    item.hsn = med.defaultHsn;
    item.gstPercent = med.defaultGst;
    item.expiry = med.defaultExpiry;
    this.activeMedDropdownIndex = null;
    this.calculateRowAmount(index);
  }

  getFilteredMedicines(query: string): MedicineItem[] {
    if (!query) return this.medicinesDb;
    return this.medicinesDb.filter(m => 
      m.name.toLowerCase().includes(query.toLowerCase()) || 
      m.defaultHsn.includes(query)
    );
  }

  calculateRowAmount(index: number) {
    const item = this.items[index];
    const rateVal = item.rate || 0;
    const baseVal = item.qty * rateVal;
    const discount = baseVal * (item.discPercent / 100);
    const taxable = baseVal - discount;
    
    item.amount = parseFloat(taxable.toFixed(2));
    this.calculateTotals();
  }

  calculateTotals() {
    let taxableSum = 0;
    let gstSum = 0;

    this.items.forEach(item => {
      const rateVal = item.rate || 0;
      const baseVal = item.qty * rateVal;
      const discount = baseVal * (item.discPercent / 100);
      const taxable = baseVal - discount;
      
      taxableSum += taxable;

      if (this.isGstApplicable) {
        const gst = taxable * (item.gstPercent / 100);
        gstSum += gst;
      }
    });

    this.taxableTotal = parseFloat(taxableSum.toFixed(2));
    this.gstTotal = parseFloat(gstSum.toFixed(2));
    this.grandTotal = parseFloat((this.taxableTotal + this.gstTotal).toFixed(2));
  }

  // Supplier modal handlers
  openAddSupplier() {
    this.newSupplierName = '';
    this.newSupplierPhone = '';
    this.newSupplierGst = '';
    this.showSupplierModal = true;
  }

  closeAddSupplier() {
    this.showSupplierModal = false;
  }

  saveSupplier() {
    if (!this.newSupplierName.trim()) return;

    const newId = 'sup-' + (this.suppliersDb.length + 1);
    const newSup: Supplier = {
      id: newId,
      name: this.newSupplierName.trim(),
      phone: this.newSupplierPhone.trim() || undefined,
      gstin: this.newSupplierGst.trim().toUpperCase() || undefined
    };

    this.suppliersDb.push(newSup);
    this.selectedSupplierId = newId;
    if (this.activeTab === 'payment') this.paymentSupplierId = newId;
    if (this.activeTab === 'receipt') this.receiptSupplierId = newId;
    this.closeAddSupplier();
  }

  get selectedSupplier(): Supplier | undefined {
    const id = this.activeTab === 'payment' ? this.paymentSupplierId : (this.activeTab === 'receipt' ? this.receiptSupplierId : this.selectedSupplierId);
    return this.suppliersDb.find(s => s.id === id);
  }

  // Customer modal handlers
  openAddCustomer() {
    this.newCustomerName = '';
    this.newCustomerPhone = '';
    this.newCustomerAddress = '';
    this.showCustomerModal = true;
  }

  closeAddCustomer() {
    this.showCustomerModal = false;
  }

  saveCustomer() {
    if (!this.newCustomerName.trim()) return;

    const newId = 'cust-' + (this.customersDb.length + 1);
    const newCust: Customer = {
      id: newId,
      name: this.newCustomerName.trim(),
      phone: this.newCustomerPhone.trim() || undefined,
      address: this.newCustomerAddress.trim() || undefined
    };

    this.customersDb.push(newCust);
    this.selectedCustomerId = newId;
    if (this.activeTab === 'receipt') this.receiptCustomerId = newId;
    if (this.activeTab === 'payment') this.paymentCustomerId = newId;
    this.closeAddCustomer();
  }

  get selectedCustomer(): Customer | undefined {
    const id = this.activeTab === 'receipt' ? this.receiptCustomerId : (this.activeTab === 'payment' ? this.paymentCustomerId : this.selectedCustomerId);
    return this.customersDb.find(c => c.id === id);
  }

  // Journal handlers
  addJournalLine() {
    this.journalLines.push({ account: '', debit: null, credit: null });
  }

  removeJournalLine(index: number) {
    if (this.journalLines.length > 2) {
      this.journalLines.splice(index, 1);
    }
  }

  get journalDebitTotal(): number {
    return parseFloat(this.journalLines.reduce((sum, line) => sum + (line.debit || 0), 0).toFixed(2));
  }

  get journalCreditTotal(): number {
    return parseFloat(this.journalLines.reduce((sum, line) => sum + (line.credit || 0), 0).toFixed(2));
  }

  get journalDifference(): number {
    return parseFloat(Math.abs(this.journalDebitTotal - this.journalCreditTotal).toFixed(2));
  }

  get journalErrorMessage(): string {
    const diff = this.journalDifference;
    if (this.journalDebitTotal === 0 && this.journalCreditTotal === 0) {
      return 'Fill in required fields (party / expense head / amount or items) to build the entry.';
    }
    if (diff > 0) {
      return `Voucher not balanced. Difference: ₹${diff.toFixed(2)}.`;
    }
    return '';
  }

  // Double-Entry Ledger Preview logic
  get doubleEntryLines() {
    const lines: any[] = [];

    // --- PURCHASE ---
    if (this.activeTab === 'purchase' && this.taxableTotal > 0) {
      lines.push({ account: 'Purchase Account', type: 'Debit', amount: this.taxableTotal });
      if (this.isGstApplicable && this.gstTotal > 0) {
        const halfGst = parseFloat((this.gstTotal / 2).toFixed(2));
        lines.push({ account: 'Input CGST Account', type: 'Debit', amount: halfGst });
        lines.push({ account: 'Input SGST Account', type: 'Debit', amount: parseFloat((this.gstTotal - halfGst).toFixed(2)) });
      }
      const supplierName = this.selectedSupplier ? this.selectedSupplier.name : 'Sundry Creditors (Select Supplier)';
      lines.push({ account: supplierName, type: 'Credit', amount: this.grandTotal });
    }

    // --- PURCHASE RETURN ---
    else if (this.activeTab === 'purchase-return' && this.taxableTotal > 0) {
      const supplierName = this.selectedSupplier ? this.selectedSupplier.name : 'Sundry Creditors (Select Supplier)';
      lines.push({ account: supplierName, type: 'Debit', amount: this.grandTotal });
      lines.push({ account: 'Purchase Return Account', type: 'Credit', amount: this.taxableTotal });
      if (this.isGstApplicable && this.gstTotal > 0) {
        const halfGst = parseFloat((this.gstTotal / 2).toFixed(2));
        lines.push({ account: 'Input CGST Account', type: 'Credit', amount: halfGst });
        lines.push({ account: 'Input SGST Account', type: 'Credit', amount: parseFloat((this.gstTotal - halfGst).toFixed(2)) });
      }
    }

    // --- SALES ---
    else if (this.activeTab === 'sales' && this.taxableTotal > 0) {
      const customerName = this.selectedCustomer ? this.selectedCustomer.name : 'Sundry Debtors (Select Customer)';
      lines.push({ account: customerName, type: 'Debit', amount: this.grandTotal });
      lines.push({ account: 'Sales Account', type: 'Credit', amount: this.taxableTotal });
      if (this.isGstApplicable && this.gstTotal > 0) {
        const halfGst = parseFloat((this.gstTotal / 2).toFixed(2));
        lines.push({ account: 'Output CGST Account', type: 'Credit', amount: halfGst });
        lines.push({ account: 'Output SGST Account', type: 'Credit', amount: parseFloat((this.gstTotal - halfGst).toFixed(2)) });
      }
    }

    // --- SALES RETURN ---
    else if (this.activeTab === 'sales-return' && this.taxableTotal > 0) {
      lines.push({ account: 'Sales Return Account', type: 'Debit', amount: this.taxableTotal });
      if (this.isGstApplicable && this.gstTotal > 0) {
        const halfGst = parseFloat((this.gstTotal / 2).toFixed(2));
        lines.push({ account: 'Output CGST Account', type: 'Debit', amount: halfGst });
        lines.push({ account: 'Output SGST Account', type: 'Debit', amount: parseFloat((this.gstTotal - halfGst).toFixed(2)) });
      }
      const customerName = this.selectedCustomer ? this.selectedCustomer.name : 'Sundry Debtors (Select Customer)';
      lines.push({ account: customerName, type: 'Credit', amount: this.grandTotal });
    }

    // --- CONTRA ---
    else if (this.activeTab === 'contra') {
      const amt = this.contraAmount || 0;
      if (this.contraDirection === 'withdraw') {
        // Bank -> Cash (Cash Debit, Bank Credit)
        lines.push({ account: 'Cash', type: 'Debit', amount: amt });
        lines.push({ account: 'Bank', type: 'Credit', amount: amt });
      } else {
        // Cash -> Bank (Bank Debit, Cash Credit)
        lines.push({ account: 'Bank', type: 'Debit', amount: amt });
        lines.push({ account: 'Cash', type: 'Credit', amount: amt });
      }
    }

    // --- EXPENSE ---
    else if (this.activeTab === 'expense' && this.expenseAmount && this.expenseAmount > 0) {
      const expHead = this.expenseHead || 'Expense Head (Select head)';
      lines.push({ account: expHead, type: 'Debit', amount: this.expenseAmount });
      lines.push({ account: this.expenseMode, type: 'Credit', amount: this.expenseAmount });
    }

    // --- RECEIPT ---
    else if (this.activeTab === 'receipt' && this.receiptAmount && this.receiptAmount > 0) {
      lines.push({ account: this.receiptMode, type: 'Debit', amount: this.receiptAmount });
      
      const cust = this.customersDb.find(c => c.id === this.receiptCustomerId);
      const sup = this.suppliersDb.find(s => s.id === this.receiptSupplierId);
      
      if (cust && sup) {
        // If both selected, credit both by splitting or list them. Let's credit the customer first, or combine names.
        lines.push({ account: `${cust.name} / ${sup.name}`, type: 'Credit', amount: this.receiptAmount });
      } else if (cust) {
        lines.push({ account: cust.name, type: 'Credit', amount: this.receiptAmount });
      } else if (sup) {
        lines.push({ account: sup.name, type: 'Credit', amount: this.receiptAmount });
      } else {
        lines.push({ account: 'Party (Select customer or supplier)', type: 'Credit', amount: this.receiptAmount });
      }
    }

    // --- PAYMENT ---
    else if (this.activeTab === 'payment' && this.paymentAmount && this.paymentAmount > 0) {
      const cust = this.customersDb.find(c => c.id === this.paymentCustomerId);
      const sup = this.suppliersDb.find(s => s.id === this.paymentSupplierId);
      
      if (cust && sup) {
        lines.push({ account: `${sup.name} / ${cust.name}`, type: 'Debit', amount: this.paymentAmount });
      } else if (sup) {
        lines.push({ account: sup.name, type: 'Debit', amount: this.paymentAmount });
      } else if (cust) {
        lines.push({ account: cust.name, type: 'Debit', amount: this.paymentAmount });
      } else {
        lines.push({ account: 'Party (Select supplier or customer)', type: 'Debit', amount: this.paymentAmount });
      }
      lines.push({ account: this.paymentMode, type: 'Credit', amount: this.paymentAmount });
    }

    // --- JOURNAL ---
    else if (this.activeTab === 'journal') {
      this.journalLines.forEach(line => {
        const accName = line.account || 'Account (Select account)';
        if (line.debit && line.debit > 0) {
          lines.push({ account: accName, type: 'Debit', amount: line.debit });
        }
        if (line.credit && line.credit > 0) {
          lines.push({ account: accName, type: 'Credit', amount: line.credit });
        }
      });
    }

    return lines;
  }

  // Local Toast notification system
  toastMessage = '';
  toastVisible = false;
  toastTimeout: any;

  showToast(message: string) {
    if (this.toastTimeout) {
      clearTimeout(this.toastTimeout);
    }
    this.toastMessage = message;
    this.toastVisible = true;
    this.toastTimeout = setTimeout(() => {
      this.toastVisible = false;
    }, 4000);
  }

  saveVoucher() {
    this.showToast(`Voucher ${this.voucherNo} created successfully!`);
    this.resetVoucher();
  }

  isSaveEnabled(): boolean {
    if (['sales', 'sales-return', 'purchase', 'purchase-return'].includes(this.activeTab)) {
      const partySelected = ['sales', 'sales-return'].includes(this.activeTab) ? true : !!this.selectedSupplierId;
      return this.grandTotal > 0 && partySelected;
    }
    if (this.activeTab === 'receipt') {
      return (!!this.receiptCustomerId || !!this.receiptSupplierId) && !!this.receiptAmount && this.receiptAmount > 0;
    }
    if (this.activeTab === 'payment') {
      return (!!this.paymentSupplierId || !!this.paymentCustomerId) && !!this.paymentAmount && this.paymentAmount > 0;
    }
    if (this.activeTab === 'expense') {
      return !!this.expenseHead && !!this.expenseAmount && this.expenseAmount > 0;
    }
    if (this.activeTab === 'contra') {
      return !!this.contraAmount && this.contraAmount > 0;
    }
    if (this.activeTab === 'journal') {
      return this.journalDebitTotal > 0 && this.journalDifference === 0;
    }
    return false;
  }
}
