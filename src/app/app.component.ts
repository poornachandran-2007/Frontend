import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private router: Router) { }

  navigations = [
    {
      title: 'Master management',
      isOpen: false,
      items: ['Customer Info', 'Supplier Info', 'Medicine List', 'Doctors', 'Batch Data']
    },
    {
      title: 'Home',
      isOpen: false,
      items: ['Dashboard', 'Recent Activity', 'Notifications', 'Settings', 'Profile']
    },
    {
      title: 'About',
      isOpen: false,
      items: ['Company Info', 'Our Team', 'Careers', 'Partners', 'Press']
    },
    {
      title: 'Contact',
      isOpen: false,
      items: ['Support', 'Sales', 'Locations', 'Feedback', 'FAQ']
    },
    {
      title: 'Help',
      isOpen: false,
      items: ['User Guide', 'Tutorials', 'API Docs', 'Troubleshooting', 'Report Issue']
    }
  ];

  toggleDropdown(nav: any, event: Event) {
    event.stopPropagation();
    // Close others
    this.navigations.forEach(n => {
      if (n !== nav) n.isOpen = false;
    });
    // Toggle current
    nav.isOpen = !nav.isOpen;
  }

  closeAll() {
    this.navigations.forEach(n => n.isOpen = false);
  }

  onItemClick(item: string, event: Event) {
    event.stopPropagation();
    if (item === 'Customer Info') {
      this.router.navigate(['/customer-info']);
    } else if (item === 'Supplier Info') {
      this.router.navigate(['/supplier-info']);
    } else if (item === 'Medicine List') {
      this.router.navigate(['/medicine-list']);
    } else if (item === 'Doctors') {
      this.router.navigate(['/doctor-info']);
    } else {
      // Fallback for other items
      this.router.navigate(['/customer-info']);
    }
    this.closeAll();
  }
}
