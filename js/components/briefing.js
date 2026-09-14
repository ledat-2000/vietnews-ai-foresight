/**
 * VietNews AI Foresight - Executive Briefing Component (60s Speed Briefing)
 */

export function renderExecutiveBriefing(containerEl, briefingData, speechService, onOpenArticle) {
  const bulletTexts = briefingData.bullets.map(b => typeof b === 'string' ? b : b.text);
  const fullTextToRead = `Bản tin tổng hợp Việt Nam 60 giây. ` + bulletTexts.join('. ');

  containerEl.innerHTML = `
    <div class="section-header-row">
      <div class="section-header-title">
        <i data-lucide="clock" class="section-icon"></i>
        <h3>Điểm Tin Nhanh 60 Giây</h3>
      </div>
      <span class="badge badge-cyan">${briefingData.updatedAt}</span>
    </div>

    <div class="executive-bullets-list">
      ${briefingData.bullets.map((bulletObj, idx) => {
        const text = typeof bulletObj === 'string' ? bulletObj : bulletObj.text;
        return `
          <div class="brief-bullet-item" data-idx="${idx}" title="Bấm vào để xem thông tin chi tiết bài viết này">
            <div class="bullet-num">${idx + 1}</div>
            <div class="bullet-text">${text}</div>
            <div class="bullet-action-hint" style="display: flex; align-items: center; gap: 0.3rem; color: var(--accent-cyan); font-size: 0.8rem; font-weight: 600; white-space: nowrap;">
              <span>Xem chi tiết</span>
              <i data-lucide="chevron-right" style="width: 16px; height: 16px;"></i>
            </div>
          </div>
        `;
      }).join('')}
    </div>

    <div class="voice-player-bar">
      <div class="voice-info">
        <i data-lucide="volume-2"></i>
        <span id="voice-status-text">Nghe Bản Tin Âm Thanh AI (Voice Briefing)</span>
      </div>
      <button class="btn btn-violet" id="btn-toggle-voice">
        <i data-lucide="play" id="voice-btn-icon"></i>
        <span id="voice-btn-label">Phát Giọng Nói</span>
      </button>
    </div>
  `;

  // Attach click listener to each bullet item
  containerEl.querySelectorAll('.brief-bullet-item').forEach(itemEl => {
    itemEl.addEventListener('click', () => {
      const idx = parseInt(itemEl.getAttribute('data-idx'), 10);
      const bulletObj = briefingData.bullets[idx];
      const article = typeof bulletObj === 'object' && bulletObj.article ? bulletObj.article : null;
      if (article && typeof onOpenArticle === 'function') {
        onOpenArticle(article);
      }
    });
  });

  // Attach Web Speech Voice Player handlers
  const toggleBtn = containerEl.querySelector('#btn-toggle-voice');
  const btnIcon = containerEl.querySelector('#voice-btn-icon');
  const btnLabel = containerEl.querySelector('#voice-btn-label');
  const statusText = containerEl.querySelector('#voice-status-text');

  speechService.setStateCallback((isPlaying) => {
    if (isPlaying) {
      btnIcon?.setAttribute('data-lucide', 'square');
      if (btnLabel) btnLabel.textContent = 'Dừng Nghe';
      if (statusText) statusText.textContent = '🔊 Đang đọc bản tin tổng hợp bằng giọng nói...';
      toggleBtn?.classList.remove('btn-violet');
      toggleBtn?.classList.add('btn-primary');
    } else {
      btnIcon?.setAttribute('data-lucide', 'play');
      if (btnLabel) btnLabel.textContent = 'Phát Giọng Nói';
      if (statusText) statusText.textContent = 'Nghe Bản Tin Âm Thanh AI (Voice Briefing)';
      toggleBtn?.classList.remove('btn-primary');
      toggleBtn?.classList.add('btn-violet');
    }
    if (window.lucide) window.lucide.createIcons();
  });

  toggleBtn?.addEventListener('click', () => {
    speechService.toggle(fullTextToRead);
  });

  if (window.lucide) window.lucide.createIcons();
}
