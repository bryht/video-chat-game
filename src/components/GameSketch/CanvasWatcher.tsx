import * as React from 'react';
import styles from './GameSketch.module.scss';
import { SocketHelper } from 'utils/SocketHelper';
import { Line } from './Models/Line';
import { CanvasMessage } from './Models/CanvasMessage';

interface ICanvasWatcherProps {
    gameId: string;
    uid: string;
}

interface ICanvasWatcherStates {

    prevX: number,
    prevY: number,
    canvasLeft: number;
    canvasTop: number;
    canvasWidth: number;
    canvasHeight: number;
    scaleWidth: number;
    scaleHeight: number;
    color: string;
}

export default class CanvasWatcher extends React.Component<ICanvasWatcherProps, ICanvasWatcherStates> {

    socketHelper: SocketHelper;
    canvasRef: React.RefObject<HTMLCanvasElement>;
    canvas: HTMLCanvasElement | null;
    canvasContext2d: CanvasRenderingContext2D | null;
    constructor(props: Readonly<ICanvasWatcherProps>) {
        super(props);
        this.socketHelper = new SocketHelper(this.props.gameId);
        this.socketHelper.onEventChanged('line', this.draw.bind(this));
        this.socketHelper.onEventChanged('canvas', this.canvasChanged.bind(this));
        this.socketHelper.onEventChanged('canvasClean',this.clean.bind(this));
        this.canvasRef = React.createRef<HTMLCanvasElement>();
        this.canvas = null;
        this.canvasContext2d = null;
        this.state = {
            prevX: 0,
            prevY: 0,
            canvasLeft: 0,
            canvasTop: 0,
            canvasWidth: 0,
            canvasHeight: 0,
            scaleWidth: 0,
            scaleHeight: 0,
            color: '#FF0000'
        };
    }

    componentDidMount() {
        this.canvas = this.canvasRef.current;
        this.canvasContext2d = this.canvas?.getContext("2d") ?? null;
        this.resizeCanvas();
    }

    draw = (line: Line) => {
        let canvas = this.canvasRef.current;
        let context2d = canvas?.getContext("2d");
        if (canvas && context2d) {

            context2d.lineCap = "round";
            context2d.lineWidth = 2;
            context2d.strokeStyle = this.state.color;
            context2d.beginPath();
            context2d.moveTo(line.x0 / this.state.scaleWidth - this.state.canvasLeft, line.y0 / this.state.scaleHeight - this.state.canvasTop);
            context2d.lineTo(line.x1 / this.state.scaleWidth - this.state.canvasLeft, line.y1 / this.state.scaleHeight - this.state.canvasTop);
            context2d.stroke();
            context2d.closePath();
        }
    }

    private resizeCanvas() {
        if (this.canvas) {
            const bounding = this.canvas.getBoundingClientRect();
            this.setState({
                canvasWidth: bounding.width,
                canvasHeight: bounding.height,
                canvasLeft: bounding.left,
                canvasTop: bounding.top,
            });
        }
    }

    canvasChanged(data: CanvasMessage) {

        this.setState({
            scaleHeight: data.height / this.state.canvasHeight,
            scaleWidth: data.width / this.state.canvasWidth,
            color: data.color
        });
    }

    clean = () => {
        this.canvasContext2d?.clearRect(0, 0, this.state.canvasWidth, this.state.canvasHeight);
    }

    componentWillUnmount() {
        this.socketHelper.dispose();
    }


    public render() {

        return (<div className={styles.watch}>
            <canvas height={this.state.canvasHeight} width={this.state.canvasWidth} ref={this.canvasRef}></canvas>
        </div>)
    }
}
