import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cheques',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cheques.component.html',
  styleUrls: ['./cheques.component.css']
})
export class ChequesComponent implements OnInit {
  cheques: any[] = [];

  constructor() {}

  ngOnInit() {
    // Fetch cheques data here
  }
}
