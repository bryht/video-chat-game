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
  users: Array<GameUser>;
  room: GameRoom;
}

export default class GameEnter extends React.Component<IGameEnterProps, IGameEnterStates> {

  gameData: GameData;
  constructor(props: Readonly<IGameEnterProps>) {
    super(props);

    this.state = {
      users: [],
      room: new GameRoom('', GameRoomState.waiting)
    }
    this.gameData = new GameData();
    let gameRoom = new GameRoom(WordHelper.newAdjectiveNoun(), GameRoomState.waiting);
    this.gameData.createRoom(gameRoom);
    this.gameData.onJoinRoom(this.onJoinRoom);
    // this.gameData.joinRoom(gameRoom.id,)
  }

  onJoinRoom = (roomId: string, gameUser: GameUser) => {
    const { users } = this.state;
    users.push(gameUser);
    this.setState({ users });
  }

  startGame = () => {
    this.setState({
      room: {
        ...this.state.room,
        roomState: GameRoomState.started
      }
    })


  }

  joinGame = () => {

  }

  public render() {
    return (
      <div>
        <h1>{this.state.room.id}</h1>
        <div>
          10 round
        </div>
        <div>
          120 seconde per round
        </div>

        <ul>
          {this.state.users.map(user =>
            <li key={user.uid}>{user.name} is ready</li>)
          }
        </ul>
        <button onClick={this.startGame}>Start</button>
        <button onClick={this.joinGame}>Join</button>
        <div>
          <div>Join through link:</div>
          <a href={`/game-sketch/${this.state.room.id}`}>http://letshaveaparty.online/game-sketch/{this.state.room.id}</a>
        </div>
        <ul>

        </ul>
      </div>
    );
  }
}
