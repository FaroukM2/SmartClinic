/**
 * SmartClinic Interactive Presentation Controller
 * Handles slide navigation, keyboard shortcuts, speaker notes, overview modal, and timer.
 */

class PresentationApp {
  constructor() {
    this.currentSlideIndex = 0;
    this.slides = Array.from(document.querySelectorAll('.slide'));
    this.totalSlides = this.slides.length;

    // Speaker Notes Database per slide
    this.speakerNotes = [
      {
        slide: 1,
        title: "Title & Engineering Showcase",
        cues: [
          "Start by greeting the committee: 'Good morning/afternoon honorable professors and members of the evaluation committee.'",
          "Introduce the project: 'Today I am proud to present SmartClinic, an enterprise-grade, multi-tenant smart clinic management platform designed from the ground up to solve the real-world operational and clinical bottlenecks of modern healthcare centers.'",
          "Highlight core stack: Built with .NET 9, Angular 19, Clean Architecture, and CQRS with MediatR."
        ]
      },
      {
        slide: 2,
        title: "Executive Summary & Industry Motivation",
        cues: [
          "Explain the problem: Traditional clinic workflows suffer from fragmented paper records, manual reception queues, disconnected billing, and zero multi-branch synchronization.",
          "Point out the 4 pillars: Strict Multi-Tenancy & Data Privacy, EMR (Electronic Medical Records), Real-Time Queue & Digital Prescriptions, and Financial Integrity.",
          "Conclude: 'SmartClinic bridges the gap between clinical excellence and modern software engineering.'"
        ]
      },
      {
        slide: 3,
        title: "System Architecture: Clean Architecture",
        cues: [
          "Focus on engineering rigor: 'We adopted Clean Architecture (Onion Pattern) with strict adherence to the Dependency Inversion Principle.'",
          "Explain the 5 decoupled layers: Domain (pure enterprise rules, zero third-party dependencies), Application (CQRS handlers and DTOs), Persistence (EF Core 9 and repositories), Infrastructure (JWT and security), and API (controllers & middlewares).",
          "Key defense point: The core domain never knows about databases, UI frameworks, or HTTP."
        ]
      },
      {
        slide: 4,
        title: "Backend Engineering: CQRS & MediatR Pipeline",
        cues: [
          "Explain the CQRS rationale: Commands handle state mutations with validation; Queries handle optimized read projections.",
          "Highlight the MediatR Pipeline: Automatic request interception via IPipelineBehavior.",
          "Point at the ValidationBehavior: Requests are automatically validated using FluentValidation before reaching the handler. If validation fails, it short-circuits with a ValidationException immediately."
        ]
      },
      {
        slide: 5,
        title: "Backend Resilience & Production Middleware",
        cues: [
          "Discuss resilience: 'A production system must handle faults gracefully without leaking internal stack traces.'",
          "Global Exception Handling Middleware: Intercepts all uncaught exceptions, mapping them to standard RFC-compliant HTTP status codes (400, 401, 404, 500).",
          "Automated DB Seeding: DbInitializer runs migrations and seeds initial tenant, admin, doctors, and sample patient records on boot."
        ]
      },
      {
        slide: 6,
        title: "Multi-Tenancy & Data Isolation Model",
        cues: [
          "Clarify the tenant model: SmartClinic is a multi-tenant SaaS. Multiple clinics operate on the same platform with complete cryptographic and logical isolation.",
          "Tenant Scoping: Each clinic has its own isolated branches, doctors, patients, and financial ledgers.",
          "Multi-branch hierarchy: An enterprise clinic can manage multiple physical locations (e.g. Downtown Branch, Heliopolis Branch) under one corporate umbrella."
        ]
      },
      {
        slide: 7,
        title: "Security Architecture & Claims-Based RBAC",
        cues: [
          "Explain the security lifecycle: Stateless JWT tokens with cryptographic signature and embedded user claims (UserId, TenantId, Roles).",
          "Role-Based Access Control (RBAC): ClinicAdmin (supervision & management), Doctor (clinical examination, diagnosis, e-Rx), and Receptionist (registration, queueing, billing).",
          "Defense point: All endpoints enforce authorization policies at the controller level; the frontend guards provide UX protection while the backend guarantees security."
        ]
      },
      {
        slide: 8,
        title: "Database Design & Persistence Layer",
        cues: [
          "Review the persistence layer: Built on SQL Server and Entity Framework Core 9 using Code-First approach.",
          "Point out domain modularization: Tables are partitioned cleanly: Identity, Clinics, Doctors, Patients, Appointments, Visits, Prescriptions, and Payments.",
          "Key patterns: Repository & Unit of Work for transactional integrity across clinical visits and financial receipts."
        ]
      },
      {
        slide: 9,
        title: "Frontend Architecture: Modern Angular 19",
        cues: [
          "Emphasize modern frontend paradigms: 100% Standalone Components with zero NgModules.",
          "Fine-grained reactivity: Angular Signals (signal, computed) eliminate excessive re-rendering and boost UI responsiveness.",
          "Security & Interceptors: authGuard blocks unauthorized routes, and authInterceptor automatically attaches the JWT Bearer header to every outbound HTTP call."
        ]
      },
      {
        slide: 10,
        title: "Patient Journey: End-to-End Clinical Flow",
        cues: [
          "Walk the committee through the sequence diagram step-by-step:",
          "1. Receptionist registers patient & assigns medical code (P-xxxx).",
          "2. Receptionist books appointment -> Status [Reserved] -> Checked in [Waiting].",
          "3. Doctor summons patient -> [InConsultation] -> diagnoses & issues e-Prescription.",
          "4. Receptionist processes checkout & issues printed payment receipt -> [Completed]."
        ]
      },
      {
        slide: 11,
        title: "Core Business Modules Deep-Dive",
        cues: [
          "Quickly review the modular feature set:",
          "EMR & Patient Directory with medical history and allergy warnings.",
          "Doctor schedule and multi-branch assignment.",
          "Digital Prescriptions (e-Rx) with dosage, duration, and instructions.",
          "Real-time Analytics Dashboard providing revenue and patient throughput KPIs."
        ]
      },
      {
        slide: 12,
        title: "Live Demonstration Strategy & Pre-Seeded Accounts",
        cues: [
          "Prepare the committee for the live software demo:",
          "Highlight pre-seeded accounts: Admin (admin@smartclinic.com), Doctor (doctor@smartclinic.com / tamer@smartclinic.com), Receptionist (receptionist@smartclinic.com), and Patient (patient@smartclinic.com).",
          "Explain 1-click test pills on /login for instantaneous persona switching.",
          "State: 'We will now demonstrate the full cycle live across different user sessions to verify real-time workflow coordination.'"
        ]
      },
      {
        slide: 13,
        title: "Swagger OpenAPI 3.0 & Production User Interfaces",
        cues: [
          "Direct evaluator attention to the authentic UI & API gallery:",
          "1. Swagger OpenAPI 3.0: Point out typed CQRS endpoints, Bearer JWT authentication, and automated schema contracts.",
          "2. Doctor Workspace: Highlight live queue with 1-click 'Start Visit' and the new Clinic Colleagues Directory.",
          "3. Receptionist Console: Show walk-in patient registration and one-click Queue Check-In.",
          "4. Dual-Theme Engine: Contrast Apple/Stripe-tier Light Mode with Cyber Glassmorphism Dark Mode."
        ]
      },
      {
        slide: 14,
        title: "Non-Functional Attributes & Engineering Quality",
        cues: [
          "Demonstrate software engineering rigor beyond basic functionality:",
          "Performance: Sub-50ms API latency, zero memory leaks, lazy-loaded frontend routes, EF Core indexed queries.",
          "Maintainability: Decoupled CQRS commands enable isolated testing and rapid feature addition without regression.",
          "Code Quality: Clean build, 0 compilation errors, 0 warnings in .NET 9 and Angular 19."
        ]
      },
      {
        slide: 15,
        title: "Committee Anticipated Questions & Defense",
        cues: [
          "Proactively address tough committee questions before they ask:",
          "Q1: Why Clean Architecture instead of simple 3-tier? (Ans: Scalability, independent testability, and technology independence).",
          "Q2: How do you prevent race conditions in appointment booking? (Ans: Database unique constraint on DoctorId + AppointmentDateTime + optimistic concurrency).",
          "Q3: Why Angular Signals? (Ans: Synchronous reactivity, precise change detection without zone.js overhead)."
        ]
      },
      {
        slide: 16,
        title: "Future Roadmap & Project Conclusion",
        cues: [
          "Conclude with forward-looking vision:",
          "Upcoming enhancements: Telemedicine via WebRTC, AI diagnostic suggestion assistant, and HL7/FHIR health exchange protocol support.",
          "Final words: 'SmartClinic delivers an enterprise-level, production-ready foundation. Thank you, and I welcome any questions and discussion.'"
        ]
      }
    ];

    // UI Elements
    this.progressBar = document.getElementById('slideProgressBar');
    this.currentIndicator = document.getElementById('currentSlideNum');
    this.totalIndicator = document.getElementById('totalSlideNum');
    this.totalIndicatorDock = document.getElementById('totalSlideNumDock');
    this.topSlideNum = document.getElementById('topSlideNum');
    this.topicBadge = document.getElementById('slideTopicBadge');
    this.timerDisplay = document.getElementById('dockTimer');
    this.notesDrawer = document.getElementById('notesDrawer');
    this.notesContent = document.getElementById('notesContent');
    this.notesToggleBtn = document.getElementById('notesToggleBtn');
    this.overviewModal = document.getElementById('overviewModal');
    this.overviewGrid = document.getElementById('overviewGrid');

    // Timer state
    this.timerSeconds = 0;
    this.timerInterval = null;

    this.init();
  }

  init() {
    if (this.totalIndicator) {
      this.totalIndicator.textContent = this.totalSlides;
    }
    if (this.totalIndicatorDock) {
      this.totalIndicatorDock.textContent = this.totalSlides;
    }

    this.setupEventListeners();
    this.buildOverviewGrid();
    this.goToSlide(0);
    this.startTimer();
  }

  setupEventListeners() {
    // Dock Buttons
    document.getElementById('prevBtn')?.addEventListener('click', () => this.prevSlide());
    document.getElementById('nextBtn')?.addEventListener('click', () => this.nextSlide());
    document.getElementById('fullscreenBtn')?.addEventListener('click', () => this.toggleFullscreen());
    document.getElementById('notesToggleBtn')?.addEventListener('click', () => this.toggleNotes());
    document.getElementById('overviewBtn')?.addEventListener('click', () => this.toggleOverview());
    document.getElementById('printBtn')?.addEventListener('click', () => window.print());
    document.getElementById('closeOverviewBtn')?.addEventListener('click', () => this.toggleOverview(false));
    document.getElementById('closeNotesBtn')?.addEventListener('click', () => this.toggleNotes(false));

    // Keyboard Shortcuts
    window.addEventListener('keydown', (e) => {
      // Ignore when typing inside input or textarea
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;

      switch (e.key) {
        case 'ArrowRight':
        case 'Space':
        case 'PageDown':
        case 'Enter':
          e.preventDefault();
          this.nextSlide();
          break;

        case 'ArrowLeft':
        case 'Backspace':
        case 'PageUp':
          e.preventDefault();
          this.prevSlide();
          break;

        case 'Home':
          e.preventDefault();
          this.goToSlide(0);
          break;

        case 'End':
          e.preventDefault();
          this.goToSlide(this.totalSlides - 1);
          break;

        case 'f':
        case 'F':
          e.preventDefault();
          this.toggleFullscreen();
          break;

        case 'n':
        case 'N':
          e.preventDefault();
          this.toggleNotes();
          break;

        case 'o':
        case 'O':
          e.preventDefault();
          this.toggleOverview();
          break;

        case 'p':
        case 'P':
          if (!e.ctrlKey) {
            e.preventDefault();
            window.print();
          }
          break;

        case 't':
        case 'T':
          e.preventDefault();
          this.resetTimer();
          break;

        case 'Escape':
          if (this.overviewModal?.classList.contains('open')) {
            this.toggleOverview(false);
          } else if (this.notesDrawer?.classList.contains('open')) {
            this.toggleNotes(false);
          }
          break;
      }
    });

    // Touch Swipe Support
    let touchStartX = 0;
    let touchEndX = 0;

    window.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    window.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      this.handleSwipe(touchStartX, touchEndX);
    }, { passive: true });
  }

  handleSwipe(startX, endX) {
    const threshold = 50;
    if (startX - endX > threshold) {
      this.nextSlide();
    } else if (endX - startX > threshold) {
      this.prevSlide();
    }
  }

  goToSlide(index) {
    if (index < 0 || index >= this.totalSlides) return;

    this.slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === index);
    });

    this.currentSlideIndex = index;

    // Update Progress Bar
    const progress = ((index + 1) / this.totalSlides) * 100;
    if (this.progressBar) {
      this.progressBar.style.width = `${progress}%`;
    }

    // Update Slide Indicators
    const formattedNum = String(index + 1).padStart(2, '0');
    if (this.currentIndicator) this.currentIndicator.textContent = formattedNum;
    if (this.topSlideNum) this.topSlideNum.textContent = formattedNum;
    if (this.topicBadge) {
      this.topicBadge.textContent = this.slides[index].getAttribute('data-category') || 'Engineering Defense';
    }

    // Update Active Thumbnail in Overview
    document.querySelectorAll('.overview-thumb').forEach((thumb, i) => {
      thumb.classList.toggle('active', i === index);
    });

    // Update Speaker Notes
    this.updateSpeakerNotes(index);
  }

  nextSlide() {
    if (this.currentSlideIndex < this.totalSlides - 1) {
      this.goToSlide(this.currentSlideIndex + 1);
    }
  }

  prevSlide() {
    if (this.currentSlideIndex > 0) {
      this.goToSlide(this.currentSlideIndex - 1);
    }
  }

  toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.warn(`Fullscreen error: ${err.message}`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }

  toggleNotes(forceState) {
    const isOpen = forceState !== undefined ? forceState : !this.notesDrawer.classList.contains('open');
    this.notesDrawer.classList.toggle('open', isOpen);
    this.notesToggleBtn.classList.toggle('active-toggle', isOpen);
  }

  toggleOverview(forceState) {
    const isOpen = forceState !== undefined ? forceState : !this.overviewModal.classList.contains('open');
    this.overviewModal.classList.toggle('open', isOpen);
  }

  updateSpeakerNotes(index) {
    if (!this.notesContent) return;
    const noteData = this.speakerNotes[index];
    if (!noteData) {
      this.notesContent.innerHTML = `<p class="text-muted">No notes available for this slide.</p>`;
      return;
    }

    let html = `
      <div class="notes-cue">
        <strong>Slide ${index + 1}: ${noteData.title}</strong>
      </div>
      <div style="margin-top: 12px; display: flex; flex-direction: column; gap: 10px;">
    `;

    noteData.cues.forEach((cue, i) => {
      html += `
        <div style="display: flex; gap: 8px; align-items: flex-start;">
          <span style="color: var(--accent-cyan); font-weight: 700; font-family: var(--font-mono); font-size: 12px;">${i + 1}.</span>
          <p style="margin: 0; font-size: 13.5px; line-height: 1.5;">${cue}</p>
        </div>
      `;
    });

    html += `</div>`;
    this.notesContent.innerHTML = html;
  }

  buildOverviewGrid() {
    if (!this.overviewGrid) return;
    this.overviewGrid.innerHTML = '';

    this.slides.forEach((slide, i) => {
      const category = slide.querySelector('.slide-category')?.textContent || 'Overview';
      const title = slide.querySelector('.slide-title')?.textContent || `Slide ${i + 1}`;

      const thumb = document.createElement('div');
      thumb.className = `overview-thumb ${i === this.currentSlideIndex ? 'active' : ''}`;
      thumb.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span class="overview-thumb-num">#${String(i + 1).padStart(2, '0')}</span>
          <span class="overview-thumb-cat">${category.replace(/[^\w\s-]/g, '').trim()}</span>
        </div>
        <div class="overview-thumb-title">${title}</div>
      `;

      thumb.addEventListener('click', () => {
        this.goToSlide(i);
        this.toggleOverview(false);
      });

      this.overviewGrid.appendChild(thumb);
    });
  }

  startTimer() {
    this.timerInterval = setInterval(() => {
      this.timerSeconds++;
      const mins = String(Math.floor(this.timerSeconds / 60)).padStart(2, '0');
      const secs = String(this.timerSeconds % 60).padStart(2, '0');
      if (this.timerDisplay) {
        this.timerDisplay.innerHTML = `⏱️ ${mins}:${secs}`;
      }
    }, 1000);
  }

  resetTimer() {
    this.timerSeconds = 0;
    if (this.timerDisplay) {
      this.timerDisplay.innerHTML = `⏱️ 00:00`;
    }
  }
}

// Instantiate on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  window.app = new PresentationApp();
});
