import * as React from 'react';
import styles from './EntrancePage.module.scss';
import Guid from 'utils/Guid';
import Log from 'utils/Log';
export interface IEntrancePageProps {
}

export default class EntrancePage extends React.Component<IEntrancePageProps> {
    public render() {
        Log.Info("Entrance page");

        return (
            <div className={styles.main}>
                <h1>Welcome Video Chat Game</h1>
                <a href={"/home/" + Guid.newGuid()}>Create1</a>
            </div>
        );
    }
}
