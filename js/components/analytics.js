/**
 * VietNews AI Foresight - Visual Analytics & Hot Topics Component
 */

export function renderAnalytics(analyticsContainer, topicsContainer, newsItems, onTopicClick) {
  // Render Analytics Canvas Chart
  const positiveCount = newsItems.filter(i => i.sentiment === 'POSITIVE').length;
  const neutralCount = newsItems.filter(i => i.sentiment === 'NEUTRAL').length;
  const warningCount = newsItems.filter(i => i.sentiment === 'WARNING').length;
  const total = newsItems.length || 1;

  const posPct = Math.round((positiveCount / total) * 100);
  const neuPct = Math.round((neutralCount / total) * 100);
  const warPct = Math.round((warningCount / total) * 100);

  analyticsContainer.innerHTML = `
    <div class="section-header-title">
      <i data-lucide="bar-chart-3" class="section-icon"></i>
      <h3>Chỉ Số Sắc Thái Tin Tức</h3>
    </div>

    <div style="display: flex; flex-direction: column; gap: 0.85rem;">
      <div>
        <div style="display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 0.25rem;">
          <span>📈 Tích cực / Tăng trưởng</span>
          <strong style="color: var(--accent-emerald);">${posPct}% (${positiveCount})</strong>
        </div>
        <div style="width: 100%; height: 8px; background: rgba(255,255,255,0.08); border-radius: 4px; overflow: hidden;">
          <div style="width: ${posPct}%; height: 100%; background: var(--accent-emerald);"></div>
        </div>
      </div>

      <div>
        <div style="display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 0.25rem;">
          <span>⚖️ Trung lập / Theo dõi</span>
          <strong style="color: var(--accent-cyan);">${neuPct}% (${neutralCount})</strong>
        </div>
        <div style="width: 100%; height: 8px; background: rgba(255,255,255,0.08); border-radius: 4px; overflow: hidden;">
          <div style="width: ${neuPct}%; height: 100%; background: var(--accent-cyan);"></div>
        </div>
      </div>

      <div>
        <div style="display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 0.25rem;">
          <span>⚠️ Cần chú ý / Rủi ro</span>
          <strong style="color: var(--accent-amber);">${warPct}% (${warningCount})</strong>
        </div>
        <div style="width: 100%; height: 8px; background: rgba(255,255,255,0.08); border-radius: 4px; overflow: hidden;">
          <div style="width: ${warPct}%; height: 100%; background: var(--accent-amber);"></div>
        </div>
      </div>
    </div>
  `;

  // Render Hot Keywords Cloud
  const hotTopics = [
    { text: 'Chíp Bán Dẫn 🚀', query: 'Bán dẫn' },
    { text: 'AI Tiếng Việt 🤖', query: 'AI' },
    { text: 'Lãi Suất Ưu Đãi 🏦', query: 'Lãi suất' },
    { text: 'Luật Đất Đai 🏢', query: 'Bất động sản' },
    { text: 'Metro & Đổ Bội TOD 🚆', query: 'Đường sắt' },
    { text: 'Xuất Khẩu ESG 🌾', query: 'Xuất khẩu' }
  ];

  topicsContainer.innerHTML = `
    <div class="section-header-title" style="margin-bottom: 0.85rem;">
      <i data-lucide="tag" class="section-icon"></i>
      <h3>Từ Khóa "Nóng" Việt Nam</h3>
    </div>

    <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
      ${hotTopics.map(t => `
        <button class="cat-tab topic-chip" data-query="${t.query}" style="font-size: 0.8rem; padding: 0.4rem 0.85rem;">
          ${t.text}
        </button>
      `).join('')}
    </div>
  `;

  topicsContainer.querySelectorAll('.topic-chip').forEach(btn => {
    btn.addEventListener('click', () => {
      const q = btn.getAttribute('data-query');
      if (q && typeof onTopicClick === 'function') {
        onTopicClick(q);
      }
    });
  });

  if (window.lucide) window.lucide.createIcons();
}
