import React from 'react';
import './App.scss';
import {createBrowserHistory} from 'history';
import {
    Router,
    Route,
} from 'react-router-dom';
import {GamesPage} from "./pages/GamesPage";
import {GamePage} from "./pages/GamePage";
import Cookies from "js-cookie";
import axios from "axios";
import {PlayerInput} from "./components/PlayerInput";
import {BACKEND_API} from "./backbone/Game";

export const history = createBrowserHistory();

export class App extends React.Component {
    state = {
        playerName: Cookies.get('player-name'), // inputted name, acts as authentication key
        player: {}, // self
    }

    componentDidMount() {
        if (this.state.playerName) {
            this.fetchPlayer();
        }
    }

    fetchPlayer() {
        axios.get(BACKEND_API + '/self?player_name=' + this.state.playerName).then(resp => {
            this.setState({...this.state, player: resp.data});
        });
    }

    inputPlayer(playerName: string) {
        console.log('player', playerName);
        axios.post(BACKEND_API + '/players', {
            player_name: playerName
        }).then(resp => {
            const playerName = resp.data.player_name;
            Cookies.set('player-name', playerName);
            this.setState({...this.state, playerName});
        }).catch(err => {
            console.log('err', err);
        });
    }

    render() {
        return (
            <div className={'container mt-5'}>
                {(Cookies.get('player-name') == null) ? (
                    <PlayerInput inputCallback={playerName => {
                        this.inputPlayer.bind(this)(playerName)
                    }}/>
                ) : null}
                <Router history={history}>
                    <Route
                        exact path='/games/:id'
                        render={props => (
                            <GamePage
                                gameId={props.match.params.id}
                                player={this.state.player}
                                history={history}/>
                        )}/>
                    <Route exact path='/'>
                        <GamesPage
                            player={this.state.player}
                            history={history}
                        />
                    </Route>
                </Router>
            </div>
        );
    }
}
