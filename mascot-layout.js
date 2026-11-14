/* ==============================================================================
   FINELA 푸터 마스코트 위치 편집 모드
   ------------------------------------------------------------------------------
   1) 위치·크기 적용 (모든 방문자)
      - player-layout.json 의 "footer-mascot" 레이어({x, y, s})를 읽어 마스코트에 적용한다.
        x, y = 푸터 컨테이너 폭 대비 비율, s = 배율. 저장된 값이 없으면 기본 위치.
        (index.html 을 파일로 직접 열면 player-layout.data.js 의 사본 사용)
   2) 편집 모드 (로컬 미리보기 localhost 에서만 표시, 배포 사이트에는 나타나지 않음)
      - 왼쪽 아래 '마스코트 편집' 버튼(푸터가 화면에 보일 때) → 편집 모드 켜기
      - 마스코트를 드래그해서 이동 / 마우스 휠 또는 − + 버튼으로 크기 / 방향키로 미세 이동(Shift = 10배)
      - '저장' → .claude/dev_server.py 가 player-layout.json 에 기록 (선수 상세 레이어 편집기와 같은 파일·같은 저장 방식)
      - '기본 위치' → 기본 위치·크기로 되돌림
   ============================================================================== */
(function () {
  'use strict';

  const LAYER_ID = 'footer-mascot';
  const LAYOUT_URL = 'player-layout.json';
  const SAVE_URL = '/__save-player-layout';
  const IS_LOCAL = ['localhost', '127.0.0.1', '[::1]', '::1'].includes(location.hostname);

  const mascot = document.querySelector('.footer-mascot');
  const container = document.querySelector('.footer-container');
  const footer = document.getElementById('agency-footer');
  if (!mascot || !container || !footer) return;

  mascot.draggable = false;

  let pos = { x: 0, y: 0, s: 1 };      // 현재 위치(비율)·배율
  let saved = { x: 0, y: 0, s: 1 };    // 마지막으로 저장된 값
  let editing = false;

  const round = (n, d) => Math.round(n * Math.pow(10, d)) / Math.pow(10, d);
  const same = (a, b) => Math.abs(a.x - b.x) < 1e-6 && Math.abs(a.y - b.y) < 1e-6 && Math.abs(a.s - b.s) < 1e-4;
  const unit = () => container.getBoundingClientRect().width || 1200;

  // ---------------------------------------------------------------------------
  // 적용
  // ---------------------------------------------------------------------------
  function apply() {
    const u = unit();
    if (pos.x || pos.y) mascot.style.setProperty('translate', `${(pos.x * u).toFixed(2)}px ${(pos.y * u).toFixed(2)}px`);
    else mascot.style.removeProperty('translate');
    if (pos.s && pos.s !== 1) mascot.style.setProperty('scale', String(pos.s));
    else mascot.style.removeProperty('scale');
    if (editing) refreshBar();
  }

  function fromLayers(layers) {
    const d = (layers && layers[LAYER_ID]) || {};
    return { x: Number(d.x) || 0, y: Number(d.y) || 0, s: Number(d.s) || 1 };
  }

  function embeddedLayers() {
    const e = window.FINELA_PLAYER_LAYOUT;
    return e && typeof e === 'object' && e.layers ? e.layers : {};
  }

  function load() {
    const done = (layers) => {
      pos = fromLayers(layers);
      saved = Object.assign({}, pos);
      apply();
    };
    if (location.protocol === 'file:') return done(embeddedLayers());
    fetch(LAYOUT_URL, { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : null))
      .then((json) => done(json && json.layers ? json.layers : embeddedLayers()))
      .catch(() => done(embeddedLayers()));
  }

  window.addEventListener('resize', apply);
  load();

  if (!IS_LOCAL) return;   // 아래는 로컬 전용 편집기

  // ---------------------------------------------------------------------------
  // 편집기 UI
  // ---------------------------------------------------------------------------
  const style = document.createElement('style');
  style.textContent = `
    #fml-bar{position:fixed;left:18px;bottom:18px;z-index:9100;display:none;align-items:center;gap:8px;flex-wrap:wrap;
      max-width:calc(100vw - 36px);font:600 13px/1 'Pretendard',sans-serif;color:#fff}
    #fml-bar.show{display:flex}
    #fml-bar button{cursor:pointer;color:#fff;font:inherit;padding:11px 15px;border-radius:999px;
      background:rgba(14,16,24,.94);border:1px solid rgba(255,255,255,.28);box-shadow:0 6px 22px rgba(0,0,0,.5)}
    #fml-bar button:hover{border-color:#e60012}
    #fml-bar button.on,#fml-bar button.primary{background:#e60012;border-color:#e60012}
    #fml-bar .tools{display:none;align-items:center;gap:8px;flex-wrap:wrap}
    #fml-bar.editing .tools{display:flex}
    #fml-bar .readout{padding:10px 14px;border-radius:999px;background:rgba(14,16,24,.94);
      border:1px solid rgba(255,255,255,.18);color:#c9ccd8;font-weight:500;white-space:nowrap}
    #fml-bar .dirty{color:#ffb84d}
    #fml-toast{position:fixed;left:50%;bottom:78px;transform:translateX(-50%);z-index:9200;padding:10px 16px;border-radius:9px;
      background:rgba(14,16,24,.96);border:1px solid rgba(255,255,255,.25);color:#fff;font:600 13px/1.4 'Pretendard',sans-serif;
      opacity:0;pointer-events:none;transition:opacity .2s}
    #fml-toast.show{opacity:1}
    #fml-toast.err{border-color:#e60012}
    body.fml-editing .footer-mascot{pointer-events:auto;cursor:grab;outline:1.5px dashed #e60012;outline-offset:6px;
      touch-action:none;-webkit-user-drag:none}
    body.fml-editing .footer-mascot.dragging{cursor:grabbing}
  `;
  document.head.appendChild(style);

  const bar = document.createElement('div');
  bar.id = 'fml-bar';
  bar.innerHTML = `
    <button type="button" id="fml-toggle"><i class="fa-solid fa-paw"></i> 마스코트 편집</button>
    <span class="tools">
      <button type="button" id="fml-save" class="primary"><i class="fa-solid fa-floppy-disk"></i> 저장</button>
      <button type="button" id="fml-reset">기본 위치</button>
      <button type="button" id="fml-minus" aria-label="작게">−</button>
      <button type="button" id="fml-plus" aria-label="크게">+</button>
      <span class="readout" id="fml-readout"></span>
    </span>`;
  document.body.appendChild(bar);

  const toast = document.createElement('div');
  toast.id = 'fml-toast';
  document.body.appendChild(toast);
  let toastTimer = 0;
  function showToast(msg, err) {
    toast.textContent = msg;
    toast.classList.toggle('err', !!err);
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2600);
  }

  const $ = (id) => document.getElementById(id);
  const toggleBtn = $('fml-toggle');

  function refreshBar() {
    const dirty = !same(pos, saved);
    $('fml-readout').innerHTML =
      `x ${round(pos.x * 100, 2)}% · y ${round(pos.y * 100, 2)}% · 크기 ${round(pos.s, 2)}` +
      (dirty ? ' <span class="dirty">● 저장 안 됨</span>' : ' · 저장됨');
  }

  function setEditing(on) {
    editing = on;
    document.body.classList.toggle('fml-editing', on);
    bar.classList.toggle('editing', on);
    toggleBtn.classList.toggle('on', on);
    toggleBtn.innerHTML = on ? '<i class="fa-solid fa-check"></i> 편집 종료' : '<i class="fa-solid fa-paw"></i> 마스코트 편집';
    if (on) {
      refreshBar();
      mascot.scrollIntoView({ block: 'center', behavior: 'smooth' });
    } else if (!same(pos, saved)) {
      showToast('저장하지 않은 변경 사항이 있습니다. 다시 편집을 열어 저장하세요.', true);
    }
  }

  // 푸터가 화면에 보일 때만 편집 버튼 표시 (편집 중에는 항상 표시)
  if ('IntersectionObserver' in window) {
    new IntersectionObserver((en) => {
      bar.classList.toggle('show', en[0].isIntersecting || editing);
    }, { threshold: 0.05 }).observe(footer);
  } else {
    bar.classList.add('show');
  }
  toggleBtn.addEventListener('click', () => {
    setEditing(!editing);
    bar.classList.add('show');
  });

  // 드래그 이동
  let drag = null;
  mascot.addEventListener('pointerdown', (e) => {
    if (!editing) return;
    drag = { sx: e.clientX, sy: e.clientY, x0: pos.x, y0: pos.y };
    mascot.setPointerCapture(e.pointerId);
    mascot.classList.add('dragging');
    e.preventDefault();
  });
  mascot.addEventListener('pointermove', (e) => {
    if (!drag) return;
    const u = unit();
    pos.x = drag.x0 + (e.clientX - drag.sx) / u;
    pos.y = drag.y0 + (e.clientY - drag.sy) / u;
    apply();
  });
  const endDrag = () => {
    drag = null;
    mascot.classList.remove('dragging');
  };
  mascot.addEventListener('pointerup', endDrag);
  mascot.addEventListener('pointercancel', endDrag);

  // 크기: 마우스 휠(마스코트 위) / − + 버튼
  function scaleBy(f) {
    pos.s = Math.min(4, Math.max(0.2, round(pos.s * f, 3)));
    apply();
  }
  mascot.addEventListener('wheel', (e) => {
    if (!editing) return;
    e.preventDefault();
    scaleBy(e.deltaY < 0 ? 1.05 : 1 / 1.05);
  }, { passive: false });
  $('fml-minus').addEventListener('click', () => scaleBy(1 / 1.05));
  $('fml-plus').addEventListener('click', () => scaleBy(1.05));

  // 방향키 미세 이동 (1px, Shift = 10px)
  window.addEventListener('keydown', (e) => {
    if (!editing) return;
    const t = e.target;
    if (t && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) return;
    const step = (e.shiftKey ? 10 : 1) / unit();
    if (e.key === 'ArrowLeft') pos.x -= step;
    else if (e.key === 'ArrowRight') pos.x += step;
    else if (e.key === 'ArrowUp') pos.y -= step;
    else if (e.key === 'ArrowDown') pos.y += step;
    else return;
    e.preventDefault();
    apply();
  });

  $('fml-reset').addEventListener('click', () => {
    pos = { x: 0, y: 0, s: 1 };
    apply();
  });

  // 저장: player-layout.json 의 layers 에 footer-mascot 만 갱신 (다른 레이어는 그대로)
  function currentLayers() {
    return fetch(LAYOUT_URL, { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : null))
      .then((json) => (json && json.layers ? json.layers : embeddedLayers()))
      .catch(() => embeddedLayers());
  }

  $('fml-save').addEventListener('click', () => {
    currentLayers().then((layers) => {
      const next = JSON.parse(JSON.stringify(layers));
      const d = {};
      if (Math.abs(pos.x) > 1e-6) d.x = round(pos.x, 5);
      if (Math.abs(pos.y) > 1e-6) d.y = round(pos.y, 5);
      if (Math.abs(pos.s - 1) > 1e-4) d.s = round(pos.s, 4);
      if (Object.keys(d).length) next[LAYER_ID] = d;
      else delete next[LAYER_ID];

      const body = JSON.stringify({ version: 1, layers: next }, null, 2) + '\n';
      return fetch(SAVE_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body }).then((r) => {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        saved = Object.assign({}, pos);
        // 선수 상세 레이어 편집기가 메모리에 들고 있는 값도 맞춰 두어, 나중에 그쪽에서 저장해도 마스코트 위치가 되돌아가지 않게 함
        const api = window.FinelaPlayerLayout;
        if (api) {
          if (Object.keys(d).length) api.setLayer(LAYER_ID, d);
          else api.removeLayer(LAYER_ID);
        }
        refreshBar();
        showToast('저장 완료 → player-layout.json');
      });
    }).catch(() => {
      showToast('저장 실패: 미리보기 서버(.claude/dev_server.py)로 실행 중인지 확인하세요.', true);
    });
  });
})();
