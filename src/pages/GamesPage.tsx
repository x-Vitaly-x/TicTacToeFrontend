import React from "react";
import Cookies from "js-cookie";
import axios from "axios";
import {PlayerInput} from "../components/PlayerInput";
import {BACKEND_API} from "../App";

export class GamesPage extends React.Component<{
    history: any,
    player: any,
}> {
    state = {
        games: [] // game list
    }

    componentDidMount() {
        this.fetchGames();
    }

    fetchGames() {
        axios.get(BACKEND_API + '/games').then(resp => {
            this.setState({...this.state, games: resp.data});
        });
    }

    createGame() {
        axios.post(BACKEND_API + '/games', {
            game: {
                player_name: this.props.player.player_name
            }
        }).then(resp => {
            console.log(resp);
        });
    }

    joinGame(game: any) {
        if (
            game.x_player_id === this.props.player['id'] ||
            game.y_player_id === this.props.player['id']
        ) {
            // already joined, go to game directly
            this.props.history.push('/games/' + game['id'])
        } else {
            // join as second player
            axios.put(BACKEND_API + '/games/' + game['id'], {
                game: {
                    y_player_id: this.props.player['id']
                }
            }).then(resp => {
                // go to game
                this.props.history.push('/games/' + game['id'])
            });
        }
    }

    render() {
        return (
            <>
                <h4>
                    Welcome {this.props.player.player_name}, here you can create
                    games and sign onto games of other players.
                </h4>
                <div className={'row mt-3'}>
                    {this.state.games.map(game => (
                        <div
                            className={'col-4 mb-2'}
                            key={'game_' + game['id']}
                        >
                            <div
                                className='card'
                            >
                                <div className="card-body">
                                    <h5 className="card-title">
                                        Game {game['id']}&nbsp;
                                        ({game['y_player_id'] ? 2 : 1} / 2)
                                    </h5>
                                    <button
                                        onClick={() => this.joinGame.bind(this)(game)}
                                        disabled={game['status'] !== 'created'}
                                        className="btn btn-primary"
                                    >
                                        Join
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <button
                    onClick={this.createGame.bind(this)}
                    className={'btn btn-primary mt-3'}
                >
                    Create game
                </button>
            </>
        );
    }
}
