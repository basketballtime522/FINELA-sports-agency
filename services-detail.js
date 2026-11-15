/* ==============================================================================
   FINELA SERVICES 상세 창
   ------------------------------------------------------------------------------
   - [data-service-open="center"]  : 퍼포먼스 센터 (내부 사진 갤러리 + 시설 소개 + 코치진 바로가기)
   - [data-service-open="coach"]   : 전담 코치 소개 팝업 (사진 · 경력 · 담당 트레이닝)
                                     data-coach-group="physical|skill|mental", 좌우 이동은 같은 카테고리 안에서만
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
  let coachGroupKey = 'physical';
  let coachIndex = 0;
  let lastFocus = null;
  let currentView = null;      // 'center' | 'coach' | 'suite' | 'fnb'
  let returnTo = null;         // 센터 상세 창에서 코치 팝업을 열었을 때: 닫으면 돌아갈 화면 { scroll, index }

  const coachGroup = (key) => D.coachGroups.find((g) => g.key === key) || D.coachGroups[0];

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
    // 선택한 썸네일을 썸네일 줄 가운데로 (줄만 가로로 이동 — 상세 창 전체 스크롤은 건드리지 않음)
    const strip = body.querySelector('.svc-gallery-thumbs');
    body.querySelectorAll('.svc-thumb').forEach((t, k) => {
      t.classList.toggle('active', k === gallery.index);
      if (k === gallery.index && strip) {
        const sr = strip.getBoundingClientRect();
        const tr = t.getBoundingClientRect();
        strip.scrollBy({ left: tr.left - sr.left - (sr.width - tr.width) / 2, behavior: 'smooth' });
      }
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
        ${D.coachGroups.map((g) => `
          <button type="button" class="svc-coach-mini" data-open-coach-group="${esc(g.key)}">
            <img src="${esc(g.coaches[0].photo)}" alt="${esc(g.role)}" loading="lazy">
            <span class="role">${esc(g.role)}</span>
            <strong>${g.coaches.length}명</strong>
            <span class="more">코치 소개 보기 <i class="fa-solid fa-arrow-right"></i></span>
          </button>`).join('')}
      </div>`;
    setupGallery(d.gallery);
  }

  // 코치 소개 팝업 (화면 중앙) — 좌우 이동은 같은 카테고리 안에서만
  function renderCoach(groupKey, i) {
    const g = coachGroup(groupKey);
    coachGroupKey = g.key;
    const list = g.coaches;
    coachIndex = ((Number(i) || 0) % list.length + list.length) % list.length;
    const c = list[coachIndex];
    gallery = null;
    body.innerHTML = `
      <div class="svc-popup" role="document">
        <button type="button" class="svc-popup-close" data-svc-close aria-label="닫기"><i class="fa-solid fa-xmark"></i></button>
        <button type="button" class="svc-popup-arrow prev" data-coach-step="-1" aria-label="이전 코치"><i class="fa-solid fa-chevron-left"></i></button>
        <button type="button" class="svc-popup-arrow next" data-coach-step="1" aria-label="다음 코치"><i class="fa-solid fa-chevron-right"></i></button>

        <header class="svc-popup-head">
          <div class="svc-eyebrow">PERFORMANCE TRAINING · 전담 코치진</div>
          <h2 class="svc-popup-title" id="svcModalTitle">${esc(g.role)}</h2>
          <div class="svc-popup-count">${coachIndex + 1} / ${list.length}</div>
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

        <div class="svc-coach-dots" aria-label="${esc(g.role)} 코치 목록">
          ${list.map((x, k) => `<button type="button" class="${k === coachIndex ? 'active' : ''}" data-coach-jump="${k}" aria-label="${esc(x.name)}"></button>`).join('')}
        </div>
      </div>`;
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
  function open(type, arg) {
    if (type === 'center') renderCenter();
    else if (type === 'coach') renderCoach(arg, 0);
    else if (type === 'suite') renderSuite();
    else if (type === 'fnb') renderFnb();
    else return;

    // 상세 창 뒤에 깔린 SERVICES 탭을 그 상세 창이 속한 탭에 맞춘다
    // (숙소·식음료 → Premium Accommodation / 센터·코치 → Performance Training).
    // 닫았을 때 엉뚱한 탭이 보이거나 새로고침 후 트레이닝 탭으로 고정되는 문제를 막는다.
    var tabKey = (type === 'suite' || type === 'fnb') ? 'accommodation' : 'training';
    var tabBtn = document.querySelector('.svc-tab-btn[data-tab="' + tabKey + '"]');
    if (tabBtn && !tabBtn.classList.contains('active')) tabBtn.click();

    // 코치는 화면 중앙 팝업, 나머지는 전체화면 상세 창
    currentView = type;
    modal.classList.toggle('is-popup', type === 'coach');

    if (!modal.classList.contains('active')) {
      lastFocus = document.activeElement;
      modal.classList.add('active');
      modal.setAttribute('aria-hidden', 'false');
      document.body.classList.add('svc-modal-open');
      document.body.style.overflow = 'hidden';
    }
    modal.scrollTop = 0;
    const focusTarget = modal.classList.contains('is-popup') ? body.querySelector('[data-svc-close]') : closeBtn;
    if (focusTarget) focusTarget.focus({ preventScroll: true });
  }

  function close() {
    modal.classList.remove('active');
    modal.classList.remove('is-popup');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('svc-modal-open');
    document.body.style.overflow = '';
    gallery = null;
    currentView = null;
    returnTo = null;
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  }

  // 코치 팝업 닫기: 센터 상세 창에서 열었다면 센터 상세 창으로 복귀, 아니면 완전히 닫기
  function closeOrReturn() {
    if (currentView === 'coach' && returnTo) {
      const r = returnTo;
      returnTo = null;
      renderCenter();
      currentView = 'center';
      modal.classList.remove('is-popup');
      showGallery(r.index);          // 보던 사진 복원
      modal.scrollTop = r.scroll;    // 스크롤 위치 복원
      closeBtn.focus({ preventScroll: true });
      return;
    }
    close();
  }

  // 서비스 카드 클릭 / 키보드 (서비스 탭 화면에서 직접 열기 — 닫으면 탭 화면으로)
  document.addEventListener('click', (e) => {
    const card = e.target.closest('[data-service-open]');
    if (card && !modal.contains(card)) {
      returnTo = null;
      open(card.dataset.serviceOpen, card.dataset.coachGroup);
    }
  });
  document.addEventListener('keydown', (e) => {
    if ((e.key === 'Enter' || e.key === ' ') && e.target.matches && e.target.matches('[data-service-open]')) {
      e.preventDefault();
      returnTo = null;
      open(e.target.dataset.serviceOpen, e.target.dataset.coachGroup);
    }
  });

  // 상세 창 내부 동작
  modal.addEventListener('click', (e) => {
    const t = e.target;
    // 바깥 여백 클릭 시 닫기 (팝업은 팝업 카드 바깥 전체가 여백)
    if (t === modal || (t === body && modal.classList.contains('is-popup'))) return closeOrReturn();
    if (t.closest('[data-svc-close]')) return closeOrReturn();
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
    const group = t.closest('[data-open-coach-group]');
    if (group) {
      // 센터 상세 창에서 연 코치 팝업: 닫으면 이 화면(스크롤·사진 위치 포함)으로 돌아오도록 기억
      if (currentView === 'center') {
        returnTo = { scroll: modal.scrollTop, index: gallery ? gallery.index : 0 };
      }
      return open('coach', group.dataset.openCoachGroup);
    }
    const cstep = t.closest('[data-coach-step]');
    if (cstep) return renderCoach(coachGroupKey, coachIndex + Number(cstep.dataset.coachStep));
    const jump = t.closest('[data-coach-jump]');
    if (jump) return renderCoach(coachGroupKey, Number(jump.dataset.coachJump));
  });

  closeBtn.addEventListener('click', close);

  // 새로고침 시 보던 화면 복원(page-state.js)에서 쓰는 연결 창구
  window.FinelaServices = {
    state() {
      if (!modal.classList.contains('active') || !currentView) return null;
      return { type: currentView, group: coachGroupKey, index: coachIndex };
    },
    restore(s) {
      if (!s || !s.type) return;
      returnTo = null;
      if (s.type === 'coach') {
        open('coach', s.group);
        if (typeof s.index === 'number') renderCoach(s.group, s.index);
      } else {
        open(s.type);
      }
    }
  };

  window.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('active')) return;
    if (e.key === 'Escape') { e.preventDefault(); closeOrReturn(); return; }
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      const dir = e.key === 'ArrowLeft' ? -1 : 1;
      if (gallery) showGallery(gallery.index + dir);
      else if (body.querySelector('.svc-coach')) renderCoach(coachGroupKey, coachIndex + dir);
      e.preventDefault();
    }
  });
})();
