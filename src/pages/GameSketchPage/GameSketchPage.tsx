import * as React from 'react';
import { withAuth } from 'common/Connect/Connections';
import { IAuthProps } from 'common/Authentication/IAuthProps';
import CreateGame from 'components/GameSketch/CreateGame';
import Log from 'utils/Log';

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
            <CreateGame currentUser={this.props.currentUser}></CreateGame>
        );
    }
}

export default withAuth(GameSketchPage);
