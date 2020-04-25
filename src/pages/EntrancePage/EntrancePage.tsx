import * as React from 'react';
import styles from './EntrancePage.module.scss';
import sentencer from 'sentencer';
import { IAuthProps } from "common/Authentication/IAuthProps";
import firebaseHelper from 'utils/FirebaseHelper';
import { withAuth } from 'common/Connect/Connections';

export interface IEntrancePageProps extends IAuthProps<any> {
}

interface IEntrancePageStates {
    room: string;
}

class EntrancePage extends React.Component<IEntrancePageProps, IEntrancePageStates> {
    constructor(props: Readonly<IEntrancePageProps>) {
        super(props);
        var noun = sentencer.make("{{ noun }}");
        this.state = {
            room: noun,
        }
    }
    roomChanged = (room: string) => {
        this.setState({ room });
        firebaseHelper.dbAdd('room', { uid: this.props.currentUser?.id, name: room });
    }

    public render() {

        const { name } = this.props.currentUser;

        return (
            <div className={styles.main}>
                <h1>Hi,{`${name},`} Welcome Video Chat Game</h1>
                <img src={""} alt=""/>
                <div className={styles.roomName}>
                    <div>
                        <span>Room:</span>
                    </div>
                    <input type="text" value={this.state.room} onChange={e => { this.roomChanged(e.target.value) }} />
                </div>
                <a href={`/room/${this.state.room}`}>Go Room</a>
                <button onClick={this.props.logout}>Leave</button>
            </div>
        );
    }
}

export default withAuth(EntrancePage);