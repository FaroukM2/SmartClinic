import { Component, OnInit, signal } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { Payment, PaymentMethodLabels } from '../../../core/models/clinic.models';
import { ClinicService } from '../../../core/services/clinic.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-payments-list',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, DatePipe],
  template: `
    <div class="page-header">
      <div class="page-header__left">
        <h1>Billing & Financial Records</h1>
        <p>Track all clinic payment transactions and receipts</p>
      </div>
      <div class="page-header__actions">
        <button class="btn btn-secondary btn-sm" (click)="loadPayments()">
          🔄 Refresh
        </button>
      </div>
    </div>

    <!-- Table Card -->
    <div class="card">
      <div class="card__body" style="padding:0">
        @if (loading()) {
          <div class="empty-state">
            <div class="spinner mb-2"></div>
            <p>Loading financial transactions...</p>
          </div>
        } @else if (payments().length === 0) {
          <div class="empty-state">
            <div class="empty-icon">💳</div>
            <h3>No Billing Records Found</h3>
            <p>Financial transactions will automatically show up here when visits are completed and paid.</p>
          </div>
        } @else {
          <div class="table-wrapper">
            <table class="table">
              <thead>
                <tr>
                  <th>Receipt #</th>
                  <th>Patient</th>
                  <th>Payment Method</th>
                  <th>Gross Amount</th>
                  <th>Discount</th>
                  <th>Net Paid</th>
                  <th>Billed By</th>
                  <th>Date & Time</th>
                </tr>
              </thead>
              <tbody>
                @for (p of payments(); track p.id) {
                  <tr>
                    <td>
                      <span class="badge badge-success">{{ p.receiptNumber || 'N/A' }}</span>
                    </td>
                    <td class="fw-500">{{ p.patientName || 'Walk-in / Patient' }}</td>
                    <td>
                      <span class="badge badge-info">{{ getMethod(p.paymentMethod) }}</span>
                    </td>
                    <td>{{ (p.amount || p.totalAmount || 0) | currency:'EGP ' }}</td>
                    <td class="text-danger">-{{ (p.discount || p.discountAmount || 0) | currency:'EGP ' }}</td>
                    <td class="fw-600 text-success">{{ p.netAmount | currency:'EGP ' }}</td>
                    <td class="text-muted fs-xs">{{ p.createdByUserName || 'Staff' }}</td>
                    <td class="text-muted fs-xs">{{ (p.createdAt || p.paidAt) | date:'medium' }}</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
      </div>
    </div>
  `
})
export class PaymentsListComponent implements OnInit {
  payments = signal<Payment[]>([]);
  loading  = signal<boolean>(false);

  constructor(
    private clinicService: ClinicService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.loadPayments();
  }

  loadPayments(): void {
    const clinicId = this.auth.clinicId();
    if (!clinicId) return;

    this.loading.set(true);
    this.clinicService.getPaymentsByClinic(clinicId).subscribe({
      next: (res) => {
        this.payments.set(res || []);
        this.loading.set(false);
      },
      error: () => {
        this.payments.set([]);
        this.loading.set(false);
      }
    });
  }

  getMethod(val: number): string {
    return PaymentMethodLabels[val] ?? 'Cash';
  }
}
