import { beforeEach, describe, expect, test, vi } from "vitest";

const setValueAtTime = vi.fn();
const fetchMock = vi.fn();
const decodeAudioData = vi.fn();

class AudioContextMock {
  currentTime = 10;
  destination = {};
  decodeAudioData = decodeAudioData;
}

class GainNodeMock {
  gain = { setValueAtTime };

  connect = vi.fn();
}

vi.stubGlobal("AudioContext", AudioContextMock);
vi.stubGlobal("GainNode", GainNodeMock);
vi.stubGlobal("fetch", fetchMock);

const { setOutputVolume, prepareBuffers } =
  await import("../../../src/scripts/services/audio-player.js");

describe("audio-player.js", () => {
  beforeEach(() => {
    setValueAtTime.mockClear();
    fetchMock.mockReset();
    decodeAudioData.mockReset();
  });

  describe("setOutputVolume()", () => {
    test("normalizes volume and schedules the change", () => {
      setOutputVolume(50);

      expect(setValueAtTime).toHaveBeenCalledWith(0.5, 10);
    });
  });

  describe("prepareBuffers()", () => {
    test("throws when a click sound cannot be loaded", async () => {
      fetchMock
        .mockResolvedValueOnce({
          ok: true,
          arrayBuffer: vi.fn().mockResolvedValue(new ArrayBuffer(8)),
        })
        .mockResolvedValueOnce({
          ok: false,
          status: 404,
        });

      await expect(prepareBuffers()).rejects.toThrow(
        "Could not load light click: 404",
      );
    });

    test("loads and decodes all click sounds", async () => {
      const strongAudio = new ArrayBuffer(8);
      const lightAudio = new ArrayBuffer(16);
      const readStrongAudio = vi.fn().mockResolvedValue(strongAudio);
      const readLightAudio = vi.fn().mockResolvedValue(lightAudio);

      fetchMock
        .mockResolvedValueOnce({
          ok: true,
          arrayBuffer: readStrongAudio,
        })
        .mockResolvedValueOnce({
          ok: true,
          arrayBuffer: readLightAudio,
        });

      decodeAudioData
        .mockResolvedValueOnce({ type: "decoded-strong" })
        .mockResolvedValueOnce({ type: "decoded-light" });

      await expect(prepareBuffers()).resolves.toBeUndefined();

      expect(fetchMock).toHaveBeenCalledTimes(2);
      expect(readStrongAudio).toHaveBeenCalledOnce();
      expect(readLightAudio).toHaveBeenCalledOnce();
      expect(decodeAudioData).toHaveBeenNthCalledWith(1, strongAudio);
      expect(decodeAudioData).toHaveBeenNthCalledWith(2, lightAudio);
    });
  });
});
