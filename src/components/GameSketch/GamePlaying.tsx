import * as React from 'react';
import CanvasDraw from './CanvasDraw';

export interface IGamePlayingProps {
}

export default class GamePlaying extends React.Component<IGamePlayingProps> {

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
