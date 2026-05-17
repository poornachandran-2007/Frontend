import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-customer-info',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './customer-info.component.html',
  styleUrls: ['./customer-info.component.css']
})
export class CustomerInfoComponent implements OnInit {
  customers: any[] = [];
  loading = true;
  error = '';

  newCustomer: any = {
    customer_name: '',
    address: '',
    mobile: '',
    doctor_id: null,
    customer_type: ''
  };

  apiUrl = '/api/customers/';
  searchQuery = '';
  
  // Modal states
  isModalOpen = false;
  modalType: 'add' | 'edit' | 'delete' = 'add';
  selectedCustomer: any = null;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchCustomers();
  }

  fetchCustomers() {
    this.loading = true;
    const url = this.searchQuery ? `${this.apiUrl}?search=${this.searchQuery}` : this.apiUrl;
    this.http.get(url).subscribe({
      next: (data: any) => {
        this.customers = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching customers:', err);
        const msg = err.error?.message || err.message || 'Unknown error';
        this.error = `Failed to load customer data: ${err.status} - ${msg}`;
        this.loading = false;
      }
    });
  }

  openModal(type: 'add' | 'edit' | 'delete', customer?: any) {
    this.modalType = type;
    this.selectedCustomer = customer ? { ...customer } : { ...this.newCustomer };
    
    // If editing, extract the doctor ID from the nested object
    if (customer && customer.doctor) {
      this.selectedCustomer.doctor_id = customer.doctor.id;
    }
    
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedCustomer = null;
  }

  handleModalSubmit() {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    
    if (this.modalType === 'add') {
      console.log('Sending Customer Payload:', this.selectedCustomer);
      this.http.post(`${this.apiUrl}create/`, this.selectedCustomer, { headers }).subscribe({
        next: (res: any) => {
          alert(res.message || 'Customer created successfully');
          this.fetchCustomers();
          this.closeModal();
        },
        error: (err) => {
          console.error('Add error:', err);
          const msg = err.error?.message || err.message || 'Unknown error';
          alert(`Failed to create customer: ${err.status} - ${msg}`);
        }
      });
    } else if (this.modalType === 'edit') {
      const url = this.selectedCustomer.id ? `${this.apiUrl}update/${this.selectedCustomer.id}/` : this.apiUrl;
      this.http.put(url, this.selectedCustomer, { headers }).subscribe({
        next: (res: any) => {
          alert(res.message || 'Customer updated successfully');
          this.fetchCustomers();
          this.closeModal();
        },
        error: (err) => {
          console.error('Edit error:', err);
          const msg = err.error?.message || err.message || 'Unknown error';
          alert(`Failed to update customer: ${err.status} - ${msg}`);
        }
      });
    } else if (this.modalType === 'delete') {
      const url = this.selectedCustomer.id ? `${this.apiUrl}delete/${this.selectedCustomer.id}/` : this.apiUrl;
      this.http.delete(url, { headers }).subscribe({
        next: (res: any) => {
          alert(res.message || 'Customer deleted successfully');
          this.fetchCustomers();
          this.closeModal();
        },
        error: (err) => {
          console.error('Delete error:', err);
          const msg = err.error?.message || err.message || 'Unknown error';
          alert(`Failed to delete customer: ${err.status} - ${msg}`);
        }
      });
    }
  }
}
