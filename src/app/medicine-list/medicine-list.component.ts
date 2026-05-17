import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-medicine-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './medicine-list.component.html',
  styleUrls: ['./medicine-list.component.css']
})
export class MedicineListComponent implements OnInit {
  medicines: any[] = [];
  loading = true;
  error = '';
  
  newMedicine: any = {
    name: '',
    brand: '',
    price: 0,
    stock: 0
  };

  apiUrl = '/api/medicines/';
  searchQuery = '';
  
  // Modal states
  isModalOpen = false;
  modalType: 'add' | 'edit' | 'delete' = 'add';
  selectedMedicine: any = null;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchMedicines();
  }

  fetchMedicines() {
    this.loading = true;
    const url = this.searchQuery ? `${this.apiUrl}?search=${this.searchQuery}` : this.apiUrl;
    this.http.get(url).subscribe({
      next: (data: any) => {
        this.medicines = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching medicines:', err);
        const msg = err.error?.message || err.message || 'Unknown error';
        this.error = `Failed to load medicine data: ${err.status} - ${msg}`;
        this.loading = false;
      }
    });
  }

  openModal(type: 'add' | 'edit' | 'delete', medicine?: any) {
    this.modalType = type;
    this.selectedMedicine = medicine ? { ...medicine } : { ...this.newMedicine };
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedMedicine = null;
  }

  handleModalSubmit() {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    
    if (this.modalType === 'add') {
      this.http.post(`${this.apiUrl}create/`, this.selectedMedicine, { headers }).subscribe({
        next: (res: any) => {
          alert(res.message || 'Medicine created successfully');
          this.fetchMedicines();
          this.closeModal();
        },
        error: (err) => {
          console.error('Add error:', err);
          const msg = err.error?.message || err.message || 'Unknown error';
          alert(`Failed to create medicine: ${err.status} - ${msg}`);
        }
      });
    } else if (this.modalType === 'edit') {
      const url = this.selectedMedicine.id ? `${this.apiUrl}update/${this.selectedMedicine.id}/` : this.apiUrl;
      this.http.put(url, this.selectedMedicine, { headers }).subscribe({
        next: (res: any) => {
          alert(res.message || 'Medicine updated successfully');
          this.fetchMedicines();
          this.closeModal();
        },
        error: (err) => {
          console.error('Edit error:', err);
          const msg = err.error?.message || err.message || 'Unknown error';
          alert(`Failed to update medicine: ${err.status} - ${msg}`);
        }
      });
    } else if (this.modalType === 'delete') {
      const url = this.selectedMedicine.id ? `${this.apiUrl}delete/${this.selectedMedicine.id}/` : this.apiUrl;
      this.http.delete(url, { headers }).subscribe({
        next: (res: any) => {
          alert(res.message || 'Medicine deleted successfully');
          this.fetchMedicines();
          this.closeModal();
        },
        error: (err) => {
          console.error('Delete error:', err);
          const msg = err.error?.message || err.message || 'Unknown error';
          alert(`Failed to delete medicine: ${err.status} - ${msg}`);
        }
      });
    }
  }
}
