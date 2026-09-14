/**
 * VietNews AI Foresight - AI Trends Oracle Modal Component
 */

export function renderOracleCTA(containerEl, onOpenOracle) {
  containerEl.innerHTML = `
    <div style="display: flex; align-items: center; gap: 0.6rem;">
      <i data-lucide="bot" style="color: var(--accent-violet); width: 24px; height: 24px;"></i>
      <h3 class="oracle-cta-title">Hỏi AI Phán Đoán Tương Lai</h3>
    </div>
    <p style="font-size: 0.85rem; color: var(--text-secondary);">
      Bạn muốn biết xu hướng Chứng Khoán, Thị Trường, Giáo Dục hay BĐS? Đặt bất kỳ câu hỏi nào với AI Oracle.
    </p>
    <button class="btn btn-violet" id="btn-launch-oracle-cta" style="width: 100%;">
      <i data-lucide="sparkles"></i>
      <span>Khởi Động AI Oracle</span>
    </button>
  `;

  containerEl.querySelector('#btn-launch-oracle-cta')?.addEventListener('click', () => onOpenOracle());
}

export function openOracleModal(modalBackdropEl, containerEl, aiEngine, initialQuestion = null) {
  let chatHistory = [
    {
      sender: 'ai',
      text: 'Xin chào! Tôi là Trợ lý AI Gemini Flash. Tôi tự động phân tích 100+ tin tức Việt Nam thời gian thực. Hãy đặt bất kỳ câu hỏi nào về thị trường, chứng khoán, bất động sản hoặc cơ hội công nghệ!'
    }
  ];

  let isAnalyzing = false;

  const renderModalContent = () => {
    containerEl.innerHTML = `
      <div class="modal-header">
        <div style="display: flex; align-items: center; gap: 0.6rem;">
          <i data-lucide="bot" style="color: var(--accent-violet); width: 24px; height: 24px;"></i>
          <h2 style="font-size: 1.2rem; font-weight: 800;">Trợ Lý Gemini Flash AI Oracle</h2>
        </div>
        <span class="badge badge-cyan" style="font-size: 0.75rem;">⚡ AI Tự Động 24/7</span>
        <button class="modal-close-btn" id="btn-close-oracle">&times;</button>
      </div>

      <!-- Quick Suggestion Chips -->
      <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
        <button class="cat-tab chip-btn" data-q="Thị trường hôm nay so với tuần trước như thế nào?">📊 Thị trường tuần này vs tuần trước</button>
        <button class="cat-tab chip-btn" data-q="Phán đoán xu hướng Chứng Khoán & VN-Index">📈 Chứng khoán & Cổ phiếu</button>
        <button class="cat-tab chip-btn" data-q="Cơ hội học tập và Kỹ năng AI nâng cao thu nhập">🎓 Giáo dục & Kỹ năng AI</button>
        <button class="cat-tab chip-btn" data-q="Phán đoán xu hướng giá Bất động sản sắp tới">🏢 Thị trường BĐS</button>
      </div>

      <div class="oracle-chat-box" id="oracle-chat-messages">
        ${chatHistory.map(msg => `
          <div class="chat-bubble ${msg.sender === 'user' ? 'user-bubble' : 'ai-bubble'}">
            ${msg.sender === 'ai' && msg.card ? renderAICard(msg.card) : msg.text}
          </div>
        `).join('')}

        ${isAnalyzing ? `
          <div class="chat-bubble ai-bubble" style="display: flex; align-items: center; gap: 0.6rem; color: var(--accent-cyan);">
            <i data-lucide="loader-2" class="spin-animation"></i>
            <span>Gemini Flash đang đọc & suy luận dữ liệu tin tức thời gian thực...</span>
          </div>
        ` : ''}
      </div>

      <form class="oracle-input-row" id="oracle-input-form">
        <input type="text" id="oracle-user-input" placeholder="Hỏi AI bất kỳ câu hỏi nào (ví dụ: 'Thị trường hôm nay...')..." required autocomplete="off">
        <button type="submit" class="btn btn-violet" ${isAnalyzing ? 'disabled' : ''}>
          <i data-lucide="send"></i>
          <span>Gửi</span>
        </button>
      </form>

      <!-- Clean Status Bar (No Key Input Needed!) -->
      <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-subtle); padding-top: 0.75rem; font-size: 0.8rem; color: var(--accent-emerald);">
        <span style="display: flex; align-items: center; gap: 0.4rem;">
          <span class="pulse-dot"></span>
          <span>⚡ Động Cơ Gemini Flash AI Tự Động Phân Tích 24/7 (Không Cần Cài Đặt)</span>
        </span>
      </div>
    `;

    modalBackdropEl.classList.remove('hidden');
    if (window.lucide) window.lucide.createIcons();

    // Scroll chat box to bottom
    const chatBox = containerEl.querySelector('#oracle-chat-messages');
    if (chatBox) chatBox.scrollTop = chatBox.scrollHeight;

    // Attach listeners
    containerEl.querySelector('#btn-close-oracle')?.addEventListener('click', () => {
      modalBackdropEl.classList.add('hidden');
    });

    containerEl.querySelectorAll('.chip-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const query = btn.getAttribute('data-q');
        if (query) submitQuery(query);
      });
    });

    containerEl.querySelector('#oracle-input-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const inputEl = containerEl.querySelector('#oracle-user-input');
      const val = inputEl?.value.trim();
      if (val) submitQuery(val);
    });
  };

  const submitQuery = async (qText) => {
    chatHistory.push({ sender: 'user', text: qText });
    isAnalyzing = true;
    renderModalContent();

    try {
      const resultCard = await aiEngine.answerOracleQuery(qText);
      chatHistory.push({
        sender: 'ai',
        text: resultCard.predictionVerdict,
        card: resultCard
      });
    } catch (err) {
      chatHistory.push({
        sender: 'ai',
        text: 'Có lỗi xảy ra khi kết nối thuật toán AI. Vui lòng thử lại.'
      });
    } finally {
      isAnalyzing = false;
      renderModalContent();
    }
  };

  const renderAICard = (card) => {
    return `
      <div>
        <div style="font-weight: 700; color: var(--accent-cyan); margin-bottom: 0.4rem; display: flex; align-items: center; gap: 0.4rem;">
          <i data-lucide="${card.icon}"></i> ${card.topic} (${card.timeframe})
        </div>
        
        <div style="font-size: 0.82rem; font-weight: 600; color: var(--accent-violet); margin-bottom: 0.25rem;">
          📌 Sự kiện báo chí ghi nhận thời gian thực:
        </div>
        <ul style="padding-left: 1.2rem; margin-bottom: 0.6rem; display: flex; flex-direction: column; gap: 0.3rem;">
          ${card.keyInsights.map(k => `<li>${k}</li>`).join('')}
        </ul>

        <div style="background: rgba(6, 182, 212, 0.12); padding: 0.75rem; border-radius: var(--radius-sm); font-weight: 600; margin-bottom: 0.4rem; line-height: 1.5; color: #fff;">
          🔮 Phán đoán Gemini Flash: ${card.predictionVerdict}
        </div>

        <div style="font-size: 0.85rem; color: #a7f3d0; background: rgba(16, 185, 129, 0.1); padding: 0.5rem; border-radius: var(--radius-sm);">
          💡 Lời khuyên dành cho bạn: ${card.recommendation}
        </div>
      </div>
    `;
  };

  renderModalContent();

  // If initialQuestion is provided, automatically submit it!
  if (initialQuestion) {
    setTimeout(() => {
      submitQuery(initialQuestion);
    }, 200);
  }
}
