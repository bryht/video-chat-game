import * as React from 'react';
import CanvasDraw from './CanvasDraw';
import { GameUser } from './Models/GameUser';
import { GameData } from './GameData';
import { GameUserRole } from './Models/GameUserRole';
import CanvasWatcher from './CanvasWatcher';
import { GameRound } from './Models/GameRound';
import { GameUserState } from './Models/GameUserState';
import { GameRoom } from './Models/GameRoom';

interface IGamePlayingProps {
  gameData: GameData;
  uid: string;
}

interface IGamePlayingStates {
  currentGameUser?: GameUser;
  gameRound: GameRound;
  gameRoom: GameRoom;
}

export default class GamePlaying extends React.Component<IGamePlayingProps, IGamePlayingStates> {

  constructor(props: Readonly<IGamePlayingProps>) {
    super(props);
    this.state = {
      gameRound: this.props.gameData.gameRound,
      gameRoom: this.props.gameData.gameRoom,
      currentGameUser: this.getGameUser(this.props.uid),
    }
    this.props.gameData.onGameRoundChanged(gameRound => {
      this.setState({
        gameRound
      });
    })
    this.props.gameData.onGameRoomChanged(gameRoom => {
      this.setState({
        gameRoom
      });
    })

  }
  async componentDidMount() {
    if (this.state.currentGameUser?.role === GameUserRole.owner) {
      await this.props.gameData.initialAsync();
      this.props.gameData.startTimer();
    }
  }

  private getGameUser(uid: string) {
    return this.props.gameData.gameRoom.users.find(p => p.uid === uid);
  }


  private getCurrentPlayingGameUser() {
    return this.props.gameData.gameRoom.users.find(p => p.userState === GameUserState.playing);
  }


  public render() {

    return (
      <div>
        <p>Hi {this.state.currentGameUser?.name},Game round:{this.state.gameRound.currentRound},
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
