/**
 * SkyBook - Flight Booking Portal
 * Vanilla JS implementation with custom DatePicker class
 */

'use strict';

/* ===== Date Picker Class ===== */
class DatePicker {
  /**
   * @param {string} prefix - 'departure' or 'return'
   */
  constructor(prefix) {
    this.prefix = prefix;
    this.selectedDate = null;
    this.minDate = null;
    this.currentYear = null;
    this.currentMonth = null;
    this._onSelect = null;

    // DOM references
    this.input = document.getElementById(`${prefix}-date-input`);
    this.calendar = document.getElementById(`${prefix}-calendar`);
    this.header = document.getElementById(`${prefix}-calendar-header`);
    this.daysContainer = document.getElementById(`${prefix}-calendar-days`);
    this.prevBtn = this.calendar.querySelector('[data-testid="prev-month"]');
    this.nextBtn = this.calendar.querySelector('[data-testid="next-month"]');

    const now = new Date();
    this.currentYear = now.getFullYear();
    this.currentMonth = now.getMonth(); // 0-indexed

    this._bindEvents();
    this.renderCalendar(this.currentYear, this.currentMonth);
  }

  /** Bind internal DOM events */
  _bindEvents() {
    // Open on click
    this.input.addEventListener('click', () => {
      if (!this.input.disabled) this.toggle();
    });

    // Keyboard: Enter/Space opens, Escape closes
    this.input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (!this.input.disabled) this.open();
      } else if (e.key === 'Escape') {
        this.close();
      }
    });

    // Month navigation
    this.prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.navigateMonth(-1);
    });
    this.nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.navigateMonth(1);
    });

    // Click outside closes calendar
    document.addEventListener('click', (e) => {
      const wrapper = this.input.closest('.date-picker-wrapper');
      if (wrapper && !wrapper.contains(e.target)) {
        this.close();
      }
    });
  }

  /** Open the calendar popup */
  open() {
    this.calendar.removeAttribute('hidden');
    this.input.setAttribute('aria-expanded', 'true');
    // Re-render to ensure selected date is highlighted
    this.renderCalendar(this.currentYear, this.currentMonth);
  }

  /** Close the calendar popup */
  close() {
    this.calendar.setAttribute('hidden', '');
    this.input.setAttribute('aria-expanded', 'false');
  }

  /** Toggle open/close */
  toggle() {
    if (this.calendar.hasAttribute('hidden')) {
      this.open();
    } else {
      this.close();
    }
  }

  /**
   * Navigate months forward (+1) or backward (-1)
   * @param {number} direction - +1 or -1
   */
  navigateMonth(direction) {
    this.currentMonth += direction;
    if (this.currentMonth > 11) {
      this.currentMonth = 0;
      this.currentYear++;
    } else if (this.currentMonth < 0) {
      this.currentMonth = 11;
      this.currentYear--;
    }
    this.renderCalendar(this.currentYear, this.currentMonth);
  }

  /**
   * Render the calendar grid for the given year and month
   * @param {number} year
   * @param {number} month - 0-indexed
   */
  renderCalendar(year, month) {
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December',
    ];

    this.header.textContent = `${monthNames[month]} ${year}`;
    this.daysContainer.innerHTML = '';

    const firstDay = new Date(year, month, 1).getDay(); // 0=Sun
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Filler cells before first day
    for (let i = 0; i < firstDay; i++) {
      const filler = document.createElement('span');
      filler.className = 'filler';
      this.daysContainer.appendChild(filler);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dateObj = new Date(year, month, day);
      const dateStr = this._formatISO(dateObj);

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.textContent = day;
      btn.setAttribute('data-date', dateStr);
      btn.setAttribute('role', 'gridcell');
      btn.setAttribute('aria-label', dateStr);

      const classList = ['day-btn'];

      if (this.isDisabled(dateObj)) {
        classList.push('disabled');
        btn.setAttribute('aria-disabled', 'true');
        btn.tabIndex = -1;
      }

      if (this._isSameDay(dateObj, today)) {
        classList.push('today');
      }

      if (this.selectedDate && this._isSameDay(dateObj, this.selectedDate)) {
        classList.push('selected');
      }

      btn.className = classList.join(' ');

      if (!this.isDisabled(dateObj)) {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.selectDate(dateStr);
        });
      }

      this.daysContainer.appendChild(btn);
    }
  }

  /**
   * Select a date by ISO string (YYYY-MM-DD)
   * @param {string} dateStr
   */
  selectDate(dateStr) {
    const parts = dateStr.split('-');
    const dateObj = new Date(
      parseInt(parts[0], 10),
      parseInt(parts[1], 10) - 1,
      parseInt(parts[2], 10)
    );

    if (this.isDisabled(dateObj)) return;

    this.selectedDate = dateObj;
    this.input.value = this._formatDisplay(dateObj);

    // Clear error
    const errorEl = this.input.closest('.form-group')?.querySelector('.error-msg');
    if (errorEl) errorEl.textContent = '';

    this.close();

    if (typeof this._onSelect === 'function') {
      this._onSelect(dateStr, dateObj);
    }
  }

  /**
   * Check if a date should be disabled
   * @param {Date} date
   * @returns {boolean}
   */
  isDisabled(date) {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Disable past dates
    if (d < today) return true;

    // Disable dates before minDate
    if (this.minDate) {
      const min = new Date(this.minDate);
      min.setHours(0, 0, 0, 0);
      if (d < min) return true;
    }

    return false;
  }

  /**
   * Set the minimum selectable date (disables dates before this)
   * @param {string} dateStr - YYYY-MM-DD
   */
  setMinDate(dateStr) {
    if (dateStr) {
      const parts = dateStr.split('-');
      this.minDate = new Date(
        parseInt(parts[0], 10),
        parseInt(parts[1], 10) - 1,
        parseInt(parts[2], 10)
      );
    } else {
      this.minDate = null;
    }
    // Clear selected date if it now violates minDate
    if (this.selectedDate && this.isDisabled(this.selectedDate)) {
      this.selectedDate = null;
      this.input.value = '';
    }
    this.renderCalendar(this.currentYear, this.currentMonth);
  }

  /**
   * Register a callback to fire when a date is selected
   * @param {function} fn
   */
  onSelect(fn) {
    this._onSelect = fn;
  }

  /** Get selected date as ISO string or null */
  getSelectedISO() {
    return this.selectedDate ? this._formatISO(this.selectedDate) : null;
  }

  // ===== Private helpers =====

  _formatISO(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  _formatDisplay(date) {
    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
    ];
    const d = String(date.getDate()).padStart(2, '0');
    const m = monthNames[date.getMonth()];
    const y = date.getFullYear();
    return `${d} ${m} ${y}`;
  }

  _isSameDay(a, b) {
    return (
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate()
    );
  }
}

/* ===== App Initialization ===== */
document.addEventListener('DOMContentLoaded', () => {
  // Instantiate pickers
  const departurePicker = new DatePicker('departure');
  const returnPicker = new DatePicker('return');

  // When departure date is selected, update return picker's min date
  departurePicker.onSelect((dateStr, dateObj) => {
    // Return must be at least 1 day after departure
    const minReturn = new Date(dateObj);
    minReturn.setDate(minReturn.getDate() + 1);
    const y = minReturn.getFullYear();
    const m = String(minReturn.getMonth() + 1).padStart(2, '0');
    const d = String(minReturn.getDate()).padStart(2, '0');
    returnPicker.setMinDate(`${y}-${m}-${d}`);
  });

  // ===== One-Way / Round-Trip Toggle =====
  const tripRadios = document.querySelectorAll('input[name="trip-type"]');
  const returnSection = document.getElementById('return-picker-wrapper');
  const returnInput = document.getElementById('return-date-input');
  const returnResultRow = document.querySelector('.return-result-row');

  function updateTripType() {
    const selected = document.querySelector('input[name="trip-type"]:checked');
    const isRoundTrip = selected && selected.value === 'round-trip';

    if (isRoundTrip) {
      returnSection.classList.add('visible');
      returnInput.disabled = false;
    } else {
      returnSection.classList.remove('visible');
      returnInput.disabled = true;
      // Clear return date when switching to one-way
      returnPicker.selectedDate = null;
      returnInput.value = '';
      const errEl = document.querySelector('[data-testid="error-return"]');
      if (errEl) errEl.textContent = '';
    }
  }

  tripRadios.forEach((radio) => radio.addEventListener('change', updateTripType));
  updateTripType(); // Initial state

  // ===== Passenger Stepper =====
  let passengerCount = 1;
  const countDisplay = document.querySelector('[data-testid="passenger-count"]');
  const minusBtn = document.querySelector('[data-testid="passenger-minus"]');
  const plusBtn = document.querySelector('[data-testid="passenger-plus"]');

  function updatePassengerButtons() {
    minusBtn.disabled = passengerCount <= 1;
    plusBtn.disabled = passengerCount >= 9;
    countDisplay.textContent = String(passengerCount);
  }

  minusBtn.addEventListener('click', () => {
    if (passengerCount > 1) {
      passengerCount--;
      updatePassengerButtons();
    }
  });

  plusBtn.addEventListener('click', () => {
    if (passengerCount < 9) {
      passengerCount++;
      updatePassengerButtons();
    }
  });

  updatePassengerButtons();

  // ===== Form Validation & Search =====
  const form = document.getElementById('booking-form');
  const resultsSection = document.getElementById('results-section');

  function setError(testId, message) {
    const el = document.querySelector(`[data-testid="${testId}"]`);
    if (el) el.textContent = message;
  }

  function clearErrors() {
    ['error-from', 'error-to', 'error-departure', 'error-return'].forEach((id) =>
      setError(id, '')
    );
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    clearErrors();

    const fromCity = document.getElementById('from-city').value.trim();
    const toCity = document.getElementById('to-city').value.trim();
    const departureISO = departurePicker.getSelectedISO();
    const selected = document.querySelector('input[name="trip-type"]:checked');
    const isRoundTrip = selected && selected.value === 'round-trip';
    const returnISO = returnPicker.getSelectedISO();
    const cabinClass = document.getElementById('cabin-class').value;

    let valid = true;

    if (!fromCity) {
      setError('error-from', 'Please enter a departure city.');
      valid = false;
    }

    if (!toCity) {
      setError('error-to', 'Please enter a destination city.');
      valid = false;
    }

    if (!departureISO) {
      setError('error-departure', 'Please select a departure date.');
      valid = false;
    }

    if (isRoundTrip && !returnISO) {
      setError('error-return', 'Please select a return date.');
      valid = false;
    }

    if (!valid) return;

    // Populate and show results
    document.getElementById('result-route').textContent = `${fromCity} → ${toCity}`;
    document.getElementById('result-trip-type').textContent = isRoundTrip ? 'Round Trip' : 'One Way';
    document.getElementById('result-departure').textContent = departurePicker.input.value;
    document.getElementById('result-passengers').textContent = `${passengerCount} passenger${passengerCount > 1 ? 's' : ''}`;
    document.getElementById('result-cabin').textContent = cabinClass;

    if (isRoundTrip) {
      document.getElementById('result-return').textContent = returnPicker.input.value;
      if (returnResultRow) returnResultRow.classList.add('visible');
    } else {
      if (returnResultRow) returnResultRow.classList.remove('visible');
    }

    resultsSection.removeAttribute('hidden');
    resultsSection.scrollIntoView({ behavior: 'smooth' });
  });
});
