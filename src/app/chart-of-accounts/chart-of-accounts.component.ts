import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

interface CoaAccount {
  name: string;
  group: string;
  party: boolean;
}

@Component({
  selector: 'app-chart-of-accounts',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './chart-of-accounts.component.html',
  styleUrls: ['./chart-of-accounts.component.css']
})
export class ChartOfAccountsComponent implements OnInit {
  // Add Account form bindings
  newAccountName = '';
  newAccountGroup = 'Liability';
  isParty = false;

  // 19 pre-seeded accounts exactly matching database and your screenshot
  accounts: CoaAccount[] = [
    { name: 'Bank', group: 'Asset', party: false },
    { name: 'Cash', group: 'Asset', party: false },
    { name: 'GST Input', group: 'Asset', party: false },
    { name: 'Stock', group: 'Asset', party: false },
    { name: 'Sundry Debtors', group: 'Asset', party: false },
    { name: 'GST Output', group: 'Liability', party: false },
    { name: 'PCSD Distributors', group: 'Liability', party: true },
    { name: 'Apex Pharma Distributors', group: 'Liability', party: true },
    { name: 'MedLife Wholesalers Ltd', group: 'Liability', party: true },
    { name: 'Reddy Laboratories Agency', group: 'Liability', party: true },
    { name: 'CarePlus Pharmaceuticals', group: 'Liability', party: true },
    { name: 'Poornachandran', group: 'Asset', party: true },
    { name: 'Ramesh Kumar', group: 'Asset', party: true },
    { name: 'Anjali Sharma', group: 'Asset', party: true },
    { name: 'Rent Expense', group: 'Expense', party: false },
    { name: 'Salary Expense', group: 'Expense', party: false },
    { name: 'Electricity Expense', group: 'Expense', party: false },
    { name: 'Sales Account', group: 'Revenue', party: false },
    { name: 'Purchase Account', group: 'Expense', party: false }
  ];

  ngOnInit(): void {}

  toggleParty() {
    this.isParty = !this.isParty;
  }

  addAccount() {
    if (!this.newAccountName.trim()) return;

    this.accounts.push({
      name: this.newAccountName.trim(),
      group: this.newAccountGroup,
      party: this.isParty
    });

    // Reset form bindings
    this.newAccountName = '';
    this.isParty = false;
  }
}
