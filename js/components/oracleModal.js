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
      Bạn muốn biết xu hướng Chứng Khoán, Giáo Dục, BĐS hay Tin Hot? Đặt câu hỏi ngay với AI Oracle.
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
      text: 'Xin chào! Tôi là AI Oracle. Tôi có thể giải thích chi tiết hơn về các bài báo hoặc đưa ra phán đoán xu hướng tương lai về Chứng Khoán, Giáo Dục, Xã Hội, BĐS và AI cho bạn.'
    }
  ];

  const renderModalContent = () => {
    containerEl.innerHTML = `
      <div class="modal-header">
        <div style="display: flex; align-items: center; gap: 0.6rem;">
          <i data-lucide="bot" style="color: var(--accent-violet); width: 24px; height: 24px;"></i>
          <h2 style="font-size: 1.2rem; font-weight: 800;">Trợ Lý Trí Tuệ Dự Báo AI Oracle</h2>
        </div>
        <button class="modal-close-btn" id="btn-close-oracle">&times;</button>
      </div>

      <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
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
      </div>

      <form class="oracle-input-row" id="oracle-input-form">
        <input type="text" id="oracle-user-input" placeholder="Hỏi AI giải thích sâu hơn (ví dụ: 'Cổ phiếu nào hưởng lợi?')..." required autocomplete="off">
        <button type="submit" class="btn btn-violet">
          <i data-lucide="send"></i>
          <span>Gửi</span>
        </button>
      </form>
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

  const submitQuery = (qText) => {
    chatHistory.push({ sender: 'user', text: qText });
    renderModalContent();

    // Generate AI Prediction
    setTimeout(() => {
      const resultCard = aiEngine.answerOracleQuery(qText);
      chatHistory.push({
        sender: 'ai',
        text: resultCard.predictionVerdict,
        card: resultCard
      });
      renderModalContent();
    }, 400);
  };

  renderModalContent();

  // If initialQuestion is provided, automatically submit it!
  if (initialQuestion) {
    setTimeout(() => {
      submitQuery(initialQuestion);
    }, 200);
  }
}
