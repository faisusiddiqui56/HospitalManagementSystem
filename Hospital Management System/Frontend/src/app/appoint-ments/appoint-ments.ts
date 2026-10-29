import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-appoint-ments',
  imports: [FormsModule, CommonModule],
  templateUrl: './appoint-ments.html',
  styleUrl: './appoint-ments.css',
})
export class AppointMents implements OnInit, OnDestroy {
  http = inject(HttpClient);
  cdr = inject(ChangeDetectorRef);

  appointments = {
    patientid: "",
    doctorid: "",
    date: "",
    time: "",
    status: ""
  };

  editappointments: any = {
    id: 0,
    patientid: "",
    doctorid: "",
    date: "",
    time: "",
    status: ""
  };

  AppointmentsList: Array<any> = [];

  formHandler() {
    this.http.post("http://localhost:5032/api/Appointment/Create", this.appointments, { responseType: 'text' }).subscribe({
      next: (res: any) => {
        console.log("Appointments added", res);
        
        const modalElement = document.getElementById('exampleModal');
        if (modalElement) {
          const modal = (window as any).bootstrap.Modal.getInstance(modalElement) || (window as any).bootstrap.Modal.getOrCreateInstance(modalElement);
          modal?.hide();
        }
        
        // Reset form
        this.appointments = { patientid: "", doctorid: "", date: "", time: "", status: "" };
        
        // Fetch fresh data with a small delay to ensure backend committed the transaction
        setTimeout(() => {
          this.ngOnInit();
        }, 300);
      },
      error: (err) => {
        console.log("Error adding appointments", err);
        alert("Error adding appointments. Check console for details.");
      }
    });
  }

  editHandler(appointmentObj: any) {
    this.editappointments = { ...appointmentObj };
    setTimeout(() => {
      const modalElement = document.getElementById('editModal');
      if (modalElement) {
        (window as any).bootstrap.Modal.getOrCreateInstance(modalElement).show();
      }
    }, 100);
  }

  updateAppointMents() {
    this.http.put(`http://localhost:5032/api/Appointment/Edit/${this.editappointments.id}`, this.editappointments, { responseType: 'text' }).subscribe({
      next: (res: any) => {
        console.log("Updated", res);
        
        const index = this.AppointmentsList.findIndex(d => d.id === this.editappointments.id);
        if (index !== -1) {
          this.AppointmentsList[index] = { ...this.editappointments };
        }
        
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
        console.log("Error updating appointments", err);
        alert("Error updating appointments. Check console for details.");
      }
    });
  }

  deleteAppointMents(id: number) {
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
        this.http.delete(`http://localhost:5032/api/Appointment/Delete/${id}`, { responseType: 'text' }).subscribe({
          next: (res: any) => {
            console.log("Deleted", res);
            this.AppointmentsList = this.AppointmentsList.filter(p => p.id != id);
            
            Swal.fire(
              'Deleted!',
              'Appointment has been deleted.',
              'success'
            );
            
            setTimeout(() => {
              this.ngOnInit();
            }, 300);
          },
          error: (err) => {
            console.log("Error deleting appointment", err);
            Swal.fire(
              'Error!',
              'Error deleting appointment. Check console for details.',
              'error'
            );
          }
        });
      }
    });
  }

  completeappointment = (id : number) => {
     this.http.put(`http://localhost:5032/api/Appointment/CompletedList/${id}`, id).subscribe({
      next: (res: any) => {
        alert(res.Message);
        
        // Remove from list locally
        this.AppointmentsList = this.AppointmentsList.filter(p => p.id != id);
        
        // Fetch fresh data
        setTimeout(() => {
          this.ngOnInit();
        }, 300);
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  ngOnInit() {
    this.http.get(`http://localhost:5032/api/Appointment/List?t=${new Date().getTime()}`).subscribe({
      next: (res: any) => {
        this.AppointmentsList = res;
        this.cdr.detectChanges(); // Force UI update
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  ngOnDestroy() {
    // Ensure any open modals and their backdrops are removed when navigating away
    if (typeof document !== 'undefined') {
      document.body.classList.remove('modal-open');
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
      const backdrops = document.querySelectorAll('.modal-backdrop');
      backdrops.forEach(backdrop => backdrop.remove());
    }
  }
}
