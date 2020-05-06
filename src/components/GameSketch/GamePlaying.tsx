import * as React from 'react';
import CanvasDraw from './CanvasDraw';
import { GameRoom } from './Models/GameRoom';
import { GameUser } from './Models/GameUser';
import { GameData } from './GameData';
import { GameUserRole } from './Models/GameUserRole';
import Log from 'utils/Log';
import CanvasWatcher from './CanvasWatcher';
import { GameRound } from './Models/GameRound';
import { GameUserState } from './Models/GameUserState';

interface IGamePlayingProps {
  gameRoom: GameRoom;
  uid: string;
  onFinished: () => void;
}

interface IGamePlayingStates {
  currentGameUser?: GameUser;
  gameRound: GameRound;
}

export default class GamePlaying extends React.Component<IGamePlayingProps, IGamePlayingStates> {

  gameData: GameData;
  constructor(props: Readonly<IGamePlayingProps>) {
    super(props);
    this.gameData = new GameData(this.props.gameRoom.id);
    this.state = {
      currentGameUser: this.getGameUser(this.props.uid),
      gameRound: this.gameData.gameRound
    }
    this.gameData.onGameRoundChanged(gameRound => {

      //update roundState
      this.setState({
        gameRound
      });

      //finished game
      if (gameRound.isFinished) {
        this.props.onFinished();
      }

    })

  }
  async componentDidMount() {
    await this.gameData.initialAsync();

    if (this.state.currentGameUser?.role === GameUserRole.owner) {
      this.gameData.startTimer();
      await this.gameData.saveGameRoomAsync();
    }

  }

  private getGameUser(uid: string) {
    return this.props.gameRoom.users.find(p => p.uid === uid);
  }


  private getCurrentPlayingGameUser() {
    return this.props.gameRoom.users.find(p => p.userState === GameUserState.playing);
  }




  async componentWillUnmount() {
    await this.gameData.disposeAsync();
  }

  public render() {

    return (
      <div>
        <p>Hi {this.state.currentGameUser?.name},Game round:{this.state.gameRound.currentRound},
          time left:{this.props.gameRoom.roundTime - this.state.gameRound.timing}s,
          current player:{this.getCurrentPlayingGameUser()?.name}</p>
        {this.state.currentGameUser?.uid === this.getCurrentPlayingGameUser()?.uid ?
          <CanvasDraw roomId={this.props.gameRoom.id} uid={this.props.uid}></CanvasDraw> :
          <CanvasWatcher roomId={this.props.gameRoom.id} uid={this.props.uid}></CanvasWatcher>
        }
      </div>
    );
  }
}
