import { GameRoomState } from "./GameRoomState";
import { GameUser } from "./GameUser";
import { GameRoomPlayingState } from "./GameRoomPlayingState";

export class GameRoom {
    constructor(id: string, roomState: GameRoomState) {
        this.id = id;
        this.roomState = roomState;
    }
    id: string;
    roomState: GameRoomState;
    round: number = 10;
    roundTime: number = 120;
    users: Array<GameUser> = [];
    playingState: GameRoomPlayingState = new GameRoomPlayingState();
}