#!/usr/bin/env python3
"""
VietNews AI Foresight - Multi-Category Realtime RSS Aggregator & API Server
"""

import http.server
import socketserver
import json
import urllib.request
import re
import html
import xml.etree.ElementTree as ET
import time
import os
import concurrent.futures
import datetime

PORT = 8088
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

# Category-specific RSS Feed Mapping
CATEGORY_RSS_MAP = {
    'HOT': [
        {"source": "VnExpress", "url": "https://vnexpress.net/rss/tin-moi-nhat.rss"},
        {"source": "Tuổi Trẻ", "url": "https://tuoitre.vn/rss/tin-moi-nhat.rss"},
        {"source": "Thanh Niên", "url": "https://thanhnien.vn/rss/home.rss"},
        {"source": "Dân Trí", "url": "https://dantri.com.vn/rss/su-kien.rss"},
        {"source": "VietNamNet", "url": "https://vietnamnet.vn/rss/thoi-su.rss"}
    ],
    'STOCKS': [
        {"source": "VnExpress", "url": "https://vnexpress.net/rss/kinh-doanh.rss"},
        {"source": "Tuổi Trẻ", "url": "https://tuoitre.vn/rss/kinh-doanh.rss"},
        {"source": "Thanh Niên", "url": "https://thanhnien.vn/rss/kinh-te.rss"},
        {"source": "Dân Trí", "url": "https://dantri.com.vn/rss/kinh-doanh.rss"},
        {"source": "VietNamNet", "url": "https://vietnamnet.vn/rss/tai-chinh.rss"}
    ],
    'EDUCATION': [
        {"source": "VnExpress", "url": "https://vnexpress.net/rss/giao-duc.rss"},
        {"source": "Tuổi Trẻ", "url": "https://tuoitre.vn/rss/giao-duc.rss"},
        {"source": "Thanh Niên", "url": "https://thanhnien.vn/rss/giao-duc.rss"},
        {"source": "Dân Trí", "url": "https://dantri.com.vn/rss/giao-duc.rss"}
    ],
    'SOCIETY': [
        {"source": "VnExpress", "url": "https://vnexpress.net/rss/thoi-su.rss"},
        {"source": "Tuổi Trẻ", "url": "https://tuoitre.vn/rss/thoi-su.rss"},
        {"source": "Thanh Niên", "url": "https://thanhnien.vn/rss/thoi-su.rss"},
        {"source": "Dân Trí", "url": "https://dantri.com.vn/rss/xa-hoi.rss"}
    ],
    'TECH': [
        {"source": "VnExpress", "url": "https://vnexpress.net/rss/so-hoa.rss"},
        {"source": "Tuổi Trẻ", "url": "https://tuoitre.vn/rss/nhip-song-so.rss"},
        {"source": "Thanh Niên", "url": "https://thanhnien.vn/rss/cong-nghe-game.rss"},
        {"source": "Dân Trí", "url": "https://dantri.com.vn/rss/suc-manh-so.rss"},
        {"source": "VietNamNet", "url": "https://vietnamnet.vn/rss/cong-nghe.rss"}
    ],
    'REAL_ESTATE': [
        {"source": "VnExpress", "url": "https://vnexpress.net/rss/bat-dong-san.rss"},
        {"source": "Tuổi Trẻ", "url": "https://tuoitre.vn/rss/bat-dong-san.rss"},
        {"source": "Thanh Niên", "url": "https://thanhnien.vn/rss/bat-dong-san.rss"},
        {"source": "Dân Trí", "url": "https://dantri.com.vn/rss/bat-dong-san.rss"},
        {"source": "VietNamNet", "url": "https://vietnamnet.vn/rss/bat-dong-san.rss"}
    ]
}

def strip_html(text):
    if not text:
        return ""
    text = html.unescape(text)
    clean = re.sub(r'<[^>]+>', ' ', text)
    clean = re.sub(r'\s+', ' ', clean).strip()
    return clean

def generate_bullets_and_impact(title, desc, category):
    cleaned_desc = strip_html(desc)
    words = [w.strip() for w in cleaned_desc.split('. ') if len(w.strip()) > 10]
    
    bullets = []
    if len(words) >= 1:
        bullets.append(words[0] + ('.' if not words[0].endswith('.') else ''))
    else:
        bullets.append(f"Cập nhật diễn biến thời gian thực: {title}.")
        
    if len(words) >= 2:
        bullets.append(words[1] + ('.' if not words[1].endswith('.') else ''))
    else:
        bullets.append("Nguồn tin được xác thực từ báo chí chính thống Việt Nam.")
        
    bullets.append("Bấm trực tiếp để đọc nội dung chi tiết hoặc hỏi AI giải thích sâu hơn.")

    cat_names = {
        'HOT': 'sự kiện thời sự',
        'STOCKS': 'thị trường tài chính & chứng khoán',
        'EDUCATION': 'lĩnh vực giáo dục & kỹ năng',
        'SOCIETY': 'đời sống xã hội',
        'TECH': 'làn sóng công nghệ & AI',
        'REAL_ESTATE': 'thị trường bất động sản'
    }
    
    impact = f"Dự báo thông tin này sẽ tạo tác động trực tiếp lên {cat_names.get(category, 'thị trường')} trong chu kỳ 3-6 tháng tới."
    return bullets, impact, cleaned_desc

def format_pub_date(pub_date_str):
    if not pub_date_str:
        return f"Vừa cập nhật ({time.strftime('%H:%M - %d/%m/%Y')})"
    
    dt = None
    try:
        from email.utils import parsedate_to_datetime
        dt = parsedate_to_datetime(pub_date_str)
    except Exception:
        pass

    if dt is None:
        try:
            m = re.search(r'(\d{1,2}):(\d{2})\s*-\s*(\d{1,2})/(\d{1,2})/(\d{4})', str(pub_date_str))
            if m:
                hh, mm, dd, month, yyyy = map(int, m.groups())
                dt = datetime.datetime(yyyy, month, dd, hh, mm)
        except Exception:
            pass

    if dt:
        now_ts = time.time()
        article_ts = dt.timestamp()
        diff_mins = int((now_ts - article_ts) / 60)
        diff_hours = int(diff_mins / 60)
        diff_days = int(diff_hours / 24)
        
        exact_str = dt.strftime("%H:%M - %d/%m/%Y")
        if diff_mins < 1:
            return f"Vừa xong ({exact_str})"
        elif diff_mins < 60:
            return f"{max(1, diff_mins)} phút trước ({exact_str})"
        elif diff_hours < 24:
            return f"{diff_hours} giờ trước ({exact_str})"
        else:
            return f"{diff_days} ngày trước ({exact_str})"

    return pub_date_str

def parse_pub_date_to_ts(pub_date_str):
    if not pub_date_str:
        return int(time.time() * 1000)
    try:
        from email.utils import parsedate_to_datetime
        dt = parsedate_to_datetime(pub_date_str)
        return int(dt.timestamp() * 1000)
    except Exception:
        pass

    try:
        m = re.search(r'(\d{1,2}):(\d{2})\s*-\s*(\d{1,2})/(\d{1,2})/(\d{4})', str(pub_date_str))
        if m:
            hh, mm, dd, month, yyyy = map(int, m.groups())
            dt = datetime.datetime(yyyy, month, dd, hh, mm)
            return int(dt.timestamp() * 1000)
    except Exception:
        pass

    return int(time.time() * 1000)

def fetch_single_feed(category, feed):
    headers = {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'}
    items_found = []
    try:
        req = urllib.request.Request(feed["url"], headers=headers)
        with urllib.request.urlopen(req, timeout=3.5) as resp:
            xml_data = resp.read().decode('utf-8', errors='ignore')
            root = ET.fromstring(xml_data)
            
            channel = root.find('channel')
            if channel is None:
                return items_found
                
            items = channel.findall('item')
            for idx, item in enumerate(items[:5]): # Take top 5 per feed
                title = item.findtext('title') or ''
                link = item.findtext('link') or ''
                pub_date = item.findtext('pubDate') or ''
                desc_raw = item.findtext('description') or ''
                
                title = strip_html(title)
                if not title or not link:
                    continue
                    
                bullets, impact, cleaned_desc = generate_bullets_and_impact(title, desc_raw, category)
                
                full_content = cleaned_desc if len(cleaned_desc) > 30 else f"Nội dung cập nhật từ {feed['source']}: {title}. Bài viết phân tích các diễn biến chi tiết, số liệu liên quan và phản ứng của giới chuyên gia đối với sự kiện này."
                
                items_found.append({
                    "id": f"{category.lower()}-{feed['source'].lower()}-{idx}-{int(time.time())}",
                    "title": title,
                    "source": feed["source"],
                    "category": category,
                    "link": link,
                    "pubDate": format_pub_date(pub_date),
                    "timestamp": parse_pub_date_to_ts(pub_date),
                    "readTime": "3 phút",
                    "sentiment": "POSITIVE" if any(k in title.lower() for k in ["tăng", "đạt", "thành công", "phát triển", "bứt phá"]) else ("WARNING" if any(k in title.lower() for k in ["giảm", "cảnh báo", "rủi ro", "vướng"]) else "NEUTRAL"),
                    "summaryBullets": bullets,
                    "fullContent": full_content,
                    "aiImpactNote": impact
                })
    except Exception as e:
        print(f"Error fetching {category} - {feed['source']}: {e}")
        
    return items_found

def fetch_all_categories_rss():
    all_items = []
    tasks = []
    
    with concurrent.futures.ThreadPoolExecutor(max_workers=10) as executor:
        for cat, feeds in CATEGORY_RSS_MAP.items():
            for feed in feeds:
                tasks.append(executor.submit(fetch_single_feed, cat, feed))
                
        for future in concurrent.futures.as_completed(tasks):
            res = future.result()
            if res:
                all_items.extend(res)
                
    all_items.sort(key=lambda x: x.get('timestamp', 0), reverse=True)
    return all_items

class CustomHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def do_GET(self):
        if self.path == '/api/rss' or self.path.startswith('/api/rss?'):
            self.send_response(200)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            
            items = fetch_all_categories_rss()
            response_json = json.dumps(items, ensure_ascii=False)
            self.wfile.write(response_json.encode('utf-8'))
            return
            
        return super().do_GET()

if __name__ == '__main__':
    handler = CustomHandler
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", PORT), handler) as httpd:
        print(f"Server serving at http://localhost:{PORT}")
        httpd.serve_forever()
