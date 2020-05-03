import { GameRoomState } from "./GameRoomState";

export class GameRoom {
    constructor(id: string, roomState: GameRoomState) {
        this.id = id;
        this.roomState = roomState;
    }
    id: string;
    roomState: GameRoomState;
    round: number = 10;
    roundTime: number = 120;
}