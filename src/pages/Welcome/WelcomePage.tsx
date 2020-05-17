import * as React from 'react';
import styles from './WelcomePage.module.scss';
import welcome from 'assets/welcome.png';
import { WordHelper } from 'utils/WordHelper';
export interface IWelcomePageProps {
}

export default class WelcomePage extends React.Component<IWelcomePageProps> {
    
    public render() {
        return (
            <div className={styles.main}>
                <div className={styles.welcome}>
                    <img src={welcome} alt="" />
                </div>
                <div className={styles.button}>
                    <a href="/enter">Create Party</a>
                </div>
                {/* <div className={styles.button}>
                    <a href={`/game/${WordHelper.newAdjectiveNoun()}`}>Start game(demo)</a>
                </div> */}
            </div>
        );
    }
}
