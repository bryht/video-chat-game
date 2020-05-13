import { IRoomItem } from "./IRoomItem";

export class RoomVideoItem implements IRoomItem{
    id!: string;
    content: any;
    order!: number;

}