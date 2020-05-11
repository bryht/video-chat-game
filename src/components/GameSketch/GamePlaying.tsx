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
    this.state = {
      gameRoom: new GameRoom(this.props.gameId),
      gameRound: new GameRound(this.props.gameId),
      gameUsers: [],
    }
    this.gameData.onGameRoundChanged(this.onGameRoundChanged)
    this.gameData.onGameRoomChanged(gameRoom => this.setState({ gameRoom }))
    this.gameData.onGameRoomUsersChanged(this.onGameRoomUsersChanged)

  }
  componentDidMount() {
    this.gameData.initial();
  }

  onGameRoundChanged = (gameRound: GameRound) => {
    this.setState({ gameRound });
  }
  onGameRoomUsersChanged = (gameUsers: Array<GameUser>) => {

    this.setState({ gameUsers })
    Log.Info(gameUsers);

    var choosingUser = this.state.gameUsers.find(p => p.userState === GameUserState.choosing || GameUserState.selectWinner);
    if (choosingUser) {
      this.gameData.pauseGame();
    }

    // var playingUser = this.state.gameUsers.find(p => p.userState === GameUserState.playing);
    // if (playingUser) {
    //   this.gameData.resumeGame();
    // }

  }

  private getCurrentGameUser = () => {
    return this.state.gameUsers.find(p => p.uid === this.props.uid);
  }


  private getCurrentPlayingGameUser = () => {
    return this.state.gameUsers.find(p => p.userState !== GameUserState.waiting);
  }


  getCurrentUserScreen = () => {
    var currentGameUser = this.getCurrentGameUser();
    switch (currentGameUser?.userState) {
      case GameUserState.choosing:
        return <ChoosingWord gameId={this.state.gameRoom.gameId} uid={this.props.uid}></ChoosingWord>
      case GameUserState.playing:
        return <CanvasDraw gameId={this.state.gameRoom.gameId} uid={this.props.uid}></CanvasDraw>;
      case GameUserState.waiting:
        return <CanvasWatcher gameId={this.state.gameRoom.gameId} uid={this.props.uid}></CanvasWatcher>;
      case GameUserState.selectWinner:
        return <SelectWinner gameId={this.state.gameRoom.gameId} uid={this.props.uid} ></SelectWinner>
      default:
        return <Loading></Loading>
    }
  }

  selectWinner = () => {
    var currentGameUser = this.getCurrentGameUser();
    if (currentGameUser) {
      currentGameUser.userState = GameUserState.selectWinner;
      this.gameData.updateGameUser(currentGameUser);
    }
  }


  public render() {

    return (
      <div>
        {this.getCurrentGameUser()?.userState === GameUserState.playing && <button onClick={this.selectWinner}>Select Winner for word {this.getCurrentGameUser()?.wordChosen}</button>}
        <p>Hi {this.getCurrentGameUser()?.name},Game round:{this.state.gameRound.currentRound},
          time left:{this.state.gameRoom.roundTime - this.state.gameRound.timing}s,
          current player:{this.getCurrentPlayingGameUser()?.name}, </p>
        {this.getCurrentUserScreen()}
      </div>
    );
  }
}
