import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
@Component({
  selector: 'app-doctor',
  imports: [FormsModule, CommonModule],
  templateUrl: './doctor.html',
  styleUrl: './doctor.css',
})
export class Doctor implements OnInit, OnDestroy {

  http = inject(HttpClient);
  cdr = inject(ChangeDetectorRef);

  editid = "";
  doctor = {
    name : "",
    speciality : "",
    email : "",
    mobile : ""
  }

  doctorList : Array<any> = []

  formHandler() {
    this.http.post("http://localhost:5032/api/Doctor/Create", this.doctor, { responseType: 'text' }).subscribe({
      next: (res: any) => {
        console.log("Doctor added", res);
        const modalElement = document.getElementById('exampleModal');
        if (modalElement) {
          const modal = (window as any).bootstrap.Modal.getInstance(modalElement) || (window as any).bootstrap.Modal.getOrCreateInstance(modalElement);
          modal?.hide();
        }
        // Reset form
        this.doctor = { name: "", speciality: "", email: "", mobile: "" };
        // Fetch fresh data with a small delay
        setTimeout(() => {
          this.ngOnInit();
        }, 300);
      },
      error: (err) => {
        console.log("Error adding doctor", err);
        alert("Error adding doctor. Check console for details.");
      }
    });
  }

  
  editDoctor: any = {
    id : "",
    name : "",
    speciality : "",
    email : "",
    mobile : ""
  }


  editHandler(doctorObj: any) {
    // Create a copy of the object to prevent live updating the table before save
    this.editDoctor = { ...doctorObj };
    
    // Open the modal
    setTimeout(() => {
      const modalElement = document.getElementById('editModal');
      if (modalElement) {
        (window as any).bootstrap.Modal.getOrCreateInstance(modalElement).show();
      }
    }, 100);
  }


  updateDoctor() {
    this.http.put(`http://localhost:5032/api/Doctor/Edit/${this.editDoctor.id}`, this.editDoctor, { responseType: 'text' }).subscribe({
      next: (res: any) => {
        console.log("Updated", res);
        
        // Update the local list so the changes reflect in the UI immediately
        const index = this.doctorList.findIndex(d => d.id === this.editDoctor.id);
        if (index !== -1) {
          this.doctorList[index] = { ...this.editDoctor };
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
        console.log("Error updating doctor", err);
        alert("Error updating doctor. Check console for details.");
      }
    });
  }

  deleteDoctor(id: number) {
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
        this.http.delete(`http://localhost:5032/api/Doctor/Delete/${id}`, { responseType: 'text' }).subscribe({
          next: (res: any) => {
            console.log("Deleted", res);
            this.doctorList = this.doctorList.filter(d => d.id != id);
            
            Swal.fire(
              'Deleted!',
              'Doctor has been deleted.',
              'success'
            );
            
            setTimeout(() => {
              this.ngOnInit();
            }, 300);
          },
          error: (err) => {
            console.log("Error deleting doctor", err);
            Swal.fire(
              'Error!',
              'Error deleting doctor. Check console for details.',
              'error'
            );
          }
        });
      }
    });
  }

  ngOnInit(){
    this.http.get(`http://localhost:5032/api/Doctor/list?t=${new Date().getTime()}`)
    .subscribe({
      next : (res : any) => {
        this.doctorList = res;
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
