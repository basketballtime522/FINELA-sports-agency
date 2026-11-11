/* ==============================================================================
   FINELA 선수 개인 상세 페이지 - 레이어 레이아웃 시스템
   ------------------------------------------------------------------------------
   1) 레이아웃 적용 (모든 환경)
      - index.html의 [data-layer] 요소마다 player-layout.json 값을 적용 (모든 선수 공통)
        · x, y : 이동량 (코트 폭 대비 비율 → 화면 크기가 바뀌어도 같은 위치 유지)
        · s    : 크기 배율 (1 = 원래 크기)
        · hidden : true면 삭제(숨김)
   2) 레이어 편집기 (로컬 미리보기 localhost 에서만 활성화, 배포 사이트에는 표시되지 않음)
      - 선수 상세 페이지 좌측 하단 '레이어 편집' 버튼
      - 드래그: 이동 / 모서리 핸들: 크기 / 방향키: 1px (Shift: 10px) / [ ]: 크기 -5%·+5%
      - Delete: 삭제 / Ctrl+Z: 되돌리기 / Ctrl+Y(Ctrl+Shift+Z): 다시 실행 / Ctrl+S: 저장
      - Alt+클릭: 상위 레이어 선택 / Esc: 선택 해제
      - 저장 → .claude/dev_server.py 가 player-layout.json 파일에 기록
   ============================================================================== */
(function () {
  'use strict';

  const LAYOUT_URL = 'player-layout.json';
  const SAVE_URL = '/__save-player-layout';
  const IS_LOCAL = ['localhost', '127.0.0.1', '[::1]', '::1'].includes(location.hostname);

  const modal = document.getElementById('playerModal');
  if (!modal) return;

  let layout = { version: 1, layers: {} };

  // ---------------------------------------------------------------------------
  // 공통 유틸
  // ---------------------------------------------------------------------------
  const allLayers = () => Array.from(modal.querySelectorAll('[data-layer]'));
  const layerEl = (id) => modal.querySelector(`[data-layer="${CSS.escape(id)}"]`);
  const layerName = (el) => el.getAttribute('data-layer-name') || el.getAttribute('data-layer');
  const getData = (id) => layout.layers[id] || {};

  // 위치 기준 단위 = 코트 폭(px). 화면 크기가 달라도 코트 대비 같은 위치에 오도록 함
  function unit() {
    const court = document.getElementById('modalCourt');
    return court ? court.offsetWidth : 0;
  }

  function cleanData(d) {
    const out = {};
    if (d.x && Math.abs(d.x) > 1e-6) out.x = Math.round(d.x * 1e5) / 1e5;
    if (d.y && Math.abs(d.y) > 1e-6) out.y = Math.round(d.y * 1e5) / 1e5;
    if (d.s && Math.abs(d.s - 1) > 1e-4) out.s = Math.round(d.s * 1e4) / 1e4;
    if (d.hidden) out.hidden = true;
    return out;
  }

  function setData(id, patch) {
    const next = cleanData(Object.assign({}, getData(id), patch));
    if (Object.keys(next).length) layout.layers[id] = next;
    else delete layout.layers[id];
  }

  // ---------------------------------------------------------------------------
  // 1) 레이아웃 적용
  // ---------------------------------------------------------------------------
  function apply() {
    const u = unit();
    let visibilityChanged = false;

    allLayers().forEach((el) => {
      const d = getData(el.getAttribute('data-layer'));

      const wasHidden = el.hasAttribute('data-layer-hidden');
      if (d.hidden) el.setAttribute('data-layer-hidden', '');
      else el.removeAttribute('data-layer-hidden');
      if (wasHidden !== !!d.hidden) visibilityChanged = true;

      if (u > 0 && (d.x || d.y)) {
        el.style.setProperty('translate', `${((d.x || 0) * u).toFixed(2)}px ${((d.y || 0) * u).toFixed(2)}px`);
      } else {
        el.style.removeProperty('translate');
      }

      if (d.s && d.s !== 1) el.style.setProperty('scale', String(d.s));
      else el.style.removeProperty('scale');
    });

    if (editor) editor.refresh();
    return visibilityChanged;
  }

  // 요소 표시/삭제가 바뀌면 코트 맞춤(main.js)을 다시 계산
  function applyAndRefit() {
    const changed = apply();
    if (changed && typeof window.fitPlayerModalCourt === 'function') window.fitPlayerModalCourt();
  }

  function loadLayout() {
    return fetch(LAYOUT_URL, { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : null))
      .then((json) => {
        if (json && typeof json === 'object' && json.layers) {
          layout = { version: 1, layers: json.layers };
        }
      })
      .catch(() => { /* 파일이 없으면 기본 배치 사용 */ })
      .then(applyAndRefit);
  }

  window.FinelaPlayerLayout = { apply };

  // ---------------------------------------------------------------------------
  // 2) 레이어 편집기 (로컬 전용)
  // ---------------------------------------------------------------------------
  let editor = null;

  function createEditor() {
    const STYLE = `
      #fpl-toggle{position:fixed;left:18px;bottom:18px;z-index:9100;display:none;align-items:center;gap:8px;
        padding:10px 16px;border-radius:999px;border:1px solid rgba(255,255,255,.25);background:rgba(10,11,16,.92);
        color:#fff;font:700 12px/1 'Pretendard',system-ui,sans-serif;letter-spacing:.5px;cursor:pointer;
        box-shadow:0 6px 24px rgba(0,0,0,.6)}
      #fpl-toggle:hover{border-color:#e60012}
      #fpl-toggle.on{background:#e60012;border-color:#e60012}
      body.modal-open #fpl-toggle{display:inline-flex}
      #fpl-panel{position:fixed;top:12px;left:auto;right:12px;width:290px;height:min(780px,calc(100vh - 24px));z-index:9100;
        display:none;flex-direction:column;background:rgba(12,13,19,.97);border:1px solid rgba(255,255,255,.14);border-radius:14px;
        color:#e6e8ef;font:12px/1.4 'Pretendard',system-ui,sans-serif;box-shadow:0 12px 40px rgba(0,0,0,.7);overflow:hidden;
        transition:opacity .15s}
      body.fpl-editing #fpl-panel{display:flex}
      #fpl-panel.collapsed{height:auto}
      #fpl-panel.collapsed > :not(.fpl-head){display:none}
      body.fpl-dragging #fpl-panel{opacity:.12;pointer-events:none}
      #fpl-panel *{box-sizing:border-box}
      .fpl-head{display:flex;align-items:center;gap:6px;padding:10px 10px 10px 14px;border-bottom:1px solid rgba(255,255,255,.08);
        cursor:move;touch-action:none}
      .fpl-head b{flex:1;font-size:12.5px;letter-spacing:.3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
      .fpl-head .fpl-ico{flex:none;width:24px;height:24px;border-radius:6px;border:1px solid rgba(255,255,255,.16);
        background:rgba(255,255,255,.04);color:#cfd3dd;cursor:pointer;font-size:11px;line-height:1;padding:0}
      .fpl-head .fpl-ico:hover{border-color:#e60012;color:#fff}
      .fpl-status{font-size:11px;color:#8e95a5;white-space:nowrap}
      .fpl-status.dirty{color:#ff5a66}
      .fpl-toolbar{display:flex;flex-wrap:wrap;gap:6px;padding:10px 14px;border-bottom:1px solid rgba(255,255,255,.08)}
      .fpl-btn{padding:6px 10px;border-radius:7px;border:1px solid rgba(255,255,255,.18);background:rgba(255,255,255,.04);
        color:#fff;font:600 11.5px/1 inherit;cursor:pointer}
      .fpl-btn:hover:not(:disabled){border-color:#e60012}
      .fpl-btn:disabled{opacity:.35;cursor:default}
      .fpl-btn.primary{background:#e60012;border-color:#e60012}
      .fpl-props{padding:10px 14px;border-bottom:1px solid rgba(255,255,255,.08);display:grid;gap:8px}
      .fpl-props .fpl-sel{font-weight:700;color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
      .fpl-props .row{display:grid;grid-template-columns:repeat(3,1fr);gap:6px}
      .fpl-props label{display:grid;gap:3px;font-size:10.5px;color:#8e95a5}
      .fpl-props input{width:100%;padding:5px 6px;border-radius:6px;border:1px solid rgba(255,255,255,.16);
        background:#07080c;color:#fff;font:12px/1.2 ui-monospace,Consolas,monospace}
      .fpl-props .btns{display:flex;gap:6px}
      .fpl-props.empty .row,.fpl-props.empty .btns{display:none}
      .fpl-list{flex:1;overflow:auto;padding:6px 0}
      .fpl-item{display:flex;align-items:center;gap:6px;padding:5px 10px 5px 0;cursor:pointer;white-space:nowrap}
      .fpl-item:hover{background:rgba(255,255,255,.05)}
      .fpl-item.sel{background:rgba(230,0,18,.22)}
      .fpl-item .nm{flex:1;overflow:hidden;text-overflow:ellipsis}
      .fpl-item.hid .nm{text-decoration:line-through;color:#6b7080}
      .fpl-item .mod{width:6px;height:6px;border-radius:50%;background:#e60012;flex:none}
      .fpl-item .eye{flex:none;border:none;background:none;color:#aab0bf;cursor:pointer;padding:2px 4px;font-size:12px}
      .fpl-item .eye:hover{color:#fff}
      .fpl-help{padding:10px 14px;border-top:1px solid rgba(255,255,255,.08);color:#7d8394;font-size:10.5px;line-height:1.55}
      #fpl-box{position:fixed;z-index:9050;pointer-events:none;border:1.5px solid #e60012;box-shadow:0 0 0 1px rgba(0,0,0,.6);display:none}
      #fpl-box .tag{position:absolute;left:-1.5px;top:-20px;background:#e60012;color:#fff;font:700 10.5px/1 system-ui,sans-serif;
        padding:4px 6px;border-radius:4px 4px 0 0;white-space:nowrap}
      #fpl-box .handle{position:absolute;right:-7px;bottom:-7px;width:13px;height:13px;background:#fff;border:2px solid #e60012;
        border-radius:3px;pointer-events:auto;cursor:nwse-resize}
      #fpl-hover{position:fixed;z-index:9040;pointer-events:none;border:1px dashed rgba(255,255,255,.55);display:none}
      body.fpl-editing #playerModal [data-layer]{cursor:move;pointer-events:auto !important}
      body.fpl-editing #playerModal{user-select:none}
      #fpl-toast{position:fixed;left:50%;bottom:24px;transform:translateX(-50%);z-index:9200;padding:10px 16px;border-radius:9px;
        background:rgba(12,13,19,.97);border:1px solid rgba(255,255,255,.16);color:#fff;font:600 12.5px/1.3 system-ui,sans-serif;
        opacity:0;transition:opacity .25s;pointer-events:none}
      #fpl-toast.show{opacity:1}
      #fpl-toast.err{border-color:#e60012}
    `;

    const style = document.createElement('style');
    style.textContent = STYLE;
    document.head.appendChild(style);

    const toggle = document.createElement('button');
    toggle.id = 'fpl-toggle';
    toggle.type = 'button';
    toggle.innerHTML = '<i class="fa-solid fa-layer-group"></i> 레이어 편집';
    document.body.appendChild(toggle);

    const panel = document.createElement('div');
    panel.id = 'fpl-panel';
    panel.innerHTML = `
      <div class="fpl-head" title="끌어서 패널 이동">
        <b>레이어 · 선수 상세</b><span class="fpl-status">저장됨</span>
        <button class="fpl-ico" type="button" data-panel="left" title="왼쪽 끝에 붙이기">◧</button>
        <button class="fpl-ico" type="button" data-panel="right" title="오른쪽 끝에 붙이기">◨</button>
        <button class="fpl-ico" type="button" data-panel="collapse" title="접기 / 펼치기">–</button>
      </div>
      <div class="fpl-toolbar">
        <button class="fpl-btn primary" data-act="save" title="Ctrl+S">저장</button>
        <button class="fpl-btn" data-act="undo" title="Ctrl+Z">↶ 되돌리기</button>
        <button class="fpl-btn" data-act="redo" title="Ctrl+Y">↷ 다시</button>
        <button class="fpl-btn" data-act="revert" title="마지막 저장 상태로">저장본 불러오기</button>
        <button class="fpl-btn" data-act="reset-all" title="모든 레이어 원래대로">전체 초기화</button>
        <button class="fpl-btn" data-act="close">편집 종료</button>
      </div>
      <div class="fpl-props empty">
        <div class="fpl-sel">레이어를 선택하세요</div>
        <div class="row">
          <label>X 이동(px)<input type="number" step="1" data-prop="x"></label>
          <label>Y 이동(px)<input type="number" step="1" data-prop="y"></label>
          <label>크기(%)<input type="number" step="1" min="10" max="500" data-prop="s"></label>
        </div>
        <div class="btns">
          <button class="fpl-btn" data-act="reset-one">이 레이어 초기화</button>
          <button class="fpl-btn" data-act="toggle-hide">삭제</button>
          <button class="fpl-btn" data-act="parent" title="Alt+클릭">상위 레이어</button>
        </div>
      </div>
      <div class="fpl-list"></div>
      <div class="fpl-help">
        드래그: 이동 · 모서리 핸들: 크기 · 방향키: 1px (Shift 10px)<br>
        [ ] : 크기 -5% / +5% · Delete: 삭제 · Esc: 선택 해제<br>
        Ctrl+Z / Ctrl+Y: 되돌리기 / 다시 · Ctrl+S: 저장 · Alt+클릭: 상위 레이어<br>
        패널: 제목 줄을 끌어 이동 · ◧ ◨ 좌/우 끝에 붙이기 · – 접기<br>
        위치는 코트 폭 기준 비율로 저장되어 모든 화면 크기·모든 선수에 동일 적용됩니다.
      </div>`;
    document.body.appendChild(panel);

    const box = document.createElement('div');
    box.id = 'fpl-box';
    box.innerHTML = '<span class="tag"></span><span class="handle" title="드래그하여 크기 조절"></span>';
    document.body.appendChild(box);

    const hover = document.createElement('div');
    hover.id = 'fpl-hover';
    document.body.appendChild(hover);

    const toast = document.createElement('div');
    toast.id = 'fpl-toast';
    document.body.appendChild(toast);

    const statusEl = panel.querySelector('.fpl-status');
    const propsEl = panel.querySelector('.fpl-props');
    const selNameEl = panel.querySelector('.fpl-sel');
    const listEl = panel.querySelector('.fpl-list');
    const inputs = {
      x: panel.querySelector('[data-prop="x"]'),
      y: panel.querySelector('[data-prop="y"]'),
      s: panel.querySelector('[data-prop="s"]'),
    };
    const hideBtn = panel.querySelector('[data-act="toggle-hide"]');
    const undoBtn = panel.querySelector('[data-act="undo"]');
    const redoBtn = panel.querySelector('[data-act="redo"]');

    let editing = false;
    let selectedId = null;
    let savedSnapshot = JSON.stringify(layout.layers);
    const history = [];
    const future = [];
    let toastTimer = null;

    const snapshot = () => JSON.stringify(layout.layers);
    const isDirty = () => snapshot() !== savedSnapshot;

    function showToast(msg, isError) {
      toast.textContent = msg;
      toast.classList.toggle('err', !!isError);
      toast.classList.add('show');
      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => toast.classList.remove('show'), 2600);
    }

    // 변경 전 상태를 히스토리에 기록
    function commit(before) {
      if (before === snapshot()) return;
      history.push(before);
      if (history.length > 200) history.shift();
      future.length = 0;
      refresh();
    }

    function change(id, patch) {
      const before = snapshot();
      setData(id, patch);
      applyAndRefit();
      commit(before);
    }

    // 상위 요소들의 누적 배율 (레이어 크기 + 화면 맞춤 축소) → 드래그 이동량 보정용
    function ancestorScale(el) {
      const p = el.parentElement;
      if (!p || !p.offsetWidth) return 1;
      return p.getBoundingClientRect().width / p.offsetWidth || 1;
    }

    function parentLayerId(id) {
      const el = layerEl(id);
      const p = el && el.parentElement ? el.parentElement.closest('[data-layer]') : null;
      return p && modal.contains(p) ? p.getAttribute('data-layer') : null;
    }

    function select(id, reveal) {
      selectedId = id;
      refresh();
      const el = id ? layerEl(id) : null;
      if (reveal && el && !el.hasAttribute('data-layer-hidden')) {
        const r = el.getBoundingClientRect();
        if (r.bottom < 0 || r.top > window.innerHeight) el.scrollIntoView({ block: 'center', behavior: 'smooth' });
      }
      const row = listEl.querySelector(`.fpl-item[data-id="${id}"]`);
      if (row) row.scrollIntoView({ block: 'nearest' });
    }

    function buildList() {
      listEl.innerHTML = '';
      allLayers().forEach((el) => {
        const id = el.getAttribute('data-layer');
        let depth = 0;
        let p = el.parentElement ? el.parentElement.closest('[data-layer]') : null;
        while (p && modal.contains(p)) {
          depth++;
          p = p.parentElement ? p.parentElement.closest('[data-layer]') : null;
        }
        const row = document.createElement('div');
        row.className = 'fpl-item';
        row.dataset.id = id;
        row.style.paddingLeft = `${12 + depth * 14}px`;
        row.innerHTML = `<span class="mod" hidden></span><span class="nm"></span>
          <button class="eye" type="button" title="삭제 / 복원"><i class="fa-regular fa-eye"></i></button>`;
        row.querySelector('.nm').textContent = layerName(el);
        row.addEventListener('click', (e) => {
          if (e.target.closest('.eye')) {
            change(id, { hidden: !getData(id).hidden });
            return;
          }
          select(id, true);
        });
        listEl.appendChild(row);
      });
    }

    function refresh() {
      if (!editing) return;
      statusEl.textContent = isDirty() ? '저장 안 됨' : '저장됨';
      statusEl.classList.toggle('dirty', isDirty());
      undoBtn.disabled = history.length === 0;
      redoBtn.disabled = future.length === 0;

      listEl.querySelectorAll('.fpl-item').forEach((row) => {
        const d = getData(row.dataset.id);
        row.classList.toggle('sel', row.dataset.id === selectedId);
        row.classList.toggle('hid', !!d.hidden);
        row.querySelector('.mod').hidden = !(d.x || d.y || (d.s && d.s !== 1) || d.hidden);
        row.querySelector('.eye i').className = d.hidden ? 'fa-regular fa-eye-slash' : 'fa-regular fa-eye';
      });

      const el = selectedId ? layerEl(selectedId) : null;
      propsEl.classList.toggle('empty', !el);
      if (!el) {
        selNameEl.textContent = '레이어를 선택하세요 (페이지에서 클릭 또는 목록에서 선택)';
        return;
      }
      const d = getData(selectedId);
      const u = unit() || 1000;
      selNameEl.textContent = layerName(el);
      if (document.activeElement !== inputs.x) inputs.x.value = Math.round((d.x || 0) * u);
      if (document.activeElement !== inputs.y) inputs.y.value = Math.round((d.y || 0) * u);
      if (document.activeElement !== inputs.s) inputs.s.value = Math.round((d.s || 1) * 100);
      hideBtn.textContent = d.hidden ? '복원' : '삭제';
    }

    // 선택 박스 / 호버 박스 위치를 매 프레임 갱신
    let hoverId = null;
    function drawBoxes() {
      if (!editing) return;
      const el = selectedId ? layerEl(selectedId) : null;
      if (el && !el.hasAttribute('data-layer-hidden')) {
        const r = el.getBoundingClientRect();
        box.style.display = 'block';
        box.style.left = `${r.left}px`;
        box.style.top = `${r.top}px`;
        box.style.width = `${r.width}px`;
        box.style.height = `${r.height}px`;
        box.querySelector('.tag').textContent = layerName(el);
      } else {
        box.style.display = 'none';
      }
      const h = hoverId && hoverId !== selectedId ? layerEl(hoverId) : null;
      if (h && !h.hasAttribute('data-layer-hidden')) {
        const r = h.getBoundingClientRect();
        hover.style.display = 'block';
        hover.style.left = `${r.left}px`;
        hover.style.top = `${r.top}px`;
        hover.style.width = `${r.width}px`;
        hover.style.height = `${r.height}px`;
      } else {
        hover.style.display = 'none';
      }
      requestAnimationFrame(drawBoxes);
    }

    function setEditing(on) {
      editing = on;
      document.body.classList.toggle('fpl-editing', on);
      toggle.classList.toggle('on', on);
      toggle.innerHTML = on
        ? '<i class="fa-solid fa-check"></i> 편집 종료'
        : '<i class="fa-solid fa-layer-group"></i> 레이어 편집';
      if (on) {
        placePanel(panelState);
        buildList();
        refresh();
        requestAnimationFrame(drawBoxes);
      } else {
        selectedId = null;
        hoverId = null;
        box.style.display = 'none';
        hover.style.display = 'none';
        if (isDirty()) showToast('저장하지 않은 변경 사항이 있습니다. 다시 편집을 열어 저장하세요.', true);
      }
    }

    function save() {
      const body = JSON.stringify({ version: 1, layers: layout.layers }, null, 2) + '\n';
      fetch(SAVE_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body })
        .then((r) => {
          if (!r.ok) throw new Error(`HTTP ${r.status}`);
          savedSnapshot = snapshot();
          refresh();
          showToast('저장 완료 → player-layout.json');
        })
        .catch(() => {
          showToast('저장 실패: 미리보기 서버(.claude/dev_server.py)로 실행 중인지 확인하세요.', true);
        });
    }

    function undo() {
      if (!history.length) return;
      future.push(snapshot());
      layout.layers = JSON.parse(history.pop());
      applyAndRefit();
      refresh();
    }

    function redo() {
      if (!future.length) return;
      history.push(snapshot());
      layout.layers = JSON.parse(future.pop());
      applyAndRefit();
      refresh();
    }

    // ---- 툴바 / 속성 입력 ----
    panel.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-act]');
      if (!btn) return;
      const act = btn.dataset.act;
      if (act === 'save') save();
      else if (act === 'undo') undo();
      else if (act === 'redo') redo();
      else if (act === 'close') setEditing(false);
      else if (act === 'revert') {
        const before = snapshot();
        layout.layers = JSON.parse(savedSnapshot);
        applyAndRefit();
        commit(before);
      } else if (act === 'reset-all') {
        if (!confirm('모든 레이어의 위치·크기·삭제 상태를 원래대로 되돌릴까요? (저장 전까지는 되돌리기 가능)')) return;
        const before = snapshot();
        layout.layers = {};
        applyAndRefit();
        commit(before);
      } else if (selectedId && act === 'reset-one') {
        change(selectedId, { x: 0, y: 0, s: 1, hidden: false });
      } else if (selectedId && act === 'toggle-hide') {
        change(selectedId, { hidden: !getData(selectedId).hidden });
      } else if (selectedId && act === 'parent') {
        const pid = parentLayerId(selectedId);
        if (pid) select(pid, true);
      }
    });

    Object.entries(inputs).forEach(([prop, input]) => {
      input.addEventListener('change', () => {
        if (!selectedId) return;
        const v = parseFloat(input.value);
        if (Number.isNaN(v)) return refresh();
        const u = unit() || 1000;
        if (prop === 's') change(selectedId, { s: Math.min(5, Math.max(0.1, v / 100)) });
        else change(selectedId, { [prop]: v / u });
      });
    });

    toggle.addEventListener('click', () => setEditing(!editing));

    // ---- 패널 이동 · 좌우 붙이기 · 접기 (위치는 이 브라우저에 기억) ----
    const PANEL_KEY = 'fpl-panel-state';
    const head = panel.querySelector('.fpl-head');
    const collapseBtn = panel.querySelector('[data-panel="collapse"]');

    function placePanel(state) {
      const w = panel.offsetWidth || 290;
      const h = panel.offsetHeight || 200;
      const maxLeft = Math.max(0, window.innerWidth - w - 4);
      const maxTop = Math.max(0, window.innerHeight - Math.min(h, 60) - 4);
      if (state.dock === 'left') {
        panel.style.left = '12px';
        panel.style.right = 'auto';
        panel.style.top = '12px';
      } else if (state.dock === 'right' || state.left == null) {
        panel.style.left = 'auto';
        panel.style.right = '12px';
        panel.style.top = '12px';
      } else {
        panel.style.left = `${Math.min(maxLeft, Math.max(4, state.left))}px`;
        panel.style.right = 'auto';
        panel.style.top = `${Math.min(maxTop, Math.max(4, state.top))}px`;
      }
      panel.classList.toggle('collapsed', !!state.collapsed);
      collapseBtn.textContent = state.collapsed ? '+' : '–';
    }

    let panelState = { dock: 'right', collapsed: false };
    try {
      const saved = JSON.parse(localStorage.getItem(PANEL_KEY) || 'null');
      if (saved && typeof saved === 'object') panelState = Object.assign(panelState, saved);
    } catch (err) { /* 저장소 사용 불가 시 기본 위치 */ }

    function savePanelState() {
      try { localStorage.setItem(PANEL_KEY, JSON.stringify(panelState)); } catch (err) { /* 무시 */ }
    }

    panel.querySelectorAll('[data-panel]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const what = btn.dataset.panel;
        if (what === 'collapse') panelState.collapsed = !panelState.collapsed;
        else panelState = { dock: what, collapsed: panelState.collapsed };
        placePanel(panelState);
        savePanelState();
      });
    });

    let panelDrag = null;
    head.addEventListener('pointerdown', (e) => {
      if (e.button !== 0 || e.target.closest('.fpl-ico')) return;
      const r = panel.getBoundingClientRect();
      panelDrag = { dx: e.clientX - r.left, dy: e.clientY - r.top };
      head.setPointerCapture(e.pointerId);
      e.preventDefault();
    });
    head.addEventListener('pointermove', (e) => {
      if (!panelDrag) return;
      panelState = {
        dock: null, collapsed: panelState.collapsed,
        left: e.clientX - panelDrag.dx, top: e.clientY - panelDrag.dy,
      };
      placePanel(panelState);
    });
    head.addEventListener('pointerup', () => {
      if (!panelDrag) return;
      panelDrag = null;
      savePanelState();
    });
    window.addEventListener('resize', () => { if (editing) placePanel(panelState); });

    // ---- 페이지 위 직접 편집 (캡처 단계에서 원래 동작 차단) ----
    const inEditorUi = (t) => t.closest && (t.closest('#fpl-panel') || t.closest('#fpl-toggle'));
    let drag = null;

    // 투명 배경 이미지(data-layer-alpha-pick)는 실제 그림이 있는 픽셀만 선택되도록 판정
    const alphaCache = new Map();
    function isTransparentAt(layer, x, y) {
      const img = layer.tagName === 'IMG' ? layer : layer.querySelector('img');
      if (!img || !img.complete || !img.naturalWidth) return false;
      const r = img.getBoundingClientRect();
      if (x < r.left || x > r.right || y < r.top || y > r.bottom) return true;
      let data = alphaCache.get(img.currentSrc || img.src);
      if (!data) {
        try {
          const c = document.createElement('canvas');
          c.width = img.naturalWidth;
          c.height = img.naturalHeight;
          const ctx = c.getContext('2d', { willReadFrequently: true });
          ctx.drawImage(img, 0, 0);
          data = { w: c.width, h: c.height, px: ctx.getImageData(0, 0, c.width, c.height).data };
          alphaCache.set(img.currentSrc || img.src, data);
        } catch (err) {
          return false;
        }
      }
      const px = Math.min(data.w - 1, Math.max(0, Math.floor(((x - r.left) / r.width) * data.w)));
      const py = Math.min(data.h - 1, Math.max(0, Math.floor(((y - r.top) / r.height) * data.h)));
      return data.px[(py * data.w + px) * 4 + 3] < 24;
    }

    // 클릭 위치에서 가장 위에 보이는 레이어 찾기 (투명 부분은 아래 레이어로 통과)
    function pickLayer(x, y) {
      const seen = new Set();
      for (const t of document.elementsFromPoint(x, y)) {
        if (!modal.contains(t)) continue;
        const layer = t.closest('[data-layer]');
        if (!layer || seen.has(layer)) continue;
        seen.add(layer);
        if (layer.hasAttribute('data-layer-alpha-pick') && isTransparentAt(layer, x, y)) continue;
        return layer;
      }
      return null;
    }

    document.addEventListener('pointerdown', (e) => {
      if (!editing || e.button !== 0) return;
      const t = e.target;
      if (inEditorUi(t)) return;

      // 크기 조절 핸들
      if (t.closest('#fpl-box .handle') && selectedId) {
        e.preventDefault();
        e.stopPropagation();
        const el = layerEl(selectedId);
        const r = el.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        drag = {
          mode: 'scale', id: selectedId, before: snapshot(), cx, cy,
          d0: Math.max(4, Math.hypot(e.clientX - cx, e.clientY - cy)), s0: getData(selectedId).s || 1,
        };
        return;
      }

      if (!modal.contains(t)) return;
      e.preventDefault();
      e.stopPropagation();

      let el = pickLayer(e.clientX, e.clientY);
      if (el && e.altKey) {
        const base = selectedId && layerEl(selectedId) && layerEl(selectedId).contains(t) ? layerEl(selectedId) : el;
        const p = base.parentElement ? base.parentElement.closest('[data-layer]') : null;
        if (p && modal.contains(p)) el = p;
      }
      if (!el) {
        select(null);
        return;
      }
      const id = el.getAttribute('data-layer');
      select(id);
      const d = getData(id);
      drag = {
        mode: 'move', id, before: snapshot(), sx: e.clientX, sy: e.clientY,
        x0: d.x || 0, y0: d.y || 0, k: (unit() || 1000) * ancestorScale(el), moved: false,
      };
    }, true);

    window.addEventListener('pointermove', (e) => {
      if (!editing) return;
      if (drag) {
        if (drag.mode === 'move') {
          const dx = e.clientX - drag.sx;
          const dy = e.clientY - drag.sy;
          if (!drag.moved && Math.hypot(dx, dy) < 3) return;
          drag.moved = true;
          document.body.classList.add('fpl-dragging'); // 드래그 중 패널을 투명하게
          setData(drag.id, { x: drag.x0 + dx / drag.k, y: drag.y0 + dy / drag.k });
        } else {
          document.body.classList.add('fpl-dragging');
          const d = Math.hypot(e.clientX - drag.cx, e.clientY - drag.cy);
          setData(drag.id, { s: Math.min(5, Math.max(0.1, drag.s0 * (d / drag.d0))) });
        }
        apply();
        return;
      }
      const t = e.target;
      const el = t && t.closest && !inEditorUi(t) && modal.contains(t) ? pickLayer(e.clientX, e.clientY) : null;
      hoverId = el ? el.getAttribute('data-layer') : null;
    }, true);

    window.addEventListener('pointerup', () => {
      if (!drag) return;
      const before = drag.before;
      drag = null;
      document.body.classList.remove('fpl-dragging');
      commit(before);
    }, true);

    // 편집 중 클릭으로 영상 재생 · 버튼 알림 · 모달 닫기 등이 실행되지 않도록 차단
    ['click', 'dblclick', 'auxclick', 'contextmenu'].forEach((type) => {
      document.addEventListener(type, (e) => {
        if (!editing || inEditorUi(e.target)) return;
        if (modal.contains(e.target) || e.target.closest('#fpl-box')) {
          e.preventDefault();
          e.stopImmediatePropagation();
        }
      }, true);
    });

    // 키보드
    window.addEventListener('keydown', (e) => {
      if (!editing) return;
      const tag = (e.target.tagName || '').toLowerCase();
      if (tag === 'input' || tag === 'textarea') return;
      const ctrl = e.ctrlKey || e.metaKey;
      const key = e.key;
      let handled = true;

      if (ctrl && (key === 's' || key === 'S')) save();
      else if (ctrl && !e.shiftKey && (key === 'z' || key === 'Z')) undo();
      else if (ctrl && (key === 'y' || key === 'Y' || (e.shiftKey && (key === 'z' || key === 'Z')))) redo();
      else if (key === 'Escape') select(null);
      else if (!selectedId) handled = key.startsWith('Arrow'); // 선택이 없어도 화살표로 선수 넘김 방지
      else if (key.startsWith('Arrow')) {
        const step = (e.shiftKey ? 10 : 1) / (unit() || 1000);
        const d = getData(selectedId);
        const dx = key === 'ArrowLeft' ? -step : key === 'ArrowRight' ? step : 0;
        const dy = key === 'ArrowUp' ? -step : key === 'ArrowDown' ? step : 0;
        change(selectedId, { x: (d.x || 0) + dx, y: (d.y || 0) + dy });
      } else if (key === '[' || key === ']') {
        const s = getData(selectedId).s || 1;
        change(selectedId, { s: Math.min(5, Math.max(0.1, s + (key === ']' ? 0.05 : -0.05))) });
      } else if (key === 'Delete' || key === 'Backspace') {
        change(selectedId, { hidden: true });
      } else handled = false;

      if (handled) {
        e.preventDefault();
        e.stopImmediatePropagation();
      }
    }, true);

    window.addEventListener('beforeunload', (e) => {
      if (isDirty()) {
        e.preventDefault();
        e.returnValue = '';
      }
    });

    // 모달이 닫히면 편집 종료
    new MutationObserver(() => {
      if (editing && !modal.classList.contains('active')) setEditing(false);
    }).observe(modal, { attributes: true, attributeFilter: ['class'] });

    return {
      refresh,
      markSaved() { savedSnapshot = snapshot(); refresh(); },
    };
  }

  if (IS_LOCAL) editor = createEditor();

  loadLayout().then(() => { if (editor) editor.markSaved(); });
})();
