import * as React from 'react';
import styles from './Room.module.scss';
import VideoClient, { VideoStream } from 'utils/VideoClient';
import Video from 'components/Video/VideoPlayer';
import { FaVideo, FaVideoSlash, FaVolumeUp, FaVolumeMute, FaStop } from "react-icons/fa";
import { GoScreenFull, GoScreenNormal } from "react-icons/go";


export interface IRoomProps {
  roomName:string;
  uid:string;
  leaveRoom:()=>void;
}
export interface IRoomStates {
  centerStream: VideoStream | null;
  rightStreams: Array<VideoStream>;
  isVideoOn: boolean;
  isAudioOn: boolean;
  isFullScreen: boolean;

}
class Room extends React.Component<IRoomProps, IRoomStates> {

  appId: string;
  client: VideoClient;
  streamList: Array<VideoStream>;
  localStream: VideoStream | null;
  channel: string;
  constructor(props: Readonly<IRoomProps>) {
    super(props);
    this.appId = process.env.REACT_APP_APP_ID ?? '';
    this.client = new VideoClient(this.appId);
    this.streamList = [];
    this.localStream = null;
    this.channel = '';
    this.state = {
      centerStream: null,
      rightStreams: [],
      isAudioOn: true,
      isVideoOn: true,
      isFullScreen: true
    }
  }


  async componentDidMount() {
    this.client.onStreamListChanged = list => {
      this.streamList = list;
      this.localStream = list.find(p => p.isLocal) ?? null;
      this.refreshVideos();
    };

    await this.client.create(this.props.roomName, this.props.uid);
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

  stop = () => {
    // this.props.history.push("/");
    this.props.leaveRoom();
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

  switchFullScreen = () => {
    this.setState({ isFullScreen: !this.state.isFullScreen })
  }


  public render() {
    const { centerStream, rightStreams, isVideoOn, isAudioOn, isFullScreen } = this.state;
    return (
      <div className={styles.main}>
        <div className={styles.left}>
          <div className={styles.center}>
            {
              centerStream &&
              (<Video key={`center-${centerStream.id}`} videoStream={centerStream}></Video>)
            }
            <div className={styles.toggleFullScreen}  onClick={() => this.switchFullScreen()}>
              {isFullScreen ? <GoScreenNormal /> : <GoScreenFull />}
            </div>
          </div>
          <div className={`${styles.bottom} ${isFullScreen ? styles.fullScreen : ''}`}>
            <div className={isVideoOn ? "" : styles.mute} onClick={() => this.switchVideo()}>
              {isVideoOn ? <FaVideo></FaVideo> : <FaVideoSlash></FaVideoSlash>}
            </div>
            <div className={isAudioOn ? "" : styles.mute} onClick={() => this.switchAudio()}>
              {isAudioOn ? <FaVolumeUp></FaVolumeUp> : <FaVolumeMute></FaVolumeMute>}
            </div>
            <div className={styles.stop} onClick={() => this.stop()}>
              <FaStop></FaStop>
            </div>
          </div>
        </div>
        <div className={`${styles.right} ${isFullScreen ? styles.fullScreen : ''}`}>
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


export default Room;
