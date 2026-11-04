/**
 * Bright Lands Skin, Hair & Laser Clinic – Appointment Booking & Form Validation
 * Indian mobile validation, date bounds, consultation selection
 */

document.addEventListener('DOMContentLoaded', () => {
  initAppointmentForm();
  initContactForm();
});

function initAppointmentForm() {
  const form = document.getElementById('appointmentForm');
  if (!form) return;

  // Set minimum date to today
  const dateInput = form.querySelector('input[type="date"]');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
  }

  // Pre-select doctor or treatment from URL query params (e.g. ?doctor=sania&treatment=laser)
  const urlParams = new URLSearchParams(window.location.search);
  const doctorParam = urlParams.get('doctor');
  const treatmentParam = urlParams.get('treatment');
  const locationParam = urlParams.get('location');

  if (doctorParam) {
    const docSelect = form.querySelector('select[name="doctor"]');
    if (docSelect) {
      for (let opt of docSelect.options) {
        if (opt.value.toLowerCase().includes(doctorParam.toLowerCase())) {
          opt.selected = true;
          break;
        }
      }
    }
  }

  if (treatmentParam) {
    const treatSelect = form.querySelector('select[name="treatment"]');
    if (treatSelect) {
      for (let opt of treatSelect.options) {
        if (opt.value.toLowerCase().includes(treatmentParam.toLowerCase())) {
          opt.selected = true;
          break;
        }
      }
    }
  }

  if (locationParam) {
    const locSelect = form.querySelector('select[name="location"]');
    if (locSelect) {
      for (let opt of locSelect.options) {
        if (opt.value.toLowerCase().includes(locationParam.toLowerCase())) {
          opt.selected = true;
          break;
        }
      }
    }
  }

  // Form submission validation
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    e.stopPropagation();

    const fullName = form.querySelector('[name="fullname"]');
    const phone = form.querySelector('[name="phone"]');
    const email = form.querySelector('[name="email"]');
    const location = form.querySelector('[name="location"]');
    const doctor = form.querySelector('[name="doctor"]');
    const treatment = form.querySelector('[name="treatment"]');
    const date = form.querySelector('[name="date"]');
    const time = form.querySelector('[name="time"]');
    const message = form.querySelector('[name="message"]');

    let isValid = true;

    // Validate Full Name
    if (!fullName.value.trim() || fullName.value.trim().length < 3) {
      setFieldError(fullName, 'Please enter your full name (minimum 3 characters).');
      isValid = false;
    } else {
      clearFieldError(fullName);
    }

    // Validate Indian Phone Number (10 digits starting with 6, 7, 8, or 9)
    const cleanPhone = phone.value.replace(/\s+/g, '').replace(/^\+91/, '');
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(cleanPhone)) {
      setFieldError(phone, 'Please enter a valid 10-digit Indian mobile number.');
      isValid = false;
    } else {
      clearFieldError(phone);
    }

    // Validate Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && email.value.trim() && !emailRegex.test(email.value.trim())) {
      setFieldError(email, 'Please enter a valid email address.');
      isValid = false;
    } else if (email) {
      clearFieldError(email);
    }

    // Validate Select Fields
    if (!location.value) {
      setFieldError(location, 'Please select a clinic location.');
      isValid = false;
    } else {
      clearFieldError(location);
    }

    if (!treatment.value) {
      setFieldError(treatment, 'Please select a treatment.');
      isValid = false;
    } else {
      clearFieldError(treatment);
    }

    if (!doctor.value) {
      setFieldError(doctor, 'Please select a preferred doctor.');
      isValid = false;
    } else {
      clearFieldError(doctor);
    }

    if (!date.value) {
      setFieldError(date, 'Please select a preferred date.');
      isValid = false;
    } else {
      clearFieldError(date);
    }

    if (!time.value) {
      setFieldError(time, 'Please select a preferred time slot.');
      isValid = false;
    } else {
      clearFieldError(time);
    }

    if (!isValid) return;

    // Submit Action
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Submitting Request...';

    // Save Appointment in localStorage for offline record
    const appointmentRecord = {
      id: 'BD-' + Date.now().toString().slice(-6),
      name: fullName.value.trim(),
      phone: cleanPhone,
      email: email ? email.value.trim() : '',
      location: location.value,
      doctor: doctor.value,
      treatment: treatment.value,
      date: date.value,
      time: time.value,
      message: message ? message.value.trim() : '',
      createdAt: new Date().toISOString()
    };

    try {
      const stored = JSON.parse(localStorage.getItem('brightlands_appointments') || '[]');
      stored.push(appointmentRecord);
      localStorage.setItem('brightlands_appointments', JSON.stringify(stored));
    } catch (err) {
      console.warn('LocalStorage error:', err);
    }

    // Simulate verified confirmation response
    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
      showSuccessModal(appointmentRecord);
      form.reset();
    }, 800);
  });
}

function initContactForm() {
  const contactForm = document.getElementById('contactInquiryForm');
  if (!contactForm) return;

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = contactForm.querySelector('[name="name"]');
    const phone = contactForm.querySelector('[name="phone"]');
    const email = contactForm.querySelector('[name="email"]');
    const message = contactForm.querySelector('[name="message"]');

    let isValid = true;
    if (!name.value.trim()) {
      setFieldError(name, 'Name is required.');
      isValid = false;
    } else {
      clearFieldError(name);
    }

    const cleanPhone = phone.value.replace(/\s+/g, '').replace(/^\+91/, '');
    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      setFieldError(phone, 'Enter a valid 10-digit mobile number.');
      isValid = false;
    } else {
      clearFieldError(phone);
    }

    if (!isValid) return;

    const btn = contactForm.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.innerText = 'Sending...';

    setTimeout(() => {
      btn.disabled = false;
      btn.innerText = 'Message Sent Successfully!';
      alert('Thank you for contacting Bright Lands Skin, Hair & Laser Clinic. Our patient coordinator will contact you shortly.');
      contactForm.reset();
      setTimeout(() => { btn.innerText = 'Send Message'; }, 3000);
    }, 600);
  });
}

function setFieldError(field, errorText) {
  field.classList.add('is-invalid');
  let feedback = field.parentElement.querySelector('.invalid-feedback-custom');
  if (!feedback) {
    feedback = document.createElement('div');
    feedback.className = 'invalid-feedback-custom';
    field.parentElement.appendChild(feedback);
  }
  feedback.innerText = errorText;
  feedback.style.display = 'block';
}

function clearFieldError(field) {
  field.classList.remove('is-invalid');
  const feedback = field.parentElement.querySelector('.invalid-feedback-custom');
  if (feedback) feedback.style.display = 'none';
}

function showSuccessModal(record) {
  // Check if modal element exists or create dynamically
  let modalEl = document.getElementById('appointmentSuccessModal');
  if (!modalEl) {
    const modalHtml = `
      <div class="modal fade" id="appointmentSuccessModal" tabindex="-1" aria-labelledby="modalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content" style="background-color: var(--color-warm-ivory); border: 2px solid var(--color-champagne-gold); border-radius: 20px;">
            <div class="modal-header border-0 pb-0">
              <h5 class="modal-title font-serif" id="modalLabel" style="color: var(--color-forest-green); font-size: 1.45rem;">
                <i class="bi bi-check-circle-fill text-success me-2"></i> Consultation Request Received
              </h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body py-4">
              <p style="color: var(--color-text-muted); font-size: 0.95rem;">
                Thank you, <strong id="modalPatientName" style="color: var(--color-forest-green);">${record.name}</strong>. Your consultation request for 
                <strong id="modalTreatmentName" style="color: var(--color-burgundy);">${record.treatment}</strong> with 
                <strong id="modalDoctorName">${record.doctor}</strong> at our 
                <strong id="modalLocation">${record.location}</strong> clinic has been logged.
              </p>
              <div class="p-3 my-3" style="background-color: var(--color-cream); border-radius: 12px; border: 1px solid var(--color-gold-border);">
                <div class="d-flex justify-content-between mb-1" style="font-size: 0.88rem;">
                  <span class="text-muted">Appointment Ref:</span>
                  <span class="fw-bold" style="color: var(--color-forest-green);">${record.id}</span>
                </div>
                <div class="d-flex justify-content-between mb-1" style="font-size: 0.88rem;">
                  <span class="text-muted">Preferred Date & Time:</span>
                  <span class="fw-bold">${record.date} at ${record.time}</span>
                </div>
                <div class="d-flex justify-content-between" style="font-size: 0.88rem;">
                  <span class="text-muted">Contact Mobile:</span>
                  <span class="fw-bold">+91 ${record.phone}</span>
                </div>
              </div>
              <p class="small text-muted mb-0">
                Our patient care coordinator will call you within 2 hours to confirm your scheduled appointment slot.
              </p>
            </div>
            <div class="modal-footer border-0 pt-0 d-flex justify-content-between">
              <a href="https://wa.me/+917878785823?text=${encodeURIComponent('Hello Bright Lands Skin, Hair & Laser Clinic, I requested an appointment (Ref: ' + record.id + ') for ' + record.treatment + ' on ' + record.date + '.')}" 
                 target="_blank" class="btn btn-outline-custom btn-sm" style="border-color: #25D366; color: #25D366 !important;">
                <i class="bi bi-whatsapp me-1"></i> WhatsApp Us
              </a>
              <button type="button" class="btn-forest btn-sm" data-bs-dismiss="modal">Done</button>
            </div>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    modalEl = document.getElementById('appointmentSuccessModal');
  }

  // Use bootstrap modal
  if (window.bootstrap && window.bootstrap.Modal) {
    const modal = new window.bootstrap.Modal(modalEl);
    modal.show();
  } else {
    alert(`Appointment Confirmed! Ref: ${record.id}. Our clinic coordinator will contact you at +91 ${record.phone} shortly.`);
  }
}
