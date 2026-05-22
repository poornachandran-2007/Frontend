import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-period-statement',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './period-statement.component.html',
  styleUrls: ['./period-statement.component.css'],
  providers: [DatePipe]
})
export class PeriodStatementComponent implements OnInit {
  fromDate: string = '';
  toDate: string = '';

  accounts: any[] = [];
  
  totalOpeningDr = 0.00;
  totalOpeningCr = 0.00;
  totalPeriodDr = 0.00;
  totalPeriodCr = 0.00;
  totalClosingDr = 0.00;
  totalClosingCr = 0.00;

  constructor(private datePipe: DatePipe) {}

  ngOnInit() {
    this.setThisMonth();
  }

  setThisMonth() {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    this.fromDate = this.formatDate(firstDay);
    this.toDate = this.formatDate(today);
  }

  setThisFY() {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth(); // 0-11
    
    // Assuming FY starts from April 1st
    let startYear = currentYear;
    if (currentMonth < 3) {
      startYear = currentYear - 1;
    }
    
    const firstDay = new Date(startYear, 3, 1);
    this.fromDate = this.formatDate(firstDay);
    this.toDate = this.formatDate(today);
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  get isTally(): boolean {
    return Math.abs(this.totalPeriodDr - this.totalPeriodCr) < 0.01;
  }
}
