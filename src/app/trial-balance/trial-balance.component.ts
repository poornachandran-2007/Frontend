import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-trial-balance',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './trial-balance.component.html',
  styleUrls: ['./trial-balance.component.css']
})
export class TrialBalanceComponent implements OnInit {
  accounts: any[] = [];
  
  totalDebit = 0.00;
  totalCredit = 0.00;

  constructor() {}

  ngOnInit() {
    // Fetch trial balance data here
  }
}
