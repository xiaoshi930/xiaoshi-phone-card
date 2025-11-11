export class XiaoshiPhoneVideoCard extends HTMLElement {
  setConfig(config) {
    this.config = config;
  }

  connectedCallback() {
    this.attachShadow({ mode: 'open' });
    this.currentVideo = 1;
    this.touchYStart = null;
    this.render();
  }

  render() {
    const top = this.config.top || '0';
    const initialUrl = this.getRandomUrl();
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          position: relative;
          width: 100vw; !important;
          height: 100vh; !important;
          overflow: hidden;
          top: ${top};
          --control-size: 44px;
          --icon-size: 24px;
          --button-spacing: 12px;
          --bg-color: rgba(0, 0, 0, 0);
          --hover-bg: rgba(0, 0, 0, 0);
          --transition-duration: 0.1s;
          --background-color: rgba(0, 0, 0, 0);
        }
        .video-container {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
          visibility: hidden;
          background: var(--background-color);
        }
        .video-container.active {
          opacity: 1;
          visibility: visible;
          transition-delay: 0s;
        }
        .transition-guard {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: var(--background-color);
          opacity: 0;
          pointer-events: none;
          z-index: 999;
          transition: opacity calc(var(--transition-duration) / 2) ease;
        }
        .transition-active .transition-guard {
          opacity: 1;
        }
        .active {
          opacity: 1 !important;
        }
        video {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          border-radius: 0
          transition: opacity 0.3s ease;
          -webkit-touch-callout: none;
          -webkit-user-select: none;
          user-select: none;
        }
        video::-webkit-media-controls {
          display: none !important;
        }
        .controls-container1 {
          position: absolute;
          bottom: 16px;
          right: 16px;
          display: flex;
          gap: var(--button-spacing);
          z-index: 10;
        }
        .controls-container2 {
          position: absolute;
          bottom: 16px;
          left: 16px;
          display: flex;
          gap: var(--button-spacing);
          z-index: 10;
        }
        .control-btn {
          width: 15px;
          height: 15px;
          background: rgb(0,0,0,0);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: none;
          transition: all 0.2s ease;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0);
          border: 1px solid rgba(0, 0, 0, 0);
        }
        .control-btn:hover {
          background: var(--hover-bg);
          transform: scale(1.05);
        }
        .control-btn:active {
          transform: scale(0.95);
        }
        ha-icon {
          width: var(--icon-size);
          height: var(--icon-size);
          color: white;
        }
      </style>
      <div class="transition-guard"></div>
      <div class="video-container active" id="video1">
        <video 
          id="vid1"
          muted 
          autoplay 
          loop 
          playsinline
          webkit-playsinline
          disablePictureInPicture
          controlsList="nodownload nofullscreen noremoteplayback"
        >
          <source src="${initialUrl}" type="video/mp4">
        </video>
      </div>
      <div class="video-container" id="video2">
        <video 
          id="vid2"
          muted 
          autoplay 
          loop 
          playsinline
          webkit-playsinline
          disablePictureInPicture
          controlsList="nodownload nofullscreen noremoteplayback"
        ></video>
      </div>
      <div class="controls-container1">
        <div class="control-btn" id="refreshBtn">
          <ha-icon icon="mdi:refresh"></ha-icon>
        </div>
      </div>
      <div class="controls-container2">
        <div class="control-btn" id="muteBtn">
          <ha-icon icon="mdi:volume-off"></ha-icon>
        </div>
      </div>
    `;
    this.initVideos();
    this.initControls();
  }

  initSwipeControls() {
    const SWIPE_THRESHOLD = 10;
    const hostElement = this.shadowRoot.host;
    const touchStart = (e) => {
      this.touchYStart = e.touches[0].clientY;
    };
    const touchMove = (e) => {
      if (!this.touchYStart) return;
      const touchYEnd = e.touches[0].clientY;
      const deltaY = this.touchYStart - touchYEnd;
      if (deltaY > SWIPE_THRESHOLD) {
        this.touchYStart = null;
        this.shadowRoot.getElementById('refreshBtn').click();
        e.preventDefault();
      }
    };
    const touchEnd = () => {
      this.touchYStart = null;
    };
    hostElement.addEventListener('touchstart', touchStart, { passive: false });
    hostElement.addEventListener('touchmove', touchMove, { passive: false });
    hostElement.addEventListener('touchend', touchEnd);
  }

  getRandomUrl() {
    return this.config.url[Math.floor(Math.random() * this.config.url.length)];
  }

  initVideos() {
    this.vid1 = this.shadowRoot.getElementById('vid1');
    this.vid2 = this.shadowRoot.getElementById('vid2');
    this.container1 = this.shadowRoot.getElementById('video1');
    this.container2 = this.shadowRoot.getElementById('video2');
  }

  initControls() {
    const muteBtn = this.shadowRoot.getElementById('muteBtn');
    muteBtn.addEventListener('click', () => {
      const newMuted = !this.vid1.muted;
      [this.vid1, this.vid2].forEach(vid => vid.muted = newMuted);
      muteBtn.querySelector('ha-icon').setAttribute('icon', 
        newMuted ? 'mdi:volume-off' : 'mdi:volume-high'
      );
    });
    this.initSwipeControls();
    const refreshBtn = this.shadowRoot.getElementById('refreshBtn');
    refreshBtn.addEventListener('click', async () => {
      const currentVideo = this.currentVideo === 1 ? this.vid1 : this.vid2;
      const nextVideo = this.currentVideo === 1 ? this.vid2 : this.vid1;
      const currentContainer = this.currentVideo === 1 ? this.container1 : this.container2;
      const nextContainer = this.currentVideo === 1 ? this.container2 : this.container1;
      this.shadowRoot.host.classList.add('transition-active');
      try {
        const newSrc = `${this.getRandomUrl()}?t=${Date.now()}`;
        nextVideo.src = newSrc;
        nextVideo.muted = currentVideo.muted;
        await new Promise((resolve, reject) => {
          nextVideo.addEventListener('loadeddata', resolve, { once: true });
          nextVideo.addEventListener('error', reject, { once: true });
        });
        if (!currentVideo.paused) {
          nextVideo.play().catch(() => {});
        }
        currentContainer.style.transitionDelay = '0s';
        nextContainer.style.transitionDelay = '0s';
        nextContainer.classList.add('active');
        currentContainer.classList.remove('active');
        setTimeout(() => {
          currentVideo.pause();
          currentVideo.currentTime = 0;
          currentVideo.src = '';
          this.shadowRoot.host.classList.remove('transition-active');
        }, this.transitionDuration * 1000);
        this.currentVideo = this.currentVideo === 1 ? 2 : 1;
      } catch (error) {
        this.shadowRoot.host.classList.remove('transition-active');
      }
    });
  }
} 
customElements.define('xiaoshi-phone-video-card', XiaoshiPhoneVideoCard);
