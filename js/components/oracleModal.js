/**
 * VietNews AI Foresight - AI Trends Oracle Conversational Modal Component
 */

export function renderOracleCTA(containerEl, onOpenOracle) {
  containerEl.innerHTML = `
    <div style="display: flex; align-items: center; gap: 0.6rem;">
      <i data-lucide="bot" style="color: var(--accent-violet); width: 24px; height: 24px;"></i>
      <h3 class="oracle-cta-title">Trò Chuyện Cùng Gemini Pro AI</h3>
    </div>
    <p style="font-size: 0.85rem; color: var(--text-secondary);">
      Trao đổi & trò chuyện trực tiếp với AI có tư duy sắc bén về Chứng Khoán, BĐS, Kỹ Năng và Thị Trường.
    </p>
    <button class="btn btn-violet" id="btn-launch-oracle-cta" style="width: 100%;">
      <i data-lucide="sparkles"></i>
      <span>Trò Chuyện Cùng AI Tư Duy</span>
    </button>
  `;

  containerEl.querySelector('#btn-launch-oracle-cta')?.addEventListener('click', () => onOpenOracle());
}

export function openOracleModal(modalBackdropEl, containerEl, aiEngine, initialQuestion = null) {
  let chatHistory = [
    {
      sender: 'ai',
      text: 'Chào bạn! Mình là AI Gemini Pro. Mình đã đọc và phân tích toàn bộ dữ liệu tin tức Việt Nam thời gian thực. Bạn muốn trò chuyện hay thảo luận về góc nhìn thị trường, chứng khoán, bất động sản hay kỹ năng nghề nghiệp?'
    }
  ];

  let isAnalyzing = false;

  const renderModalContent = () => {
    containerEl.innerHTML = `
      <div class="modal-header">
        <div style="display: flex; align-items: center; gap: 0.6rem;">
          <i data-lucide="bot" style="color: var(--accent-violet); width: 24px; height: 24px;"></i>
          <h2 style="font-size: 1.2rem; font-weight: 800;">Trò Chuyện Cùng Gemini Pro AI</h2>
        </div>
        <span class="badge badge-violet" style="font-size: 0.75rem;">⚡ AI Tư Duy Thời Gian Thực</span>
        <button class="modal-close-btn" id="btn-close-oracle">&times;</button>
      </div>

      <!-- Quick Conversational Suggestion Chips -->
      <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
        <button class="cat-tab chip-btn" data-q="Bạn nghĩ sao về thị trường tuần này so với tuần trước?">💬 Thị trường tuần này vs tuần trước</button>
        <button class="cat-tab chip-btn" data-q="Nêu đánh giá tư duy của bạn về dòng tiền Chứng Khoán">📈 Đánh giá Chứng khoán</button>
        <button class="cat-tab chip-btn" data-q="Học kỹ năng gì để có lợi thế thu nhập 2026?">🎓 Tư vấn Kỹ năng & Việc làm</button>
        <button class="cat-tab chip-btn" data-q="Phân tích giúp mình xu hướng Bất động sản">🏢 Tư duy thị trường BĐS</button>
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
            <span>Gemini Pro đang suy luận & tổng hợp góc nhìn trò chuyện với bạn...</span>
          </div>
        ` : ''}
      </div>

      <form class="oracle-input-row" id="oracle-input-form">
        <input type="text" id="oracle-user-input" placeholder="Trò chuyện với AI (ví dụ: 'Bạn nghĩ sao về...')..." required autocomplete="off">
        <button type="submit" class="btn btn-violet" ${isAnalyzing ? 'disabled' : ''}>
          <i data-lucide="send"></i>
          <span>Gửi</span>
        </button>
      </form>

      <!-- Status Bar -->
      <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-subtle); padding-top: 0.75rem; font-size: 0.8rem; color: var(--accent-emerald);">
        <span style="display: flex; align-items: center; gap: 0.4rem;">
          <span class="pulse-dot"></span>
          <span>🟢 Gemini Pro AI Conversational Engine - Biết Trò Chuyện & Suy Luận 24/7</span>
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
      const resultCard = await aiEngine.answerOracleQuery(qText, chatHistory);
      chatHistory.push({
        sender: 'ai',
        text: resultCard.predictionVerdict,
        card: resultCard
      });
    } catch (err) {
      chatHistory.push({
        sender: 'ai',
        text: 'Có lỗi xảy ra khi kết nối thuật toán Gemini Pro. Vui lòng thử lại.'
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
          <i data-lucide="${card.icon}"></i> ${card.topic}
        </div>
        
        <div style="font-size: 0.82rem; font-weight: 600; color: var(--accent-violet); margin-bottom: 0.25rem;">
          📌 Dữ liệu báo chí Việt Nam thời gian thực làm căn cứ:
        </div>
        <ul style="padding-left: 1.2rem; margin-bottom: 0.6rem; display: flex; flex-direction: column; gap: 0.3rem; font-size: 0.85rem;">
          ${card.keyInsights.map(k => `<li>${k}</li>`).join('')}
        </ul>

        <div style="background: rgba(6, 182, 212, 0.12); padding: 0.85rem; border-radius: var(--radius-sm); font-size: 0.92rem; line-height: 1.6; color: #fff; white-space: pre-line; margin-bottom: 0.5rem;">
          ${card.predictionVerdict}
        </div>

        <div style="font-size: 0.88rem; color: #a7f3d0; background: rgba(16, 185, 129, 0.12); padding: 0.65rem; border-radius: var(--radius-sm); line-height: 1.5;">
          ${card.recommendation}
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
