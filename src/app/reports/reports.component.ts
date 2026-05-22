import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface SummaryRow {
  type: string;
  vouchers: number;
  debit: number;
  credit: number;
}

interface TabItem {
  id: string;
  label: string;
}

interface AccountTotal {
  account: string;
  total: number;
  type: 'Debit' | 'Credit';
}

interface EntryRow {
  date: string;
  voucher: string;
  party: string;
  account: string;
  narration: string;
  debit: number | null;
  credit: number | null;
}

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {
  activeTab = 'sales';

  tabs: TabItem[] = [
    { id: 'sales', label: 'Sales' },
    { id: 'purchases', label: 'Purchases' },
    { id: 'sales-return', label: 'Sales Return' },
    { id: 'purchase-return', label: 'Purchase Return' },
    { id: 'expenses', label: 'Expenses' },
    { id: 'banking', label: 'Banking (Cash & Bank)' }
  ];

  overallSummary: SummaryRow[] = [
    { type: 'Sales', vouchers: 2, debit: 39648.00, credit: 39648.00 },
    { type: 'Purchases', vouchers: 1, debit: 53760.00, credit: 53760.00 },
    { type: 'Sales Return', vouchers: 1, debit: 5040.00, credit: 5040.00 },
    { type: 'Purchase Return', vouchers: 1, debit: 6720.00, credit: 6720.00 },
    { type: 'Expenses', vouchers: 2, debit: 19500.00, credit: 19500.00 },
    { type: 'Banking (Cash & Bank)', vouchers: 1, debit: 35000.00, credit: 35000.00 }
  ];

  tabTotals: { [key: string]: AccountTotal[] } = {
    sales: [
      { account: 'Sales Account', total: 35400.00, type: 'Credit' },
      { account: 'Output CGST Account', total: 2124.00, type: 'Credit' },
      { account: 'Output SGST Account', total: 2124.00, type: 'Credit' },
      { account: 'Poornachandran (Customer)', total: 22400.00, type: 'Debit' },
      { account: 'Ramesh Kumar (Customer)', total: 17248.00, type: 'Debit' }
    ],
    purchases: [
      { account: 'Purchase Account', total: 48000.00, type: 'Debit' },
      { account: 'Input CGST Account', total: 2880.00, type: 'Debit' },
      { account: 'Input SGST Account', total: 2880.00, type: 'Debit' },
      { account: 'Apex Pharma Distributors (Supplier)', total: 53760.00, type: 'Credit' }
    ],
    'sales-return': [
      { account: 'Sales Return Account', total: 4500.00, type: 'Debit' },
      { account: 'Output CGST Account', total: 270.00, type: 'Debit' },
      { account: 'Output SGST Account', total: 270.00, type: 'Debit' },
      { account: 'Poornachandran (Customer)', total: 5040.00, type: 'Credit' }
    ],
    'purchase-return': [
      { account: 'Purchase Return Account', total: 6000.00, type: 'Credit' },
      { account: 'Input CGST Account', total: 360.00, type: 'Credit' },
      { account: 'Input SGST Account', total: 360.00, type: 'Credit' },
      { account: 'Apex Pharma Distributors (Supplier)', total: 6720.00, type: 'Debit' }
    ],
    expenses: [
      { account: 'Rent Expense', total: 15000.00, type: 'Debit' },
      { account: 'Electricity Expense', total: 4500.00, type: 'Debit' },
      { account: 'Cash Account', total: 4500.00, type: 'Credit' },
      { account: 'Bank Account', total: 15000.00, type: 'Credit' }
    ],
    banking: [
      { account: 'Bank Account', total: 35000.00, type: 'Debit' },
      { account: 'Cash Account', total: 35000.00, type: 'Credit' }
    ]
  };

  tabEntries: { [key: string]: EntryRow[] } = {
    sales: [
      { date: '19-05-2026', voucher: 'SAL-1024', party: 'Poornachandran', account: 'Poornachandran', narration: 'Sales billing posting', debit: 22400.00, credit: null },
      { date: '19-05-2026', voucher: 'SAL-1024', party: 'Poornachandran', account: 'Sales Account', narration: 'Medicines billing', debit: null, credit: 20000.00 },
      { date: '19-05-2026', voucher: 'SAL-1024', party: 'Poornachandran', account: 'Output CGST Account', narration: 'GST 6%', debit: null, credit: 1200.00 },
      { date: '19-05-2026', voucher: 'SAL-1024', party: 'Poornachandran', account: 'Output SGST Account', narration: 'GST 6%', debit: null, credit: 1200.00 },
      { date: '18-05-2026', voucher: 'SAL-1023', party: 'Ramesh Kumar', account: 'Ramesh Kumar', narration: 'Sales billing posting', debit: 17248.00, credit: null },
      { date: '18-05-2026', voucher: 'SAL-1023', party: 'Ramesh Kumar', account: 'Sales Account', narration: 'Medicines retail', debit: null, credit: 15400.00 },
      { date: '18-05-2026', voucher: 'SAL-1023', party: 'Ramesh Kumar', account: 'Output CGST Account', narration: 'GST 6%', debit: null, credit: 924.00 },
      { date: '18-05-2026', voucher: 'SAL-1023', party: 'Ramesh Kumar', account: 'Output SGST Account', narration: 'GST 6%', debit: null, credit: 924.00 }
    ],
    purchases: [
      { date: '17-05-2026', voucher: 'PUR-3045', party: 'Apex Pharma Distributors', account: 'Purchase Account', narration: 'Stock replenishment', debit: 48000.00, credit: null },
      { date: '17-05-2026', voucher: 'PUR-3045', party: 'Apex Pharma Distributors', account: 'Input CGST Account', narration: 'CGST 6%', debit: 2880.00, credit: null },
      { date: '17-05-2026', voucher: 'PUR-3045', party: 'Apex Pharma Distributors', account: 'Input SGST Account', narration: 'SGST 6%', debit: 2880.00, credit: null },
      { date: '17-05-2026', voucher: 'PUR-3045', party: 'Apex Pharma Distributors', account: 'Apex Pharma Distributors (Supplier)', narration: 'Purchase posting', debit: null, credit: 53760.00 }
    ],
    'sales-return': [
      { date: '19-05-2026', voucher: 'SLR-0412', party: 'Poornachandran', account: 'Sales Return Account', narration: 'Medicines damaged return', debit: 4500.00, credit: null },
      { date: '19-05-2026', voucher: 'SLR-0412', party: 'Poornachandran', account: 'Output CGST Account', narration: 'Tax reversal', debit: 270.00, credit: null },
      { date: '19-05-2026', voucher: 'SLR-0412', party: 'Poornachandran', account: 'Output SGST Account', narration: 'Tax reversal', debit: 270.00, credit: null },
      { date: '19-05-2026', voucher: 'SLR-0412', party: 'Poornachandran', account: 'Poornachandran', narration: 'Sales Return posting', debit: null, credit: 5040.00 }
    ],
    'purchase-return': [
      { date: '18-05-2026', voucher: 'PRR-0891', party: 'Apex Pharma Distributors', account: 'Apex Pharma Distributors (Supplier)', narration: 'Return of expired stock', debit: 6720.00, credit: null },
      { date: '18-05-2026', voucher: 'PRR-0891', party: 'Apex Pharma Distributors', account: 'Purchase Return Account', narration: 'Return of expired stock', debit: null, credit: 6000.00 },
      { date: '18-05-2026', voucher: 'PRR-0891', party: 'Apex Pharma Distributors', account: 'Input CGST Account', narration: 'Tax credit claim', debit: null, credit: 360.00 },
      { date: '18-05-2026', voucher: 'PRR-0891', party: 'Apex Pharma Distributors', account: 'Input SGST Account', narration: 'Tax credit claim', debit: null, credit: 360.00 }
    ],
    expenses: [
      { date: '15-05-2026', voucher: 'EXP-0112', party: 'Office Landlord', account: 'Rent Expense', narration: 'Monthly office rent', debit: 15000.00, credit: null },
      { date: '15-05-2026', voucher: 'EXP-0112', party: 'Office Landlord', account: 'Bank Account', narration: 'Paid via NetBanking', debit: null, credit: 15000.00 },
      { date: '16-05-2026', voucher: 'EXP-0113', party: 'Electricity Board', account: 'Electricity Expense', narration: 'Electricity charges', debit: 4500.00, credit: null },
      { date: '16-05-2026', voucher: 'EXP-0113', party: 'Electricity Board', account: 'Cash Account', narration: 'Paid cash', debit: null, credit: 4500.00 }
    ],
    banking: [
      { date: '19-05-2026', voucher: 'CON-0002', party: 'Self', account: 'Bank Account', narration: 'Cash deposited to Bank', debit: 35000.00, credit: null },
      { date: '19-05-2026', voucher: 'CON-0002', party: 'Self', account: 'Cash Account', narration: 'Cash deposited to Bank', debit: null, credit: 35000.00 }
    ]
  };

  ngOnInit(): void {}

  selectTab(tabId: string) {
    this.activeTab = tabId;
  }

  getActiveTabLabel(): string {
    const tab = this.tabs.find(t => t.id === this.activeTab);
    return tab ? tab.label : '';
  }

  getActiveTabTotals(): AccountTotal[] {
    return this.tabTotals[this.activeTab] || [];
  }

  getActiveTabEntries(): EntryRow[] {
    return this.tabEntries[this.activeTab] || [];
  }

  hasTotals(): boolean {
    return this.getActiveTabTotals().length > 0;
  }

  hasEntries(): boolean {
    return this.getActiveTabEntries().length > 0;
  }

  get totalVouchers(): number {
    return this.overallSummary.reduce((sum, s) => sum + s.vouchers, 0);
  }

  get grandTotalDebit(): number {
    return this.overallSummary.reduce((sum, s) => sum + s.debit, 0);
  }

  get grandTotalCredit(): number {
    return this.overallSummary.reduce((sum, s) => sum + s.credit, 0);
  }
}
