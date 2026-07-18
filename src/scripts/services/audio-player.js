const CLICK_URLS = {
  strong: new URL("/public/sounds/strong-click-trimmed.wav", import.meta.url),
  light: new URL("/public/sounds/light-click-trimmed.wav", import.meta.url),
};

const audioContext = new AudioContext();
const clickBuffers = {};

const clickBuffersReady = Promise.all(
  Object.entries(CLICK_URLS).map(async ([type, url]) => {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Could not load ${type} click: ${response.status}`);
    }

    const encodedAudio = await response.arrayBuffer();
    clickBuffers[type] = await audioContext.decodeAudioData(encodedAudio);
  }),
);

export async function prepareAudio() {
  if (audioContext.state === "suspended") {
    await audioContext.resume();
  }

  await clickBuffersReady;
}

export function playClick(type) {
  const buffer = clickBuffers[type];

  if (!buffer) {
    console.error(`The ${type} click has not been decoded.`);
    return;
  }

  const source = audioContext.createBufferSource();

  source.buffer = buffer;
  source.connect(audioContext.destination);
  source.start();
}
