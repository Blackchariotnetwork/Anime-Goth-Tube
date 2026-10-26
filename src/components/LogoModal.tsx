import React from 'react';
import { X, Download, ShieldCheck, Maximize2 } from 'lucide-react';
import { USER_LOGO_PATH } from '../data/videoData';

interface LogoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LogoModal: React.FC<LogoModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs font-mono">
      <div className="relative w-full max-w-4xl bg-white border-2 border-black shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-neutral-900 text-white text-xs border-b border-black">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-white" />
            <span className="font-bold tracking-wider">
              ASSET INSPECTOR // OFFICIAL BRAND LOGO ARTWORK
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-neutral-400 hover:text-white transition-colors"
            title="Close inspector"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex flex-col gap-4">
          {/* Main Image Frame with Cyberpunk framing */}
          <div className="relative border-2 border-black bg-neutral-100 overflow-hidden group">
            <img
              src={USER_LOGO_PATH}
              alt="Hunter Moore Official Logo"
              referrerPolicy="no-referrer"
              className="w-full h-auto object-contain max-h-[60vh] mx-auto grayscale contrast-125"
            />
            <div className="absolute top-2 left-2 bg-black/80 text-white text-[10px] px-2 py-0.5 font-mono">
              SRC: /assets/aistudio/Gemini_Generated_Image_uyxkqwuyxkqwuyxk_496eb726.jfif
            </div>
            <div className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] px-2 py-0.5 font-mono">
              RENDER: HIGH_CONTRAST_MONO
            </div>
          </div>

          {/* Details & Specs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="flex flex-col gap-2 p-3 bg-neutral-50 border border-neutral-200">
              <span className="font-bold text-black uppercase tracking-wider">
                Artwork Telemetry
              </span>
              <div className="space-y-1 text-neutral-600">
                <div>· Style: Monochrome Ink Manga Line Art</div>
                <div>· Subjects: 4 Alt Cyberpunk Figures (Tattoos, Chokers, Piercings)</div>
                <div>· Palette: Pure Black & Stark White Minimalist</div>
                <div>· Usage: Channel Wordmark, Tube Header & Feed Mascot</div>
              </div>
            </div>

            <div className="flex flex-col gap-2 p-3 bg-neutral-50 border border-neutral-200">
              <span className="font-bold text-black uppercase tracking-wider">
                Action Affordances
              </span>
              <p className="text-neutral-600 mb-1">
                You can download the raw logo file or copy the relative workspace asset path.
              </p>
              <div className="flex items-center gap-2 mt-auto">
                <a
                  href={USER_LOGO_PATH}
                  download="hunter_moore_new_logo.jfif"
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-black text-white text-xs font-bold hover:bg-neutral-800 transition-colors border border-black"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download File</span>
                </a>
                <button
                  onClick={onClose}
                  className="px-3 py-1.5 border border-neutral-300 text-neutral-800 text-xs hover:bg-neutral-100 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
