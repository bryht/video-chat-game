import * as React from 'react';
import VideoRoom from 'components/VideoRoom/VideoRoom';
import { withAuth } from 'common/Connect/Connections';
import { IAuthProps } from 'common/Authentication/IAuthProps';
import Room from 'components/Room/Room';
import GameSketch from 'components/GameSketch/GameSketch';

interface RouteInfo {
    id: string;
}

class RoomPage extends React.Component<IAuthProps<RouteInfo>> {
    leaveRoom = () => {
        this.props.history.push("/enter");
    }

    public render() {
        return (
            // <Room roomName={this.props.match.params.id}
            //     roomPassword={null}
            //     uid={this.props.currentUser.id}
            //     leaveRoom={this.leaveRoom} />
                <GameSketch></GameSketch>
        );
    }
}

export default withAuth(RoomPage);

