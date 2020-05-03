import * as React from 'react';
import { withAuth } from 'common/Connect/Connections';
import { IAuthProps } from 'common/Authentication/IAuthProps';
import JoinGame from 'components/GameSketch/JoinGame';

interface IGameSketchJoinPageProps extends IAuthProps<{ roomId: string }> {
}

export interface IGameSketchJoinPageState {
    

}

class GameSketchJoinPage extends React.Component<IGameSketchJoinPageProps, IGameSketchJoinPageState> {
    constructor(props: IGameSketchJoinPageProps) {
        super(props);
        this.state = {
            
        }
    }

    public render() {
        return (
            <JoinGame currentUser={this.props.currentUser} roomId={this.props.match.params.roomId}></JoinGame>
        );
    }
}

export default withAuth(GameSketchJoinPage);
