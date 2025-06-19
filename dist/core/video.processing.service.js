"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ffprobe_1 = __importDefault(require("@ffprobe-installer/ffprobe"));
const common_1 = require("@nestjs/common");
const ffmpeg_static_1 = __importDefault(require("ffmpeg-static"));
const fluent_ffmpeg_1 = __importDefault(require("fluent-ffmpeg"));
let VideoProcessingService = class VideoProcessingService {
    constructor() {
        fluent_ffmpeg_1.default.setFfprobePath(ffprobe_1.default.path);
        fluent_ffmpeg_1.default.setFfmpegPath(ffmpeg_static_1.default);
    }
    getVideoMetadata(videoPath) {
        return new Promise((resolve, reject) => {
            try {
                fluent_ffmpeg_1.default.ffprobe(videoPath, (err, metadata) => {
                    if (err)
                        return reject(err);
                    const videoStream = metadata.streams.find((s) => s.codec_type === 'video');
                    const audioStream = metadata.streams.find((s) => s.codec_type === 'audio');
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
                    const result = {
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
            }
            catch (error) {
                throw new common_1.InternalServerErrorException(error);
            }
        });
    }
    formatDuration(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        if (hours > 0) {
            return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
        }
        else {
            return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
        }
    }
    convertToResolutions(inputPath, outputBasePath, resolutions) {
        return resolutions.map((res) => {
            return new Promise((resolve, reject) => {
                const output = `${outputBasePath}/${res.height}p.mp4`;
                try {
                    (0, fluent_ffmpeg_1.default)(inputPath)
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
                }
                catch (error) {
                    throw new common_1.InternalServerErrorException(error);
                }
            });
        });
    }
    calculateProcessingTime(durationSeconds, qualityCount) {
        const baseProcessingTime = durationSeconds * 2.5;
        const totalProcessingTime = baseProcessingTime * qualityCount * 0.8;
        const minutes = Math.ceil(totalProcessingTime / 60);
        if (minutes <= 1)
            return '1-2 minutes';
        if (minutes <= 5)
            return '2-5 minutes';
        if (minutes <= 10)
            return '5-10 minutes';
        if (minutes <= 20)
            return '10-20 minutes';
        return '20+ minutes';
    }
    getChunkProps(range, fileSize) {
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
};
VideoProcessingService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], VideoProcessingService);
exports.default = VideoProcessingService;
//# sourceMappingURL=video.processing.service.js.map