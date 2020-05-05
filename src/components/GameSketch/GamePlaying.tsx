import * as React from 'react';
import CanvasDraw from './CanvasDraw';
import { GameRoom } from './Models/GameRoom';
import { GameUser } from './Models/GameUser';
import { GameData } from './GameData';
import { GameUserRole } from './Models/GameUserRole';
import { GameRoomPlayingState } from './Models/GameRoomPlayingState';

interface IGamePlayingProps {
  gameRoom: GameRoom;
  uid: string;
}

interface IGamePlayingStates {
  currentGameUser?: GameUser;
  currentGameRoomPlayingState: GameRoomPlayingState;
}

export default class GamePlaying extends React.Component<IGamePlayingProps, IGamePlayingStates> {

  gameData: GameData;
  constructor(props: Readonly<IGamePlayingProps>) {
    super(props);
    this.state = {
      currentGameUser: this.props.gameRoom.users.find(p => p.uid === this.props.uid),
      currentGameRoomPlayingState: this.props.gameRoom.playingState
    }
    this.gameData = new GameData(this.props.gameRoom.id);

  }

  async componentDidMount() {
    if (this.state.currentGameUser?.role === GameUserRole.owner) {
      await this.gameData.startTimerAsync(this.props.gameRoom);
    }
    
    this.gameData.onRoomPlayingRoundStateChanged(roundState=>{
      
      this.setState({ 
        currentGameRoomPlayingState:{
          ...this.state.currentGameRoomPlayingState,
          roundState
      } });
      
    })

  }



  async componentWillUnmount() {
    this.props.gameRoom.playingState=this.state.currentGameRoomPlayingState;
    await this.gameData.createOrUpdateRoomAsync(this.props.gameRoom);
    this.gameData.dispose();
  }

  public render() {

    return (
      <div>
        <p>Game round:{this.state.currentGameRoomPlayingState.roundState?.currentRound}, time left:{this.state.currentGameRoomPlayingState.roundState?.timing}s, current player:xxx</p>
        <CanvasDraw roomId={this.props.gameRoom.id} uid={this.props.uid}></CanvasDraw>
      </div>
    );
  }
}
