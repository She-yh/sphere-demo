import { useState, useEffect, useRef } from "react";
export default function useAudioAnalyser() {
  const [audioData, setAudioData] = useState([]);
  const audioRef = useRef(null);
  const analyserRef = useRef(null);

  useEffect(() => {
    const initAudio = async () => {
      const audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();
      analyserRef.current = audioContext.createAnalyser();
      analyserRef.current.fftSize = 256;

      // 添加音频文件（示例路径，需替换为实际文件）
      const response = await fetch("/static/audio.mp3");
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(analyserRef.current);
      analyserRef.current.connect(audioContext.destination);

      audioRef.current = source;
      return () => source.stop();
    };

    initAudio();

    return () => {
      if (audioRef.current) audioRef.current.stop();
    };
  }, []);

  // 获取音频数据
  useEffect(() => {
    let animationFrame;
    const updateData = () => {
      if (!analyserRef.current) return;

      const bufferLength = analyserRef.current.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      analyserRef.current.getByteFrequencyData(dataArray);

      setAudioData([...dataArray]);
      animationFrame = requestAnimationFrame(updateData);
    };

    updateData();
    return () => cancelAnimationFrame(animationFrame);
  }, []);

  return {
    audioData,
    play: () => audioRef.current?.start(),
    stop: () => audioRef.current?.stop(),
  };
}
