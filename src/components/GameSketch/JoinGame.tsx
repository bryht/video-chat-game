import * as React from 'react';
import { GameData } from './GameData';

export interface IJoinGameProps {
}

export interface IJoinGameState {
}

export default class JoinGame extends React.Component<IJoinGameProps, IJoinGameState> {
    gameData:GameData;
    constructor(props: IJoinGameProps) {
        super(props);
        this.gameData=new GameData();
        this.state = {
        }
    }

    joinGame = () => {
        this.gameData.joinRoom()
    }

    public render() {
        return (
            <div>
                <input type="text" />
                <button onClick={this.joinGame}>Join</button>
            </div>
        );
    }
}
