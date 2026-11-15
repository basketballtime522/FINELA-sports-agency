/* 보던 화면 유지 + 뒤로/앞으로 가기 (page-state.js)
 *
 * [1] 새로고침해도 유지 — 보던 구역(HOME/ROSTER/SERVICES/STORE/PARTNERS/CONTACT/푸터), 열려 있던 상세 창
 *     (선수 · SERVICES · STORE 카테고리/상품), SERVICES 탭, 장바구니 서랍·결제 창·주문 내역 창을 sessionStorage 에
 *     저장했다가 새로고침 직후 복원한다. 탭(창)별로 따로 저장되고, 새 탭으로 열면 평소처럼 맨 위에서 시작한다.
 *     장바구니 내용 자체는 main.js 가 localStorage 에 저장한다.
 *
 * [2] 뒤로/앞으로 가기 — 사이트는 한 페이지짜리라 브라우저 기록이 쌓이지 않아 뒤로 가기를 눌러도 아무 변화가 없었다.
 *     이제 "화면이 바뀌는 순간"마다 History API 로 기록을 쌓고, popstate 때 그 화면을 다시 만들어 준다.
 *       - 상단 메뉴·도트·버튼 등 #구역 링크로 구역을 옮길 때  → 기록 추가
 *       - 상세 창/서랍/결제 창을 열 때                       → 기록 추가
 *       - 그 창을 UI(X, ESC 등)로 닫을 때                     → 한 칸 뒤로(history.back) — 기록이 쌓이지 않음
 *       - 선수 넘기기·카테고리 넘기기처럼 같은 창 안의 이동   → 기록 교체(쌓지 않음)
 *     기록 하나에 { i: 번호, section: 구역, ov: 열려 있는 창들 } 을 넣어 둔다.
 *
 * 반드시 main.js · services-detail.js · store-ring.js · checkout.js · orders.js 뒤에 로드한다.
 */
(function () {
  'use strict';

  var KEY = 'finela.view.v1';
  var HKEY = 'finela.hist.v1';

  var ready = false;        // init 이 끝나기 전에는 저장하지 않는다(덮어쓰기 방지)
  var userMoved = false;    // 복원 중 사용자가 직접 스크롤하면 위치 보정을 멈춘다
  var settleUntil = 0;      // 복원 직후 이 시각까지는 스크롤 위치가 아직 흔들릴 수 있다
  var settleSection = null; //   → 그동안은 복원 대상 구역을 그대로 저장한다
  var saveTimer = null;

  // 히스토리 상태
  var idx = 0;              // 현재 기록 번호
  var parts = [];           // parts[i] = i번 기록의 "열린 창 목록" 키(JSON). 닫기 → 뒤로 가기 판단용
  var applying = false;     // popstate 를 화면에 반영하는 중(그동안은 기록을 쌓지 않는다)
  var backPending = false;  // history.back() 을 불렀고 popstate 가 아직 안 온 상태
  var pendingNav = null;    // 방금 #링크를 눌러 이동 중인 구역 id
  var checkTimer = null;
  var scrollTimer = null;

  function read() {
    try { return JSON.parse(sessionStorage.getItem(KEY) || 'null'); } catch (e) { return null; }
  }
  function write(s) {
    try { sessionStorage.setItem(KEY, JSON.stringify(s)); } catch (e) { /* 저장 불가 환경 */ }
  }
  function saveParts() {
    try { sessionStorage.setItem(HKEY, JSON.stringify(parts)); } catch (e) {}
  }

  // 화면에 가장 많이 보이는(= 맨 위가 걸쳐 있는) 구역 id
  function currentSection() {
    var secs = document.querySelectorAll('section[id], footer[id]');
    var best = null, bestVis = -1, vh = window.innerHeight;
    secs.forEach(function (s) {
      var r = s.getBoundingClientRect();
      var vis = Math.min(r.bottom, vh) - Math.max(r.top, 0);
      if (vis > bestVis) { bestVis = vis; best = s; }
    });
    return best ? best.id : null;
  }

  // 지금 열려 있는 창들
  function ovPart() {
    var P = window.FinelaPlayer, S = window.FinelaServices, ST = window.FinelaStore, C = window.FinelaCart;
    var CO = window.FinelaCheckout, O = window.FinelaOrders;
    var p = P ? P.current() : -1;
    return {
      player: p >= 0 ? p : null,
      services: S ? S.state() : null,
      store: ST ? ST.state() : null,
      cart: !!(C && C.isOpen && C.isOpen()),
      checkout: !!(CO && CO.isOpen && CO.isOpen()),
      orders: !!(O && O.isOpen && O.isOpen())
    };
  }
  function keyOf(ov) { return JSON.stringify(ov); }

  function snapshot() {
    var activeTab = document.querySelector('.svc-tab-btn.active');
    var svcTab = activeTab ? activeTab.getAttribute('data-tab') : null;
    var holdSection = settleSection && !userMoved && Date.now() < settleUntil;
    var ov = ovPart();
    return {
      section: holdSection ? settleSection : currentSection(),
      svcTab: svcTab,
      player: ov.player,
      services: ov.services,
      store: ov.store,
      cartOpen: ov.cart,
      checkoutOpen: ov.checkout,
      ordersOpen: ov.orders
    };
  }

  function save() {
    if (!ready) return;
    write(snapshot());
  }
  function saveSoon() {
    if (!ready) return;
    clearTimeout(saveTimer);
    saveTimer = setTimeout(save, 150);
  }

  function instant(fn) {
    var de = document.documentElement;
    var prev = de.style.scrollBehavior;
    de.style.scrollBehavior = 'auto';   // CSS 의 smooth 때문에 천천히 가면 새로고침 직후 위치가 틀어진다
    try { fn(); } finally { de.style.scrollBehavior = prev; }
  }

  function goSection(id) {
    var el = id && document.getElementById(id);
    if (!el || userMoved) return;
    instant(function () { el.scrollIntoView({ behavior: 'auto', block: 'start' }); });
  }
  // 뒤로/앞으로 가기용 (사용자가 이미 스크롤했어도 무조건 이동)
  function forceSection(id) {
    var el = id && document.getElementById(id);
    if (!el) return;
    instant(function () { el.scrollIntoView({ behavior: 'auto', block: 'start' }); });
  }

  // ───────────────────────── 히스토리 ─────────────────────────
  function urlFor(sec) {
    return location.pathname + location.search + (sec && sec !== 'hero' ? '#' + sec : '');
  }
  function pushEntry(sec, ov) {
    parts.length = idx + 1;      // 앞으로 가기 목록은 버린다(일반 브라우저와 같은 동작)
    idx += 1;
    parts[idx] = keyOf(ov);
    saveParts();
    try { history.pushState({ i: idx, section: sec, ov: ov }, '', urlFor(sec)); } catch (e) {}
  }
  function replaceEntry(sec, ov) {
    parts[idx] = keyOf(ov);
    saveParts();
    try { history.replaceState({ i: idx, section: sec, ov: ov }, '', urlFor(sec)); } catch (e) {}
  }

  function same(a, b) { return JSON.stringify(a) === JSON.stringify(b); }

  // 같은 창 안의 이동(선수 넘기기, 카테고리 넘기기, 코치 넘기기)인지 → 기록을 쌓지 않고 교체
  function isRefine(a, b) {
    var fields = ['player', 'services', 'store', 'cart', 'checkout', 'orders'];
    var diff = fields.filter(function (f) { return !same(a[f], b[f]); });
    if (diff.length !== 1) return false;
    var f = diff[0];
    if (f === 'player') return a.player != null && b.player != null;
    if (f === 'services') return !!(a.services && b.services && a.services.type === b.services.type);
    if (f === 'store') {
      if (!a.store || !b.store) return false;
      // 카테고리 목록 → 상품 상세로 들어가는 것은 한 단계 깊어지는 것이므로 기록을 쌓는다
      if (a.store.prod == null && b.store.prod != null && a.store.cat === b.store.cat) return false;
      return true;
    }
    return false;
  }

  // 화면이 바뀌었는지 확인해서 기록을 쌓는다
  function checkState() {
    if (!ready || applying || backPending) return;
    var ov = ovPart();
    var k = keyOf(ov);
    var cur = history.state || {};
    var curOv = cur.ov || {};
    var navigated = !!(pendingNav && pendingNav !== cur.section);
    var sec = pendingNav || currentSection();

    if (k === parts[idx]) {
      if (navigated) pushEntry(pendingNav, ov);     // 창 변화 없이 구역만 이동
      pendingNav = null;
      return;
    }
    if (!navigated && idx > 0 && parts[idx - 1] === k) {
      // 창을 닫아서 바로 앞 기록의 화면과 같아졌다 → 기록을 쌓지 말고 한 칸 뒤로
      pendingNav = null;
      backPending = true;
      setTimeout(function () { backPending = false; }, 600);   // popstate 가 안 오면 풀어 준다
      history.back();
      return;
    }
    if (!navigated && isRefine(curOv, ov)) replaceEntry(sec, ov);
    else pushEntry(sec, ov);
    pendingNav = null;
  }
  function checkSoon() {
    if (!ready) return;
    clearTimeout(checkTimer);
    checkTimer = setTimeout(checkState, 170);
  }

  // 기록의 화면을 실제로 만들어 준다
  function applyState(st) {
    var ov = st.ov || {};
    applying = true;
    try {
      var CO = window.FinelaCheckout, O = window.FinelaOrders, C = window.FinelaCart;
      var cur = ovPart();

      // 1) 닫아야 할 것부터 (위에 있는 창 → 아래 창 순서)
      if (!ov.checkout && cur.checkout && CO) CO.close();
      if (!ov.orders && cur.orders && O) O.close();
      if (!ov.cart && cur.cart && C) C.closeDrawer();
      if (ov.player == null && cur.player != null && window.FinelaPlayer) window.FinelaPlayer.close();
      if (!ov.services && cur.services && window.FinelaServices) window.FinelaServices.close();
      if (!ov.store && cur.store && window.FinelaStore) window.FinelaStore.close();

      // 2) 열어야 할 것 (아래 창 → 위 창 순서)
      if (ov.player != null && cur.player !== ov.player && window.FinelaPlayer) window.FinelaPlayer.open(ov.player);
      if (ov.services && !same(cur.services, ov.services) && window.FinelaServices) window.FinelaServices.restore(ov.services);
      if (ov.store && !same(cur.store, ov.store) && window.FinelaStore) window.FinelaStore.restore(ov.store);
      if (ov.cart && !cur.cart && C && C.openDrawer) C.openDrawer();
      if (ov.orders && !cur.orders && O) O.open();
      if (ov.checkout && !cur.checkout && CO) CO.open();

      // 3) 구역 위치
      forceSection(st.section);
    } catch (e) { /* 일부만 복원돼도 계속 */ }
    idx = typeof st.i === 'number' ? st.i : idx;
    parts[idx] = keyOf(ov);
    saveParts();
    setTimeout(function () { applying = false; save(); }, 80);
  }

  function initHistory() {
    try { parts = JSON.parse(sessionStorage.getItem(HKEY) || '[]'); } catch (e) { parts = []; }
    if (!Array.isArray(parts)) parts = [];
    var st = history.state;
    idx = (st && typeof st.i === 'number') ? st.i : 0;
    replaceEntry(settleSection || currentSection(), ovPart());

    window.addEventListener('popstate', function (e) {
      backPending = false;
      pendingNav = null;
      if (e.state && e.state.ov) applyState(e.state);
    });

    // #구역 링크: 기본 동작(바로 점프 + 브라우저 기록)을 막고 직접 부드럽게 이동 + 기록을 쌓는다
    document.addEventListener('click', function (e) {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      var a = e.target.closest && e.target.closest('a[href^="#"]');
      if (!a) return;
      var h = a.getAttribute('href');
      if (!h || h.length < 2) return;
      var t = document.getElementById(h.slice(1));
      if (!t) return;
      e.preventDefault();
      pendingNav = t.id;
      t.scrollIntoView({ behavior: 'smooth', block: 'start' });
      checkSoon();
    }, true);

    // 스크롤이 멈추면 현재 기록의 구역을 갱신(기록은 쌓지 않음)
    window.addEventListener('scroll', function () {
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(function () {
        if (!ready || applying || backPending || pendingNav) return;
        var st2 = history.state;
        if (!st2 || !st2.ov) return;
        var sec = currentSection();
        if (sec && sec !== st2.section) {
          try { history.replaceState({ i: st2.i, section: sec, ov: st2.ov }, '', urlFor(sec)); } catch (e) {}
        }
      }, 260);
    }, { passive: true });
  }

  // ───────────────────────── 복원(새로고침) ─────────────────────────
  function restore() {
    var s = read();
    var target = (s && s.section) || (location.hash && location.hash.slice(1)) || null;

    // 1) 구역 위치: 폰트·이미지 때문에 높이가 늦게 바뀌므로 몇 차례 다시 맞춘다
    settleSection = target || null;
    settleUntil = Date.now() + 1500;
    if (target && target !== 'hero') {
      goSection(target);
      [150, 500, 1200].forEach(function (ms) { setTimeout(function () { goSection(target); }, ms); });
    }

    // 2) 열려 있던 상세 창 · 장바구니 서랍 (각각 try — 하나가 실패해도 나머지는 복원)
    if (s) {
      // SERVICES 탭(트레이닝/숙소/매니지먼트) — 상세 창을 닫았을 때 보이는 탭이므로 먼저 맞춘다
      try {
        var tabBtn = s.svcTab && document.querySelector('.svc-tab-btn[data-tab="' + s.svcTab + '"]');
        if (tabBtn && !tabBtn.classList.contains('active')) tabBtn.click();
      } catch (e) {}
      try { if (s.player != null && window.FinelaPlayer) window.FinelaPlayer.open(s.player); } catch (e) {}
      try { if (s.services && window.FinelaServices) window.FinelaServices.restore(s.services); } catch (e) {}
      try { if (s.store && window.FinelaStore) window.FinelaStore.restore(s.store); } catch (e) {}
      try {
        if (s.cartOpen && window.FinelaCart && window.FinelaCart.openDrawer) window.FinelaCart.openDrawer();
      } catch (e) {}
      try { if (s.ordersOpen && window.FinelaOrders) window.FinelaOrders.open(); } catch (e) {}
      // 결제 창은 입력 중이던 정보가 사라지므로 새로고침 때는 장바구니 서랍까지만 복원한다
    }

    // 복원 직후부터 바로 저장한다.
    ready = true;
    save();
  }

  function init() {
    try { history.scrollRestoration = 'manual'; } catch (e) {}

    ['wheel', 'touchstart', 'keydown', 'mousedown'].forEach(function (ev) {
      window.addEventListener(ev, function () { userMoved = true; }, { passive: true, once: true });
    });

    window.addEventListener('scroll', saveSoon, { passive: true });
    document.addEventListener('click', function () { saveSoon(); checkSoon(); }, true);
    document.addEventListener('keyup', function () { saveSoon(); checkSoon(); }, true);
    window.addEventListener('pagehide', save);
    window.addEventListener('beforeunload', save);
    document.addEventListener('visibilitychange', function () {
      if (document.visibilityState === 'hidden') save();
    });

    restore();
    initHistory();
  }

  // main.js 등의 DOMContentLoaded 처리(창구 생성)가 끝난 뒤에 실행되도록, 마지막에 등록한 리스너로 시작한다.
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
