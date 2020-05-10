import * as React from 'react';
import styles from './GameSketch.module.scss';
import { SocketHelper } from 'utils/SocketHelper';
import { Line } from './Models/Line';
import { Canvas } from './Models/Canvas';

interface ICanvasWatcherProps {
    roomId: string;
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
}

export default class CanvasWatcher extends React.Component<ICanvasWatcherProps, ICanvasWatcherStates> {
    canvasRef: React.RefObject<HTMLCanvasElement>;

    socketHelper: SocketHelper;
    constructor(props: Readonly<ICanvasWatcherProps>) {
        super(props);
        this.socketHelper = new SocketHelper(this.props.roomId);
        this.socketHelper.onEventChanged('line',this.draw.bind(this));
        this.socketHelper.onEventChanged('canvas',this.resizeCanvas.bind(this));
        this.canvasRef = React.createRef<HTMLCanvasElement>();
        this.state = {
            prevX: 0,
            prevY: 0,
            canvasLeft: 0,
            canvasTop: 0,
            canvasWidth: 0,
            canvasHeight: 0,
            scaleWidth: 0,
            scaleHeight: 0
        };
    }

    componentDidMount() {
        let canvas = this.canvasRef.current;
        if (canvas) {
            const bounding = canvas.getBoundingClientRect();
            this.setState({
                canvasWidth: bounding.width,
                canvasHeight: bounding.height,
                canvasLeft: bounding.left,
                canvasTop: bounding.top,
            })
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
            context2d.moveTo(line.x0 / this.state.scaleWidth - this.state.canvasLeft, line.y0 / this.state.scaleHeight - this.state.canvasTop);
            context2d.lineTo(line.x1 / this.state.scaleWidth - this.state.canvasLeft, line.y1 / this.state.scaleHeight - this.state.canvasTop);
            context2d.stroke();
            context2d.closePath();
        }
    }

    resizeCanvas(data: Canvas) {

        this.setState({
            scaleHeight: data.height / this.state.canvasHeight,
            scaleWidth: data.width / this.state.canvasWidth
        })

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
