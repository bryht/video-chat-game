import * as React from 'react';
import styles from './EntrancePage.module.scss';
import Log from 'utils/Log';
import sentencer from 'sentencer';
import firebase from 'firebase';
export interface IEntrancePageProps {
}

export interface IEntrancePageStates {
    room: string;
    displayName:string;
}
export default class EntrancePage extends React.Component<IEntrancePageProps, IEntrancePageStates> {
    constructor(props: Readonly<IEntrancePageProps>) {
        super(props);
        var noun = sentencer.make("{{ noun }}");
        this.state = {
            room: noun,
            displayName:firebase.auth().currentUser?.displayName??''
        }
    }
    componentDidMount(){
        Log.Error(firebase.auth().currentUser);

    }
    roomChanged = (room: string) => {
        this.setState({ room });
    }

    public render() {
        Log.Info("Entrance page");
        // eslint-disable-next-line
       
       
        
        return (
            <div className={styles.main}>
                <h1>Hi,{this.state.displayName} Welcome Video Chat Game</h1>
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
