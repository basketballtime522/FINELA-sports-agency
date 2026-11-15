/* 푸터 개인정보처리방침 · 이용약관 (legal.js)
 * - 푸터 링크([data-legal="privacy" | "terms"])를 누르면 샘플 문서를 팝업으로 보여 준다.
 * - 포트폴리오용 가상 사이트이므로 일반적인 국내 쇼핑·서비스 사이트 약관의 표준 구성을 따른 "샘플"이다.
 *   (실제 서비스 운영 시에는 사업자 정보에 맞춰 법무 검토 후 교체해야 한다)
 * - ESC · 바깥 클릭 · 닫기 버튼으로 닫는다. 스크롤 잠금은 body 클래스(legal-open)로 처리한다.
 */
(function () {
  'use strict';

  var COMPANY = '주식회사 피넬라 스포츠 에이전시';
  var NOTICE = '본 문서는 포트폴리오용 가상 프로젝트의 샘플입니다. 실제 서비스에는 적용되지 않습니다.';

  var DOCS = {
    privacy: {
      title: '개인정보처리방침',
      sections: [
        ['1. 수집하는 개인정보 항목', '문의하기: 성명(기업명), 이메일 주소, 문의 내용 / 주문·결제(가상): 받는 분 이름, 연락처, 배송 주소. 이 사이트의 결제는 시뮬레이션이며 카드 정보 등 결제 수단 정보는 수집하지 않습니다.'],
        ['2. 개인정보의 수집·이용 목적', '문의 접수 및 회신, 주문 처리·배송 안내·환불 처리, 서비스 이용 관련 안내를 위해 이용합니다.'],
        ['3. 보유 및 이용 기간', '목적 달성 시 지체 없이 파기합니다. 단, 관계 법령에 따라 보존이 필요한 경우 해당 기간 동안 보관합니다(계약·청약철회 기록 5년, 대금결제·재화 공급 기록 5년, 소비자 불만·분쟁 처리 기록 3년). 이 사이트의 가상 주문 정보는 주문 후 5분이 지나면 자동 삭제됩니다.'],
        ['4. 제3자 제공 및 처리 위탁', '이용자의 동의 없이 개인정보를 외부에 제공하지 않습니다. 배송 등 업무 위탁이 필요한 경우 위탁 업체와 업무 내용을 사전에 고지합니다.'],
        ['5. 이용자의 권리', '이용자는 언제든지 자신의 개인정보에 대한 열람, 정정, 삭제, 처리 정지를 요청할 수 있으며, 요청 시 지체 없이 조치합니다.'],
        ['6. 개인정보의 파기', '보유 기간이 지났거나 처리 목적이 달성된 개인정보는 복구할 수 없는 방법으로 파기합니다.'],
        ['7. 안전성 확보 조치', '접근 권한 최소화, 접속 기록 보관, 전송 구간 암호화 등 기술적·관리적 보호 조치를 시행합니다.'],
        ['8. 개인정보 보호책임자', COMPANY + ' / 이메일: contact@finela-agency.com / 전화: 02-1234-5678']
      ],
      date: '시행일: 2026년 1월 1일'
    },
    terms: {
      title: '이용약관',
      sections: [
        ['제1조 (목적)', '이 약관은 ' + COMPANY + '(이하 "회사")가 운영하는 FINELA 웹사이트 및 공식 스토어(이하 "서비스")의 이용 조건과 절차, 회사와 이용자의 권리·의무 및 책임 사항을 정함을 목적으로 합니다.'],
        ['제2조 (약관의 효력 및 변경)', '이 약관은 서비스 화면에 게시하여 이용자에게 공지함으로써 효력이 발생합니다. 회사는 관련 법령을 위반하지 않는 범위에서 약관을 개정할 수 있으며, 개정 시 시행일 7일 전부터 공지합니다.'],
        ['제3조 (서비스의 제공)', '회사는 선수 소개, 매니지먼트 서비스 안내, 굿즈 판매, 파트너십 문의 접수 등의 서비스를 제공합니다. 운영상·기술상 필요한 경우 서비스의 전부 또는 일부를 변경하거나 중단할 수 있습니다.'],
        ['제4조 (구매 및 결제)', '이용자는 서비스에서 안내하는 절차에 따라 상품을 주문합니다. 상품 금액이 50,000원 이상이면 무료배송, 50,000원 미만이면 배송비 3,000원이 부과됩니다. 한정 상품은 1인 1개로 구매 수량이 제한됩니다.'],
        ['제5조 (청약철회 및 환불)', '이용자는 상품 수령 후 7일 이내에 교환·반품(환불)을 요청할 수 있습니다. 다만 상품이 훼손되었거나 착용·사용한 경우 등 관련 법령이 정한 사유에는 제한될 수 있습니다.'],
        ['제6조 (이용자의 의무)', '이용자는 타인의 정보를 도용하거나 서비스의 정상적인 운영을 방해하는 행위, 회사 및 제3자의 지식재산권을 침해하는 행위를 해서는 안 됩니다.'],
        ['제7조 (지식재산권)', '서비스에 게재된 로고, 이미지, 문구 등의 저작권은 회사 또는 각 원 저작권자에게 있으며, 사전 동의 없이 복제·배포·상업적으로 이용할 수 없습니다.'],
        ['제8조 (면책)', '회사는 천재지변, 불가항력, 이용자의 귀책 사유로 인한 서비스 장애에 대해 책임을 지지 않습니다.'],
        ['제9조 (분쟁 해결)', '서비스 이용과 관련한 분쟁은 대한민국 법령을 따르며, 관할 법원은 민사소송법에 따릅니다.']
      ],
      date: '시행일: 2026년 1월 1일'
    }
  };

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  var style = document.createElement('style');
  style.textContent =
    '.lg-root{position:fixed;inset:0;z-index:5400;display:none;align-items:center;justify-content:center;padding:24px;background:rgba(0,0,0,.7)}' +
    '.lg-root.active{display:flex}' +
    '.lg-card{position:relative;width:min(720px,100%);max-height:min(82vh,760px);display:flex;flex-direction:column;background:#0e0f14;border:1px solid rgba(255,255,255,.12);border-radius:14px;color:#e6e8ef;box-shadow:0 20px 60px rgba(0,0,0,.6)}' +
    '.lg-head{display:flex;align-items:center;justify-content:space-between;padding:18px 22px;border-bottom:1px solid rgba(255,255,255,.1)}' +
    '.lg-head h2{font-size:20px;font-weight:800;margin:0}' +
    '.lg-close{width:34px;height:34px;border-radius:50%;border:1px solid rgba(255,255,255,.2);background:transparent;color:#fff;font-size:20px;line-height:1;cursor:pointer}' +
    '.lg-close:hover{border-color:#e60012;color:#ff3341}' +
    '.lg-body{overflow:auto;padding:18px 22px 24px;font-size:14px;line-height:1.75}' +
    '.lg-note{padding:10px 12px;border-radius:8px;background:rgba(230,0,18,.12);border:1px solid rgba(230,0,18,.4);color:#ffb3ba;font-size:13px;margin:0 0 16px}' +
    '.lg-body h3{font-size:15px;font-weight:700;color:#fff;margin:18px 0 4px}' +
    '.lg-body p{margin:0;color:#b9bdca}' +
    '.lg-date{margin-top:20px!important;color:#7d8394!important;font-size:12px}' +
    'body.legal-open{overflow:hidden}' +
    '@media(max-width:600px){.lg-root{padding:12px}.lg-card{max-height:88vh}}';
  document.head.appendChild(style);

  var root = null;
  var lastFocus = null;

  function build() {
    root = document.createElement('div');
    root.className = 'lg-root';
    root.setAttribute('role', 'dialog');
    root.setAttribute('aria-modal', 'true');
    root.innerHTML =
      '<div class="lg-card">' +
        '<div class="lg-head"><h2 id="lgTitle"></h2><button type="button" class="lg-close" aria-label="닫기">&times;</button></div>' +
        '<div class="lg-body" id="lgBody"></div>' +
      '</div>';
    document.body.appendChild(root);
    root.setAttribute('aria-labelledby', 'lgTitle');
    root.addEventListener('click', function (e) {
      if (e.target === root || e.target.closest('.lg-close')) close();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && root.classList.contains('active')) {
        e.stopImmediatePropagation();
        close();
      }
    }, true);
  }

  function open(key) {
    var d = DOCS[key];
    if (!d) return;
    if (!root) build();
    lastFocus = document.activeElement;
    root.querySelector('#lgTitle').textContent = d.title;
    root.querySelector('#lgBody').innerHTML =
      '<p class="lg-note">' + esc(NOTICE) + '</p>' +
      d.sections.map(function (s) { return '<h3>' + esc(s[0]) + '</h3><p>' + esc(s[1]) + '</p>'; }).join('') +
      '<p class="lg-date">' + esc(d.date) + '</p>';
    root.querySelector('.lg-body').scrollTop = 0;
    root.classList.add('active');
    document.body.classList.add('legal-open');
    root.querySelector('.lg-close').focus({ preventScroll: true });
  }

  function close() {
    if (!root) return;
    root.classList.remove('active');
    document.body.classList.remove('legal-open');
    if (lastFocus && lastFocus.focus) { try { lastFocus.focus({ preventScroll: true }); } catch (e) {} }
  }

  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('[data-legal]');
    if (!a) return;
    e.preventDefault();
    e.stopPropagation();
    open(a.getAttribute('data-legal'));
  }, true);
})();
