import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from './auth.service';

interface SidebarItem {
  label: string;
  route: string;
  iconName: string;
  comingSoon?: boolean;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  userEmail = 'poornachandran02042007@gmail.com';
  activeRoute = '';

  sidebarItems: SidebarItem[] = [
    { label: 'Dashboard', route: '/dashboard', iconName: 'dashboard' },
    { label: 'Day Book', route: '/day-book', iconName: 'book' },
    { label: 'Reports (Dr/Cr)', route: '/reports', iconName: 'reports' },
    { label: 'Chart of Accounts', route: '/chart-of-accounts', iconName: 'accounts' },
    { label: 'Ledgers', route: '/ledgers', iconName: 'ledgers' },
    { label: 'Period Statement', route: '/period-statement', iconName: 'statement' },
    { label: 'Debtors / Creditors', route: '/customer-info', iconName: 'users' },
    { label: 'Trial Balance', route: '/trial-balance', iconName: 'scale' },
    { label: 'Profit & Loss', route: '/profit-loss', iconName: 'trending' },
    { label: 'Cheques', route: '/cheques', iconName: 'cheque' }
  ];

  // Mobile sidebar status
  isSidebarExpanded = true;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit() {
    // Monitor route changes to keep active item in sync
    this.activeRoute = this.router.url;
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.activeRoute = event.urlAfterRedirects || event.url;
    });
  }

  get isLoginPage(): boolean {
    return this.activeRoute === '/login' || this.activeRoute.startsWith('/login?');
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  navigate(item: SidebarItem) {
    if (item.comingSoon) {
      // Direct to day-book but show a temporary toast info
      this.showToast(`The "${item.label}" ledger report module is in demo mode. Loading Day Book instead.`);
      this.router.navigate(['/day-book']);
      return;
    }
    this.router.navigate([item.route]);
  }

  isItemActive(item: SidebarItem): boolean {
    if (item.route === '/day-book' && (this.activeRoute === '/' || this.activeRoute === '/day-book')) {
      return true;
    }
    return this.activeRoute.includes(item.route);
  }

  toggleSidebar() {
    this.isSidebarExpanded = !this.isSidebarExpanded;
  }

  // Beautiful toast alert system
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
}
