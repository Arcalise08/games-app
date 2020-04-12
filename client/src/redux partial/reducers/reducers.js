//src/reducers/reducers.js
import { combineReducers } from 'redux';

import {SET_FILTER, SET_GAMES, SET_STUDIOS, SET_GENRES, SET_USER, SET_PAGE, SET_VISIBLE} from '../actions/actions';

function visibilityFilter(state = '', action) {
    switch (action.type) {
        case SET_FILTER:
            return action.value
        
        default:
            return state;
    }
}
function visible(state = false, action) {
    switch (action.type) {
        case SET_VISIBLE:
            return action.value
        
        default:
            return state;
    }
}

function games(state = [], action) {
    switch (action.type) {
        case SET_GAMES:
            return action.value;
        default:
            return state;
    }
}

function studios(state = [], action) {
    switch (action.type) {
        case SET_STUDIOS:
            return action.value;
        default:
            return state;
    }
}

function genres(state = [], action) {
    switch (action.type) {
        case SET_GENRES:
            return action.value;
        default:
            return state;
    }
}

function page(state = '/games', action) {
    switch (action.type) {
        case SET_PAGE:
            return action.value;
        default:
            return state;
    }
}

function user(state = {}, action) {
    switch (action.type) {
        case SET_USER:
            return action.value;
        default:
            return state;
    }
}

const gamesApp = combineReducers({
    visibilityFilter,
    games,
    studios,
    genres,
    user,
    page,
    visible
});
export default gamesApp;