/* FINELA 가상 주문 내역 (ORDERS)
 * - 결제 창(checkout.js)에서 주문이 확정되면 add() 로 저장 → 주문 내역 창에서 목록 · 배송 조회 · 환불 요청.
 * - 전부 시뮬레이션이다. 배송 단계는 "주문 후 경과 시간"으로 자동 진행된다(데모 속도: 1분마다 다음 단계).
 * - 저장: localStorage('finela.orders.v1'). 새로고침해도 남는다.
 * - 열기 진입점: 장바구니 서랍 위쪽 "주문 내역" 버튼, 결제 완료 화면의 "주문 내역 · 배송 조회" 버튼.
 */
(function () {
  'use strict';

  var KEY = 'finela.orders.v1';
  var STEP_MS = 60 * 1000;                       // 데모: 1분마다 다음 배송 단계
  var REFUND_DONE_MS = 60 * 1000;                // 데모: 환불 요청 1분 뒤 환불 완료
  var RETURN_WINDOW_MS = 7 * 24 * 60 * 60 * 1000; // 배송 완료 후 7일 이내 환불 가능(상품 상세 안내문과 동일)
  var DELIVERY_STEPS = [
    { key: 'paid', label: '결제 완료', icon: 'fa-regular fa-credit-card' },
    { key: 'preparing', label: '상품 준비 중', icon: 'fa-solid fa-box-open' },
    { key: 'shipping', label: '배송 중', icon: 'fa-solid fa-truck-fast' },
    { key: 'delivered', label: '배송 완료', icon: 'fa-solid fa-house-circle-check' }
  ];
  var REASONS = ['단순 변심', '상품 불량·파손', '다른 상품이 배송됨', '배송 지연', '기타'];

  var root = null;
  var lastFocus = null;
  var expanded = {};       // { 주문번호: 'track' | 'refund' }  펼쳐 둔 패널
  var tickTimer = null;
  var lastSig = '';

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function won(n) { return '₩' + Number(n || 0).toLocaleString(); }
  function pad(n) { return String(n).padStart(2, '0'); }
  function fmt(ts) {
    var d = new Date(ts);
    return d.getFullYear() + '.' + pad(d.getMonth() + 1) + '.' + pad(d.getDate()) + ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes());
  }
  function fmtSec(ts) {
    var d = new Date(ts);
    return fmt(ts) + ':' + pad(d.getSeconds());
  }

  // ───────────────────────── 저장 ─────────────────────────
  function load() {
    try {
      var raw = JSON.parse(localStorage.getItem(KEY) || '[]');
      return Array.isArray(raw) ? raw.filter(function (o) { return o && o.no && o.items; }) : [];
    } catch (e) { return []; }
  }
  var orders = load();
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(orders)); } catch (e) {}
    try { window.dispatchEvent(new CustomEvent('finela:orders')); } catch (e) {}
  }
  function trackingNo(o) {
    // 주문번호에서 항상 같은 값이 나오는 가상 운송장 번호
    var n = 0;
    for (var i = 0; i < o.no.length; i++) n = (n * 31 + o.no.charCodeAt(i)) % 1000000007;
    return '88' + String(n).padStart(9, '0') + String(o.ts % 1000).padStart(3, '0');
  }

  // ───────────────────────── 상태 계산 ─────────────────────────
  // 반환: { key, label, step(0~3, 환불이면 -1), badge }
  function statusOf(o, now) {
    if (o.refund) {
      var done = now - o.refund.ts >= REFUND_DONE_MS;
      return done
        ? { key: 'refunded', label: '환불 완료', step: -1 }
        : { key: 'refund-req', label: '환불 요청 접수', step: -1 };
    }
    var step = Math.min(3, Math.floor((now - o.ts) / STEP_MS));
    return { key: DELIVERY_STEPS[step].key, label: DELIVERY_STEPS[step].label, step: step };
  }
  function refundInfo(o, now) {
    var st = statusOf(o, now);
    if (o.refund) return { ok: false, label: '', note: '' };
    if (st.key === 'delivered') {
      var deliveredAt = o.ts + 3 * STEP_MS;
      if (now - deliveredAt > RETURN_WINDOW_MS) {
        return { ok: false, label: '', note: '수령 후 7일이 지나 환불 요청이 불가합니다.' };
      }
      return { ok: true, label: '반품 · 환불 요청', note: '' };
    }
    if (st.key === 'shipping') return { ok: true, label: '반품 · 환불 요청', note: '' };
    return { ok: true, label: '주문 취소 · 환불', note: '' };
  }

  // ───────────────────────── 화면 ─────────────────────────
  function build() {
    root = document.createElement('div');
    root.className = 'co-root or-root';
    root.id = 'ordersRoot';
    root.setAttribute('role', 'dialog');
    root.setAttribute('aria-modal', 'true');
    root.setAttribute('aria-label', '주문 내역');
    root.innerHTML =
      '<div class="co-panel">' +
        '<header class="co-head">' +
          '<h2 class="co-title"><i class="fa-solid fa-receipt"></i> ORDER HISTORY</h2>' +
          '<button type="button" class="co-close" data-or-close aria-label="주문 내역 닫기">&times;</button>' +
        '</header>' +
        '<div class="co-body or-body" id="orBody"></div>' +
      '</div>';
    document.body.appendChild(root);

    root.addEventListener('click', function (e) {
      var t = e.target;
      var goto = t.closest('[data-or-goto]');
      if (goto) return gotoProduct(Number(goto.getAttribute('data-or-goto')));
      var tog = t.closest('[data-or-toggle]');
      if (tog) {
        var no = tog.getAttribute('data-or-no');
        var kind = tog.getAttribute('data-or-toggle');
        expanded[no] = expanded[no] === kind ? null : kind;
        return render(true);
      }
      var sub = t.closest('[data-or-refund-submit]');
      if (sub) return submitRefund(sub.getAttribute('data-or-no'));
      if (t.closest('[data-or-shop]')) return close();
      if (t.closest('[data-or-close]')) return close();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && root.classList.contains('active')) {
        e.stopImmediatePropagation();
        close();
      }
    }, true);
  }

  function orderHtml(o, now) {
    var st = statusOf(o, now);
    var rf = refundInfo(o, now);
    var open = expanded[o.no];
    var items = o.items.map(function (it) {
      var img = it.image ? '<img src="' + esc(it.image) + '" alt="" class="co-item-img">'
                         : '<div class="co-item-img co-item-ph"><i class="fa-regular fa-image"></i></div>';
      return '<li class="co-item">' +
        '<button type="button" class="co-item-imgbtn" data-or-goto="' + it.id + '" tabindex="-1" aria-hidden="true">' + img + '</button>' +
        '<div class="co-item-info">' +
          '<button type="button" class="co-item-name co-item-link" data-or-goto="' + it.id + '" title="상품 상세 보기">' + esc(it.title) +
            (it.size ? ' <span class="co-item-size">(' + esc(it.size) + ')</span>' : '') + '</button>' +
          '<div class="co-item-qty">수량 ' + it.qty + '</div>' +
        '</div>' +
        '<div class="co-item-price">' + won(it.price * it.qty) + '</div></li>';
    }).join('');

    var actions =
      '<button type="button" class="or-btn' + (open === 'track' ? ' is-on' : '') + '" data-or-toggle="track" data-or-no="' + esc(o.no) + '"><i class="fa-solid fa-truck-fast"></i> 배송 조회</button>';
    if (rf.ok) {
      actions += '<button type="button" class="or-btn or-btn-refund' + (open === 'refund' ? ' is-on' : '') + '" data-or-toggle="refund" data-or-no="' + esc(o.no) + '"><i class="fa-solid fa-rotate-left"></i> ' + rf.label + '</button>';
    }

    var panel = '';
    if (open === 'track') panel = trackHtml(o, st, now);
    else if (open === 'refund' && rf.ok) panel = refundFormHtml(o);

    var refundNote = '';
    if (o.refund) {
      var done = st.key === 'refunded';
      refundNote = '<div class="or-refund-note ' + (done ? 'is-done' : '') + '">' +
        '<i class="fa-solid ' + (done ? 'fa-circle-check' : 'fa-hourglass-half') + '"></i> ' +
        (done
          ? '환불이 완료되었습니다. 환불 금액 <b>' + won(o.total) + '</b>'
          : '환불 요청이 접수되었습니다. 확인 후 <b>' + won(o.total) + '</b> 이 환불됩니다. (데모: 약 1분 뒤 환불 완료로 바뀝니다)') +
        '<div class="or-refund-meta">사유: ' + esc(o.refund.reason) + ' · 요청일 ' + fmt(o.refund.ts) + '</div>' +
      '</div>';
    } else if (rf.note) {
      refundNote = '<div class="or-refund-note">' + esc(rf.note) + '</div>';
    }

    return '<article class="or-card" data-status="' + st.key + '">' +
      '<header class="or-card-head">' +
        '<div><div class="or-no">' + esc(o.no) + '</div><div class="or-date">' + fmt(o.ts) + ' 주문 · ' + esc(o.pay) + '</div></div>' +
        '<span class="or-badge or-badge-' + st.key + '">' + st.label + '</span>' +
      '</header>' +
      '<ul class="co-items or-items">' + items + '</ul>' +
      '<div class="or-total"><span>총 결제 금액</span><b>' + won(o.total) + '</b></div>' +
      refundNote +
      '<div class="or-actions">' + actions + '</div>' +
      panel +
    '</article>';
  }

  function trackHtml(o, st, now) {
    var steps = DELIVERY_STEPS.map(function (s, i) {
      var reached = !o.refund && i <= st.step;
      var at = o.ts + i * STEP_MS;
      return '<li class="or-step' + (reached ? ' is-reached' : '') + (!o.refund && i === st.step ? ' is-current' : '') + '">' +
        '<span class="or-step-dot"><i class="' + s.icon + '"></i></span>' +
        '<span class="or-step-label">' + s.label + '</span>' +
        '<span class="or-step-time">' + (reached ? fmtSec(at) : '-') + '</span></li>';
    }).join('');
    var rec = o.receiver || {};
    return '<div class="or-panel">' +
      '<h4>배송 조회</h4>' +
      '<dl class="co-info">' +
        '<div><dt>택배사</dt><dd>FINELA 택배 (가상)</dd></div>' +
        '<div><dt>운송장 번호</dt><dd>' + trackingNo(o) + '</dd></div>' +
        '<div><dt>받는 분</dt><dd>' + esc(rec.name) + ' · ' + esc(rec.phone) + '</dd></div>' +
        '<div><dt>배송지</dt><dd>' + esc(((rec.addr || '') + ' ' + (rec.addr2 || '')).trim()) + '</dd></div>' +
        (rec.memo ? '<div><dt>배송 메모</dt><dd>' + esc(rec.memo) + '</dd></div>' : '') +
      '</dl>' +
      (o.refund
        ? '<p class="co-note"><i class="fa-solid fa-circle-info"></i> 환불이 요청된 주문은 배송이 중단됩니다.</p>'
        : '<ol class="or-steps">' + steps + '</ol>' +
          '<p class="co-note"><i class="fa-solid fa-circle-info"></i> 데모용 가상 배송입니다. 실제 배송은 이루어지지 않으며, 1분마다 다음 단계로 진행됩니다.</p>') +
    '</div>';
  }

  function refundFormHtml(o) {
    var opts = REASONS.map(function (r) { return '<option value="' + esc(r) + '">' + esc(r) + '</option>'; }).join('');
    return '<div class="or-panel">' +
      '<h4>환불 요청</h4>' +
      '<p class="or-refund-help">주문 전체(' + won(o.total) + ')가 환불됩니다. 일부 상품만 환불하는 기능은 아직 지원하지 않습니다.</p>' +
      '<label class="co-field"><span>환불 사유</span><select class="or-reason" data-or-reason="' + esc(o.no) + '">' + opts + '</select></label>' +
      '<button type="button" class="co-submit or-refund-submit" data-or-refund-submit data-or-no="' + esc(o.no) + '">환불 요청하기</button>' +
    '</div>';
  }

  function signature() {
    var now = Date.now();
    return orders.map(function (o) { return o.no + ':' + statusOf(o, now).key; }).join('|') + '#' + JSON.stringify(expanded);
  }

  function render(force) {
    if (!root) return;
    var now = Date.now();
    var sig = signature();
    if (!force && sig === lastSig) return;
    lastSig = sig;
    var body = root.querySelector('#orBody');
    // 환불 사유를 고르는 중이면 선택값이 사라지지 않도록 기억해 두었다가 되돌린다
    var reasonEls = body.querySelectorAll('[data-or-reason]');
    var keep = {};
    reasonEls.forEach(function (el) { keep[el.getAttribute('data-or-reason')] = el.value; });

    if (!orders.length) {
      body.innerHTML =
        '<div class="or-empty">' +
          '<i class="fa-solid fa-receipt"></i>' +
          '<h3>주문 내역이 없습니다</h3>' +
          '<p>결제를 완료하면 이곳에서 주문 내용, 배송 조회, 환불 요청을 할 수 있어요.</p>' +
          '<button type="button" class="co-submit or-empty-btn" data-or-shop>쇼핑하러 가기</button>' +
        '</div>';
      return;
    }
    var sorted = orders.slice().sort(function (a, b) { return b.ts - a.ts; });
    body.innerHTML =
      '<p class="or-intro">총 <b>' + orders.length + '</b>건의 주문 · 이 화면은 가상 시뮬레이션입니다.</p>' +
      '<div class="or-list">' + sorted.map(function (o) { return orderHtml(o, now); }).join('') + '</div>';
    body.querySelectorAll('[data-or-reason]').forEach(function (el) {
      var v = keep[el.getAttribute('data-or-reason')];
      if (v) el.value = v;
    });
  }

  function submitRefund(no) {
    var o = orders.filter(function (x) { return x.no === no; })[0];
    if (!o || o.refund) return;
    var rf = refundInfo(o, Date.now());
    if (!rf.ok) return;
    var sel = root.querySelector('[data-or-reason="' + no + '"]');
    o.refund = { ts: Date.now(), reason: sel ? sel.value : REASONS[0] };
    expanded[no] = null;
    save();
    render(true);
  }

  // 주문 상품 → 상품 상세로 이동
  function gotoProduct(id) {
    close();
    if (window.FinelaCart && window.FinelaCart.closeDrawer) window.FinelaCart.closeDrawer();
    if (window.FinelaStore) window.FinelaStore.restore({ cat: 0, prod: id });
  }

  // ───────────────────────── 열기 / 닫기 / 외부 연결 ─────────────────────────
  function open() {
    if (!root) build();
    orders = load();           // 다른 탭에서 바뀐 내용 반영
    lastFocus = document.activeElement;
    lastSig = '';
    render(true);
    root.classList.add('active');
    document.body.classList.add('orders-open');
    root.querySelector('.co-panel').scrollTop = 0;
    clearInterval(tickTimer);
    tickTimer = setInterval(function () { render(false); }, 3000);   // 배송 단계 자동 갱신
  }

  function close() {
    if (!root) return;
    root.classList.remove('active');
    document.body.classList.remove('orders-open');
    clearInterval(tickTimer);
    if (lastFocus && lastFocus.focus) { try { lastFocus.focus({ preventScroll: true }); } catch (e) {} }
  }

  window.FinelaOrders = {
    open: open,
    close: close,
    isOpen: function () { return !!(root && root.classList.contains('active')); },
    list: function () { return orders.slice(); },
    count: function () { return orders.length; },
    add: function (order) {
      orders = load();
      orders.push(order);
      save();
    }
  };
})();
