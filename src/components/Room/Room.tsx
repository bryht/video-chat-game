import * as React from 'react';
import styles from './Room.module.scss';
import RoomItem from 'components/RoomItem/RoomItem';
import { IRoomItem } from 'components/Models/IRoomItem';
import { RoomGameItem } from 'components/Models/RoomGameItem';
import { RoomVideoItem } from 'components/Models/RoomVideoItem';
import { FaVideo, FaVideoSlash, FaVolumeUp, FaVolumeMute, FaStop, FaArrowUp, FaGamepad } from 'react-icons/fa';


export interface IRoomProps {
    roomName: string;
    roomPassword: string | null;
    uid: string;
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
            roomItems: [new RoomGameItem(), new RoomVideoItem(), new RoomVideoItem(),new RoomGameItem(),new RoomGameItem(),new RoomGameItem()]
        })
    }

    switchToCenter = (streamId: string) => {

    }




    componentWillUnmount() {

    }

    switchVideo = () => {

    }

    leaveRoom = () => {
        this.props.leaveRoom();
    }

    switchAudio = () => {

    }

    switchFullScreen = () => {
        this.setState({ isFullScreen: !this.state.isFullScreen })
    }


    public render() {
        const { isFullScreen, isAudioOn, isVideoOn } = this.state;
        return (
            <div className={styles.main}>
                <div className={styles.left}>
                    <div className={styles.center}>

                    </div>
                    <div className={`${styles.bottom} ${isFullScreen ? styles.fullScreen : ''}`}>
                        <div className={isVideoOn ? "" : styles.mute} onClick={() => this.switchVideo()}>
                            {isVideoOn ? <FaVideo></FaVideo> : <FaVideoSlash></FaVideoSlash>}
                        </div>
                        <div className={isAudioOn ? "" : styles.mute} onClick={() => this.switchAudio()}>
                            {isAudioOn ? <FaVolumeUp></FaVolumeUp> : <FaVolumeMute></FaVolumeMute>}
                        </div>
                        <div className={styles.stop} onClick={() => { }}>
                            <FaStop></FaStop>
                        </div>
                        <div className={styles.game} onClick={() => { }}>
                            <FaGamepad/>
                        </div>
                    </div>
                </div>
                <div className={`${styles.right} ${isFullScreen ? styles.fullScreen : ''}`}>
                    {this.state.roomItems.map(item => {
                        return (<div key={item.id}></div>)
                    })}
                </div>
            </div >
        );
    }
}


export default Room;
