import * as React from 'react';
import { GameData } from './GameData';
import { WordHelper } from 'utils/WordHelper';
import { User } from 'common/Models/User';
import { GameUser } from './Models/GameUser';
import { GameUserRole } from './Models/GameUserRole';
import { GameUserState } from './Models/GameUserState';

export interface IGameJoinProps {
    roomId: string;
    currentUser: User;
    // location: Location;
}

export interface IGameJoinState {
    gameUser: GameUser

}

export default class GameJoin extends React.Component<IGameJoinProps, IGameJoinState> {
    gameData: GameData;
    constructor(props: IGameJoinProps) {
        super(props);
        this.gameData = new GameData();
        this.state = {
            gameUser: new GameUser(this.props.currentUser.id, this.props.currentUser.name || WordHelper.newNoun(), GameUserState.waiting, GameUserRole.player)
        }
    }

    onNameChanged = (name: string) => {
        this.setState({
            gameUser: {
                ...this.state.gameUser,
                name
            }
        });
    }

    joinGame = () => {

        this.gameData.joinRoom(this.props.roomId, this.state.gameUser);
        window.location.pathname = window.location.pathname.replace('join', '');

    }

    public render() {
        return (
            <div>
                <div>Please input your name:</div>
                <input type="text" value={this.state.gameUser.name} onChange={e => this.onNameChanged(e.target.value)} />
                <button onClick={this.joinGame}>Join</button>
            </div>
        );
    }
}
