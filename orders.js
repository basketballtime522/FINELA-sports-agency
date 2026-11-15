/* FINELA 가상 주문 내역 (ORDERS)
 * - 결제 창(checkout.js)에서 주문이 확정되면 add() 로 저장 → 주문 내역 창에서 목록 · 배송 조회 · 환불 요청.
 * - 전부 시뮬레이션이다. 배송 단계는 "주문 후 경과 시간"으로 자동 진행된다(데모 속도: 10초마다 다음 단계).
 * - 환불은 품목(주문 상품 줄)별로 요청한다. 요청 후 10초 뒤 "환불 완료"로 바뀐다(데모).
 * - 저장: localStorage('finela.orders.v1'). 서버가 없으므로 다른 브라우저·기기·시크릿 창과는 공유되지 않는다.
 * - 자동 삭제: 주문 후 5분(ORDER_TTL_MS)이 지난 주문은 읽을 때·창이 열려 있는 동안 1초마다 삭제한다(주문별 기준).
 * - 배송비: 주문 시점에 order.shipping 으로 저장(상품 5만원 이상 무료, 미만 3,000원). 환불 시 배송비는 모든 품목을 환불할 때 함께 환불.
 * - 열기 진입점: 장바구니 서랍 위쪽 "주문 내역" 버튼, 결제 완료 화면의 "주문 내역 · 배송 조회" 버튼.
 *
 * 주문 데이터: { no, ts, items:[{id,title,size,qty,price,image}], total, pay, receiver, refunds:[{ts, reason, lines:[품목 index]}] }
 */
(function () {
  'use strict';

  var KEY = 'finela.orders.v1';
  var STEP_MS = 10 * 1000;                        // 데모: 10초마다 다음 배송 단계
  var REFUND_DONE_MS = 10 * 1000;                 // 데모: 환불 요청 10초 뒤 환불 완료
  var ORDER_TTL_MS = 5 * 60 * 1000;               // 데모 주문은 "주문 후 5분"이 지나면 자동 삭제(주문별 기준)
  var TTL_NOTICE = '데모 주문은 주문 후 5분이 지나면 자동으로 삭제됩니다.';
  var RETURN_WINDOW_MS = 7 * 24 * 60 * 60 * 1000; // 배송 완료 후 7일 이내 환불 가능(상품 상세 안내문과 동일)
  var RETURN_NOTICE = '배송 완료 후 7일이 지나면 환불을 요청할 수 없습니다.';
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
  function normalize(o) {
    // 예전(주문 전체 환불) 형식 { refund:{ts,reason} } → 모든 품목을 환불한 것으로 변환
    if (o.refund && !o.refunds) {
      o.refunds = [{ ts: o.refund.ts, reason: o.refund.reason, lines: o.items.map(function (_, i) { return i; }) }];
    }
    delete o.refund;
    if (!Array.isArray(o.refunds)) o.refunds = [];
    return o;
  }
  function expired(o, now) { return now - o.ts >= ORDER_TTL_MS; }
  // 저장소에서 읽을 때 5분이 지난 주문은 걸러 내고, 걸러 낸 게 있으면 저장소에서도 지운다
  function load() {
    try {
      var raw = JSON.parse(localStorage.getItem(KEY) || '[]');
      if (!Array.isArray(raw)) return [];
      var all = raw.filter(function (o) { return o && o.no && o.items && o.ts; }).map(normalize);
      var now = Date.now();
      var alive = all.filter(function (o) { return !expired(o, now); });
      if (alive.length !== raw.length) {
        try { localStorage.setItem(KEY, JSON.stringify(alive)); } catch (e) {}
      }
      return alive;
    } catch (e) { return []; }
  }
  var orders = load();
  var purgedWhileOpen = false;   // 창을 열어 둔 사이에 주문이 자동 삭제됐는지(안내 문구용)

  // 창이 열려 있는 동안 1초마다 호출: 5분이 지난 주문을 목록에서 지운다. 지운 게 있으면 true
  function purgeExpired() {
    var now = Date.now();
    var alive = orders.filter(function (o) { return !expired(o, now); });
    if (alive.length === orders.length) return false;
    orders = alive;
    save();
    return true;
  }
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
  // 배송 단계(0~3): 주문 후 경과 시간으로 결정
  function deliveryStep(o, now) {
    return Math.min(3, Math.floor((now - o.ts) / STEP_MS));
  }
  function deliveredAt(o) { return o.ts + 3 * STEP_MS; }

  // 배송비·금액: 배송비는 주문 시점에 확정되어 order.shipping 에 저장된다(예전 주문은 0원)
  function shipOf(o) { return Number(o.shipping) || 0; }
  function lineAmount(o, i) { var it = o.items[i]; return it ? it.price * it.qty : 0; }
  // 환불 요청별 환불 금액. 배송비는 "마지막 품목까지 모두 환불되는 요청"에 함께 환불한다.
  // 반환: [{ amount, withShip }]  (o.refunds 와 같은 순서)
  function refundAmounts(o) {
    var done = {};
    var cnt = 0;
    return o.refunds.map(function (r) {
      var before = cnt;
      var amount = r.lines.reduce(function (a, i) { return a + lineAmount(o, i); }, 0);
      r.lines.forEach(function (i) { if (!done[i]) { done[i] = true; cnt++; } });
      // 이 요청으로 처음 "모든 품목 환불"이 완성되면(이전엔 미완성) 배송비도 함께 환불
      var withShip = before < o.items.length && cnt === o.items.length && shipOf(o) > 0;
      if (withShip) amount += shipOf(o);
      return { amount: amount, withShip: withShip };
    });
  }

  // 품목(줄) i 의 환불 기록 → { ts, reason, done } 또는 null
  function lineRefund(o, i, now) {
    for (var k = 0; k < o.refunds.length; k++) {
      var r = o.refunds[k];
      if (r.lines.indexOf(i) >= 0) return { ts: r.ts, reason: r.reason, done: now - r.ts >= REFUND_DONE_MS };
    }
    return null;
  }
  function refundedLineCount(o) {
    var set = {};
    o.refunds.forEach(function (r) { r.lines.forEach(function (i) { set[i] = true; }); });
    return Object.keys(set).length;
  }

  // 주문 전체 상태: { key, label, step }
  function statusOf(o, now) {
    var n = o.items.length;
    if (n && refundedLineCount(o) === n) {
      var allDone = o.items.every(function (_, i) { var r = lineRefund(o, i, now); return r && r.done; });
      return allDone
        ? { key: 'refunded', label: '환불 완료', step: -1 }
        : { key: 'refund-req', label: '환불 요청 접수', step: -1 };
    }
    var step = deliveryStep(o, now);
    return { key: DELIVERY_STEPS[step].key, label: DELIVERY_STEPS[step].label, step: step };
  }

  // 환불 요청 가능 여부: 아직 환불하지 않은 품목이 있고, (배송 완료라면) 7일 이내
  // 반환: { ok, lines:[요청 가능한 품목 index], label, note }
  function refundInfo(o, now) {
    var lines = [];
    o.items.forEach(function (_, i) { if (!lineRefund(o, i, now)) lines.push(i); });
    if (!lines.length) return { ok: false, lines: [], label: '', note: '' };
    var step = deliveryStep(o, now);
    if (step === 3 && now - deliveredAt(o) > RETURN_WINDOW_MS) {
      return { ok: false, lines: lines, label: '', note: '배송 완료 후 7일이 지나 환불을 요청할 수 없습니다.' };
    }
    return { ok: true, lines: lines, label: step >= 2 ? '반품 · 환불 요청' : '주문 취소 · 환불', note: '' };
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
    // 환불할 품목을 고르면 환불 금액을 바로 보여 준다
    root.addEventListener('change', function (e) {
      var box = e.target.closest && e.target.closest('[data-or-line]');
      if (!box) return;
      updateRefundTotal(box.closest('.or-panel'));
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && root.classList.contains('active')) {
        e.stopImmediatePropagation();
        close();
      }
    }, true);
  }

  function lineBadge(r) {
    if (!r) return '';
    return '<span class="or-line-badge ' + (r.done ? 'is-done' : '') + '">' + (r.done ? '환불 완료' : '환불 요청 접수') + '</span>';
  }

  function orderHtml(o, now) {
    var st = statusOf(o, now);
    var rf = refundInfo(o, now);
    var open = expanded[o.no];

    var items = o.items.map(function (it, i) {
      var r = lineRefund(o, i, now);
      var img = it.image ? '<img src="' + esc(it.image) + '" alt="" class="co-item-img">'
                         : '<div class="co-item-img co-item-ph"><i class="fa-regular fa-image"></i></div>';
      return '<li class="co-item' + (r ? ' is-refunded' : '') + '">' +
        '<button type="button" class="co-item-imgbtn" data-or-goto="' + it.id + '" tabindex="-1" aria-hidden="true">' + img + '</button>' +
        '<div class="co-item-info">' +
          '<button type="button" class="co-item-name co-item-link" data-or-goto="' + it.id + '" title="상품 상세 보기">' + esc(it.title) +
            (it.size ? ' <span class="co-item-size">(' + esc(it.size) + ')</span>' : '') + '</button>' +
          '<div class="co-item-qty">수량 ' + it.qty + ' ' + lineBadge(r) + '</div>' +
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
    else if (open === 'refund' && rf.ok) panel = refundFormHtml(o, rf);

    // 환불 요청 내역(요청 건별)
    var refundNote = '';
    if (o.refunds.length) {
      var amounts = refundAmounts(o);
      refundNote = o.refunds.map(function (r, ri) {
        var done = now - r.ts >= REFUND_DONE_MS;
        var amount = amounts[ri].amount;
        var names = r.lines.map(function (i) { return o.items[i] ? esc(o.items[i].title) + (o.items[i].size ? ' (' + esc(o.items[i].size) + ')' : '') : ''; }).join(', ');
        return '<div class="or-refund-note ' + (done ? 'is-done' : '') + '">' +
          '<i class="fa-solid ' + (done ? 'fa-circle-check' : 'fa-hourglass-half') + '"></i> ' +
          (done
            ? '환불이 완료되었습니다. 환불 금액 <b>' + won(amount) + '</b>'
            : '환불 요청이 접수되었습니다. 확인 후 <b>' + won(amount) + '</b> 이 환불됩니다. (데모: 약 10초 뒤 환불 완료로 바뀝니다)') +
          '<div class="or-refund-meta">환불 품목: ' + names + (amounts[ri].withShip ? ' · 배송비 ' + won(shipOf(o)) + ' 포함' : '') + '</div>' +
          '<div class="or-refund-meta">사유: ' + esc(r.reason) + ' · 요청일 ' + fmt(r.ts) + '</div>' +
        '</div>';
      }).join('');
    }
    if (rf.note) refundNote += '<div class="or-refund-note">' + esc(rf.note) + '</div>';

    return '<article class="or-card" data-status="' + st.key + '">' +
      '<header class="or-card-head">' +
        '<div><div class="or-no">' + esc(o.no) + '</div><div class="or-date">' + fmt(o.ts) + ' 주문 · ' + esc(o.pay) + '</div></div>' +
        '<span class="or-badge or-badge-' + st.key + '">' + st.label + '</span>' +
      '</header>' +
      '<ul class="co-items or-items">' + items + '</ul>' +
      (shipOf(o) > 0
        ? '<div class="or-total-sub"><span>상품 금액</span><b>' + won(o.total - shipOf(o)) + '</b></div>' +
          '<div class="or-total-sub"><span>배송비</span><b>' + won(shipOf(o)) + '</b></div>'
        : '<div class="or-total-sub"><span>배송비</span><b>무료</b></div>') +
      '<div class="or-total has-sub"><span>총 결제 금액</span><b>' + won(o.total) + '</b></div>' +
      refundNote +
      '<div class="or-actions">' + actions + '</div>' +
      panel +
    '</article>';
  }

  function trackHtml(o, st, now) {
    var allRefunded = st.step === -1;
    var steps = DELIVERY_STEPS.map(function (s, i) {
      var reached = !allRefunded && i <= st.step;
      var at = o.ts + i * STEP_MS;
      return '<li class="or-step' + (reached ? ' is-reached' : '') + (!allRefunded && i === st.step ? ' is-current' : '') + '">' +
        '<span class="or-step-dot"><i class="' + s.icon + '"></i></span>' +
        '<span class="or-step-label">' + s.label + '</span>' +
        '<span class="or-step-time">' + (reached ? fmtSec(at) : '-') + '</span></li>';
    }).join('');
    var rec = o.receiver || {};
    var partial = o.refunds.length && !allRefunded;
    return '<div class="or-panel">' +
      '<h4>배송 조회</h4>' +
      '<dl class="co-info">' +
        '<div><dt>택배사</dt><dd>FINELA 택배 (가상)</dd></div>' +
        '<div><dt>운송장 번호</dt><dd>' + trackingNo(o) + '</dd></div>' +
        '<div><dt>받는 분</dt><dd>' + esc(rec.name) + ' · ' + esc(rec.phone) + '</dd></div>' +
        '<div><dt>배송지</dt><dd>' + esc(((rec.addr || '') + ' ' + (rec.addr2 || '')).trim()) + '</dd></div>' +
        (rec.memo ? '<div><dt>배송 메모</dt><dd>' + esc(rec.memo) + '</dd></div>' : '') +
      '</dl>' +
      (allRefunded
        ? '<p class="co-note"><i class="fa-solid fa-circle-info"></i> 모든 품목의 환불이 요청되어 배송이 중단되었습니다.</p>'
        : '<ol class="or-steps">' + steps + '</ol>' +
          (partial ? '<p class="co-note"><i class="fa-solid fa-circle-info"></i> 환불을 요청한 품목을 제외한 상품은 계속 배송됩니다.</p>' : '') +
          '<p class="co-note"><i class="fa-solid fa-circle-info"></i> 데모용 가상 배송입니다. 실제 배송은 이루어지지 않으며, 10초마다 다음 단계로 진행됩니다.</p>') +
      '<p class="co-note"><i class="fa-solid fa-triangle-exclamation"></i> ' + RETURN_NOTICE + '</p>' +
    '</div>';
  }

  function refundFormHtml(o, rf) {
    var opts = REASONS.map(function (r) { return '<option value="' + esc(r) + '">' + esc(r) + '</option>'; }).join('');
    var lines = rf.lines.map(function (i) {
      var it = o.items[i];
      return '<label class="or-line">' +
        '<input type="checkbox" data-or-line="' + i + '" data-amount="' + (it.price * it.qty) + '">' +
        '<span class="or-line-name">' + esc(it.title) + (it.size ? ' <em>(' + esc(it.size) + ')</em>' : '') + ' × ' + it.qty + '</span>' +
        '<b>' + won(it.price * it.qty) + '</b></label>';
    }).join('');
    return '<div class="or-panel" data-or-panel="' + esc(o.no) + '" data-remaining="' + rf.lines.length + '" data-ship="' + shipOf(o) + '">' +
      '<h4>환불 요청 <small>환불할 품목을 선택하세요</small></h4>' +
      '<div class="or-lines">' + lines + '</div>' +
      (shipOf(o) > 0 ? '<p class="co-note"><i class="fa-solid fa-circle-info"></i> 배송비 ' + won(shipOf(o)) + '은 남은 모든 품목을 환불할 때 함께 환불됩니다.</p>' : '') +
      '<div class="or-refund-sum"><span>환불 예정 금액</span><b data-or-refund-total>₩0</b></div>' +
      '<label class="co-field"><span>환불 사유</span><select class="or-reason" data-or-reason="' + esc(o.no) + '">' + opts + '</select></label>' +
      '<p class="co-note or-refund-warn"><i class="fa-solid fa-triangle-exclamation"></i> ' + RETURN_NOTICE + '</p>' +
      '<em class="co-err" data-or-err></em>' +
      '<button type="button" class="co-submit or-refund-submit" data-or-refund-submit data-or-no="' + esc(o.no) + '">선택한 품목 환불 요청하기</button>' +
    '</div>';
  }

  function updateRefundTotal(panel) {
    if (!panel) return;
    var sum = 0;
    var picked = 0;
    panel.querySelectorAll('[data-or-line]:checked').forEach(function (b) { sum += Number(b.getAttribute('data-amount')) || 0; picked++; });
    // 남은 품목을 전부 고르면 배송비도 함께 환불
    if (picked > 0 && picked === Number(panel.getAttribute('data-remaining'))) sum += Number(panel.getAttribute('data-ship')) || 0;
    var el = panel.querySelector('[data-or-refund-total]');
    if (el) el.textContent = won(sum);
    var err = panel.querySelector('[data-or-err]');
    if (err && sum > 0) err.textContent = '';
  }

  function signature() {
    var now = Date.now();
    return orders.map(function (o) {
      var lines = o.items.map(function (_, i) { var r = lineRefund(o, i, now); return r ? (r.done ? 'd' : 'r') : '-'; }).join('');
      return o.no + ':' + statusOf(o, now).key + ':' + lines + ':' + (refundInfo(o, now).ok ? 1 : 0);
    }).join('|') + '#' + JSON.stringify(expanded);
  }

  function render(force) {
    if (!root) return;
    var now = Date.now();
    var sig = signature();
    if (!force && sig === lastSig) return;
    lastSig = sig;
    var body = root.querySelector('#orBody');
    // 환불 품목·사유를 고르는 중이면 선택값이 사라지지 않도록 기억해 두었다가 되돌린다
    var keep = { reasons: {}, lines: {} };
    body.querySelectorAll('[data-or-reason]').forEach(function (el) { keep.reasons[el.getAttribute('data-or-reason')] = el.value; });
    body.querySelectorAll('[data-or-panel]').forEach(function (p) {
      var checked = [];
      p.querySelectorAll('[data-or-line]:checked').forEach(function (b) { checked.push(b.getAttribute('data-or-line')); });
      keep.lines[p.getAttribute('data-or-panel')] = checked;
    });

    if (!orders.length) {
      body.innerHTML =
        '<div class="or-empty">' +
          '<i class="fa-solid fa-receipt"></i>' +
          '<h3>주문 내역이 없습니다</h3>' +
          (purgedWhileOpen ? '<p class="or-purged"><i class="fa-solid fa-circle-info"></i> 주문 후 5분이 지난 데모 주문이 자동으로 삭제되었습니다.</p>' : '') +
          '<p>결제를 완료하면 이곳에서 주문 내용, 배송 조회, 환불 요청을 할 수 있어요.</p>' +
          '<p class="or-ttl-note">' + TTL_NOTICE + '</p>' +
          '<button type="button" class="co-submit or-empty-btn" data-or-shop>쇼핑하러 가기</button>' +
        '</div>';
      return;
    }
    var sorted = orders.slice().sort(function (a, b) { return b.ts - a.ts; });
    body.innerHTML =
      '<p class="or-intro">총 <b>' + orders.length + '</b>건의 주문 · 이 화면은 가상 시뮬레이션입니다. ' + TTL_NOTICE + '</p>' +
      '<div class="or-list">' + sorted.map(function (o) { return orderHtml(o, now); }).join('') + '</div>';
    body.querySelectorAll('[data-or-reason]').forEach(function (el) {
      var v = keep.reasons[el.getAttribute('data-or-reason')];
      if (v) el.value = v;
    });
    body.querySelectorAll('[data-or-panel]').forEach(function (p) {
      (keep.lines[p.getAttribute('data-or-panel')] || []).forEach(function (i) {
        var b = p.querySelector('[data-or-line="' + i + '"]');
        if (b) b.checked = true;
      });
      updateRefundTotal(p);
    });
  }

  function submitRefund(no) {
    var o = orders.filter(function (x) { return x.no === no; })[0];
    if (!o) return;
    var now = Date.now();
    var rf = refundInfo(o, now);
    var panel = root.querySelector('[data-or-panel="' + no + '"]');
    if (!rf.ok || !panel) return;
    var chosen = [];
    panel.querySelectorAll('[data-or-line]:checked').forEach(function (b) {
      var i = Number(b.getAttribute('data-or-line'));
      if (rf.lines.indexOf(i) >= 0) chosen.push(i);     // 이미 환불한 품목은 다시 받지 않는다
    });
    if (!chosen.length) {
      var err = panel.querySelector('[data-or-err]');
      if (err) err.textContent = '환불할 품목을 한 개 이상 선택해 주세요.';
      return;
    }
    var sel = panel.querySelector('[data-or-reason]');
    o.refunds.push({ ts: now, reason: sel ? sel.value : REASONS[0], lines: chosen });
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
    orders = load();           // 다른 탭에서 바뀐 내용 반영 (5분 지난 주문은 여기서 걸러짐)
    purgedWhileOpen = false;
    lastFocus = document.activeElement;
    lastSig = '';
    render(true);
    root.classList.add('active');
    document.body.classList.add('orders-open');
    root.querySelector('.co-panel').scrollTop = 0;
    clearInterval(tickTimer);
    tickTimer = setInterval(function () {                              // 배송 단계·환불 상태·자동 삭제 갱신(바뀔 때만 다시 그림)
      if (purgeExpired()) { purgedWhileOpen = true; render(true); return; }
      render(false);
    }, 1000);
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
      order.refunds = order.refunds || [];
      orders.push(order);
      save();
    }
  };
})();
