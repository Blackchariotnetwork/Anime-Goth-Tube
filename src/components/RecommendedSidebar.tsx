import React, { useState } from 'react';
import { VideoItem } from '../types';
import { USER_LOGO_PATH } from '../data/videoData';
import { Play } from 'lucide-react';

interface RecommendedSidebarProps {
  videos: VideoItem[];
  currentVideoId: string;
  onSelectVideo: (video: VideoItem) => void;
}

export const RecommendedSidebar: React.FC<RecommendedSidebarProps> = ({
  videos,
  currentVideoId,
  onSelectVideo,
}) => {
  const [filter, setFilter] = useState<string>('all');
  const [autoplay, setAutoplay] = useState<boolean>(true);

  const filteredVideos = videos.filter((v) => {
    if (filter === 'all') return true;
    if (filter === 'exploits') return v.tags.includes('EXPLOITS') || v.tags.includes('REVERSE_ENG');
    if (filter === 'hardware') return v.tags.includes('HARDWARE') || v.tags.includes('SDR');
    if (filter === 'ambient') return v.tags.includes('AMBIENT') || v.tags.includes('AUDIO');
    return true;
  });

  return (
    <div className="flex flex-col gap-4 font-mono">
      {/* Autoplay & Header */}
      <div className="flex items-center justify-between pb-2 border-b border-neutral-200">
        <span className="text-xs font-bold uppercase tracking-wider text-neutral-900">
          Terminal Feed // Up Next
        </span>
        <label className="flex items-center gap-2 cursor-pointer text-xs text-neutral-600">
          <span>Autoplay</span>
          <input
            type="checkbox"
            checked={autoplay}
            onChange={(e) => setAutoplay(e.target.checked)}
            className="w-3.5 h-3.5 accent-black cursor-pointer"
          />
        </label>
      </div>

      {/* Category filter segmented controls */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        <button
          onClick={() => setFilter('all')}
          className={`px-2.5 py-1 text-[11px] whitespace-nowrap transition-colors border ${
            filter === 'all'
              ? 'bg-black text-white border-black font-semibold'
              : 'bg-neutral-100 text-neutral-700 border-neutral-200 hover:border-black'
          }`}
        >
          All Streams
        </button>
        <button
          onClick={() => setFilter('exploits')}
          className={`px-2.5 py-1 text-[11px] whitespace-nowrap transition-colors border ${
            filter === 'exploits'
              ? 'bg-black text-white border-black font-semibold'
              : 'bg-neutral-100 text-neutral-700 border-neutral-200 hover:border-black'
          }`}
        >
          Exploits
        </button>
        <button
          onClick={() => setFilter('hardware')}
          className={`px-2.5 py-1 text-[11px] whitespace-nowrap transition-colors border ${
            filter === 'hardware'
              ? 'bg-black text-white border-black font-semibold'
              : 'bg-neutral-100 text-neutral-700 border-neutral-200 hover:border-black'
          }`}
        >
          Hardware
        </button>
        <button
          onClick={() => setFilter('ambient')}
          className={`px-2.5 py-1 text-[11px] whitespace-nowrap transition-colors border ${
            filter === 'ambient'
              ? 'bg-black text-white border-black font-semibold'
              : 'bg-neutral-100 text-neutral-700 border-neutral-200 hover:border-black'
          }`}
        >
          Ambient
        </button>
      </div>

      {/* Video Cards List */}
      <div className="flex flex-col gap-3">
        {filteredVideos.map((vid) => {
          const isSelected = vid.id === currentVideoId;

          return (
            <div
              key={vid.id}
              onClick={() => onSelectVideo(vid)}
              className={`flex gap-3 p-2 cursor-pointer transition-all border group ${
                isSelected
                  ? 'bg-neutral-100 border-black'
                  : 'bg-white/80 hover:bg-neutral-50 border-neutral-200 hover:border-neutral-400'
              }`}
            >
              {/* Thumbnail Container */}
              <div className="relative w-36 aspect-video bg-neutral-900 shrink-0 overflow-hidden border border-neutral-800">
                {/* Visual Thumbnail based on stream type */}
                {vid.tags.includes('MANGA') ? (
                  <img
                    src={USER_LOGO_PATH}
                    alt={vid.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover grayscale contrast-125 group-hover:scale-105 transition-transform"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col justify-between p-1.5 text-[9px] text-neutral-400 font-mono bg-neutral-950">
                    <div className="flex justify-between items-center text-neutral-500">
                      <span>[{vid.streamType.slice(0, 6).toUpperCase()}]</span>
                      <span className="text-white">SYS_OK</span>
                    </div>
                    <div className="text-center text-neutral-300 font-bold group-hover:text-white transition-colors">
                      {vid.streamType === 'matrix' && '01010010 01001111 01010000'}
                      {vid.streamType === 'audio_wave' && '||| | |||| || ||| |'}
                      {vid.streamType === 'cyber_radar' && '(( RADAR SWEEP ))'}
                      {vid.streamType === 'synthwave' && '/\\/\\/\\/\\/\\/\\'}
                      {vid.streamType === 'terminal_trace' && '$ disassembly -x86'}
                      {vid.streamType === 'glitch_anime' && '[ANIME_LINE_ART]'}
                    </div>
                    <div className="text-neutral-600">ID: {vid.id}</div>
                  </div>
                )}

                {/* Duration Badge */}
                <div className="absolute bottom-1 right-1 bg-black/90 text-white text-[10px] px-1 py-0.2 font-mono tabular-nums">
                  {vid.duration}
                </div>

                {/* Hover Play Icon Overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Play className="w-5 h-5 fill-white text-white" />
                </div>
              </div>

              {/* Text Info */}
              <div className="flex flex-col justify-start min-w-0">
                <h3 className="text-xs font-bold text-neutral-950 line-clamp-2 leading-snug group-hover:underline">
                  {vid.title}
                </h3>
                <span className="text-[11px] text-neutral-600 mt-1 truncate">
                  {vid.channelTitle}
                </span>
                <div className="flex items-center gap-1.5 text-[11px] text-neutral-500 mt-0.5">
                  <span className="tabular-nums">{vid.views} views</span>
                  <span aria-hidden="true">·</span>
                  <span>{vid.uploadedAt}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
