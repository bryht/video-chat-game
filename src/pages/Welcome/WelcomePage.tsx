import * as React from 'react';
import styles from './WelcomePage.module.scss';
import welcome from 'assets/welcome.png';
import Log from 'utils/Log';
export interface IWelcomePageProps {
}

export default class WelcomePage extends React.Component<IWelcomePageProps> {
    async componentDidMount() {
        try {
            var response = await fetch('/api');
            var result= await response.text();
            Log.Info(result);
        } catch (error) {
            Log.Error(error);
        }
    }
    public render() {
        return (
            <div className={styles.main}>
                <div className={styles.welcome}>
                    <img src={welcome} alt="" />
                </div>
                <div className={styles.button}>
                    <a href="/enter">Start video and game</a>
                </div>
                <div className={styles.button}>
                    <a href="/enter">Start game</a>
                </div>
            </div>);
    }
}
