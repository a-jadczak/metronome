const SOUND_BASE = new URL("../../../public/sounds/", import.meta.url);

const CLICK_URLS = {
  strong: new URL("strong-click-trimmed.wav", SOUND_BASE),
  light: new URL("light-click-trimmed.wav", SOUND_BASE),
};

const audioContext = new AudioContext();
const clickBuffers = {};

export async function prepareBuffers() {
  await Promise.all(
    Object.entries(CLICK_URLS).map(async ([type, url]) => {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Could not load ${type} click: ${response.status}`);
      }

      const encodedAudio = await response.arrayBuffer();
      clickBuffers[type] = await audioContext.decodeAudioData(encodedAudio);
    }),
  );
}

/* Users must interact with the website before any audio can be played due to browser security reasons */
export async function prepareAudio() {
  if (audioContext.state === "suspended") {
    await audioContext.resume();
  }
}

export function playClick(type) {
  const buffer = clickBuffers[type];

  if (!buffer) {
    console.error(`The ${type} click has not been decoded.`);
    return;
  }

  const source = new AudioBufferSourceNode(audioContext, { buffer });

  source.connect(audioContext.destination);
  source.start();
}
