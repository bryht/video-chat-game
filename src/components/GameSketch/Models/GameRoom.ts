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
    round: number = 3;
    roundTime: number = 25;
    users: Array<GameUser> = [];
    playingState: GameRoomPlayingState = new GameRoomPlayingState();
}