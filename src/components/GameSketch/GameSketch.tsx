import * as React from 'react';
import styles from './GameSketch.module.scss';
import Log from 'utils/Log';
interface IGameSketchProps {
}

interface IGameSketchStates {
    isPenDown: boolean;
    prevX: number,
    prevY: number,
    mouseX: number;
    mouseY: number;
}

export default class GameSketch extends React.Component<IGameSketchProps, IGameSketchStates> {
    canvas: React.RefObject<HTMLCanvasElement>;
    constructor(props: Readonly<IGameSketchProps>) {
        super(props);
        this.canvas = React.createRef<HTMLCanvasElement>();
        this.state = {
            isPenDown: false,
            prevX: 0,
            prevY: 0,
            mouseX: 0,
            mouseY: 0
        }
    }

    componentDidMount() {
        let canvas = this.canvas.current;
        if (canvas) {
            const bounding = canvas.getBoundingClientRect();
            canvas.width = bounding.width;
            canvas.height = bounding.height;
        }
    }

    handleDisplayMouseMove = (e: { clientX: any; clientY: any; }) => {

        let canvas = this.canvas.current;
        let context2d = canvas?.getContext("2d");

        if (this.state.isPenDown && canvas && context2d) {

            context2d.lineCap = "round";
            const { left, top } = canvas.getBoundingClientRect();
            context2d.lineWidth = 2;
            context2d.strokeStyle = "#FF0000";
            context2d.beginPath();
            context2d.moveTo(this.state.prevX - left, this.state.prevY - top);
            context2d.lineTo(e.clientX - left, e.clientY - top);
            context2d.stroke();
            context2d.closePath();
        }
        this.setState({
            prevX: e.clientX,
            prevY: e.clientY,
        });

        Log.Info(this.state);
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
                <canvas ref={this.canvas} width={913} height={713}
                    onMouseMove={this.handleDisplayMouseMove}
                    onMouseDown={this.handleDisplayMouseDown}
                    onMouseUp={this.handleDisplayMouseUp}>
                </canvas>
            </div>
        );
    }
}
