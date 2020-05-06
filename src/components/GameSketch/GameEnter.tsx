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
  roomId: string;
}

interface IGameEnterStates {
  gameRoom: GameRoom;
}

export default class GameEnter extends React.Component<IGameEnterProps, IGameEnterStates> {

  gameData: GameData;
  constructor(props: Readonly<IGameEnterProps>) {
    super(props);
    this.gameData = new GameData(this.props.roomId);
    this.gameData.onGameRoomChanged(this.onGameRoomChanged);
  }

  async componentDidMount() {
    Log.Info("initial data");
    await this.gameData.initialAsync();
    let _gameRoom = this.gameData.gameRoom;
    if (!_gameRoom.users.find(p => p.uid === this.props.currentUser.id) && _gameRoom.users.length === 0) {

      let gameUser = new GameUser(this.props.currentUser.id, this.props.currentUser.name || WordHelper.newNoun(), GameUserState.waiting, GameUserRole.owner);
      await this.gameData.joinRoomAsync(gameUser)

    }
    this.setState({
      gameRoom: _gameRoom
    })
  }
  async componentWillUnmount() {
    Log.Info("dispose data");
    
    await this.gameData.disposeAsync();
  }

  onGameRoomChanged = (gameRoom: GameRoom) => {

    this.setState({ gameRoom });
  }

  startGame = async () => {
    await this.gameData.startGameAsync();
  }

  isShowStart = () => {
    return this.state.gameRoom.users.length > 1 && this.state.gameRoom.users.find(p => p.uid === this.props.currentUser.id)?.role === GameUserRole.owner;
  }

  public render() {
    if (!this.state?.gameRoom) {
      return <Loading></Loading>
    }
    if (this.state.gameRoom.roomState === RoomState.started) {
      return <GamePlaying gameData={this.gameData} uid={this.props.currentUser.id}></GamePlaying>
    }
    return (
      <div>
        <h1>{this.state.gameRoom.id}</h1>
        <div>
          {this.state.gameRoom.round} round
        </div>
        <div>
          {this.state.gameRoom.roundTime} seconde per round
        </div>

        <ul>
          {this.state.gameRoom.users.map(user =>
            <li key={user.uid}>{user.name} is ready</li>)
          }
        </ul>
        {this.isShowStart() && <button onClick={this.startGame}>Start</button>}
        <div>
          <div>Join through link:</div>
          <a href={`/game-sketch/${this.state.gameRoom.id}/join`}>http://letshaveaparty.online/game-sketch/{this.state.gameRoom.id}/join</a>
        </div>
        <ul>

        </ul>
      </div>
    );
  }
}
