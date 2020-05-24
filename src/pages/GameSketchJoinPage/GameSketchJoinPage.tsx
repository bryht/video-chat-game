import * as React from 'react';
import GameJoin from 'components/GameSketch/GameJoin';
import { RouteComponentProps, withRouter } from 'react-router-dom';

interface IGameSketchJoinPageProps extends RouteComponentProps<{ roomId: string }> {
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
            <GameJoin roomId={this.props.match.params.roomId}></GameJoin>
        );
    }
}

export default withRouter(GameSketchJoinPage);
