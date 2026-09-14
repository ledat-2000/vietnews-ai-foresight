/**
 * VietNews AI Foresight - AI Future Trend Radar Component
 */

export function renderRadar(containerEl, radarTrends) {
  containerEl.innerHTML = `
    <div class="section-header-row">
      <div class="section-header-title">
        <i data-lucide="radar" class="section-icon"></i>
        <h3>Radar Viễn Cảnh Tương Lai AI</h3>
      </div>
      <span class="badge badge-violet">Phán Đoán Thời Gian Thực</span>
    </div>

    <div class="radar-trends-list">
      ${radarTrends.map(trend => `
        <div class="trend-card-item">
          <div class="trend-card-header">
            <h4 class="trend-title">${trend.title}</h4>
            <span class="badge badge-cyan">Độ tin cậy: ${trend.confidence}%</span>
          </div>

          <div class="trend-prediction-text">
            <strong>Dự báo AI:</strong> ${trend.prediction}
          </div>

          <div class="card-top-meta" style="margin-top: 0.25rem;">
            <span class="reading-time">
              <i data-lucide="calendar" style="width:14px; height:14px;"></i> Chu kỳ: ${trend.timeline}
            </span>
            <span class="badge badge-emerald">Mức tác động: ${trend.impact}</span>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}
