import * as React from 'react';
import { GameData } from './GameData';
import Guid from 'utils/Guid';
import { WordHelper } from 'utils/WordHelper';

export interface IJoinGameProps {
    room: string;
}

export interface IJoinGameState {
    uid: string;
    name: string;

}

export default class JoinGame extends React.Component<IJoinGameProps, IJoinGameState> {
    gameData: GameData;
    constructor(props: IJoinGameProps) {
        super(props);
        this.gameData = new GameData();
        this.state = {
            uid: Guid.newGuid(),
            name: WordHelper.generateNoun()
        }
    }

    onNameChanged = (name: string) => {
        this.setState({ name });
    }

    joinGame = () => {
        const { name, uid } = this.state;
        this.gameData.joinRoom(this.props.room, uid, name);
    }

    public render() {
        return (
            <div>
                <input type="text" value={this.state.name} onChange={e => this.onNameChanged(e.target.value)} />
                <button onClick={this.joinGame}>Join</button>
            </div>
        );
    }
}
