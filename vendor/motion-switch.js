/* Motion state — sem seletor visível.
   API: window.Motion.mode  ('on'|'off')
        window.Motion.on(fn) -> fn(mode) on every change (and once now)
        window.Motion.set(mode)
   URL: ?motion=off|on (for filming). */
(function () {
  const MODES = ['off', 'on'];
  const subs = [];
  let mode = 'on';
  try { const q = new URLSearchParams(location.search).get('motion'); if (MODES.includes(q)) mode = q; } catch (e) {}

  const st = document.createElement('style');
  st.textContent = 'html[data-motion=off] *,html[data-motion=off] *::before,html[data-motion=off] *::after{animation-play-state:paused!important;transition-duration:0s!important}';
  document.head.appendChild(st);

  function apply() {
    document.documentElement.dataset.motion = mode;
    subs.forEach(f => { try { f(mode); } catch (e) { console.error(e); } });
  }
  function set(m) { if (!MODES.includes(m) || m === mode) return; mode = m; apply(); }

  window.Motion = {
    get mode() { return mode; },
    get moving() { return mode !== 'off'; },
    set,
    on(f) { subs.push(f); try { f(mode); } catch (e) { console.error(e); } }
  };
  document.documentElement.dataset.motion = mode;
})();
