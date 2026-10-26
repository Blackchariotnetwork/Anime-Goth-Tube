import React, { useEffect, useRef, useState } from 'react';

interface Particle {
  x: number;
  y: number;
  text: string;
  size: number;
  speedY: number;
  speedX: number;
  opacity: number;
  baseOpacity: number;
  swayAmplitude: number;
  swaySpeed: number;
  swayOffset: number;
  isPhrase: boolean;
  rotation: number;
}

interface JapaneseFloatingBgProps {
  speedMultiplier?: number;
  particleDensity?: 'subtle' | 'medium' | 'dense';
  enabled?: boolean;
}

export const JapaneseFloatingBg: React.FC<JapaneseFloatingBgProps> = ({
  speedMultiplier = 1,
  particleDensity = 'medium',
  enabled = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [activeSpeed, setActiveSpeed] = useState<number>(speedMultiplier);
  const [showInspector, setShowInspector] = useState<boolean>(false);

  useEffect(() => {
    setActiveSpeed(speedMultiplier);
  }, [speedMultiplier]);

  useEffect(() => {
    if (!enabled) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Symbols saying "Hello, how are you?" in Japanese
    // Full sentence: こんにちは、お元気ですか？
    const phrases = [
      'こんにちは、お元気ですか？',
      'こんにちは',
      'お元気ですか？',
      'お元気ですか',
      '元気ですか？',
      'こんにちは！',
    ];

    const characters = [
      'こ', 'ん', 'に', 'ち', 'は', '、', 'お', '元', '気', 'で', 'す', 'か', '？',
      'こ', 'ん', 'に', 'ち', 'は', 'お', '元', '気', 'で', 'す', 'か',
    ];

    // Determine count based on density
    const count = particleDensity === 'subtle' ? 24 : particleDensity === 'dense' ? 65 : 42;

    const particles: Particle[] = [];

    const createParticle = (initialY?: number): Particle => {
      const isPhrase = Math.random() < 0.28;
      const text = isPhrase
        ? phrases[Math.floor(Math.random() * phrases.length)]
        : characters[Math.floor(Math.random() * characters.length)];

      const baseOpacity = isPhrase 
        ? 0.05 + Math.random() * 0.07 
        : 0.03 + Math.random() * 0.08;

      return {
        x: Math.random() * width,
        y: initialY !== undefined ? initialY : Math.random() * height,
        text,
        size: isPhrase ? 13 + Math.random() * 8 : 16 + Math.random() * 26,
        speedY: (0.15 + Math.random() * 0.35),
        speedX: (Math.random() - 0.5) * 0.1,
        opacity: baseOpacity,
        baseOpacity,
        swayAmplitude: 15 + Math.random() * 35,
        swaySpeed: 0.0008 + Math.random() * 0.0015,
        swayOffset: Math.random() * Math.PI * 2,
        isPhrase,
        rotation: (Math.random() - 0.5) * 0.1,
      };
    };

    for (let i = 0; i < count; i++) {
      particles.push(createParticle());
    }

    let time = 0;

    const render = () => {
      time += 1;
      ctx.clearRect(0, 0, width, height);

      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Move upwards slowly (slowly floating up)
        p.y -= p.speedY * activeSpeed;

        // Gentle horizontal sinusoidal sway
        const sway = Math.sin(time * p.swaySpeed + p.swayOffset) * (p.swayAmplitude * 0.015);
        p.x += p.speedX + sway;

        // Reset if drifted beyond top
        if (p.y < -60) {
          p.y = height + 40;
          p.x = Math.random() * width;
        }
        if (p.x < -100) p.x = width + 50;
        if (p.x > width + 100) p.x = -50;

        // Render glyph
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);

        // Crisp ink drawing with Noto Sans JP
        ctx.font = `${p.isPhrase ? '400' : '300'} ${p.size}px 'Noto Sans JP', sans-serif`;
        ctx.fillStyle = `rgba(10, 10, 10, ${p.opacity})`;
        ctx.fillText(p.text, 0, 0);

        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [enabled, activeSpeed, particleDensity]);

  if (!enabled) return null;

  return (
    <>
      {/* Background canvas fixed behind all UI */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-0"
        style={{ opacity: 0.95 }}
      />

      {/* Discreet cyberpunk HUD indicator in bottom-left */}
      <div className="fixed bottom-3 left-4 z-20 flex items-center gap-2 text-[11px] font-mono text-neutral-500 bg-white/90 backdrop-blur-xs border border-neutral-200 px-2.5 py-1 select-none shadow-xs">
        <button
          onClick={() => setShowInspector(!showInspector)}
          className="flex items-center gap-2 hover:text-black transition-colors"
          title="Toggle Japanese ambient drift inspector"
        >
          <span className="inline-block w-1.5 h-1.5 bg-neutral-900" />
          <span>BG_GLYPH: 「こんにちは、お元気ですか？」</span>
        </button>

        {showInspector && (
          <div className="flex items-center gap-2 pl-2 border-l border-neutral-300">
            <span className="text-neutral-400">EN: "Hello, how are you?"</span>
            <span className="text-neutral-300">/</span>
            <span className="text-neutral-500">SPEED:</span>
            <button
              onClick={() => setActiveSpeed(0.5)}
              className={`px-1 hover:text-black ${activeSpeed === 0.5 ? 'font-bold text-black underline' : ''}`}
            >
              0.5x
            </button>
            <button
              onClick={() => setActiveSpeed(1)}
              className={`px-1 hover:text-black ${activeSpeed === 1 ? 'font-bold text-black underline' : ''}`}
            >
              1x
            </button>
            <button
              onClick={() => setActiveSpeed(2)}
              className={`px-1 hover:text-black ${activeSpeed === 2 ? 'font-bold text-black underline' : ''}`}
            >
              2x
            </button>
          </div>
        )}
      </div>
    </>
  );
};
