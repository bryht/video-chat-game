import * as React from 'react';
import styles from './EntrancePage.module.scss';
import Log from 'utils/Log';
import sentencer from 'sentencer';
export interface IEntrancePageProps {
}

export interface IEntrancePageStates {
    room: string;
}
export default class EntrancePage extends React.Component<IEntrancePageProps, IEntrancePageStates> {
    constructor(props: Readonly<IEntrancePageProps>) {
        super(props);
        var noun = sentencer.make("{{ noun }}");
        this.state = {
            room: noun
        }
    }

    roomChanged = (room: string) => {
        this.setState({ room });
    }

    public render() {
        Log.Info("Entrance page");
        // eslint-disable-next-line

        return (
            <div className={styles.main}>
                <h1>Hi {this.state.room} Welcome Video Chat Game</h1>
                <input type="text" value={this.state.room} onChange={e => { this.roomChanged(e.target.value) }} />
                <a href={`/home/${this.state.room}`}>Create</a>
            </div>
        );
    }
}
