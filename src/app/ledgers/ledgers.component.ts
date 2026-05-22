import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface LedgerItem {
  account: string;
  group: string;
  balance: number;
}

interface LedgerTransaction {
  date: string;
  voucher: string;
  party: string;
  particulars: string;
  debit: number | null;
  credit: number | null;
}

@Component({
  selector: 'app-ledgers',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './ledgers.component.html',
  styleUrls: ['./ledgers.component.css']
})
export class LedgersComponent implements OnInit {
  selectedLedger: LedgerItem | null = null;

  // Exact 12 lines from your screenshot with 0.00 default values
  ledgerList: LedgerItem[] = [
    { account: 'Bank', group: 'Asset', balance: 0.00 },
    { account: 'Cash', group: 'Asset', balance: 0.00 },
    { account: 'GST Input', group: 'Asset', balance: 0.00 },
    { account: 'Stock', group: 'Asset', balance: 0.00 },
    { account: 'Sundry Debtors', group: 'Asset', balance: 0.00 },
    { account: 'GST Output', group: 'Liability', balance: 0.00 },
    { account: 'PCSD Distributors', group: 'Liability', balance: 0.00 },
    { account: 'Sundry Creditors', group: 'Liability', balance: 0.00 },
    { account: 'Cash Difference', group: 'Income', balance: 0.00 },
    { account: 'Round Off', group: 'Income', balance: 0.00 },
    { account: 'Sales', group: 'Income', balance: 0.00 },
    { account: 'Sales Return', group: 'Income', balance: 0.00 }
  ];

  // Dynamic details when drilled into
  transactions: { [key: string]: LedgerTransaction[] } = {
    'Bank': [
      { date: '19-05-2026', voucher: 'CON-0002', party: 'Self', particulars: 'Cash Account (Contra Deposit)', debit: 35000.00, credit: null },
      { date: '15-05-2026', voucher: 'EXP-0112', party: 'Office Landlord', particulars: 'Rent Expense Account', debit: null, credit: 15000.00 }
    ],
    'Cash': [
      { date: '19-05-2026', voucher: 'CON-0002', party: 'Self', particulars: 'Bank Account (Contra Deposit)', debit: null, credit: 35000.00 },
      { date: '16-05-2026', voucher: 'EXP-0113', party: 'Electricity Board', particulars: 'Electricity Expense Account', debit: null, credit: 4500.00 }
    ],
    'GST Input': [
      { date: '17-05-2026', voucher: 'PUR-3045', party: 'Apex Pharma Distributors', particulars: 'Input Tax Credit CGST/SGST 6%', debit: 5760.00, credit: null },
      { date: '18-05-2026', voucher: 'PRR-0891', party: 'Apex Pharma Distributors', particulars: 'Tax Claim Reversal CGST/SGST 6%', debit: null, credit: 720.00 }
    ],
    'Sales': [
      { date: '19-05-2026', voucher: 'SAL-1024', party: 'Poornachandran', particulars: 'Sales Billing posting', debit: null, credit: 20000.00 },
      { date: '18-05-2026', voucher: 'SAL-1023', party: 'Ramesh Kumar', particulars: 'Sales billing posting', debit: null, credit: 15400.00 }
    ]
  };

  ngOnInit(): void {}

  selectLedger(item: LedgerItem) {
    this.selectedLedger = item;
  }

  clearSelection() {
    this.selectedLedger = null;
  }

  getSelectedLedgerTransactions(): LedgerTransaction[] {
    if (!this.selectedLedger) return [];
    return this.transactions[this.selectedLedger.account] || [];
  }

  hasTransactions(): boolean {
    return this.getSelectedLedgerTransactions().length > 0;
  }
}
