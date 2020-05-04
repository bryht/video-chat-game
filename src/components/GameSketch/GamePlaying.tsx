import * as React from 'react';
import CanvasDraw from './CanvasDraw';
import { GameRoom } from './Models/GameRoom';
import { GameUser } from './Models/GameUser';
import { GameData } from './GameData';
import { GameUserRole } from './Models/GameUserRole';
import { GameRoomRoundState } from './Models/GameRoomRoundState';
import Log from 'utils/Log';

interface IGamePlayingProps {
  gameRoom: GameRoom;
  uid: string;
}

interface IGamePlayingStates {
  currentGameUser?: GameUser;
  currentGameRoundState: GameRoomRoundState;
}

export default class GamePlaying extends React.Component<IGamePlayingProps, IGamePlayingStates> {

  gameData: GameData;
  constructor(props: Readonly<IGamePlayingProps>) {
    super(props);
    this.state = {
      currentGameUser: this.props.gameRoom.users.find(p => p.uid === this.props.uid),
      currentGameRoundState: new GameRoomRoundState()
    }
    this.gameData = new GameData(this.props.gameRoom.id);

  }

  componentDidMount() {
    if (this.state.currentGameUser?.role === GameUserRole.owner) {
      this.gameData.startTimer(this.props.gameRoom, currentGameRoundState => {
        Log.Info(currentGameRoundState);
        this.setState({ currentGameRoundState });
      });
    }

  }



  componentWillUnmount() {
    this.gameData.dispose();
  }

  public render() {

    return (
      <div>
        <p>Game round:{this.state.currentGameRoundState.currentRound}, time left:{this.state.currentGameRoundState.timing}s, current player:xxx</p>
        <CanvasDraw roomId={this.props.gameRoom.id} uid={this.props.uid}></CanvasDraw>
      </div>
    );
  }
}
