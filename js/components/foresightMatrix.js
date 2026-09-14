/**
 * VietNews AI Foresight - Actionable Foresight Matrix Component
 */

export function renderForesightMatrix(containerEl, matrixData) {
  containerEl.innerHTML = `
    <div class="section-header-row">
      <div class="section-header-title">
        <i data-lucide="compass" class="section-icon"></i>
        <h3>Ma Trận Tác Động & Gợi Ý Hành Động Cá Nhân</h3>
      </div>
      <span class="badge badge-emerald">Khuyên Dùng Từ AI</span>
    </div>

    <div class="matrix-grid">
      ${matrixData.map(item => `
        <div class="matrix-card">
          <div class="matrix-card-header">
            <div class="matrix-card-title">
              <i data-lucide="${item.icon}" class="accent-text"></i>
              <span>${item.domain}</span>
            </div>
            <span class="badge ${item.badgeClass}">${item.badge}</span>
          </div>

          <h4 style="font-size: 0.98rem; font-weight: 700; color: var(--text-primary);">${item.title}</h4>

          <p style="font-size: 0.88rem; color: var(--text-secondary); line-height: 1.5;">${item.description}</p>

          <div class="action-advice-box">
            <strong>${item.action}</strong>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}
