import { IRoomItem } from 'components/Models/IRoomItem';

export class RoomGameItem implements IRoomItem {
    id!: string;
    content: any;
    order!: number;
}