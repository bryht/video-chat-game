import * as React from 'react';
import CanvasDraw from './CanvasDraw';
import { GameUser } from './Models/GameUser';
import { GameData } from './GameData';
import CanvasWatcher from './CanvasWatcher';
import { GameRound } from './Models/GameRound';
import { GameUserState } from './Models/GameUserState';
import { GameRoom } from './Models/GameRoom';
import Consts from './Consts';

interface IGamePlayingProps {
  // gameData: GameData;
  gameId: string;
  uid: string;
}

interface IGamePlayingStates {

  gameRound: GameRound;
  gameRoom: GameRoom;
  gameUsers: Array<GameUser>;
}

export default class GamePlaying extends React.Component<IGamePlayingProps, IGamePlayingStates> {

  gameData: GameData;
  constructor(props: Readonly<IGamePlayingProps>) {
    super(props);
    this.gameData = new GameData(this.props.gameId);
    this.state = {
      gameRoom: this.gameData.gameRoom,
      gameRound: this.gameData.gameRound,
      gameUsers: this.gameData.gameUsers
    }
    this.gameData.onGameRoundChanged(gameRound => this.setState({ gameRound }))
    this.gameData.onGameRoomChanged(gameRoom => this.setState({ gameRoom }))
    this.gameData.onGameRoomUsersChanged(gameUsers => this.setState({ gameUsers }))

  }
  componentDidMount() {
    this.gameData.initialAsync();
  }

  private getGameUser = (uid: string) => {
    return this.state.gameUsers.find(p => p.uid === uid);
  }


  private getCurrentPlayingGameUser = () => {
    return this.state.gameUsers.find(p => p.userState === GameUserState.playing);
  }

  pauseGame = () => {
    this.gameData.socketHelper.emit(Consts.pauseTimer, {});
  }

  resumeGame = () => {
    this.gameData.socketHelper.emit(Consts.resumeTimer, {});
  }


  public render() {

    return (
      <div>
        <button onClick={this.pauseGame}>Pause</button>
        <button onClick={this.resumeGame}>Resume</button>
        <p>Hi {this.getGameUser(this.props.uid)?.name},Game round:{this.state.gameRound.currentRound},
          time left:{this.state.gameRoom.roundTime - this.state.gameRound.timing}s,
          current player:{this.getCurrentPlayingGameUser()?.name}</p>
        {this.props.uid === this.getCurrentPlayingGameUser()?.uid ?
          <CanvasDraw roomId={this.state.gameRoom.gameId} uid={this.props.uid}></CanvasDraw> :
          <CanvasWatcher roomId={this.state.gameRoom.gameId} uid={this.props.uid}></CanvasWatcher>
        }
      </div>
    );
  }
}
