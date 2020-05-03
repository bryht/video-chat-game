import * as React from 'react';
import Guid from 'utils/Guid';
import { GameUser } from './Models/GameUser';
import { GameData } from './GameData';
import { GameUserState } from './Models/GameUserState';
import { GameUserRole } from './Models/GameUserRole';
import { GameRoom } from './Models/GameRoom';
import { WordHelper } from 'utils/WordHelper';
import { GameRoomState } from './Models/GameRoomState';
import { User } from 'common/Models/User';

interface ICreateGameProps {
  currentUser: User;
}

interface ICreateGameStates {
  users: Array<GameUser>;
  room: GameRoom;
}

export default class CreateGame extends React.Component<ICreateGameProps, ICreateGameStates> {

  gameData: GameData;
  constructor(props: Readonly<ICreateGameProps>) {
    super(props);

    this.state = {
      users: [new GameUser(this.props.currentUser.id, this.props.currentUser.name ?? WordHelper.newNoun(), GameUserState.waiting, GameUserRole.owner)],
      room: new GameRoom(Guid.newGuid(), WordHelper.newNoun(), GameRoomState.waiting)
    }
    this.gameData = new GameData();
    this.gameData.onJoinRoom(this.onJoinRoom);
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
        <h1>{this.state.room.name}</h1>
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
          <a href={`/game-sketch/${this.state.room.name}`}>http://letshaveaparty.online/game-sketch/{this.state.room.name}</a>
        </div>
        <ul>

        </ul>
      </div>
    );
  }
}
