import * as React from 'react';
import styles from './Room.module.scss';
export interface IRoomProps {
}

export default class Room extends React.Component<IRoomProps> {
  public render() {
    return (
      <div className={styles.main}>
        Room
      </div>
    );
  }
}
