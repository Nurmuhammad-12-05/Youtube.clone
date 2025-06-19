import { VideoMetadata } from 'src/common/interfaces/interface';
export default class VideoProcessingService {
    constructor();
    getVideoMetadata(videoPath: string): Promise<VideoMetadata>;
    private formatDuration;
    convertToResolutions(inputPath: string, outputBasePath: string, resolutions: {
        height: number;
    }[]): Promise<unknown>[];
    calculateProcessingTime(durationSeconds: number, qualityCount: number): string;
    getChunkProps(range: string, fileSize: number): {
        start: number;
        end: number;
        chunkSize: number;
    };
}
