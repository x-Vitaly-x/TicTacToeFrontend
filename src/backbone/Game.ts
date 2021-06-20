import Backbone from 'backbone';

export const BACKEND_API = 'http://localhost:3000'

export const Game = Backbone.Model.extend({
    urlRoot: 'http://localhost:3000/games',
});

export const GamesCollection = Backbone.Collection.extend({
    model: Game,
    url: 'http://localhost:3000/games'
});
