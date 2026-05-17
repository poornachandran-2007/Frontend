import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-doctor-info',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './doctor-info.component.html',
  styleUrls: ['./doctor-info.component.css']
})
export class DoctorInfoComponent implements OnInit {
  doctors: any[] = [];
  loading = true;
  error = '';
  
  newDoctor: any = {
    doctor_name: '',
    hospital_name: '',
    hospital_address: ''
  };

  apiUrl = '/api/doctors/';
  searchQuery = '';
  
  // Modal states
  isModalOpen = false;
  modalType: 'add' | 'edit' | 'delete' = 'add';
  selectedDoctor: any = null;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchDoctors();
  }

  fetchDoctors() {
    this.loading = true;
    const url = this.searchQuery ? `${this.apiUrl}?search=${this.searchQuery}` : this.apiUrl;
    this.http.get(url).subscribe({
      next: (data: any) => {
        this.doctors = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching doctors:', err);
        const msg = err.error?.message || err.message || 'Unknown error';
        this.error = `Failed to load doctor data: ${err.status} - ${msg}`;
        this.loading = false;
      }
    });
  }

  openModal(type: 'add' | 'edit' | 'delete', doctor?: any) {
    this.modalType = type;
    this.selectedDoctor = doctor ? { ...doctor } : { ...this.newDoctor };
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedDoctor = null;
  }

  handleModalSubmit() {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    
    if (this.modalType === 'add') {
      console.log('Sending Doctor Payload:', this.selectedDoctor);
      this.http.post(`${this.apiUrl}create/`, this.selectedDoctor, { headers }).subscribe({
        next: (res: any) => {
          alert(res.message || 'Doctor created successfully');
          this.fetchDoctors();
          this.closeModal();
        },
        error: (err) => {
          console.error('Add error:', err);
          const msg = err.error?.message || err.message || 'Unknown error';
          alert(`Failed to create doctor: ${err.status} - ${msg}`);
        }
      });
    } else if (this.modalType === 'edit') {
      const url = this.selectedDoctor.id ? `${this.apiUrl}update/${this.selectedDoctor.id}/` : this.apiUrl;
      this.http.put(url, this.selectedDoctor, { headers }).subscribe({
        next: (res: any) => {
          alert(res.message || 'Doctor updated successfully');
          this.fetchDoctors();
          this.closeModal();
        },
        error: (err) => {
          console.error('Edit error:', err);
          const msg = err.error?.message || err.message || 'Unknown error';
          alert(`Failed to update doctor: ${err.status} - ${msg}`);
        }
      });
    } else if (this.modalType === 'delete') {
      const url = this.selectedDoctor.id ? `${this.apiUrl}delete/${this.selectedDoctor.id}/` : this.apiUrl;
      this.http.delete(url, { headers }).subscribe({
        next: (res: any) => {
          alert(res.message || 'Doctor deleted successfully');
          this.fetchDoctors();
          this.closeModal();
        },
        error: (err) => {
          console.error('Delete error:', err);
          const msg = err.error?.message || err.message || 'Unknown error';
          alert(`Failed to delete doctor: ${err.status} - ${msg}`);
        }
      });
    }
  }
}
