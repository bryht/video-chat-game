import * as React from 'react';
import styles from './GameSketch.module.scss';
import { Line } from './Models/Line';
import { CanvasMessage } from './Models/CanvasMessage';
import { GameData } from './GameData';
import Log from 'utils/Log';

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

    gameData: GameData;
    canvasRef: React.RefObject<HTMLCanvasElement>;
    canvas: HTMLCanvasElement | null;
    canvasContext2d: CanvasRenderingContext2D | null;
    constructor(props: Readonly<ICanvasWatcherProps>) {
        super(props);
        this.gameData = new GameData(this.props.gameId);
        this.gameData.onLineDraw(this.draw.bind(this));
        this.gameData.onCanvasUpdate(this.canvasChanged.bind(this));
        this.gameData.onCanvasClean(this.clean.bind(this));
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
            color: '#FF0000',
        };
    }

    componentDidMount() {
        this.canvas = this.canvasRef.current;
        this.canvasContext2d = this.canvas?.getContext("2d") ?? null;
        this.resizeCanvas();
        this.gameData.initial();
    }

    draw = (line: Line) => {
        if (this.canvasContext2d) {
            this.canvasContext2d.lineCap = "round";
            this.canvasContext2d.lineWidth = 2;
            this.canvasContext2d.strokeStyle = this.state.color;
            this.canvasContext2d.beginPath();
            this.canvasContext2d.moveTo(line.x0 / this.state.scaleWidth - this.state.canvasLeft, line.y0 / this.state.scaleHeight - this.state.canvasTop);
            this.canvasContext2d.lineTo(line.x1 / this.state.scaleWidth - this.state.canvasLeft, line.y1 / this.state.scaleHeight - this.state.canvasTop);
            this.canvasContext2d.stroke();
            this.canvasContext2d.closePath();
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
        this.gameData.dispose();
    }


    public render() {

        return (<div className={styles.watch}>
            <canvas height={this.state.canvasHeight} width={this.state.canvasWidth} ref={this.canvasRef}></canvas>
        </div>)
    }
}
