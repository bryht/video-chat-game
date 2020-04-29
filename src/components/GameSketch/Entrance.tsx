import * as React from 'react';
import Guid from 'utils/Guid';
import { GameUser } from './Models/GameUser';

interface IEntranceProps {

}

interface IEntranceStates {
  user: Array<GameUser>;
  room: string;
}

export default class Entrance extends React.Component<IEntranceProps, IEntranceStates> {

  constructor(props: Readonly<IEntranceProps>) {
    super(props);
    this.state = {
      user: [],
      room: Guid.newGuid()
    }
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
          <li>user1</li>
          <li>user2</li>
        </ul>
        <a href="/game-sketch/room">Start</a>
      </div>
    );
  }
}
