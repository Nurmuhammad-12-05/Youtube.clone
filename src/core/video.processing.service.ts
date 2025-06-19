import ffprobeInstaller from '@ffprobe-installer/ffprobe';
import {
  BadGatewayException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import ffmpegPath from 'ffmpeg-static';
import ffmpeg from 'fluent-ffmpeg';
import { VideoMetadata } from 'src/common/interfaces/interface';

@Injectable()
export default class VideoProcessingService {
  constructor() {
    ffmpeg.setFfprobePath(ffprobeInstaller.path);
    ffmpeg.setFfmpegPath(ffmpegPath as unknown as string);
  }

  getVideoMetadata(videoPath: string): Promise<VideoMetadata> {
    return new Promise((resolve, reject) => {
      try {
        ffmpeg.ffprobe(videoPath, (err, metadata) => {
          if (err) return reject(err);

          const videoStream = metadata.streams.find(
            (s) => s.codec_type === 'video',
          );

          const audioStream = metadata.streams.find(
            (s) => s.codec_type === 'audio',
          );

          if (!videoStream) {
            return reject(new Error('Video stream not found'));
          }

          const durationValue = metadata.format.duration;
          const duration = durationValue
            ? parseFloat(durationValue.toString())
            : 0;

          const durationFormatted = this.formatDuration(duration);

          const sizeValue = metadata.format.size;
          const fileSize = sizeValue ? parseInt(sizeValue.toString()) : 0;

          const result: VideoMetadata = {
            width: videoStream.width || 0,
            height: videoStream.height || 0,
            duration: Math.floor(duration),
            durationFormatted,
            hasAudio: !!audioStream,
            audioCodec: audioStream?.codec_name,
            videoBitrate: videoStream.bit_rate
              ? parseInt(videoStream.bit_rate.toString())
              : undefined,
            audioBitrate: audioStream?.bit_rate
              ? parseInt(audioStream.bit_rate.toString())
              : undefined,
            fileSize,
            format: metadata.format.format_name || 'unknown',
          };

          resolve(result);
        });
      } catch (error) {
        throw new InternalServerErrorException(error);
      }
    });
  }

  private formatDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    } else {
      return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
  }

  convertToResolutions(
    inputPath: string,
    outputBasePath: string,
    resolutions: { height: number }[],
  ) {
    return resolutions.map((res) => {
      return new Promise((resolve, reject) => {
        const output = `${outputBasePath}/${res.height}p.mp4`;

        try {
          ffmpeg(inputPath)
            .videoCodec('libx264')
            .size(`?x${res.height}`)
            .outputOptions(['-preset fast', '-crf 23', '-movflags +faststart'])
            .on('end', () => {
              resolve('ok');
            })
            .on('error', (err) => {
              reject(err);
            })
            .save(output);
        } catch (error) {
          throw new InternalServerErrorException(error);
        }
      });
    });
  }

  calculateProcessingTime(
    durationSeconds: number,
    qualityCount: number,
  ): string {
    const baseProcessingTime = durationSeconds * 2.5;
    const totalProcessingTime = baseProcessingTime * qualityCount * 0.8;
    const minutes = Math.ceil(totalProcessingTime / 60);

    if (minutes <= 1) return '1-2 minutes';
    if (minutes <= 5) return '2-5 minutes';
    if (minutes <= 10) return '5-10 minutes';
    if (minutes <= 20) return '10-20 minutes';
    return '20+ minutes';
  }

  getChunkProps(range: string, fileSize: number) {
    const parts = range.replace(/bytes=/, '').split('-');
    const start = parseInt(parts[0], 10);
    let end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    const maxChunkSize = Math.floor(4 * 1024 * 1024);

    if (end - start + 1 > maxChunkSize) {
      end = start + maxChunkSize - 1;
    }

    const chunkSize = end - start + 1;

    return {
      start,
      end,
      chunkSize,
    };
  }
}
