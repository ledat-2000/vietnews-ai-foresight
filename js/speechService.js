/**
 * VietNews AI Foresight - Native Web Speech Voice Briefing Service
 */

export class SpeechService {
  constructor() {
    this.synth = window.speechSynthesis || null;
    this.isPlaying = false;
    this.currentUtterance = null;
    this.onStateChangeCallback = null;
  }

  isSupported() {
    return 'speechSynthesis' in window;
  }

  setStateCallback(cb) {
    this.onStateChangeCallback = cb;
  }

  notifyState() {
    if (typeof this.onStateChangeCallback === 'function') {
      this.onStateChangeCallback(this.isPlaying);
    }
  }

  speakText(text) {
    if (!this.isSupported()) {
      alert('Trình duyệt của bạn chưa hỗ trợ tính năng Đọc giọng nói Web Speech.');
      return;
    }

    this.stop();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'vi-VN';
    utterance.rate = 0.95; // Clear natural rate
    utterance.pitch = 1.0;

    // Try finding Vietnamese voice
    const voices = this.synth.getVoices();
    const vnVoice = voices.find(v => v.lang.includes('vi') || v.lang.includes('VI'));
    if (vnVoice) {
      utterance.voice = vnVoice;
    }

    utterance.onstart = () => {
      this.isPlaying = true;
      this.notifyState();
    };

    utterance.onend = () => {
      this.isPlaying = false;
      this.notifyState();
    };

    utterance.onerror = () => {
      this.isPlaying = false;
      this.notifyState();
    };

    this.currentUtterance = utterance;
    this.synth.speak(utterance);
  }

  stop() {
    if (this.synth && this.synth.speaking) {
      this.synth.cancel();
    }
    this.isPlaying = false;
    this.notifyState();
  }

  toggle(text) {
    if (this.isPlaying) {
      this.stop();
    } else {
      this.speakText(text);
    }
  }
}
