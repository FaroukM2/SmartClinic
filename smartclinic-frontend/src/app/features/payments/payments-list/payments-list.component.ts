import { Component, OnInit, signal } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Payment, PaymentMethodLabels } from '../../../core/models/clinic.models';

@Component({
  selector: 'app-payments-list',
  standalone: true,
  imports: [CommonModule, CurrencyPipe],
  template: `
    <div class="page-header">
      <div class="page-header__left">
        <h1>Billing & Financial Records</h1>
        <p>Track all clinic payment transactions and receipts</p>
      </div>
    </div>

    <!-- Table Card -->
    <div class="card">
      <div class="card__body" style="padding:0">
        @if (payments().length === 0) {
          <div class="empty-state">
            <div class="empty-icon">💳</div>
            <h3>No Billing Records Found</h3>
            <p>Financial transactions will automatically show up here when visits are completed.</p>
          </div>
        } @else {
          <div class="table-wrapper">
            <table class="table">
              <thead>
                <tr>
                  <th>Receipt Number</th>
                  <th>Visit ID</th>
                  <th>Payment Method</th>
                  <th>Gross Amount</th>
                  <th>Discount</th>
                  <th>Net Amount Paid</th>
                  <th>Date & Time</th>
                </tr>
              </thead>
              <tbody>
                @for (p of payments(); track p.id) {
                  <tr>
                    <td>
                      <span class="badge badge-success">{{ p.receiptNumber }}</span>
                    </td>
                    <td class="fs-xs text-muted">{{ p.visitId }}</td>
                    <td>
                      <span class="badge badge-info">{{ getMethod(p.paymentMethod) }}</span>
                    </td>
                    <td>{{ p.totalAmount | currency:'EGP' }}</td>
                    <td class="text-danger">-{{ p.discountAmount | currency:'EGP' }}</td>
                    <td class="fw-600 text-success">{{ p.netAmount | currency:'EGP' }}</td>
                    <td class="text-muted fs-xs">{{ p.paidAt | date:'medium' }}</td>
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

  ngOnInit(): void {
    // Empty initial list or populated upon transactions
    this.payments.set([]);
  }

  getMethod(val: number): string { return PaymentMethodLabels[val] ?? 'Cash'; }
}
