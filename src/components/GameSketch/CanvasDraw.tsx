import * as React from 'react';
import styles from './GameSketch.module.scss';
import { SocketHelper, Message } from 'utils/SocketHelper';
import { Line } from './Models/Line';
import { Canvas } from './Models/Canvas';

interface ICanvasDrawProps {
    roomId: string;
    uid: string;
}

interface ICanvasDrawStates {
    isPenDown: boolean;
    prevX: number,
    prevY: number,
}

export default class CanvasDraw extends React.Component<ICanvasDrawProps, ICanvasDrawStates> {
    canvasRef: React.RefObject<HTMLCanvasElement>;
    canvasLeft: number;
    canvasTop: number;
    socketHelper: SocketHelper;
    constructor(props: Readonly<ICanvasDrawProps>) {
        super(props);
        this.socketHelper = new SocketHelper(this.props.roomId);
        this.socketHelper.onMessageChanged(this.messageChanged.bind(this));
        this.canvasRef = React.createRef<HTMLCanvasElement>();
        this.canvasLeft = 0;
        this.canvasTop = 0;
        this.state = {
            isPenDown: false,
            prevX: 0,
            prevY: 0,
        };
    }

    componentDidMount() {
        let canvas = this.canvasRef.current;
        if (canvas) {
            const bounding = canvas.getBoundingClientRect();
            canvas.width = bounding.width;
            canvas.height = bounding.height;
            this.canvasLeft = bounding.left;
            this.canvasTop = bounding.top;
            var data = new Canvas();
            data.height = canvas.height;
            data.width = canvas.width;
            this.socketHelper.emit("canvas", data);
        }

    }

    draw(line: Line) {
        let canvas = this.canvasRef.current;
        let context2d = canvas?.getContext("2d");
        if (canvas && context2d) {

            context2d.lineCap = "round";
            context2d.lineWidth = 2;
            context2d.strokeStyle = "#FF0000";
            context2d.beginPath();
            context2d.moveTo(line.x0 - this.canvasLeft, line.y0 - this.canvasTop);
            context2d.lineTo(line.x1 - this.canvasLeft, line.y1 - this.canvasTop);
            context2d.stroke();
            context2d.closePath();
        }
    }

    messageChanged(message: Message) {
        switch (message.type) {
            case "line":
                this.draw(message.data as Line);
                break;
            case "canvas":
                break;

        }
    }

    componentWillUnmount() {
        this.socketHelper.dispose();
    }

    handleDisplayMouseMove = (e: { clientX: any; clientY: any; }) => {


        var line = new Line(this.state.prevX, this.state.prevY, e.clientX, e.clientY);
        if (line.distance() < 5) {
            return;
        }
        if (this.state.isPenDown) {

            this.draw(line);
            this.socketHelper.emit("line", line);
        }
        this.setState({
            prevX: e.clientX,
            prevY: e.clientY,
        });

    }



    handleDisplayMouseDown = (e: { clientX: any; clientY: any; }) => {
        this.setState({ isPenDown: true });
    }
    handleDisplayMouseUp = () => {
        this.setState({ isPenDown: false });
    }

    public render() {

        return <div className={styles.main}>
            <canvas ref={this.canvasRef}
                onMouseMove={this.handleDisplayMouseMove}
                onMouseDown={this.handleDisplayMouseDown}
                onMouseUp={this.handleDisplayMouseUp}>
            </canvas>
        </div>
    }
}
