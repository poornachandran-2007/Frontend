import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

interface DashboardCard {
  label: string;
  value: string;
  isNegative?: boolean;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  cards: DashboardCard[] = [
    { label: 'CASH', value: '₹0.00' },
    { label: 'BANK', value: '₹0.00' },
    { label: 'TOTAL SALES', value: '₹-0.00', isNegative: true },
    { label: 'TOTAL PURCHASES', value: '₹0.00' },
    { label: 'DEBTORS (TO RECEIVE)', value: '₹0.00' },
    { label: 'CREDITORS (TO PAY)', value: '₹0.00' }
  ];

  quickActions = [
    { label: 'Sale', icon: 'sale', tab: 'sales', primary: true },
    { label: 'Purchase', icon: 'purchase', tab: 'purchase', primary: false },
    { label: 'Payment', icon: 'payment', tab: 'payment', primary: false },
    { label: 'Expense', icon: 'expense', tab: 'expense', primary: false }
  ];

  guideItems = [
    { text: 'Sale', desc: 'increases Cash/Bank/Customer (Dr) and Sales (Cr).' },
    { text: 'Purchase', desc: 'increases Purchases (Dr) and Supplier (Cr).' },
    { text: 'Payment', desc: 'reduces Cash/Bank (Cr) and reduces Supplier (Dr).' },
    { text: 'Receipt', desc: 'increases Cash/Bank (Dr) and reduces Customer (Cr).' },
    { text: 'Every voucher must have ΣDebit = ΣCredit.' }
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {}

  triggerAction(tab: string) {
    this.router.navigate(['/day-book'], { queryParams: { tab: tab } });
  }
}
