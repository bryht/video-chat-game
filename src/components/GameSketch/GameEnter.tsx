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
import styles from './GameSketch.module.scss';
import mobile from 'assets/mobile.svg';

interface IGameEnterProps {
  currentUser: User;
  gameId: string;
  closeGame: () => void;
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

  closeGame = () => {
    this.gameData.closeGame();
    this.props.closeGame();
  }

  isGameOwner = () => {
    return this.state.gameRoom.gameOwnerUid === this.props.currentUser.id;
  }

  isWatcher = () => {
    return !this.state.gameUsers.find(p => p.uid === this.props.currentUser.id);
  }

  isShowStart = () => {
    return this.isGameOwner() && this.state.gameUsers.length > 1;
  }


  waringForJoin = () => {

    return (
      <div className={styles.enter}>
        <div>
          <h1>Game Sketch</h1>
          <input type="number" value={this.state.gameRoom.round} onChange={e => { this.gameData.updateRoomRound(Number.parseInt(e.target.value)) }} /> rounds
        <input type="number" value={this.state.gameRoom.roundTime} onChange={e => { this.gameData.updateRoomRoundTime(Number.parseInt(e.target.value)) }} /> seconds per round
        <ul>
            {this.state.gameUsers.map(user =>
              <li key={user.uid}>{user.name} is ready</li>)
            }
          </ul>
          {this.isShowStart() && <button onClick={() => this.startGame()}>Start</button>}
          {this.isGameOwner() && <button onClick={() => this.closeGame()}> Close Game </button>}
        </div>
        <div>
          <h5>Please join the game through the link using your phone:</h5>
          <h5>https://letshaveaparty.online/game/{this.state.gameRoom.gameId}/join</h5>
          <img src={mobile} alt="" height={300}></img>
          <a href="https://web.whatsapp.com/" target={"blank"} >Share to WhatsApp</a>
        </div>
      </div>
    );

  }

  public render() {

    switch (this.state.gameRoom.roomState) {
      case RoomState.playing:
        return this.isWatcher() ? <CanvasWatcher gameId={this.props.gameId} uid={this.props.currentUser.id} /> : <GamePlaying gameId={this.props.gameId} uid={this.props.currentUser.id}></GamePlaying>
      case RoomState.waiting:
        return this.waringForJoin();
      default:
        return <Loading></Loading>
    }
  }
}
