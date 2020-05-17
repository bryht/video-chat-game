import { VideoStream } from "utils/VideoClient";

export class RoomItem {
    id!: string;
    content: any;
    order!: number;
    isLocalVideo: boolean = false;
    localVideoStream?:VideoStream;
}