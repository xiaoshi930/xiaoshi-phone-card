import { LitElement, html, css } from "https://unpkg.com/lit-element@2.4.0/lit-element.js?module";

export class XiaoshiPhoneSwitchCard extends LitElement {
  static get TIMING() {
    return {
      UNLOCK: 5000,
      FEEDBACK: 500
    };
  }

  static get properties() {
    return {
      hass: { type: Object },
      _config: { type: Object },
      _unlockedCards: { type: Object }
    };
  }

  constructor() {
    super();
    this._config = null;
    this._unlockedCards = {};
  }

  static get styles() {
    return css`
      .xiaoshi-container {
        display: flex;
        flex-direction: row;
        align-items: center;
        min-height: 60px;
        border-radius: 12px;
        padding: 0 16px;
        position: relative;
        overflow: hidden;
        transition: all 0.3s ease;
        justify-content: space-between;
        margin-bottom: 8px;
        background: var(--card-background-color, #f0f0f0);
      }
      .entities-grid {
        display: grid;
        grid-template-columns: repeat(var(--column-count, 1), 1fr);
        gap: 8px;
        width: 100%;
      }
      .device-name {
        font-size: 1.2rem;
        font-weight: 600;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        display: inline-flex;
        align-items: center;
      }
      .stats-container {
        color: var(--primary-text-color);
        font-weight: 700;
        font-size: 1rem;
        text-align: center;
        padding: 12px 0;
        margin-bottom: 8px;
      }
      .name-container {
        flex: 1;
        display: flex;
        align-items: center;
        gap: 8px;
        min-width: 0;
        overflow: hidden;
      }
      .power-value {
        font-size: 0.8rem;
        opacity: 1;
        white-space: nowrap;
        display: inline-flex;
        align-items: center;
        margin-left: 8px;
      }
      .button-container {
        flex-shrink: 0;
        display: flex;
        align-items: center;
        gap: 12px;
      }
      .power-button {
        width: 40px;
        height: 40px;
        border-radius: 10px;
        background: #999;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: none;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        opacity: 0.5;
        pointer-events: none;
      }
      .power-button.active {
        background: #c8191d;
      }
      .power-button.unlocked {
        opacity: 1;
        pointer-events: auto;
      }
      .lock-button {
        cursor: none;
        margin-right: 8px;
      }
      ha-icon {
        --mdc-icon-size: 24px;
        color: var(--icon-color, #c8191d);
      }
      .power-button.active ha-icon {
        color: white;
      }
      .lock-button ha-icon {
        --mdc-icon-size: 20px;
        transition: all 0.3s ease;
        color: #c8191d;
      }
      .lock-button.unlocked ha-icon {
        color: #4CAF50 !important;
      }
      @keyframes unlock-progress {
        from { width: 100% }
        to { width: 0 }
      }
      .unlock-progress {
        position: absolute;
        bottom: 0;
        left: 0;
        height: 3px;
        background: #4CAF50;
        animation: unlock-progress ${this.TIMING.UNLOCK}ms linear;
      }
    `;
  }

  setConfig(config) {
    this._config = {
      width: config.width || '100%',
      height: config.height || '60px',
      entities: config.entities || [],
      theme: config.theme || 'off',
      total: config.total !== undefined ? config.total : 'on',
      columns: config.columns || 1
    };
    this.requestUpdate();
  }

  _evaluateTheme() {
    try {
      if (typeof this._config.theme === 'function') return this._config.theme();
      if (typeof this._config.theme === 'string' && this._config.theme.includes('theme()')) {
        return (new Function('return theme()'))();
      }
      return this._config.theme || 'off';
    } catch(e) {
      return 'off';
    }
  }

  _getBackground(state) {
    const theme = this._evaluateTheme();
    if (state === 'on') {
      return theme === 'off' 
        ? 'linear-gradient(90deg, #c8191d 0%, #323232 100%)' 
        : 'linear-gradient(90deg, #c8191d 0%, #FFFFFF 100%)';
    }
    return theme === 'off' ? '#323232' : '#FFFFFF';
  }

  _parseEntityConfig(config) {
    if (Array.isArray(config)) {
      return [config[0], config[1]];
    }
    if (typeof config === 'string') {
      return config.split(',').map(e => e.trim());
    }
    return [config.entity, config.power];
  }

  _createStatsRow() {
    if (this._config.total === 'off') return null;
    let onCount = 0;
    let totalPower = 0;
    this._config.entities.forEach(entityPair => {
      const [switchEntity, sensorEntity] = this._parseEntityConfig(entityPair);
      const switchState = this.hass.states[switchEntity]?.state;
      const powerValue = parseFloat(this.hass.states[sensorEntity]?.state);
      if (switchState === 'on') {
        onCount++;
        if (!isNaN(powerValue)) totalPower += powerValue;
      }
    });
    const themeMode = this._evaluateTheme();
    const textColor = themeMode === 'on' ? '#333' : '#FFF';
    return html`
      <div class="stats-container"\n 
        style="color: ${textColor}">
        开启&nbsp;${onCount}&nbsp;个&emsp;关闭&nbsp;${this._config.entities.length - onCount}&nbsp;个&emsp;总功率：${totalPower.toFixed(1)}W
      </div>
    `;
  }

  _unlockControls(cardId) {
    const { UNLOCK } = this.constructor.TIMING;
    this._unlockedCards[cardId] = true;
    this.requestUpdate();
    setTimeout(() => {
      delete this._unlockedCards[cardId];
      this.requestUpdate();
    }, UNLOCK);
  }

  async _togglePower(entity, cardId) {
    const { FEEDBACK } = this.constructor.TIMING;
    await this.hass.callService('switch', 'toggle', { entity_id: entity });
    try { navigator.vibrate(50); } catch(e) {}
    const button = this.shadowRoot.querySelector(`#${cardId} .power-button`);
    if (button) {
      button.animate([
        { transform: 'scale(1)' },
        { transform: 'scale(0.8)' },
        { transform: 'scale(1)' }
      ], { duration: FEEDBACK });
    }
  }

  render() {
    if (!this._config || !this.hass) return html``;
    return html`
      ${this._createStatsRow()}
      <div class="entities-grid"\nstyle="--column-count: ${this._config.columns}">
      ${this._config.entities.map((entityPair, index) => {
        const [switchEntity, sensorEntity] = this._parseEntityConfig(entityPair);
        const stateObj = this.hass.states[switchEntity] || {};
        const state = stateObj.state || 'off';
        const attributes = stateObj.attributes || {};
        const cardId = `card-${index}`;
        const isUnlocked = !!this._unlockedCards[cardId];
        let powerValue = '';
        if (sensorEntity) {
          const powerState = this.hass.states[sensorEntity];
          if (powerState && !isNaN(powerState.state)) {
            const powerUnit = powerState.attributes?.unit_of_measurement || 'W';
            powerValue = `${parseFloat(powerState.state).toFixed(1)}${powerUnit}`;
          }
        }
        const themeMode = this._evaluateTheme();
        const textColor = themeMode === 'on' ? '#333' : '#FFF';
        const bgColor = state === 'on' 
          ? (themeMode === 'off' ? '#323232' : '#FFFFFF')
          : (themeMode === 'off' ? '#323232' : '#FFFFFF');
        const bgImage = state === 'on'
          ? (themeMode === 'off'
              ? 'linear-gradient(90deg, #c8191d 0%, #323232 100%)'
              : 'linear-gradient(90deg, #c8191d 0%, #FFFFFF 100%)')
          : 'none';
        return html`
          <div id="${cardId}" class="xiaoshi-container"\n
            style="width: ${this._config.width};height: ${this._config.height};background-color: ${bgColor};background-image: ${bgImage};color: ${textColor};">
            <div class="name-container">
              <span class="device-name">${attributes.friendly_name || switchEntity}</span>
              ${powerValue ? html`<span class="power-value">${powerValue}</span>` : ''}
            </div>
            <div class="button-container">
              <div class="lock-button ${isUnlocked ? 'unlocked' : ''}" \n
                   @click=${() => this._unlockControls(cardId)}\n
                   @touchend=${() => this._unlockControls(cardId)}>
                <ha-icon icon=${isUnlocked ? 'mdi:lock-open' : 'mdi:lock'}></ha-icon>
              </div>
              <div class="power-button ${state === 'on' ? 'active' : ''} ${isUnlocked ? 'unlocked' : ''}"\n
                   @click=${() => this._togglePower(switchEntity, cardId)}>
                <ha-icon icon="mdi:power-socket-uk"></ha-icon>
              </div>
            </div>
            ${isUnlocked ? html`
              <div class="unlock-progress"></div>
            ` : ''}
          </div>
        `;
      })}
    `;
  }
 
  disconnectedCallback() {
    super.disconnectedCallback();
    this._unlockedCards = {};
  }
}
customElements.define('xiaoshi-phone-switch-card', XiaoshiPhoneSwitchCard);  
