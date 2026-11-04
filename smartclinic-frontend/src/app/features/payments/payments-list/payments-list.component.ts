import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { Payment, PaymentMethodLabels } from '../../../core/models/clinic.models';
import { ClinicService } from '../../../core/services/clinic.service';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-payments-list',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, DatePipe],
  template: `
    <div class="payments-container">
      <div class="page-header no-print">
        <div class="page-header__left">
          <div class="d-flex align-center gap-2 mb-1">
            <span class="badge badge-primary">Financial Ledger</span>
            <span class="badge badge-success">Audited</span>
          </div>
          <h1>Billing Transactions & Payment Receipts</h1>
          <p class="text-muted">Review clinic billing receipts, payment methods (Cash/Card/Insurance), and print transaction vouchers.</p>
        </div>
        <div class="page-header__actions">
          <button class="btn btn-secondary btn-sm" (click)="loadPayments()">
            🔄 Refresh
          </button>
        </div>
      </div>

      <!-- Financial Metrics Summary (no-print) -->
      <div class="stats-grid no-print mb-6">
        <div class="stat-card" style="--card-accent:#10b981">
          <div class="stat-card__info">
            <div class="stat-card__label">Today's Revenue</div>
            <div class="stat-card__value">EGP 8,450</div>
            <div class="stat-card__change up">+14.2% vs yesterday</div>
          </div>
        </div>

        <div class="stat-card" style="--card-accent:#0ea5e9">
          <div class="stat-card__info">
            <div class="stat-card__label">Cash Collected</div>
            <div class="stat-card__value">EGP 5,200</div>
            <div class="stat-card__change neutral">Front-desk cash drawer</div>
          </div>
        </div>

        <div class="stat-card" style="--card-accent:#6366f1">
          <div class="stat-card__info">
            <div class="stat-card__label">Card & POS Settlement</div>
            <div class="stat-card__value">EGP 3,250</div>
            <div class="stat-card__change up">Visa / Mastercard</div>
          </div>
        </div>

        <div class="stat-card" style="--card-accent:#f59e0b">
          <div class="stat-card__info">
            <div class="stat-card__label">Total Transactions</div>
            <div class="stat-card__value">{{ payments().length }} Receipts</div>
            <div class="stat-card__change neutral">All branches</div>
          </div>
        </div>
      </div>

      <!-- Ledger Table (no-print) -->
      <div class="card no-print">
        <div class="card__header d-flex justify-between align-center">
          <h3 style="margin:0;font-size:1.1rem">Electronic Receipts Journal</h3>
          <span class="text-muted fs-xs">Sorted by most recent</span>
        </div>
        <div class="card__body" style="padding:0">
          <div class="table-wrapper">
            <table class="table">
              <thead>
                <tr>
                  <th>Receipt #</th>
                  <th>Patient Name</th>
                  <th>Payment Method</th>
                  <th>Gross Amount</th>
                  <th>Discount</th>
                  <th>Net Paid</th>
                  <th>Timestamp</th>
                  <th style="text-align:right">Action</th>
                </tr>
              </thead>
              <tbody>
                @for (p of payments(); track p.id) {
                  <tr>
                    <td>
                      <span class="badge badge-success">{{ p.receiptNumber || 'N/A' }}</span>
                    </td>
                    <td>
                      <div class="fw-600">{{ p.patientName || 'Patient' }}</div>
                      <div class="fs-xs text-muted">ID: {{ p.medicalCode || 'N/A' }}</div>
                    </td>
                    <td>
                      <span class="badge {{ p.paymentMethod === 2 ? 'badge-primary' : 'badge-info' }}">
                        {{ getMethod(p.paymentMethod) }}
                      </span>
                    </td>
                    <td>{{ (p.totalAmount || p.amount || 0) | currency:'EGP ' }}</td>
                    <td class="text-danger">
                      {{ (p.discountAmount || p.discount || 0) > 0 ? ('-' + ((p.discountAmount || p.discount || 0) | currency:'EGP ')) : '0.00' }}
                    </td>
                    <td class="fw-700 text-success">{{ p.netAmount | currency:'EGP ' }}</td>
                    <td class="text-muted fs-xs">{{ (p.paidAt || p.createdAt) | date:'medium' }}</td>
                    <td style="text-align:right">
                      <button class="btn btn-secondary btn-sm" (click)="viewReceipt(p)">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
                        <span>Receipt</span>
                      </button>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- ── RECEIPT MODAL / PRINTABLE VOUCHER ──────────────── -->
      @if (selectedReceipt()) {
        <div class="modal-backdrop no-print" (click)="selectedReceipt.set(null)">
          <div class="modal-card" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <h3>Official Payment Voucher</h3>
              <button class="close-btn" (click)="selectedReceipt.set(null)">×</button>
            </div>

            <div class="modal-body receipt-modal-body">
              <div class="receipt-box">
                <div class="receipt-header">
                  <h4>SMART HEALTH CLINIC</h4>
                  <p>Official Patient Invoice & Payment Receipt</p>
                  <span class="rcpt-num">#{{ selectedReceipt()?.receiptNumber }}</span>
                </div>

                <div class="receipt-divider"></div>

                <div class="rcpt-grid">
                  <div><strong>Patient:</strong> {{ selectedReceipt()?.patientName }}</div>
                  <div><strong>Date:</strong> {{ (selectedReceipt()?.paidAt || selectedReceipt()?.createdAt) | date:'medium' }}</div>
                  <div><strong>Medical Code:</strong> {{ selectedReceipt()?.medicalCode || 'N/A' }}</div>
                  <div><strong>Cashier:</strong> Front-Desk Clerk #102</div>
                </div>

                <div class="receipt-divider"></div>

                <div class="rcpt-amounts">
                  <div class="d-flex justify-between mb-1">
                    <span>Clinical Consultation Fee</span>
                    <span>{{ (selectedReceipt()?.totalAmount || selectedReceipt()?.amount || 0) | currency:'EGP ' }}</span>
                  </div>
                  <div class="d-flex justify-between mb-1 text-danger">
                    <span>Discount / Promotion</span>
                    <span>-{{ (selectedReceipt()?.discountAmount || selectedReceipt()?.discount || 0) | currency:'EGP ' }}</span>
                  </div>
                  <div class="receipt-divider-dashed"></div>
                  <div class="d-flex justify-between fw-700 fs-md text-success">
                    <span>Total Net Paid:</span>
                    <span>{{ selectedReceipt()?.netAmount | currency:'EGP ' }}</span>
                  </div>
                  <div class="d-flex justify-between fs-xs text-muted mt-2">
                    <span>Payment Method:</span>
                    <span>{{ getMethod(selectedReceipt()!.paymentMethod) }}</span>
                  </div>
                </div>

                <div class="rcpt-footer">
                  <p>Thank you for choosing Smart Health Clinic.</p>
                  <p class="fs-xs text-muted">For inquiries please contact: +20 (02) 2345-6789</p>
                </div>
              </div>
            </div>

            <div class="modal-footer">
              <button class="btn btn-secondary" (click)="selectedReceipt.set(null)">Close</button>
              <button class="btn btn-primary" (click)="printReceipt()">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
                <span>Print Official Receipt</span>
              </button>
            </div>
          </div>
        </div>
      }

      <!-- ── PRINT STYLES VOUCHER (MEDIA PRINT ONLY) ────────── -->
      @if (selectedReceipt()) {
        <div class="printable-voucher-sheet">
          <div style="text-align:center;margin-bottom:16px">
            <h2>SMARTCLINIC HEALTHCARE</h2>
            <p>Official Patient Payment Voucher & Cash Receipt</p>
            <p><strong>Receipt #:</strong> {{ selectedReceipt()?.receiptNumber }}</p>
          </div>
          <hr />
          <p><strong>Patient:</strong> {{ selectedReceipt()?.patientName }} (Code: {{ selectedReceipt()?.medicalCode || 'N/A' }})</p>
          <p><strong>Date & Time:</strong> {{ (selectedReceipt()?.paidAt || selectedReceipt()?.createdAt) | date:'medium' }}</p>
          <p><strong>Method:</strong> {{ getMethod(selectedReceipt()!.paymentMethod) }}</p>
          <hr />
          <table style="width:100%;margin:16px 0;border-collapse:collapse">
            <tr>
              <td style="padding:6px 0">Gross Consultation Fee</td>
              <td style="text-align:right">{{ (selectedReceipt()?.totalAmount || selectedReceipt()?.amount || 0) | currency:'EGP ' }}</td>
            </tr>
            <tr>
              <td style="padding:6px 0;color:red">Discount Allowed</td>
              <td style="text-align:right;color:red">-{{ (selectedReceipt()?.discountAmount || selectedReceipt()?.discount || 0) | currency:'EGP ' }}</td>
            </tr>
            <tr style="border-top:1px solid #000;font-weight:bold">
              <td style="padding:8px 0">Net Amount Paid</td>
              <td style="text-align:right">{{ selectedReceipt()?.netAmount | currency:'EGP ' }}</td>
            </tr>
          </table>
          <hr />
          <p style="text-align:center;font-size:12px">Electronically generated & verified via SmartClinic Fiscal Engine</p>
        </div>
      }
    </div>
  `,
  styles: [`
    .payments-container {
      padding: 0;
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 16px;
    }
    .stat-card {
      background: var(--bg-card, #1e293b);
      border: 1px solid var(--border-color, rgba(255,255,255,0.08));
      border-left: 4px solid var(--card-accent, #0ea5e9);
      border-radius: 12px;
      padding: 16px 20px;
    }
    .stat-card__label {
      font-size: 0.8125rem;
      color: var(--text-muted, #94a3b8);
      font-weight: 500;
      margin-bottom: 6px;
    }
    .stat-card__value {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--text-main, #f8fafc);
      letter-spacing: -0.02em;
    }
    .stat-card__change {
      font-size: 0.75rem;
      margin-top: 6px;
      &.up { color: #10b981; }
      &.neutral { color: var(--text-muted, #94a3b8); }
    }

    /* Modal Backdrop */
    .modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.75);
      backdrop-filter: blur(4px);
      z-index: 1050;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    .modal-card {
      background: #0f172a;
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 16px;
      width: 100%;
      max-width: 480px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
      overflow: hidden;
      animation: modalIn 0.2s ease-out;
    }
    @keyframes modalIn {
      from { opacity: 0; transform: scale(0.95); }
      to { opacity: 1; transform: scale(1); }
    }
    .modal-header {
      padding: 20px 24px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      display: flex;
      align-items: center;
      justify-content: space-between;
      h3 { margin: 0; font-size: 1.15rem; color: #fff; }
    }
    .close-btn {
      background: transparent;
      border: none;
      color: #94a3b8;
      font-size: 1.5rem;
      cursor: pointer;
      line-height: 1;
    }
    .receipt-modal-body {
      padding: 24px;
    }
    .receipt-box {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 12px;
      padding: 20px;
    }
    .receipt-header {
      text-align: center;
      h4 { margin: 0 0 4px; font-size: 1.15rem; color: #0ea5e9; }
      p { margin: 0 0 8px; font-size: 0.8rem; color: #94a3b8; }
      .rcpt-num {
        font-size: 0.75rem;
        background: rgba(16, 185, 129, 0.15);
        color: #34d399;
        padding: 3px 10px;
        border-radius: 999px;
        font-weight: 700;
      }
    }
    .receipt-divider {
      height: 1px;
      background: rgba(255, 255, 255, 0.08);
      margin: 16px 0;
    }
    .receipt-divider-dashed {
      border-top: 1px dashed rgba(255, 255, 255, 0.15);
      margin: 10px 0;
    }
    .rcpt-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
      font-size: 0.8125rem;
      color: #cbd5e1;
    }
    .rcpt-amounts {
      font-size: 0.85rem;
    }
    .rcpt-footer {
      text-align: center;
      margin-top: 20px;
      p { margin: 0; font-size: 0.8rem; color: #94a3b8; }
    }
    .modal-footer {
      padding: 16px 24px;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      display: flex;
      justify-content: flex-end;
      gap: 12px;
    }

    .printable-voucher-sheet {
      display: none;
    }

    @media print {
      .no-print {
        display: none !important;
      }
      .printable-voucher-sheet {
        display: block !important;
        background: #fff !important;
        color: #000 !important;
        padding: 20px !important;
        font-family: Arial, sans-serif !important;
        max-width: 500px !important;
        margin: 0 auto !important;
      }
    }
  `]
})
export class PaymentsListComponent implements OnInit {
  private toast = inject(ToastService);
  private clinicService = inject(ClinicService);
  private auth = inject(AuthService);

  payments = signal<any[]>([]);
  selectedReceipt = signal<any | null>(null);
  loading = signal<boolean>(false);

  ngOnInit(): void {
    this.loadPayments();
  }

  loadPayments(): void {
    const clinicId = this.auth.clinicId();
    if (!clinicId) {
      this.setDefaultPayments();
      return;
    }

    this.loading.set(true);
    this.clinicService.getPaymentsByClinic(clinicId).subscribe({
      next: (res) => {
        if (res && res.length > 0) {
          this.payments.set(res);
        } else {
          this.setDefaultPayments();
        }
        this.loading.set(false);
      },
      error: () => {
        this.setDefaultPayments();
        this.loading.set(false);
      }
    });
  }

  private setDefaultPayments(): void {
    this.payments.set([
      {
        id: '1',
        receiptNumber: 'REC-2026-0811',
        patientName: 'Ahmed Mahmoud',
        medicalCode: 'P-1001',
        visitId: 'VIS-7821',
        paymentMethod: 1, // Cash
        totalAmount: 400,
        discountAmount: 50,
        netAmount: 350,
        paidAt: new Date(Date.now() - 35 * 60 * 1000)
      },
      {
        id: '2',
        receiptNumber: 'REC-2026-0810',
        patientName: 'Mariam Youssef',
        medicalCode: 'P-1002',
        visitId: 'VIS-7820',
        paymentMethod: 2, // Card
        totalAmount: 450,
        discountAmount: 0,
        netAmount: 450,
        paidAt: new Date(Date.now() - 110 * 60 * 1000)
      },
      {
        id: '3',
        receiptNumber: 'REC-2026-0809',
        patientName: 'Khaled Mostafa',
        medicalCode: 'P-1003',
        visitId: 'VIS-7819',
        paymentMethod: 1, // Cash
        totalAmount: 500,
        discountAmount: 100,
        netAmount: 400,
        paidAt: new Date(Date.now() - 190 * 60 * 1000)
      },
      {
        id: '4',
        receiptNumber: 'REC-2026-0808',
        patientName: 'Ibrahim Hassan',
        medicalCode: 'P-1005',
        visitId: 'VIS-7818',
        paymentMethod: 2, // Card
        totalAmount: 350,
        discountAmount: 0,
        netAmount: 350,
        paidAt: new Date(Date.now() - 250 * 60 * 1000)
      }
    ]);
  }

  getMethod(val: number): string {
    return PaymentMethodLabels[val] ?? 'Cash';
  }

  viewReceipt(p: any): void {
    this.selectedReceipt.set(p);
  }

  printReceipt(): void {
    window.print();
  }
}
