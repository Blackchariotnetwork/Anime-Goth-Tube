import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, X, Minimize2, Maximize2, Trash2 } from 'lucide-react';
import { VideoItem } from '../types';

interface TerminalDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  videos: VideoItem[];
  currentVideo: VideoItem;
  onSelectVideo: (video: VideoItem) => void;
  onTriggerGlitch: () => void;
  onUpdateBgSpeed: (speed: number) => void;
  onOpenLogoModal: () => void;
}

export const TerminalDrawer: React.FC<TerminalDrawerProps> = ({
  isOpen,
  onClose,
  videos,
  currentVideo,
  onSelectVideo,
  onTriggerGlitch,
  onUpdateBgSpeed,
  onOpenLogoModal,
}) => {
  const [inputVal, setInputVal] = useState('');
  const [history, setHistory] = useState<string[]>([
    'SYSTEM TERMINAL v2.4 // READY',
    'Type "help" to see available commands or "list" to view video streams.',
    'Background: Ambient Japanese glyphs 「こんにちは、お元気ですか？」 active.',
  ]);
  const [isExpanded, setIsExpanded] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  if (!isOpen) return null;

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = inputVal.trim();
    if (!cmd) return;

    const newHist = [...history, `>_ ${cmd}`];
    const parts = cmd.split(' ');
    const mainCmd = parts[0].toLowerCase();
    const arg = parts.slice(1).join(' ').toLowerCase();

    switch (mainCmd) {
      case 'help':
        newHist.push(
          'AVAILABLE SUBROUTINES:',
          '  list               - List all available video streams',
          '  play <id or index> - Switch playback (e.g. "play 2" or "play vid-05")',
          '  info               - Show current stream telemetry',
          '  japanese           - Breakdown of background symbols: 「こんにちは、お元気ですか？」',
          '  speed <0.5|1|2>    - Change background Japanese drift speed',
          '  glitch             - Trigger hardware display glitch',
          '  logo               - Inspect the high-res new logo artwork',
          '  clear              - Wipe terminal buffer',
          '  exit               - Close this terminal drawer'
        );
        break;

      case 'list':
        newHist.push('REGISTERED STREAMS:');
        videos.forEach((v, idx) => {
          newHist.push(`  [${idx + 1}] ID: ${v.id.padEnd(8)} | ${v.duration} | ${v.title}`);
        });
        break;

      case 'play': {
        if (!arg) {
          newHist.push('Error: Specify stream index or ID. e.g. "play 1" or "play vid-02"');
          break;
        }
        const idx = parseInt(arg, 10);
        let found: VideoItem | undefined;
        if (!isNaN(idx) && idx >= 1 && idx <= videos.length) {
          found = videos[idx - 1];
        } else {
          found = videos.find((v) => v.id.toLowerCase() === arg || v.id.toLowerCase().includes(arg));
        }

        if (found) {
          onSelectVideo(found);
          newHist.push(`OK: Switched stream to [${found.id}] ${found.title}`);
        } else {
          newHist.push(`Error: Stream "${arg}" not located. Type "list" to view catalog.`);
        }
        break;
      }

      case 'info':
        newHist.push(
          `CURRENT STREAM: ${currentVideo.title}`,
          `CHANNEL: ${currentVideo.channelTitle} (${currentVideo.subscribers} subs)`,
          `VIEWS: ${currentVideo.views}`,
          `STREAM_TYPE: ${currentVideo.streamType}`,
          `CHAPTERS: ${currentVideo.chapters.length} indexed`
        );
        break;

      case 'japanese':
        newHist.push(
          'BACKGROUND JAPANESE SYMBOLS TELEMETRY:',
          '  Phrase: 「こんにちは、お元気ですか？」',
          '  Romaji: "Konnichiwa, ogenki desu ka?"',
          '  English: "Hello, how are you?"',
          '  Composition:',
          '    - こんにちは (Konnichiwa) : Hello / Good day',
          '    - お元気ですか (Ogenki desu ka) : How are you? / Are you well?',
          '  Render Mode: Ambient floating particulate physics with sinusoidal horizontal sway.'
        );
        break;

      case 'speed': {
        const num = parseFloat(arg);
        if (!isNaN(num) && num >= 0.1 && num <= 5) {
          onUpdateBgSpeed(num);
          newHist.push(`OK: Japanese floating velocity set to ${num}x`);
        } else {
          newHist.push('Usage: speed <number> (e.g. "speed 0.5", "speed 2")');
        }
        break;
      }

      case 'glitch':
        onTriggerGlitch();
        newHist.push('OK: Glitch pulse triggered.');
        break;

      case 'logo':
        onOpenLogoModal();
        newHist.push('OK: Opening high-resolution logo artwork inspector.');
        break;

      case 'clear':
        setHistory([]);
        setInputVal('');
        return;

      case 'exit':
      case 'quit':
        onClose();
        setInputVal('');
        return;

      default:
        newHist.push(`Unknown command: "${cmd}". Type "help" for a list of subroutines.`);
    }

    setHistory(newHist);
    setInputVal('');
  };

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 bg-neutral-950 text-white font-mono border-t-2 border-black shadow-2xl transition-all duration-200 flex flex-col ${
        isExpanded ? 'h-[75vh]' : 'h-72'
      }`}
    >
      {/* Terminal Titlebar */}
      <div className="flex items-center justify-between px-4 py-2 bg-neutral-900 border-b border-neutral-800 text-xs">
        <div className="flex items-center gap-2">
          <TerminalIcon className="w-3.5 h-3.5 text-white" />
          <span className="font-bold text-white tracking-wider">
            CYBER_TERMINAL // v2.4
          </span>
          <span className="text-neutral-500">|</span>
          <span className="text-neutral-400">TTY: /dev/pts/0</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setHistory([])}
            className="p-1 text-neutral-400 hover:text-white transition-colors"
            title="Clear buffer"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 text-neutral-400 hover:text-white transition-colors"
            title={isExpanded ? 'Collapse' : 'Expand'}
          >
            {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={onClose}
            className="p-1 text-neutral-400 hover:text-white transition-colors"
            title="Close terminal"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Terminal Log Output */}
      <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto text-xs space-y-1 font-mono leading-relaxed">
        {history.map((line, idx) => (
          <div
            key={idx}
            className={`${
              line.startsWith('>_')
                ? 'text-white font-bold'
                : line.startsWith('Error:')
                ? 'text-red-400'
                : line.startsWith('OK:')
                ? 'text-emerald-400'
                : line.startsWith('AVAILABLE') || line.startsWith('REGISTERED')
                ? 'text-neutral-400 underline'
                : 'text-neutral-300'
            }`}
          >
            {line}
          </div>
        ))}
      </div>

      {/* Interactive Command Input */}
      <form onSubmit={handleCommand} className="flex items-center gap-2 px-4 py-2.5 bg-neutral-900 border-t border-neutral-800">
        <span className="text-white font-bold select-none">&gt;_</span>
        <input
          ref={inputRef}
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder="Enter command ('help', 'list', 'play 2', 'japanese', 'clear')..."
          className="flex-1 bg-transparent text-xs text-white font-mono placeholder:text-neutral-500 focus:outline-hidden"
        />
        <button
          type="submit"
          className="px-3 py-1 bg-white text-black text-xs font-bold hover:bg-neutral-200 transition-colors"
        >
          EXEC
        </button>
      </form>
    </div>
  );
};
