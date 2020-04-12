import React from 'react';
import axios from 'axios';

import { BrowserRouter as Router, Route} from 'react-router-dom';

import { LoginView } from '../login-view/login-view';
import { GameCard } from '../game-card/game-card';
import { GameView } from '../game-view/game-view';
import { NavigationBar } from '../NavBar/navbar';
import { RegisterView } from '../registration-view/registration';
import { UserView } from '../user-view/user-view';


export class MainViewer extends React.Component {
    constructor() {
        super();
        this.state = {
            games: [],
            studios: [],
            genres: [],
            selectedGame: null,
            user: null,
        };
    }

    componentDidMount() {

        axios.get('https://opgamesapi.herokuapp.com/studios')
        .then(response => {
            console.log(response.data)
            this.setState({
                studios: response.data
            });
        })
        .catch(function (error) {
            console.log(error)
        })
        axios.get('https://opgamesapi.herokuapp.com/genres')
        .then(response => {
            console.log(response.data)
            this.setState({
                genres: response.data
            });
        })
        .catch(function (error) {
            console.log(error)
        })

        let accessToken = localStorage.getItem('token');
        if (accessToken !== null) {
            this.setState({
                user: localStorage.getItem('user')
            });
            this.getGames(accessToken);
        }
        
        

    }

    getUserInfo(token) {
        axios.get('https://opgamesapi.herokuapp.com/users/info', {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(response => {
            this.setState({
                userInfo: response.data
            });
            
        })
        .catch(function (err) {
            console.log(err);
        })
    }
    
    getGames(token) {
        axios.get('https://opgamesapi.herokuapp.com/games', {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(response => {
            this.setState({
                games: response.data
            });
            
        })
        .catch(function (err) {
            console.log(err);
        })
        this.getUserInfo(token)
    }

    onGameClick(game) {
        this.setState({
            selectedGame: game
        });
    }

    onLoggedIn(authData) {
        console.log(authData)
        this.setState({
            user: authData.user.Username
        });
        
        localStorage.setItem('token', authData.token);
        localStorage.setItem('user', authData.user.Username);
        this.getGames(authData.token)
        
    }

    onRegister(user) {
            console.log('User ' + user + ' created')
            this.setState({
                register: false
            });
    }

    onLogout() {
        this.setState({
            user: null,
            games: null,
            genres: null,
            studios: null,
        })
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }

    render() {
        const { games, user, register, userInfo} = this.state;
        

        if (!games) return <div className='main-viewer'>
                <NavigationBar user={this.state.user}  onClick={(select) => this.navSelector(select)}></NavigationBar>
                <div className='row'>
                    <div className='main-viewer row mx-auto'>
                        {register ? <RegisterView onRegister={user => this.onRegister(user)}></RegisterView> :
                            <LoginView onLoggedIn={user => this.onLoggedIn(user)}/> 
                        }
                    </div>
                </div>
            </div>

        if (!user) return (
            <div>
                <NavigationBar user={this.state.user}  onClick={(select) => this.navSelector(select)}></NavigationBar>
                <div className='row'>
                <Router>
                    <div className='main-viewer row mx-auto'>
                    <Route exact path="/" render={() => {
                        if (!user) return <LoginView onLoggedIn={user => this.onLoggedIn(user)} />;
                        return movies.map(m => <GameCard key={game._id} game={game}/>)}}/>
                    <Route exact path="/register" render={() => <RegisterView />} />
                    <Route exact path="/login" render={() => <LoginView onLoggedIn={user => this.onLoggedIn(user)} />} />
                    </div>
                </Router>
                </div>
            </div>
        )
        return ( 
            <div>
                <NavigationBar user={this.state.user} onClick={() => this.onLogout()}></NavigationBar>
                <div className='row'>
                    <Router>
                        <div className='main-viewer row mx-auto'>
                            <Route exact path="/" render={() => games.map(game => 
                                <GameCard key={game._id} game={game}/>)}/>
                            <Route exact path="/games" render={() => games.map(game => 
                                <GameCard key={game._id} game={game}/>)}/>
                            <Route path="/games/:gameID" render={({match}) =>  
                                <GameView game={games.find(m => m._id === match.params.gameID)} onClick={() => this.onGameClick(null)}/>}/>
                            {userInfo ?
                            <Route path="/users/info" render={() => 
                            <UserView user={userInfo}></UserView>}/>
                            : <div>error</div>}
                        </div>
                    </Router>
                </div>
            </div>
        )
    }
}