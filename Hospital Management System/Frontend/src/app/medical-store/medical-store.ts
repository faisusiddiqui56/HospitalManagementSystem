import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, ChangeDetectorRef, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

export interface Medicine {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
}

@Component({
  selector: 'app-medical-store',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './medical-store.html',
  styleUrls: ['./medical-store.css']
})
export class MedicalStore implements OnInit, OnDestroy {
  cdr = inject(ChangeDetectorRef);

  private readonly STORAGE_KEY = 'hms_medical_store_inventory';

  defaultMedicines: Medicine[] = [
    { id: 1, name: 'Paracetamol 500mg', category: 'Pain Relief', price: 5.99, stock: 150 },
    { id: 2, name: 'Amoxicillin 250mg', category: 'Antibiotic', price: 12.50, stock: 45 },
    { id: 3, name: 'Ibuprofen 400mg', category: 'Anti-inflammatory', price: 8.00, stock: 5 },
    { id: 4, name: 'Cetirizine 10mg', category: 'Antihistamine', price: 6.20, stock: 80 },
    { id: 5, name: 'Vitamin C 1000mg', category: 'Supplement', price: 15.00, stock: 12 },
    { id: 6, name: 'Cough Syrup', category: 'Cold & Flu', price: 9.50, stock: 2 }
  ];

  medicines: Medicine[] = [];
  searchTerm: string = '';
  selectedCategory: string = 'All';

  categories: string[] = [
    'All',
    'Pain Relief',
    'Antibiotic',
    'Anti-inflammatory',
    'Antihistamine',
    'Supplement',
    'Cold & Flu',
    'Cardiology',
    'Dermatology',
    'General'
  ];

  // For Add Medicine Modal
  newMedicine: Medicine = {
    id: 0,
    name: '',
    category: 'General',
    price: 0,
    stock: 0
  };

  // For Edit Medicine Modal
  editMedicine: Medicine = {
    id: 0,
    name: '',
    category: 'General',
    price: 0,
    stock: 0
  };

  ngOnInit(): void {
    this.loadMedicines();
  }

  loadMedicines(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved) {
        try {
          this.medicines = JSON.parse(saved);
        } catch (e) {
          console.error('Error parsing medicines from localStorage', e);
          this.medicines = [...this.defaultMedicines];
        }
      } else {
        this.medicines = [...this.defaultMedicines];
        this.saveToStorage();
      }
    } else {
      this.medicines = [...this.defaultMedicines];
    }
  }

  saveToStorage(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.medicines));
    }
  }

  get filteredMedicines(): Medicine[] {
    return this.medicines.filter(med => {
      const matchesSearch = med.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                            med.category.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesCategory = this.selectedCategory === 'All' || med.category === this.selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }

  openAddModal(): void {
    this.newMedicine = {
      id: Date.now(),
      name: '',
      category: 'General',
      price: 0,
      stock: 0
    };
    if (typeof window !== 'undefined') {
      const modalElement = document.getElementById('addMedicineModal');
      if (modalElement) {
        const modal = (window as any).bootstrap?.Modal.getOrCreateInstance(modalElement);
        modal?.show();
      }
    }
  }

  saveMedicine(): void {
    if (!this.newMedicine.name.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Validation Error',
        text: 'Please enter a valid medicine name.'
      });
      return;
    }

    if (this.newMedicine.price < 0 || this.newMedicine.stock < 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Validation Error',
        text: 'Price and stock cannot be negative.'
      });
      return;
    }

    const newMed: Medicine = {
      ...this.newMedicine,
      id: Date.now()
    };

    this.medicines.unshift(newMed);
    this.saveToStorage();

    // Hide Modal
    if (typeof window !== 'undefined') {
      const modalElement = document.getElementById('addMedicineModal');
      if (modalElement) {
        const modal = (window as any).bootstrap?.Modal.getInstance(modalElement) || (window as any).bootstrap?.Modal.getOrCreateInstance(modalElement);
        modal?.hide();
      }
    }

    Swal.fire({
      icon: 'success',
      title: 'Added!',
      text: `${newMed.name} has been added to inventory.`,
      timer: 2000,
      showConfirmButton: false
    });
  }

  openEditModal(med: Medicine): void {
    this.editMedicine = { ...med };
    setTimeout(() => {
      if (typeof window !== 'undefined') {
        const modalElement = document.getElementById('editMedicineModal');
        if (modalElement) {
          const modal = (window as any).bootstrap?.Modal.getOrCreateInstance(modalElement);
          modal?.show();
        }
      }
    }, 50);
  }

  updateMedicine(): void {
    if (!this.editMedicine.name.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Validation Error',
        text: 'Please enter a valid medicine name.'
      });
      return;
    }

    if (this.editMedicine.price < 0 || this.editMedicine.stock < 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Validation Error',
        text: 'Price and stock cannot be negative.'
      });
      return;
    }

    const index = this.medicines.findIndex(m => m.id === this.editMedicine.id);
    if (index !== -1) {
      this.medicines[index] = { ...this.editMedicine };
      this.saveToStorage();
    }

    // Hide Modal
    if (typeof window !== 'undefined') {
      const modalElement = document.getElementById('editMedicineModal');
      if (modalElement) {
        const modal = (window as any).bootstrap?.Modal.getInstance(modalElement) || (window as any).bootstrap?.Modal.getOrCreateInstance(modalElement);
        modal?.hide();
      }
    }

    Swal.fire({
      icon: 'success',
      title: 'Updated!',
      text: `${this.editMedicine.name} details have been updated.`,
      timer: 2000,
      showConfirmButton: false
    });
  }

  deleteMedicine(med: Medicine): void {
    Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to delete "${med.name}" from inventory?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4318FF',
      cancelButtonColor: '#ee5d50',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.medicines = this.medicines.filter(m => m.id !== med.id);
        this.saveToStorage();

        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: `${med.name} has been removed.`,
          timer: 2000,
          showConfirmButton: false
        });
      }
    });
  }

  ngOnDestroy(): void {
    if (typeof document !== 'undefined') {
      document.body.classList.remove('modal-open');
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
      const backdrops = document.querySelectorAll('.modal-backdrop');
      backdrops.forEach(backdrop => backdrop.remove());
    }
  }
}
