import { GameRoomState } from "./GameRoomState";

export class GameRoom {
    constructor(id: string, name: string, roomState: GameRoomState) {
        this.id = id;
        this.name = name;
        this.roomState = roomState;
    }
    id: string;
    name: string;
    roomState: GameRoomState;
}