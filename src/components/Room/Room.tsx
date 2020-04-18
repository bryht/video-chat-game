import * as React from 'react';
import styles from './Room.module.scss';
import VideoClient from 'utils/VideoClient';
import Log from 'utils/Log';
import Guid from 'utils/Guid';
export interface IRoomProps {
}
export interface IRoomStates {
  streamList: Array<AgoraRTC.Stream>;
  localStream: AgoraRTC.Stream;
}
export default class Room extends React.Component<IRoomProps, IRoomStates> {

  appId: string;
  client: VideoClient;
  constructor(props: Readonly<IRoomProps>) {
    super(props);
    this.appId = process.env.REACT_APP_APP_ID ?? '';
    this.client = new VideoClient(this.appId);
    this.state = {
      streamList: this.client.streamList,
      localStream: this.client.localStream
    }
  }


  async componentDidMount() {
    this.client.onStreamListChanged = list => {
      this.setState({ streamList: list });
      list.forEach(item => {
        item.play(`video-${item.getId()}`);
      });
    };
    this.client.onLocalStreamChanged = stream => {
      this.setState({ localStream: stream });
      stream.play(`video-${stream.getId()}`);
    }
    await this.client.create('123', Guid.newGuid());

  }


  public render() {
    Log.Warning(this.state.streamList.length);
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
          {
            this.state.streamList.map(item => {
              return (<div>
                <section id={`video-${item.getId()}`}></section>
              </div>)
            })
          }
        </div>
      </div>
    );
  }
}
