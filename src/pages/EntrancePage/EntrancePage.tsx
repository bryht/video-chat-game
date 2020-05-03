/* eslint-disable jsx-a11y/anchor-is-valid */
import * as React from 'react';
import styles from './EntrancePage.module.scss';
import { IAuthProps } from "common/Authentication/IAuthProps";
import firebaseHelper from 'utils/FirebaseHelper';
import { withAuth } from 'common/Connect/Connections';
import { WordHelper } from 'utils/WordHelper';

export interface IEntrancePageProps extends IAuthProps<any> {
}

interface IEntrancePageStates {
    room: string;
}

class EntrancePage extends React.Component<IEntrancePageProps, IEntrancePageStates> {
    constructor(props: Readonly<IEntrancePageProps>) {
        super(props);
        this.state = {
            room: WordHelper.newNoun(),
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
                <h1>Hi,{name ? `${name},` : ''} Welcome! Please enter your room to start.</h1>
                <img src={""} alt="" />
                <div className={styles.roomName}>
                    <div>
                        <span>Room:</span>
                    </div>
                    <input type="text" value={this.state.room} onChange={e => { this.roomChanged(e.target.value) }} />
                </div>
                <div className={styles.button}>
                    <a href={`/room/${this.state.room}`}>Go Room</a>
                </div>
                <div className={styles.button}>
                    <a href="/welcome" >Back</a>
                </div>
            </div>
        );
    }
}

export default withAuth(EntrancePage);