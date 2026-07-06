/**
 * Reserva AI - Main Application Javascript
 * Handles navigation, industry tab switching, pricing toggles,
 * scroll reveals, and the interactive booking simulator playground.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  /* ==========================================
     1. Mobile Drawer Navigation
     ========================================== */
  const mobileToggle = document.getElementById('mobile-toggle');
  const drawerClose = document.getElementById('drawer-close');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const drawerLinks = document.querySelectorAll('.drawer-link');

  const openDrawer = () => {
    mobileDrawer.classList.add('open');
    document.body.style.overflow = 'hidden'; // Lock background scrolling
  };

  const closeDrawer = () => {
    mobileDrawer.classList.remove('open');
    document.body.style.overflow = ''; // Release lock
  };

  if (mobileToggle) mobileToggle.addEventListener('click', openDrawer);
  if (drawerClose) drawerClose.addEventListener('click', closeDrawer);

  drawerLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  // Close drawer if clicking outside
  document.addEventListener('click', (e) => {
    if (mobileDrawer && mobileDrawer.classList.contains('open')) {
      if (!mobileDrawer.contains(e.target) && !mobileToggle.contains(e.target)) {
        closeDrawer();
      }
    }
  });


  /* ==========================================
     2. Industry Tab System
     ========================================== */
  const industryButtons = document.querySelectorAll('.industry-tab-btn');
  const indTitle = document.getElementById('ind-title');
  const indDesc = document.getElementById('ind-desc');
  const indBullets = document.getElementById('ind-bullets');
  const mockScheduleList = document.querySelector('.mock-schedule-list');
  const innerMockup = document.querySelector('.inner-mockup');

  // Industry details content mapping
  const industryData = {
    healthcare: {
      title: 'HIPAA-Compliant Healthcare Scheduling',
      desc: 'Ensure seamless patient booking, automated doctor shifts, emergency slot protection, and real-time room capacity tracking while maintaining absolute patient privacy.',
      bullets: [
        'Smart room & equipment sync (e.g. MRI, Ultrasound)',
        'Doctor schedule optimization matches specialist credentials',
        'Automatic SMS updates reduce diagnostic no-shows'
      ],
      mockupBgClass: 'healthcare-bg',
      badge: 'HIPAA Compliant',
      badgeIcon: 'shield-check',
      scheduleItems: [
        { time: '09:00 AM', detail: 'Dr. Sarah Jenkins - MRI Room A', status: 'Confirmed', statusClass: '' },
        { time: '10:30 AM', detail: 'Dr. Sarah Jenkins - Consultation Suite 3', status: 'In Progress', statusClass: 'warning' },
        { time: '11:15 AM', detail: 'Dr. Robert Chen - MRI Room A', status: 'Waitlist Filled', statusClass: 'waiting' }
      ]
    },
    hospitality: {
      title: 'Dynamic Hospitality Capacity Optimization',
      desc: 'Maximize table turns, room yields, and staff ratios automatically. Predict guest volume variations and dynamically allocate floor staff in real-time.',
      bullets: [
        'Centralized floor mapping and table configurations',
        'Auto-assignment of servers based on table load caps',
        'Automated guest seatings and dining limit reminders'
      ],
      mockupBgClass: 'hospitality-bg',
      badge: '94% Floor Yield',
      badgeIcon: 'utensils',
      scheduleItems: [
        { time: '06:00 PM', detail: 'Table 12 (6 Pax) - Chef Tasting Menu', status: 'Seated', statusClass: '' },
        { time: '07:30 PM', detail: 'Table 4 (2 Pax) - Window View request', status: 'Arriving', statusClass: 'warning' },
        { time: '08:00 PM', detail: 'Private Suite - Wine Pairing Dinner', status: 'Pre-ordered', statusClass: 'waiting' }
      ]
    },
    sports: {
      title: 'Smart Court & Resource Allocation',
      desc: 'Enable members to reserve courts, fitness gear, and private coaching slots in a single unified invoice. Lock equipment availability instantly.',
      bullets: [
        'Multi-court calendar mapping prevent overlaps',
        'Synchronized coaching availability algorithms',
        'Dynamic booking rates based on peak court demand'
      ],
      mockupBgClass: 'sports-bg',
      badge: 'Auto-Asset Lock',
      badgeIcon: 'trophy',
      scheduleItems: [
        { time: '08:00 AM', detail: 'Clay Court 1 - Private Lesson (Coach Alex)', status: 'Active', statusClass: '' },
        { time: '09:30 AM', detail: 'Hard Court 3 - Court Reservation', status: 'Ready', statusClass: 'warning' },
        { time: '11:00 AM', detail: 'Squash Suite 2 - Tournament Set', status: 'Waitlist', statusClass: 'waiting' }
      ]
    },
    'car-rentals': {
      title: 'Unified Fleet & Maintenance Booking',
      desc: 'Dispatch vehicles automatically while timing buffer intervals between hires for full cleanings, inspections, and battery recharge sweeps.',
      bullets: [
        'Fleet availability connected directly to booking forms',
        'Auto-staged cleaning alerts for operations crew',
        'Dynamic fuel/battery pricing calculator integration'
      ],
      mockupBgClass: 'car-rentals-bg',
      badge: 'Fleet Clean Sync',
      badgeIcon: 'car',
      scheduleItems: [
        { time: '10:00 AM', detail: 'Tesla Model Y - Pick up (Bay 4)', status: 'Active', statusClass: '' },
        { time: '11:00 AM', detail: 'Porsche Taycan - Charging & Detail', status: 'Cleaning', statusClass: 'warning' },
        { time: '01:30 PM', detail: 'BMW i4 - Booking Reserved', status: 'Inspected', statusClass: 'waiting' }
      ]
    },
    professional: {
      title: 'Intelligent Client Consulting Pipelines',
      desc: 'Align multi-partner client calls, resource booking rooms, and document signing flows under a unified scheduling assistant dashboard.',
      bullets: [
        'Intelligent consultant skill-availability filters',
        'Unified video link & physical conference room locks',
        'Auto-reminders push doc updates before meetings'
      ],
      mockupBgClass: 'professional-bg',
      badge: 'Time-zone Aware',
      badgeIcon: 'briefcase',
      scheduleItems: [
        { time: '02:00 PM', detail: 'Partner Boardroom - Merger Advisory Meeting', status: 'Booked', statusClass: '' },
        { time: '03:30 PM', detail: 'Virtual Rm 2 - Client Discovery Call', status: 'Joined', statusClass: 'warning' },
        { time: '05:00 PM', detail: 'Meeting Room C - NDA Review Call', status: 'Confirmed', statusClass: 'waiting' }
      ]
    },
    salons: {
      title: 'Optimized Salon & Aesthetics Scheduling',
      desc: 'Connect stylist shifts, specific treatment rooms, and chair equipment availability. Provide clients with easy addon upsell selections.',
      bullets: [
        'Auto-matches requested treatment with certified specialist',
        'Buffer time slots prevent stylist burnout',
        'Prepayment deposit captures protect against no-shows'
      ],
      mockupBgClass: 'salons-bg',
      badge: '1.2% No-Show Rate',
      badgeIcon: 'sparkles',
      scheduleItems: [
        { time: '12:00 PM', detail: 'Chairs 1 & 2 - Balayage Treatments', status: 'In Chair', statusClass: '' },
        { time: '01:15 PM', detail: 'Aesthetics Room - Laser Treatment', status: 'Readying', statusClass: 'warning' },
        { time: '02:30 PM', detail: 'Chair 4 - Haircut & Styling', status: 'Prepaid', statusClass: 'waiting' }
      ]
    },
    education: {
      title: 'Capacity-optimized Academic Booking',
      desc: 'Coordinate campus classrooms, specialist lab devices, office tutoring hours, and library rooms within strict faculty availability guidelines.',
      bullets: [
        'Auto-check instructor qualifications and class capacities',
        'Shared laboratory equipment and reagent prep blocks',
        'Synchronized student tutor booking portal pipelines'
      ],
      mockupBgClass: 'education-bg',
      badge: 'Campus Asset Sync',
      badgeIcon: 'graduation-cap',
      scheduleItems: [
        { time: '09:00 AM', detail: 'Biology Lab 3 - Advanced Genomics Prep', status: 'In Use', statusClass: '' },
        { time: '11:00 AM', detail: 'Seminar Room B - Tutoring Session', status: 'Staged', statusClass: 'warning' },
        { time: '02:00 PM', detail: 'Lecture Hall 101 - Guest Panel', status: 'Scheduled', statusClass: 'waiting' }
      ]
    }
  };

  const switchIndustry = (industryKey) => {
    const data = industryData[industryKey];
    if (!data) return;

    // Apply fade animation trigger
    const card = document.getElementById('industry-content-card');
    card.style.opacity = '0';
    card.style.transform = 'translateY(15px)';

    setTimeout(() => {
      // Update Texts
      indTitle.textContent = data.title;
      indDesc.textContent = data.desc;

      // Update Bullets
      indBullets.innerHTML = '';
      data.bullets.forEach(bullet => {
        const li = document.createElement('li');
        li.innerHTML = `<i data-lucide="check" class="bullet-icon"></i> ${bullet}`;
        indBullets.appendChild(li);
      });

      // Update Inner Mockup Background and Badge
      innerMockup.className = `inner-mockup ${data.mockupBgClass}`;
      const badgeFloat = innerMockup.querySelector('.badge-float');
      badgeFloat.innerHTML = `<i data-lucide="${data.badgeIcon}"></i> ${data.badge}`;

      // Update Simulated schedule list
      mockScheduleList.innerHTML = '';
      data.scheduleItems.forEach(item => {
        const div = document.createElement('div');
        div.className = 'mock-item';
        div.innerHTML = `
          <span class="time">${item.time}</span>
          <span class="detail">${item.detail}</span>
          <span class="status ${item.statusClass}">${item.status}</span>
        `;
        mockScheduleList.appendChild(div);
      });

      // Reinitialize Lucide icons inside dynamic content
      if (typeof lucide !== 'undefined') {
        lucide.createIcons();
      }

      // Re-trigger layout display
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, 250);
  };

  industryButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active from others
      industryButtons.forEach(b => b.classList.remove('active'));
      // Add active to current
      btn.classList.add('active');
      // Switch the content
      switchIndustry(btn.getAttribute('data-industry'));
    });
  });


  /* ==========================================
     3. Pricing Toggle System
     ========================================== */
  const billingToggle = document.getElementById('billing-toggle');
  const starterPrice = document.getElementById('starter-price');
  const growthPrice = document.getElementById('growth-price');
  const enterprisePrice = document.getElementById('enterprise-price');
  const labelMonthly = document.getElementById('toggle-lbl-m');
  const labelYearly = document.getElementById('toggle-lbl-y');

  const pricingValues = {
    monthly: { starter: '29', growth: '79', enterprise: '199' },
    yearly: { starter: '23', growth: '63', enterprise: '159' }
  };

  const updatePrices = (isYearly) => {
    const scale = isYearly ? 'yearly' : 'monthly';
    
    // Add active styling labels
    if (isYearly) {
      labelYearly.classList.add('active');
      labelMonthly.classList.remove('active');
    } else {
      labelMonthly.classList.add('active');
      labelYearly.classList.remove('active');
    }

    // Fade and swap price
    const fadeSwap = (el, val) => {
      el.style.opacity = '0';
      el.style.transform = 'scale(0.9)';
      setTimeout(() => {
        el.textContent = val;
        el.style.opacity = '1';
        el.style.transform = 'scale(1)';
      }, 150);
    };

    fadeSwap(starterPrice, pricingValues[scale].starter);
    fadeSwap(growthPrice, pricingValues[scale].growth);
    fadeSwap(enterprisePrice, pricingValues[scale].enterprise);
  };

  if (billingToggle) {
    billingToggle.addEventListener('change', (e) => {
      updatePrices(e.target.checked);
    });
    // Set initial active label
    updatePrices(billingToggle.checked);
  }


  /* ==========================================
     4. Interactive AI Booking Simulator Playground
     ========================================== */
  const serviceSelectors = document.querySelectorAll('.service-selector-btn');
  const pipelineStatus = document.getElementById('pipeline-status');
  
  // Pipeline Step Elements
  const pipeResource = document.getElementById('pipe-resource');
  const pipeStaff = document.getElementById('pipe-staff');
  const pipePricing = document.getElementById('pipe-pricing');
  const pipeSms = document.getElementById('pipe-sms');

  // Step Detail Paragraphs
  const detRes = document.getElementById('pipe-detail-res');
  const detStaff = document.getElementById('pipe-detail-staff');
  const detPrice = document.getElementById('pipe-detail-price');
  const detSms = document.getElementById('pipe-detail-sms');

  // Output Device Screen
  const smsTextContent = document.getElementById('sms-text-content');

  // Simulation services scenarios
  const servicesScenarios = {
    'service-mri': {
      resName: 'MRI Suite 4',
      resCheck: 'Checking MRI Suite 4 capacity...',
      resResult: 'MRI Suite 4 reserved successfully (100% sterile buffer checked)',
      staffRole: 'Radiologist',
      staffSearch: 'Searching for certified radiologist on shift...',
      staffResult: 'Assigned Specialist: Dr. Sarah Jenkins (Licensed Radiographer)',
      basePrice: 250,
      peakModifier: 45,
      priceCheck: 'Calculating peak demand modifier...',
      priceResult: 'Dynamic Price set to $295 ($250 base + $45 peak demand load)',
      smsMessage: 'Hi Alex, your Diagnostic MRI Scan at Metro Health is confirmed for Tuesday at 9:00 AM with Dr. Jenkins. Please arrive 10 min early.'
    },
    'service-dining': {
      resName: 'Kitchen Suite B',
      resCheck: 'Verifying private dining salon booking...',
      resResult: 'Kitchen Suite B & Salon Table locked (Occupancy limits cleared)',
      staffRole: 'Executive Chef',
      staffSearch: 'Matching culinary specialty requirements...',
      staffResult: 'Assigned Specialist: Chef Raymond Blanc (Michelin-starred specialist)',
      basePrice: 400,
      peakModifier: 120,
      priceCheck: 'Calculating dining load multiplier...',
      priceResult: 'Dynamic Price set to $520 ($400 base + $120 weekend dinner peak)',
      smsMessage: 'Hello Alex, your Private Dining reservation with Chef Raymond Blanc has been confirmed for 7:00 PM. Bon Appétit!'
    },
    'service-car': {
      resName: 'Bay 4 Fleet Lot',
      resCheck: 'Verifying Luxury Car fleet tracking list...',
      resResult: 'Tesla Model Y reserved (Charging status at 95% confirmed)',
      staffRole: 'Valet Detailer',
      staffSearch: 'Scheduling prep and detailing crew buffers...',
      staffResult: 'Assigned Specialist: Marcus Vance (Class A detail inspector)',
      basePrice: 90,
      peakModifier: 15,
      priceCheck: 'Checking peak commuter pricing algorithm...',
      priceResult: 'Dynamic Price set to $105 ($90 base + $15 smart fleet balance charge)',
      smsMessage: 'Reservation Alert: Your Tesla Model Y is clean and ready in Bay 4. Keyless entry code active. Safe driving, Alex!'
    },
    'service-consulting': {
      resName: 'Virtual Room 3',
      resCheck: 'Locking private Zoom channel and room logs...',
      resResult: 'Virtual Room 3 and secure document folder locked',
      staffRole: 'Corporate Attorney',
      staffSearch: 'Matching case specifications to active attorney bar...',
      staffResult: 'Assigned Advisor: Attorney Clara Ostling (M&A partner)',
      basePrice: 350,
      peakModifier: 0,
      priceCheck: 'Checking advisory consulting rate locks...',
      priceResult: 'Dynamic Price set to $350 (Flat corporate rate applied, off-peak)',
      smsMessage: 'Hi Alex, your M&A legal advisory call with Partner Clara Ostling is set for 2:00 PM. Meeting link: zoom.us/j/reserva-consult'
    }
  };

  const setStepIcon = (stepElement, iconName) => {
    const container = stepElement.querySelector('.step-icon-indicator');
    if (container) {
      container.innerHTML = `<i data-lucide="${iconName}"></i>`;
    }
  };

  let currentTimerId = null;

  const runSmartDispatcherSimulation = (serviceKey) => {
    const scenario = servicesScenarios[serviceKey];
    if (!scenario) return;

    // Clear any active simulations
    if (currentTimerId) {
      clearTimeout(currentTimerId);
    }

    // Reset UI indicators
    const steps = [pipeResource, pipeStaff, pipePricing, pipeSms];
    steps.forEach(step => {
      step.className = 'pipeline-step-item';
      setStepIcon(step, 'circle');
    });

    detRes.textContent = scenario.resCheck;
    detStaff.textContent = scenario.staffSearch;
    detPrice.textContent = scenario.priceCheck;
    detSms.textContent = 'Awaiting step...';

    if (typeof lucide !== 'undefined') lucide.createIcons();

    pipelineStatus.textContent = 'Running';
    pipelineStatus.className = 'pipeline-status running';
    smsTextContent.innerHTML = '<span class="pulse-dot"></span> AI matching in progress...';

    // Timeline execution
    // Stage 1: Resource Checked
    pipeResource.classList.add('active');
    setStepIcon(pipeResource, 'loader');
    if (typeof lucide !== 'undefined') lucide.createIcons();
    
    currentTimerId = setTimeout(() => {
      pipeResource.className = 'pipeline-step-item success';
      setStepIcon(pipeResource, 'check-circle-2');
      detRes.textContent = scenario.resResult;
      
      // Stage 2: Staff Assigned
      pipeStaff.classList.add('active');
      setStepIcon(pipeStaff, 'loader');
      if (typeof lucide !== 'undefined') lucide.createIcons();

      currentTimerId = setTimeout(() => {
        pipeStaff.className = 'pipeline-step-item success';
        setStepIcon(pipeStaff, 'check-circle-2');
        detStaff.textContent = scenario.staffResult;

        // Stage 3: Price Calculated
        pipePricing.classList.add('active');
        setStepIcon(pipePricing, 'loader');
        if (typeof lucide !== 'undefined') lucide.createIcons();

        currentTimerId = setTimeout(() => {
          pipePricing.className = 'pipeline-step-item success';
          setStepIcon(pipePricing, 'check-circle-2');
          detPrice.textContent = scenario.priceResult;

          // Stage 4: Notification Staged
          pipeSms.classList.add('active');
          setStepIcon(pipeSms, 'loader');
          if (typeof lucide !== 'undefined') lucide.createIcons();

          currentTimerId = setTimeout(() => {
            pipeSms.className = 'pipeline-step-item success';
            setStepIcon(pipeSms, 'check-circle-2');
            detSms.textContent = 'Notification dispatched successfully via Twilio Gateway.';

            // Pipeline complete
            pipelineStatus.textContent = 'Complete';
            pipelineStatus.className = 'pipeline-status';

            // SMS Pops up
            smsTextContent.textContent = scenario.smsMessage;
            
            if (typeof lucide !== 'undefined') lucide.createIcons();
          }, 1200);

        }, 1200);

      }, 1200);

    }, 1000);
  };

  serviceSelectors.forEach(btn => {
    btn.addEventListener('click', () => {
      serviceSelectors.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      runSmartDispatcherSimulation(btn.getAttribute('data-service'));
    });
  });

  // Run initial simulation for MRI
  runSmartDispatcherSimulation('service-mri');


  /* ==========================================
     5. Scroll Reveal Intersection Observer
     ========================================== */
  const revealElements = document.querySelectorAll('.scroll-reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target); // Reveal only once
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback: Reveal all immediately
    revealElements.forEach(el => el.classList.add('revealed'));
  }


  /* ==========================================
     6. Newsletter Signup Demo Handler
     ========================================== */
  const newsletterForm = document.getElementById('newsletter-form');
  const newsletterStatus = document.getElementById('newsletter-status');

  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = newsletterForm.querySelector('.newsletter-input');
      const email = input.value.trim();

      if (email) {
        newsletterStatus.textContent = 'Subscribing...';
        newsletterStatus.style.color = 'var(--accent-light)';

        setTimeout(() => {
          input.value = '';
          newsletterStatus.textContent = 'Successfully subscribed! Welcome to the loop.';
          newsletterStatus.style.color = 'var(--color-success)';

          // Clear notice after 4s
          setTimeout(() => {
            newsletterStatus.textContent = '';
          }, 4000);
        }, 1000);
      }
    });
  }

});
