/**
 * ==============================================================================
 * FINELA SPORTS AGENCY - 메인 인터랙티브 자바스크립트 컨트롤러 (main.js)
 * ==============================================================================
 * 
 * [기능 목록]
 * 1. GNB 헤더 스크롤 반응 & ScrollSpy (현재 섹션 하이라이트)
 * 2. 앰비언트 캔버스 파티클 (붉은 불꽃 & 스타디움 라이트 더스트)
 * 3. 선수단 12인 동적 렌더링 & 포지션별 필터링 (GUARD, FORWARD, CENTER)
 * 4. 선수 상세 모달 (스탯, 영상, 방송/CF 썸네일, 인스타그램 피드, 이전/다음 전환)
 * 5. 통합 서비스 3대 탭 전환 컨트롤러 (트레이닝 / 숙소 / 매니지먼트)
 * 6. 공식 스토어 굿즈 동적 렌더링 & 퀵뷰 모달 & 장바구니 드로어 (Cart Drawer)
 * 7. 공식 후원사 그리드 렌더링 & 브랜드 컬러 인터랙션
 * 8. 고객센터 문의 폼 발송 시뮬레이션 & 피드백 알림
 * ==============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {

  // ============================================================================
  // 1. GNB 스크롤 이펙트 & ScrollSpy
  // ============================================================================
  const gnb = document.getElementById('gnb');
  const navItems = document.querySelectorAll('.nav-item');
  const sections = document.querySelectorAll('section[id], footer[id]');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      gnb.classList.add('scrolled');
    } else {
      gnb.classList.remove('scrolled');
    }

    // ScrollSpy: 현재 보이는 섹션 감지 (메인 히어로 영역일 때는 어떤 탭도 빨간색으로 활성화되지 않음)
    const rosterSec = document.getElementById('roster');
    const rosterThreshold = rosterSec ? rosterSec.offsetTop - 180 : 600;

    if (window.scrollY < rosterThreshold) {
      // 메인 히어로 구역: ROSTER 포함 모든 상단 탭의 active 해제
      navItems.forEach(i => i.classList.remove('active'));
    } else {
      let currentId = '';
      const scrollPos = window.scrollY + 200;

      sections.forEach(sec => {
        const top = sec.offsetTop;
        const height = sec.offsetHeight;
        if (sec.id !== 'hero' && scrollPos >= top && scrollPos < top + height) {
          currentId = sec.getAttribute('id');
        }
      });

      if (currentId) {
        navItems.forEach(item => {
          const link = item.querySelector('.nav-link');
          if (link && link.getAttribute('href') === `#${currentId}`) {
            navItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
          }
        });
      }
    }
  });

  // 모바일 햄버거 메뉴 토글
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const gnbNav = document.querySelector('.gnb-nav');
  if (mobileMenuBtn && gnbNav) {
    mobileMenuBtn.addEventListener('click', () => {
      gnbNav.classList.toggle('mobile-active');
    });
    gnbNav.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        gnbNav.classList.remove('mobile-active');
      });
    });
  }

  // ============================================================================
  // 1-1. 히어로 배경 5가지 사진 순환 교차 슬라이드쇼 컨트롤러
  // ============================================================================
  const heroSlides = document.querySelectorAll('.hero-slide');
  const slideDots = document.querySelectorAll('.slide-dot');
  let currentSlideIdx = 0;
  let slideTimer = null;

  function goToSlide(index) {
    if (heroSlides.length === 0) return;
    heroSlides.forEach(s => s.classList.remove('active'));
    slideDots.forEach(d => d.classList.remove('active'));

    currentSlideIdx = (index + heroSlides.length) % heroSlides.length;
    heroSlides[currentSlideIdx].classList.add('active');
    if (slideDots[currentSlideIdx]) {
      slideDots[currentSlideIdx].classList.add('active');
    }
  }

  function nextSlide() {
    goToSlide(currentSlideIdx + 1);
  }

  function startSlideTimer() {
    clearInterval(slideTimer);
    slideTimer = setInterval(nextSlide, 4500); // 4.5초마다 자연스러운 페이드 전환
  }

  slideDots.forEach((dot, idx) => {
    dot.addEventListener('click', () => {
      goToSlide(idx);
      startSlideTimer();
    });
  });

  if (heroSlides.length > 0) {
    startSlideTimer();
  }

  // ============================================================================
  // 2. 앰비언트 캔버스 (붉은 불꽃 입자 & 조명 더스트)
  // ============================================================================
  const canvas = document.getElementById('ambientCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const count = 50;

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 2.5 + 0.8,
        color: Math.random() > 0.4 ? 'rgba(230, 0, 18, ' : 'rgba(255, 255, 255, ',
        opacity: Math.random() * 0.7 + 0.2,
        vx: (Math.random() - 0.5) * 0.5,
        vy: -Math.random() * 0.9 - 0.3
      });
    }

    function animateParticles() {
      ctx.clearRect(0, 0, width, height);
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.y < 0) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color + p.opacity + ')';
        ctx.shadowBlur = p.color.includes('230') ? 12 : 3;
        ctx.shadowColor = '#e60012';
        ctx.fill();
      });
      requestAnimationFrame(animateParticles);
    }
    animateParticles();
  }

  // ============================================================================
  // 3. 선수단 12인 렌더링 & 필터링 (ROSTER)
  // ============================================================================
  const rosterGrid = document.getElementById('rosterGrid');
  let currentModalPlayerIndex = 0;

  function renderRoster(filter = 'all') {
    if (!rosterGrid) return;
    rosterGrid.innerHTML = '';

    const filtered = filter === 'all' 
      ? PLAYERS_DATA 
      : PLAYERS_DATA.filter(p => p.category === filter);

    filtered.forEach((p, idx) => {
      const card = document.createElement('div');
      card.className = `roster-card ${p.isHighlighted ? 'highlighted' : ''}`;
      card.setAttribute('data-id', p.id);
      card.setAttribute('data-category', p.category);

      card.innerHTML = `
        <div class="card-number-badge">#${p.number}</div>
        <div class="card-photo-box">
          <img src="${p.photo}" alt="${p.nameEn}" class="card-photo" loading="lazy">
        </div>
        <div class="card-info">
          <h3 class="player-name-en">${p.nameEn}</h3>
          <div class="player-meta-row">
            <span class="player-name-ko">${p.nameKo}</span>
            <span class="player-pos-tag">${p.positionKo}</span>
          </div>
        </div>
      `;

      card.addEventListener('click', () => {
        const fullIndex = PLAYERS_DATA.findIndex(item => item.id === p.id);
        openPlayerModal(fullIndex);
      });

      rosterGrid.appendChild(card);
    });
  }

  // 포지션 필터 버튼 이벤트
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');
      renderRoster(filter);
    });
  });

  renderRoster('all');

  // ============================================================================
  // 4. 선수 상세 모달 (PLAYER DETAIL MODAL)
  // ============================================================================
  const playerModal = document.getElementById('playerModal');
  const modalCloseBtn = document.getElementById('closePlayerModal');
  const modalNavPrev = document.getElementById('modalNavPrev');
  const modalNavNext = document.getElementById('modalNavNext');

  function openPlayerModal(index) {
    if (index < 0) index = PLAYERS_DATA.length - 1;
    if (index >= PLAYERS_DATA.length) index = 0;
    currentModalPlayerIndex = index;

    const p = PLAYERS_DATA[index];
    if (!p) return;

    // 모달 데이터 바인딩
    document.getElementById('modalWatermarkNum').innerText = p.number;
    document.getElementById('modalPlayerImg').src = p.photo;
    document.getElementById('modalPlayerName').innerText = p.nameEn;
    document.getElementById('modalPlayerKo').innerText = `${p.nameKo} · ${p.positionKo} · #${p.number}`;

    // 스탯 수치
    document.getElementById('statPts').innerText = p.pts;
    document.getElementById('statAst').innerText = p.ast;
    document.getElementById('statReb').innerText = p.reb;
    document.getElementById('statStl').innerText = p.stl;

    // 프로필 정보
    document.getElementById('specHeight').innerText = p.height;
    document.getElementById('specWeight').innerText = p.weight;
    document.getElementById('specAge').innerText = p.age;
    document.getElementById('specTeam').innerText = p.team;

    // 최근 뉴스
    const newsContainer = document.getElementById('modalNewsList');
    newsContainer.innerHTML = p.news.map(n => `
      <div class="news-item">
        <span class="news-dot"></span>
        <span>${n}</span>
      </div>
    `).join('');

    // CF 및 방송 출연 썸네일
    const cfContainer = document.getElementById('modalCfGrid');
    cfContainer.innerHTML = p.commercials.map(cf => `
      <div class="cf-card">
        <div class="cf-thumb-wrap">
          <span class="cf-tag">${cf.tag}</span>
          <img src="${cf.img}" alt="${cf.title}" class="cf-thumb-img">
        </div>
        <div class="cf-title">${cf.title}</div>
      </div>
    `).join('');

    // 공식 인스타그램 포스트 피드
    const instaContainer = document.getElementById('modalInstaGrid');
    instaContainer.innerHTML = p.instagramPosts.map(post => `
      <div class="insta-card">
        <img src="${post.img}" alt="Instagram Post" class="insta-img">
        <div class="insta-overlay">
          <div class="insta-likes"><i class="fa-solid fa-heart mr-1"></i> ${post.likes}</div>
          <div class="insta-caption">${post.caption}</div>
        </div>
      </div>
    `).join('');

    // 모달 노출
    playerModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closePlayerModalFunc() {
    playerModal.classList.remove('active');
    document.body.style.overflow = 'auto';
  }

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closePlayerModalFunc);
  if (playerModal) {
    playerModal.addEventListener('click', (e) => {
      if (e.target === playerModal) closePlayerModalFunc();
    });
  }

  if (modalNavPrev) {
    modalNavPrev.addEventListener('click', (e) => {
      e.stopPropagation();
      openPlayerModal(currentModalPlayerIndex - 1);
    });
  }

  if (modalNavNext) {
    modalNavNext.addEventListener('click', (e) => {
      e.stopPropagation();
      openPlayerModal(currentModalPlayerIndex + 1);
    });
  }

  // 키보드 좌우 화살표 & ESC 키 지원
  window.addEventListener('keydown', (e) => {
    if (!playerModal.classList.contains('active')) return;
    if (e.key === 'Escape') closePlayerModalFunc();
    if (e.key === 'ArrowLeft') openPlayerModal(currentModalPlayerIndex - 1);
    if (e.key === 'ArrowRight') openPlayerModal(currentModalPlayerIndex + 1);
  });

  // 영상 재생 시뮬레이션 버튼
  const playBtn = document.getElementById('modalVideoPlayBtn');
  if (playBtn) {
    playBtn.addEventListener('click', () => {
      alert(`${PLAYERS_DATA[currentModalPlayerIndex].nameKo} 선수의 2026 아시안게임 하이라이트 영상이 재생됩니다.`);
    });
  }

  // ============================================================================
  // 5. 통합 서비스 3대 탭 전환 (SERVICES)
  // ============================================================================
  const svcTabBtns = document.querySelectorAll('.svc-tab-btn');
  const svcPanels = document.querySelectorAll('.svc-tab-panel');

  svcTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      svcTabBtns.forEach(b => b.classList.remove('active'));
      svcPanels.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetTab = btn.getAttribute('data-tab');
      const activePanel = document.getElementById(`tab-${targetTab}`);
      if (activePanel) activePanel.classList.add('active');
    });
  });

  // ============================================================================
  // 6. 공식 스토어 굿즈 & 퀵뷰 & 장바구니 (STORE & CART)
  // ============================================================================
  const productsGrid = document.getElementById('productsGrid');
  const productModal = document.getElementById('productModal');
  const closeProdModal = document.getElementById('closeProdModal');
  const cartDrawer = document.getElementById('cartDrawer');
  const cartOverlay = document.getElementById('cartOverlay');
  const closeCartBtn = document.getElementById('closeCartBtn');
  const openCartBtn = document.getElementById('openCartBtn');
  const cartBadge = document.getElementById('cartBadge');
  const cartItemsList = document.getElementById('cartItemsList');
  const cartTotalPrice = document.getElementById('cartTotalPrice');

  let cart = [];
  let currentSelectedProduct = null;
  let currentSelectedSize = 'L';

  // 상품 그리드 렌더링
  function renderProducts() {
    if (!productsGrid) return;
    productsGrid.innerHTML = '';

    PRODUCTS_DATA.forEach(prod => {
      const card = document.createElement('div');
      card.className = 'product-card';
      card.innerHTML = `
        <div class="product-thumb-frame">
          <span class="product-tag-pill">${prod.tag}</span>
          <img src="${prod.image}" alt="${prod.title}" class="product-thumb-img" loading="lazy">
        </div>
        <div class="product-body">
          <div>
            <h3 class="product-title">${prod.title}</h3>
            <p class="product-sub-ko">${prod.titleKo}</p>
          </div>
          <div class="product-bottom-row">
            <span class="product-price">₩${prod.priceStr}</span>
            <button class="product-quick-btn" title="자세히 보기 & 담기">
              <i class="fa-solid fa-arrow-right"></i>
            </button>
          </div>
        </div>
      `;

      card.addEventListener('click', () => openProductQuickView(prod));
      productsGrid.appendChild(card);
    });
  }

  renderProducts();

  // 상품 퀵뷰 모달 오픈
  function openProductQuickView(prod) {
    currentSelectedProduct = prod;
    currentSelectedSize = prod.hasSize ? 'L' : null;

    document.getElementById('prodModalImg').src = prod.image;
    document.getElementById('prodModalTitle').innerText = prod.title;
    document.getElementById('prodModalPrice').innerText = `₩${prod.priceStr}`;
    document.getElementById('prodModalDesc').innerText = prod.description;

    const sizeGroup = document.getElementById('prodModalSizeGroup');
    if (prod.hasSize) {
      sizeGroup.style.display = 'block';
      const sizeOptions = document.getElementById('prodSizeOptions');
      sizeOptions.innerHTML = prod.sizes.map(s => `
        <button class="size-btn ${s === 'L' ? 'active' : ''}" data-size="${s}">${s}</button>
      `).join('');

      sizeOptions.querySelectorAll('.size-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          sizeOptions.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          currentSelectedSize = btn.getAttribute('data-size');
        });
      });
    } else {
      sizeGroup.style.display = 'none';
    }

    productModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  if (closeProdModal) {
    closeProdModal.addEventListener('click', () => {
      productModal.classList.remove('active');
      document.body.style.overflow = 'auto';
    });
  }

  // 장바구니 담기 버튼 이벤트
  const btnAddCart = document.getElementById('btnAddCart');
  if (btnAddCart) {
    btnAddCart.addEventListener('click', () => {
      if (!currentSelectedProduct) return;

      const item = {
        id: currentSelectedProduct.id,
        title: currentSelectedProduct.title,
        price: currentSelectedProduct.price,
        priceStr: currentSelectedProduct.priceStr,
        image: currentSelectedProduct.image,
        size: currentSelectedSize,
        qty: 1
      };

      // 중복 체크
      const existing = cart.find(c => c.id === item.id && c.size === item.size);
      if (existing) {
        existing.qty += 1;
      } else {
        cart.push(item);
      }

      updateCartUI();
      productModal.classList.remove('active');
      document.body.style.overflow = 'auto';

      // 드로어 오픈 안내
      openCartDrawer();
    });
  }

  // 장바구니 UI 갱신
  function updateCartUI() {
    const totalItems = cart.reduce((acc, cur) => acc + cur.qty, 0);
    cartBadge.innerText = totalItems;

    if (cart.length === 0) {
      cartItemsList.innerHTML = `<div class="cart-empty-message"><i class="fa-solid fa-cart-shopping mb-2 text-2xl text-gray-600 block"></i>장바구니에 담긴 상품이 없습니다.</div>`;
      cartTotalPrice.innerText = '₩0';
      return;
    }

    let sum = 0;
    cartItemsList.innerHTML = cart.map((c, i) => {
      sum += c.price * c.qty;
      return `
        <div class="cart-item-row">
          <img src="${c.image}" alt="${c.title}" class="cart-item-img">
          <div class="cart-item-info">
            <div class="cart-item-name">${c.title} ${c.size ? `(${c.size})` : ''}</div>
            <div class="cart-item-price">₩${(c.price * c.qty).toLocaleString()} (x${c.qty})</div>
          </div>
          <button class="cart-item-remove" onclick="removeCartItem(${i})">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </div>
      `;
    }).join('');

    cartTotalPrice.innerText = `₩${sum.toLocaleString()}`;
  }

  // 전역 삭제 함수
  window.removeCartItem = function(index) {
    cart.splice(index, 1);
    updateCartUI();
  };

  function openCartDrawer() {
    cartDrawer.classList.add('active');
    cartOverlay.classList.add('active');
  }

  function closeCartDrawer() {
    cartDrawer.classList.remove('active');
    cartOverlay.classList.remove('active');
  }

  if (openCartBtn) openCartBtn.addEventListener('click', openCartDrawer);
  if (closeCartBtn) closeCartBtn.addEventListener('click', closeCartDrawer);
  if (cartOverlay) cartOverlay.addEventListener('click', closeCartDrawer);

  const btnCheckout = document.getElementById('btnCheckout');
  if (btnCheckout) {
    btnCheckout.addEventListener('click', () => {
      if (cart.length === 0) {
        alert('장바구니에 상품을 먼저 담아주세요.');
        return;
      }
      alert('주문 결제 페이지로 이동합니다. (가상 결제 시뮬레이션)');
      cart = [];
      updateCartUI();
      closeCartDrawer();
    });
  }

  // ============================================================================
  // 7. 공식 후원사 렌더링 (OUR PARTNERS & SPONSORS)
  // ============================================================================
  const sponsorsGrid = document.getElementById('sponsorsGrid');
  if (sponsorsGrid) {
    sponsorsGrid.innerHTML = SPONSORS_DATA.map(sp => `
      <a href="${sp.url}" target="_blank" class="sponsor-card" style="--brand-accent: ${sp.accentColor};" title="${sp.name}">
        <i class="${sp.iconClass} sponsor-icon"></i>
        <h3 class="sponsor-brand-name">${sp.name}</h3>
        <p class="sponsor-role-tag">${sp.role}</p>
      </a>
    `).join('');
  }

  // ============================================================================
  // 8. 고객센터 문의 폼 발송 시뮬레이션 (CONTACT)
  // ============================================================================
  const contactForm = document.getElementById('contactForm');
  const btnSendMessage = document.getElementById('btnSendMessage');
  const formSuccessBanner = document.getElementById('formSuccessBanner');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const origText = btnSendMessage.innerHTML;
      btnSendMessage.innerHTML = `<i class="fa-solid fa-spinner fa-spin mr-2"></i> 전송 중...`;
      btnSendMessage.disabled = true;

      setTimeout(() => {
        btnSendMessage.innerHTML = origText;
        btnSendMessage.disabled = false;
        contactForm.reset();
        formSuccessBanner.classList.add('active');

        setTimeout(() => {
          formSuccessBanner.classList.remove('active');
        }, 5000);
      }, 1200);
    });
  }

  console.log('FINELA Sports Agency Controller successfully initialized.');
});
