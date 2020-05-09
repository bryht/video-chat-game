import * as React from 'react';
import { GameUser } from './Models/GameUser';
import { GameData } from './GameData';
import { GameUserState } from './Models/GameUserState';
import { GameUserRole } from './Models/GameUserRole';
import { GameRoom } from './Models/GameRoom';
import { WordHelper } from 'utils/WordHelper';
import { RoomState } from './Models/RoomState';
import { User } from 'common/Models/User';
import Loading from 'components/Loading/Loading';
import GamePlaying from './GamePlaying';
import Log from 'utils/Log';

interface IGameEnterProps {
  currentUser: User;
  gameId: string;
}

interface IGameEnterStates {
  gameRoom: GameRoom;
  gameUsers: Array<GameUser>;
}

export default class GameEnter extends React.Component<IGameEnterProps, IGameEnterStates> {

  gameData: GameData;
  constructor(props: Readonly<IGameEnterProps>) {
    super(props);
    this.gameData = new GameData(this.props.gameId);
    this.gameData.onGameRoomChanged(this.onGameRoomChanged);
    this.gameData.onGameRoomUsersChanged(this.onGameRoomUsersChanged);
    this.state = {
      gameUsers: [],
      gameRoom: new GameRoom(this.props.gameId)
    }
  }

  async componentDidMount() {
    this.gameData.initialAsync();
    Log.Info("initial data");

  }
  async componentWillUnmount() {
    Log.Info("dispose data");
    await this.gameData.disposeAsync();
  }

  onGameRoomChanged = (gameRoom: GameRoom) => {
    this.setState({ gameRoom });
  }
  onGameRoomUsersChanged = (gameUsers: Array<GameUser>) => {
    this.setState({ gameUsers });

    if (this.state.gameUsers.length === 0) {
      let gameUser = new GameUser(this.props.currentUser.id, this.props.currentUser.name || WordHelper.newNoun(), GameUserState.waiting, GameUserRole.owner);
      this.gameData.joinRoomAsync(gameUser)
    }
  }

  startGame = () => {
    this.gameData.startGame();
  }

  isShowStart = () => {
    return this.state.gameUsers.length > 1 && this.state.gameUsers.find(p => p.uid === this.props.currentUser.id)?.role === GameUserRole.owner;
  }

  public render() {
    if (!this.state?.gameRoom) {
      return <Loading></Loading>
    }
    if (this.state.gameRoom.roomState === RoomState.started) {
      return <GamePlaying gameId={this.props.gameId} uid={this.props.currentUser.id}></GamePlaying>
    }
    return (
      <div>
        <h1>{this.state.gameRoom.gameId}</h1>
        <div>
          {this.state.gameRoom.round} round
        </div>
        <div>
          {this.state.gameRoom.roundTime} seconde per round
        </div>

        <ul>
          {this.state.gameUsers.map(user =>
            <li key={user.uid}>{user.name} is ready</li>)
          }
        </ul>
        {this.isShowStart() && <button onClick={() => this.startGame()}>Start</button>}
        <div>
          <div>Join through link:</div>
          <a href={`/game-sketch/${this.state.gameRoom.gameId}/join`}>http://letshaveaparty.online/game-sketch/{this.state.gameRoom.gameId}/join</a>
        </div>
        <ul>

        </ul>
      </div>
    );
  }
}
