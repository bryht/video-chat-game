import * as React from 'react';
import styles from './Room.module.scss';
import { IRoomItem } from 'components/Models/IRoomItem';
import { RoomGameItem } from 'components/Models/RoomGameItem';
import { RoomVideoItem } from 'components/Models/RoomVideoItem';
import { FaVideo, FaVideoSlash, FaVolumeUp, FaVolumeMute, FaStop, FaGamepad } from 'react-icons/fa';
import GameEnter from 'components/GameSketch/GameEnter';
import { User } from 'common/Models/User';
import { WordHelper } from 'utils/WordHelper';
import Log from 'utils/Log';


export interface IRoomProps {
    roomName: string;
    roomPassword: string | null;
    currentUser: User;
    leaveRoom: () => void;
}
export interface IRoomStates {
    isFullScreen: boolean;
    roomItems: Array<IRoomItem>;
    isVideoOn: boolean;
    isAudioOn: boolean;

}
class Room extends React.Component<IRoomProps, IRoomStates> {


    constructor(props: Readonly<IRoomProps>) {
        super(props);

        this.state = {
            isFullScreen: false,
            isVideoOn: true,
            isAudioOn: true,
            roomItems: []
        }
    }


    async componentDidMount() {
        this.setState({
            roomItems: [new RoomGameItem(), new RoomVideoItem()]
        })
    }


    componentWillUnmount() {

    }

    switchRoomItem = () => {

    }

    leaveRoom = () => {
        this.props.leaveRoom();
    }

    switchAudio = () => {

    }

    switchVideo = () => {

    }

    createGame = () => {
        var item = new RoomGameItem();
        item.id = this.props.roomName;
        item.order =  1;
        item.content = (<GameEnter gameId={item.id} currentUser={this.props.currentUser}></GameEnter>);
        this.state.roomItems.push(item);
        this.setState({ roomItems: this.state.roomItems});
        Log.Info(this.state.roomItems);
    }

    switchFullScreen = () => {
        this.setState({ isFullScreen: !this.state.isFullScreen })
    }

    private getMaxOrderItem = () => {
        return this.state.roomItems.reduce((a, b) => a.order > b.order ? a : b, { order: 0, content: '' });
    }

    public render() {
        const { isFullScreen, isAudioOn, isVideoOn } = this.state;
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
                        <div className={styles.game} onClick={() => this.createGame()}>
                            <FaGamepad />
                        </div>
                    </div>
                </div>
                <div className={`${styles.right} ${isFullScreen ? styles.fullScreen : ''}`}>
                    {this.state.roomItems.filter(p => p.order !== this.getMaxOrderItem().order).map(item => {
                        return (<div key={item.id}>{item.content}</div>)
                    })}
                </div>
            </div >
        );
    }
}


export default Room;
