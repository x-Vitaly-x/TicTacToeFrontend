import React from "react";
import axios from "axios";
import {createConsumer} from '@rails/actioncable';
import {GamesCollection, Game, BACKEND_API} from "../backbone/Game";

export class GamesPage extends React.Component<{
    history: any,
    player: any,
}> {
    state = {
        games: new GamesCollection()
    }

    consumer: any;

    componentDidMount() {
        this.fetchGames();
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

    componentWillUnmount() {
        this.consumer.disconnect()
    };

    fetchGames() {
        this.state.games.fetch().then(() => {
            this.setState({
                games: new GamesCollection(this.state.games.models)
            });
        });
    }

    createGame() {
        axios.post(BACKEND_API + '/games', {
            game: {
                player_name: this.props.player.player_name
            }
        });
        // no need for then handler, actioncable updates will happen anyway
    }

    // go to game
    openGame(game: any) {
        this.props.history.push('/games/' + game['id'])
    }

    // either find old game data and update it or add new entry to game list
    handleReceived(data: any) {
        console.log('RECEIVED', data);
        this.state.games.remove(data.id);
        this.state.games.add(data);
        this.setState({
            games: new GamesCollection(this.state.games.models)
        });
    }

    render() {
        return (
            <>
                <h4>
                    Welcome {this.props.player.player_name}, here you can create
                    games and sign onto games of other players.
                </h4>
                <div className={'row mt-3'}>
                    {this.state.games.models.map((game: typeof Game) => (
                        <div
                            className={'col-4 mb-2'}
                            key={'game_' + game.attributes.id}
                        >
                            <div
                                className='card'
                            >
                                <div className="card-body">
                                    <h5 className="card-title">
                                        Game {game.attributes.id}&nbsp;
                                        ({game.attributes.y_player_id ? 2 : 1} / 2)
                                    </h5>
                                    <button
                                        onClick={() => this.openGame.bind(this)(game)}
                                        className="btn btn-primary"
                                    >
                                        Go
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
