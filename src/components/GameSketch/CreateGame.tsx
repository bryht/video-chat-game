import * as React from 'react';
import Guid from 'utils/Guid';
import { GameUser } from './Models/GameUser';
import { GameData } from './GameData';

interface ICreateGameProps {

}

interface ICreateGameStates {
  users: Array<GameUser>;
  room: string;
}

export default class CreateGame extends React.Component<ICreateGameProps, ICreateGameStates> {

  gameData: GameData;
  constructor(props: Readonly<ICreateGameProps>) {
    super(props);
    this.state = {
      users: [],
      room: Guid.newGuid()
    }
    this.gameData = new GameData();
  
    this.gameData.onJoinRoom(this.onJoinRoom);
  }

  onJoinRoom = (room: string, uid: string, name: string) => {
    const { users } = this.state;
    users.push(new GameUser(uid, name));
    this.setState({ users });
  }

  public render() {
    return (
      <div>
        <div>
          10 round
        </div>
        <div>
          120 seconde per round
        </div>
        <ul>
          {this.state.users.map(user =>
            <li>{user.name}</li>)
          }
        </ul>
        <a href="/game-sketch/room">Start</a>
        <div>
          <a href="/game-sketch/join">Share:</a>
        </div>
      </div>
    );
  }
}
