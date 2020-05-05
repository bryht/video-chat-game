import * as React from 'react';
import CanvasDraw from './CanvasDraw';
import { GameRoom } from './Models/GameRoom';
import { GameUser } from './Models/GameUser';
import { GameData } from './GameData';
import { GameUserRole } from './Models/GameUserRole';
import { GameRoomPlayingState } from './Models/GameRoomPlayingState';
import Log from 'utils/Log';
import CanvasWatcher from './CanvasWatcher';

interface IGamePlayingProps {
  gameRoom: GameRoom;
  uid: string;
  onFinished: () => void;
}

interface IGamePlayingStates {
  currentGameUser?: GameUser;
  playingState: GameRoomPlayingState;
}

export default class GamePlaying extends React.Component<IGamePlayingProps, IGamePlayingStates> {

  gameData: GameData;
  constructor(props: Readonly<IGamePlayingProps>) {
    super(props);
    this.state = {
      currentGameUser: this.getGameUser(this.props.uid),
      playingState: this.props.gameRoom.playingState,
    }
    this.gameData = new GameData(this.props.gameRoom.id);
    this.gameData.onRoomPlayingRoundStateChanged(roundState => {

      //update currentPlayer
      let currentPlayerUid = this.state.playingState.currentPlayerUid;
      if (this.state.playingState.roundState.currentRound !== roundState.currentRound &&
        this.state.playingState.roundState.currentRound > 1) {
        currentPlayerUid = this.getNextGameUser(this.state.playingState.currentPlayerUid).uid;
        Log.Info(currentPlayerUid);
      }

      //update roundState
      this.setState({
        playingState: {
          ...this.state.playingState,
          roundState,
          currentPlayerUid,
        }
      });

      //finished game
      if (roundState.isFinished) {
        this.props.onFinished();
      }

    })

  }
  async componentDidMount() {
    if (this.state.currentGameUser?.role === GameUserRole.owner) {
      await this.gameData.startTimerAsync(this.props.gameRoom);
    }
    let gameRoom = await this.gameData.getRoomAsync(this.props.gameRoom.id);
    if (gameRoom) {
      this.setState({
        playingState: gameRoom.playingState
      })
      if (gameRoom.playingState.roundState.isFinished) {
        this.props.onFinished();
      }
    }
  }

  private getGameUser(uid: string) {
    return this.props.gameRoom.users.find(p => p.uid === uid);
  }

  private getNextGameUser(uid: string) {
    let users = this.props.gameRoom.users;
    let item = users.find(p => p.uid === uid);
    if (item) {
      let index = users.indexOf(item);
      if (index < users.length - 1) {
        return users[index + 1];
      }
    }
    return users[0];

  }

  private getCurrentPlayingGameUser() {
    return this.getGameUser(this.state.playingState.currentPlayerUid);
  }




  async componentWillUnmount() {
    const { gameRoom } = this.props;
    gameRoom.playingState = this.state.playingState;
    await this.gameData.createOrUpdateRoomAsync(gameRoom);
    this.gameData.dispose();
  }

  public render() {

    return (
      <div>
        <p>Game round:{this.state.playingState.roundState?.currentRound},
          time left:{this.props.gameRoom.roundTime - this.state.playingState.roundState?.timing}s,
          current player:{this.getCurrentPlayingGameUser()?.name}</p>
        {this.state.currentGameUser?.uid === this.state.playingState.currentPlayerUid ?
          <CanvasDraw roomId={this.props.gameRoom.id} uid={this.props.uid}></CanvasDraw> :
          <CanvasWatcher roomId={this.props.gameRoom.id} uid={this.props.uid}></CanvasWatcher>
        }
      </div>
    );
  }
}
