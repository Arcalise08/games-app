// src/actions/actions.js

export const SET_GAMES = 'SET_GAMES';
export const SET_STUDIOS = 'SET_STUDIOS';
export const SET_GENRES = 'SET_GENRES';
export const SET_USER = 'SET_USER';
export const SET_PAGE = 'SET_PAGE';
export const SET_FILTER = 'SET_FILTER';
export const SET_VISIBLE = 'SET_VISIBLE';

export function setGames(value) {
    return { type: SET_GAMES, value };
}
export function setStudios(value) {
    return { type: SET_STUDIOS, value };
}
export function setVisible(value) {
    return { type: SET_VISIBLE, value };
}
export function setPage(value) {
    return { type: SET_PAGE, value };
}
export function setGenres(value) {
    return { type: SET_GENRES, value };
}
export function setUser(value) {
    return { type: SET_USER, value };
}
export function setFilter(value) {
    return { type: SET_FILTER, value };
}

