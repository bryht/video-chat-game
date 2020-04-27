import * as React from 'react';
import styles from './GameSketch.module.scss';
import Log from 'utils/Log';
import io from "socket.io-client";
import Guid from 'utils/Guid';

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
    socket: SocketIOClient.Socket | null;
    constructor(props: Readonly<IGameSketchProps>) {
        super(props);
        this.canvasRef = React.createRef<HTMLCanvasElement>();
        this.canvasLeft = 0;
        this.canvasTop = 0;
        this.state = {
            isPenDown: false,
            prevX: 0,
            prevY: 0
        }
        this.socket = null;
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

        
        this.socket = io('/socket');
        this.socket.on("line", (data: any) => {
            
            Log.Info(data);
        });
        this.socket.emit('join',{'room':'a'});


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
            // Log.Warning(this.state);
        }
        this.setState({
            prevX: e.clientX,
            prevY: e.clientY,
        });

        if (this.socket) {
            this.socket.emit("line", { 'room': 'a', 'clientX': e.clientX });
        }
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
