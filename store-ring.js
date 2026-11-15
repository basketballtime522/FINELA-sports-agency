/* ==============================================================================
   FINELA STORE — 카테고리 링 + 카테고리 상세 + 상품 상세
   ------------------------------------------------------------------------------
   - #storeRing : 카테고리 8장이 일자(수평) 원통 링으로 돌아간다. 정면 카드를 누르면 상세가 열린다.
   - 카테고리 상세 : 대표 사진칸 + 그 카테고리 상품 목록 (이전/다음 카테고리 이동)
   - 상품 상세   : 사진 갤러리(칸) + 사이즈 + 수량 + 장바구니 (window.FinelaCart, main.js)
   데이터: finela-data.js 의 STORE_CATEGORIES, PRODUCTS_DATA
   조작: 드래그 · 옆 카드 클릭 · 하단 점 · 키보드 ← → / Enter · 상세 창 ESC(상품→카테고리→닫기), ← →
   사진 칸: image / images / 카테고리 photo 가 비어 있으면 "PHOTO" 빈 칸으로 보인다.
   ============================================================================== */
(function () {
  'use strict';

  if (typeof STORE_CATEGORIES === 'undefined' || typeof PRODUCTS_DATA === 'undefined') return;

  const stage = document.getElementById('storeRing');
  const modal = document.getElementById('storeModal');
  const body = document.getElementById('storeModalBody');
  const closeBtn = document.getElementById('storeModalClose');
  if (!stage || !modal || !body) return;

  const CATS = STORE_CATEGORIES;
  const N = CATS.length;
  const THETA = 360 / N;

  const esc = (s) => String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  const pad2 = (n) => String(n).padStart(2, '0');
  const won = (n) => '₩' + Number(n).toLocaleString('en-US');
  const mod = (a, n) => ((a % n) + n) % n;
  const productsOf = (key) => PRODUCTS_DATA.filter((p) => p.category === key);
  const productById = (id) => PRODUCTS_DATA.find((p) => p.id === id);

  // 사진 또는 빈 사진칸
  function photo(src, label, extraClass) {
    const cls = 'sm-photo' + (extraClass ? ' ' + extraClass : '');
    if (src) return `<div class="${cls}"><img src="${esc(src)}" alt="${esc(label || '')}" loading="lazy"></div>`;
    return `<div class="${cls} is-empty"><i class="fa-regular fa-image"></i><span>PHOTO</span></div>`;
  }

  /* ============================================================================
     1) 카테고리 링
     ============================================================================ */
  stage.innerHTML = `
    <div class="sr-viewport" id="srViewport">
      <div class="sr-track" id="srTrack">
        ${CATS.map((c, i) => `
          <div class="sr-card" data-index="${i}" role="button" aria-label="${esc(c.nameKo)} 카테고리 열기">
            <div class="sr-card-photo">${photo(c.photo, c.nameKo)}</div>
            <div class="sr-card-body">
              <span class="sr-card-num">${pad2(i + 1)}</span>
              <div class="sr-card-name">${esc(c.name)}</div>
              <div class="sr-card-ko">${esc(c.nameKo)} · ${c.comingSoon ? 'COMING SOON' : productsOf(c.key).length + '종'}</div>
            </div>
          </div>`).join('')}
      </div>
    </div>
    <div class="sr-caption" id="srCaption" aria-live="polite">
      <div class="sr-cap-text">
        <div class="sr-cap-eyebrow"></div>
        <div class="sr-cap-tagline"></div>
      </div>
      <button type="button" class="sr-cap-btn" id="srOpen">VIEW COLLECTION <i class="fa-solid fa-arrow-right"></i></button>
    </div>
    <div class="sr-dots" id="srDots">
      ${CATS.map((c, i) => `<button type="button" data-dot="${i}" aria-label="${esc(c.nameKo)}"></button>`).join('')}
    </div>`;

  const viewport = document.getElementById('srViewport');
  const track = document.getElementById('srTrack');
  const cards = Array.from(track.querySelectorAll('.sr-card'));
  const capEyebrow = stage.querySelector('.sr-cap-eyebrow');
  const capTagline = stage.querySelector('.sr-cap-tagline');
  const dots = Array.from(stage.querySelectorAll('[data-dot]'));

  let radius = 400;
  let angle = 0;          // 현재 각도
  let target = 0;         // 목표 각도 (THETA 배수로 스냅)
  let activeIdx = -1;
  let dragging = false;
  let dragMoved = 0;
  let dragStartX = 0;
  let dragStartTarget = 0;
  let downCard = null;
  let downActive = 0;
  let lastInteract = 0;     // 마지막으로 직접 조작한 시각 (직후에는 자동 회전을 쉬게 함)
  let hovering = false;
  let visible = true;
  let rafId = 0;

  // 카드 크기에 맞춰 원통 반지름 계산 (카드 사이 간격 포함)
  function layout() {
    const w = cards[0].offsetWidth || 240;
    const gap = Math.max(14, w * 0.1);
    radius = (w + gap) / 2 / Math.tan(Math.PI / N);
    cards.forEach((c, i) => {
      c.style.transform = `rotateY(${i * THETA}deg) translateZ(${radius}px)`;
    });
    viewport.style.perspective = Math.round(radius * 5 + w * 2) + 'px';
    paint();
  }

  function paint() {
    track.style.transform = `translateZ(${-radius}px) rotateY(${angle}deg)`;
    let best = 0;
    let bestAbs = 999;
    cards.forEach((c, i) => {
      let d = mod(i * THETA + angle + 180, 360) - 180;   // -180 ~ 180, 0 = 정면
      const a = Math.abs(d);
      if (a < bestAbs) { bestAbs = a; best = i; }
      const o = a >= 100 ? 0 : Math.max(0.18, Math.cos((a / 100) * (Math.PI / 2)) * 1.0);
      c.style.opacity = o.toFixed(3);
      c.style.pointerEvents = a > 100 ? 'none' : 'auto';
      c.style.zIndex = String(1000 - Math.round(a));
    });
    if (best !== activeIdx) setActive(best);
  }

  function setActive(i) {
    activeIdx = i;
    cards.forEach((c, k) => c.classList.toggle('is-front', k === i));
    dots.forEach((d, k) => d.classList.toggle('active', k === i));
    const c = CATS[i];
    capEyebrow.innerHTML = `<b>${pad2(i + 1)}</b> / ${pad2(N)} &nbsp;·&nbsp; ${esc(c.name)} &nbsp;${esc(c.nameKo)}`;
    capTagline.textContent = c.tagline;
  }

  function tick() {
    const diff = target - angle;
    if (Math.abs(diff) > 0.02) {
      angle += diff * (dragging ? 0.35 : 0.11);
      paint();
    } else if (angle !== target) {
      angle = target;
      paint();
    }
    rafId = requestAnimationFrame(tick);
  }

  const activeFromTarget = () => mod(Math.round(-target / THETA), N);
  function rotateBy(steps) { target = Math.round(target / THETA) * THETA - steps * THETA; }
  function rotateTo(index) {
    // 가장 가까운 방향으로 돌려서 index 를 정면으로
    const cur = activeFromTarget();
    let delta = mod(index - cur + N / 2, N) - N / 2;
    target = Math.round(target / THETA) * THETA - delta * THETA;
  }

  // 클릭한 위치의 카드를 직접 계산한다.
  // (3D로 돌아가는 카드는 브라우저의 클릭 판정이 특정 각도에서 카드를 놓치는 경우가 있어서,
  //  화면에 보이는 카드 중 그 지점을 덮는 것 가운데 가장 정면에 가까운 카드를 고른다)
  function cardAtPoint(x, y) {
    let best = null;
    let bestOpacity = 0.15;
    cards.forEach((c) => {
      const o = parseFloat(c.style.opacity) || 0;
      if (o <= bestOpacity) return;
      const r = c.getBoundingClientRect();
      if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) { best = c; bestOpacity = o; }
    });
    return best;
  }

  // 드래그
  viewport.addEventListener('pointerdown', (e) => {
    if (e.target.closest('.sr-arrow')) return;
    dragging = true;
    dragMoved = 0;
    dragStartX = e.clientX;
    dragStartTarget = target;
    downCard = e.target.closest('.sr-card') || cardAtPoint(e.clientX, e.clientY);
    downActive = activeFromTarget();        // 누른 순간 정면이던 카드 (누르는 사이 자동 회전으로 바뀌어도 기준 유지)
    lastInteract = Date.now();
    viewport.setPointerCapture(e.pointerId);
    viewport.classList.add('is-dragging');
  });
  viewport.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    const dx = e.clientX - dragStartX;
    dragMoved = Math.max(dragMoved, Math.abs(dx));
    target = dragStartTarget + dx * 0.32;
  });
  const endDrag = () => {
    if (!dragging) return;
    dragging = false;
    viewport.classList.remove('is-dragging');
    if (dragMoved < 6) {
      // 클릭: 정면 카드면 열기, 옆 카드면 정면으로 돌리기
      target = Math.round(target / THETA) * THETA;
      if (downCard) {
        // 정면 카드를 누르면 상세 열기, 옆 카드를 누르면 그 카드가 정면으로 이동
        const i = Number(downCard.dataset.index);
        if (i === downActive) openCategory(i);
        else rotateTo(i);
      }
    } else {
      target = Math.round(target / THETA) * THETA;
    }
    downCard = null;
  };
  viewport.addEventListener('pointerup', endDrag);
  viewport.addEventListener('pointercancel', endDrag);

  document.getElementById('srOpen').addEventListener('click', () => openCategory(activeFromTarget()));
  dots.forEach((d) => d.addEventListener('click', () => { lastInteract = Date.now(); rotateTo(Number(d.dataset.dot)); }));

  stage.addEventListener('keydown', (e) => {
    if (modal.classList.contains('active')) return;
    lastInteract = Date.now();
    if (e.key === 'ArrowLeft') { rotateBy(-1); e.preventDefault(); }
    else if (e.key === 'ArrowRight') { rotateBy(1); e.preventDefault(); }
    else if (e.key === 'Enter') { openCategory(activeFromTarget()); e.preventDefault(); }
  });

  stage.addEventListener('mouseenter', () => { hovering = true; });
  stage.addEventListener('mouseleave', () => { hovering = false; });

  // 화면에 보일 때만 천천히 자동으로 다음 카테고리로
  if ('IntersectionObserver' in window) {
    new IntersectionObserver((en) => { visible = en[0].isIntersecting; }, { threshold: 0.5 }).observe(stage);
  }
  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduceMotion) {
    setInterval(() => {
      if (hovering || dragging || !visible || modal.classList.contains('active') || document.hidden) return;
      if (Date.now() - lastInteract < 10000) return;
      rotateBy(1);
    }, 4500);
  }

  window.addEventListener('resize', layout);
  layout();
  rafId = requestAnimationFrame(tick);

  /* ============================================================================
     2) 상세 창 (카테고리 → 상품)
     ============================================================================ */
  let view = null;        // 'category' | 'product'
  let catIndex = 0;
  let prod = null;
  let galIndex = 0;
  let galItems = [];
  let selSize = null;
  let qty = 1;
  let lastFocus = null;
  let catScroll = 0;

  function galleryOf(p) {
    const list = (p.images && p.images.length ? p.images : (p.image ? [p.image] : [])).slice(0, 6);
    while (list.length < 4) list.push('');
    return list;
  }

  // ── 구매 제한 표시 (제한값은 main.js 의 FinelaCart 가 가진다: LIMITED 1개 / 그 외 10개) ──
  const maxOf = (p) => (window.FinelaCart ? window.FinelaCart.maxQty(p) : 10);
  const inCartOf = (p) => (window.FinelaCart ? window.FinelaCart.qtyInCart(p.id) : 0);
  const roomOf = (p) => Math.max(0, maxOf(p) - inCartOf(p));
  function limitText(p) {
    const max = maxOf(p);
    const base = max === 1 ? '1인 1개 한정 구매 상품입니다.' : `상품당 최대 ${max}개까지 구매할 수 있어요.`;
    const have = inCartOf(p);
    return have > 0 ? `${base} (장바구니 ${have}개)` : base;
  }
  function refreshLimit() {
    const el = document.getElementById('smLimit');
    if (el && prod) el.textContent = limitText(prod);
  }

  function productCard(p) {
    return `
      <button type="button" class="sm-pcard" data-product="${p.id}">
        <div class="sm-pcard-photo">
          ${photo(p.image, p.title)}
          <span class="sm-tag">${esc(p.tag)}</span>
        </div>
        <div class="sm-pcard-body">
          <h4>${esc(p.titleKo)}</h4>
          <span class="en">${esc(p.title)}</span>
          <b>${won(p.price)}</b>
        </div>
      </button>`;
  }

  // ── 카테고리 대표 이미지: 그 카테고리 상품 사진을 3.5초마다 돌려 보여 준다(메인 화면 슬라이드처럼 부드럽게 전환) ──
  // 사진이 있는 상품만 넣는다. 사진이 한 장도 없으면 기존처럼 빈 사진칸, 한 장이면 고정.
  const HERO_MS = 3500;   // 1.5초는 너무 빨라서 3.5초로
  let heroTimer = null;
  function stopHero() {
    if (heroTimer) { clearInterval(heroTimer); heroTimer = null; }
  }
  function heroPhotos(c, list) {
    const seen = {};
    const out = [];
    const add = (src) => { if (src && !seen[src]) { seen[src] = true; out.push(src); } };
    add(c.photo);
    list.forEach((p) => {
      (p.images && p.images.length ? p.images : [p.image]).forEach(add);
    });
    return out;
  }
  function heroHtml(c, photos) {
    if (!photos.length) return photo(c.photo, c.nameKo, 'sm-hero-photo');
    return `<div class="sm-photo sm-hero-photo sm-hero-slides" data-hero-slides>
      ${photos.map((src, k) => `<img src="${esc(src)}" alt="${esc(c.nameKo)} ${k + 1}" class="${k === 0 ? 'active' : ''}">`).join('')}
    </div>`;
  }
  function startHero(count) {
    stopHero();
    if (count < 2) return;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let cur = 0;
    heroTimer = setInterval(() => {
      const box = body.querySelector('[data-hero-slides]');
      if (!box || view !== 'category' || !modal.classList.contains('active')) return stopHero();
      if (document.hidden) return;
      const imgs = box.querySelectorAll('img');
      imgs[cur].classList.remove('active');
      cur = (cur + 1) % imgs.length;
      imgs[cur].classList.add('active');
    }, HERO_MS);
  }

  function renderCategory(i, keepScroll) {
    stopHero();
    catIndex = mod(i, N);
    view = 'category';
    const c = CATS[catIndex];
    const list = productsOf(c.key);
    const heroPics = heroPhotos(c, list);
    body.innerHTML = `
      <header class="sm-head">
        <div class="sm-eyebrow">STORE · CATEGORY ${pad2(catIndex + 1)} / ${pad2(N)}</div>
        <h2 class="sm-title" id="storeModalTitle">${esc(c.name)} <span>${esc(c.nameKo)}</span></h2>
        <p class="sm-subtitle">${esc(c.tagline)}</p>
      </header>

      <div class="sm-hero">
        ${heroHtml(c, heroPics)}
        <div class="sm-hero-info">
          <p>${esc(c.desc)}</p>
        </div>
      </div>

      ${c.comingSoon ? `
      <div class="sm-soon">
        <i class="fa-regular fa-clock"></i>
        <strong>COMING SOON</strong>
        <span>콜라보 컬렉션을 준비하고 있어요. 공개되면 이곳에서 만나보세요.</span>
      </div>` : `
      <h3 class="sm-section-title">ALL ITEMS</h3>
      <div class="sm-pgrid">${list.map(productCard).join('')}</div>`}

      `;
    // 이전·다음 카테고리 이동 버튼은 페이지 아래가 아니라 화면 양옆 세로 중앙에 고정(아래 syncCatArrows) — 상품 상세에서는 숨김
    modal.scrollTop = keepScroll ? catScroll : 0;
    startHero(heroPics.length);
    syncCatArrows();
  }

  function renderProduct(p) {
    stopHero();
    prod = p;
    view = 'product';
    syncCatArrows();   // 상품 상세에서는 이전·다음 카테고리 버튼 숨김
    galIndex = 0;
    galItems = galleryOf(p);
    selSize = p.hasSize ? (p.sizes.indexOf('L') >= 0 ? 'L' : p.sizes[0]) : null;
    qty = 1;
    const c = CATS[catIndex];
    const others = productsOf(c.key).filter((x) => x.id !== p.id).slice(0, 4);
    body.innerHTML = `
      <button type="button" class="sm-back" data-back><i class="fa-solid fa-arrow-left"></i> ${esc(c.nameKo)} 목록</button>
      <div class="sm-product">
        <div class="sm-gallery">
          <div class="sm-gallery-main">
            <div class="sm-gallery-slot"></div>
            <button type="button" class="sm-garrow prev" data-gal-step="-1" aria-label="이전 사진"><i class="fa-solid fa-chevron-left"></i></button>
            <button type="button" class="sm-garrow next" data-gal-step="1" aria-label="다음 사진"><i class="fa-solid fa-chevron-right"></i></button>
            <div class="sm-gallery-count"></div>
          </div>
          <div class="sm-thumbs">
            ${galItems.map((g, k) => `<button type="button" class="sm-thumb" data-gal-index="${k}" aria-label="사진 ${k + 1}">${photo(g, '', 'sm-thumb-photo')}</button>`).join('')}
          </div>
        </div>

        <div class="sm-info">
          <div class="sm-eyebrow">${esc(c.name)} · ${esc(p.tag)}</div>
          <h2 class="sm-ptitle" id="storeModalTitle">${esc(p.titleKo)}</h2>
          <div class="sm-pen">${esc(p.title)}</div>
          <div class="sm-price">${won(p.price)}</div>
          <p class="sm-desc">${esc(p.description)}</p>

          ${p.hasSize ? `
          <div class="sm-label">SIZE</div>
          <div class="sm-sizes">
            ${p.sizes.map((s) => `<button type="button" class="sm-size${s === selSize ? ' active' : ''}" data-size="${esc(s)}">${esc(s)}</button>`).join('')}
          </div>` : ''}

          <div class="sm-label">QUANTITY</div>
          <div class="sm-qty">
            <button type="button" data-qty="-1" aria-label="수량 줄이기"><i class="fa-solid fa-minus"></i></button>
            <span id="smQty">1</span>
            <button type="button" data-qty="1" aria-label="수량 늘리기"><i class="fa-solid fa-plus"></i></button>
          </div>

          <p class="sm-limit" id="smLimit">${limitText(p)}</p>

          <button type="button" class="sm-add" data-add><i class="fa-solid fa-cart-plus"></i> ADD TO CART</button>

          <ul class="sm-meta">
            <li><i class="fa-solid fa-truck-fast"></i>5만원 이상 무료배송 (5만원 미만 배송비 3,000원) · 결제 후 3~5일 이내 출고</li>
            <li><i class="fa-solid fa-rotate-left"></i>수령 후 7일 이내 교환·반품 (미착용 상품)</li>
            <li><i class="fa-solid fa-shield-halved"></i>FINELA 공식 스토어 정품</li>
          </ul>
        </div>
      </div>

      ${others.length ? `
      <h3 class="sm-section-title">MORE IN ${esc(c.name)}</h3>
      <div class="sm-pgrid sm-pgrid-small">${others.map(productCard).join('')}</div>` : ''}`;
    showGallery(0);
    modal.scrollTop = 0;
  }

  function showGallery(i) {
    const n = galItems.length;
    galIndex = mod(i, n);
    const slot = body.querySelector('.sm-gallery-slot');
    if (slot) slot.innerHTML = photo(galItems[galIndex], prod ? prod.title : '', 'sm-gallery-photo');
    const cnt = body.querySelector('.sm-gallery-count');
    if (cnt) cnt.textContent = `${galIndex + 1} / ${n}`;
    body.querySelectorAll('.sm-thumb').forEach((t, k) => t.classList.toggle('active', k === galIndex));
  }

  function openCategory(i) {
    renderCategory(i);
    if (!modal.classList.contains('active')) {
      lastFocus = document.activeElement;
      modal.classList.add('active');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
    closeBtn.focus({ preventScroll: true });
    syncCatArrows();
  }

  function close() {
    stopHero();
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    view = null;
    prod = null;
    syncCatArrows();
    // 링을 마지막으로 본 카테고리 위치에 맞춤
    rotateTo(catIndex);
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  }

  function back() {
    if (view === 'product') renderCategory(catIndex, true);
    else close();
  }

  modal.addEventListener('click', (e) => {
    const t = e.target;
    if (t === modal) return back();
    if (t.closest('[data-back]')) return renderCategory(catIndex, true);
    const pc = t.closest('[data-product]');
    if (pc) {
      if (view === 'category') catScroll = modal.scrollTop;
      return renderProduct(productById(Number(pc.dataset.product)));
    }
    const cs = t.closest('[data-cat-step]');
    if (cs) return renderCategory(catIndex + Number(cs.dataset.catStep));
    const gs = t.closest('[data-gal-step]');
    if (gs) return showGallery(galIndex + Number(gs.dataset.galStep));
    const gi = t.closest('[data-gal-index]');
    if (gi) return showGallery(Number(gi.dataset.galIndex));
    const sz = t.closest('[data-size]');
    if (sz) {
      selSize = sz.dataset.size;
      body.querySelectorAll('.sm-size').forEach((b) => b.classList.toggle('active', b === sz));
      return;
    }
    const q = t.closest('[data-qty]');
    if (q) {
      // 담을 수 있는 한도(제한 − 이미 담긴 수량)까지만 올라간다
      const cap = Math.max(1, roomOf(prod));
      const next = qty + Number(q.dataset.qty);
      qty = Math.min(cap, Math.max(1, next));
      const el = document.getElementById('smQty');
      if (el) el.textContent = qty;
      if (next > cap) {
        const lim = document.getElementById('smLimit');
        if (lim) {
          lim.classList.add('is-warn');
          setTimeout(() => lim.classList.remove('is-warn'), 1200);
        }
      }
      return;
    }
    if (t.closest('[data-add]') && prod) {
      const res = window.FinelaCart ? window.FinelaCart.add(prod, selSize, qty) : null;
      const btn = body.querySelector('[data-add]');
      if (btn) {
        const ok = !res || res.status !== 'full';
        const msg = !res || res.status === 'ok'
          ? '<i class="fa-solid fa-check"></i> ADDED'
          : (res.status === 'capped'
              ? `<i class="fa-solid fa-check"></i> 최대 ${res.max}개까지 담았어요`
              : (res.max === 1 ? '<i class="fa-solid fa-ban"></i> 이미 담은 한정 상품이에요'
                               : `<i class="fa-solid fa-ban"></i> 최대 ${res.max}개까지만 담을 수 있어요`));
        btn.classList.toggle('is-added', ok);
        btn.classList.toggle('is-blocked', !ok);
        btn.innerHTML = msg;
        qty = 1;
        const el = document.getElementById('smQty');
        if (el) el.textContent = qty;
        refreshLimit();
        setTimeout(() => {
          btn.classList.remove('is-added', 'is-blocked');
          btn.innerHTML = '<i class="fa-solid fa-cart-plus"></i> ADD TO CART';
        }, 1800);
      }
    }
  });

  // 상품 상세에서 X → 카테고리 상품 목록으로(ESC·뒤로 가기와 동일), 목록에서 X → 창 닫기
  closeBtn.addEventListener('click', back);

  // 장바구니 바로가기 버튼: 상세 창(카테고리·상품)이 열려 있을 때만 오른쪽 아래에 표시, 담긴 개수 표시
  const cartFab = document.getElementById('storeCartFab');
  const cartFabCount = document.getElementById('storeCartFabCount');
  function syncCartFab() {
    if (!cartFab) return;
    cartFab.hidden = !modal.classList.contains('active');
    const n = window.FinelaCart && window.FinelaCart.count ? window.FinelaCart.count() : 0;
    if (cartFabCount) {
      cartFabCount.textContent = n;
      cartFabCount.hidden = n === 0;
    }
  }
  // 이전·다음 카테고리 버튼: 카테고리 목록 화면에서만, 화면 양옆 세로 중앙에 고정(모달 밖에 둠 — 모달의 backdrop-filter 때문)
  // 이동 방향의 카테고리 이름은 따로 표시하지 않는다(툴팁만).
  function syncCatArrows() {
    const show = modal.classList.contains('active') && view === 'category';
    ['storeCatPrev', 'storeCatNext'].forEach((id) => {
      const b = document.getElementById(id);
      if (b) b.hidden = !show;
    });
  }
  [['storeCatPrev', -1], ['storeCatNext', 1]].forEach(([id, dir]) => {
    const b = document.getElementById(id);
    if (b) b.addEventListener('click', () => { if (view === 'category') renderCategory(catIndex + dir); });
  });

  if (cartFab) {
    cartFab.addEventListener('click', () => { if (window.FinelaCart) window.FinelaCart.openDrawer(); });
    new MutationObserver(() => { syncCartFab(); syncCatArrows(); }).observe(modal, { attributes: true, attributeFilter: ['class'] });
    window.addEventListener('finela:cart', syncCartFab);
    syncCartFab();
  }

  // 새로고침 시 보던 화면 복원(page-state.js)에서 쓰는 연결 창구
  window.FinelaStore = {
    close() { if (modal.classList.contains('active')) close(); },
    state() {
      if (!modal.classList.contains('active') || !view) return null;
      return { cat: catIndex, prod: view === 'product' && prod ? prod.id : null };
    },
    restore(s) {
      if (!s || typeof s.cat !== 'number') return;
      const p = s.prod != null ? productById(Number(s.prod)) : null;
      // 저장된 카테고리 번호가 어긋나 있어도 상품이 속한 카테고리로 바로잡아 연다
      const own = p ? CATS.findIndex((c) => c.key === p.category) : -1;
      openCategory(own >= 0 ? own : s.cat);
      if (p) renderProduct(p);
    }
  };

  window.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('active')) return;
    if (e.key === 'Escape') {
      // 장바구니 서랍이 열려 있으면 그쪽이 먼저 닫히도록 둔다
      if (document.body.classList.contains('cart-open')) return;
      e.preventDefault();
      back();
      return;
    }
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      const dir = e.key === 'ArrowLeft' ? -1 : 1;
      if (view === 'product') showGallery(galIndex + dir);
      else if (view === 'category') renderCategory(catIndex + dir);
      e.preventDefault();
    }
  });
})();
