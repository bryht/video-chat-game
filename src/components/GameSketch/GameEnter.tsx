import * as React from 'react';
import { GameUser } from './Models/GameUser';
import { GameData } from './GameData';
import { GameUserState } from './Models/GameUserState';
import { GameUserRole } from './Models/GameUserRole';
import { GameRoom } from './Models/GameRoom';
import { WordHelper } from 'utils/WordHelper';
import { GameRoomState } from './Models/GameRoomState';
import { User } from 'common/Models/User';
import Loading from 'components/Loading/Loading';
import GamePlaying from './GamePlaying';

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
    this.gameData.onRoomChanged(this.props.roomId, this.onRoomChanged);
  }

  async componentDidMount() {
    let _gameRoom = await this.gameData.getRoomAsync(this.props.roomId);
    if (_gameRoom == null) {
      _gameRoom = new GameRoom(this.props.roomId, GameRoomState.waiting);
      await this.gameData.createOrUpdateRoomAsync(_gameRoom);
    }
    if (!_gameRoom.users.find(p => p.uid === this.props.currentUser.id) && _gameRoom.users.length === 0) {

      let gameUser = new GameUser(this.props.currentUser.id, this.props.currentUser.name || WordHelper.newNoun(), GameUserState.waiting, GameUserRole.owner);
      await this.gameData.joinRoomAsync(_gameRoom.id, gameUser)
    }
    this.state = {
      gameRoom: _gameRoom
    }

  }
  componentWillUnmount() {

    this.gameData.dispose();
  }

  onRoomChanged = (gameRoom: GameRoom) => {

    this.setState({ gameRoom });
  }

  startGame = async () => {
    await this.gameData.startGame(this.props.roomId);
  }

  isShowStart = () => {
    return this.state.gameRoom.users.length > 1 && this.state.gameRoom.users.find(p => p.uid === this.props.currentUser.id)?.role === GameUserRole.owner;
  }

  gameFinished = async () => {
    let _gameRoom = this.state.gameRoom;
    _gameRoom.roomState = GameRoomState.waiting;
    await this.gameData.createOrUpdateRoomAsync(_gameRoom);
  }

  public render() {
    if (!this.state?.gameRoom) {
      return <Loading></Loading>
    }
    if (this.state.gameRoom.roomState === GameRoomState.started) {
      return <GamePlaying gameRoom={this.state.gameRoom} uid={this.props.currentUser.id} onFinished={this.gameFinished}></GamePlaying>
    }
    return (
      <div>
        <h1>{this.state.gameRoom.id}</h1>
        <div>
          10 round
        </div>
        <div>
          120 seconde per round
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
