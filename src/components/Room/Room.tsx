import * as React from 'react';
import styles from './Room.module.scss';
import { RoomItem } from 'components/Room/Models/RoomItem';
import { FaVideo, FaVideoSlash, FaVolumeUp, FaVolumeMute, FaStop, FaGamepad } from 'react-icons/fa';
import GameEnter from 'components/GameSketch/GameEnter';
import { User } from 'common/Models/User';
import VideoClient, { VideoStream } from 'utils/VideoClient';
import VideoPlayer from 'components/Video/VideoPlayer';
import { RoomData } from 'common/Database/RoomData';
import { RoomItemType } from './Models/RoomItemType';


export interface IRoomProps {
    roomName: string;
    roomPassword: string | null;
    currentUser: User;
    leaveRoom: () => void;
}
export interface IRoomStates {
    isFullScreen: boolean;
    roomItems: Array<RoomItem>;
    isVideoOn: boolean;
    isAudioOn: boolean;

}
class Room extends React.Component<IRoomProps, IRoomStates> {

    videoClient: VideoClient;
    roomData: RoomData;
    constructor(props: Readonly<IRoomProps>) {
        super(props);
        this.videoClient = new VideoClient(process.env.REACT_APP_APP_ID ?? '');
        this.videoClient.onStreamListChanged = list => {
            this.createVideos(list);
        };
        this.roomData = new RoomData(this.props.roomName)

        this.state = {
            isFullScreen: false,
            isVideoOn: true,
            isAudioOn: true,
            roomItems: []
        }
    }


    async componentDidMount() {
        await this.videoClient.create(this.props.roomName, this.props.currentUser.id);
    }

    componentWillUnmount() {
        this.videoClient.dispose();
    }

    roomItemToCenter = (id: string) => {
        var item = this.state.roomItems.find(p => p.id === id);
        if (item) {
            item.order = Date.now();
            this.setState({ roomItems: [...this.state.roomItems] });
        }
    }

    leaveRoom = () => {
        this.props.leaveRoom();
    }

    switchAudio = () => {
        var local = this.state.roomItems.find(p => p.roomItemType === RoomItemType.LocalVideo);
        if (local) {
            const { isAudioOn } = this.state;

            if (isAudioOn) {
                local.localVideoStream?.stream.muteAudio();
                this.setState({ isAudioOn: false });
            } else {
                local.localVideoStream?.stream.unmuteAudio();
                this.setState({ isAudioOn: true });
            }
        }
    }

    switchVideo = () => {
        var local = this.state.roomItems.find(p => p.roomItemType === RoomItemType.LocalVideo);
        if (local) {
            const { isVideoOn } = this.state;

            if (isVideoOn) {
                local.localVideoStream?.stream.muteVideo();
                this.setState({ isVideoOn: false });
            } else {
                local.localVideoStream?.stream.unmuteVideo();
                this.setState({ isVideoOn: true });
            }
        }
    }

    createVideos = (videoStreamList: Array<VideoStream>) => {
        var videoRoomItems = videoStreamList.map((stream, index) => {
            var item = new RoomItem();
            item.id = stream.id;
            item.order = Date.now() + index;
            item.roomItemType = stream.isLocal ? RoomItemType.LocalVideo : RoomItemType.RemoteVideo;
            item.localVideoStream = stream.isLocal ? stream : undefined;
            item.content = (<VideoPlayer key={"video" + item.id} videoStream={stream}></VideoPlayer>);
            return item;
        });
        var gameRoomItems = this.state.roomItems.filter(p => p.roomItemType === RoomItemType.SketchGame);
        this.setState({ roomItems: [...videoRoomItems, ...gameRoomItems] });
    }
    createGame = () => {
        var item = new RoomItem();
        item.id = this.props.roomName;
        item.order = Date.now();;
        item.roomItemType = RoomItemType.SketchGame;
        item.content = (<GameEnter gameId={item.id} currentUser={this.props.currentUser}></GameEnter>);
        if (!this.state.roomItems.find(p => p.id === item.id)) {
            this.setState({ roomItems: [...this.state.roomItems, item] });
        }
    }

    switchFullScreen = () => {
        this.setState({ isFullScreen: !this.state.isFullScreen })
    }

    private getMaxOrderItem = () => {
        var item = this.state.roomItems.reduce((a, b) => a.order > b.order ? a : b, { order: 0, content: '', id: '' });
        return item;
    }

    public render() {

        const { isFullScreen, isAudioOn, isVideoOn, roomItems } = this.state;
        return (
            <div className={styles.main}>
                <div className={styles.left}>
                    <div className={styles.center}>
                        {this.getMaxOrderItem().content}
                    </div>
                    <div className={`${styles.bottom} ${isFullScreen ? styles.fullScreen : ''}`}>
                        <div className={isVideoOn ? "" : styles.mute} onClick={() => this.switchVideo()}>
                            {isVideoOn ? <FaVideo></FaVideo> : <FaVideoSlash></FaVideoSlash>}
                        </div>
                        <div className={isAudioOn ? "" : styles.mute} onClick={() => this.switchAudio()}>
                            {isAudioOn ? <FaVolumeUp></FaVolumeUp> : <FaVolumeMute></FaVolumeMute>}
                        </div>
                        <div className={styles.stop} onClick={() => this.leaveRoom()}>
                            <FaStop></FaStop>
                        </div>
                        {!roomItems.find(p => p.id === this.props.roomName) &&
                            <div className={styles.game} onClick={() => this.createGame()}>
                                <FaGamepad />
                            </div>
                        }
                    </div>
                </div>
                <div className={`${styles.right} ${isFullScreen ? styles.fullScreen : ''}`}>
                    {this.state.roomItems.filter(p => p.id !== this.getMaxOrderItem().id).map(item => {
                        return (<div onClick={() => this.roomItemToCenter(item.id)} key={item.id} id={item.id}>{item.content}</div>)
                    })}
                </div>
            </div >
        );
    }
}


export default Room;
