import * as React from 'react';
import styles from './EntrancePage.module.scss';
import sentencer from 'sentencer';
import { withAuth, IAuthProps } from 'common/Authencation/withAuth';
import { withRouter } from 'react-router-dom';

export interface IEntrancePageProps extends IAuthProps {
}

export interface IEntrancePageStates {
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
    }

 
    public render() {

        const { name } = this.props.currentUser ?? {};

        return (
            <div className={styles.main}>
                <h1>Hi,{name} Welcome Video Chat Game</h1>
                <div className={styles.roomName}>
                    <div>
                        <span>Room:</span>
                    </div>
                    <input type="text" value={this.state.room} onChange={e => { this.roomChanged(e.target.value) }} />
                </div>
                <a href={`/room/${this.state.room}`}>Go Room</a>
            </div>
        );
    }
}

export default withAuth(EntrancePage);