/* eslint-disable jsx-a11y/anchor-is-valid */
import * as React from 'react';
import styles from './EntrancePage.module.scss';
import { IAuthProps } from "common/Authentication/IAuthProps";
import { withAuth } from 'common/Connect/Connections';
import { WordHelper } from 'utils/WordHelper';
import FirebaseHelper from 'utils/FirebaseHelper';

export interface IEntrancePageProps extends IAuthProps<any> {
}

interface IEntrancePageStates {
    room: string;
}

class EntrancePage extends React.Component<IEntrancePageProps, IEntrancePageStates> {
    firebaseHelper:FirebaseHelper;
    constructor(props: Readonly<IEntrancePageProps>) {
        super(props);
        this.firebaseHelper=new FirebaseHelper();
        this.state = {
            room: WordHelper.newNoun(),
        }
    }
    roomChanged = async (room: string) => {
        this.setState({ room });
        //TODO:move to right place
        await this.firebaseHelper.dbAddOrUpdateAsync('room', room, { uid: this.props.currentUser?.id, name: room });
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