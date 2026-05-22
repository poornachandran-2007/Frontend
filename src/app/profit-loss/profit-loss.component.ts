import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface PlItem {
  name: string;
  liveAmount: number;
}

@Component({
  selector: 'app-profit-loss',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './profit-loss.component.html',
  styleUrls: ['./profit-loss.component.css']
})
export class ProfitLossComponent implements OnInit {
  isLiveMode = false;

  incomeItems: PlItem[] = [
    { name: 'Sales', liveAmount: 35400.00 },
    { name: 'Sales Return', liveAmount: -4500.00 }, // Subtracted from Income
    { name: 'Discount Received', liveAmount: 1200.00 },
    { name: 'Cash Difference', liveAmount: 0.00 },
    { name: 'Round Off', liveAmount: 0.00 }
  ];

  expenseItems: PlItem[] = [
    { name: 'Purchase', liveAmount: 48000.00 },
    { name: 'Purchase Return', liveAmount: -6000.00 }, // Purchase Return reversal credits
    { name: 'Rent', liveAmount: 15000.00 },
    { name: 'Electricity', liveAmount: 4500.00 },
    { name: 'Salary', liveAmount: 28000.00 },
    { name: 'Office Maintenance', liveAmount: 3200.00 }
  ];

  ngOnInit(): void {}

  toggleMode() {
    this.isLiveMode = !this.isLiveMode;
  }

  getTotalIncome(): number {
    if (!this.isLiveMode) return 0;
    return this.incomeItems.reduce((sum, item) => sum + item.liveAmount, 0);
  }

  getTotalExpense(): number {
    if (!this.isLiveMode) return 0;
    return this.expenseItems.reduce((sum, item) => sum + item.liveAmount, 0);
  }

  getNetValue(): number {
    if (!this.isLiveMode) return 0;
    return this.getTotalIncome() - this.getTotalExpense();
  }

  getNetProfitLabel(): string {
    if (!this.isLiveMode) return 'Net Profit';
    return this.getNetValue() >= 0 ? 'Net Profit' : 'Net Loss';
  }
}
