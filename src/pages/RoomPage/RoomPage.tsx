import * as React from 'react';
import Room from 'components/Room/Room';
import { withAuth } from 'common/Connect/Connections';
import { IAuthProps } from 'common/Authentication/IAuthProps';

interface RouteInfo {
    id: string;
}

class RoomPage extends React.Component<IAuthProps<RouteInfo>> {
    leaveRoom = () => {
        this.props.history.push("/");
    }

    public render() {
        return (
            <Room roomName={this.props.match.params.id}
                uid={this.props.currentUser.id}
                leaveRoom={this.leaveRoom} />
        );
    }
}

export default withAuth(RoomPage);

