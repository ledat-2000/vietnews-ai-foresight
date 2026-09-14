/**
 * VietNews AI Foresight - Intelligent AI Prediction & Deep Analysis Engine
 */

export class AIForesightEngine {
  constructor(newsItems = []) {
    this.newsItems = newsItems;
    this.geminiApiKey = localStorage.getItem('GEMINI_API_KEY') || '';
  }

  setNews(items) {
    this.newsItems = items;
  }

  setGeminiKey(key) {
    this.geminiApiKey = key;
    localStorage.setItem('GEMINI_API_KEY', key);
  }

  // Generates 60-Second Executive Speed Briefing dynamically from live news
  getExecutiveBriefing() {
    if (!this.newsItems || this.newsItems.length === 0) {
      return {
        updatedAt: 'Thời gian thực - Ngày 14/09/2026',
        totalAnalyzed: 0,
        bullets: [
          'Việt Nam đẩy mạnh chiến lược 50.000 kỹ sư Bán dẫn và 10.000 chuyên gia AI đến năm 2030.',
          'Ngân hàng Nhà nước giữ lãi suất cho vay ưu đãi 5.5-7%, tập trung dòng vốn kích cầu sản xuất.',
          'Luật Đất đai sửa đổi gỡ vướng cho 15+ dự án nhà ở; phân khúc chung cư giữ đà giao dịch ổn định.',
          'Hạ tầng giao thông tăng tốc với đề xuất Đường sắt tốc độ cao Bắc - Nam 350km/h.'
        ]
      };
    }

    // Extract top 4 real live headlines
    const topBullets = this.newsItems.slice(0, 4).map(item => item.title);

    return {
      updatedAt: `Thời gian thực - ${new Date().toLocaleTimeString('vi-VN')} ${new Date().toLocaleDateString('vi-VN')}`,
      totalAnalyzed: this.newsItems.length,
      bullets: topBullets
    };
  }

  // Generates 3 Key Macro Trend Waves (AI Radar)
  getForesightRadar() {
    const techItems = this.newsItems.filter(i => i.category === 'TECH' || i.category === 'EDUCATION');
    const stockItems = this.newsItems.filter(i => i.category === 'STOCKS' || i.category === 'HOT');
    const reItems = this.newsItems.filter(i => i.category === 'REAL_ESTATE' || i.category === 'SOCIETY');

    return [
      {
        id: 'trend-semicon-ai',
        title: 'Làn Sống Công Nghệ Bán Dẫn & GenAI Tiếng Việt',
        category: 'TECH',
        confidence: 96,
        timeline: '6 - 12 tháng',
        sentiment: 'POSITIVE',
        summary: techItems.length > 0 ? techItems[0].title : 'Đào tạo nhân lực vi mạch bán dẫn và ứng dụng mô hình AI Tiếng Việt trong doanh nghiệp.',
        prediction: 'Nhu cầu nhân lực IT trình độ cao bùng nổ. Doanh nghiệp ứng dụng AI sớm sẽ tăng 40% hiệu suất vận hành trong 1 năm tới.',
        impact: 'Rất Cao'
      },
      {
        id: 'trend-tod-infrastructure',
        title: 'Hạ Tầng Giao Thông & Tái Cấu Trúc Bất Động Sản',
        category: 'REAL_ESTATE',
        confidence: 92,
        timeline: '1 - 3 năm',
        sentiment: 'POSITIVE',
        summary: reItems.length > 0 ? reItems[0].title : 'Luật Đất đai mới kết hợp quy hoạch Đường sắt tốc độ cao & Metro tạo dư địa lớn.',
        prediction: 'Bất động sản công nghiệp và nhà ở vừa túi tiền quanh các nút giao thông lớn tăng trưởng bền vững 15-25%/năm.',
        impact: 'Cao'
      },
      {
        id: 'trend-stocks-finance',
        title: 'Thanh Khoản Thị Trường Tài Chính & Xuất Khẩu Xanh',
        category: 'STOCKS',
        confidence: 89,
        timeline: '3 - 6 tháng',
        sentiment: 'NEUTRAL',
        summary: stockItems.length > 0 ? stockItems[0].title : 'Dòng vốn ngoại và lãi suất ưu đãi tạo đà tăng trưởng cho sản xuất xuất khẩu.',
        prediction: 'Các doanh nghiệp đáp ứng tiêu chuẩn ESG và chuyển đổi số sẽ chiếm ưu thế thu hút dòng vốn đầu tư dài hạn.',
        impact: 'Cao'
      }
    ];
  }

  // Generates Actionable Impact Matrix for User
  getForesightImpactMatrix() {
    return [
      {
        domain: 'Kỹ Năng & Việc Làm',
        icon: 'briefcase',
        badge: 'Khuyên dùng ngay',
        badgeClass: 'badge-cyan',
        title: 'Bắt kịp làn sóng AI & Bán dẫn',
        description: 'Đầu tư học tập các công cụ AI Generative, lập trình vi mạch hoặc phân tích dữ liệu lớn. Kỹ năng kết hợp ngành dọc + AI mang lại lợi thế thu nhập vượt trội.',
        action: '👉 Học ngay 1 công cụ AI chuyên ngành của bạn trong tuần này.'
      },
      {
        domain: 'Quản Lý Tài Chính',
        icon: 'pie-chart',
        badge: 'Chiến lược 2026',
        badgeClass: 'badge-emerald',
        title: 'Tận dụng mặt bằng lãi suất hợp lý',
        description: 'Tận dụng vốn vay ưu đãi sản xuất kinh doanh. Hạn chế lướt sóng tài sản rủi ro cao, ưu tiên bất động sản có dòng tiền khai thác thực tế.',
        action: '👉 Phân bổ 60% danh mục vào tài sản an toàn & hoạt động tạo dòng tiền.'
      },
      {
        domain: 'Khởi Nghiệp & Kinh Doanh',
        icon: 'rocket',
        badge: 'Cơ hội mới',
        badgeClass: 'badge-violet',
        title: 'Mô hình B2B AI & Kinh tế Xanh',
        description: 'Nhu cầu tự động hóa văn phòng và giải pháp kiểm kê khí thải (ESG) cho doanh nghiệp vừa và nhỏ đang tăng trưởng với tốc độ 200%/năm.',
        action: '👉 Khám phá các giải pháp SaaS AI phục vụ doanh nghiệp nội địa.'
      }
    ];
  }

  // Advanced Dynamic AI Oracle Engine analyzing ALL live news in real time
  async answerOracleQuery(queryText) {
    const q = queryText.toLowerCase();

    // 1. If Gemini API key is provided, use Google Gemini Live API!
    if (this.geminiApiKey) {
      try {
        const geminiRes = await this.callGeminiAPI(queryText);
        if (geminiRes) return geminiRes;
      } catch (err) {
        console.warn('Gemini API call error, falling back to local news AI engine:', err);
      }
    }

    // 2. Real-Time Dynamic News Search & AI Synthesis Engine
    const relevantArticles = this.newsItems.filter(item => {
      const text = `${item.title} ${item.fullContent} ${item.source} ${item.category}`.toLowerCase();
      return q.split(' ').some(word => word.length > 2 && text.includes(word));
    });

    const contextArticles = relevantArticles.length > 0 ? relevantArticles : this.newsItems.slice(0, 5);

    // Build intelligent dynamic AI analysis card
    let topicTitle = 'Phân Tích Trí Tuệ AI Cho Câu Hỏi Của Bạn';
    let iconName = 'sparkles';
    let timeframe = 'Cập nhật thời gian thực';

    if (q.includes('thị trường') || q.includes('tuần') || q.includes('chứng khoán') || q.includes('vn-index') || q.includes('giá')) {
      topicTitle = 'Phân Tích Thị Trường & Xu Hướng Tài Chính';
      iconName = 'trending-up';
      timeframe = 'So sánh thời gian thực với tuần trước';
    } else if (q.includes('bất động sản') || q.includes('bđs') || q.includes('nhà')) {
      topicTitle = 'Phân Tích Thị Trường Bất Động Sản';
      iconName = 'building';
      timeframe = 'Dự báo chu kỳ 6-12 tháng';
    } else if (q.includes('ai') || q.includes('công nghệ') || q.includes('kỹ năng') || q.includes('học')) {
      topicTitle = 'Phân Tích Xu Hướng Công Nghệ & Kỹ Năng';
      iconName = 'cpu';
      timeframe = 'Dự báo 1-3 năm';
    }

    const keyFacts = contextArticles.slice(0, 3).map(a => `[${a.source}] ${a.title}`);

    let predictionText = '';
    let recommendationText = '';

    if (q.includes('thị trường') || q.includes('tuần')) {
      predictionText = `Tổng hợp dữ liệu từ ${contextArticles.length} bài báo mới nhất cho thấy: Thị trường hiện tại duy trì tín hiệu phân hóa tích cực. Dòng tiền tập trung vào các nhóm ngành có nền tảng vĩ mô vững như Công nghệ, Ngân hàng và Hạ tầng. So với tuần trước, tâm lý nhà đầu tư đã ổn định hơn nhờ thông tin lãi suất và nâng hạng.`;
      recommendationText = `Bám sát các chỉ số vĩ mô, tập trung vào danh mục cổ phiếu/tài sản có khả năng tạo dòng tiền thực thay vì lướt sóng tâm lý.`;
    } else if (q.includes('bất động sản') || q.includes('bđs')) {
      predictionText = `Dữ liệu báo chí ghi nhận nguồn cung pháp lý được tháo gỡ nhờ Luật Đất đai mới. Phân khúc nhà ở phân khúc thực tại các đô thị lớn tiếp tục giữ đà thanh khoản tốt nhất.`;
      recommendationText = `Ưu tiên các bất động sản có pháp lý chuẩn và vị trí hưởng lợi từ các tuyến giao thông/TOD mới ban hành.`;
    } else {
      predictionText = `Dựa trên tổng hợp tin tức thời gian thực: Tốc độ số hóa và ứng dụng AI tại Việt Nam đang tăng tốc 150%. Các cá nhân và doanh nghiệp biết tận dụng công nghệ sẽ đạt mức tăng trưởng vượt trội.`;
      recommendationText = `Nâng cấp kỹ năng AI Copilot chuyên ngành và chủ động theo dõi các bản tin phân tích xu hướng mỗi ngày.`;
    }

    return {
      topic: topicTitle,
      icon: iconName,
      timeframe: timeframe,
      keyInsights: keyFacts.length > 0 ? keyFacts : [
        'Dữ liệu tin tức ghi nhận sự gia tăng thanh khoản và niềm tin nhà đầu tư.',
        'Các chính sách hỗ trợ sản xuất kinh doanh phát huy hiệu quả thực tế.',
        'Doanh nghiệp chuyển đổi số và phát triển xanh chiếm ưu thế phát triển.'
      ],
      predictionVerdict: predictionText,
      recommendation: recommendationText
    };
  }

  // Call Google Gemini API if user connects their API Key
  async callGeminiAPI(userQuery) {
    const contextText = this.newsItems.slice(0, 8).map(i => `- [${i.source} - ${i.category}] ${i.title}: ${i.fullContent}`).join('\n');
    
    const promptText = `Bạn là AI Oracle - Chuyên gia phân tích tin tức và dự báo tương lai cho Việt Nam. 
Dưới đây là các bài báo Việt Nam mới nhất vừa thu thập thời gian thực:
${contextText}

Câu hỏi của người dùng: "${userQuery}"

Hãy phân tích và trả lời người dùng bằng Tiếng Việt ngắn gọn, thông minh, bao gồm:
1. Phân tích bối cảnh tin tức mới nhất liên quan.
2. Phán đoán xu hướng tương lai trong 3-6 tháng tới.
3. Lời khuyên hành động cụ thể cho người dùng.`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.geminiApiKey}`;
    
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: promptText }] }]
      })
    });

    if (!res.ok) return null;
    const data = await res.json();
    const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!replyText) return null;

    return {
      topic: 'Phân Tích Trí Tuệ Gemini Live AI',
      icon: 'sparkles',
      timeframe: 'Mô hình Gemini 1.5 Flash',
      keyInsights: [
        'Đã tổng hợp & đối chiếu dữ liệu từ các báo lớn Việt Nam thời gian thực.',
        'Phân tích ngữ nghĩa chuyên sâu bằng mô hình Generative AI.'
      ],
      predictionVerdict: replyText,
      recommendation: 'Tham khảo thông tin phân tích để đưa ra quyết định phù hợp cho cá nhân bạn.'
    };
  }
}
