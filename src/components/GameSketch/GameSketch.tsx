import * as React from 'react';
import styles from './GameSketch.module.scss';
import Log from 'utils/Log';
import Guid from 'utils/Guid';
import { SocketHelper } from 'utils/SocketHelper';
import { Line } from './Line';

interface IGameSketchProps {
    room: string;
}

interface IGameSketchStates {
    isPenDown: boolean;
    isDrawingMode: boolean;
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
        this.socketHelper = new SocketHelper(this.messageChanged.bind(this));
        this.canvasRef = React.createRef<HTMLCanvasElement>();
        this.canvasLeft = 0;
        this.canvasTop = 0;
        this.state = {
            isPenDown: false,
            isDrawingMode: true,
            prevX: 0,
            prevY: 0,
        };
    }

    componentDidMount() {
        this.socketHelper.joinRoom(this.props.room);

        let canvas = this.canvasRef.current;
        if (canvas) {
            const bounding = canvas.getBoundingClientRect();
            canvas.width = bounding.width;
            canvas.height = bounding.height;
            this.canvasLeft = bounding.left;
            this.canvasTop = bounding.top;
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

    messageChanged(data: any) {
        Log.Info(data);
        this.draw(data as Line);
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
            this.socketHelper.emit(line);
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
