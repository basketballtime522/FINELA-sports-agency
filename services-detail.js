/* ==============================================================================
   FINELA SERVICES 상세 창
   ------------------------------------------------------------------------------
   - [data-service-open="center"]  : 퍼포먼스 센터 (내부 사진 갤러리 + 시설 소개 + 코치진 바로가기)
   - [data-service-open="coach"]   : 전담 코치 소개 (사진 · 경력 · 담당 트레이닝, 코치 간 이동)
   - [data-service-open="suite"]   : 프라이빗 숙소 (객실 사진 갤러리 + 객실 특징 + 부대시설)
   - [data-service-open="fnb"]     : 맞춤형 식음료 (음식 사진 갤러리 + 메뉴별 영양 성분표 + 셰프 · 영양사)
   데이터: finela-data.js 의 SERVICE_DETAILS
   조작: 클릭 / Enter · Space 로 열기, ESC 닫기, ← → 사진(코치) 넘기기
   ============================================================================== */
(function () {
  'use strict';

  if (typeof SERVICE_DETAILS === 'undefined') return;

  const modal = document.getElementById('svcModal');
  const body = document.getElementById('svcModalBody');
  const closeBtn = document.getElementById('svcModalClose');
  if (!modal || !body) return;

  const D = SERVICE_DETAILS;
  let gallery = null;          // 현재 열린 갤러리 상태 { items, index, onChange }
  let coachIndex = 0;
  let lastFocus = null;

  // ---------------------------------------------------------------------------
  // 공통 유틸
  // ---------------------------------------------------------------------------
  const esc = (s) => String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

  const thumbOf = (src) => (/\/(center|suite|fnb)\//.test(src) ? src.replace(/\.jpg$/, '_thumb.jpg') : src);

  function head(d) {
    return `
      <header class="svc-head">
        <div class="svc-eyebrow">${esc(d.eyebrow)}</div>
        <h2 class="svc-title" id="svcModalTitle">${esc(d.title)}</h2>
        <p class="svc-subtitle">${esc(d.subtitle)}</p>
      </header>`;
  }

  function stats(list) {
    return `
      <div class="svc-stats">
        ${list.map((s) => `<div class="svc-stat"><strong>${esc(s.value)}</strong><span>${esc(s.label)}</span></div>`).join('')}
      </div>`;
  }

  function sectionTitle(text) {
    return `<h3 class="svc-section-title">${esc(text)}</h3>`;
  }

  // ---------------------------------------------------------------------------
  // 갤러리 (큰 사진 + 좌우 넘김 + 번호 + 캡션 + 썸네일 줄)
  // ---------------------------------------------------------------------------
  function galleryHtml(items) {
    return `
      <div class="svc-gallery">
        <div class="svc-gallery-main">
          <img class="svc-gallery-img" src="${esc(items[0].img)}" alt="${esc(items[0].caption)}">
          <button type="button" class="svc-gallery-arrow prev" data-gallery-step="-1" aria-label="이전 사진"><i class="fa-solid fa-chevron-left"></i></button>
          <button type="button" class="svc-gallery-arrow next" data-gallery-step="1" aria-label="다음 사진"><i class="fa-solid fa-chevron-right"></i></button>
          <div class="svc-gallery-caption"></div>
          <div class="svc-gallery-count"></div>
        </div>
        <div class="svc-gallery-thumbs-wrap">
          <button type="button" class="svc-thumbs-arrow" data-thumbs-step="-1" aria-label="썸네일 이전"><i class="fa-solid fa-chevron-left"></i></button>
          <div class="svc-gallery-thumbs">
            ${items.map((it, i) => `
              <button type="button" class="svc-thumb" data-gallery-index="${i}" aria-label="${esc(it.caption)}">
                <img src="${esc(thumbOf(it.img))}" alt="" loading="lazy">
              </button>`).join('')}
          </div>
          <button type="button" class="svc-thumbs-arrow" data-thumbs-step="1" aria-label="썸네일 다음"><i class="fa-solid fa-chevron-right"></i></button>
        </div>
      </div>`;
  }

  function setupGallery(items, onChange) {
    gallery = { items, index: 0, onChange };
    showGallery(0);
  }

  function showGallery(i) {
    if (!gallery) return;
    const n = gallery.items.length;
    gallery.index = (i + n) % n;
    const it = gallery.items[gallery.index];
    const img = body.querySelector('.svc-gallery-img');
    if (img) {
      img.classList.remove('is-in');
      img.src = it.img;
      img.alt = it.caption;
      requestAnimationFrame(() => img.classList.add('is-in'));
    }
    const cap = body.querySelector('.svc-gallery-caption');
    if (cap) cap.textContent = it.caption;
    const cnt = body.querySelector('.svc-gallery-count');
    if (cnt) cnt.textContent = `${gallery.index + 1} / ${n}`;
    body.querySelectorAll('.svc-thumb').forEach((t, k) => {
      t.classList.toggle('active', k === gallery.index);
      if (k === gallery.index) t.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' });
    });
    if (gallery.onChange) gallery.onChange(it, gallery.index);
  }

  // ---------------------------------------------------------------------------
  // 화면별 렌더링
  // ---------------------------------------------------------------------------
  function renderCenter() {
    const d = D.center;
    body.innerHTML = `
      ${head(d)}
      ${galleryHtml(d.gallery)}
      ${stats(d.stats)}
      ${sectionTitle('트레이닝 존')}
      <div class="svc-zone-grid">
        ${d.zones.map((z) => `
          <div class="svc-zone">
            <div class="svc-zone-icon"><i class="${esc(z.icon)}"></i></div>
            <h4>${esc(z.title)}</h4>
            <p>${esc(z.desc)}</p>
          </div>`).join('')}
      </div>
      ${sectionTitle('전담 코치진')}
      <div class="svc-coach-mini-grid">
        ${D.coaches.map((c, i) => `
          <button type="button" class="svc-coach-mini" data-open-coach="${i}">
            <img src="${esc(c.photo)}" alt="${esc(c.name)} 코치" loading="lazy">
            <span class="role">${esc(c.role)}</span>
            <strong>${esc(c.name)}</strong>
            <span class="more">코치 소개 보기 <i class="fa-solid fa-arrow-right"></i></span>
          </button>`).join('')}
      </div>`;
    setupGallery(d.gallery);
  }

  function renderCoach(i) {
    const list = D.coaches;
    coachIndex = (i + list.length) % list.length;
    const c = list[coachIndex];
    gallery = null;
    body.innerHTML = `
      <header class="svc-head">
        <div class="svc-eyebrow">PERFORMANCE TRAINING · 전담 코치진</div>
        <h2 class="svc-title" id="svcModalTitle">${esc(c.role)}</h2>
      </header>
      <div class="svc-coach">
        <div class="svc-coach-photo">
          <img src="${esc(c.photo)}" alt="${esc(c.name)} 코치">
        </div>
        <div class="svc-coach-info">
          <div class="svc-coach-name">${esc(c.name)} <span>${esc(c.nameEn)}</span></div>
          <div class="svc-coach-title">${esc(c.title)}</div>
          <blockquote class="svc-coach-quote">“${esc(c.quote)}”</blockquote>

          <h4 class="svc-sub-title">주요 경력</h4>
          <ul class="svc-career">
            ${c.career.map((x) => `<li>${esc(x)}</li>`).join('')}
          </ul>

          <h4 class="svc-sub-title">담당 트레이닝</h4>
          <div class="svc-chips">
            ${c.programs.map((x) => `<span class="svc-chip">${esc(x)}</span>`).join('')}
          </div>
        </div>
      </div>
      <nav class="svc-coach-nav" aria-label="코치 이동">
        <button type="button" data-coach-step="-1"><i class="fa-solid fa-chevron-left"></i> 이전 코치</button>
        <div class="svc-coach-dots">
          ${list.map((x, k) => `<button type="button" class="${k === coachIndex ? 'active' : ''}" data-open-coach="${k}" aria-label="${esc(x.role)}"></button>`).join('')}
        </div>
        <button type="button" data-coach-step="1">다음 코치 <i class="fa-solid fa-chevron-right"></i></button>
      </nav>`;
  }

  function renderSuite() {
    const d = D.suite;
    body.innerHTML = `
      ${head(d)}
      ${galleryHtml(d.gallery)}
      ${stats(d.stats)}
      ${sectionTitle('객실 특징')}
      <ul class="svc-feature-list">
        ${d.features.map((f) => `<li><i class="fa-solid fa-circle-check"></i>${esc(f)}</li>`).join('')}
      </ul>
      ${sectionTitle('부대시설 (Amenities)')}
      <div class="svc-amenity-grid">
        ${d.amenities.map((a) => `
          <article class="svc-amenity">
            <div class="svc-amenity-img"><img src="${esc(a.img)}" alt="${esc(a.title)}" loading="lazy"></div>
            <div class="svc-amenity-body">
              <h4><i class="${esc(a.icon)}"></i>${esc(a.title)}</h4>
              <p>${esc(a.desc)}</p>
            </div>
          </article>`).join('')}
      </div>`;
    setupGallery(d.gallery);
  }

  function renderFnb() {
    const d = D.fnb;
    body.innerHTML = `
      ${head(d)}
      <div class="svc-fnb-layout">
        ${galleryHtml(d.gallery)}
        <aside class="svc-nutrition" aria-live="polite">
          <div class="svc-nutrition-tag"></div>
          <h4 class="svc-nutrition-menu"></h4>
          <div class="svc-nutrition-kcal"><strong></strong><span>kcal · 1인분</span></div>
          <div class="svc-nutrition-rows"></div>
          <p class="svc-nutrition-note">※ 선수별 체성분 · 훈련량에 따라 양과 구성이 조정됩니다.</p>
        </aside>
      </div>
      ${sectionTitle('식단 설계 원칙')}
      <ul class="svc-feature-list">
        ${d.principles.map((f) => `<li><i class="fa-solid fa-circle-check"></i>${esc(f)}</li>`).join('')}
      </ul>
      ${sectionTitle('셰프 · 영양사')}
      <div class="svc-staff-grid">
        ${d.staff.map((s) => `
          <article class="svc-staff">
            <div class="svc-staff-photo"><img src="${esc(s.photo)}" alt="${esc(s.name)}" loading="lazy"></div>
            <div class="svc-staff-info">
              <span class="role">${esc(s.role)}</span>
              <div class="name">${esc(s.name)} <small>${esc(s.nameEn)}</small></div>
              <p>${esc(s.desc)}</p>
              <ul class="svc-career">${s.career.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>
            </div>
          </article>`).join('')}
      </div>`;
    setupGallery(d.gallery, renderNutrition);
  }

  // 음식 사진에 맞춰 영양 성분표 갱신 (탄단지 칼로리 비율 막대)
  function renderNutrition(item) {
    const n = item.nutrition;
    if (!n) return;
    body.querySelector('.svc-nutrition-tag').textContent = item.tag || '';
    body.querySelector('.svc-nutrition-menu').textContent = item.caption;
    body.querySelector('.svc-nutrition-kcal strong').textContent = n.kcal.toLocaleString();
    const macroKcal = { protein: n.protein * 4, carbs: n.carbs * 4, fat: n.fat * 9 };
    const sum = macroKcal.protein + macroKcal.carbs + macroKcal.fat || 1;
    const rows = [
      ['단백질', `${n.protein}g`, macroKcal.protein / sum, 'protein'],
      ['탄수화물', `${n.carbs}g`, macroKcal.carbs / sum, 'carbs'],
      ['지방', `${n.fat}g`, macroKcal.fat / sum, 'fat'],
      ['나트륨', `${n.sodium}mg`, Math.min(1, n.sodium / 2000), 'sodium']
    ];
    body.querySelector('.svc-nutrition-rows').innerHTML = rows.map(([label, val, ratio, key]) => `
      <div class="svc-nutrition-row ${key}">
        <div class="top"><span>${label}</span><b>${val}</b><em>${key === 'sodium' ? '1일 권장 대비 ' : '칼로리 '}${Math.round(ratio * 100)}%</em></div>
        <div class="bar"><i style="width:${(ratio * 100).toFixed(1)}%"></i></div>
      </div>`).join('');
  }

  // ---------------------------------------------------------------------------
  // 열기 / 닫기
  // ---------------------------------------------------------------------------
  function open(type, index) {
    if (type === 'center') renderCenter();
    else if (type === 'coach') renderCoach(Number(index) || 0);
    else if (type === 'suite') renderSuite();
    else if (type === 'fnb') renderFnb();
    else return;

    if (!modal.classList.contains('active')) {
      lastFocus = document.activeElement;
      modal.classList.add('active');
      modal.setAttribute('aria-hidden', 'false');
      document.body.classList.add('svc-modal-open');
      document.body.style.overflow = 'hidden';
    }
    modal.scrollTop = 0;
    closeBtn.focus({ preventScroll: true });
  }

  function close() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('svc-modal-open');
    document.body.style.overflow = '';
    gallery = null;
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  }

  // 서비스 카드 클릭 / 키보드
  document.addEventListener('click', (e) => {
    const card = e.target.closest('[data-service-open]');
    if (card && !modal.contains(card)) {
      open(card.dataset.serviceOpen, card.dataset.coachIndex);
    }
  });
  document.addEventListener('keydown', (e) => {
    if ((e.key === 'Enter' || e.key === ' ') && e.target.matches && e.target.matches('[data-service-open]')) {
      e.preventDefault();
      open(e.target.dataset.serviceOpen, e.target.dataset.coachIndex);
    }
  });

  // 상세 창 내부 동작
  modal.addEventListener('click', (e) => {
    const t = e.target;
    if (t === modal) return close(); // 바깥 여백 클릭
    const step = t.closest('[data-gallery-step]');
    if (step) return showGallery(gallery.index + Number(step.dataset.galleryStep));
    const thumb = t.closest('[data-gallery-index]');
    if (thumb) return showGallery(Number(thumb.dataset.galleryIndex));
    const tstep = t.closest('[data-thumbs-step]');
    if (tstep) {
      const strip = body.querySelector('.svc-gallery-thumbs');
      if (strip) strip.scrollBy({ left: strip.clientWidth * 0.8 * Number(tstep.dataset.thumbsStep), behavior: 'smooth' });
      return;
    }
    const coach = t.closest('[data-open-coach]');
    if (coach) return open('coach', coach.dataset.openCoach);
    const cstep = t.closest('[data-coach-step]');
    if (cstep) return renderCoach(coachIndex + Number(cstep.dataset.coachStep));
  });

  closeBtn.addEventListener('click', close);

  window.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('active')) return;
    if (e.key === 'Escape') { e.preventDefault(); close(); return; }
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      const dir = e.key === 'ArrowLeft' ? -1 : 1;
      if (gallery) showGallery(gallery.index + dir);
      else if (body.querySelector('.svc-coach')) renderCoach(coachIndex + dir);
      e.preventDefault();
    }
  });
})();
