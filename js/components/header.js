/**
 * VietNews AI Foresight - Header Component
 */

export function renderHeader(containerEl, onOracleClick, onRefreshNewsClick) {
  containerEl.innerHTML = `
    <div class="header-inner">
      <div class="brand-wrap">
        <div class="brand-icon-box">
          <i data-lucide="zap"></i>
        </div>
        <div class="brand-title">
          VietNews <span class="accent-text">AI Foresight</span>
        </div>
        <button class="header-status-pill" id="btn-refresh-live-news" title="Bấm để cập nhật lại tin thời gian thực mới nhất">
          <span class="pulse-dot"></span>
          <span id="sync-status-label">Làm Mới Tin Live 🔄</span>
        </button>
      </div>

      <div class="header-actions">
        <button class="btn btn-violet" id="btn-open-oracle-header">
          <i data-lucide="bot"></i>
          <span>Hỏi AI Dự Báo</span>
        </button>

        <button class="btn btn-secondary btn-icon" id="btn-toggle-theme" title="Đổi giao diện">
          <i data-lucide="moon" id="theme-icon"></i>
        </button>
      </div>
    </div>
  `;

  // Attach event listeners
  const oracleBtn = containerEl.querySelector('#btn-open-oracle-header');
  if (oracleBtn && typeof onOracleClick === 'function') {
    oracleBtn.addEventListener('click', onOracleClick);
  }

  const refreshBtn = containerEl.querySelector('#btn-refresh-live-news');
  if (refreshBtn && typeof onRefreshNewsClick === 'function') {
    refreshBtn.addEventListener('click', () => {
      const syncLabel = containerEl.querySelector('#sync-status-label');
      if (syncLabel) syncLabel.textContent = 'Đang đồng bộ... ⏳';
      onRefreshNewsClick().then(() => {
        if (syncLabel) syncLabel.textContent = 'Đã cập nhật tin mới! 🟢';
        setTimeout(() => {
          if (syncLabel) syncLabel.textContent = 'Làm Mới Tin Live 🔄';
        }, 3000);
      });
    });
  }

  const themeBtn = containerEl.querySelector('#btn-toggle-theme');
  const themeIcon = containerEl.querySelector('#theme-icon');
  
  themeBtn?.addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
    if (isDark) {
      document.documentElement.setAttribute('data-theme', 'light');
      themeIcon?.setAttribute('data-lucide', 'sun');
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
      themeIcon?.setAttribute('data-lucide', 'moon');
    }
    if (window.lucide) window.lucide.createIcons();
  });
}

export function renderTickerBanner(containerEl) {
  containerEl.innerHTML = `
    <div class="ticker-tag">
      <i data-lucide="activity"></i> Tín Hiệu Thời Gian Thực
    </div>
    <div class="ticker-content">
      <span class="ticker-item"><strong>Tăng trưởng GDP VN Q3:</strong> <span class="ticker-trend-up">+6.8% 📈</span></span>
      <span class="ticker-item"><strong>Lãi suất vay SXKD:</strong> <span class="ticker-trend-up">5.5% Ổn định ⚖️</span></span>
      <span class="ticker-item"><strong>Đào tạo Kỹ sư Bán dẫn:</strong> <span class="ticker-trend-up">50,000 mục tiêu 🚀</span></span>
      <span class="ticker-item"><strong>Vốn FDI Đăng ký:</strong> <span class="ticker-trend-up">+14.2% YoY 💰</span></span>
      <span class="ticker-item"><strong>Sức hút Thị trường AI VN:</strong> <span class="ticker-trend-up">Dẫn đầu Đông Nam Á ✨</span></span>
      
      <!-- Duplicate for continuous scroll loop -->
      <span class="ticker-item"><strong>Tăng trưởng GDP VN Q3:</strong> <span class="ticker-trend-up">+6.8% 📈</span></span>
      <span class="ticker-item"><strong>Lãi suất vay SXKD:</strong> <span class="ticker-trend-up">5.5% Ổn định ⚖️</span></span>
      <span class="ticker-item"><strong>Đào tạo Kỹ sư Bán dẫn:</strong> <span class="ticker-trend-up">50,000 mục tiêu 🚀</span></span>
    </div>
  `;
}
