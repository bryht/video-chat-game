import * as React from 'react';
import styles from './Room.module.scss';
import VideoClient, { VideoStream } from 'utils/VideoClient';
import Guid from 'utils/Guid';
import Video from 'components/Video/VideoPlayer';
import { FaVideo, FaVideoSlash, FaVolumeUp, FaVolumeMute,FaStop } from "react-icons/fa";
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { RouteInfo } from 'pages/HomePage/HomePage';

export interface IRoomProps extends RouteComponentProps<RouteInfo> {
}
export interface IRoomStates {
  centerStream: VideoStream | null;
  rightStreams: Array<VideoStream>;
  isVideoOn: boolean;
  isAudioOn: boolean;

}
class Room extends React.Component<IRoomProps, IRoomStates> {

  appId: string;
  client: VideoClient;
  streamList: Array<VideoStream>;
  localStream: VideoStream | null;
  constructor(props: Readonly<IRoomProps>) {
    super(props);
    this.appId = process.env.REACT_APP_APP_ID ?? '';
    this.client = new VideoClient(this.appId);
    this.streamList = [];
    this.localStream = null;
    this.state = {
      centerStream: null,
      rightStreams: [],
      isAudioOn: true,
      isVideoOn: true
    }
  }


  async componentDidMount() {
    this.client.onStreamListChanged = list => {
      this.streamList = list;
      this.localStream = list.find(p => p.isLocal) ?? null;
      this.refreshVideos();
    };
    await this.client.create('123', Guid.newGuid());
  }

  switchToCenter = (streamId: string) => {
    var maxOrder = Math.max(...this.streamList.map(p => p.order));
    var stream = this.streamList.find(p => p.id === streamId);
    if (stream) {
      stream.order = maxOrder + 1;
      this.refreshVideos();
    }
  }


  refreshVideos = () => {
    var maxOrder = Math.max(...this.streamList.map(p => p.order));
    this.setState({
      centerStream: this.streamList.find(p => p.order === maxOrder) ?? null,
      rightStreams: this.streamList.filter(p => p.order !== maxOrder)
    });
  }

  componentWillUnmount() {
    this.client.dispose();
  }

  switchVideo = () => {
    if (this.localStream) {
      const { isVideoOn } = this.state;

      if (isVideoOn) {
        this.localStream.stream.muteVideo();
        this.setState({ isVideoOn: false });
      } else {
        this.localStream.stream.unmuteVideo();
        this.setState({ isVideoOn: true });
      }
    }
  }

  stop=()=>{
    this.props.history.push("/");
  }

  switchAudio = () => {
    if (this.localStream) {
      const { isAudioOn } = this.state;

      if (isAudioOn) {
        this.localStream.stream.muteAudio();
        this.setState({ isAudioOn: false });
      } else {
        this.localStream.stream.unmuteAudio();
        this.setState({ isAudioOn: true });
      }
    }
  }


  public render() {
    const { centerStream, rightStreams } = this.state;
    return (
      <div className={styles.main}>
        <div className={styles.left}>
          <div className={styles.center}>
            {
              centerStream &&
              (<Video key={`center-${centerStream.id}`} videoStream={centerStream}></Video>)
            }
          </div>
          <div className={styles.bottom}>
            <div className={this.state.isVideoOn ? "" : styles.mute} onClick={() => this.switchVideo()}>
              {this.state.isVideoOn ? <FaVideo></FaVideo> : <FaVideoSlash></FaVideoSlash>}
            </div>
            <div className={this.state.isAudioOn ? "" : styles.mute} onClick={() => this.switchAudio()}>
              {this.state.isAudioOn ? <FaVolumeUp></FaVolumeUp> : <FaVolumeMute></FaVolumeMute>}
            </div>
            <div className={styles.stop} onClick={() => this.stop()}>
              <FaStop></FaStop>
            </div>
          </div>
        </div>
        <div className={styles.right}>
          {
            rightStreams.map(item => {
              return (<div key={`right-${item.id}`} onClick={() => this.switchToCenter(item.id)}><Video videoStream={item}></Video></div>)
            })
          }
        </div>
      </div >
    );
  }
}


export default withRouter(Room);
