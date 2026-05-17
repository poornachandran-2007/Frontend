import { Routes } from '@angular/router';
import { CustomerInfoComponent } from './customer-info/customer-info.component';
import { SupplierInfoComponent } from './supplier-info/supplier-info.component';
import { DoctorInfoComponent } from './doctor-info/doctor-info.component';
import { MedicineListComponent } from './medicine-list/medicine-list.component';

export const routes: Routes = [
  { path: 'customer-info', component: CustomerInfoComponent },
  { path: 'supplier-info', component: SupplierInfoComponent },
  { path: 'doctor-info', component: DoctorInfoComponent },
  { path: 'medicine-list', component: MedicineListComponent }
];
