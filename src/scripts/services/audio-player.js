const CLICK_URLS = {
  strong: new URL("../../../public/sounds/strong-click.mp3", import.meta.url),
  light: new URL("../../../public/sounds/light-click.mp3", import.meta.url),
};

const clickAudio = {
  strong: new Audio(CLICK_URLS.strong.href),
  light: new Audio(CLICK_URLS.light.href),
};

export function playClick(type) {
  const audio = clickAudio[type];

  audio.currentTime = 0;
  audio.play().catch((error) => {
    console.error(`Could not play ${type} click:`, error);
  });
}
