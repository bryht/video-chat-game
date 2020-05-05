import * as React from 'react';
import { withAuth } from 'common/Connect/Connections';
import { IAuthProps } from 'common/Authentication/IAuthProps';
import GameEnter from 'components/GameSketch/GameEnter';

interface IGameSketchPageProps extends IAuthProps<{ roomId: string }> {
}

export interface IGameSketchPageState {
    

}

class GameSketchPage extends React.Component<IGameSketchPageProps, IGameSketchPageState> {
    constructor(props: IGameSketchPageProps) {
        super(props);
        this.state = {
            
        }
    }


    public render() {
        return (
            <GameEnter currentUser={this.props.currentUser} roomId={this.props.match.params.roomId}></GameEnter>
        );
    }
}

export default withAuth(GameSketchPage);
