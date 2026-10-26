import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize2, Minimize2, Terminal, Activity, Eye, Zap, RefreshCw } from 'lucide-react';
import { VideoItem } from '../types';

interface CyberVideoPlayerProps {
  video: VideoItem;
  onNext?: () => void;
  onEnded?: () => void;
}

export const CyberVideoPlayer: React.FC<CyberVideoPlayerProps> = ({ video, onNext }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<number>(142);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [volume, setVolume] = useState<number>(0.8);
  const [isMuted, setIsMuted] = useState<boolean>(true); // Start muted by default for web standards
  const [showHUD, setShowHUD] = useState<boolean>(true);
  const [showScanlines, setShowScanlines] = useState<boolean>(true);
  const [isGlitching, setIsGlitching] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showSpeedMenu, setShowSpeedMenu] = useState<boolean>(false);
  const [fps, setFps] = useState<number>(60);

  const totalDuration = video.durationSeconds || 1122;

  // Audio Synthesizer for ambient cyber audio
  const initAudio = useCallback(() => {
    if (audioContextRef.current) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      audioContextRef.current = ctx;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(55, ctx.currentTime); // Low A drone 55Hz

      gain.gain.setValueAtTime(isMuted ? 0 : volume * 0.05, ctx.currentTime);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();

      oscillatorRef.current = osc;
      gainNodeRef.current = gain;
    } catch {
      // AudioContext unavailable or blocked
    }
  }, [isMuted, volume]);

  // Handle mute and volume update
  useEffect(() => {
    if (gainNodeRef.current && audioContextRef.current) {
      const targetGain = isMuted || !isPlaying ? 0 : volume * 0.04;
      gainNodeRef.current.gain.setTargetAtTime(targetGain, audioContextRef.current.currentTime, 0.05);
    }
  }, [isMuted, volume, isPlaying]);

  // Timer progression
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentTime((prev) => {
        if (prev >= totalDuration) {
          if (onNext) onNext();
          return 0;
        }
        return prev + 1 * playbackSpeed;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed, totalDuration, onNext]);

  // Video Canvas Renderer
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let lastTime = performance.now();
    let frameCount = 0;
    let fpsInterval = performance.now();

    const resizeCanvas = () => {
      if (!canvas) return;
      canvas.width = 1280;
      canvas.height = 720;
    };
    resizeCanvas();

    let step = 0;

    // Stream elements data
    const matrixCols = Math.floor(1280 / 20);
    const matrixDrops: number[] = Array.from({ length: matrixCols }, () => Math.floor(Math.random() * -50));
    const chars = '01ABCDEF0123456789X_//><;:{}[]=+-*~^|&!#@%()?';

    const render = (now: number) => {
      frameCount++;
      if (now - fpsInterval >= 1000) {
        setFps(Math.round((frameCount * 1000) / (now - fpsInterval)));
        frameCount = 0;
        fpsInterval = now;
      }
      lastTime = now;
      step += 1 * playbackSpeed;

      const w = canvas.width;
      const h = canvas.height;

      // Base background: deep black/grey terminal screen
      ctx.fillStyle = '#080808';
      ctx.fillRect(0, 0, w, h);

      // Render based on stream type
      if (video.streamType === 'matrix') {
        ctx.fillStyle = 'rgba(8, 8, 8, 0.2)';
        ctx.fillRect(0, 0, w, h);

        ctx.font = '14px monospace';
        for (let i = 0; i < matrixDrops.length; i++) {
          const char = chars[Math.floor(Math.random() * chars.length)];
          const x = i * 20;
          const y = matrixDrops[i] * 20;

          // Monochrome styling: leading char is bright white, trailing is light gray
          ctx.fillStyle = '#ffffff';
          ctx.fillText(char, x, y);

          ctx.fillStyle = 'rgba(160, 160, 160, 0.45)';
          ctx.fillText(chars[Math.floor(Math.random() * chars.length)], x, y - 20);

          if (y > h && Math.random() > 0.975) {
            matrixDrops[i] = 0;
          }
          if (isPlaying) {
            matrixDrops[i]++;
          }
        }

        // Overlay memory disassemble banner
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.font = '16px monospace';
        ctx.fillText(`[0x7FFF_${Math.floor(step * 16).toString(16).padStart(8, '0')}] MOV RAX, [RSP+0x28]`, 40, h - 80);
        ctx.fillText(`[STACK_FRAME] CANARY_VERIFIED // PAYLOAD_LEN: 1024_BYTES`, 40, h - 55);
      } else if (video.streamType === 'synthwave') {
        // 3D perspective wireframe grid
        ctx.strokeStyle = 'rgba(220, 220, 220, 0.35)';
        ctx.lineWidth = 1.5;

        const horizonY = h * 0.48;

        // Horizon line
        ctx.beginPath();
        ctx.moveTo(0, horizonY);
        ctx.lineTo(w, horizonY);
        ctx.stroke();

        // Sun / Moon wireframe in background
        ctx.beginPath();
        ctx.arc(w / 2, horizonY - 40, 90, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.stroke();

        // Horizontal perspective lines
        const speedOffset = (step * 2) % 35;
        for (let y = horizonY + 5; y < h; y += Math.pow((y - horizonY) * 0.12, 1.4) + 6) {
          const drawnY = y + speedOffset * ((y - horizonY) / (h - horizonY));
          if (drawnY < h) {
            ctx.beginPath();
            ctx.moveTo(0, drawnY);
            ctx.lineTo(w, drawnY);
            ctx.strokeStyle = `rgba(255, 255, 255, ${(drawnY - horizonY) / (h - horizonY) * 0.4})`;
            ctx.stroke();
          }
        }

        // Vanishing rays
        for (let x = -w * 0.5; x < w * 1.5; x += 60) {
          ctx.beginPath();
          ctx.moveTo(w / 2, horizonY);
          ctx.lineTo(x + Math.sin(step * 0.01) * 30, h);
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
          ctx.stroke();
        }

        // Center cursor / target
        ctx.strokeStyle = '#ffffff';
        ctx.strokeRect(w / 2 - 25, horizonY - 25, 50, 50);
        ctx.beginPath();
        ctx.moveTo(w / 2 - 35, horizonY);
        ctx.lineTo(w / 2 + 35, horizonY);
        ctx.moveTo(w / 2, horizonY - 35);
        ctx.lineTo(w / 2, horizonY + 35);
        ctx.stroke();
      } else if (video.streamType === 'audio_wave') {
        // Audio spectrum analyzer & Lissajous waveform
        const bars = 64;
        const barWidth = (w - 120) / bars;

        for (let i = 0; i < bars; i++) {
          const freq = (i + 1) * 0.15;
          const heightNorm = Math.abs(Math.sin(step * 0.05 + freq) * Math.cos(step * 0.02 + i * 0.2));
          const barHeight = heightNorm * (h * 0.5) + 10;
          const x = 60 + i * barWidth;
          const y = h / 2 - barHeight / 2;

          ctx.fillStyle = `rgba(255, 255, 255, ${0.3 + heightNorm * 0.6})`;
          ctx.fillRect(x, y, barWidth - 3, barHeight);

          // Top peak pip
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(x, y - 5, barWidth - 3, 2);
        }

        // Center oscilloscope circle
        ctx.beginPath();
        for (let angle = 0; angle < Math.PI * 2; angle += 0.05) {
          const r = 70 + Math.sin(angle * 6 + step * 0.08) * 20 + Math.cos(angle * 3 - step * 0.04) * 15;
          const px = w / 2 + Math.cos(angle) * r;
          const py = h / 2 + Math.sin(angle) * r;
          if (angle === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();
      } else if (video.streamType === 'cyber_radar') {
        // Rotating radar sweep & frequency waterfall
        const cx = w / 2;
        const cy = h / 2;
        const maxR = Math.min(w, h) * 0.42;

        // Concentric rings
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 1;
        for (let r = 50; r <= maxR; r += 50) {
          ctx.beginPath();
          ctx.arc(cx, cy, r, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Crosshairs
        ctx.beginPath();
        ctx.moveTo(cx - maxR, cy);
        ctx.lineTo(cx + maxR, cy);
        ctx.moveTo(cx, cy - maxR);
        ctx.lineTo(cx, cy + maxR);
        ctx.stroke();

        // Rotating beam
        const sweepAngle = (step * 0.03) % (Math.PI * 2);
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(sweepAngle);
        const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, maxR);
        grad.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
        grad.addColorStop(0.3, 'rgba(255, 255, 255, 0.3)');
        grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, maxR, -0.25, 0);
        ctx.lineTo(0, 0);
        ctx.fill();
        ctx.restore();

        // Detected blips
        const blips = [
          { r: 120, a: 1.2, id: 'TGT_0x89' },
          { r: 210, a: 3.5, id: 'BEACON_433' },
          { r: 165, a: 5.1, id: 'RF_UWB_TAP' },
        ];
        blips.forEach((b) => {
          const bx = cx + Math.cos(b.a) * b.r;
          const by = cy + Math.sin(b.a) * b.r;
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(bx - 3, by - 3, 6, 6);
          ctx.font = '11px monospace';
          ctx.fillText(`[${b.id}]`, bx + 8, by + 4);
        });
      } else {
        // Default / terminal trace
        ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
        ctx.font = '14px monospace';
        const startLine = Math.floor(step * 0.15) % 100;
        for (let l = 0; l < 22; l++) {
          const lineNum = (startLine + l).toString().padStart(4, '0');
          const address = (0x08048000 + (startLine + l) * 16).toString(16).toUpperCase();
          ctx.fillText(`0x${address} | ${lineNum}: 48 89 E5 48 83 EC 20 E8 ?? ?? ?? ?? 48 85 C0 74`, 50, 60 + l * 26);
        }
      }

      // Glitch slice artifact if glitching
      if (isGlitching || Math.random() < 0.03) {
        const sliceY = Math.random() * h;
        const sliceH = 10 + Math.random() * 30;
        const sliceOffset = (Math.random() - 0.5) * 40;
        ctx.drawImage(canvas, 0, sliceY, w, sliceH, sliceOffset, sliceY, w, sliceH);
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [video.streamType, playbackSpeed, isPlaying, isGlitching]);

  // Format seconds into MM:SS
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handlePlayToggle = () => {
    initAudio();
    setIsPlaying(!isPlaying);
  };

  const handleScrub = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setCurrentTime(val);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const triggerGlitchPulse = () => {
    setIsGlitching(true);
    setTimeout(() => setIsGlitching(false), 300);
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full bg-black border border-neutral-900 group select-none overflow-hidden ${
        isFullscreen ? 'fixed inset-0 z-50 flex flex-col justify-center' : 'aspect-video'
      }`}
    >
      {/* Primary Video Canvas */}
      <canvas
        ref={canvasRef}
        onClick={handlePlayToggle}
        className="w-full h-full object-cover cursor-pointer"
      />

      {/* Cyber Scanlines Overlay */}
      {showScanlines && (
        <div className="absolute inset-0 cyber-scanlines pointer-events-none opacity-80" />
      )}

      {/* Cyber HUD Terminal Telemetry Overlay */}
      {showHUD && (
        <div className="absolute top-3 left-4 right-4 flex items-center justify-between pointer-events-none text-[11px] font-mono text-neutral-400">
          <div className="flex items-center gap-3 bg-black/80 px-2 py-1 border border-neutral-800">
            <span className="flex items-center gap-1.5 text-white">
              <span className={`w-2 h-2 ${isPlaying ? 'bg-white' : 'bg-neutral-600'}`} />
              {isPlaying ? 'STREAM: LIVE' : 'STREAM: PAUSED'}
            </span>
            <span className="text-neutral-600">/</span>
            <span>FPS: {fps}</span>
            <span className="text-neutral-600">/</span>
            <span>BITRATE: 14.8 Mbps</span>
            <span className="text-neutral-600">/</span>
            <span>CODEC: RAW_VECTOR_0x1</span>
          </div>

          <div className="flex items-center gap-3 bg-black/80 px-2 py-1 border border-neutral-800">
            <span className="text-white">SYS_MODE: KURO_TERMINAL</span>
            <span className="text-neutral-600">/</span>
            <span>NODE: JP-TYO-09</span>
          </div>
        </div>
      )}

      {/* Play/Pause center flash indicator when paused */}
      {!isPlaying && (
        <button
          onClick={handlePlayToggle}
          className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-2xs cursor-pointer group-hover:opacity-100 transition-opacity"
          aria-label="Play video"
        >
          <div className="w-16 h-16 bg-white text-black flex items-center justify-center border border-black shadow-lg hover:scale-105 transition-transform">
            <Play className="w-8 h-8 fill-black translate-x-0.5" />
          </div>
        </button>
      )}

      {/* Bottom Controls Bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent p-3 pt-6 flex flex-col gap-2 opacity-95 group-hover:opacity-100 transition-opacity">
        {/* Scrubber Timeline */}
        <div className="relative flex items-center group/scrubber">
          <input
            type="range"
            min={0}
            max={totalDuration}
            step={1}
            value={currentTime}
            onChange={handleScrub}
            className="w-full h-1.5 bg-neutral-800 appearance-none cursor-pointer accent-white hover:h-2 transition-all focus:outline-hidden"
          />
        </div>

        {/* Control Buttons Row */}
        <div className="flex items-center justify-between text-neutral-300 font-mono text-xs">
          {/* Left: Play, Volume, Timecode */}
          <div className="flex items-center gap-3">
            <button
              onClick={handlePlayToggle}
              className="p-1 hover:text-white transition-colors"
              title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </button>

            {/* Next Video */}
            {onNext && (
              <button
                onClick={onNext}
                className="p-1 hover:text-white transition-colors"
                title="Next stream"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            )}

            {/* Volume & Mute */}
            <div className="flex items-center gap-1.5 group/vol">
              <button
                onClick={() => {
                  initAudio();
                  setIsMuted(!isMuted);
                }}
                className="p-1 hover:text-white transition-colors"
                title={isMuted ? 'Unmute cyber drone' : 'Mute'}
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-neutral-500" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={isMuted ? 0 : volume}
                onChange={(e) => {
                  initAudio();
                  setVolume(parseFloat(e.target.value));
                  if (isMuted) setIsMuted(false);
                }}
                className="w-16 h-1 bg-neutral-700 appearance-none cursor-pointer accent-white"
              />
            </div>

            {/* Timecode */}
            <div className="tabular-nums font-mono text-[11px] text-neutral-400 pl-1">
              <span className="text-white font-medium">{formatTime(currentTime)}</span>
              <span className="mx-1 text-neutral-600">/</span>
              <span>{formatTime(totalDuration)}</span>
            </div>
          </div>

          {/* Right: Modifiers & View controls */}
          <div className="flex items-center gap-2">
            {/* Speed Selector */}
            <div className="relative">
              <button
                onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                className="px-2 py-0.5 border border-neutral-700 hover:border-white hover:text-white transition-colors text-[11px]"
              >
                {playbackSpeed}x
              </button>
              {showSpeedMenu && (
                <div className="absolute bottom-7 right-0 bg-neutral-950 border border-neutral-700 py-1 shadow-xl flex flex-col z-30 min-w-[70px]">
                  {[0.5, 1.0, 1.5, 2.0].map((s) => (
                    <button
                      key={s}
                      onClick={() => {
                        setPlaybackSpeed(s);
                        setShowSpeedMenu(false);
                      }}
                      className={`px-3 py-1 text-left text-[11px] hover:bg-white hover:text-black transition-colors ${
                        playbackSpeed === s ? 'text-white font-bold bg-neutral-800' : 'text-neutral-400'
                      }`}
                    >
                      {s}x
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Toggle HUD */}
            <button
              onClick={() => setShowHUD(!showHUD)}
              className={`p-1.5 border transition-colors ${
                showHUD ? 'border-white text-white bg-neutral-900' : 'border-neutral-800 text-neutral-500 hover:text-white'
              }`}
              title="Toggle Cyber HUD telemetry"
            >
              <Terminal className="w-3.5 h-3.5" />
            </button>

            {/* Toggle Scanlines */}
            <button
              onClick={() => setShowScanlines(!showScanlines)}
              className={`p-1.5 border transition-colors ${
                showScanlines ? 'border-white text-white bg-neutral-900' : 'border-neutral-800 text-neutral-500 hover:text-white'
              }`}
              title="Toggle CRT Scanlines"
            >
              <Activity className="w-3.5 h-3.5" />
            </button>

            {/* Glitch Trigger */}
            <button
              onClick={triggerGlitchPulse}
              className="p-1.5 border border-neutral-800 text-neutral-400 hover:text-white hover:border-white transition-colors"
              title="Inject Glitch"
            >
              <Zap className="w-3.5 h-3.5" />
            </button>

            {/* Fullscreen */}
            <button
              onClick={toggleFullscreen}
              className="p-1.5 hover:text-white transition-colors"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
