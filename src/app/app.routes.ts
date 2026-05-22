import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CustomerInfoComponent } from './customer-info/customer-info.component';
import { SupplierInfoComponent } from './supplier-info/supplier-info.component';
import { DoctorInfoComponent } from './doctor-info/doctor-info.component';
import { MedicineListComponent } from './medicine-list/medicine-list.component';
import { DayBookComponent } from './day-book/day-book.component';
import { ReportsComponent } from './reports/reports.component';
import { ChartOfAccountsComponent } from './chart-of-accounts/chart-of-accounts.component';
import { LedgersComponent } from './ledgers/ledgers.component';
import { ProfitLossComponent } from './profit-loss/profit-loss.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './auth.guard';
import { TrialBalanceComponent } from './trial-balance/trial-balance.component';
import { ChequesComponent } from './cheques/cheques.component';
import { PeriodStatementComponent } from './period-statement/period-statement.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'day-book', component: DayBookComponent, canActivate: [AuthGuard] },
  { path: 'reports', component: ReportsComponent, canActivate: [AuthGuard] },
  { path: 'chart-of-accounts', component: ChartOfAccountsComponent, canActivate: [AuthGuard] },
  { path: 'ledgers', component: LedgersComponent, canActivate: [AuthGuard] },
  { path: 'period-statement', component: PeriodStatementComponent, canActivate: [AuthGuard] },
  { path: 'trial-balance', component: TrialBalanceComponent, canActivate: [AuthGuard] },
  { path: 'profit-loss', component: ProfitLossComponent, canActivate: [AuthGuard] },
  { path: 'cheques', component: ChequesComponent, canActivate: [AuthGuard] },
  { path: 'customer-info', component: CustomerInfoComponent, canActivate: [AuthGuard] },
  { path: 'supplier-info', component: SupplierInfoComponent, canActivate: [AuthGuard] },
  { path: 'doctor-info', component: DoctorInfoComponent, canActivate: [AuthGuard] },
  { path: 'medicine-list', component: MedicineListComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
];
