interface VideoProcessingJob {
  videoId: string;
  inputPath: string;
  qualities: ['1080p', '720p', '480p', '360p'];
  generateThumbnails: boolean;
}

interface NotificationJob {
  type: 'video_published' | 'new_subscriber' | 'comment_reply';
  userId: string;
  data: any;
}

interface AnalyticsJob {
  type: 'view_recorded' | 'engagement_calculated';
  videoId: string;
  userId?: string;
  data: any;
}
