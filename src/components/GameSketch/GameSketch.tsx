import * as React from 'react';
import styles from './GameSketch.module.scss';
import Log from 'utils/Log';
import Guid from 'utils/Guid';
import { SocketHelper } from 'utils/SocketHelper';

interface IGameSketchProps {
}

interface IGameSketchStates {
    isPenDown: boolean;
    prevX: number,
    prevY: number,
}

export default class GameSketch extends React.Component<IGameSketchProps, IGameSketchStates> {
    canvasRef: React.RefObject<HTMLCanvasElement>;
    canvasLeft: number;
    canvasTop: number;
    socketHelper: SocketHelper;
    constructor(props: Readonly<IGameSketchProps>) {
        super(props);
        this.canvasRef = React.createRef<HTMLCanvasElement>();
        this.canvasLeft = 0;
        this.canvasTop = 0;
        this.state = {
            isPenDown: false,
            prevX: 0,
            prevY: 0
        };
        this.socketHelper = new SocketHelper(this.messageChanged);
    }

    componentDidMount() {
        let canvas = this.canvasRef.current;
        if (canvas) {
            const bounding = canvas.getBoundingClientRect();
            canvas.width = bounding.width;
            canvas.height = bounding.height;
            this.canvasLeft = bounding.left;
            this.canvasTop = bounding.top;
        }


        this.socketHelper.joinRoom("a");

    }

    messageChanged(data: any) {
        Log.Info(data);
    }

    componentWillUnmount() {
        this.socketHelper.dispose();
    }

    handleDisplayMouseMove = (e: { clientX: any; clientY: any; }) => {

        let canvas = this.canvasRef.current;
        let context2d = canvas?.getContext("2d");

        if (Math.abs(this.state.prevX - e.clientX) < 10 && Math.abs(this.state.prevY - e.clientY) < 10) {
            return;
        }
        if (this.state.isPenDown && canvas && context2d) {

            context2d.lineCap = "round";
            context2d.lineWidth = 2;
            context2d.strokeStyle = "#FF0000";
            context2d.beginPath();
            context2d.moveTo(this.state.prevX - this.canvasLeft, this.state.prevY - this.canvasTop);
            context2d.lineTo(e.clientX - this.canvasLeft, e.clientY - this.canvasTop);
            context2d.stroke();
            context2d.closePath();
        }
        this.setState({
            prevX: e.clientX,
            prevY: e.clientY,
        });


        this.socketHelper.emit({ 'clientX': e.clientX, 'clientY': e.clientY });

        // this.socket.emit("cursor", {
        //   room: this.props.value,
        //   x: this.state.mouseX,
        //   y: this.state.mouseY,
        //   sessionKey: window.localStorage.getItem("sessionKey")
        // });
    }
    handleDisplayMouseDown = (e: { clientX: any; clientY: any; }) => {
        this.setState({ isPenDown: true });
    }
    handleDisplayMouseUp = () => {
        this.setState({ isPenDown: false });
    }

    public render() {
        return (
            <div className={styles.main}>
                <canvas ref={this.canvasRef}
                    onMouseMove={this.handleDisplayMouseMove}
                    onMouseDown={this.handleDisplayMouseDown}
                    onMouseUp={this.handleDisplayMouseUp}>
                </canvas>
            </div>
        );
    }
}
