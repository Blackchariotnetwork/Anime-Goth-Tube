import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown, Share2, Download, Bookmark, Check, ShieldCheck, ChevronDown, ChevronUp } from 'lucide-react';
import { VideoItem } from '../types';
import { USER_LOGO_PATH } from '../data/videoData';

interface VideoInfoProps {
  video: VideoItem;
  onOpenChannel: () => void;
  onOpenLogoModal: () => void;
  onSeekToChapter?: (seconds: number) => void;
}

export const VideoInfo: React.FC<VideoInfoProps> = ({
  video,
  onOpenChannel,
  onOpenLogoModal,
  onSeekToChapter,
}) => {
  const [likes, setLikes] = useState<number>(video.likes);
  const [hasLiked, setHasLiked] = useState<boolean>(false);
  const [hasDisliked, setHasDisliked] = useState<boolean>(false);
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [showShareToast, setShowShareToast] = useState<boolean>(false);
  const [showFullDesc, setShowFullDesc] = useState<boolean>(false);

  const handleLike = () => {
    if (hasLiked) {
      setLikes((prev) => prev - 1);
      setHasLiked(false);
    } else {
      setLikes((prev) => prev + 1);
      setHasLiked(true);
      if (hasDisliked) setHasDisliked(false);
    }
  };

  const handleDislike = () => {
    setHasDisliked(!hasDisliked);
    if (hasLiked) {
      setLikes((prev) => prev - 1);
      setHasLiked(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setShowShareToast(true);
    setTimeout(() => setShowShareToast(false), 2400);
  };

  const handleDownloadLog = () => {
    const text = `=== TERMINAL DUMP ===
STREAM ID: ${video.id}
TITLE: ${video.title}
CHANNEL: ${video.channelTitle}
VIEWS: ${video.views}
UPLOADED: ${video.uploadedAt}

TERMINAL EXECUTION LOGS:
${video.terminalLogs.join('\n')}

CHAPTERS:
${video.chapters.map((c) => `[${c.time}] ${c.title}`).join('\n')}

DESCRIPTION:
${video.description}

END OF TRANSMISSION
`;
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${video.id}_terminal_dump.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col gap-4 font-mono">
      {/* Title */}
      <h1 className="text-xl md:text-2xl font-bold tracking-tight text-neutral-950 font-['Syne',sans-serif] leading-tight">
        {video.title}
      </h1>

      {/* Metadata strip: clean unboxed text with typographic separators */}
      <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-500">
        <span className="text-neutral-900 font-semibold">{video.views} views</span>
        <span aria-hidden="true">·</span>
        <span>{video.uploadedAt}</span>
        <span aria-hidden="true">·</span>
        <span className="text-neutral-700">CODEC: 0xRAW</span>
        <span aria-hidden="true">·</span>
        <div className="flex items-center gap-1.5">
          {video.tags.map((tag, idx) => (
            <span key={tag}>
              #{tag}
              {idx < video.tags.length - 1 && <span className="ml-1 text-neutral-300">/</span>}
            </span>
          ))}
        </div>
      </div>

      {/* Action Row & Channel Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2 border-y border-neutral-200">
        {/* Channel Info */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenLogoModal}
            className="w-11 h-11 border border-black bg-white overflow-hidden shrink-0 group relative cursor-pointer"
            title="Inspect channel logo artwork"
          >
            <img
              src={USER_LOGO_PATH}
              alt={video.channelTitle}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform grayscale contrast-125"
            />
          </button>

          <div className="flex flex-col">
            <button
              onClick={onOpenChannel}
              className="flex items-center gap-1.5 text-sm font-bold text-neutral-950 hover:underline text-left"
            >
              <span>{video.channelTitle}</span>
              <ShieldCheck className="w-3.5 h-3.5 text-black inline shrink-0" />
            </button>
            <span className="text-xs text-neutral-500">
              {isSubscribed ? '482.1K' : '482K'} subscribers
            </span>
          </div>

          <button
            onClick={() => setIsSubscribed(!isSubscribed)}
            className={`ml-3 px-4 py-1.5 text-xs font-medium transition-colors border ${
              isSubscribed
                ? 'bg-neutral-100 text-neutral-800 border-neutral-300 hover:bg-neutral-200'
                : 'bg-black text-white border-black hover:bg-neutral-800'
            }`}
          >
            {isSubscribed ? 'Subscribed' : 'Subscribe'}
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Like / Dislike group */}
          <div className="flex items-center border border-neutral-300 bg-white">
            <button
              onClick={handleLike}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium hover:bg-neutral-100 transition-colors ${
                hasLiked ? 'text-black font-bold bg-neutral-100' : 'text-neutral-700'
              }`}
            >
              <ThumbsUp className={`w-3.5 h-3.5 ${hasLiked ? 'fill-black' : ''}`} />
              <span className="tabular-nums">{(likes).toLocaleString()}</span>
            </button>
            <div className="w-[1px] h-4 bg-neutral-200" />
            <button
              onClick={handleDislike}
              className={`px-2.5 py-1.5 text-xs hover:bg-neutral-100 transition-colors ${
                hasDisliked ? 'text-black font-bold bg-neutral-100' : 'text-neutral-500'
              }`}
              title="Dislike"
            >
              <ThumbsDown className={`w-3.5 h-3.5 ${hasDisliked ? 'fill-black' : ''}`} />
            </button>
          </div>

          {/* Share */}
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-neutral-300 bg-white hover:bg-neutral-100 transition-colors text-neutral-800"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share</span>
          </button>

          {/* Download terminal log */}
          <button
            onClick={handleDownloadLog}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-neutral-300 bg-white hover:bg-neutral-100 transition-colors text-neutral-800"
            title="Download terminal log"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Log .TXT</span>
          </button>

          {/* Save / Queue */}
          <button
            onClick={() => setIsSaved(!isSaved)}
            className={`p-1.5 border border-neutral-300 transition-colors ${
              isSaved ? 'bg-black text-white border-black' : 'bg-white text-neutral-700 hover:bg-neutral-100'
            }`}
            title="Save to watchlist"
          >
            <Bookmark className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Share Toast */}
      {showShareToast && (
        <div className="flex items-center gap-2 p-2 bg-neutral-900 text-white text-xs border border-black shadow-md">
          <Check className="w-3.5 h-3.5 text-white" />
          <span>Stream URL copied to clipboard: {window.location.href}</span>
        </div>
      )}

      {/* Collapsible Terminal Description Box */}
      <div className="bg-neutral-50 border border-neutral-200 p-4 text-xs text-neutral-800 flex flex-col gap-3">
        {/* Chapters Strip */}
        {video.chapters && video.chapters.length > 0 && (
          <div className="flex flex-col gap-1.5 pb-3 border-b border-neutral-200">
            <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
              Index Chapters:
            </span>
            <div className="flex flex-wrap gap-2 text-xs">
              {video.chapters.map((chap) => (
                <button
                  key={chap.seconds}
                  onClick={() => onSeekToChapter && onSeekToChapter(chap.seconds)}
                  className="flex items-center gap-1 hover:text-black underline text-neutral-600 transition-colors"
                >
                  <span className="font-bold text-black tabular-nums">[{chap.time}]</span>
                  <span>{chap.title}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Text Description */}
        <div className={`whitespace-pre-line leading-relaxed ${showFullDesc ? '' : 'line-clamp-3'}`}>
          {video.description}
        </div>

        {/* Terminal execution log preview */}
        {showFullDesc && (
          <div className="mt-2 p-3 bg-neutral-950 text-neutral-300 font-mono text-[11px] border border-neutral-800 space-y-1">
            <div className="text-neutral-500 pb-1 border-b border-neutral-800 mb-1">
              KERNEL LOG BUFFER // LAST RUN:
            </div>
            {video.terminalLogs.map((log, i) => (
              <div key={i} className="text-neutral-300">
                {log}
              </div>
            ))}
          </div>
        )}

        {/* Show more / less button */}
        <button
          onClick={() => setShowFullDesc(!showFullDesc)}
          className="flex items-center gap-1 text-[11px] font-bold text-neutral-600 hover:text-black self-start mt-1"
        >
          <span>{showFullDesc ? 'Show less' : 'Show terminal details'}</span>
          {showFullDesc ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>
      </div>
    </div>
  );
};
