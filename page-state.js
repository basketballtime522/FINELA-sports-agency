/* 새로고침해도 보던 화면 유지 (page-state.js)
 * - 보던 구역(HOME/ROSTER/SERVICES/STORE/PARTNERS/CONTACT), 열려 있던 상세 창
 *   (선수 · SERVICES · STORE 카테고리/상품), 장바구니 서랍 열림 여부를 sessionStorage 에 저장했다가
 *   새로고침 직후 복원한다. 탭(창)별로 따로 저장되고, 새 탭으로 열면 평소처럼 맨 위에서 시작한다.
 * - 장바구니 내용 자체는 main.js 가 localStorage 에 저장한다.
 * - 결제 창은 복원하지 않는다(입력 중이던 정보가 사라지므로 장바구니 서랍까지만 복원).
 * 반드시 main.js · services-detail.js · store-ring.js 뒤에 로드한다.
 */
(function () {
  'use strict';

  var KEY = 'finela.view.v1';
  var ready = false;        // init 이 끝나기 전에는 저장하지 않는다(덮어쓰기 방지)
  var userMoved = false;    // 복원 중 사용자가 직접 스크롤하면 위치 보정을 멈춘다
  var settleUntil = 0;      // 복원 직후 이 시각까지는 스크롤 위치가 아직 흔들릴 수 있다
  var settleSection = null; //   → 그동안은 복원 대상 구역을 그대로 저장한다
  var saveTimer = null;

  function read() {
    try { return JSON.parse(sessionStorage.getItem(KEY) || 'null'); } catch (e) { return null; }
  }
  function write(s) {
    try { sessionStorage.setItem(KEY, JSON.stringify(s)); } catch (e) { /* 저장 불가 환경 */ }
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
    // 맨 아래(푸터)까지 내려온 경우는 마지막 구역으로 본다
    return best ? best.id : null;
  }

  function snapshot() {
    var P = window.FinelaPlayer, S = window.FinelaServices, ST = window.FinelaStore, C = window.FinelaCart;
    var pIdx = P ? P.current() : -1;
    var activeTab = document.querySelector('.svc-tab-btn.active');
    var svcTab = activeTab ? activeTab.getAttribute('data-tab') : null;
    var holdSection =settleSection && !userMoved && Date.now() < settleUntil;
    return {
      section: holdSection ? settleSection : currentSection(),
      svcTab: svcTab,
      player: pIdx >= 0 ? pIdx : null,
      services: S ? S.state() : null,
      store: ST ? ST.state() : null,
      cartOpen: !!(C && C.isOpen && C.isOpen())
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
    }

    // 복원 직후부터 바로 저장한다. (예전에는 1.5초 동안 저장을 막아서, 그 사이에 상품을 열고
    // 새로고침하면 이전 화면(카테고리 목록)으로 돌아갔다.)
    ready = true;
    save();
  }

  function init() {
    try { history.scrollRestoration = 'manual'; } catch (e) {}

    ['wheel', 'touchstart', 'keydown', 'mousedown'].forEach(function (ev) {
      window.addEventListener(ev, function () { userMoved = true; }, { passive: true, once: true });
    });

    window.addEventListener('scroll', saveSoon, { passive: true });
    document.addEventListener('click', saveSoon, true);
    document.addEventListener('keyup', saveSoon, true);
    window.addEventListener('pagehide', save);
    window.addEventListener('beforeunload', save);
    document.addEventListener('visibilitychange', function () {
      if (document.visibilityState === 'hidden') save();
    });

    restore();
  }

  // main.js 등의 DOMContentLoaded 처리(창구 생성)가 끝난 뒤에 실행되도록, 마지막에 등록한 리스너로 시작한다.
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
