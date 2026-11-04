import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';

interface RolePersona {
  role: string;
  title: string;
  badge: string;
  badgeClass: string;
  icon: string;
  description: string;
  features: string[];
  email: string;
  pass: string;
}

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="landing-page" [attr.dir]="isArabic() ? 'rtl' : 'ltr'">
      <!-- ── ULTRA-PREMIUM FLOATING ISLAND NAVBAR ────────────── -->
      <header class="landing-header">
        <div class="nav-island">
          
          <!-- Left: Brand Identity -->
          <div class="nav-brand">
            <div class="brand-logo-mark">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 2v20M2 12h20"/>
              </svg>
            </div>
            <div class="brand-info">
              <span class="brand-title">SmartClinic</span>
              <span class="brand-pill">{{ isArabic() ? 'نظام معتمد' : 'Enterprise' }}</span>
            </div>
          </div>

          <!-- Center: Clean Floating Menu Links -->
          <nav class="nav-menu">
            <a href="#compliance" class="nav-link">{{ isArabic() ? 'معايير الاعتماد' : 'Accreditation' }}</a>
            <a href="#features" class="nav-link">{{ isArabic() ? 'المميزات' : 'Features' }}</a>
            <a href="#roles" class="nav-link">{{ isArabic() ? 'الأدوار الأربعة' : '4-Role Matrix' }}</a>
            <a href="#architecture" class="nav-link">{{ isArabic() ? 'المعمارية' : 'Architecture' }}</a>
            <a href="http://localhost:5239/swagger" target="_blank" class="nav-link api-link">
              <span>API</span>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            </a>
          </nav>

          <!-- Right: Utility Capsule & Action Group -->
          <div class="nav-actions">
            
            <!-- Capsule Controls: Theme & Lang in ONE unified widget -->
            <div class="utility-capsule">
              <button type="button" class="capsule-btn" (click)="toggleTheme()" [title]="isDark() ? 'Clinical Light Mode' : 'Dark Mode'">
                @if (isDark()) {
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
                } @else {
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
                }
              </button>
              <div class="capsule-sep"></div>
              <button type="button" class="capsule-btn lang-btn" (click)="toggleLanguage()" [title]="isArabic() ? 'Switch to English' : 'التحويل للعربية'">
                {{ isArabic() ? 'EN' : 'عربي' }}
              </button>
            </div>

            <!-- Sign In Link -->
            <a routerLink="/login" class="btn-signin">{{ isArabic() ? 'تسجيل الدخول' : 'Sign In' }}</a>

            <!-- Primary Gradient Action Button -->
            <a href="#roles" class="btn-primary-action">
              <span>⚡ {{ isArabic() ? 'تجربة المنظومة' : 'Try Sandbox' }}</span>
            </a>

          </div>

        </div>
      </header>

      <!-- ── HERO SECTION ────────────────────────────────────── -->
      <header class="hero-section">
        <div class="hero-glow"></div>
        <div class="hero-container">
          <div class="hero-pill">
            <span class="pill-dot"></span>
            <span>{{ isArabic() ? 'المنظومة السحابية الطبية المعتمدة' : 'Enterprise Multi-Tenant Healthcare OS' }}</span>
            <span class="pill-divider">•</span>
            <span class="pill-tag">.NET 9 + Angular 19</span>
          </div>

          <h1 class="hero-title">
            @if (isArabic()) {
              <span>النظام الذكي المتطور لإدارة </span><span class="gradient-text">المراكز الطبية والعيادات التخصصية</span>
            } @else {
              <span>The Modern Operating System for </span><span class="gradient-text">Smart Clinics & Poly-Centers</span>
            }
          </h1>

          <p class="hero-subtitle">
            @if (isArabic()) {
              بنية تحتية برمجية بمعمارية Clean Architecture و CQRS لعزل بيانات الفروع والعيادات، وتنظيم طابور الانتظار اللحظي، والملفات الطبية EMR، والروشتات الرقمية المعتمدة مع تحصيل الفواتير النقدية والبنكية.
            } @else {
              Engineered with strict Clean Architecture, CQRS, and role-based operational segregation. 
              Automate patient waiting queues, electronic medical records (EMR), digital prescriptions, 
              and cash/card billing across multi-branch healthcare centers.
            }
          </p>

          <div class="hero-cta-group">
            <a routerLink="/login" class="btn-hero-primary">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
              <span>{{ isArabic() ? 'دخول لوحة التحكم' : 'Launch Clinic Workspace' }}</span>
            </a>
            <a href="#roles" class="btn-hero-secondary">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
              <span>{{ isArabic() ? 'تجربة الأدوار الأربعة' : 'Select Interactive Role' }}</span>
            </a>
          </div>

          <!-- Quick Metrics Bar -->
          <div class="metrics-bar">
            <div class="metric-item">
              <span class="metric-val">{{ isArabic() ? '٤ أدوار' : '4 Roles' }}</span>
              <span class="metric-lbl">{{ isArabic() ? 'عزل كامل للصلاحيات' : 'Strict RBAC Isolation' }}</span>
            </div>
            <div class="metric-divider"></div>
            <div class="metric-item">
              <span class="metric-val">&lt; 150ms</span>
              <span class="metric-lbl">{{ isArabic() ? 'سرعة استجابة CQRS' : 'CQRS Query Latency' }}</span>
            </div>
            <div class="metric-divider"></div>
            <div class="metric-item">
              <span class="metric-val">100%</span>
              <span class="metric-lbl">{{ isArabic() ? 'عزل الفروع والمستأجرين' : 'Multi-Branch Scoped' }}</span>
            </div>
            <div class="metric-divider"></div>
            <div class="metric-item">
              <span class="metric-val">EMR + Rx</span>
              <span class="metric-lbl">{{ isArabic() ? 'روشتات معتمدة للطباعة' : 'Printable Medical Records' }}</span>
            </div>
          </div>
        </div>
      </header>

      <!-- ── MEDICAL ACCREDITATION & TRUST COMPLIANCE ────────── -->
      <section id="compliance" class="section-compliance">
        <div class="section-container">
          <div class="compliance-box">
            <div class="compliance-header">
              <span class="compliance-tag">{{ isArabic() ? 'معايير الاعتماد والجودة المؤسسية' : 'Healthcare Standards & Enterprise Compliance' }}</span>
              <h3>{{ isArabic() ? 'بنية تحتية هندسية معتمدة لحماية وسرية البيانات الطبية' : 'Engineered for Real-World Regulatory Compliance' }}</h3>
              <p>{{ isArabic() ? 'تم بناء النظام وفق أرقى بروتوكولات الأمان والعزل للبيانات الصحية، والربط المالي المعتمد' : 'Built from the ground up according to strict healthcare security standards, clinical confidentiality, and official tax requirements.' }}</p>
            </div>

            <div class="compliance-grid">
              <div class="compliance-item">
                <div class="comp-icon comp-blue">🛡️</div>
                <div class="comp-meta">
                  <h4>{{ isArabic() ? 'عزل البيانات وفق HIPAA' : 'HIPAA Privacy Safeguards' }}</h4>
                  <p>{{ isArabic() ? 'تشفير تام للبيانات السريرية وسجلات المرضى مع عزل تام لقاعدة بيانات كل عيادة' : 'Zero-trust tenant isolation with end-to-end encryption for electronic health records.' }}</p>
                </div>
              </div>

              <div class="compliance-item">
                <div class="comp-icon comp-emerald">🏛️</div>
                <div class="comp-meta">
                  <h4>{{ isArabic() ? 'معايير أمان ISO 27001' : 'ISO 27001 Aligned Security' }}</h4>
                  <p>{{ isArabic() ? 'سجل تتبع وتدقيق رقمي (Audit Logs) لكافة العمليات والصلاحيات لمنع التلاعب' : 'Strict role-based access control (RBAC) with immutable clinical audit logging.' }}</p>
                </div>
              </div>

              <div class="compliance-item">
                <div class="comp-icon comp-amber">📑</div>
                <div class="comp-meta">
                  <h4>{{ isArabic() ? 'منظومة الإيصال الإلكتروني' : 'Tax Authority e-Receipt Ready' }}</h4>
                  <p>{{ isArabic() ? 'سندات قبض وفواتير متوافقة مع متطلبات مصلحة الضرائب المصرية' : 'Direct payment settlement with digital receipt numbering and VAT compliance.' }}</p>
                </div>
              </div>

              <div class="compliance-item">
                <div class="comp-icon comp-violet">🩺</div>
                <div class="comp-meta">
                  <h4>{{ isArabic() ? 'معايير HL7 / FHIR الطبية' : 'HL7 / FHIR Compatible Records' }}</h4>
                  <p>{{ isArabic() ? 'نماذج قياسية للأمراض والحساسيات الدوائية والروشتات الطبية المعتمدة' : 'Standardized clinical coding for ICD-10 symptoms, drug allergies, and e-Prescriptions.' }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ── 4-ROLE SANDBOX INTERACTIVE SECTION ─────────────── -->
      <section id="roles" class="section-roles">
        <div class="section-container">
          <div class="section-header">
            <span class="section-tag">Interactive Evaluation Sandbox</span>
            <h2>Test the Entire Healthcare Journey by Role</h2>
            <p>Click any persona below to authenticate instantly and inspect their custom-tailored interface and permissions.</p>
          </div>

          <div class="roles-grid">
            @for (p of personas; track p.role) {
              <div class="role-card" [class.is-loading]="loggingIn() === p.role">
                <div class="role-card__top">
                  <span class="role-badge {{ p.badgeClass }}">{{ p.badge }}</span>
                  <div class="role-icon" [innerHTML]="p.icon"></div>
                </div>

                <h3 class="role-title">{{ p.title }}</h3>
                <p class="role-desc">{{ p.description }}</p>

                <ul class="role-features">
                  @for (f of p.features; track f) {
                    <li>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                      <span>{{ f }}</span>
                    </li>
                  }
                </ul>

                <button 
                  class="btn-role-action" 
                  [disabled]="loggingIn() !== null"
                  (click)="launchPersona(p)">
                  @if (loggingIn() === p.role) {
                    <span class="spinner-sm"></span>
                    <span>Authenticating...</span>
                  } @else {
                    <span>🚀 Launch as {{ p.title }}</span>
                  }
                </button>
              </div>
            }
          </div>
        </div>
      </section>

      <!-- ── CORE FEATURES ────────────────────────────────────── -->
      <section id="features" class="section-features">
        <div class="section-container">
          <div class="section-header">
            <span class="section-tag">Clinical Modules</span>
            <h2>Built for Demanding Healthcare Environments</h2>
            <p>From initial booking to patient departure, every clinical step is guarded and auditable.</p>
          </div>

          <div class="features-grid">
            <div class="feat-card">
              <div class="feat-icon feat-blue">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              </div>
              <h3>Live Clinic Queue & Triage</h3>
              <p>Receptionists advance patients from arrival to triage; doctors see live patient queues update without manual refresh.</p>
            </div>

            <div class="feat-card">
              <div class="feat-icon feat-emerald">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
              </div>
              <h3>Comprehensive EMR & Allergies</h3>
              <p>Electronic medical records maintain chronic illness histories, past surgical interventions, and severe drug allergy warnings.</p>
            </div>

            <div class="feat-card">
              <div class="feat-icon feat-amber">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              </div>
              <h3>Digital Prescriptions (e-Rx)</h3>
              <p>Formulated medicine composer with dosage, frequency, duration, and 1-click printable hospital prescription layout.</p>
            </div>

            <div class="feat-card">
              <div class="feat-icon feat-violet">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><line x1="12" y1="18" x2="12" y2="20"/><line x1="12" y1="4" x2="12" y2="6"/></svg>
              </div>
              <h3>Integrated Financial Ledger</h3>
              <p>Cash, Credit Card, and Insurance payment processing with auto-generated receipt numbering and daily revenue tally.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- ── ARCHITECTURE HIGHLIGHTS ──────────────────────────── -->
      <section id="architecture" class="section-arch">
        <div class="section-container">
          <div class="section-header">
            <span class="section-tag">Engineering Rigor</span>
            <h2>Architected for Cloud Scalability & Zero Data Leakage</h2>
            <p>Designed following modern software engineering best practices.</p>
          </div>

          <div class="arch-card">
            <div class="arch-col">
              <div class="arch-badge">Backend Core</div>
              <h4>.NET 9 + Clean Architecture</h4>
              <p>Strict Domain layer isolation, CQRS separation via MediatR, pipeline validation behaviors (FluentValidation), and custom exception handling middleware.</p>
              <div class="tech-tags">
                <span class="tag">C# 13</span>
                <span class="tag">.NET 9</span>
                <span class="tag">MediatR</span>
                <span class="tag">EF Core 9</span>
                <span class="tag">JWT RBAC</span>
              </div>
            </div>

            <div class="arch-col-divider"></div>

            <div class="arch-col">
              <div class="arch-badge">Frontend Architecture</div>
              <h4>Angular 19 Standalone</h4>
              <p>Modern Signals for fine-grained reactive state without unnecessary re-renders. Functional route guards, automated JWT interceptors, and Dark/Light Glassmorphism.</p>
              <div class="tech-tags">
                <span class="tag">Angular 19</span>
                <span class="tag">Signals</span>
                <span class="tag">Standalone</span>
                <span class="tag">Chart.js</span>
                <span class="tag">SCSS Tokens</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ── FOOTER ───────────────────────────────────────────── -->
      <footer class="landing-footer">
        <div class="footer-container">
          <div class="footer-brand">
            <span class="logo-text">SmartClinic</span>
            <span class="copy-text">Enterprise Healthcare Management Platform • Developed with .NET 9 & Angular 19</span>
          </div>

          <div class="footer-links">
            <a routerLink="/login">Sign In</a>
            <a routerLink="/register">Register</a>
            <a href="https://localhost:7006/swagger" target="_blank">Swagger Documentation</a>
          </div>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    .landing-page {
      min-height: 100vh;
      background: #080d1a;
      color: #f8fafc;
      font-family: 'Plus Jakarta Sans', -apple-system, sans-serif;
      overflow-x: hidden;
      position: relative;
    }

    // ── Floating Island Header ────────────────────────────
    .landing-header {
      position: sticky;
      top: 0;
      z-index: 100;
      padding: 16px 24px;
      display: flex;
      justify-content: center;
      pointer-events: none;
    }

    .nav-island {
      pointer-events: auto;
      width: 100%;
      max-width: 1140px;
      background: rgba(15, 23, 42, 0.82);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 9999px;
      padding: 8px 16px 8px 12px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.08);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    // Brand Group
    .nav-brand {
      display: flex;
      align-items: center;
      gap: 10px;
      flex-shrink: 0;
    }
    .brand-logo-mark {
      width: 32px;
      height: 32px;
      border-radius: 999px;
      background: linear-gradient(135deg, #0ea5e9, #10b981);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #ffffff;
      box-shadow: 0 2px 8px rgba(14, 165, 233, 0.35);
    }
    .brand-info {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .brand-title {
      font-weight: 800;
      font-size: 1.025rem;
      letter-spacing: -0.02em;
      color: #f8fafc;
    }
    .brand-pill {
      font-size: 0.65rem;
      font-weight: 700;
      padding: 2px 7px;
      background: rgba(14, 165, 233, 0.12);
      border: 1px solid rgba(14, 165, 233, 0.25);
      border-radius: 999px;
      color: #38bdf8;
      letter-spacing: 0.02em;
      text-transform: uppercase;
    }

    // Center Menu
    .nav-menu {
      display: flex;
      align-items: center;
      gap: 4px;
      @media (max-width: 960px) { display: none; }
    }
    .nav-link {
      color: #94a3b8;
      font-size: 0.8125rem;
      font-weight: 600;
      padding: 6px 12px;
      border-radius: 999px;
      transition: all 0.2s ease;
      text-decoration: none;
      white-space: nowrap;

      &:hover {
        color: #f8fafc;
        background: rgba(255, 255, 255, 0.08);
      }
    }
    .api-link {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      color: #38bdf8;
      &:hover { color: #7dd3fc; }
    }

    // Right Actions Cluster
    .nav-actions {
      display: flex;
      align-items: center;
      gap: 12px;
      flex-shrink: 0;
    }

    // Utility Capsule (Theme + Lang in ONE unified widget)
    .utility-capsule {
      display: flex;
      align-items: center;
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid rgba(255, 255, 255, 0.09);
      border-radius: 999px;
      padding: 2px 4px;
      gap: 2px;
    }
    .capsule-btn {
      border: none;
      background: transparent;
      color: #cbd5e1;
      height: 28px;
      padding: 0 8px;
      border-radius: 999px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-size: 0.75rem;
      font-weight: 700;
      transition: all 0.2s ease;

      &:hover {
        color: #38bdf8;
        background: rgba(255, 255, 255, 0.08);
      }
    }
    .capsule-sep {
      width: 1px;
      height: 14px;
      background: rgba(255, 255, 255, 0.12);
    }
    .lang-btn {
      font-family: 'Cairo', inherit;
      padding: 0 10px;
    }

    // Sign In Link
    .btn-signin {
      color: #cbd5e1;
      font-size: 0.8125rem;
      font-weight: 600;
      padding: 6px 12px;
      border-radius: 999px;
      text-decoration: none;
      transition: color 0.2s ease;
      white-space: nowrap;

      &:hover {
        color: #ffffff;
      }
    }

    // Primary CTA Pill
    .btn-primary-action {
      background: linear-gradient(135deg, #0ea5e9, #0284c7);
      color: #ffffff;
      font-size: 0.8125rem;
      font-weight: 700;
      padding: 7px 18px;
      border-radius: 999px;
      text-decoration: none;
      box-shadow: 0 4px 14px rgba(14, 165, 233, 0.35);
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      white-space: nowrap;

      &:hover {
        transform: translateY(-1px);
        box-shadow: 0 6px 20px rgba(14, 165, 233, 0.5);
      }
    }

    // Hero
    .hero-section {
      position: relative;
      padding: 90px 24px 80px;
      text-align: center;
      overflow: hidden;
    }
    .hero-glow {
      position: absolute;
      top: -120px;
      left: 50%;
      transform: translateX(-50%);
      width: 700px;
      height: 400px;
      background: radial-gradient(circle, rgba(14, 165, 233, 0.18) 0%, transparent 70%);
      filter: blur(80px);
      pointer-events: none;
    }
    .hero-container {
      max-width: 900px;
      margin: 0 auto;
      position: relative;
      z-index: 2;
    }
    .hero-pill {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 16px;
      background: rgba(14, 165, 233, 0.1);
      border: 1px solid rgba(14, 165, 233, 0.25);
      border-radius: 999px;
      font-size: 0.8125rem;
      font-weight: 600;
      color: #38bdf8;
      margin-bottom: 24px;
    }
    .pill-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #10b981;
      box-shadow: 0 0 8px #10b981;
    }
    .pill-divider { opacity: 0.4; }
    .hero-title {
      font-size: 3.25rem;
      font-weight: 800;
      line-height: 1.15;
      letter-spacing: -0.03em;
      margin-bottom: 20px;
      @media (max-width: 768px) { font-size: 2.25rem; }
    }
    .gradient-text {
      background: linear-gradient(135deg, #38bdf8 0%, #34d399 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .hero-subtitle {
      font-size: 1.125rem;
      color: #94a3b8;
      line-height: 1.6;
      max-width: 740px;
      margin: 0 auto 36px;
    }
    .hero-cta-group {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 16px;
      margin-bottom: 60px;
      flex-wrap: wrap;
    }
    .btn-hero-primary {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      background: linear-gradient(135deg, #0ea5e9, #0284c7);
      color: #fff;
      font-weight: 600;
      font-size: 1rem;
      padding: 13px 28px;
      border-radius: 10px;
      box-shadow: 0 8px 24px rgba(14, 165, 233, 0.35);
      transition: all 0.2s;
      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 12px 30px rgba(14, 165, 233, 0.45);
      }
    }
    .btn-hero-secondary {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.12);
      color: #f8fafc;
      font-weight: 600;
      font-size: 1rem;
      padding: 13px 26px;
      border-radius: 10px;
      transition: all 0.2s;
      &:hover {
        background: rgba(255, 255, 255, 0.1);
        border-color: rgba(255, 255, 255, 0.2);
      }
    }

    // Metrics Bar
    .metrics-bar {
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(15, 23, 42, 0.7);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 14px;
      padding: 18px 28px;
      max-width: 820px;
      margin: 0 auto;
      gap: 32px;
      @media (max-width: 768px) {
        flex-direction: column;
        gap: 16px;
      }
    }
    .metric-item {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .metric-val {
      font-size: 1.35rem;
      font-weight: 700;
      color: #f8fafc;
      letter-spacing: -0.02em;
    }
    .metric-lbl {
      font-size: 0.75rem;
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }
    .metric-divider {
      width: 1px;
      height: 32px;
      background: rgba(255, 255, 255, 0.1);
      @media (max-width: 768px) { display: none; }
    }

    // Section Commons
    .section-roles, .section-features, .section-arch {
      padding: 90px 24px;
      border-top: 1px solid rgba(255, 255, 255, 0.06);
    }
    .section-container {
      max-width: 1240px;
      margin: 0 auto;
    }
    .section-header {
      text-align: center;
      max-width: 680px;
      margin: 0 auto 56px;
      .section-tag {
        font-size: 0.75rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: #38bdf8;
        display: block;
        margin-bottom: 8px;
      }
      h2 {
        font-size: 2.25rem;
        font-weight: 800;
        letter-spacing: -0.02em;
        margin-bottom: 12px;
      }
      p {
        color: #94a3b8;
        font-size: 1rem;
        line-height: 1.5;
      }
    }

    // Roles Grid
    .roles-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 20px;
      @media (max-width: 1100px) { grid-template-columns: repeat(2, 1fr); }
      @media (max-width: 600px) { grid-template-columns: 1fr; }
    }
    .role-card {
      background: #0f172a;
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 16px;
      padding: 24px;
      display: flex;
      flex-direction: column;
      transition: all 0.25s ease;
      position: relative;
      overflow: hidden;

      &:hover {
        border-color: rgba(14, 165, 233, 0.4);
        transform: translateY(-4px);
        box-shadow: 0 16px 36px -8px rgba(0, 0, 0, 0.5);
      }
    }
    .role-card__top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 16px;
    }
    .role-badge {
      font-size: 0.7rem;
      font-weight: 700;
      padding: 4px 10px;
      border-radius: 6px;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }
    .badge-admin { background: rgba(239, 68, 68, 0.15); color: #f87171; }
    .badge-doctor { background: rgba(14, 165, 233, 0.15); color: #38bdf8; }
    .badge-patient { background: rgba(16, 185, 129, 0.15); color: #34d399; }
    .badge-rec { background: rgba(245, 158, 11, 0.15); color: #fbbf24; }

    .role-icon {
      width: 36px;
      height: 36px;
      border-radius: 8px;
      background: rgba(255, 255, 255, 0.05);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #94a3b8;
    }
    .role-title {
      font-size: 1.15rem;
      font-weight: 700;
      margin-bottom: 8px;
    }
    .role-desc {
      font-size: 0.8125rem;
      color: #94a3b8;
      line-height: 1.5;
      margin-bottom: 20px;
      min-height: 48px;
    }
    .role-features {
      list-style: none;
      padding: 0;
      margin: 0 0 24px 0;
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 10px;

      li {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 0.8rem;
        color: #cbd5e1;
        svg { color: #10b981; flex-shrink: 0; }
      }
    }
    .btn-role-action {
      width: 100%;
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid rgba(255, 255, 255, 0.12);
      color: #f8fafc;
      padding: 11px 16px;
      border-radius: 10px;
      font-weight: 600;
      font-size: 0.85rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      transition: all 0.2s;

      &:hover:not(:disabled) {
        background: #0ea5e9;
        border-color: #0ea5e9;
        color: #fff;
        box-shadow: 0 4px 14px rgba(14, 165, 233, 0.35);
      }
      &:disabled { opacity: 0.6; cursor: not-allowed; }
    }
    .spinner-sm {
      width: 14px;
      height: 14px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top-color: #fff;
      border-radius: 50%;
      animation: spin 0.6s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    // Features Grid
    .features-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 20px;
      @media (max-width: 1024px) { grid-template-columns: repeat(2, 1fr); }
      @media (max-width: 600px) { grid-template-columns: 1fr; }
    }
    .feat-card {
      background: #0f172a;
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 16px;
      padding: 28px;
      transition: all 0.2s;
      &:hover {
        border-color: rgba(255, 255, 255, 0.16);
        transform: translateY(-2px);
      }
      h3 {
        font-size: 1.1rem;
        font-weight: 700;
        margin: 18px 0 8px;
      }
      p {
        color: #94a3b8;
        font-size: 0.85rem;
        line-height: 1.5;
        margin: 0;
      }
    }
    .feat-icon {
      width: 44px;
      height: 44px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .feat-blue { background: rgba(14, 165, 233, 0.12); color: #38bdf8; }
    .feat-emerald { background: rgba(16, 185, 129, 0.12); color: #34d399; }
    .feat-amber { background: rgba(245, 158, 11, 0.12); color: #fbbf24; }
    .feat-violet { background: rgba(139, 92, 246, 0.12); color: #c084fc; }

    // Arch Card
    .arch-card {
      background: #0f172a;
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 18px;
      padding: 36px;
      display: flex;
      gap: 36px;
      @media (max-width: 768px) { flex-direction: column; }
    }
    .arch-col {
      flex: 1;
      h4 {
        font-size: 1.3rem;
        font-weight: 700;
        margin: 12px 0 8px;
      }
      p {
        color: #94a3b8;
        font-size: 0.9rem;
        line-height: 1.6;
        margin-bottom: 20px;
      }
    }
    .arch-badge {
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #38bdf8;
    }
    .arch-col-divider {
      width: 1px;
      background: rgba(255, 255, 255, 0.08);
      @media (max-width: 768px) { display: none; }
    }
    .tech-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
    .tag {
      font-size: 0.75rem;
      font-weight: 600;
      padding: 4px 10px;
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 6px;
      color: #cbd5e1;
    }

    // ── Compliance Section Styles ─────────────────────────
    .section-compliance {
      padding: 60px 24px 30px;
      border-top: 1px solid rgba(255, 255, 255, 0.06);
    }
    .compliance-box {
      background: linear-gradient(180deg, rgba(15, 23, 42, 0.7) 0%, rgba(8, 13, 26, 0.9) 100%);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 20px;
      padding: 40px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    }
    .compliance-header {
      text-align: center;
      max-width: 720px;
      margin: 0 auto 36px;
      .compliance-tag {
        font-size: 0.75rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: #38bdf8;
        display: block;
        margin-bottom: 8px;
      }
      h3 {
        font-size: 1.65rem;
        font-weight: 800;
        letter-spacing: -0.02em;
        margin-bottom: 10px;
        color: #f8fafc;
      }
      p {
        color: #94a3b8;
        font-size: 0.925rem;
        line-height: 1.6;
      }
    }
    .compliance-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 20px;
      @media (max-width: 1024px) { grid-template-columns: repeat(2, 1fr); }
      @media (max-width: 640px) { grid-template-columns: 1fr; }
    }
    .compliance-item {
      display: flex;
      gap: 16px;
      align-items: flex-start;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 14px;
      padding: 20px 18px;
      transition: all 0.2s ease;
      &:hover {
        border-color: rgba(14, 165, 233, 0.35);
        transform: translateY(-2px);
      }
    }
    .comp-icon {
      font-size: 1.5rem;
      flex-shrink: 0;
      width: 44px;
      height: 44px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .comp-blue { background: rgba(14, 165, 233, 0.12); }
    .comp-emerald { background: rgba(16, 185, 129, 0.12); }
    .comp-amber { background: rgba(245, 158, 11, 0.12); }
    .comp-violet { background: rgba(139, 92, 246, 0.12); }
    .comp-meta {
      h4 {
        font-size: 0.95rem;
        font-weight: 700;
        margin-bottom: 6px;
        color: #f8fafc;
      }
      p {
        font-size: 0.8rem;
        line-height: 1.5;
        color: #94a3b8;
        margin: 0;
      }
    }

    // ── Clinical Light Theme Support ────────────────────────
    :host-context([data-theme="light"]) {
      .landing-page {
        background: #f8fafc;
        color: #0f172a;

        .nav-island {
          background: rgba(255, 255, 255, 0.92);
          border-color: rgba(15, 23, 42, 0.1);
          box-shadow: 0 10px 25px -4px rgba(15, 23, 42, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.9);

          .brand-title { color: #0f172a; }
          .brand-pill {
            background: rgba(2, 132, 199, 0.08);
            border-color: rgba(2, 132, 199, 0.2);
            color: #0284c7;
          }

          .nav-link {
            color: #64748b;
            &:hover {
              color: #0f172a;
              background: #f1f5f9;
            }
          }
          .api-link {
            color: #0284c7;
            &:hover { color: #0369a1; }
          }

          .utility-capsule {
            background: #f1f5f9;
            border-color: #e2e8f0;
            .capsule-btn {
              color: #334155;
              &:hover {
                color: #0284c7;
                background: #ffffff;
              }
            }
            .capsule-sep {
              background: #cbd5e1;
            }
          }

          .btn-signin {
            color: #475569;
            &:hover { color: #0f172a; }
          }

          .btn-primary-action {
            background: linear-gradient(135deg, #0284c7, #0369a1);
            box-shadow: 0 4px 14px rgba(2, 132, 199, 0.3);
          }
        }

        .hero-title { color: #0f172a; }
        .hero-subtitle { color: #475569; }
        .hero-glow {
          background: radial-gradient(circle, rgba(2, 132, 199, 0.12) 0%, transparent 70%);
        }

        .hero-pill {
          background: rgba(2, 132, 199, 0.08);
          border-color: rgba(2, 132, 199, 0.25);
          color: #0284c7;
        }

        .metrics-bar {
          background: #ffffff;
          border-color: #e2e8f0;
          box-shadow: 0 4px 16px rgba(15, 23, 42, 0.05);

          .metric-val { color: #0f172a; }
          .metric-lbl { color: #64748b; }
          .metric-divider { background: #e2e8f0; }
        }

        .section-roles, .section-features, .section-arch, .section-compliance {
          border-top-color: #e2e8f0;
        }

        .section-header {
          .section-tag { color: #0284c7; }
          h2 { color: #0f172a; }
          p { color: #64748b; }
        }

        .compliance-box {
          background: #ffffff;
          border-color: #e2e8f0;
          box-shadow: 0 4px 20px rgba(15, 23, 42, 0.06);

          .compliance-tag { color: #0284c7; }
          .compliance-header h3 { color: #0f172a; }
          .compliance-header p { color: #64748b; }
        }

        .compliance-item {
          background: #f8fafc;
          border-color: #e2e8f0;
          &:hover {
            border-color: rgba(2, 132, 199, 0.4);
            box-shadow: 0 6px 16px rgba(15, 23, 42, 0.06);
          }
          .comp-meta h4 { color: #0f172a; }
          .comp-meta p { color: #64748b; }
        }

        .role-card, .feat-card, .arch-card {
          background: #ffffff;
          border-color: #e2e8f0;
          box-shadow: 0 2px 8px rgba(15, 23, 42, 0.04);

          &:hover {
            border-color: rgba(2, 132, 199, 0.4);
            box-shadow: 0 12px 28px -6px rgba(15, 23, 42, 0.08);
          }
        }

        .role-title, .feat-card h4, .arch-col h4 {
          color: #0f172a;
        }

        .role-desc, .feat-card p, .arch-col p {
          color: #64748b;
        }

        .role-features li {
          color: #334155;
          svg { color: #0284c7; }
        }

        .btn-role-action {
          background: #f1f5f9;
          border-color: #cbd5e1;
          color: #0f172a;

          &:hover {
            background: #0284c7;
            border-color: #0284c7;
            color: #ffffff;
          }
        }

        .landing-footer {
          background: #f1f5f9;
          border-top-color: #e2e8f0;

          .logo-text { color: #0f172a; }
          .copy-text { color: #64748b; }
          .footer-links a {
            color: #475569;
            &:hover { color: #0284c7; }
          }
        }
      }
    }

    // ── Arabic RTL Styles ─────────────────────────────────
    .landing-page[dir="rtl"] {
      font-family: 'Cairo', 'IBM Plex Sans Arabic', sans-serif;
      text-align: right;

      .brand-meta, .hero-section {
        direction: rtl;
      }
      .nav-links, .nav-actions {
        direction: rtl;
      }
      .compliance-item {
        flex-direction: row-reverse;
        text-align: right;
      }
      .role-features li {
        flex-direction: row-reverse;
      }
      .feat-card {
        text-align: right;
      }
      .arch-card {
        direction: rtl;
        text-align: right;
      }
    }

    // Footer
    .landing-footer {
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      padding: 32px 24px;
      background: #060a14;
    }
    .footer-container {
      max-width: 1240px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      flex-wrap: wrap;
    }
    .footer-brand {
      display: flex;
      flex-direction: column;
      gap: 4px;
      .logo-text { font-weight: 700; font-size: 1rem; color: #f8fafc; }
      .copy-text { font-size: 0.775rem; color: #64748b; }
    }
    .footer-links {
      display: flex;
      align-items: center;
      gap: 20px;
      a {
        color: #94a3b8;
        font-size: 0.8125rem;
        transition: color 0.2s;
        &:hover { color: #f8fafc; }
      }
    }
  `]
})
export class LandingPageComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  private toast = inject(ToastService);

  loggingIn = signal<string | null>(null);
  isArabic = signal(false);
  isDark = signal(true);

  constructor() {
    const savedTheme = localStorage.getItem('smartclinic_theme');
    if (savedTheme === 'light') {
      this.isDark.set(false);
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      this.isDark.set(true);
      document.documentElement.removeAttribute('data-theme');
    }

    const savedLang = localStorage.getItem('smartclinic_lang');
    if (savedLang === 'ar') {
      this.isArabic.set(true);
    }
  }

  toggleTheme(): void {
    this.isDark.update(v => !v);
    if (this.isDark()) {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('smartclinic_theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('smartclinic_theme', 'light');
    }
  }

  toggleLanguage(): void {
    this.isArabic.update(v => !v);
    localStorage.setItem('smartclinic_lang', this.isArabic() ? 'ar' : 'en');
  }

  readonly personas: RolePersona[] = [
    {
      role: 'ClinicAdmin',
      title: 'Clinic Admin',
      badge: 'Full Oversight',
      badgeClass: 'badge-admin',
      icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`,
      description: 'Supervises branch performance, reviews daily clinic revenue, and configures doctors & medical branches.',
      features: ['Revenue & Branch Analytics', 'Doctor Staff Onboarding', 'Branch & Specialization Setup', 'Auditable Ledgers'],
      email: 'admin@smartclinic.com',
      pass: 'Admin@123'
    },
    {
      role: 'Doctor',
      title: 'Medical Specialist',
      badge: 'Clinical Console',
      badgeClass: 'badge-doctor',
      icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>`,
      description: 'Dedicated doctor workstation for live patient queue, clinical diagnosis, and digital prescription issuance.',
      features: ['Live Patient Waiting Queue', '1-Click Visit Start', 'e-Prescription Composer', 'EMR & Allergies Review'],
      email: 'doctor@smartclinic.com',
      pass: 'Doctor@123'
    },
    {
      role: 'Receptionist',
      title: 'Reception Desk',
      badge: 'Front-Desk Operations',
      badgeClass: 'badge-rec',
      icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
      description: 'Patient check-in, walk-in registration, queue progression management, and billing receipt generation.',
      features: ['Walk-in Patient Triage', 'Queue Check-In', 'Cash & Card Payments', 'Receipt Invoicing'],
      email: 'receptionist@smartclinic.com',
      pass: 'Reception@123'
    },
    {
      role: 'Patient',
      title: 'Patient Portal',
      badge: 'Self-Service',
      badgeClass: 'badge-patient',
      icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
      description: 'Patient health hub: digital medical ID, self-service appointment scheduling, and digital prescription records.',
      features: ['Digital Medical Code', 'Self Appointment Booking', 'My Prescriptions Archive', 'Doctor Directory'],
      email: 'patient@smartclinic.com',
      pass: 'Patient@123'
    }
  ];

  launchPersona(persona: RolePersona) {
    this.loggingIn.set(persona.role);
    this.auth.login({ email: persona.email, password: persona.pass }).subscribe({
      next: (res) => {
        this.loggingIn.set(null);
        const name = res.user?.fullName ?? persona.title;
        this.toast.success(`Welcome back, ${name}!`, `Logged in as ${persona.title}`);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.loggingIn.set(null);
        this.toast.error('Authentication Error', err?.error?.message || 'Could not log in to demo persona.');
      }
    });
  }
}
