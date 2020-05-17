import * as React from 'react';
import { GameUser } from './Models/GameUser';
import { GameData } from './GameData';
import { GameRoom } from './Models/GameRoom';
import { RoomState } from './Models/RoomState';
import { User } from 'common/Models/User';
import Loading from 'components/Loading/Loading';
import GamePlaying from './GamePlaying';
import Log from 'utils/Log';
import CanvasWatcher from './CanvasWatcher';

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
      gameRoom: this.gameData.gameRoom
    }
  }

  componentDidMount() {
    this.gameData.initial();
    Log.Info("initial data");

  }
  componentWillUnmount() {
    Log.Info("dispose data");
    this.gameData.dispose();
  }

  onGameRoomChanged = (gameRoom: GameRoom) => {
    this.setState({ gameRoom });
    if (!gameRoom.gameOwnerUid) {
      this.gameData.updateRoomOwner(this.props.currentUser.id);
    }
  }
  onGameRoomUsersChanged = (gameUsers: Array<GameUser>) => {
    this.setState({ gameUsers });
  }

  startGame = () => {
    this.gameData.startGame();
  }

  isGameOwner = () => {
    return this.state.gameRoom.gameOwnerUid === this.props.currentUser.id;
  }
  isShowStart = () => {
    return this.isGameOwner() && this.state.gameUsers.length > 1;
  }


  waringForJoin = () => {

    return (
      <div>
        <h1>{this.state.gameRoom.gameId}</h1>
        <div>
          <input type="number" value={this.state.gameRoom.round} onChange={e=>{this.gameData.updateRoomRound(Number.parseInt(e.target.value))}}/>round
        </div>
        <div>
          <input type="number" value={this.state.gameRoom.roundTime} onChange={e=>{this.gameData.updateRoomRoundTime(Number.parseInt(e.target.value))}}/> seconde per round
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
      </div>
    );

  }

  public render() {

    switch (this.state.gameRoom.roomState) {
      case RoomState.playing:
        return this.isGameOwner() ? <CanvasWatcher gameId={this.props.gameId} /> : <GamePlaying gameId={this.props.gameId} uid={this.props.currentUser.id}></GamePlaying>
      case RoomState.waiting:
        return this.waringForJoin();
      default:
        return <Loading></Loading>
    }
  }
}
