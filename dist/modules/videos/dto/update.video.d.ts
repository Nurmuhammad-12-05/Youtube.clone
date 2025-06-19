import { Visibility } from '@prisma/client';
export declare class UpdateVideoDto {
    title: string;
    description: string;
    visibility: Visibility;
    tags: Array<string>;
}
