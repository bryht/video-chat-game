import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import Room from 'components/Room/Room';

export interface RouteInfo {
    id: string;

}

class RoomPage extends React.Component<RouteComponentProps<RouteInfo>> {
    leaveRoom = () => {
        this.props.history.push("/");
    }
    
    public render() {
        return (
            <Room roomName={this.props.match.params.id}
                leaveRoom={this.leaveRoom} />
        );
    }
}

export default withRouter(RoomPage);

