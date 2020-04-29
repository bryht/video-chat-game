import * as React from 'react';
import CanvasDraw from './CanvasDraw';

export interface IGameRoomProps {
}

export default class GameRoom extends React.Component<IGameRoomProps> {

  public render() {

    //create room
    //
    return (
      <div>
        <CanvasDraw room={"test"} uid={"user1"}></CanvasDraw>
      </div>
    );
  }
}
