import { Component, Input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ClinicService } from '../../../core/services/clinic.service';
import { Visit, PrescriptionItem } from '../../../core/models/clinic.models';

@Component({
  selector: 'app-visit-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="page-header">
      <div class="page-header__left">
        <h1>Doctor Consultation Visit</h1>
        <p>Record medical diagnosis, treatment plan, prescription and payment</p>
      </div>
      <div class="page-header__actions">
        <a routerLink="/appointments" class="btn btn-secondary">Back to Queue</a>
      </div>
    </div>

    @if (loading()) {
      <div class="loading-container">
        <div class="spinner"></div>
        <span>Loading visit record...</span>
      </div>
    } @else {
      <div class="content-grid" style="grid-template-columns:1fr 1fr">
        <!-- Diagnosis & Clinical Notes -->
        <div class="card">
          <div class="card__header">
            <h3>🩺 Clinical Examination & Diagnosis</h3>
          </div>
          <div class="card__body">
            <div class="form-group mb-4">
              <label>Chief Complaint</label>
              <textarea class="form-control" rows="2" [(ngModel)]="visit.chiefComplaint" placeholder="e.g. Fever, persistent cough for 3 days"></textarea>
            </div>
            <div class="form-group mb-4">
              <label>Clinical Diagnosis</label>
              <textarea class="form-control" rows="3" [(ngModel)]="visit.diagnosis" placeholder="e.g. Acute Bronchitis"></textarea>
            </div>
            <div class="form-group mb-4">
              <label>Treatment Plan / Doctor Notes</label>
              <textarea class="form-control" rows="3" [(ngModel)]="visit.treatment" placeholder="e.g. Rest, oral hydration, antibiotic course"></textarea>
            </div>

            <button class="btn btn-primary" (click)="saveClinicalNotes()">
              Save Clinical Notes
            </button>
          </div>
        </div>

        <!-- E-Prescription -->
        <div class="card">
          <div class="card__header">
            <h3>💊 Electronic Prescription (e-Rx)</h3>
            <button class="btn btn-secondary btn-sm" (click)="addMedicineItem()">+ Add Medicine</button>
          </div>
          <div class="card__body">
            @for (item of rxItems; track $index) {
              <div class="rx-item">
                <div class="form-group mb-2">
                  <input type="text" class="form-control" [(ngModel)]="item.medicineName" placeholder="Medicine Name (e.g. Augmentin 1g)" />
                </div>
                <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px">
                  <input type="text" class="form-control" [(ngModel)]="item.dosage" placeholder="Dosage (1 tab)" />
                  <input type="text" class="form-control" [(ngModel)]="item.frequency" placeholder="Freq (Every 12h)" />
                  <input type="text" class="form-control" [(ngModel)]="item.duration" placeholder="Duration (7 days)" />
                </div>
              </div>
            }

            <div style="margin-top:16px;display:flex;justify-content:flex-end">
              <button class="btn btn-primary" (click)="savePrescription()">Issue Prescription</button>
            </div>
          </div>
        </div>

        <!-- Payment Processing -->
        <div class="card" style="grid-column: span 2">
          <div class="card__header">
            <h3>💳 Payment & Receipt Generation</h3>
          </div>
          <div class="card__body">
            <div style="display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:16px">
              <div class="form-group">
                <label>Total Amount (EGP)</label>
                <input type="number" class="form-control" [(ngModel)]="payment.totalAmount" />
              </div>
              <div class="form-group">
                <label>Discount Amount (EGP)</label>
                <input type="number" class="form-control" [(ngModel)]="payment.discountAmount" />
              </div>
              <div class="form-group">
                <label>Payment Method</label>
                <select class="form-control" [(ngModel)]="payment.paymentMethod">
                  <option [value]="1">Cash</option>
                  <option [value]="2">Credit Card</option>
                  <option [value]="3">Insurance</option>
                </select>
              </div>
              <div class="form-group" style="display:flex;align-items:flex-end">
                <button class="btn btn-primary" style="width:100%" (click)="processPayment()">
                  Process & Complete Visit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .rx-item { background: var(--surface-2); border: 1px solid var(--border); border-radius: var(--radius-md); padding: 12px; margin-bottom: 10px; }
  `]
})
export class VisitDetailComponent implements OnInit {
  @Input() id!: string;
  loading = signal(true);

  visit: Partial<Visit> = {
    chiefComplaint: '',
    diagnosis: '',
    treatment: ''
  };

  rxItems: PrescriptionItem[] = [
    { medicineName: 'Panadol Extra', dosage: '2 tablets', frequency: 'Every 8 hours', duration: '5 days' }
  ];

  payment = {
    totalAmount: 350,
    discountAmount: 0,
    paymentMethod: 1
  };

  constructor(
    private clinicService: ClinicService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.id) {
      this.visit.id = this.id;
      this.clinicService.getVisitById(this.id).subscribe({
        next: (res) => { this.visit = res; this.loading.set(false); },
        error: () => this.loading.set(false)
      });
    }
  }

  addMedicineItem(): void {
    this.rxItems.push({ medicineName: '', dosage: '', frequency: '', duration: '' });
  }

  saveClinicalNotes(): void {
    this.clinicService.updateVisit(this.visit).subscribe();
  }

  savePrescription(): void {
    this.clinicService.createPrescription({
      id: '',
      visitId: this.id,
      items: this.rxItems
    }).subscribe();
  }

  processPayment(): void {
    this.clinicService.processPayment({
      visitId: this.id,
      totalAmount: this.payment.totalAmount,
      discountAmount: this.payment.discountAmount,
      paymentMethod: Number(this.payment.paymentMethod)
    }).subscribe({
      next: () => this.router.navigate(['/appointments'])
    });
  }
}
