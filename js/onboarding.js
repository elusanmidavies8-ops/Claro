document.addEventListener('DOMContentLoaded', () => {
  const screens = Array.from(document.querySelectorAll('.screen'));
  if (!screens.length) return;

  let current = screens.findIndex(s => s.classList.contains('active'));
  if (current === -1) current = 0;
  screens.forEach((s, i) => s.classList.toggle('active', i === current));
  history.replaceState({ idx: current }, '', `#step-${current + 1}`);

  function showScreen(idx, push = true) {
    if (idx === current || idx < 0 || idx >= screens.length) return;
    const prev = screens[current];
    const next = screens[idx];

    if (prev) {
      prev.classList.remove('active');
      prev.classList.add('exit-left');
      prev.addEventListener('transitionend', function onEnd() {
        prev.classList.remove('exit-left');
        prev.removeEventListener('transitionend', onEnd);
      });
    }

    next.classList.add('active');
    const focusable = next.querySelector('button, [href], input, textarea, select');
    if (focusable) focusable.focus();

    current = idx;
    if (push) history.pushState({ idx }, '', `#step-${idx + 1}`);
    try { scheduleRedirectIfStep5(idx); } catch (e) { /* ignore if scheduler not ready */ }
  }

  screens.forEach((screen, i) => {
    const btn = screen.querySelector('button[type="button"], button#start-button6');
    if (!btn) return;

    const radios = Array.from(screen.querySelectorAll('input[type="radio"]'));
    const checks = Array.from(screen.querySelectorAll('input[type="checkbox"]'));
    const text = screen.querySelector('input[type="text"]');

    const updateState = () => {
      if (radios.length) {
        btn.disabled = !radios.some(r => r.checked);
        return;
      }
      if (checks.length) {
        const checkedCount = checks.filter(c => c.checked).length;
        btn.disabled = checkedCount === 0;
        checks.forEach(c => { if (!c.checked) c.disabled = checkedCount >= 3; });
        return;
      }
      if (text) {
        btn.disabled = text.value.trim() === '';
      }
    };

    updateState();
    radios.forEach(r => r.addEventListener('change', updateState));
    checks.forEach(c => c.addEventListener('change', updateState));
    if (text) text.addEventListener('input', updateState);

    btn.addEventListener('click', () => {
      if (btn.disabled) return;
      btn.disabled = true;
      const spinner = btn.querySelector('.spinner');
      if (spinner) spinner.classList.add('spinning');
      showScreen(Math.min(i + 1, screens.length - 1), true);
      setTimeout(() => { if (spinner) spinner.classList.remove('spinning'); }, 600);
    });
  });

  window.addEventListener('popstate', (e) => {
    const idx = (e.state && typeof e.state.idx === 'number') ? e.state.idx : 0;
    showScreen(idx, false);
  });

  document.addEventListener('keydown', (ev) => {
    if (ev.key === 'ArrowRight') showScreen(Math.min(current + 1, screens.length - 1), true);
    if (ev.key === 'ArrowLeft') showScreen(Math.max(current - 1, 0), true);
  });
});

// redirect to task.html 5s after showing step 5 (index 4)
let _redirectTimer = null;
function scheduleRedirectIfStep5(idx) {
  clearTimeout(_redirectTimer);
  const screens = Array.from(document.querySelectorAll('.screen'));
  const isLast = screens.length && idx === screens.length - 1;
  const isStep5 = idx === 4 || isLast || (screens[idx] && screens[idx].id === 'loading');
  if (isStep5) {
    // update loading screen name from saved name or current input
    const name = (function() {
      try { return localStorage.getItem('claro_name') || document.querySelector('#txt-input')?.value || 'Friend'; } catch (e) { return document.querySelector('#txt-input')?.value || 'Friend'; }
    })();
    const loadName = document.querySelector('#load-name');
    if (loadName) loadName.textContent = name;
    _redirectTimer = setTimeout(() => { window.location.href = 'task.html'; }, 5000);
  }
}

// If the script loads and the DOM already has step 5 active, schedule redirect
document.addEventListener('DOMContentLoaded', () => {
  const screens = Array.from(document.querySelectorAll('.screen'));
  if (!screens.length) return;
  const current = screens.findIndex(s => s.classList.contains('active'));
  scheduleRedirectIfStep5(current === -1 ? 0 : current);
  // persist name as user types so task page can read it
  const nameInput = document.querySelector('#txt-input');
  if (nameInput) {
    // initialize from storage if present
    try {
      const stored = localStorage.getItem('claro_name');
      if (stored) nameInput.value = stored;
    } catch (e) { /* ignore */ }
    nameInput.addEventListener('input', (ev) => {
      const v = ev.target.value.trim();
      try { localStorage.setItem('claro_name', v); } catch (e) { /* ignore */ }
    });
  }
});
