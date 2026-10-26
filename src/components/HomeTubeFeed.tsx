import React, { useState } from 'react';
import { VideoItem } from '../types';
import { USER_LOGO_PATH } from '../data/videoData';
import { Play, ShieldCheck, Flame, Radio } from 'lucide-react';

interface HomeTubeFeedProps {
  videos: VideoItem[];
  onSelectVideo: (video: VideoItem) => void;
  onOpenLogoModal: () => void;
}

export const HomeTubeFeed: React.FC<HomeTubeFeedProps> = ({
  videos,
  onSelectVideo,
  onOpenLogoModal,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = [
    'All',
    'Exploits',
    'Hardware',
    'Audio & Synth',
    'Manga & Ink',
    'Reverse Engineering',
    'Shaders',
    'Kernel Dev',
    'SDR Radio',
  ];

  const filteredVideos = videos.filter((vid) => {
    if (selectedCategory === 'All') return true;
    if (selectedCategory === 'Exploits') return vid.tags.includes('EXPLOITS') || vid.tags.includes('SECURITY');
    if (selectedCategory === 'Hardware') return vid.tags.includes('HARDWARE') || vid.tags.includes('SDR') || vid.tags.includes('EMBEDDED');
    if (selectedCategory === 'Audio & Synth') return vid.tags.includes('AUDIO') || vid.tags.includes('SYNTH') || vid.tags.includes('AMBIENT');
    if (selectedCategory === 'Manga & Ink') return vid.tags.includes('ART') || vid.tags.includes('MANGA') || vid.tags.includes('AESTHETIC');
    if (selectedCategory === 'Reverse Engineering') return vid.tags.includes('REVERSE_ENG') || vid.tags.includes('CRYPTO');
    if (selectedCategory === 'Shaders') return vid.tags.includes('SHADERS') || vid.tags.includes('GLSL') || vid.tags.includes('WEBGL');
    if (selectedCategory === 'Kernel Dev') return vid.tags.includes('KERNEL') || vid.tags.includes('LINUX') || vid.tags.includes('RISCV');
    if (selectedCategory === 'SDR Radio') return vid.tags.includes('SDR') || vid.tags.includes('RADIO') || vid.tags.includes('SATELLITE');
    return true;
  });

  return (
    <div className="flex flex-col gap-6 font-mono">
      {/* Category Pills / Filter bar (YouTube style) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-neutral-200">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 text-xs whitespace-nowrap transition-colors border cursor-pointer ${
              selectedCategory === cat
                ? 'bg-black text-white border-black font-bold'
                : 'bg-white text-neutral-700 border-neutral-300 hover:border-black hover:bg-neutral-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid of Videos: 5 videos per-line on desktop (xl:grid-cols-5) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-5 gap-x-4 gap-y-7">
        {filteredVideos.map((vid) => (
          <div
            key={vid.id}
            onClick={() => onSelectVideo(vid)}
            className="flex flex-col group cursor-pointer"
          >
            {/* Thumbnail Box (16:9 ratio) */}
            <div className="relative aspect-video w-full bg-neutral-950 overflow-hidden border border-neutral-300 group-hover:border-black transition-colors">
              {vid.tags.includes('MANGA') || vid.id === 'vid-05' || vid.id === 'vid-15' ? (
                <img
                  src={USER_LOGO_PATH}
                  alt={vid.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center grayscale contrast-125 group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex flex-col justify-between p-2.5 text-[10px] text-neutral-400 font-mono bg-neutral-950">
                  <div className="flex justify-between items-center text-neutral-500">
                    <span className="text-neutral-400 font-bold">[{vid.streamType.slice(0, 6).toUpperCase()}]</span>
                    <span className="text-white text-[9px] px-1 py-0.2 bg-neutral-800">4K_RAW</span>
                  </div>

                  <div className="text-center font-bold text-white/90 group-hover:scale-105 transition-transform">
                    {vid.streamType === 'matrix' && '0x7FFF_0000'}
                    {vid.streamType === 'audio_wave' && '|||| ||| |||||'}
                    {vid.streamType === 'cyber_radar' && '(( RF_SWEEP ))'}
                    {vid.streamType === 'synthwave' && '/\\/\\ WIRE /\\/\\'}
                    {vid.streamType === 'terminal_trace' && '$ asm -x86_64'}
                    {vid.streamType === 'glitch_anime' && '[MANGA_INK]'}
                  </div>

                  <div className="flex justify-between items-center text-[9px] text-neutral-500">
                    <span>ID: {vid.id}</span>
                    <span className="text-neutral-400">FPS: 60</span>
                  </div>
                </div>
              )}

              {/* Duration Badge */}
              <div className="absolute bottom-1.5 right-1.5 bg-black/90 text-white text-[10px] px-1.5 py-0.5 font-mono tabular-nums border border-neutral-700">
                {vid.duration}
              </div>

              {/* Hover overlay with Play button */}
              <div className="absolute inset-0 bg-black/25 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-10 h-10 bg-white text-black flex items-center justify-center border border-black shadow-md">
                  <Play className="w-5 h-5 fill-black translate-x-0.5" />
                </div>
              </div>
            </div>

            {/* Video Card Details */}
            <div className="flex gap-2.5 mt-2.5">
              {/* Channel Avatar featuring girls logo */}
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenLogoModal();
                }}
                className="w-9 h-9 border border-black bg-white overflow-hidden shrink-0 mt-0.5 hover:scale-105 transition-transform"
                title="Inspect channel logo artwork"
              >
                <img
                  src={USER_LOGO_PATH}
                  alt={vid.channelTitle}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover grayscale contrast-125"
                />
              </div>

              {/* Title & Metadata */}
              <div className="flex flex-col min-w-0">
                <h3 className="text-xs font-bold text-neutral-950 line-clamp-2 leading-snug group-hover:underline font-mono">
                  {vid.title}
                </h3>

                <div className="flex items-center gap-1 text-[11px] text-neutral-600 mt-1">
                  <span className="truncate">{vid.channelTitle}</span>
                  <ShieldCheck className="w-3 h-3 text-black inline shrink-0" />
                </div>

                <div className="flex items-center gap-1.5 text-[11px] text-neutral-500 mt-0.5 font-mono">
                  <span className="tabular-nums">{vid.views} views</span>
                  <span aria-hidden="true" className="text-neutral-400">·</span>
                  <span>{vid.uploadedAt}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
