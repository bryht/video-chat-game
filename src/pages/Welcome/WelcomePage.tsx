import * as React from 'react';
import styles from './WelcomePage.module.scss';
import welcome from 'assets/welcome.svg';
import { FaGamepad, FaDribbbleSquare, FaMitten } from 'react-icons/fa';
export interface IWelcomePageProps {
}

export default class WelcomePage extends React.Component<IWelcomePageProps> {

    public render() {
        return (
            <div className={styles.main}>
                <div className={styles.header}>
                    <p>Let`s have a party</p>
                    <img src={welcome} alt="" />
                </div>
                <div className={styles.welcome}>
                    <div className={styles.button}>
                        <FaDribbbleSquare></FaDribbbleSquare>
                        <a href="/enter">Create Party</a>
                        <p>create a party with a room name, people can join your party through room name.</p>
                    </div>
                    <div className={styles.button}>
                        <FaMitten></FaMitten>
                        <a href="/enter">Join Party</a>
                        <p>your friend create a party with a room name, use the name to join.</p>
                    </div>
                    <div className={styles.button}>
                        <FaGamepad></FaGamepad>
                        <a href="/enter">Create Game</a>
                        <p>create a game on your big screen, people can join through their phone.</p>
                    </div>
                </div>
            </div>
        );
    }
}
