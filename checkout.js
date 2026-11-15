/* FINELA 가상 결제 화면 (CHECKOUT)
 * - 장바구니 서랍의 "결제하기"에서 열리는 전체 화면 창. 실제 결제는 일어나지 않는 시뮬레이션이다.
 * - 카드 번호 등 결제 정보는 받지 않는다(결제 수단은 선택만).
 * - 단계: 입력(form) → 최종 확인(confirm) → 주문 완료(done). 주문이 확정되면 orders.js(주문 내역)에 저장한다.
 * - 주문 상품: 이름을 누르면 해당 상품 상세로 이동, +/- 로 수량 변경(구매 한도는 main.js 의 FinelaCart 가 지킨다).
 * - 장바구니 데이터는 main.js 의 window.FinelaCart (items / changeQty / maxForIndex / clear / closeDrawer)로 읽는다.
 */
(function () {
  'use strict';

  var PAY_METHODS = [
    { id: 'card', label: '신용·체크카드', icon: 'fa-regular fa-credit-card' },
    { id: 'bank', label: '계좌이체', icon: 'fa-solid fa-building-columns' },
    { id: 'phone', label: '휴대폰 결제', icon: 'fa-solid fa-mobile-screen' }
  ];

  var root = null;
  var lastFocus = null;
  var pending = null;   // 입력 단계에서 받은 배송·결제 정보 (최종 확인 단계 → 수정하기 때 다시 채워 넣음)

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function won(n) { return '₩' + Number(n || 0).toLocaleString(); }
  function payOf(id) {
    return PAY_METHODS.filter(function (p) { return p.id === id; })[0] || PAY_METHODS[0];
  }
  function cartApi() { return window.FinelaCart; }
  function bodyEl() { return root.querySelector('.co-body'); }

  function build() {
    root = document.createElement('div');
    root.className = 'co-root';
    root.id = 'checkoutRoot';
    root.setAttribute('role', 'dialog');
    root.setAttribute('aria-modal', 'true');
    root.setAttribute('aria-label', '주문 결제');
    root.innerHTML =
      '<div class="co-panel">' +
        '<header class="co-head">' +
          '<h2 class="co-title"><i class="fa-solid fa-lock"></i> CHECKOUT</h2>' +
          '<button type="button" class="co-close" data-co-close aria-label="결제 창 닫기">&times;</button>' +
        '</header>' +
        '<div class="co-body" data-co-step="form"></div>' +
      '</div>';
    document.body.appendChild(root);

    root.addEventListener('click', function (e) {
      var t = e.target;
      var q = t.closest('[data-co-qty]');
      if (q) return changeQty(Number(q.getAttribute('data-index')), Number(q.getAttribute('data-co-qty')));
      var g = t.closest('[data-co-goto]');
      if (g) return gotoProduct(Number(g.getAttribute('data-co-goto')));
      if (t === popEl()) return closePop();                  // 팝업 바깥(어두운 영역)을 누르면 팝업만 닫기
      if (t.closest('[data-co-edit]')) return closePop();    // 수정하기: 팝업만 닫고 입력 화면으로
      if (t.closest('[data-co-pay]')) return finalize();
      if (t.closest('[data-co-orders]')) return openOrders();
      if (t.closest('[data-co-done]')) return finish();
      if (t.closest('[data-co-close]')) return close();
    });
    root.addEventListener('submit', function (e) {
      e.preventDefault();
      submitForm(e.target);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && root.classList.contains('active')) {
        e.stopImmediatePropagation();
        if (popEl()) closePop();    // 팝업이 떠 있으면 팝업만 닫는다
        else close();
      }
    }, true);
  }

  // ───────────────────────── 주문 상품 목록 / 금액 ─────────────────────────
  function itemsHtml(items, readonly) {
    return items.map(function (c, i) {
      var max = cartApi().maxForIndex(i);
      var atMax = c.qty >= max;
      var limitNote = '';
      if (!readonly && atMax) {
        limitNote = '<div class="co-item-limit">' + (cartApi().maxQty(c.id) === 1 ? '1인 1개 한정 상품' : '구매 가능한 최대 수량') + '</div>';
      }
      var name = readonly
        ? '<div class="co-item-name">' + esc(c.title) + (c.size ? ' <span class="co-item-size">(' + esc(c.size) + ')</span>' : '') + '</div>'
        : '<button type="button" class="co-item-name co-item-link" data-co-goto="' + c.id + '" title="상품 상세 보기">' + esc(c.title) +
            (c.size ? ' <span class="co-item-size">(' + esc(c.size) + ')</span>' : '') + '</button>';
      var qty = readonly
        ? '<div class="co-item-qty">수량 ' + c.qty + '</div>'
        : '<div class="co-qty">' +
            '<button type="button" data-co-qty="-1" data-index="' + i + '" aria-label="수량 줄이기"' + (c.qty <= 1 ? ' disabled' : '') + '><i class="fa-solid fa-minus"></i></button>' +
            '<span>' + c.qty + '</span>' +
            '<button type="button" data-co-qty="1" data-index="' + i + '" aria-label="수량 늘리기"' + (atMax ? ' disabled' : '') + '><i class="fa-solid fa-plus"></i></button>' +
          '</div>';
      var img = c.image ? '<img src="' + esc(c.image) + '" alt="" class="co-item-img">'
                        : '<div class="co-item-img co-item-ph"><i class="fa-regular fa-image"></i></div>';
      if (!readonly) {
        img = '<button type="button" class="co-item-imgbtn" data-co-goto="' + c.id + '" tabindex="-1" aria-hidden="true">' + img + '</button>';
      }
      return '<li class="co-item">' + img +
        '<div class="co-item-info">' + name + qty + limitNote + '</div>' +
        '<div class="co-item-price">' + won(c.price * c.qty) + '</div></li>';
    }).join('');
  }

  function sumOf(items) {
    return items.reduce(function (a, c) { return a + c.price * c.qty; }, 0);
  }
  function countOf(items) {
    return items.reduce(function (a, c) { return a + c.qty; }, 0);
  }
  // 배송비: 상품 금액 5만원 이상 무료, 미만 3,000원 (규칙은 main.js 의 FinelaCart.shipping 한 곳에서만 정의)
  function shipOf(items) { return cartApi().shipping(sumOf(items)); }
  function grandOf(items) { return sumOf(items) + shipOf(items); }
  function totalsHtml(items) {
    var sum = sumOf(items);
    var ship = shipOf(items);
    var hint = ship > 0
      ? '<p class="co-ship-hint"><i class="fa-solid fa-truck-fast"></i> ' + won(cartApi().freeShipMin - sum) + ' 더 담으면 무료배송 (5만원 이상 무료, 미만 배송비 ' + won(cartApi().shipFee) + ')</p>'
      : '<p class="co-ship-hint is-free"><i class="fa-solid fa-truck-fast"></i> 5만원 이상 구매로 무료배송이 적용되었습니다.</p>';
    return '<div class="co-line"><span>상품 금액</span><b>' + won(sum) + '</b></div>' +
      '<div class="co-line"><span>배송비</span><b>' + (ship ? won(ship) : '무료') + '</b></div>' +
      '<div class="co-line co-total"><span>총 결제 금액</span><b>' + won(sum + ship) + '</b></div>' + hint;
  }

  // 수량을 바꿨을 때 입력 중인 칸은 그대로 두고 상품 목록·금액만 다시 그린다
  function refreshSummary() {
    var items = cartApi().items();
    var list = root.querySelector('#coItems');
    if (list) list.innerHTML = itemsHtml(items, false);
    var cnt = root.querySelector('#coCount');
    if (cnt) cnt.textContent = countOf(items) + '개';
    var tot = root.querySelector('#coTotals');
    if (tot) tot.innerHTML = totalsHtml(items);
    var btn = root.querySelector('#coSubmit');
    if (btn) btn.textContent = won(grandOf(items)) + ' 결제하기';
  }

  function changeQty(index, delta) {
    cartApi().changeQty(index, delta);
    refreshSummary();
  }

  // 주문 상품 이름·사진 → 그 상품 상세로 이동 (결제 창·장바구니를 닫고 STORE 상품 창을 연다)
  function gotoProduct(id) {
    close();
    if (cartApi().closeDrawer) cartApi().closeDrawer();
    if (window.FinelaStore) window.FinelaStore.restore({ cat: 0, prod: id });
  }

  // ───────────────────────── 1) 입력 ─────────────────────────
  function formHtml(items) {
    var pays = PAY_METHODS.map(function (p, i) {
      return '<label class="co-pay"><input type="radio" name="pay" value="' + p.id + '"' + (i === 0 ? ' checked' : '') + '>' +
        '<span><i class="' + p.icon + '"></i>' + p.label + '</span></label>';
    }).join('');

    return '<form class="co-grid" novalidate>' +
      '<div class="co-left">' +
        '<section class="co-sec"><h3>배송 정보</h3>' +
          '<label class="co-field"><span>받는 분</span><input name="name" type="text" autocomplete="name" placeholder="이름"><em class="co-err" data-err="name"></em></label>' +
          '<label class="co-field"><span>연락처</span><input name="phone" type="tel" inputmode="numeric" autocomplete="tel" placeholder="010-0000-0000"><em class="co-err" data-err="phone"></em></label>' +
          '<label class="co-field"><span>주소</span><input name="addr" type="text" autocomplete="street-address" placeholder="도로명 주소"><em class="co-err" data-err="addr"></em></label>' +
          '<label class="co-field"><span>상세 주소</span><input name="addr2" type="text" placeholder="동·호수 (선택)"></label>' +
          '<label class="co-field"><span>배송 메모</span><input name="memo" type="text" placeholder="요청 사항 (선택)"></label>' +
        '</section>' +
        '<section class="co-sec"><h3>결제 수단</h3><div class="co-pays">' + pays + '</div>' +
          '<p class="co-note"><i class="fa-solid fa-circle-info"></i> 가상 결제입니다. 실제 결제는 이루어지지 않으며 카드 정보는 받지 않습니다.</p>' +
        '</section>' +
      '</div>' +
      '<aside class="co-right">' +
        '<section class="co-sec co-summary"><h3>주문 상품 <small id="coCount">' + countOf(items) + '개</small></h3>' +
          '<ul class="co-items" id="coItems">' + itemsHtml(items, false) + '</ul>' +
          '<div id="coTotals">' + totalsHtml(items) + '</div>' +
          '<label class="co-agree"><input type="checkbox" name="agree"><span>주문 내용을 확인했으며 결제에 동의합니다.</span></label>' +
          '<em class="co-err" data-err="agree"></em>' +
          '<button type="submit" class="co-submit" id="coSubmit">' + won(grandOf(items)) + ' 결제하기</button>' +
          '<button type="button" class="co-back" data-co-close>장바구니로 돌아가기</button>' +
        '</section>' +
      '</aside>' +
    '</form>';
  }

  function fillForm(form, data) {
    if (!data) return;
    ['name', 'phone', 'addr', 'addr2', 'memo'].forEach(function (k) {
      if (form.elements[k]) form.elements[k].value = data[k] || '';
    });
    var radio = form.querySelector('input[name="pay"][value="' + data.pay + '"]');
    if (radio) radio.checked = true;
    if (form.elements.agree) form.elements.agree.checked = !!data.agree;
  }

  function showForm() {
    closePop();
    var items = cartApi().items();
    if (!items.length) return close();
    var body = bodyEl();
    body.setAttribute('data-co-step', 'form');
    body.innerHTML = formHtml(items);
    fillForm(body.querySelector('form'), pending);
    root.querySelector('.co-panel').scrollTop = 0;
  }

  function submitForm(form) {
    var d = new FormData(form);
    var errs = {};
    if (!String(d.get('name')).trim()) errs.name = '받는 분 이름을 입력해 주세요.';
    var digits = String(d.get('phone')).replace(/\D/g, '');
    if (digits.length < 10 || digits.length > 11) errs.phone = '연락처를 정확히 입력해 주세요.';
    if (!String(d.get('addr')).trim()) errs.addr = '주소를 입력해 주세요.';
    if (!d.get('agree')) errs.agree = '결제 동의에 체크해 주세요.';

    form.querySelectorAll('[data-err]').forEach(function (el) {
      el.textContent = errs[el.getAttribute('data-err')] || '';
    });
    var keys = Object.keys(errs);
    if (keys.length) {
      var first = form.querySelector('[name="' + keys[0] + '"]');
      if (first) first.focus();
      return;
    }

    pending = {
      name: String(d.get('name')).trim(),
      phone: String(d.get('phone')).trim(),
      addr: String(d.get('addr')).trim(),
      addr2: String(d.get('addr2') || '').trim(),
      memo: String(d.get('memo') || '').trim(),
      pay: String(d.get('pay')),
      agree: true
    };
    showConfirm();
  }

  // ───────────────────────── 2) 최종 확인 (팝업) ─────────────────────────
  // 입력 화면은 그대로 두고 그 위에 팝업을 띄운다. "결제 확정"을 눌러야 주문이 완료되고, "수정하기"는 팝업만 닫는다.
  function popEl() { return root ? root.querySelector('#coPop') : null; }
  function closePop() {
    var p = popEl();
    if (p) p.remove();
  }

  function showConfirm() {
    var items = cartApi().items();
    if (!items.length || !pending) return showForm();
    closePop();
    var pay = payOf(pending.pay);
    var pop = document.createElement('div');
    pop.className = 'co-pop';
    pop.id = 'coPop';
    pop.setAttribute('role', 'alertdialog');
    pop.setAttribute('aria-modal', 'true');
    pop.setAttribute('aria-label', '최종 확인');
    pop.innerHTML =
      '<div class="co-pop-card">' +
        '<div class="co-pop-head">' +
          '<h3><i class="fa-solid fa-clipboard-check"></i> 최종 확인</h3>' +
          '<p>아래 내용으로 결제합니다. <b>결제 확정</b>을 눌러야 주문이 완료됩니다.</p>' +
        '</div>' +
        '<div class="co-pop-body">' +
          '<h4>주문 상품 <small>' + countOf(items) + '개</small></h4>' +
          '<ul class="co-items co-pop-items">' + itemsHtml(items, true) + '</ul>' +
          '<h4>배송 정보</h4>' +
          '<dl class="co-info">' +
            '<div><dt>받는 분</dt><dd>' + esc(pending.name) + '</dd></div>' +
            '<div><dt>연락처</dt><dd>' + esc(pending.phone) + '</dd></div>' +
            '<div><dt>주소</dt><dd>' + esc((pending.addr + ' ' + pending.addr2).trim()) + '</dd></div>' +
            '<div><dt>배송 메모</dt><dd>' + (pending.memo ? esc(pending.memo) : '<span class="co-muted">없음</span>') + '</dd></div>' +
            '<div><dt>결제 수단</dt><dd><i class="' + pay.icon + '"></i> ' + esc(pay.label) + '</dd></div>' +
          '</dl>' +
          totalsHtml(items) +
          '<p class="co-note"><i class="fa-solid fa-circle-info"></i> 가상 결제입니다. 실제로 결제되지 않습니다.</p>' +
        '</div>' +
        '<div class="co-pop-actions">' +
          '<button type="button" class="co-back co-pop-edit" data-co-edit><i class="fa-solid fa-pen"></i> 수정하기</button>' +
          '<button type="button" class="co-submit co-pop-pay" data-co-pay>' + won(grandOf(items)) + ' 결제 확정</button>' +
        '</div>' +
      '</div>';
    root.appendChild(pop);
    var payBtn = pop.querySelector('[data-co-pay]');
    if (payBtn) setTimeout(function () { payBtn.focus({ preventScroll: true }); }, 30);
  }
  // ───────────────────────── 3) 주문 확정 → 완료 ─────────────────────────
  function newOrderNo() {
    var now = new Date();
    var pad = function (n) { return String(n).padStart(2, '0'); };
    var existing = window.FinelaOrders ? window.FinelaOrders.list().map(function (o) { return o.no; }) : [];
    var no;
    do {
      no = 'FN' + now.getFullYear() + pad(now.getMonth() + 1) + pad(now.getDate()) + '-' +
        String(Math.floor(Math.random() * 90000) + 10000);
    } while (existing.indexOf(no) >= 0);
    return no;
  }

  function finalize() {
    var items = cartApi().items();
    if (!items.length || !pending) return close();
    closePop();
    var pay = payOf(pending.pay);
    var subtotal = sumOf(items);
    var shipping = shipOf(items);
    var total = subtotal + shipping;
    var order = {
      no: newOrderNo(),
      ts: Date.now(),
      items: items.map(function (c) {
        return { id: c.id, title: c.title, size: c.size, qty: c.qty, price: c.price, image: c.image || '' };
      }),
      subtotal: subtotal,
      shipping: shipping,
      total: total,
      pay: pay.label,
      receiver: { name: pending.name, phone: pending.phone, addr: pending.addr, addr2: pending.addr2, memo: pending.memo },
      refunds: []
    };
    if (window.FinelaOrders) window.FinelaOrders.add(order);

    var body = bodyEl();
    body.setAttribute('data-co-step', 'done');
    body.innerHTML =
      '<div class="co-done">' +
        '<div class="co-done-mark"><i class="fa-solid fa-check"></i></div>' +
        '<h3>주문이 완료되었습니다</h3>' +
        '<p class="co-done-sub">가상 결제 시뮬레이션이며 실제 결제·배송은 진행되지 않습니다.</p>' +
        '<dl class="co-done-info">' +
          '<div><dt>주문번호</dt><dd>' + esc(order.no) + '</dd></div>' +
          '<div><dt>결제 수단</dt><dd>' + esc(order.pay) + '</dd></div>' +
          '<div><dt>상품 금액</dt><dd>' + won(subtotal) + '</dd></div>' +
          '<div><dt>배송비</dt><dd>' + (shipping ? won(shipping) : '무료') + '</dd></div>' +
          '<div><dt>결제 금액</dt><dd>' + won(total) + '</dd></div>' +
          '<div><dt>받는 분</dt><dd>' + esc(pending.name) + '</dd></div>' +
          '<div><dt>배송지</dt><dd>' + esc((pending.addr + ' ' + pending.addr2).trim()) + '</dd></div>' +
        '</dl>' +
        '<p class="co-note" style="text-align:left;margin-top:16px"><i class="fa-solid fa-circle-info"></i> 데모 주문은 주문 후 5분이 지나면 주문 내역에서 자동으로 삭제됩니다.</p>' +
        '<button type="button" class="co-submit" data-co-orders><i class="fa-solid fa-receipt"></i> 주문 내역 · 배송 조회</button>' +
        '<button type="button" class="co-back" data-co-done>쇼핑 계속하기</button>' +
      '</div>';
    root.querySelector('.co-panel').scrollTop = 0;
    pending = null;
    // 주문이 확정된 시점에 장바구니를 비운다(완료 화면을 닫기 전에 새로고침해도 중복 주문되지 않도록).
    cartApi().clear();
  }

  function openOrders() {
    close();
    if (cartApi().closeDrawer) cartApi().closeDrawer();
    if (window.FinelaOrders) window.FinelaOrders.open();
  }

  // ───────────────────────── 열기 / 닫기 ─────────────────────────
  function open() {
    var api = cartApi();
    if (!api) return;
    if (!api.items().length) return;
    if (!root) build();
    lastFocus = document.activeElement;
    pending = null;
    showForm();
    root.classList.add('active');
    document.body.classList.add('checkout-open');
    var first = bodyEl().querySelector('input[name="name"]');
    if (first) setTimeout(function () { first.focus({ preventScroll: true }); }, 50);
  }

  function close() {
    if (!root) return;
    closePop();
    root.classList.remove('active');
    document.body.classList.remove('checkout-open');
    if (lastFocus && lastFocus.focus) { try { lastFocus.focus({ preventScroll: true }); } catch (e) {} }
  }

  function finish() {
    close();
    if (cartApi() && cartApi().closeDrawer) cartApi().closeDrawer();
  }

  window.FinelaCheckout = {
    open: open,
    close: close,
    isOpen: function () { return !!(root && root.classList.contains('active')); }
  };
})();
