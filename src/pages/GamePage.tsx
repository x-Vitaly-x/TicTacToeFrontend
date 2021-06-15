import React from "react";
import axios from "axios";
import ActionCable from 'actioncable';
import {BACKEND_API} from "../App";
import './GamePage.scss';

export interface IBoard {
    current_sign: string;
    board_fields: [][];
}

export interface IGamePageProps {
    history: any
    gameId: string,
    player: any;
}

export class GamePage extends React.Component<IGamePageProps> {
    state = {
        game: {
            status: '',
        }
    }

    cable: any;
    subscription: any;

    constructor(props: IGamePageProps) {
        super(props);
        this.cable = ActionCable.createConsumer('ws://localhost:3000/cable');
        this.subscription = this.cable.subscriptions.create('test_channel', {
            received: (data: any) => {
                console.log("MESSAGE", data);
            }
        });
    }

    componentDidMount() {
        // get game
        axios.get(BACKEND_API + '/games/' + this.props.gameId).then(resp => {
            this.setState({...this.state, game: resp.data});
        });
    }

    makeMove(x: number, y: number) {

    }

    handleReceived(message: any) {
        console.log('xXXX', message);
    }

    render() {
        console.log('xxxx', this.subscription);
        const board = (this.state.game as any)['board'] as IBoard;
        return (
            <div className="game-page">
                <button onClick={() => {
                    axios.get(BACKEND_API + '/test');
                }}>
                    test
                </button>
                {{
                    created: <h4>Waiting for other player...</h4>,
                    started: <h4>Game started</h4>
                }[this.state.game.status]}
                {board ? (
                    <div className={'board'}>
                        {board.board_fields.map((boardRow, indexRow) => (
                            <div className={'board-row'} key={'row_' + indexRow}>
                                {boardRow.map((boardCol, indexCol) => (
                                    <div
                                        onClick={
                                            boardCol === null ?
                                                () => this.makeMove.bind(this)(indexCol, indexRow) :
                                                () => null // can not click on occupied tiles
                                        }
                                        className={'board-col ' + (boardCol === null ? 'clickable' : '')}
                                        key={'col_' + indexRow + '_' + indexCol}
                                    >
                                        {boardCol}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                ) : null}
            </div>
        )
    }

}
