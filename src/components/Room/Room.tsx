import * as React from 'react';
import styles from './Room.module.scss';
export interface IRoomProps {
}

export default class Room extends React.Component<IRoomProps> {


  sum(){
    var a=1;
    var b=2;
    return a+b;
  }
  public render() {
    return (
      <div className={styles.main}>
        <div className={styles.left}>
          <div className={styles.center}>
            center
          </div>
          <div className={styles.bottom}>
            <div>Control</div>
            <div>Control</div>
            <div>Control</div>
            <div>Control</div>
          </div>
        </div>
        <div className={styles.right}>
          <div>Video</div>
          <div>Video</div>
          <div>Video</div>
        </div>
      </div>
    );
  }
}
