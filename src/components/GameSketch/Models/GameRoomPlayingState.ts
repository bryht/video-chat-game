import { GameRoomPlayingRoundState } from "./GameRoomPlayingRoundState";

export class GameRoomPlayingState {

    isTimerStarted: boolean = false;
    currentPlayerUid: string = '';
    roundState: GameRoomPlayingRoundState = new GameRoomPlayingRoundState();

}

