import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DoctorService } from '../../../core/services/doctor.service';
import { AuthService } from '../../../core/services/auth.service';
import { Branch, Specialization } from '../../../core/models/doctor.models';

@Component({
  selector: 'app-branches-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-header">
      <div class="page-header__left">
        <h1>Branches & Specializations</h1>
        <p>Manage physical locations and medical specialties for your clinic</p>
      </div>
      <div class="page-header__actions">
        <button class="btn btn-secondary" (click)="showNewSpecModal = true">
          + Add Specialization
        </button>
        <button class="btn btn-primary" (click)="showNewBranchModal = true">
          + Add Branch
        </button>
      </div>
    </div>

    <div class="content-grid">
      <!-- Specializations List Card -->
      <div class="card">
        <div class="card__header">
          <h3>Medical Specializations</h3>
          <span class="badge badge-primary">{{ specs().length }} Active</span>
        </div>
        <div class="card__body">
          @if (specs().length === 0) {
            <p class="text-muted">No specializations configured yet.</p>
          } @else {
            <div class="spec-tags">
              @for (s of specs(); track s.id) {
                <div class="spec-tag">
                  <span>🩺 {{ s.name }}</span>
                </div>
              }
            </div>
          }
        </div>
      </div>

      <!-- Branches List Card -->
      <div class="card">
        <div class="card__header">
          <h3>Clinic Branches</h3>
          <span class="badge badge-info">{{ branches().length }} Locations</span>
        </div>
        <div class="card__body">
          @if (branches().length === 0) {
            <p class="text-muted">No branches configured yet.</p>
          } @else {
            <div class="branch-list">
              @for (b of branches(); track b.id) {
                <div class="branch-item">
                  <div>
                    <h4 style="margin:0;font-size:1rem">📍 {{ b.name }}</h4>
                    <p class="text-muted fs-xs" style="margin:4px 0 0">{{ b.address }} — 📞 {{ b.phone }}</p>
                  </div>
                  <span class="badge badge-success">Active</span>
                </div>
              }
            </div>
          }
        </div>
      </div>
    </div>

    <!-- New Branch Modal -->
    @if (showNewBranchModal) {
      <div class="modal-overlay" (click)="showNewBranchModal = false">
        <div class="modal" (click)="$event.stopPropagation()">
          <div class="modal__header">
            <h2>Add New Branch</h2>
            <button class="btn btn-ghost btn-sm" (click)="showNewBranchModal = false">✕</button>
          </div>
          <div class="modal__body">
            <div class="form-group mb-4">
              <label>Branch Name</label>
              <input type="text" class="form-control" [(ngModel)]="newBranch.name" placeholder="e.g. Main Downtown Branch" />
            </div>
            <div class="form-group mb-4">
              <label>Address</label>
              <input type="text" class="form-control" [(ngModel)]="newBranch.address" placeholder="123 Medical St, Zagazig" />
            </div>
            <div class="form-group">
              <label>Phone Number</label>
              <input type="tel" class="form-control" [(ngModel)]="newBranch.phone" placeholder="0552300000" />
            </div>
          </div>
          <div class="modal__footer">
            <button class="btn btn-secondary" (click)="showNewBranchModal = false">Cancel</button>
            <button class="btn btn-primary" (click)="createBranch()">Create Branch</button>
          </div>
        </div>
      </div>
    }

    <!-- New Spec Modal -->
    @if (showNewSpecModal) {
      <div class="modal-overlay" (click)="showNewSpecModal = false">
        <div class="modal" (click)="$event.stopPropagation()">
          <div class="modal__header">
            <h2>Add Specialization</h2>
            <button class="btn btn-ghost btn-sm" (click)="showNewSpecModal = false">✕</button>
          </div>
          <div class="modal__body">
            <div class="form-group">
              <label>Specialization Name</label>
              <input type="text" class="form-control" [(ngModel)]="newSpecName" placeholder="e.g. Cardiology, Pediatrics" />
            </div>
          </div>
          <div class="modal__footer">
            <button class="btn btn-secondary" (click)="showNewSpecModal = false">Cancel</button>
            <button class="btn btn-primary" (click)="createSpec()">Create Specialization</button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .spec-tags { display: flex; flex-wrap: wrap; gap: 10px; }
    .spec-tag { background: var(--surface-2); border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 8px 14px; font-size: 0.875rem; font-weight: 500; }
    .branch-list { display: flex; flex-direction: column; gap: 12px; }
    .branch-item { display: flex; justify-content: space-between; align-items: center; padding: 14px; background: var(--surface-2); border-radius: var(--radius-md); border: 1px solid var(--border); }
  `]
})
export class BranchesListComponent implements OnInit {
  branches = signal<Branch[]>([]);
  specs    = signal<Specialization[]>([]);

  showNewBranchModal = false;
  showNewSpecModal   = false;

  newBranch = { name: '', address: '', phone: '' };
  newSpecName = '';

  constructor(
    private doctorService: DoctorService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    const cid = this.auth.clinicId();
    if (!cid) return;

    this.doctorService.getBranchesByClinic(cid).subscribe({
      next: (b) => this.branches.set(b)
    });

    this.doctorService.getSpecializationsByClinic(cid).subscribe({
      next: (s) => this.specs.set(s)
    });
  }

  createBranch(): void {
    const cid = this.auth.clinicId();
    if (!this.newBranch.name || !cid) return;

    this.doctorService.createBranch({ clinicId: cid, ...this.newBranch }).subscribe({
      next: () => {
        this.showNewBranchModal = false;
        this.newBranch = { name: '', address: '', phone: '' };
        this.loadData();
      }
    });
  }

  createSpec(): void {
    const cid = this.auth.clinicId();
    if (!this.newSpecName || !cid) return;

    this.doctorService.createSpecialization({ clinicId: cid, name: this.newSpecName }).subscribe({
      next: () => {
        this.showNewSpecModal = false;
        this.newSpecName = '';
        this.loadData();
      }
    });
  }
}
