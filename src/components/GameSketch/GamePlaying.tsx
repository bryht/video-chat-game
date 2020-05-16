import * as React from 'react';
import CanvasDraw from './CanvasDraw';
import { GameUser } from './Models/GameUser';
import { GameData } from './GameData';
import CanvasWatcher from './CanvasWatcher';
import { GameRound } from './Models/GameRound';
import { GameUserState } from './Models/GameUserState';
import { GameRoom } from './Models/GameRoom';
import Log from 'utils/Log';
import Loading from 'components/Loading/Loading';
import ChoosingWord from './ChoosingWord';
import SelectWinner from './SelectWinner';

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
    this.gameData.onGameRoomChanged(gameRoom => { this.setState({ gameRoom }) });
    this.gameData.onGameRoundChanged(gameRound => { this.setState({ gameRound }) });
    this.gameData.onGameRoomUsersChanged(gameUsers => { this.setState({ gameUsers }) });
    this.state = {
      gameRoom: this.gameData.gameRoom,
      gameRound: this.gameData.gameRound,
      gameUsers: this.gameData.gameUsers,
    }
  }
  componentDidMount() {
    this.gameData.initial();
  }


  private getCurrentGameUser = () => {
    return this.state.gameUsers.find(p => p.uid === this.props.uid);
  }




  getCurrentUserScreen = () => {
    var currentGameUser = this.getCurrentGameUser();
    switch (currentGameUser?.userState) {
      case GameUserState.choosing:
        return <ChoosingWord gameId={this.state.gameRoom.gameId} uid={this.props.uid}></ChoosingWord>
      case GameUserState.playing:
        return <CanvasDraw gameId={this.state.gameRoom.gameId} uid={this.props.uid}></CanvasDraw>;
      case GameUserState.waiting:
        return <CanvasWatcher gameId={this.state.gameRoom.gameId}></CanvasWatcher>;
      case GameUserState.selectWinner:
        return <SelectWinner gameId={this.state.gameRoom.gameId} uid={this.props.uid} ></SelectWinner>
      default:
        return <Loading></Loading>
    }
  }


  public render() {

    return (
      <div>
        {this.getCurrentUserScreen()}
      </div>
    );
  }
}
