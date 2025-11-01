'use strict';

(function() {
  const MS_IN_DAY = 24 * 60 * 60 * 1000;

  class Calendar {
    constructor(element = null, options = {}) {
      this.element = element || document.getElementById('calendar');
      this.options = Object.assign(
        {
          locale: 'it-IT',
          startOnMonday: true,
          showTodayButton: true,
          selectedDate: new Date(),
          onSelect: null, // (date) => {}
        },
        options
      );

      // Stato della vista (mese/anno correnti mostrati)
      const today = this._stripTime(new Date());
      this.viewYear = today.getFullYear();
      this.viewMonth = today.getMonth();
      this.focusedDate = new Date(today); // per la navigazione via tastiera
      this.selectedDate = this._stripTime(this.options.selectedDate || today);

      if (this.element) {
        this.init();
      }
    }

    // Inizializza DOM, eventi, prima render
    init() {
      this.element.classList.add('calendar');
      this._injectBaseStylesOnce();

      // Header
      this.headerEl = document.createElement('div');
      this.headerEl.className = 'cal-header';

      this.prevBtn = this._makeBtn('‹', 'Mese precedente', () => this.prevMonth());
      this.nextBtn = this._makeBtn('›', 'Mese successivo', () => this.nextMonth());
      this.titleEl = document.createElement('div');
      this.titleEl.className = 'cal-title';
      this.todayBtn = this.options.showTodayButton
        ? this._makeBtn('Oggi', 'Vai a oggi', () => this.goToday())
        : null;

      this.headerEl.appendChild(this.prevBtn);
      this.headerEl.appendChild(this.titleEl);
      if (this.todayBtn) this.headerEl.appendChild(this.todayBtn);
      this.headerEl.appendChild(this.nextBtn);

      // Griglia
      this.gridEl = document.createElement('div');
      this.gridEl.className = 'cal-grid';
      this.gridEl.setAttribute('role', 'grid');
      this.gridEl.setAttribute('aria-labelledby', ''); // impostato in render

      // Intestazione giorni settimana
      this.weekHeaderEl = document.createElement('div');
      this.weekHeaderEl.className = 'cal-week-header';

      // Monta
      this.element.innerHTML = '';
      this.element.appendChild(this.headerEl);
      this.element.appendChild(this.weekHeaderEl);
      this.element.appendChild(this.gridEl);

      // Eventi tastiera sulla griglia
      this.gridEl.addEventListener('keydown', (e) => this._onGridKeydown(e));

      // Render iniziale
      const today = this._stripTime(new Date());
      this.viewYear = today.getFullYear();
      this.viewMonth = today.getMonth();
      this.render();
    }

    // Renderizza l’intera vista (titolo, header giorni, celle giorni)
    render() {
      // Titolo mese/anno
      const viewDate = new Date(this.viewYear, this.viewMonth, 1);
      const monthName = viewDate.toLocaleDateString(this.options.locale, {
        month: 'long',
        year: 'numeric',
      });
      this.titleEl.textContent = this._capitalize(monthName);
      this.titleEl.id = `cal-title-${this.viewYear}-${this.viewMonth}`;
      this.gridEl.setAttribute('aria-labelledby', this.titleEl.id);

      // Intestazione giorni della settimana
      const weekdayNames = this._getWeekdayHeaders();
      this.weekHeaderEl.innerHTML = '';
      for (const wd of weekdayNames) {
        const d = document.createElement('div');
        d.className = 'cal-weekday';
        d.textContent = wd;
        d.setAttribute('aria-hidden', 'true');
        this.weekHeaderEl.appendChild(d);
      }

      // Celle dei giorni (6 settimane sempre)
      const { startDate, endDate } = this._gridRange(this.viewYear, this.viewMonth);
      this.gridEl.innerHTML = '';

      let loopDate = new Date(startDate);
      const today = this._stripTime(new Date());

      for (; loopDate <= endDate; loopDate = new Date(loopDate.getTime() + MS_IN_DAY)) {
        const inCurrentMonth = loopDate.getMonth() === this.viewMonth;
        const isToday = this._sameDay(loopDate, today);
        const isSelected = this._sameDay(loopDate, this.selectedDate);

        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'cal-cell' + (inCurrentMonth ? '' : ' is-out') + (isToday ? ' is-today' : '') + (isSelected ? ' is-selected' : '');
        btn.setAttribute('role', 'gridcell');
        btn.setAttribute('aria-selected', isSelected ? 'true' : 'false');
        btn.dataset.date = this._toISO(loopDate);
        btn.textContent = String(loopDate.getDate());

        // Solo una cella focusable alla volta (quella selezionata, altrimenti oggi, altrimenti il primo del mese)
        const shouldTab =
          isSelected ||
          (this.selectedDate == null && isToday) ||
          (this.selectedDate == null && this._isFirstOfGrid(loopDate, startDate));
        btn.tabIndex = shouldTab ? 0 : -1;

        btn.addEventListener('click', () => this._selectDateFromCell(btn));
        btn.addEventListener('focus', () => {
          // Memorizza focus per navigazione tastiera
          this.focusedDate = this._fromISO(btn.dataset.date);
        });

        this.gridEl.appendChild(btn);
      }
    }

    // API pubblica
    prevMonth() {
      if (this.viewMonth === 0) {
        this.viewMonth = 11;
        this.viewYear -= 1;
      } else {
        this.viewMonth -= 1;
      }
      // mantieni il giorno focalizzato coerente
      this.focusedDate = new Date(this.viewYear, this.viewMonth, Math.min(this.focusedDate.getDate(), this._daysInMonth(this.viewYear, this.viewMonth)));
      this.render();
      this._restoreFocus();
    }

    nextMonth() {
      if (this.viewMonth === 11) {
        this.viewMonth = 0;
        this.viewYear += 1;
      } else {
        this.viewMonth += 1;
      }
      this.focusedDate = new Date(this.viewYear, this.viewMonth, Math.min(this.focusedDate.getDate(), this._daysInMonth(this.viewYear, this.viewMonth)));
      this.render();
      this._restoreFocus();
    }

    goToday() {
      const today = this._stripTime(new Date());
      this.viewYear = today.getFullYear();
      this.viewMonth = today.getMonth();
      this.focusedDate = new Date(today);
      this.render();
      this._focusCellByDate(today);
    }

    getDate() {
      return new Date(this.selectedDate);
    }

    setDate(date) {
      const d = this._stripTime(date);
      this.selectedDate = d;
      this.viewYear = d.getFullYear();
      this.viewMonth = d.getMonth();
      this.focusedDate = new Date(d);
      this.render();
      this._focusCellByDate(d);
      if (typeof this.options.onSelect === 'function') {
        this.options.onSelect(new Date(this.selectedDate));
      }
    }

    // ============== Utilità e gestione eventi ==============

    _onGridKeydown(e) {
      const key = e.key;
      const current = this.focusedDate ? new Date(this.focusedDate) : this._firstOfMonth(this.viewYear, this.viewMonth);
      let next;

      const move = (days) => new Date(current.getTime() + days * MS_IN_DAY);

      switch (key) {
        case 'ArrowLeft':
          next = move(-1);
          break;
        case 'ArrowRight':
          next = move(1);
          break;
        case 'ArrowUp':
          next = move(-7);
          break;
        case 'ArrowDown':
          next = move(7);
          break;
        case 'Home': // inizio settimana
          next = move(-this._weekdayIndex(current));
          break;
        case 'End': // fine settimana
          next = move(6 - this._weekdayIndex(current));
          break;
        case 'PageUp':
          next = new Date(current);
          next.setMonth(next.getMonth() - 1);
          break;
        case 'PageDown':
          next = new Date(current);
          next.setMonth(next.getMonth() + 1);
          break;
        case 'Enter':
        case ' ':
          // seleziona il giorno focalizzato
          e.preventDefault();
          this.setDate(current);
          return;
        default:
          return; // non gestito
      }

      e.preventDefault();

      // Se cambia mese/anno, aggiorna vista
      if (next.getMonth() !== this.viewMonth || next.getFullYear() !== this.viewYear) {
        this.viewYear = next.getFullYear();
        this.viewMonth = next.getMonth();
        this.render();
      }

      this.focusedDate = this._stripTime(next);
      this._focusCellByDate(this.focusedDate);
    }

    _selectDateFromCell(btn) {
      const date = this._fromISO(btn.dataset.date);
      this.selectedDate = date;
      if (date.getMonth() !== this.viewMonth || date.getFullYear() !== this.viewYear) {
        this.viewYear = date.getFullYear();
        this.viewMonth = date.getMonth();
      }
      this.render();
      this._focusCellByDate(date);
      if (typeof this.options.onSelect === 'function') {
        this.options.onSelect(new Date(this.selectedDate));
      }
    }

    _focusCellByDate(date) {
      const iso = this._toISO(date);
      const cell = this.gridEl.querySelector(`.cal-cell[data-date="${iso}"]`);
      if (cell) {
        // reset tabindex
        this.gridEl.querySelectorAll('.cal-cell').forEach((c) => (c.tabIndex = -1));
        cell.tabIndex = 0;
        cell.focus();
      } else {
        // se non visibile (mese diverso), focalizza il primo del mese corrente
        const first = this.gridEl.querySelector('.cal-cell:not(.is-out)');
        if (first) {
          first.tabIndex = 0;
          first.focus();
        }
      }
    }

    _restoreFocus() {
      // prova a focalizzare la data "focusedDate", altrimenti il selezionato, altrimenti oggi
      const target = this.focusedDate || this.selectedDate || this._stripTime(new Date());
      this._focusCellByDate(target);
    }

    _getWeekdayHeaders() {
      const base = new Date(2020, 10, 2); // Lunedì 2 Nov 2020
      const days = [];
      for (let i = 0; i < 7; i++) {
        const d = new Date(base.getTime() + i * MS_IN_DAY);
        const label = d.toLocaleDateString(this.options.locale, { weekday: 'short' });
        days.push(this._capitalize(label.replace('.', '')));
      }
      return days;
    }

    _gridRange(year, month) {
      // primo del mese
      const first = new Date(year, month, 1);
      const firstIndex = this._weekdayIndex(first); // 0..6 (0 = lunedì se startOnMonday)
      // inizio griglia: lunedì della settimana contenente il primo
      const startDate = new Date(first.getTime() - firstIndex * MS_IN_DAY);
      // fine griglia: 41 giorni dopo (6 settimane * 7 - 1)
      const endDate = new Date(startDate.getTime() + 41 * MS_IN_DAY);
      return { startDate: this._stripTime(startDate), endDate: this._stripTime(endDate) };
      }

    _weekdayIndex(date) {
      // getDay(): 0=Dom ... 6=Sab
      const js = date.getDay();
      return this.options.startOnMonday ? (js + 6) % 7 : js;
    }

    _daysInMonth(y, m) {
      return new Date(y, m + 1, 0).getDate();
    }

    _firstOfMonth(y, m) {
      return new Date(y, m, 1);
    }

    _sameDay(a, b) {
      return a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
    }

    _stripTime(d) {
      const t = new Date(d);
      t.setHours(0, 0, 0, 0);
      return t;
    }

    _isFirstOfGrid(d, startDate) {
      return this._sameDay(d, startDate);
    }

    _toISO(d) {
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${y}-${m}-${day}`;
    }

    _fromISO(s) {
      const [y, m, d] = s.split('-').map(Number);
      return new Date(y, m - 1, d);
    }

    _capitalize(str) {
      return str.charAt(0).toUpperCase() + str.slice(1);
    }

    _makeBtn(text, title, onClick) {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'cal-btn';
      b.title = title;
      b.setAttribute('aria-label', title);
      b.textContent = text;
      b.addEventListener('click', onClick);
      return b;
    }

    _injectBaseStylesOnce() {
      if (document.getElementById('calendar-base-styles')) return;
      const style = document.createElement('style');
      style.id = 'calendar-base-styles';
      style.textContent = `
        .calendar { --gap: .5rem; --radius: .6rem; --muted: #98a2b3; --ring: #2563eb; --sel-bg: #2563eb15; --today: #16a34a; font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; max-width: 340px; }
        .cal-header { display:flex; align-items:center; justify-content:space-between; gap: var(--gap); margin-bottom: var(--gap); }
        .cal-title { font-weight: 600; text-transform: capitalize; }
        .cal-btn { padding: .35rem .6rem; border-radius: var(--radius); border: 1px solid #e5e7eb; background: #fff; cursor: pointer; }
        .cal-btn:hover { background:#f8fafc; }
        .cal-week-header { display: grid; grid-template-columns: repeat(7, 1fr); gap: 2px; margin-bottom: 2px; font-size:.85rem; color: var(--muted); }
        .cal-weekday { text-align:center; padding:.25rem 0; }
        .cal-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 2px; }
        .cal-cell { position:relative; padding:.6rem 0; text-align:center; border-radius: var(--radius); border: 1px solid #f1f5f9; background:#fff; cursor:pointer; }
        .cal-cell:focus { outline: 2px solid var(--ring); outline-offset: 2px; z-index:1; }
        .cal-cell.is-out { color: var(--muted); background: #fafafa; }
        .cal-cell.is-today { box-shadow: inset 0 0 0 2px var(--today); }
        .cal-cell.is-selected { background: var(--sel-bg); border-color: #c7d2fe; }
      `;
      document.head.appendChild(style);
    }
  }
  
  window.Calendar = Calendar;
})();