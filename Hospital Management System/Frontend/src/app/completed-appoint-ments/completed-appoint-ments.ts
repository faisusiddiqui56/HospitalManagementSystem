import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-completed-appoint-ments',
  imports: [FormsModule, CommonModule],
  templateUrl: './completed-appoint-ments.html',
  styleUrl: './completed-appoint-ments.css',
})
export class CompletedAppointMents {

    http = inject(HttpClient);
    cdr = inject(ChangeDetectorRef);
    appointments = [{
      id : 0,
      patientid : "",
      doctorid : "",
      date : "",
      time : "",
      status : ""
    }]

    deleteCompleted(id: number) {
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
              this.appointments = this.appointments.filter(p => p.id != id);
              
              Swal.fire(
                'Deleted!',
                'Completed appointment has been deleted.',
                'success'
              );
              
              setTimeout(() => {
                this.ngOnInit();
              }, 300);
            },
            error: (err) => {
              console.log("Error deleting completed appointment", err);
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


    ngOnInit() {
    this.http.get(`http://localhost:5032/api/Appointment/CompletedList?t=${new Date().getTime()}`).subscribe({
      next: (res: any) => {
        this.appointments = res;
        this.cdr.detectChanges();
        console.log(res)
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }
}
