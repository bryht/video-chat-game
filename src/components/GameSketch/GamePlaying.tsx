import * as React from 'react';
import CanvasDraw from './CanvasDraw';
import { GameUser } from './Models/GameUser';
import { GameData } from './GameData';
import CanvasWatcher from './CanvasWatcher';
import { GameRound } from './Models/GameRound';
import { GameUserState } from './Models/GameUserState';
import { GameRoom } from './Models/GameRoom';

interface IGamePlayingProps {
  // gameData: GameData;
  gameId: string;
  uid: string;
}

interface IGamePlayingStates {
  currentGameUser?: GameUser;
  gameRound: GameRound;
  gameRoom: GameRoom;
}

export default class GamePlaying extends React.Component<IGamePlayingProps, IGamePlayingStates> {

  gameData: GameData;
  constructor(props: Readonly<IGamePlayingProps>) {
    super(props);
    this.gameData = new GameData(this.props.gameId);
    this.gameData.onGameRoundChanged(gameRound => {
      this.setState({
        gameRound
      });
    })
    this.gameData.onGameRoomChanged(gameRoom => {
      this.setState({
        gameRoom
      });
    })

  }
  async componentDidMount() {
    await this.gameData.initialAsync();
  }

  private getGameUser = (uid: string) => {
    return this.gameData.gameRoom.users.find(p => p.uid === uid);
  }


  private getCurrentPlayingGameUser = () => {
    return this.gameData.gameRoom.users.find(p => p.userState === GameUserState.playing);
  }

  pauseGame = () => {
    this.gameData.socketHelper.emit('pauseTimer', {});
  }

  resumeGame = () => {
    this.gameData.socketHelper.emit('resumeTimer', {});
  }


  public render() {

    return (
      <div>
        <button onClick={this.pauseGame}>Pause</button>
        <button onClick={this.resumeGame}>Resume</button>
        <p>Hi {this.getGameUser(this.props.uid)?.name},Game round:{this.state.gameRound.currentRound},
          time left:{this.state.gameRoom.roundTime - this.state.gameRound.timing}s,
          current player:{this.getCurrentPlayingGameUser()?.name}</p>
        {this.state.currentGameUser?.uid === this.getCurrentPlayingGameUser()?.uid ?
          <CanvasDraw roomId={this.state.gameRoom.id} uid={this.props.uid}></CanvasDraw> :
          <CanvasWatcher roomId={this.state.gameRoom.id} uid={this.props.uid}></CanvasWatcher>
        }
      </div>
    );
  }
}
