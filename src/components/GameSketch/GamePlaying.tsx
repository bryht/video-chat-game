import * as React from 'react';
import CanvasDraw from './CanvasDraw';
import { GameRoom } from './Models/GameRoom';
import { GameUser } from './Models/GameUser';

interface IGamePlayingProps {
  gameRoom: GameRoom;
  uid: string;
}

interface IGamePlayingStates {
  currentGameUser?: GameUser;
}

export default class GamePlaying extends React.Component<IGamePlayingProps, IGamePlayingStates> {

  constructor(props: Readonly<IGamePlayingProps>) {
    super(props);
    this.state = {
      currentGameUser: this.props.gameRoom.users.find(p => p.uid === this.props.uid)
    }
  }

  componentDidMount(){

  }

  public render() {

    return (
      <div>
        <p>Game round:1, time left:10s, current player:xxx</p>
        <CanvasDraw roomId={this.props.gameRoom.id} uid={this.props.uid}></CanvasDraw>
      </div>
    );
  }
}
