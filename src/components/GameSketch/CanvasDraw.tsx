import * as React from 'react';
import styles from './GameSketch.module.scss';
import { Line } from './Models/Line';
import { CanvasMessage } from './Models/CanvasMessage';
import { GameData } from './GameData';
import { GameUserState } from './Models/GameUserState';
import { GameUser } from './Models/GameUser';

interface ICanvasDrawProps {
    gameId: string;
    uid: string;
}

interface ICanvasDrawStates {
    gameUsers: Array<GameUser>;
    isPenDown: boolean;
    prevX: number,
    prevY: number,
    color: string,
}

export default class CanvasDraw extends React.Component<ICanvasDrawProps, ICanvasDrawStates> {
    gameData: GameData;
    canvasRef: React.RefObject<HTMLCanvasElement>;
    canvasLeft: number;
    canvasTop: number;
    canvasWidth: number;
    canvasHeight: number;
    canvas: HTMLCanvasElement | null;
    canvasContext2d: CanvasRenderingContext2D | null;
    constructor(props: Readonly<ICanvasDrawProps>) {
        super(props);
        this.gameData = new GameData(this.props.gameId);
        this.gameData.onGameLines(lines => {
            lines.forEach(element => {
                this.draw(element);
            });
        });
        this.gameData.onGameRoomUsersChanged(gameUsers=>this.setState({gameUsers}));
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
            color: "#FF0000",
            gameUsers:this.gameData.gameUsers
        };
    }

    componentDidMount() {
        this.gameData.initial();
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
            this.gameData.updateCanvas(new CanvasMessage(this.canvasWidth, this.canvasHeight, this.state.color));
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
        this.gameData.dispose();
    }

    handleDisplayMouseMove = (clientX: number, clientY: number) => {

        var line = new Line(this.state.prevX, this.state.prevY, clientX, clientY);
        if (line.distance() < 5) {
            return;
        }
        if (this.state.isPenDown) {

            this.draw(line);
            this.gameData.drawLine(line);
            this.setState({
                prevX: clientX,
                prevY: clientY,
            });
        }

    }



    handleDisplayMouseDown = (clientX: number, clientY: number) => {
        this.setState({
            prevX: clientX,
            prevY: clientY,
        });
        this.setState({ isPenDown: true });
    }
    handleDisplayMouseUp = () => {
        this.setState({ isPenDown: false });
    }

    clean = () => {
        this.canvasContext2d?.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        this.gameData.cleanCanvas();
    }

    private getCurrentGameUser = () => {
        return this.state.gameUsers.find(p => p.uid === this.props.uid);
      }
    
     
      selectWinner = () => {
        var currentGameUser = this.getCurrentGameUser();
        if (currentGameUser) {
          currentGameUser.userState = GameUserState.selectWinner;
          this.gameData.updateGameUser(currentGameUser);
        }
      }

    public render() {

        return <div className={styles.main}>
            <div className={styles.control}>
            <button onClick={this.selectWinner}>Select Winner for word {this.getCurrentGameUser()?.wordChosen}</button>
                <button onClick={this.clean} >Clean</button>
            </div>
            <canvas ref={this.canvasRef}
                onMouseDown={e => this.handleDisplayMouseDown(e.clientX, e.clientY)}
                onMouseMove={e => {this.handleDisplayMouseMove(e.clientX, e.clientY);e.preventDefault();}}
                onMouseUp={this.handleDisplayMouseUp}
                onTouchStart={e => this.handleDisplayMouseDown(e.touches[0].clientX, e.touches[0].clientY)}
                onTouchMove={e => this.handleDisplayMouseMove(e.touches[0].clientX, e.touches[0].clientY)}
                onTouchEnd={this.handleDisplayMouseUp}>
            </canvas>
        </div>
    }
}
