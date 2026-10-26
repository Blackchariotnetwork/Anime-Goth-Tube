import React from 'react';
import { Terminal, Search } from 'lucide-react';
import { USER_LOGO_PATH } from '../data/videoData';

interface TopBarProps {
  currentTab: 'feed' | 'channel' | 'playlists' | 'transmissions' | 'source';
  onSelectTab: (tab: 'feed' | 'channel' | 'playlists' | 'transmissions' | 'source') => void;
  onOpenTerminal: () => void;
  onOpenLogoModal: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  currentTab,
  onSelectTab,
  onOpenTerminal,
  onOpenLogoModal,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200">
      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-6 sm:gap-8">
        {/* Zone 1: Wide Girls Logo Banner (KUROTUBE text removed) */}
        <div className="flex items-center whitespace-nowrap shrink-0">
          <button
            onClick={() => onSelectTab('feed')}
            className="group relative flex items-center text-left focus:outline-hidden cursor-pointer"
            title="Return to Home Feed"
            aria-label="Brand Logo"
          >
            <div className="h-12 sm:h-15 w-52 sm:w-80 md:w-96 lg:w-[410px] border border-black overflow-hidden bg-white shrink-0 group-hover:border-neutral-700 transition-colors shadow-xs">
              <img
                src={USER_LOGO_PATH}
                alt="Brand Logo"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-[center_32%] grayscale contrast-125 group-hover:scale-102 transition-transform duration-300"
              />
            </div>
          </button>
        </div>

        {/* Zone 2: 4–5 single-line clean text nav links */}
        <nav className="hidden md:flex items-center gap-7 text-xs font-mono font-medium text-neutral-600">
          <button
            onClick={() => onSelectTab('feed')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              currentTab === 'feed'
                ? 'text-black border-b-2 border-black font-semibold'
                : 'hover:text-black'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => onSelectTab('transmissions')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              currentTab === 'transmissions'
                ? 'text-black border-b-2 border-black font-semibold'
                : 'hover:text-black'
            }`}
          >
            Transmissions
          </button>
          <button
            onClick={() => onSelectTab('playlists')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              currentTab === 'playlists'
                ? 'text-black border-b-2 border-black font-semibold'
                : 'hover:text-black'
            }`}
          >
            Playlists
          </button>
          <button
            onClick={() => onSelectTab('channel')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              currentTab === 'channel'
                ? 'text-black border-b-2 border-black font-semibold'
                : 'hover:text-black'
            }`}
          >
            Channel
          </button>
          <button
            onClick={() => onSelectTab('source')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              currentTab === 'source'
                ? 'text-black border-b-2 border-black font-semibold'
                : 'hover:text-black'
            }`}
          >
            Source Code
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenTerminal}
            className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-mono font-medium text-white bg-black hover:bg-neutral-800 transition-colors whitespace-nowrap shrink-0 border border-black shadow-xs"
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Terminal CLI</span>
          </button>
        </div>
      </div>
    </header>
  );
};
