import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-patient',
  imports: [FormsModule,CommonModule],
  templateUrl: './patient.html',
  styleUrl: './patient.css',
})
export class Patient implements OnInit, OnDestroy {

  http = inject(HttpClient);
  cdr = inject(ChangeDetectorRef);

  editid = "";
  patient = {
    id : 0,
    name : "",
    email : "",
    mobile : ""
  }

  patientList : Array<any> = []

  formHandler() {
    // We can omit 'id' if the backend generates it, or pass 0.
    const payload = {
      name: this.patient.name,
      email: this.patient.email,
      mobile: this.patient.mobile
    };

    this.http.post("http://localhost:5032/api/Patient/Create", payload, { responseType: 'text' }).subscribe({
      next: (res: any) => {
        console.log("Patient added", res);
        const modalElement = document.getElementById('exampleModal');
        if (modalElement) {
          const modal = (window as any).bootstrap.Modal.getInstance(modalElement) || (window as any).bootstrap.Modal.getOrCreateInstance(modalElement);
          modal?.hide();
        }
        
        // Reset form
        this.patient = { id: 0, name: "", email: "", mobile: "" };

        // Fetch fresh data with a small delay
        setTimeout(() => {
          this.ngOnInit();
        }, 300);
      },
      error: (err) => {
        console.log("Error adding patient", err);
        alert("Error adding patient. Check console for details.");
      }
    });
  }

  editPatient: any = {
    id : 0,
    name : "",
    email : "",
    mobile : ""
  }

  editHandler(patientObj: any) {
    // Create a copy of the object to prevent live updating the table before save
    this.editPatient = { ...patientObj };
    
    // Open the modal
    setTimeout(() => {
      const modalElement = document.getElementById('editModal');
      if (modalElement) {
        (window as any).bootstrap.Modal.getOrCreateInstance(modalElement).show();
      }
    }, 100);
  }

  updatePatient() {
    this.http.put(`http://localhost:5032/api/Patient/Edit/${this.editPatient.id}`, this.editPatient, { responseType: 'text' }).subscribe({
      next: (res: any) => {
        console.log("Updated", res);
        
        // Update the local list so the changes reflect in the UI immediately
        const index = this.patientList.findIndex(d => d.id === this.editPatient.id);
        if (index !== -1) {
          this.patientList[index] = { ...this.editPatient };
        }
        
        // Close the modal
        const modalElement = document.getElementById('editModal');
        if (modalElement) {
          const modal = (window as any).bootstrap.Modal.getInstance(modalElement) || (window as any).bootstrap.Modal.getOrCreateInstance(modalElement);
          modal?.hide();
        }

        setTimeout(() => {
          this.ngOnInit();
        }, 300);
      },
      error: (err) => {
        console.log("Error updating patient", err);
        alert("Error updating patient. Check console for details.");
      }
    });
  }

  deletePatient(id: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4318FF',
      cancelButtonColor: '#ee5d50',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.http.delete(`http://localhost:5032/api/Patient/Delete/${id}`, { responseType: 'text' }).subscribe({
          next: (res: any) => {
            console.log("Deleted", res);
            this.patientList = this.patientList.filter(p => p.id != id);
            
            Swal.fire(
              'Deleted!',
              'Patient has been deleted.',
              'success'
            );
            
            setTimeout(() => {
              this.ngOnInit();
            }, 300);
          },
          error: (err) => {
            console.log("Error deleting patient", err);
            Swal.fire(
              'Error!',
              'Error deleting patient. Check console for details.',
              'error'
            );
          }
        });
      }
    });
  }

  ngOnInit() {
    this.http.get(`http://localhost:5032/api/Patient/List?t=${new Date().getTime()}`)
    .subscribe({
      next : (res : any) => {
        this.patientList = res;
        this.cdr.detectChanges();
      },
      error : (err) => {
        console.log(err)
      }
    })
  }

  ngOnDestroy() {
    if (typeof document !== 'undefined') {
      document.body.classList.remove('modal-open');
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
      const backdrops = document.querySelectorAll('.modal-backdrop');
      backdrops.forEach(backdrop => backdrop.remove());
    }
  }

}
