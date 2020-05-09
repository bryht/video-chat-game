import { GameUser } from "./GameUser";

export class GameRound {
    constructor(gameId: string) {
        this.gameId = gameId;
    }
    gameId: string;
    currentRound: number = 0;
    timing: number = 0;
    isFinished: boolean = false;
    playingUser: GameUser | null = null;
    wordsForChoosing: Array<string> = [];
    wordForGuess: string = '';
}
