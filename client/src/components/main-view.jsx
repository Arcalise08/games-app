//tools
import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Route, Redirect, Switch} from 'react-router-dom';
import _ from 'lodash';
import { setGames, setStudios, setGenres, setUser, setPage } from '../actions/actions';

//pages
import NavMenu from './nav-menu';
import { RegisterView } from './registration';
import { LoginView } from './login-view';
import  GameList  from './game-list';
import { GameCard } from './game-card';
import { GameView } from './game-view';
import { UserView } from './user-view';
import { GenreCard } from './genre-card';
import { StudioCard } from './studio-card';
import { StudioView } from './studio-view';
import { AdminView } from './admin-view';
import UserCard from './user-card';

//bootstrap and styling
import Spinner from 'react-bootstrap/Spinner'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Animated from 'react-css-animated';
import ListGroup from 'react-bootstrap/ListGroup'

/**
 * @module MainViewer
 * @description As a single page application all views are rendered through this component
 */
export class MainViewer extends React.Component {
    constructor() {
        super();
        this.state = {
            animate: true,
            redirect: false,
            loading: true,
            winScroll: (0)
        };
    }
    /**
     *  @method componentDidMount
     *  @description Attempts to get accessToken on mount. if exists and timestamp is valid, uses it to login.
     *  if it exists, and isnt valid, it deletes token and prompts login.
     * */
    componentDidMount() {
        var mounted = true
        if (mounted) {
            let accessToken = localStorage.getItem('token');
            var timeStamp = new Date(localStorage.getItem('timestamp'));
            var currentTime = new Date

            if (accessToken != null && timeStamp > currentTime) {
                this.setState({
                    redirect: this.props.path
                })

                this.updateInfo(accessToken)

            }
            else {
                localStorage.removeItem('user')
                localStorage.removeItem('timestamp')
                localStorage.removeItem('token')
                this.setState({
                    loading: false,
                })
            }
        }
    }


    componentWillUnmount(mounted) {
        mounted = false
    }
    /**
     *  @method componentDidUpdate
     *  @description Checks to see if redirect flag is true then sets it to false if it is(the redirect will have already
     *  happened by now)
     * */
    componentDidUpdate() {
        if (this.state.redirect) {
            let currentComponent = this;
            currentComponent.setState({
                redirect: false
            })
        }

    }


    /**
     *  @function onLoggedIn
     *  @description Timestamps are automatically set 4 hours in advance at time of login
     *  @param { object }authData
     * takes object as param to set username, timestamp and token to local storage
     * to send with http requests.
     *
     * */

    onLoggedIn(authData) {

        var timeStamp = new Date
        var a = timeStamp.getHours()
        timeStamp.setHours(a + 4) //JWT expires in 4 hours.

        localStorage.setItem('token', authData.token);
        localStorage.setItem('user', authData.user.Username);
        localStorage.setItem('timestamp', timeStamp) //using timestamp to limit request to server
        this.updateInfo(authData.token)
        this.switchView('/games')
    }

    /**
     *  @function onLoggedOut
     *  @description On call, destroys user token in local storage and redirects to /login
     * */

    onLoggedOut() {
        this.props.setUser({})
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('timestamp');
        if (this.props.page != '/games') {
            this.switchView('/login')
        }
    }

    /**
     *  @function updateInfo
     *  @description Entry point function for all game data
     *  @param {string} token
     *  Requires access token retrieved by logging in.
     * */

    updateInfo(token) {
        let currentComponent = this;
        var getGames = new Promise(function(resolve) {
            axios.get('https://opgamesapi.herokuapp.com/games')
                .then(response => {
                    currentComponent.props.setGames(response.data)
                    resolve(true)
                })
                .catch(function (error) {
                    console.log(error)
                })
        })
        var getStudios = new Promise(function(resolve) {
            axios.get('https://opgamesapi.herokuapp.com/studios')
            .then(response => {
                currentComponent.props.setStudios(response.data)
                resolve(true)
            })
            .catch(function (error) {
                console.log(error)
            })
        })
        var getGenres = new Promise(function(resolve) {
            axios.get('https://opgamesapi.herokuapp.com/genres')
            .then(response => {
                currentComponent.props.setGenres(response.data)
                resolve(true)
            })
            .catch(function (error) {
                console.log(error)
            })
        })

        var getUser = new Promise(function(resolve) {
            axios.get('https://opgamesapi.herokuapp.com/user', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }})
                .then(response => {
                    currentComponent.props.setUser({
                        Username: response.data.Username,
                        Email: response.data.Email,
                        Access: response.data.Access,
                        Favorites: response.data.Favorites
                    })
                    resolve(true)
                })
                .catch(function (error) {
                    resolve(true)

                })
            })
        Promise.all([getGames, getStudios, getGenres, getUser])
        .then(function(values){
            currentComponent.setState({
                loading: false
            })
        })
    }

    /**
     *  @function switchView
     *  @description Function called for every redirect
     *  @param {string} redirect point
     *  Takes {string} param to redirect to string with animation and timeout.
     * */

    switchView(e) {
        let thisComponent = this;
        if (e === '/games') {
            thisComponent.setState({
                animate: false,
            });
        }
        else {
            thisComponent.setState({
                animate: false,
                winScroll: window.pageYOffset
            });
        }


        setTimeout(function(){
            if (e === '/games') {
                thisComponent.setState({
                    animate: true,
                    redirect: e

                });
                window.scrollTo(0, thisComponent.state.winScroll)
            }
            else {
                thisComponent.setState({
                    animate: true,
                    redirect: e

                });
                window.scrollTo(0, 0)
            }

        }, 700);

    }

    genreMiddleware(m) {
        return (
            <Col>
                <Animated className='mx-auto mt-3' animateOnMount duration={{in:600}} animationIn="fadeInDown" animationOut="fadeOutUp" isVisible={this.state.animate}>
                    <h2 className='d-block text-center'>Genres</h2>
                </Animated>
                <Row className='justify-content-center'>
                    {m}
                </Row>
            </Col>
        )
    }

    /**
     *  @function updateFavorites
     *  @description Function called to update user favorites.
     * */

    updateFavorites() {
        const accessToken = localStorage.getItem('token');
        const currentComponent = this;
        axios.get('https://opgamesapi.herokuapp.com/user', {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }})
            .then(response => {
                currentComponent.props.setUser({
                    Username: response.data.Username,
                    Email: response.data.Email,
                    Access: response.data.Access,
                    Favorites: response.data.Favorites
                })
            })
            .catch(function (error) {
                console.log(error)
                currentComponent.setState({
                    user: [],
                });
                localStorage.removeItem('token');
                localStorage.removeItem('user');

            })
    }

    favoriteView() {
        const gamez = this.props.games
        const thisComponent = this
        var all = []
        this.props.user.Favorites.forEach(function(value, index) {

            var temp = [
            <GameCard
                game={gamez.find((m) => m._id === value._id)}
                key= {value._id}
                className=''
                linkTo={(e, num, bool) => thisComponent.switchView(e, num, bool)}
                animate={thisComponent.state.animate}
            />
            ]
            all.push(temp)
        })
        if (all.length === this.props.user.Favorites.length) {
            return (
                <Col>
                    <Animated className='mx-auto mt-3' animateOnMount duration={{in:600}} animationIn="slideInUp" animationOut="slideOutUp" isVisible={this.state.animate}>
                        <h3 className='text-center'><u>Your Favorites!</u></h3>
                    </Animated>
                    <Row className='justify-content-center'>
                            {all}
                    </Row>
                </Col>
                )
        }
    }
    listItems(e){

        return (
            <Col className='text-center mt-3'>
                <Animated className='mx-auto' animateOnMount duration={{in:600}} animationIn="fadeInDown" animationOut="fadeOutUp" isVisible={this.state.animate}>
                    <h2>Studios</h2>
                </Animated>
                <Animated className='mx-auto' animateOnMount duration={{in:600}} animationIn="fadeInLeft" animationOut="fadeOutRight" isVisible={this.state.animate}>
                    {e}
                </Animated>
            </Col>

        )
    }

    searchMiddleware(match, type) {
        var a = this.props.genres.find(m => m._id === match.params.gameID)
        var b = this.props.studios.find(m => m._id === match.params.gameID)
        if (type === 'genres') {
            return (
                <Animated className='mx-auto mt-3 row' animateOnMount duration={{in:600}} animationIn="fadeInDown" animationOut="fadeOutUp" isVisible={this.state.animate}>
                    <h3 className='mx-auto text-center mb-3'><u>{a.Name} games</u></h3>
                </Animated>
            )
        }
        if (type === 'studios') {
            return (
                <Animated className='mx-auto mt-3' animateOnMount duration={{in:600}} animationIn="fadeInDown" animationOut="fadeOutUp" isVisible={this.state.animate}>
                    <h3 className='mx-auto text-center mb-3'>Games made by <u>{b.Name}</u></h3>
                </Animated>
            )
        }

    }
    typeSearch(match, type) {
        var gamesList = []
        if (type === 'genre') {
            _.forEach(this.props.games, function(val1, index) {
                var tempList = []
                _.forEach(val1.Genre, function(val, ind) {
                    if (val._id === match.params.gameID) {
                        gamesList.push(val1)
                    }
                })
            })
        }

        if (type === 'studio') {
            _.forEach(this.props.games, function(val1, index) {
                var tempList = []
                _.forEach(val1.Studio, function(val, ind) {
                    if (val._id === match.params.gameID) {
                        gamesList.push(val1)
                    }
                })
            })
        }

        return(
            gamesList.map(game =>
            <GameCard
                game={game}
                key={game._id}
                linkTo={(e, num, bool) => this.switchView(e, num, bool)}
                animate={this.state.animate}/>
            )
        )
    }

    /**
     *  @function authCheck
     *  @description an authorization checkpoint for all protected endpoints. if authorization is required and user
     *  isnt valid. redirects to login.
     *  @param {object} User
     *  User object initiated redirect request.
     *  @param {boolean} Authorization required?
     *  If authorization is required to view this page.
     *  @param {string} redirect point
     *  The endpoint the user is trying to view.
     *  Requires access token retrieved by logging in.
     * */

    authCheck(user, authReq, e) {
        let currentComponent = this;
        if (authReq) {
            if (_.isEmpty(user)) {
                return <Redirect to='/login'/>
            }
            else {
                return e
            }
        }
        else {
            return e
        }
    }

    render() {
        const { user, games, genres, studios } = this.props;
        const { loading } = this.state

        if (loading) {
            return <div id='main-container' className=''></div>
        }

        return (
            <div id='main-container' className='h-100'>
                    <Route path='' render={({location}) =><NavMenu user={user} linkTo={(link, delay, bool) => this.switchView(link, delay, bool)} location={location.pathname} onLoggedOut={user => this.onLoggedOut(user)}/> }/>
                    <Route path='' render={({location}) => {if (this.state.redirect) {return <Redirect push to={this.state.redirect}/>}}}/>

                    <div className='main-viewer row h-100 justify-content-center mx-auto'>
                        <Switch>


                            <Route exact path="/login" render={() => {

                                if (_.isEmpty(user)) {
                                    return this.authCheck(user, false,
                                <LoginView
                                    animate={this.state.animate}
                                    linkTo={(e, num, bool) => this.switchView(e, num, bool)}
                                    onLoggedIn={user => this.onLoggedIn(user)}/>)
                                }
                                else {

                                    return <div></div>
                                }
                            }
                                    }/>

                            <Route exact path="/register" render={() => this.authCheck(user, false,
                                <RegisterView
                                    animate={this.state.animate}
                                    linkTo={(e, num, bool) => this.switchView(e, num, bool)}
                                    />)}
                            />
                            <Route exact path='/games' render={() => this.authCheck(user, true, <GameList games={games} linkTo={(e, num, bool) => this.switchView(e, num, bool)} animate={this.state.animate}/>)}/>

                            <Route exact path="/user" render={() => this.authCheck(user, true, <UserView animate={this.state.animate} onLoggedOut={user => this.onLoggedOut(user)} user={user} redirect={(e) => this.switchView(e)} />)}/>

                            <Route exact path="/user/favorites" render={() => this.authCheck(user, true, this.favoriteView(this.switchView))} />

                            <Route exact path="/admin" render={() => this.authCheck(user, true, <AdminView studios={studios} genres={genres} games={games} update={() => this.updateInfo()} animate={this.state.animate} redirect={(e) => this.switchView(e)}/>)}/>

                            <Route exact path="/genres" render={() => this.authCheck(user, true, this.genreMiddleware(genres.map(genre =>
                                <GenreCard key={genre._id} genre={genre} linkTo={(e, num, bool) => this.switchView(e, num, bool)} animate={this.state.animate}/>)))}/>

                            <Route exact path="/genres/game-search/:gameID" render={({match}) => this.authCheck(user, true, <div className='col'>{this.searchMiddleware(match, 'genres')}<Row className='justify-content-center'>
                            {this.typeSearch(match, 'genre')}</Row></div>) }/>

                            <Route exact path="/studios" render={() => this.authCheck(user, true, this.listItems(studios.map(studio =>
                                <StudioCard key={studio._id} studio={studio} linkTo={(e, num, bool) => this.switchView(e, num, bool)} animate={this.state.animate}/>)))}/>

                            <Route exact path="/studios/:studioID" render={({match}) =>
                                this.authCheck(user, true, <StudioView studio={studios.find(m => m._id === match.params.studioID)} linkTo={(e, num, bool) => this.switchView(e, num, bool)} animate={this.state.animate}/>)}/>

                            <Route exact path="/studios/game-search/:gameID" render={({match}) => this.authCheck(user, true, <div className='col'>{this.searchMiddleware(match, 'studios')}<Row className='justify-content-center'>
                            {this.typeSearch(match, 'studio')}</Row></div>)}/>

                            <Route exact path="/games/:gameID" render={({match}) =>  this.authCheck(user, true,
                                <GameView
                                    favorites={user.Favorites}
                                    updateFavorites={(id, method) => this.updateFavorites(id,method)}
                                    game={games.find(m => m._id === match.params.gameID)}
                                    linkTo={(e, num, bool) => this.switchView(e, num, bool)}
                                    animate={this.state.animate}/>)}/>

                            <Route exact path='/' render={() => this.authCheck(user, true, <Redirect to='/games'/>)}/>
                            <Route exact path="/404" render={() => <h1 className='mt-5'>404!</h1>}/>
                            <Route path='*' render={() => <Redirect to='/404'/>}/>
                        </Switch>
                    </div>
            </div>
        )

    }
}

let mapStateToProps = state => {
    return {
        games: state.games,
        studios: state.studios,
        genres: state.genres,
        user: state.user,
        page: state.page
    }
}

export default connect(mapStateToProps, { setGames, setGenres, setStudios, setUser, setPage } )(MainViewer);
