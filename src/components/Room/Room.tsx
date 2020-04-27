import * as React from 'react';
import styles from './Room.module.scss';
import { GoScreenFull, GoScreenNormal } from "react-icons/go";
import RoomItem from 'components/RoomItem/RoomItem';


export interface IRoomProps {
    roomName: string;
    roomPassword: string | null;
    uid: string;
    leaveRoom: () => void;
}
export interface IRoomStates {
    isFullScreen: boolean;
    roomItems: Array<RoomItem>;

}
class Room extends React.Component<IRoomProps, IRoomStates> {


    constructor(props: Readonly<IRoomProps>) {
        super(props);

        this.state = {
            isFullScreen: true,
            roomItems: []
        }
    }


    async componentDidMount() {

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
        const { isFullScreen } = this.state;
        return (
            <div className={styles.main}>
                <div className={styles.left}>
                    <div className={styles.center}>

                    </div>
                    <div className={`${styles.bottom} ${isFullScreen ? styles.fullScreen : ''}`}>

                    </div>
                </div>
                <div className={`${styles.right} ${isFullScreen ? styles.fullScreen : ''}`}>

                </div>
            </div >
        );
    }
}


export default Room;
