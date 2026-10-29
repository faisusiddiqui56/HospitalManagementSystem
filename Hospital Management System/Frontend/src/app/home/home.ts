import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent {
  isModalOpen = false;
  isSubmitted = false;

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.isSubmitted = false;
  }

  onSubmitAppointment(event: Event) {
    event.preventDefault();
    this.isSubmitted = true;
    
    // Auto reset the form after 5 seconds so it can be used again
    setTimeout(() => {
      this.isSubmitted = false;
      this.isModalOpen = false;
    }, 5000);
  }
}
