import React, { useState } from 'react';
import { VideoItem } from '../types';
import { USER_LOGO_PATH } from '../data/videoData';
import { ShieldCheck, Play, Terminal, ArrowUpRight, Github, ExternalLink } from 'lucide-react';

interface ChannelViewProps {
  videos: VideoItem[];
  onSelectVideo: (video: VideoItem) => void;
  onOpenLogoModal: () => void;
}

export const ChannelView: React.FC<ChannelViewProps> = ({
  videos,
  onSelectVideo,
  onOpenLogoModal,
}) => {
  const [activeTab, setActiveTab] = useState<'videos' | 'playlists' | 'community' | 'about'>('videos');
  const [isSubscribed, setIsSubscribed] = useState(true);

  return (
    <div className="flex flex-col gap-6 font-mono">
      {/* Massive Channel Banner featuring the User's New Logo */}
      <div className="relative w-full h-56 sm:h-72 md:h-84 bg-neutral-950 border border-neutral-900 overflow-hidden group select-none">
        {/* Background Image: High-contrast monochrome anime artwork */}
        <img
          src={USER_LOGO_PATH}
          alt="Hunter Moore Channel Banner & Logo"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center grayscale contrast-125 opacity-90 group-hover:scale-102 transition-transform duration-700"
        />

        {/* Cyberpunk Scanlines & Vignette */}
        <div className="absolute inset-0 cyber-scanlines opacity-70 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

        {/* Top-Right HUD Coordinates */}
        <div className="absolute top-3 right-4 hidden sm:flex items-center gap-3 text-[11px] text-white/80 bg-black/80 px-3 py-1 border border-neutral-700">
          <span>LAT: 35.6762° N</span>
          <span className="text-neutral-500">/</span>
          <span>LON: 139.6503° E</span>
          <span className="text-neutral-500">/</span>
          <span>NODE: TOKYO_ZERO</span>
        </div>

        {/* Bottom Banner Title Overlay */}
        <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between">
          <div className="flex flex-col">
            <span className="text-xs text-neutral-400 font-mono">
              OFFICIAL CREATOR TRANSMISSION //
            </span>
            <span className="font-['Syne',sans-serif] text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              HUNTER MOORE
            </span>
          </div>

          <button
            onClick={onOpenLogoModal}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-black text-xs font-bold hover:bg-neutral-200 transition-colors border border-black shadow-lg"
          >
            <span>Inspect Logo Asset</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Channel Header Profile Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-200">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div
            onClick={onOpenLogoModal}
            className="w-18 h-18 border-2 border-black bg-white overflow-hidden shrink-0 cursor-pointer hover:scale-105 transition-transform"
            title="Inspect full logo artwork"
          >
            <img
              src={USER_LOGO_PATH}
              alt="Hunter Moore Avatar"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover grayscale contrast-125"
            />
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-neutral-950 font-['Syne',sans-serif]">
                HUNTER MOORE // CIPHER_GHOST
              </h1>
              <ShieldCheck className="w-4 h-4 text-black shrink-0" />
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-500 mt-0.5">
              <span>@hunter_moore</span>
              <span aria-hidden="true">·</span>
              <span className="text-neutral-900 font-semibold">{isSubscribed ? '482.1K' : '482K'} subscribers</span>
              <span aria-hidden="true">·</span>
              <span>48 video streams</span>
            </div>

            <p className="text-xs text-neutral-700 mt-1.5 line-clamp-1 max-w-xl">
              Reverse engineering, terminal soundscapes, hardware exploitation, and alt anime manga aesthetics.
            </p>
          </div>
        </div>

        {/* Subscribe & Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsSubscribed(!isSubscribed)}
            className={`px-5 py-2 text-xs font-bold transition-colors border ${
              isSubscribed
                ? 'bg-neutral-100 text-neutral-800 border-neutral-300 hover:bg-neutral-200'
                : 'bg-black text-white border-black hover:bg-neutral-800'
            }`}
          >
            {isSubscribed ? 'Subscribed' : 'Subscribe'}
          </button>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium border border-neutral-300 bg-white hover:bg-neutral-100 transition-colors text-neutral-800"
          >
            <Github className="w-3.5 h-3.5" />
            <span>GitHub</span>
          </a>
        </div>
      </div>

      {/* Channel Tabs */}
      <div className="flex items-center gap-6 border-b border-neutral-200 text-xs font-bold">
        <button
          onClick={() => setActiveTab('videos')}
          className={`pb-2.5 transition-colors border-b-2 ${
            activeTab === 'videos' ? 'border-black text-black' : 'border-transparent text-neutral-500 hover:text-black'
          }`}
        >
          Videos ({videos.length})
        </button>
        <button
          onClick={() => setActiveTab('playlists')}
          className={`pb-2.5 transition-colors border-b-2 ${
            activeTab === 'playlists' ? 'border-black text-black' : 'border-transparent text-neutral-500 hover:text-black'
          }`}
        >
          Playlists (4)
        </button>
        <button
          onClick={() => setActiveTab('community')}
          className={`pb-2.5 transition-colors border-b-2 ${
            activeTab === 'community' ? 'border-black text-black' : 'border-transparent text-neutral-500 hover:text-black'
          }`}
        >
          Terminal Logs (12)
        </button>
        <button
          onClick={() => setActiveTab('about')}
          className={`pb-2.5 transition-colors border-b-2 ${
            activeTab === 'about' ? 'border-black text-black' : 'border-transparent text-neutral-500 hover:text-black'
          }`}
        >
          About & Specs
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === 'videos' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {videos.map((vid) => (
            <div
              key={vid.id}
              onClick={() => onSelectVideo(vid)}
              className="flex flex-col bg-white border border-neutral-200 hover:border-black transition-all cursor-pointer group"
            >
              {/* Thumbnail */}
              <div className="relative aspect-video bg-neutral-950 overflow-hidden border-b border-neutral-200">
                {vid.tags.includes('MANGA') ? (
                  <img
                    src={USER_LOGO_PATH}
                    alt={vid.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover grayscale contrast-125 group-hover:scale-105 transition-transform"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col justify-between p-2 text-[10px] text-neutral-400 font-mono">
                    <div className="flex justify-between items-center text-neutral-500">
                      <span>[{vid.streamType.slice(0, 6).toUpperCase()}]</span>
                      <span className="text-white">STREAM</span>
                    </div>
                    <div className="text-center text-white font-bold group-hover:scale-105 transition-transform">
                      {vid.streamType === 'matrix' && '0x7FFF_0000_1000'}
                      {vid.streamType === 'audio_wave' && '|||| ||| |||||'}
                      {vid.streamType === 'cyber_radar' && '(( SWEEP ))'}
                      {vid.streamType === 'synthwave' && '/\\/\\ WIRE /\\/\\'}
                      {vid.streamType === 'terminal_trace' && '$ bin/exec'}
                    </div>
                    <div className="text-neutral-500 text-[9px]">RES: 3840x2160</div>
                  </div>
                )}

                <div className="absolute bottom-1 right-1 bg-black/90 text-white text-[10px] px-1 py-0.5 font-mono tabular-nums">
                  {vid.duration}
                </div>

                <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Play className="w-6 h-6 fill-white text-white" />
                </div>
              </div>

              {/* Title & Metadata */}
              <div className="p-3 flex flex-col gap-1.5">
                <h3 className="text-xs font-bold text-neutral-950 line-clamp-2 leading-snug group-hover:underline">
                  {vid.title}
                </h3>
                <div className="flex items-center gap-1.5 text-[11px] text-neutral-500">
                  <span className="tabular-nums">{vid.views} views</span>
                  <span aria-hidden="true">·</span>
                  <span>{vid.uploadedAt}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'playlists' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { title: 'EXPLOITS & REVERSE ENGINEERING', count: 14, id: 'pl-1' },
            { title: 'ANALOG SYNTH & MODULAR LOOPS', count: 9, id: 'pl-2' },
            { title: 'HARDWARE BUS SNIFFING (SDR/JTAG)', count: 12, id: 'pl-3' },
            { title: 'CYBERPUNK INK DRAWING & DESIGN', count: 13, id: 'pl-4' },
          ].map((pl) => (
            <div
              key={pl.id}
              onClick={() => onSelectVideo(videos[0])}
              className="border border-neutral-200 bg-white p-4 hover:border-black cursor-pointer transition-all flex flex-col justify-between h-40 group"
            >
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-neutral-500 font-mono">
                  PLAYLIST // {pl.count} STREAMS
                </span>
                <h3 className="text-sm font-bold text-neutral-950 group-hover:underline">
                  {pl.title}
                </h3>
              </div>
              <div className="flex items-center justify-between text-xs text-neutral-600 pt-3 border-t border-neutral-100">
                <span>View Full Playlist</span>
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'community' && (
        <div className="flex flex-col gap-4 max-w-3xl">
          <div className="p-4 bg-neutral-50 border border-neutral-200 text-xs space-y-2">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-200">
              <span className="font-bold text-black">HUNTER MOORE (Announcement)</span>
              <span className="text-neutral-500">Yesterday at 18:40</span>
            </div>
            <p className="text-neutral-800 leading-relaxed font-sans text-sm">
              New brand identity unveiled! The 4-protagonist manga ink artwork is now live as our main logo and channel art. We also launched the white cyberpunk terminal layout with subtle ambient floating Japanese calligraphy saying "hello how are you?" (こんにちは、お元気ですか？). Source code is published on GitHub.
            </p>
          </div>
        </div>
      )}

      {activeTab === 'about' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 flex flex-col gap-4 text-xs leading-relaxed text-neutral-800">
            <h3 className="text-sm font-bold text-black uppercase tracking-wider">
              Channel Description
            </h3>
            <p className="font-sans text-sm text-neutral-700">
              An experimental white-themed cyberpunk media streaming platform created by Hunter Moore. Focused on low-level security research, hardware hacking, modular audio synthesis, and high-contrast ink manga illustration.
            </p>
            <div className="p-3 bg-neutral-50 border border-neutral-200 space-y-1.5 font-mono">
              <div className="text-neutral-500">SPECIFICATIONS:</div>
              <div>· Architecture: React 19 + TypeScript + Vite + Tailwind CSS v4</div>
              <div>· Theme: Minimalist Monochrome Cyberpunk Terminal</div>
              <div>· Background: Dynamic Japanese Particle Physics (こんにちは、お元気ですか？)</div>
              <div>· Audio Engine: Web Audio API Low-Frequency Oscillators</div>
            </div>
          </div>

          <div className="flex flex-col gap-3 p-4 bg-neutral-50 border border-neutral-200 text-xs">
            <h3 className="font-bold text-black uppercase tracking-wider">
              Network Stats
            </h3>
            <div className="flex justify-between py-1 border-b border-neutral-200">
              <span className="text-neutral-500">Joined</span>
              <span className="font-bold text-black">March 2024</span>
            </div>
            <div className="flex justify-between py-1 border-b border-neutral-200">
              <span className="text-neutral-500">Total Views</span>
              <span className="font-bold text-black">2,498,120</span>
            </div>
            <div className="flex justify-between py-1 border-b border-neutral-200">
              <span className="text-neutral-500">Subscribers</span>
              <span className="font-bold text-black">482K</span>
            </div>
            <div className="flex justify-between py-1 border-b border-neutral-200">
              <span className="text-neutral-500">Location</span>
              <span className="font-bold text-black">Tokyo, Japan</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
