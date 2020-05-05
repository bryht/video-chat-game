import * as React from 'react';
import { GameData } from './GameData';
import { WordHelper } from 'utils/WordHelper';
import { User } from 'common/Models/User';
import { GameUser } from './Models/GameUser';
import { GameUserRole } from './Models/GameUserRole';
import { GameUserState } from './Models/GameUserState';
import Log from 'utils/Log';

export interface IGameJoinProps {
    roomId: string;
    currentUser: User;
}

export interface IGameJoinState {
    gameUser: GameUser

}

export default class GameJoin extends React.Component<IGameJoinProps, IGameJoinState> {
    gameData: GameData;
    constructor(props: IGameJoinProps) {
        super(props);
        this.gameData = new GameData(this.props.roomId);
        this.state = {
            gameUser: new GameUser(this.props.currentUser.id, this.props.currentUser.name || WordHelper.newNoun(), GameUserState.waiting, GameUserRole.player)
        }
    }

    componentWillUnmount(){
        this.gameData.dispose();
    }

    onNameChanged = (name: string) => {
        this.setState({
            gameUser: {
                ...this.state.gameUser,
                name
            }
        });
        Log.Info(this.state.gameUser);
    }

    joinGame = async () => {
        await this.gameData.joinRoomAsync(this.props.roomId, this.state.gameUser);
        window.location.pathname = window.location.pathname.replace('join', '');//TODO: switch to a callback
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
