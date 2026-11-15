/* 모바일 "맨 위로" 버튼 (mobile-top.js)
 * - 900px 이하(폰·세로 태블릿)에서만 보인다. 위치: 화면 오른쪽 아래, STORE 상세 창의 장바구니 바로가기 버튼 바로 위(mobile.css).
 * - 조금 스크롤하면 나타나고 계속 유지된다(스크롤을 멈춰도 사라지지 않음).
 * - 지금 스크롤되는 화면 기준으로 맨 위로 올린다: 페이지 / STORE 상세 창 / SERVICES 상세 창 / 선수 상세 창.
 * - 팝업(장바구니 서랍, 결제 창, 최종 확인 팝업, 주문 내역, 코치 소개 팝업)이 떠 있는 동안은 숨긴다.
 */
(function () {
  'use strict';

  var btn = document.getElementById('mobileTopBtn');
  if (!btn) return;

  var SHOW_AFTER = 240;                 // 이만큼 내려오면 버튼을 보여 준다(px)
  var mq = window.matchMedia('(max-width: 900px)');

  function byId(id) { return document.getElementById(id); }
  function isActive(el) { return !!(el && el.classList.contains('active')); }

  // 지금 실제로 스크롤되는 요소
  function scroller() {
    var store = byId('storeModal');
    var svc = byId('svcModal');
    var player = byId('playerModal');
    if (isActive(store)) return store;
    if (isActive(svc) && !svc.classList.contains('is-popup')) return svc;
    if (isActive(player)) return player;
    return window;
  }
  function scrollTopOf(el) {
    return el === window ? (window.pageYOffset || document.documentElement.scrollTop || 0) : el.scrollTop;
  }

  // 팝업이 떠 있는지
  function popupOpen() {
    var b = document.body.classList;
    if (b.contains('cart-open') || b.contains('checkout-open') || b.contains('orders-open')) return true;
    var svc = byId('svcModal');
    if (isActive(svc) && svc.classList.contains('is-popup')) return true;   // 코치 소개 팝업
    if (document.getElementById('coPop')) return true;                       // 결제 최종 확인 팝업
    return false;
  }

  function update() {
    var show = mq.matches && !popupOpen() && scrollTopOf(scroller()) > SHOW_AFTER;
    if (btn.hidden === show) btn.hidden = !show;
  }

  btn.addEventListener('click', function () {
    var s = scroller();
    try {
      if (s === window) window.scrollTo({ top: 0, behavior: 'smooth' });
      else s.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (e) {
      if (s === window) window.scrollTo(0, 0);
      else s.scrollTop = 0;
    }
  });

  // 스크롤 이벤트(페이지·각 창)와 창 열림/닫힘을 한꺼번에 따라가도록 짧은 주기로 확인한다(가벼운 계산만 함)
  window.addEventListener('scroll', update, { passive: true });
  ['storeModal', 'svcModal', 'playerModal'].forEach(function (id) {
    var el = byId(id);
    if (el) el.addEventListener('scroll', update, { passive: true });
  });
  window.addEventListener('resize', update);
  setInterval(update, 250);
  update();
})();
