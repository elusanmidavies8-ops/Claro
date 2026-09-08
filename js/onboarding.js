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