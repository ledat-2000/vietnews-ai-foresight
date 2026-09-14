/**
 * VietNews AI Foresight - Main Application Entrypoint
 */

import { fetchLatestVietnamNews } from './sources.js';
import { AIForesightEngine } from './aiEngine.js';
import { SpeechService } from './speechService.js';

import { renderHeader, renderTickerBanner } from './components/header.js';
import { renderExecutiveBriefing } from './components/briefing.js';
import { renderRadar } from './components/radar.js';
import { renderForesightMatrix } from './components/foresightMatrix.js';
import { renderCategoryNav, renderNewsGrid, openReaderModal } from './components/newsList.js';
import { renderOracleCTA, openOracleModal } from './components/oracleModal.js';
import { renderAnalytics } from './components/analytics.js';

class VietNewsApp {
  constructor() {
    this.allNews = [];
    this.filteredNews = [];
    this.currentCategory = 'ALL';
    this.searchKeyword = '';
    this.sourceFilter = 'ALL';
    this.sentimentFilter = 'ALL';

    this.aiEngine = new AIForesightEngine();
    this.speechService = new SpeechService();

    // DOM Elements
    this.headerEl = document.getElementById('main-header');
    this.tickerEl = document.getElementById('ticker-banner');
    this.categoryNavEl = document.getElementById('category-nav');
    this.executiveCardEl = document.getElementById('executive-briefing-card');
    this.radarCardEl = document.getElementById('ai-radar-card');
    this.foresightMatrixCardEl = document.getElementById('foresight-matrix-card');
    this.newsCardsGridEl = document.getElementById('news-cards-grid');
    this.newsCountBadgeEl = document.getElementById('news-count-badge');
    this.oracleCtaCardEl = document.getElementById('oracle-cta-card');
    this.analyticsCardEl = document.getElementById('analytics-card');
    this.hotTopicsCardEl = document.getElementById('hot-topics-card');
    this.oracleModalBackdropEl = document.getElementById('oracle-modal-backdrop');
    this.oracleModalContainerEl = document.getElementById('oracle-modal-container');
    this.readerModalBackdropEl = document.getElementById('reader-modal-backdrop');
    this.readerModalContainerEl = document.getElementById('reader-modal-container');

    // Filter controls
    this.searchInputEl = document.getElementById('news-search-input');
    this.sourceSelectEl = document.getElementById('source-filter-select');
    this.sentimentSelectEl = document.getElementById('sentiment-filter-select');
    this.inlineRefreshBtn = document.getElementById('btn-refresh-feed-inline');
  }

  async init() {
    // 1. Render Header & Ticker
    renderHeader(
      this.headerEl, 
      () => this.handleOpenOracle(),
      () => this.reloadNewsData()
    );
    renderTickerBanner(this.tickerEl);

    // 2. Inline Refresh Button Listener
    if (this.inlineRefreshBtn) {
      this.inlineRefreshBtn.addEventListener('click', async () => {
        const icon = document.getElementById('refresh-icon-inline');
        icon?.classList.add('spin-animation');
        this.inlineRefreshBtn.disabled = true;

        await this.reloadNewsData();

        setTimeout(() => {
          icon?.classList.remove('spin-animation');
          this.inlineRefreshBtn.disabled = false;
        }, 1200);
      });
    }

    // 3. Fetch Initial News Data
    await this.reloadNewsData();

    // 4. Setup Filters & Category Tabs
    this.setupFilterListeners();
    this.renderCategories();

    // 5. Auto-refresh news every 90 seconds
    setInterval(() => {
      console.log('Background auto-refreshing live RSS news feeds...');
      this.reloadNewsData();
    }, 90000);

    // Initialize Lucide Icons
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  async reloadNewsData() {
    this.allNews = await fetchLatestVietnamNews();
    this.aiEngine.setNews(this.allNews);

    // Render Executive Briefing, Radar, Impact Matrix
    renderExecutiveBriefing(this.executiveCardEl, this.aiEngine.getExecutiveBriefing(), this.speechService);
    renderRadar(this.radarCardEl, this.aiEngine.getForesightRadar());
    renderForesightMatrix(this.foresightMatrixCardEl, this.aiEngine.getForesightImpactMatrix());

    // Render Sidebar Analytics
    renderOracleCTA(this.oracleCtaCardEl, () => this.handleOpenOracle());
    renderAnalytics(this.analyticsCardEl, this.hotTopicsCardEl, this.allNews, (topicQuery) => {
      if (this.searchInputEl) {
        this.searchInputEl.value = topicQuery;
        this.searchKeyword = topicQuery.toLowerCase();
        this.applyFilters();
      }
    });

    this.applyFilters();
  }

  renderCategories() {
    renderCategoryNav(this.categoryNavEl, this.currentCategory, (catId) => {
      this.currentCategory = catId;
      this.renderCategories();
      this.applyFilters();
    });
  }

  setupFilterListeners() {
    this.searchInputEl?.addEventListener('input', (e) => {
      this.searchKeyword = e.target.value.trim().toLowerCase();
      this.applyFilters();
    });

    this.sourceSelectEl?.addEventListener('change', (e) => {
      this.sourceFilter = e.target.value;
      this.applyFilters();
    });

    this.sentimentSelectEl?.addEventListener('change', (e) => {
      this.sentimentFilter = e.target.value;
      this.applyFilters();
    });
  }

  applyFilters() {
    this.filteredNews = this.allNews.filter(item => {
      // Category Filter
      if (this.currentCategory !== 'ALL' && item.category !== this.currentCategory) {
        return false;
      }
      // Source Filter
      if (this.sourceFilter !== 'ALL' && item.source !== this.sourceFilter) {
        return false;
      }
      // Sentiment Filter
      if (this.sentimentFilter !== 'ALL' && item.sentiment !== this.sentimentFilter) {
        return false;
      }
      // Search Keyword Filter
      if (this.searchKeyword) {
        const textToSearch = `${item.title} ${item.fullContent} ${item.source} ${item.summaryBullets.join(' ')}`.toLowerCase();
        if (!textToSearch.includes(this.searchKeyword)) {
          return false;
        }
      }
      return true;
    });

    // Update news count badge
    if (this.newsCountBadgeEl) {
      this.newsCountBadgeEl.textContent = `${this.filteredNews.length} bài mới`;
    }

    // Render Grid & Pre-divided Category Sections
    renderNewsGrid(
      this.newsCardsGridEl, 
      this.filteredNews, 
      this.currentCategory,
      (item) => {
        openReaderModal(this.readerModalBackdropEl, this.readerModalContainerEl, item, (itemToExplain) => {
          const questionPrompt = `Giải thích chi tiết và phân tích sâu hơn cho tôi về bài viết: "${itemToExplain.title}"`;
          this.handleOpenOracle(questionPrompt);
        });
      },
      (catId) => {
        this.currentCategory = catId;
        this.renderCategories();
        this.applyFilters();
      }
    );
  }

  handleOpenOracle(initialQuestion = null) {
    openOracleModal(this.oracleModalBackdropEl, this.oracleModalContainerEl, this.aiEngine, initialQuestion);
  }
}

// Start app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const app = new VietNewsApp();
  app.init();
});
