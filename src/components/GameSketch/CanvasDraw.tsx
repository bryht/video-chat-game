import * as React from 'react';
import styles from './GameSketch.module.scss';
import { SocketHelper } from 'utils/SocketHelper';
import { Line } from './Models/Line';
import { CanvasMessage } from './Models/CanvasMessage';

interface ICanvasDrawProps {
    gameId: string;
    uid: string;
}

interface ICanvasDrawStates {
    isPenDown: boolean;
    prevX: number,
    prevY: number,
    color: string
}

export default class CanvasDraw extends React.Component<ICanvasDrawProps, ICanvasDrawStates> {
    socketHelper: SocketHelper;
    canvasRef: React.RefObject<HTMLCanvasElement>;
    canvasLeft: number;
    canvasTop: number;
    canvasWidth: number;
    canvasHeight: number;
    canvas: HTMLCanvasElement | null;
    canvasContext2d: CanvasRenderingContext2D | null;
    constructor(props: Readonly<ICanvasDrawProps>) {
        super(props);
        this.socketHelper = new SocketHelper(this.props.gameId);
        this.canvasRef = React.createRef<HTMLCanvasElement>();
        this.canvas = null;
        this.canvasContext2d = null;
        this.canvasLeft = 0;
        this.canvasTop = 0;
        this.canvasWidth = 0;
        this.canvasHeight = 0;
        this.state = {
            isPenDown: false,
            prevX: 0,
            prevY: 0,
            color: "#FF0000"
        };
    }

    componentDidMount() {
        this.canvas = this.canvasRef.current;
        this.canvasContext2d = this.canvas?.getContext("2d") ?? null;
        this.resizeCanvas();
    }

    resizeCanvas = () => {
        if (this.canvas) {
            const bounding = this.canvas.getBoundingClientRect();
            this.canvasLeft = bounding.left;
            this.canvasTop = bounding.top;
            this.canvasWidth = bounding.width;
            this.canvasHeight = bounding.height;
            this.canvas.width = this.canvasWidth;
            this.canvas.height = this.canvasHeight;
            this.socketHelper.emit("canvas", new CanvasMessage(this.canvasWidth, this.canvasHeight,this.state.color));
        }
    }

    draw = (line: Line) => {

        if (this.canvasContext2d) {

            this.canvasContext2d.lineCap = "round";
            this.canvasContext2d.lineWidth = 2;
            this.canvasContext2d.strokeStyle = this.state.color;
            this.canvasContext2d.beginPath();
            this.canvasContext2d.moveTo(line.x0 - this.canvasLeft, line.y0 - this.canvasTop);
            this.canvasContext2d.lineTo(line.x1 - this.canvasLeft, line.y1 - this.canvasTop);
            this.canvasContext2d.stroke();
            this.canvasContext2d.closePath();
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

    clean = () => {
        this.canvasContext2d?.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        this.socketHelper.emit("canvasClean",{});
    }

    public render() {

        return <div className={styles.main}>
            <div>
                <button onClick={this.clean} >Clean</button>
            </div>
            <canvas ref={this.canvasRef}

                onMouseMove={this.handleDisplayMouseMove}
                onMouseDown={this.handleDisplayMouseDown}
                onMouseUp={this.handleDisplayMouseUp}>
            </canvas>
        </div>
    }
}
