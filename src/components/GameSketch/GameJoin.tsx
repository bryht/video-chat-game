import * as React from 'react';
import { GameData } from './GameData';
import { WordHelper } from 'utils/WordHelper';
import { User } from 'common/Models/User';
import { GameUser } from './Models/GameUser';
import { GameUserRole } from './Models/GameUserRole';
import { GameUserState } from './Models/GameUserState';
import Log from 'utils/Log';
import { GameRoom } from './Models/GameRoom';

export interface IGameJoinProps {
    roomId: string;
    currentUser: User;
}

export interface IGameJoinState {
    gameRoom: GameRoom;
    gameUserName: string;

}

export default class GameJoin extends React.Component<IGameJoinProps, IGameJoinState> {
    gameData: GameData;
    constructor(props: IGameJoinProps) {
        super(props);
        this.gameData = new GameData(this.props.roomId);
        this.gameData.onGameRoomChanged(this.onGameRoomChanged);
        this.state = {
            gameRoom: this.gameData.gameRoom,
            gameUserName: ''
        }
    }

    onGameRoomChanged = (gameRoom: GameRoom) => {

        this.setState({ gameRoom });
    }
    async  componentDidMount() {
        await this.gameData.initialAsync();
        this.setState({
            gameRoom: this.gameData.gameRoom,
            gameUserName: this.props.currentUser.name || WordHelper.newNoun()
        })

    }

    componentWillUnmount() {
        this.gameData.disposeAsync();
    }

    onNameChanged = (name: string) => {
        this.setState({
            gameUserName: name
        })
    }

    joinGame = async () => {
        var _gameUser = new GameUser(this.props.currentUser.id, this.state.gameUserName, GameUserState.waiting, GameUserRole.player);
        await this.gameData.joinRoomAsync(_gameUser);

        window.location.pathname = window.location.pathname.replace('join', '');//TODO: switch to a callback
    }

    public render() {
        return (
            <div>
                <div>Please input your name:</div>
                <input type="text" value={this.state.gameUserName} onChange={e => this.onNameChanged(e.target.value)} />
                <button onClick={this.joinGame}>Join</button>
            </div>
        );
    }
}
