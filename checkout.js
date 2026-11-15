/* FINELA 가상 결제 화면 (CHECKOUT)
 * - 장바구니 서랍의 "결제하기"에서 열리는 전체 화면 창. 실제 결제는 일어나지 않는 시뮬레이션이다.
 * - 카드 번호 등 결제 정보는 받지 않는다(결제 수단은 선택만).
 * - 장바구니 데이터는 main.js 의 window.FinelaCart (items / clear / closeDrawer)로 읽는다.
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

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function won(n) { return '₩' + Number(n || 0).toLocaleString(); }

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
      if (e.target.closest('[data-co-close]')) close();
      else if (e.target.closest('[data-co-done]')) finish();
    });
    root.addEventListener('submit', function (e) {
      e.preventDefault();
      submit(e.target);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && root.classList.contains('active')) {
        e.stopImmediatePropagation();
        close();
      }
    }, true);
  }

  function formHtml(items) {
    var sum = 0, count = 0;
    var rows = items.map(function (c) {
      sum += c.price * c.qty; count += c.qty;
      return '<li class="co-item">' +
        (c.image ? '<img src="' + esc(c.image) + '" alt="" class="co-item-img">'
                 : '<div class="co-item-img co-item-ph"><i class="fa-regular fa-image"></i></div>') +
        '<div class="co-item-info"><div class="co-item-name">' + esc(c.title) +
        (c.size ? ' <span class="co-item-size">(' + esc(c.size) + ')</span>' : '') + '</div>' +
        '<div class="co-item-qty">수량 ' + c.qty + '</div></div>' +
        '<div class="co-item-price">' + won(c.price * c.qty) + '</div></li>';
    }).join('');

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
        '<section class="co-sec co-summary"><h3>주문 상품 <small>' + count + '개</small></h3>' +
          '<ul class="co-items">' + rows + '</ul>' +
          '<div class="co-line"><span>상품 금액</span><b>' + won(sum) + '</b></div>' +
          '<div class="co-line"><span>배송비</span><b>무료</b></div>' +
          '<div class="co-line co-total"><span>총 결제 금액</span><b>' + won(sum) + '</b></div>' +
          '<label class="co-agree"><input type="checkbox" name="agree"><span>주문 내용을 확인했으며 결제에 동의합니다.</span></label>' +
          '<em class="co-err" data-err="agree"></em>' +
          '<button type="submit" class="co-submit">' + won(sum) + ' 결제하기</button>' +
          '<button type="button" class="co-back" data-co-close>장바구니로 돌아가기</button>' +
        '</section>' +
      '</aside>' +
    '</form>';
  }

  function submit(form) {
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

    var items = window.FinelaCart.items();
    var sum = items.reduce(function (a, c) { return a + c.price * c.qty; }, 0);
    var pay = PAY_METHODS.filter(function (p) { return p.id === d.get('pay'); })[0];
    var now = new Date();
    var pad = function (n) { return String(n).padStart(2, '0'); };
    var orderNo = 'FN' + now.getFullYear() + pad(now.getMonth() + 1) + pad(now.getDate()) + '-' +
      String(Math.floor(Math.random() * 90000) + 10000);

    root.querySelector('.co-body').setAttribute('data-co-step', 'done');
    root.querySelector('.co-body').innerHTML =
      '<div class="co-done">' +
        '<div class="co-done-mark"><i class="fa-solid fa-check"></i></div>' +
        '<h3>주문이 완료되었습니다</h3>' +
        '<p class="co-done-sub">가상 결제 시뮬레이션이며 실제 결제·배송은 진행되지 않습니다.</p>' +
        '<dl class="co-done-info">' +
          '<div><dt>주문번호</dt><dd>' + orderNo + '</dd></div>' +
          '<div><dt>결제 수단</dt><dd>' + esc(pay ? pay.label : '') + '</dd></div>' +
          '<div><dt>결제 금액</dt><dd>' + won(sum) + '</dd></div>' +
          '<div><dt>받는 분</dt><dd>' + esc(String(d.get('name')).trim()) + '</dd></div>' +
          '<div><dt>배송지</dt><dd>' + esc((String(d.get('addr')) + ' ' + String(d.get('addr2'))).trim()) + '</dd></div>' +
        '</dl>' +
        '<button type="button" class="co-submit" data-co-done>쇼핑 계속하기</button>' +
      '</div>';
    root.querySelector('.co-panel').scrollTop = 0;
    // 주문이 확정된 시점에 장바구니를 비운다(완료 화면을 닫기 전에 새로고침해도 중복 주문되지 않도록).
    window.FinelaCart.clear();
  }

  function open() {
    var api = window.FinelaCart;
    if (!api) return;
    var items = api.items();
    if (!items.length) return;
    if (!root) build();
    lastFocus = document.activeElement;
    var body = root.querySelector('.co-body');
    body.setAttribute('data-co-step', 'form');
    body.innerHTML = formHtml(items);
    root.querySelector('.co-panel').scrollTop = 0;
    root.classList.add('active');
    document.body.classList.add('checkout-open');
    var first = body.querySelector('input[name="name"]');
    if (first) setTimeout(function () { first.focus({ preventScroll: true }); }, 50);
  }

  function close() {
    if (!root) return;
    root.classList.remove('active');
    document.body.classList.remove('checkout-open');
    if (lastFocus && lastFocus.focus) { try { lastFocus.focus({ preventScroll: true }); } catch (e) {} }
  }

  function finish() {
    close();
    if (window.FinelaCart && window.FinelaCart.closeDrawer) window.FinelaCart.closeDrawer();
  }

  window.FinelaCheckout = { open: open, close: close };
})();
