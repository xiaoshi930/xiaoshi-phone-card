console.info("%c 消逝卡-移动端 \n%c      v 0.0.2 ", "color: red; font-weight: bold; background: black", "color: white; font-weight: bold; background: black");

const loadCards = async () => {
    await import('./xiaoshi-phone-climate-card.js');
    await import('./xiaoshi-phone-humidifier-card.js');
    await import('./xiaoshi-phone-computer-card.js');
    await import('./xiaoshi-phone-light-card.js');
    await import('./xiaoshi-phone-switch-card.js');
    await import('./xiaoshi-phone-text-card.js');
    await import('./xiaoshi-phone-video-card.js');
    await import('./xiaoshi-phone-image-card.js');
    
    window.customCards = window.customCards || [];
    window.customCards.push(...cardConfigs);
};

const cardConfigs = [
  {
    type: 'xiaoshi-phone-climate-card',
    name: '消逝卡(移动端)-空调卡',
    description: '移动端空调卡',
    preview: true
  },
  {
    type: 'xiaoshi-phone-humidifier-card',
    name: '消逝卡(移动端)-加湿器卡',
    description: '移动端加湿器卡',
    preview: true
  },
  {
    type: 'xiaoshi-phone-computer-card',
    name: '消逝卡(移动端)-电脑卡',
    description: '移动端电脑卡'
  },
  {
    type: 'xiaoshi-phone-light-card',
    name: '消逝卡(移动端)-灯光卡',
    description: '移动端灯光卡'
  },
  {
    type: 'xiaoshi-phone-switch-card',
    name: '消逝卡(移动端)-插座卡',
    description: '移动端插座卡'
  },
  {
    type: 'xiaoshi-phone-text-card',
    name: '消逝卡(移动端)-输入卡',
    description: '移动端text实体输入框'
  },
  {
    type: 'xiaoshi-phone-video-card',
    name: '消逝卡(移动端)-视频卡',
    description: '移动端视频背景',
  },  
  {
    type: 'xiaoshi-phone-image-card',
    name: '消逝卡(移动端)-图片卡',
    description: '移动端图片背景',
  }
];

loadCards();
