import React from "react";
import axios from "axios";

import './GamePage.scss';
import {Game, BACKEND_API} from "../backbone/Game";
import {createConsumer} from "@rails/actioncable";

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
        game: new Game({
            id: this.props.gameId
        })
    }

    consumer: any;

    constructor(props: IGamePageProps) {
        super(props);
    }

    componentDidMount() {
        // get game
        this.state.game.fetch().then((gameData: any) => {
            this.setState({...this.state, game: new Game(gameData)});
        });
        // setup cable
        const URL = 'ws://localhost:3000/cable';
        this.consumer = createConsumer(URL);
        this.consumer.subscriptions.create({
            channel: 'GameUpdatesChannel',
        }, {
            connected: () => console.log('connected'),
            disconnected: () => console.log('disconnected'),
            received: this.handleReceived.bind(this),
        });
    }

    makeMove(x: number, y: number) {
        if (!this.isMyTurn()) {
            return;
        }
        axios.put(`${BACKEND_API}/games/${this.props.gameId}/make_move`, {
            game: {placement: [x, y]}
        })
    }

    handleReceived(gameData: any) {
        console.log('MESSAGE CAUGHT!', gameData);
        this.setState({...this.state, game: new Game(gameData)});
    }

    isMyTurn() {
        const game = this.state.game as any;
        const board = game.attributes.board as IBoard;
        return (
            (board.current_sign === 'X' && game.attributes.x_player_id === this.props.player.id) ||
            (board.current_sign === 'O' && game.attributes.y_player_id === this.props.player.id)
        )
    }

    render() {
        const game = this.state.game as any;
        const board = game.attributes.board as IBoard;
        if (board) {
        } else {
            return (
                <h4>Loading...</h4>
            )
        }
        const currentSign = this.isMyTurn() ? 'your turn' : 'opponents turn';
        return (
            <>
                <div className="game-page">
                    {({
                        created: <h4>Waiting for other player...</h4>,
                        started: <h4>Game started, {currentSign}.</h4>,
                        finished: <h4>Game won!</h4>
                    } as any)[this.state.game.attributes.status]}
                    <h4>
                        Player X:&nbsp;
                        {this.state.game.attributes.player_X ? (
                            this.state.game.attributes.player_X.player_name
                        ) : (
                            <button className={'btn btn-primary'} onClick={() => {
                                this.state.game.save({
                                    x_player_id: this.props.player.id
                                });
                            }}>
                                Join
                            </button>
                        )}
                    </h4>
                    <h4>
                        Player O:&nbsp;
                        {this.state.game.attributes.player_O ? (
                            this.state.game.attributes.player_O.player_name
                        ) : (
                            <button className={'btn btn-primary'} onClick={() => {
                                this.state.game.save({
                                    y_player_id: this.props.player.id
                                });
                            }}>
                                Join
                            </button>
                        )}
                    </h4>
                    {board ? (
                        <div className={'board'}>
                            {board.board_fields.map((boardRow, indexRow) => (
                                <div className={'board-row'} key={'row_' + indexRow}>
                                    {boardRow.map((boardCol, indexCol) => (
                                        <div
                                            onClick={
                                                boardCol === '' ?
                                                    () => this.makeMove.bind(this)(indexCol, indexRow) :
                                                    () => null // can not click on occupied tiles
                                            }
                                            className={'board-col ' + (boardCol === '' ? 'clickable' : '')}
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
            </>
        )
    }

}
