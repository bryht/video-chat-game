import * as React from 'react';
import { GameUser } from './Models/GameUser';
import { GameData } from './GameData';
import { GameUserState } from './Models/GameUserState';
import { GameUserRole } from './Models/GameUserRole';
import { GameRoom } from './Models/GameRoom';
import { WordHelper } from 'utils/WordHelper';
import { GameRoomState } from './Models/GameRoomState';
import { User } from 'common/Models/User';

interface IGameEnterProps {
  currentUser: User;
}

interface IGameEnterStates {

  gameRoom: GameRoom;
}

export default class GameEnter extends React.Component<IGameEnterProps, IGameEnterStates> {

  gameData: GameData;
  constructor(props: Readonly<IGameEnterProps>) {
    super(props);
    this.gameData = new GameData();
    let gameRoom = new GameRoom(WordHelper.newAdjectiveNoun(), GameRoomState.waiting);
    let gameUser=new GameUser(this.props.currentUser.id,this.props.currentUser.name||WordHelper.newNoun(),GameUserState.waiting,GameUserRole.owner);
    this.gameData.createRoom(gameRoom);
    this.gameData.onJoinRoom(gameRoom.id, this.onRoomChanged);
    this.gameData.joinRoom(gameRoom.id, gameUser)
    this.state = {
      gameRoom
    }
  }

  onRoomChanged = (gameRoom: GameRoom) => {

    this.setState({ gameRoom });
  }

  startGame = () => {
    this.setState({
      gameRoom: {
        ...this.state.gameRoom,
        roomState: GameRoomState.started
      }
    })


  }

  joinGame = () => {

  }

  public render() {
    return (
      <div>
        <h1>{this.state.gameRoom.id}</h1>
        <div>
          10 round
        </div>
        <div>
          120 seconde per round
        </div>

        <ul>
          {this.state.gameRoom.users.map(user =>
            <li key={user.uid}>{user.name} is ready</li>)
          }
        </ul>
        <button onClick={this.startGame}>Start</button>
        <button onClick={this.joinGame}>Join</button>
        <div>
          <div>Join through link:</div>
          <a href={`/game-sketch/${this.state.gameRoom.id}`}>http://letshaveaparty.online/game-sketch/{this.state.gameRoom.id}</a>
        </div>
        <ul>

        </ul>
      </div>
    );
  }
}
