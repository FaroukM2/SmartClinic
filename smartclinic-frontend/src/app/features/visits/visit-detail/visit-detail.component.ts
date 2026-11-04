import { Component, Input, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ClinicService } from '../../../core/services/clinic.service';
import { ToastService } from '../../../core/services/toast.service';
import { Visit, PrescriptionItem } from '../../../core/models/clinic.models';

@Component({
  selector: 'app-visit-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="consultation-wrapper">
      <!-- ── TOP BAR (NO PRINT) ─────────────────────────────── -->
      <div class="page-header no-print">
        <div class="page-header__left">
          <div class="d-flex align-center gap-2 mb-1">
            <span class="badge badge-primary">Clinical Consultation</span>
            <span class="badge badge-success">In Progress</span>
          </div>
          <h1>Patient Clinical Consultation & e-Rx</h1>
          <p class="text-muted">Record clinical findings, review allergies, formulate digital prescriptions, and finalize billing.</p>
        </div>
        <div class="page-header__actions d-flex gap-2">
          <button class="btn btn-secondary" (click)="printPrescription()" title="Print Prescription for Patient">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
            <span>Print Prescription</span>
          </button>
          <a routerLink="/appointments" class="btn btn-secondary">Back to Queue</a>
        </div>
      </div>

      <!-- ── PATIENT MEDICAL ALERT BANNER (NO PRINT) ──────────── -->
      <div class="patient-alert-banner no-print mb-4">
        <div class="patient-info-meta">
          <div class="avatar-box">PT</div>
          <div>
            <h3 class="patient-name">Patient Consultation Session</h3>
            <span class="text-muted fs-xs">Session ID: {{ id }}</span>
          </div>
        </div>

        <div class="vitals-row">
          <div class="vital-chip">
            <span class="vital-lbl">BP</span>
            <span class="vital-val">120/80</span>
          </div>
          <div class="vital-chip">
            <span class="vital-lbl">HR</span>
            <span class="vital-val">74 bpm</span>
          </div>
          <div class="vital-chip">
            <span class="vital-lbl">TEMP</span>
            <span class="vital-val">37.0 °C</span>
          </div>
          <div class="vital-chip allergy-chip">
            <span class="vital-lbl">⚠️ ALLERGIES</span>
            <span class="vital-val text-danger">Penicillin • Dust</span>
          </div>
        </div>
      </div>

      @if (loading()) {
        <div class="loading-container no-print">
          <div class="spinner"></div>
          <span>Loading patient clinical file...</span>
        </div>
      } @else {
        <!-- ── MAIN TWO-COLUMN WORKSPACE (NO PRINT) ──────────── -->
        <div class="content-grid no-print mb-6" style="grid-template-columns: 1fr 1fr; gap: 24px;">
          <!-- Left Column: Examination & Clinical Notes -->
          <div class="card">
            <div class="card__header">
              <div class="d-flex align-center gap-2">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
                <h3 style="margin:0;font-size:1.05rem">Examination & Clinical Findings</h3>
              </div>
            </div>
            <div class="card__body">
              <div class="form-group mb-3">
                <label class="form-label">Chief Complaint & Symptoms</label>
                <textarea 
                  class="form-control" 
                  rows="3" 
                  [(ngModel)]="visit.chiefComplaint" 
                  placeholder="e.g. Acute sore throat, low-grade fever, productive cough for 3 days">
                </textarea>
              </div>

              <div class="form-group mb-3">
                <label class="form-label">Clinical Diagnosis (ICD Standard)</label>
                <textarea 
                  class="form-control" 
                  rows="3" 
                  [(ngModel)]="visit.diagnosis" 
                  placeholder="e.g. Acute Pharyngitis / Upper Respiratory Tract Infection">
                </textarea>
              </div>

              <div class="form-group mb-4">
                <label class="form-label">Treatment Plan & Physician Advice</label>
                <textarea 
                  class="form-control" 
                  rows="3" 
                  [(ngModel)]="visit.treatment" 
                  placeholder="e.g. Bed rest for 48 hours, high warm fluid intake, follow-up after 5 days if fever persists">
                </textarea>
              </div>

              <button class="btn btn-primary" (click)="saveClinicalNotes()">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
                <span>Save Clinical Notes</span>
              </button>
            </div>
          </div>

          <!-- Right Column: Digital Prescription Pad -->
          <div class="card">
            <div class="card__header d-flex justify-between align-center">
              <div class="d-flex align-center gap-2">
                <span style="font-size:1.25rem;font-weight:800;color:#0ea5e9">℞</span>
                <h3 style="margin:0;font-size:1.05rem">Digital Prescription (e-Rx)</h3>
              </div>
              <button class="btn btn-secondary btn-sm" (click)="addMedicineItem()">
                + Add Medication
              </button>
            </div>
            <div class="card__body">
              <div class="rx-list mb-3">
                @for (item of rxItems; track $index) {
                  <div class="rx-item-box mb-3">
                    <div class="d-flex justify-between align-center mb-2">
                      <span class="rx-item-num">#{{ $index + 1 }} Medication</span>
                      @if (rxItems.length > 1) {
                        <button class="btn-text-danger" (click)="removeMedicineItem($index)" title="Remove medicine">×</button>
                      }
                    </div>
                    <div class="form-group mb-2">
                      <input 
                        type="text" 
                        class="form-control" 
                        [(ngModel)]="item.medicineName" 
                        placeholder="Drug Trade Name & Strength (e.g. Augmentin 1g)" 
                      />
                    </div>
                    <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px">
                      <input type="text" class="form-control" [(ngModel)]="item.dosage" placeholder="Dose (1 tab)" />
                      <input type="text" class="form-control" [(ngModel)]="item.frequency" placeholder="Freq (q12h)" />
                      <input type="text" class="form-control" [(ngModel)]="item.duration" placeholder="Duration (7d)" />
                    </div>
                  </div>
                }
              </div>

              <div class="d-flex justify-between align-center">
                <button class="btn btn-outline" (click)="printPrescription()">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
                  <span>Preview & Print</span>
                </button>
                <button class="btn btn-primary" (click)="savePrescription()">
                  <span>Issue & Sign e-Rx</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- ── BOTTOM CARD: BILLING & CHECKOUT (NO PRINT) ──────── -->
        <div class="card no-print mb-6">
          <div class="card__header">
            <div class="d-flex align-center gap-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
              <h3 style="margin:0;font-size:1.05rem">Billing Settlement & Receipt Invoicing</h3>
            </div>
          </div>
          <div class="card__body">
            <div style="display:grid;grid-template-columns: repeat(4, 1fr); gap: 16px;">
              <div class="form-group">
                <label class="form-label">Consultation Fee (EGP)</label>
                <input type="number" class="form-control" [(ngModel)]="payment.totalAmount" />
              </div>
              <div class="form-group">
                <label class="form-label">Discount (EGP)</label>
                <input type="number" class="form-control" [(ngModel)]="payment.discountAmount" />
              </div>
              <div class="form-group">
                <label class="form-label">Payment Method</label>
                <select class="form-control" [(ngModel)]="payment.paymentMethod">
                  <option [value]="1">Cash Payment</option>
                  <option [value]="2">Credit / Debit Card</option>
                  <option [value]="3">Medical Insurance Coverage</option>
                </select>
              </div>
              <div class="form-group d-flex align-end">
                <button class="btn btn-success" style="width:100%" (click)="processPayment()">
                  Process & Complete Visit
                </button>
              </div>
            </div>
          </div>
        </div>
      }

      <!-- ── PRINTABLE PRESCRIPTION SHEET (VISIBLE ON PRINT) ─── -->
      <div class="printable-prescription-sheet">
        <div class="print-header">
          <div class="print-clinic-brand">
            <h2>SMARTCLINIC MEDICAL CENTER</h2>
            <p>Outpatient Clinical Care & Specialist Center • Downtown Medical Complex</p>
            <p class="print-contact">Tel: +20 (02) 2345-6789 • Emergency: 16999 • Cairo, Egypt</p>
          </div>
          <div class="print-rx-mark">℞</div>
        </div>

        <div class="print-divider-thick"></div>

        <div class="print-meta-grid">
          <div><strong>Visit Reference:</strong> {{ id }}</div>
          <div><strong>Date:</strong> {{ todayDate | date:'mediumDate' }}</div>
          <div><strong>Chief Complaint:</strong> {{ visit.chiefComplaint || 'Consultation follow-up' }}</div>
          <div><strong>Clinical Diagnosis:</strong> {{ visit.diagnosis || 'Upper Respiratory Tract Infection' }}</div>
        </div>

        <div class="print-divider"></div>

        <div class="print-rx-section">
          <h3 class="rx-section-title">PRESCRIPTION ORDER / الأدوية الموصوفة</h3>
          <table class="print-table">
            <thead>
              <tr>
                <th style="width:5%">#</th>
                <th style="width:45%">Medication Name & Strength</th>
                <th style="width:15%">Dosage</th>
                <th style="width:20%">Frequency</th>
                <th style="width:15%">Duration</th>
              </tr>
            </thead>
            <tbody>
              @for (item of rxItems; track $index) {
                <tr>
                  <td>{{ $index + 1 }}</td>
                  <td><strong>{{ item.medicineName || 'Augmentin 1g Tablets' }}</strong></td>
                  <td>{{ item.dosage || '1 Tab' }}</td>
                  <td>{{ item.frequency || 'Every 12 Hours' }}</td>
                  <td>{{ item.duration || '7 Days' }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>

        @if (visit.treatment) {
          <div class="print-treatment-notes">
            <strong>Physician Instructions:</strong>
            <p>{{ visit.treatment }}</p>
          </div>
        }

        <div class="print-footer-grid">
          <div class="stamp-box">
            <span>OFFICIAL CLINIC STAMP</span>
          </div>
          <div class="signature-box">
            <div class="sig-line"></div>
            <span>Treating Physician Signature</span>
            <small>Licensed Specialist • Ministry of Health</small>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .patient-alert-banner {
      background: #0f172a;
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 14px;
      padding: 16px 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 20px;
      flex-wrap: wrap;
    }
    .patient-info-meta {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .avatar-box {
      width: 42px;
      height: 42px;
      border-radius: 10px;
      background: rgba(14, 165, 233, 0.15);
      color: #38bdf8;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
    }
    .patient-name {
      margin: 0;
      font-size: 1.05rem;
      font-weight: 700;
    }
    .vitals-row {
      display: flex;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;
    }
    .vital-chip {
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 8px;
      padding: 6px 12px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .allergy-chip {
      background: rgba(239, 68, 68, 0.12);
      border-color: rgba(239, 68, 68, 0.25);
    }
    .vital-lbl {
      font-size: 0.7rem;
      font-weight: 700;
      color: #94a3b8;
    }
    .vital-val {
      font-size: 0.85rem;
      font-weight: 600;
      color: #f8fafc;
    }
    .rx-item-box {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 10px;
      padding: 12px;
    }
    .rx-item-num {
      font-size: 0.75rem;
      font-weight: 700;
      color: #0ea5e9;
      text-transform: uppercase;
    }
    .btn-text-danger {
      background: none;
      border: none;
      color: #f87171;
      font-size: 1.25rem;
      cursor: pointer;
      line-height: 1;
      padding: 0 4px;
    }
    .btn-outline {
      background: transparent;
      border: 1px solid rgba(255, 255, 255, 0.15);
      color: #e2e8f0;
      padding: 8px 14px;
      border-radius: 8px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 0.85rem;
      font-weight: 600;
      transition: all 0.2s;
      &:hover {
        background: rgba(255, 255, 255, 0.08);
        border-color: rgba(255, 255, 255, 0.25);
      }
    }
    .btn-success {
      background: #10b981;
      border: none;
      color: #fff;
      font-weight: 600;
      border-radius: 8px;
      padding: 10px 18px;
      cursor: pointer;
      transition: all 0.2s;
      &:hover {
        background: #059669;
        box-shadow: 0 4px 14px rgba(16, 185, 129, 0.35);
      }
    }

    // Printable Prescription Sheet
    .printable-prescription-sheet {
      display: none;
    }

    @media print {
      .no-print {
        display: none !important;
      }
      .printable-prescription-sheet {
        display: block !important;
        background: #fff !important;
        color: #000 !important;
        padding: 30px !important;
        font-family: Arial, sans-serif !important;
      }
      .print-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
      }
      .print-clinic-brand h2 {
        font-size: 1.4rem;
        margin: 0 0 4px 0;
        color: #000;
      }
      .print-clinic-brand p {
        margin: 0;
        font-size: 0.85rem;
        color: #444;
      }
      .print-rx-mark {
        font-size: 3rem;
        font-weight: bold;
        color: #0284c7;
      }
      .print-divider-thick {
        height: 3px;
        background: #000;
        margin: 16px 0;
      }
      .print-meta-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 8px;
        font-size: 0.9rem;
        margin-bottom: 16px;
      }
      .print-divider {
        height: 1px;
        background: #ccc;
        margin: 16px 0;
      }
      .rx-section-title {
        font-size: 1rem;
        margin-bottom: 12px;
      }
      .print-table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 24px;
        th, td {
          border: 1px solid #ddd;
          padding: 8px 10px;
          text-align: left;
          font-size: 0.85rem;
        }
        th { background: #f4f4f4; }
      }
      .print-treatment-notes {
        background: #f9f9f9;
        border-left: 3px solid #0284c7;
        padding: 10px 14px;
        margin-bottom: 30px;
        font-size: 0.85rem;
      }
      .print-footer-grid {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        margin-top: 50px;
      }
      .stamp-box {
        width: 160px;
        height: 90px;
        border: 2px dashed #999;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.75rem;
        color: #888;
      }
      .signature-box {
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      .sig-line {
        width: 180px;
        border-bottom: 1px solid #000;
        margin-bottom: 6px;
      }
    }
  `]
})
export class VisitDetailComponent implements OnInit {
  @Input() id!: string;

  private clinicService = inject(ClinicService);
  private toast = inject(ToastService);
  private router = inject(Router);

  loading = signal(true);
  todayDate = new Date();

  visit: Partial<Visit> = {
    chiefComplaint: '',
    diagnosis: '',
    treatment: ''
  };

  rxItems: PrescriptionItem[] = [
    { medicineName: 'Augmentin 1g (Amoxicillin/Clavulanate)', dosage: '1 Tablet', frequency: 'Every 12 hours (after meals)', duration: '7 days' },
    { medicineName: 'Panadol Extra 500mg', dosage: '2 Tablets', frequency: 'Every 8 hours as needed for fever', duration: '5 days' }
  ];

  payment = {
    totalAmount: 350,
    discountAmount: 0,
    paymentMethod: 1
  };

  ngOnInit(): void {
    if (this.id) {
      this.visit.id = this.id;
      this.clinicService.getVisitById(this.id).subscribe({
        next: (res) => { 
          this.visit = res; 
          this.loading.set(false); 
        },
        error: () => this.loading.set(false)
      });
    }
  }

  addMedicineItem(): void {
    this.rxItems.push({ medicineName: '', dosage: '', frequency: '', duration: '' });
  }

  removeMedicineItem(index: number): void {
    this.rxItems.splice(index, 1);
  }

  saveClinicalNotes(): void {
    this.clinicService.updateVisit(this.visit).subscribe({
      next: () => this.toast.success('Clinical Notes Saved', 'Patient diagnosis and complaint updated successfully.'),
      error: () => this.toast.error('Save Failed', 'Could not update clinical notes.')
    });
  }

  savePrescription(): void {
    this.clinicService.createPrescription({
      id: '',
      visitId: this.id,
      items: this.rxItems
    }).subscribe({
      next: () => this.toast.success('Prescription Issued', 'Digital prescription formulated and signed.'),
      error: () => this.toast.error('Failed', 'Could not record prescription.')
    });
  }

  printPrescription(): void {
    window.print();
  }

  processPayment(): void {
    this.clinicService.processPayment({
      visitId: this.id,
      totalAmount: this.payment.totalAmount,
      discountAmount: this.payment.discountAmount,
      paymentMethod: Number(this.payment.paymentMethod)
    }).subscribe({
      next: () => {
        this.toast.success('Consultation Completed', 'Payment settled and receipt generated.');
        this.router.navigate(['/appointments']);
      },
      error: () => this.toast.error('Payment Error', 'Could not process payment for this visit.')
    });
  }
}
