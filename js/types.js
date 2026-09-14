/**
 * VietNews AI Foresight - Type Definitions & Constants
 */

export const NEWS_CATEGORIES = [
  { id: 'ALL', name: 'Tất Cả Tin Tức', icon: 'globe' },
  { id: 'HOT', name: 'Tin Hot', icon: 'flame' },
  { id: 'STOCKS', name: 'Chứng Khoán & Tài Chính', icon: 'trending-up' },
  { id: 'EDUCATION', name: 'Giáo Dục & Kỹ Năng', icon: 'graduation-cap' },
  { id: 'SOCIETY', name: 'Tin Tức Xã Hội', icon: 'newspaper' },
  { id: 'TECH', name: 'Công Nghệ & AI', icon: 'cpu' },
  { id: 'REAL_ESTATE', name: 'Bất Động Sản', icon: 'building' }
];

export const NEWS_SOURCES = [
  { id: 'VnExpress', name: 'VnExpress', url: 'https://vnexpress.net', rss: 'https://vnexpress.net/rss/tin-moi-nhat.rss', badgeClass: 'badge-cyan' },
  { id: 'Tuổi Trẻ', name: 'Tuổi Trẻ Online', url: 'https://tuoitre.vn', rss: 'https://tuoitre.vn/rss/tin-moi-nhat.rss', badgeClass: 'badge-emerald' },
  { id: 'Thanh Niên', name: 'Thanh Niên', url: 'https://thanhnien.vn', rss: 'https://thanhnien.vn/rss/home.rss', badgeClass: 'badge-violet' },
  { id: 'Dân Trí', name: 'Dân Trí', url: 'https://dantri.com.vn', rss: 'https://dantri.com.vn/rss/trang-chu.rss', badgeClass: 'badge-amber' },
  { id: 'VietNamNet', name: 'VietNamNet', url: 'https://vietnamnet.vn', rss: 'https://vietnamnet.vn/rss/home.rss', badgeClass: 'badge-rose' }
];

export const SENTIMENT_TYPES = {
  POSITIVE: { label: 'Tích cực', icon: 'trending-up', class: 'badge-emerald', emoji: '📈' },
  NEUTRAL: { label: 'Trung lập', icon: 'minus', class: 'badge-cyan', emoji: '⚖️' },
  WARNING: { label: 'Cần lưu ý', icon: 'alert-triangle', class: 'badge-amber', emoji: '⚠️' }
};
