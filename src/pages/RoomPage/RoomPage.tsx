import * as React from 'react';
import VideoRoom from 'components/VideoRoom/VideoRoom';
import { withAuth } from 'common/Connect/Connections';
import { IAuthProps } from 'common/Authentication/IAuthProps';
import Room from 'components/Room/Room';

interface RouteInfo {
    id: string;
}

class RoomPage extends React.Component<IAuthProps<RouteInfo>> {
    leaveRoom = () => {
        this.props.history.push("/enter");
    }

    public render() {
        return (
            <VideoRoom roomName={this.props.match.params.id}
                uid={this.props.currentUser.id}
                leaveRoom={this.leaveRoom} />
        );
    }
}

export default withAuth(RoomPage);

