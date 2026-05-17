import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-supplier-info',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './supplier-info.component.html',
  styleUrls: ['./supplier-info.component.css']
})
export class SupplierInfoComponent implements OnInit {
  suppliers: any[] = [];
  loading = true;
  error = '';
  
  newSupplier: any = {
    supplier_name: '',
    company_name: '',
    agent_name: '',
    address: '',
    phone: '',
    gst_number: '',
    htc_number: '',
    drug_license_number: ''
  };

  apiUrl = '/api/suppliers/';
  searchQuery = '';
  
  // Modal states
  isModalOpen = false;
  modalType: 'add' | 'edit' | 'delete' = 'add';
  selectedSupplier: any = null;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchSuppliers();
  }

  fetchSuppliers() {
    this.loading = true;
    const url = this.searchQuery ? `${this.apiUrl}?search=${this.searchQuery}` : this.apiUrl;
    this.http.get(url).subscribe({
      next: (data: any) => {
        this.suppliers = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching suppliers:', err);
        const msg = err.error?.message || err.message || 'Unknown error';
        this.error = `Failed to load supplier data: ${err.status} - ${msg}`;
        this.loading = false;
      }
    });
  }

  openModal(type: 'add' | 'edit' | 'delete', supplier?: any) {
    this.modalType = type;
    this.selectedSupplier = supplier ? { ...supplier } : { ...this.newSupplier };
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedSupplier = null;
  }

  handleModalSubmit() {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    
    if (this.modalType === 'add') {
      console.log('Sending Supplier Payload:', this.selectedSupplier);
      this.http.post(`${this.apiUrl}create/`, this.selectedSupplier, { headers }).subscribe({
        next: (res: any) => {
          alert(res.message || 'Supplier created successfully');
          this.fetchSuppliers();
          this.closeModal();
        },
        error: (err) => {
          console.error('Add error:', err);
          const msg = err.error?.message || err.message || 'Unknown error';
          alert(`Failed to create supplier: ${err.status} - ${msg}`);
        }
      });
    } else if (this.modalType === 'edit') {
      const url = this.selectedSupplier.id ? `${this.apiUrl}update/${this.selectedSupplier.id}/` : this.apiUrl;
      this.http.put(url, this.selectedSupplier, { headers }).subscribe({
        next: (res: any) => {
          alert(res.message || 'Supplier updated successfully');
          this.fetchSuppliers();
          this.closeModal();
        },
        error: (err) => {
          console.error('Edit error:', err);
          const msg = err.error?.message || err.message || 'Unknown error';
          alert(`Failed to update supplier: ${err.status} - ${msg}`);
        }
      });
    } else if (this.modalType === 'delete') {
      const url = this.selectedSupplier.id ? `${this.apiUrl}delete/${this.selectedSupplier.id}` : this.apiUrl;
      this.http.delete(url, { headers }).subscribe({
        next: (res: any) => {
          alert(res.message || 'Supplier deleted successfully');
          this.fetchSuppliers();
          this.closeModal();
        },
        error: (err) => {
          console.error('Delete error:', err);
          let msg = err.error?.message || err.message || 'Unknown error';
          if (msg.includes('IntegrityError') || msg.includes('foreign key constraint')) {
            msg = 'Cannot delete this supplier because they are linked to medicines or other records. Please delete the linked items first!';
          }
          alert(`Failed to delete supplier: ${msg}`);
        }
      });
    }
  }
}
