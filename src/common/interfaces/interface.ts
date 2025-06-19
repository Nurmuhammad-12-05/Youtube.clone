export interface VideoProcessingJob {
  videoId: string;
  inputPath: string;
  qualities: ['1080p', '720p', '480p', '360p'];
  generateThumbnails: boolean;
}

export interface NotificationJob {
  type: 'video_published' | 'new_subscriber' | 'comment_reply';
  userId: string;
  data: any;
}

export interface AnalyticsJob {
  type: 'view_recorded' | 'engagement_calculated';
  videoId: string;
  userId?: string;
  data: any;
}

export interface VideoMetadata {
  width: number;
  height: number;
  duration: number;
  durationFormatted: string;
  hasAudio: boolean;
  audioCodec?: string;
  videoBitrate?: number;
  audioBitrate?: number;
  fileSize: number;
  format: string;
}
