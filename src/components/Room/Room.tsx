import * as React from 'react';
import styles from './Room.module.scss';
import VideoClient, { VideoStream } from 'utils/VideoClient';
import Log from 'utils/Log';
import Guid from 'utils/Guid';
import Video from 'components/Video/VideoPlayer';
export interface IRoomProps {
}
export interface IRoomStates {
  streamList: Array<VideoStream>;
}
export default class Room extends React.Component<IRoomProps, IRoomStates> {

  appId: string;
  client: VideoClient;
  constructor(props: Readonly<IRoomProps>) {
    super(props);
    this.appId = process.env.REACT_APP_APP_ID ?? '';
    this.client = new VideoClient(this.appId);
    this.state = {
      streamList: [],
    }
  }


  async componentDidMount() {
    this.client.onStreamListChanged = list => {
      this.setState({ streamList: list });
    };
    await this.client.create('123', Guid.newGuid());
  }

  switchToCenter = (streamId: string) => {

  }
  componentWillUnmount() {
    this.client.dispose();
  }

  public render() {
    Log.Warning("room render " + this.state.streamList.length);
    const centerStreams = this.state.streamList.filter(p => p.isLocal);
    const rightStreams = this.state.streamList.filter(p => !p.isLocal);
    return (
      <div className={styles.main}>
        <div className={styles.left}>
          <div className={styles.center}>
            {
              centerStreams.map(item => {
                return (<Video key={`center-${item.stream.getId()}`} videoStream={item}></Video>)
              })
            }
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
            rightStreams.map(item => {
              return (<Video key={`right-${item.stream.getId()}`} videoStream={item}></Video>)
            })
          }
        </div>
      </div>
    );
  }
}
