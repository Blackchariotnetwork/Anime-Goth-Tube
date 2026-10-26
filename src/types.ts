export interface VideoItem {
  id: string;
  title: string;
  channelTitle: string;
  channelAvatar: string;
  subscribers: string;
  views: string;
  viewsCount: number;
  uploadedAt: string;
  duration: string;
  durationSeconds: number;
  tags: string[];
  description: string;
  streamType: 'matrix' | 'synthwave' | 'audio_wave' | 'terminal_trace' | 'glitch_anime' | 'cyber_radar';
  likes: number;
  terminalLogs: string[];
  chapters: { time: string; seconds: number; title: string }[];
}

export interface CommentItem {
  id: string;
  author: string;
  handle: string;
  avatar: string;
  content: string;
  timestamp: string;
  likes: number;
  isAuthor?: boolean;
}
