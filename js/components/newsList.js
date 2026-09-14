/**
 * VietNews AI Foresight - News Feed & Categorized Sections Component
 */

import { NEWS_CATEGORIES, NEWS_SOURCES, SENTIMENT_TYPES } from '../types.js';

export function renderCategoryNav(containerEl, currentCategory, onSelectCategory) {
  containerEl.innerHTML = NEWS_CATEGORIES.map(cat => `
    <button class="cat-tab ${cat.id === currentCategory ? 'active' : ''}" data-cat="${cat.id}">
      <i data-lucide="${cat.icon}"></i>
      <span>${cat.name}</span>
    </button>
  `).join('');

  containerEl.querySelectorAll('.cat-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      const catId = btn.getAttribute('data-cat');
      if (catId && typeof onSelectCategory === 'function') {
        onSelectCategory(catId);
      }
    });
  });

  if (window.lucide) window.lucide.createIcons();
}

function renderNewsCardHTML(item) {
  const sourceObj = NEWS_SOURCES.find(s => s.name === item.source) || { badgeClass: 'badge-cyan' };
  const sentimentObj = SENTIMENT_TYPES[item.sentiment] || SENTIMENT_TYPES.NEUTRAL;

  return `
    <article class="news-card" data-id="${item.id}">
      <div>
        <div class="card-top-meta">
          <span class="source-badge ${sourceObj.badgeClass}">${item.source}</span>
          <span class="published-time">${item.pubDate}</span>
        </div>

        <h3 class="news-card-title" style="margin-top: 0.75rem;">${item.title}</h3>

        <div class="news-quick-summary" style="margin-top: 0.85rem;">
          <div class="summary-header">
            <i data-lucide="zap" style="width: 14px; height: 14px;"></i> Tóm tắt nhanh 10 giây
          </div>
          <ul style="padding-left: 1.2rem; margin-top: 0.3rem;">
            ${item.summaryBullets.map(b => `<li>${b}</li>`).join('')}
          </ul>
        </div>
      </div>

      <div>
        <div style="background: rgba(139, 92, 246, 0.08); border-radius: var(--radius-sm); padding: 0.5rem 0.75rem; font-size: 0.82rem; color: #ddd6fe; margin-bottom: 0.85rem;">
          <strong>🔮 Dự báo tương lai:</strong> ${item.aiImpactNote}
        </div>

        <div class="card-bottom-actions">
          <span class="badge ${sentimentObj.class}">
            ${sentimentObj.emoji} ${sentimentObj.label}
          </span>

          <span class="reading-time">
            <i data-lucide="arrow-right-circle" style="width: 14px; height: 14px; color: var(--accent-cyan);"></i> Xem chi tiết
          </span>
        </div>
      </div>
    </article>
  `;
}

export function renderNewsGrid(gridEl, newsItems, currentCategory, onOpenReaderModal, onSelectCategory) {
  if (!newsItems || newsItems.length === 0) {
    gridEl.innerHTML = `
      <div class="card glass-card" style="grid-column: 1 / -1; text-align: center; padding: 3rem 1.5rem;">
        <i data-lucide="search-x" style="width: 48px; height: 48px; color: var(--text-muted); margin-bottom: 1rem;"></i>
        <h3>Không tìm thấy bài viết trong mục này</h3>
        <p style="color: var(--text-muted); font-size: 0.9rem; margin-top: 0.5rem;">Đang đồng bộ dữ liệu RSS mới nhất cho danh mục. Vui lòng chọn danh mục khác.</p>
      </div>
    `;
    if (window.lucide) window.lucide.createIcons();
    return;
  }

  // If a specific category tab is selected (not 'ALL'), render focused category section
  if (currentCategory !== 'ALL') {
    const catMeta = NEWS_CATEGORIES.find(c => c.id === currentCategory) || { name: 'Danh Mục Tin Tức', icon: 'folder' };
    
    gridEl.innerHTML = `
      <div class="category-block-section" style="width: 100%;">
        <div class="category-block-header">
          <div class="section-title-wrap">
            <i data-lucide="${catMeta.icon}" class="section-icon" style="width: 24px; height: 24px;"></i>
            <h2 style="font-size: 1.25rem; font-weight: 800;">Mục: ${catMeta.name}</h2>
            <span class="badge badge-cyan">${newsItems.length} bài viết</span>
          </div>
        </div>

        <div class="news-cards-grid" style="margin-top: 1rem;">
          ${newsItems.map(item => renderNewsCardHTML(item)).join('')}
        </div>
      </div>
    `;
  } else {
    // If 'ALL' is selected, render PRE-DIVIDED CATEGORY SECTIONS!
    const displayCategories = NEWS_CATEGORIES.filter(c => c.id !== 'ALL');

    gridEl.innerHTML = displayCategories.map(cat => {
      const catItems = newsItems.filter(item => item.category === cat.id);
      if (catItems.length === 0) return '';

      return `
        <section class="category-block-section" id="section-cat-${cat.id}" style="margin-bottom: 2rem;">
          <div class="category-block-header" style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid var(--border-subtle); padding-bottom: 0.75rem; margin-bottom: 1rem;">
            <div class="section-title-wrap" style="display: flex; align-items: center; gap: 0.6rem;">
              <i data-lucide="${cat.icon}" class="section-icon" style="width: 22px; height: 22px; color: var(--accent-cyan);"></i>
              <h2 style="font-size: 1.2rem; font-weight: 800;">${cat.name}</h2>
              <span class="badge badge-violet">${catItems.length} tin</span>
            </div>

            <button class="cat-view-all-btn btn btn-secondary" data-cat="${cat.id}" style="font-size: 0.8rem; padding: 0.35rem 0.85rem;">
              <span>Xem tất cả mục này</span>
              <i data-lucide="chevron-right"></i>
            </button>
          </div>

          <div class="news-cards-grid">
            ${catItems.slice(0, 4).map(item => renderNewsCardHTML(item)).join('')}
          </div>
        </section>
      `;
    }).join('');
  }

  // Attach card click handlers to open Quick Reader Modal
  gridEl.querySelectorAll('.news-card').forEach(cardEl => {
    cardEl.addEventListener('click', () => {
      const id = cardEl.getAttribute('data-id');
      const item = newsItems.find(n => n.id === id);
      if (item && typeof onOpenReaderModal === 'function') {
        onOpenReaderModal(item);
      }
    });
  });

  // Attach "Xem tất cả mục này" buttons
  gridEl.querySelectorAll('.cat-view-all-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const catId = btn.getAttribute('data-cat');
      if (catId && typeof onSelectCategory === 'function') {
        onSelectCategory(catId);
        window.scrollTo({ top: 400, behavior: 'smooth' });
      }
    });
  });

  if (window.lucide) window.lucide.createIcons();
}

export function openReaderModal(modalBackdropEl, containerEl, item, onAskAIDeeper) {
  const sourceObj = NEWS_SOURCES.find(s => s.name === item.source) || { badgeClass: 'badge-cyan' };
  const sentimentObj = SENTIMENT_TYPES[item.sentiment] || SENTIMENT_TYPES.NEUTRAL;

  containerEl.innerHTML = `
    <div class="modal-header">
      <div style="display: flex; align-items: center; gap: 0.6rem;">
        <span class="source-badge ${sourceObj.badgeClass}">${item.source}</span>
        <span class="badge ${sentimentObj.class}">${sentimentObj.emoji} ${sentimentObj.label}</span>
      </div>
      <button class="modal-close-btn" id="btn-close-reader-modal">&times;</button>
    </div>

    <h2 style="font-size: 1.35rem; font-weight: 800; line-height: 1.3;">${item.title}</h2>
    
    <div style="font-size: 0.85rem; color: var(--text-muted); display: flex; gap: 1rem;">
      <span>Thời gian: ${item.pubDate}</span>
      <span>|</span>
      <span>Thời lượng: ${item.readTime}</span>
    </div>

    <div style="background: rgba(6, 182, 212, 0.08); border: 1px solid var(--border-active); border-radius: var(--radius-md); padding: 1rem;">
      <h4 style="color: var(--accent-cyan); font-size: 0.95rem; font-weight: 700; margin-bottom: 0.5rem;">
        ⚡ Tóm Tắt Nhanh (3 Điểm Chính)
      </h4>
      <ul style="padding-left: 1.25rem; font-size: 0.9rem; color: var(--text-primary); display: flex; flex-direction: column; gap: 0.4rem;">
        ${item.summaryBullets.map(b => `<li>${b}</li>`).join('')}
      </ul>
    </div>

    <div style="font-size: 0.95rem; color: var(--text-secondary); line-height: 1.65; white-space: pre-line;">
      ${item.fullContent}
    </div>

    <div style="background: rgba(139, 92, 246, 0.12); border-left: 4px solid var(--accent-violet); padding: 1rem; border-radius: var(--radius-sm); display: flex; flex-direction: column; gap: 0.6rem;">
      <h4 style="color: var(--accent-violet); font-size: 0.95rem; font-weight: 700;">
        🔮 Phán Đoán & Dự Báo Tương Lai AI
      </h4>
      <p style="font-size: 0.9rem; color: #ddd6fe;">${item.aiImpactNote}</p>
    </div>

    <!-- Interactive AI Explainer CTA -->
    <div style="background: linear-gradient(135deg, rgba(6, 182, 212, 0.15), rgba(139, 92, 246, 0.15)); border: 1px solid var(--border-violet); border-radius: var(--radius-md); padding: 1rem; display: flex; align-items: center; justify-content: space-between; gap: 1rem;">
      <div style="font-size: 0.88rem; color: var(--text-primary);">
        🤔 <strong>Bạn chưa hiểu hoặc muốn tìm hiểu sâu hơn?</strong>
        <div style="color: var(--text-secondary); font-size: 0.8rem;">Hỏi AI Oracle để giải thích chi tiết ý nghĩa và tác động cho bạn.</div>
      </div>
      <button class="btn btn-violet" id="btn-ask-ai-deeper">
        <i data-lucide="bot"></i>
        <span>Hỏi AI Giải Thích</span>
      </button>
    </div>

    <div style="display: flex; justify-content: flex-end; gap: 1rem; margin-top: 0.5rem;">
      <button class="btn btn-secondary" id="btn-close-reader-footer">Đóng</button>
      <a href="${item.link}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">
        <span>Xem bài gốc trên ${item.source}</span>
        <i data-lucide="external-link"></i>
      </a>
    </div>
  `;

  modalBackdropEl.classList.remove('hidden');
  if (window.lucide) window.lucide.createIcons();

  const closeModal = () => modalBackdropEl.classList.add('hidden');
  containerEl.querySelector('#btn-close-reader-modal')?.addEventListener('click', closeModal);
  containerEl.querySelector('#btn-close-reader-footer')?.addEventListener('click', closeModal);

  containerEl.querySelector('#btn-ask-ai-deeper')?.addEventListener('click', () => {
    closeModal();
    if (typeof onAskAIDeeper === 'function') {
      onAskAIDeeper(item);
    }
  });
}
