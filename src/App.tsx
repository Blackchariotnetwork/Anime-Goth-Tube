import React, { useState, useEffect } from 'react';
import { JapaneseFloatingBg } from './components/JapaneseFloatingBg';
import { TopBar } from './components/TopBar';
import { CyberVideoPlayer } from './components/CyberVideoPlayer';
import { VideoInfo } from './components/VideoInfo';
import { RecommendedSidebar } from './components/RecommendedSidebar';
import { CommentsSection } from './components/CommentsSection';
import { TerminalDrawer } from './components/TerminalDrawer';
import { ChannelView } from './components/ChannelView';
import { LogoModal } from './components/LogoModal';
import { HomeTubeFeed } from './components/HomeTubeFeed';
import { INITIAL_VIDEOS, INITIAL_COMMENTS, USER_LOGO_PATH } from './data/videoData';
import { VideoItem, CommentItem } from './types';
import { Search, Terminal, ArrowLeft, Grid } from 'lucide-react';

export default function App() {
  const [videos, setVideos] = useState<VideoItem[]>(INITIAL_VIDEOS);
  const [currentVideo, setCurrentVideo] = useState<VideoItem>(INITIAL_VIDEOS[0]);
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null); // null = Home Tube Grid view
  const [comments, setComments] = useState<CommentItem[]>(INITIAL_COMMENTS);
  const [currentTab, setCurrentTab] = useState<'feed' | 'channel' | 'playlists' | 'transmissions' | 'source'>('feed');
  const [searchQuery, setSearchQuery] = useState('');
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [isLogoModalOpen, setIsLogoModalOpen] = useState(false);
  const [bgSpeed, setBgSpeed] = useState(1);
  const [isGlitching, setIsGlitching] = useState(false);

  // Global keyboard shortcut to open terminal (Backquote / Tilde: `)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '`' || e.key === '~') {
        e.preventDefault();
        setIsTerminalOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSelectTab = (tab: 'feed' | 'channel' | 'playlists' | 'transmissions' | 'source') => {
    setCurrentTab(tab);
    if (tab === 'feed') {
      setActiveVideoId(null); // Return to 5-per-line Home grid when Home/Feed is clicked
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectVideo = (video: VideoItem) => {
    setCurrentVideo(video);
    setActiveVideoId(video.id);
    setCurrentTab('feed');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNextVideo = () => {
    const currentIndex = videos.findIndex((v) => v.id === currentVideo.id);
    const nextIndex = (currentIndex + 1) % videos.length;
    setCurrentVideo(videos[nextIndex]);
    setActiveVideoId(videos[nextIndex].id);
  };

  const handleAddComment = (text: string) => {
    const newComment: CommentItem = {
      id: `c-${Date.now()}`,
      author: 'root@visitor',
      handle: '@visitor_node',
      avatar: USER_LOGO_PATH,
      content: text,
      timestamp: 'Just now',
      likes: 0,
    };
    setComments([newComment, ...comments]);
  };

  const triggerGlitch = () => {
    setIsGlitching(true);
    setTimeout(() => setIsGlitching(false), 350);
  };

  // Filtered list based on search bar
  const displayedVideos = videos.filter((v) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      v.title.toLowerCase().includes(q) ||
      v.channelTitle.toLowerCase().includes(q) ||
      v.tags.some((t) => t.toLowerCase().includes(q))
    );
  });

  return (
    <div className={`relative min-h-screen bg-white text-neutral-950 font-mono flex flex-col ${isGlitching ? 'glitch-active' : ''}`}>
      {/* Ambient Floating Japanese Symbols Background */}
      {/* "the background has japanes symbols lowly floating behind the page saying 'hello how are you?'" */}
      <JapaneseFloatingBg speedMultiplier={bgSpeed} particleDensity="medium" />

      {/* Cyber Grid background texture */}
      <div className="fixed inset-0 cyber-grid pointer-events-none opacity-60 z-0" />

      {/* Top Navigation Bar with Wide Girls Logo and no KUROTUBE text */}
      <TopBar
        currentTab={currentTab}
        onSelectTab={handleSelectTab}
        onOpenTerminal={() => setIsTerminalOpen(true)}
        onOpenLogoModal={() => setIsLogoModalOpen(true)}
      />

      {/* Subheader Search and Quick Filter Bar */}
      <div className="relative z-10 bg-white/90 border-b border-neutral-200">
        <div className="max-w-[1720px] mx-auto px-4 sm:px-6 py-2.5 flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter streams by title, tag, opcode..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-neutral-50 border border-neutral-300 focus:border-black focus:bg-white focus:outline-hidden transition-colors placeholder:text-neutral-400 font-mono"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2 text-[10px] text-neutral-400 hover:text-black font-bold"
              >
                CLEAR
              </button>
            )}
          </div>

          {/* Quick Info & Telemetry indicators */}
          <div className="flex items-center gap-4 text-[11px] text-neutral-500 font-mono self-end sm:self-center">
            {activeVideoId !== null ? (
              <button
                onClick={() => setActiveVideoId(null)}
                className="flex items-center gap-1.5 text-black font-bold hover:underline"
              >
                <Grid className="w-3.5 h-3.5" />
                <span>GRID VIEW (5-PER-LINE)</span>
              </button>
            ) : (
              <span className="text-black font-bold">5 VIDEOS / LINE</span>
            )}
            <span aria-hidden="true" className="text-neutral-300">/</span>
            <span className="hidden md:inline">PRESS <kbd className="px-1.5 py-0.5 bg-neutral-100 border border-neutral-300 text-black font-bold">`</kbd> FOR CLI</span>
            <span aria-hidden="true" className="hidden md:inline text-neutral-300">/</span>
            <button
              onClick={() => setIsLogoModalOpen(true)}
              className="flex items-center gap-1.5 text-neutral-700 hover:text-black hover:underline"
            >
              <span>LOGO ARTWORK</span>
            </button>
            <span aria-hidden="true" className="text-neutral-300">/</span>
            <span className="text-neutral-900 font-bold">STREAMS: {displayedVideos.length}</span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 max-w-[1720px] w-full mx-auto px-4 sm:px-6 py-6">
        {currentTab === 'feed' && (
          <>
            {/* If no video is actively opened: show regular Tube 5-per-line Home Grid! */}
            {activeVideoId === null ? (
              <HomeTubeFeed
                videos={displayedVideos}
                onSelectVideo={handleSelectVideo}
                onOpenLogoModal={() => setIsLogoModalOpen(true)}
              />
            ) : (
              /* Watch Page View */
              <div className="flex flex-col gap-4">
                {/* Back to 5-per-line Home Grid button */}
                <div className="flex items-center justify-between pb-2 border-b border-neutral-200">
                  <button
                    onClick={() => setActiveVideoId(null)}
                    className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-neutral-900 bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 transition-colors"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to Home Grid (5 Videos Per-Line)</span>
                  </button>

                  <span className="text-xs text-neutral-500 font-mono">
                    STREAM_ID: {currentVideo.id}
                  </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Primary Video Player & Details Column (8 cols on desktop) */}
                  <div className="lg:col-span-8 flex flex-col gap-6">
                    <CyberVideoPlayer
                      video={currentVideo}
                      onNext={handleNextVideo}
                    />

                    <VideoInfo
                      video={currentVideo}
                      onOpenChannel={() => setCurrentTab('channel')}
                      onOpenLogoModal={() => setIsLogoModalOpen(true)}
                    />

                    <CommentsSection
                      comments={comments}
                      onAddComment={handleAddComment}
                    />
                  </div>

                  {/* Recommended Streams Sidebar Column (4 cols on desktop) */}
                  <div className="lg:col-span-4">
                    <RecommendedSidebar
                      videos={displayedVideos}
                      currentVideoId={currentVideo.id}
                      onSelectVideo={handleSelectVideo}
                    />
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {currentTab === 'channel' && (
          <ChannelView
            videos={videos}
            onSelectVideo={handleSelectVideo}
            onOpenLogoModal={() => setIsLogoModalOpen(true)}
          />
        )}

        {currentTab === 'transmissions' && (
          <div className="flex flex-col gap-6 font-mono">
            <div className="pb-3 border-b border-neutral-200">
              <h1 className="text-xl font-bold text-black font-['Syne',sans-serif]">
                ALL ACTIVE TRANSMISSIONS // LIVE STREAMS
              </h1>
              <p className="text-xs text-neutral-500 mt-1">
                Real-time procedural matrix buffers, spectrum analyzers, and hardware telemetry feeds.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {videos.map((vid) => (
                <div
                  key={vid.id}
                  onClick={() => handleSelectVideo(vid)}
                  className="border border-neutral-200 bg-white hover:border-black cursor-pointer transition-all flex flex-col group"
                >
                  <div className="aspect-video bg-neutral-950 relative overflow-hidden">
                    <img
                      src={USER_LOGO_PATH}
                      alt={vid.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover grayscale contrast-125 group-hover:scale-105 transition-transform opacity-75"
                    />
                    <div className="absolute inset-0 bg-black/40 cyber-scanlines" />
                    <div className="absolute top-2 left-2 text-[10px] text-white bg-black/80 px-2 py-0.5">
                      {vid.streamType.toUpperCase()}
                    </div>
                    <div className="absolute bottom-2 right-2 text-[10px] text-white bg-black/80 px-1.5 py-0.5 tabular-nums">
                      {vid.duration}
                    </div>
                  </div>
                  <div className="p-2.5 flex flex-col gap-1">
                    <h3 className="text-xs font-bold text-neutral-950 group-hover:underline line-clamp-1">
                      {vid.title}
                    </h3>
                    <div className="flex items-center gap-1.5 text-[11px] text-neutral-500">
                      <span>{vid.channelTitle}</span>
                      <span aria-hidden="true">·</span>
                      <span className="tabular-nums">{vid.views} views</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentTab === 'playlists' && (
          <div className="flex flex-col gap-6 font-mono">
            <div className="pb-3 border-b border-neutral-200">
              <h1 className="text-xl font-bold text-black font-['Syne',sans-serif]">
                SYSTEM PLAYLIST ARCHIVES
              </h1>
              <p className="text-xs text-neutral-500 mt-1">
                Curated collections of vulnerability demonstrations, audio synthesis, and design workflows.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { title: 'EXPLOITS & REVERSE ENGINEERING', count: 14, desc: 'V8 internals, ROP chains, Ghidra analysis' },
                { title: 'ANALOG SYNTH & MODULAR LOOPS', count: 9, desc: '40-minute focused coding soundscapes' },
                { title: 'HARDWARE RF & BUS SNIFFING', count: 12, desc: 'HackRF One sweeps, JTAG test pins' },
                { title: 'MANGA INK & VECTOR ART', count: 8, desc: 'Process behind the 4-protagonist logo' },
                { title: 'PROCEDURAL SHADERS & WEBGL', count: 6, desc: 'Raymarching and infinite wireframe grids' },
              ].map((pl, idx) => (
                <div
                  key={idx}
                  onClick={() => handleSelectVideo(videos[idx % videos.length])}
                  className="border border-neutral-200 bg-white p-5 hover:border-black cursor-pointer transition-all flex flex-col justify-between h-48 group"
                >
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] text-neutral-500">INDEX // 0{idx + 1}</span>
                    <h3 className="text-sm font-bold text-neutral-950 group-hover:underline">
                      {pl.title}
                    </h3>
                    <p className="text-xs text-neutral-600 mt-1 font-sans">
                      {pl.desc}
                    </p>
                  </div>
                  <div className="flex items-center justify-between text-xs text-neutral-600 pt-3 border-t border-neutral-100">
                    <span className="font-bold text-black">{pl.count} Streams</span>
                    <span className="group-hover:translate-x-1 transition-transform">Play All →</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentTab === 'source' && (
          <div className="flex flex-col gap-6 font-mono max-w-4xl">
            <div className="pb-3 border-b border-neutral-200">
              <h1 className="text-xl font-bold text-black font-['Syne',sans-serif]">
                SOURCE CODE & THEME SPECIFICATIONS
              </h1>
              <p className="text-xs text-neutral-500 mt-1">
                White cyberpunk terminal media architecture.
              </p>
            </div>

            <div className="p-4 bg-neutral-50 border border-neutral-200 text-xs space-y-4">
              <div>
                <span className="font-bold text-black uppercase tracking-wider block mb-1">
                  Brand Asset Reference:
                </span>
                <code className="bg-neutral-200 px-2 py-0.5 text-black">
                  /public/assets/aistudio/Gemini_Generated_Image_uyxkqwuyxkqwuyxk_496eb726.jfif
                </code>
              </div>

              <div>
                <span className="font-bold text-black uppercase tracking-wider block mb-1">
                  Ambient Japanese Floating Symbols:
                </span>
                <p className="text-neutral-700 font-sans">
                  The canvas element is pinned in the background with HTML5 2D context particle physics. It generates glyphs from the sentence:
                </p>
                <div className="mt-1 p-2 bg-neutral-900 text-white font-mono text-sm">
                  「こんにちは、お元気ですか？」 (Hello, how are you?)
                </div>
              </div>

              <div>
                <span className="font-bold text-black uppercase tracking-wider block mb-1">
                  Design Constitution Compliance:
                </span>
                <ul className="list-disc list-inside space-y-1 text-neutral-700">
                  <li>Regular Tube layout: 5 videos per-line responsive grid with category filter bar.</li>
                  <li>Zero static pill badges for metadata (clean typographic separators used instead).</li>
                  <li>Strict 3-zone Top Bar Contract (Wide girls logo, text nav links, 1 primary button).</li>
                  <li>Pure white aesthetic (#ffffff canvas with stark jet black ink accents).</li>
                  <li>Interactive procedural video engine with HUD, CRT scanlines, and audio synth.</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-neutral-200 bg-white/90 py-6 mt-12 font-mono text-xs text-neutral-500">
        <div className="max-w-[1720px] mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsLogoModalOpen(true)}
              className="w-6 h-6 border border-black overflow-hidden bg-white shrink-0"
              title="Inspect logo"
            >
              <img
                src={USER_LOGO_PATH}
                alt="Logo"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover grayscale contrast-125"
              />
            </button>
            <span>MINIMAL WHITE CYBERPUNK TERMINAL</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span>BG: 「こんにちは、お元気ですか？」</span>
            <span aria-hidden="true" className="text-neutral-300">·</span>
            <span>HUNTER MOORE LABS</span>
          </div>
        </div>
      </footer>

      {/* Terminal CLI Drawer */}
      <TerminalDrawer
        isOpen={isTerminalOpen}
        onClose={() => setIsTerminalOpen(false)}
        videos={videos}
        currentVideo={currentVideo}
        onSelectVideo={handleSelectVideo}
        onTriggerGlitch={triggerGlitch}
        onUpdateBgSpeed={setBgSpeed}
        onOpenLogoModal={() => setIsLogoModalOpen(true)}
      />

      {/* Logo Artwork Lightbox Modal */}
      <LogoModal
        isOpen={isLogoModalOpen}
        onClose={() => setIsLogoModalOpen(false)}
      />
    </div>
  );
}
