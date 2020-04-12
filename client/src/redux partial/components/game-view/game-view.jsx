import React from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup'
import MediaQuery from 'react-responsive'
import Animated from 'react-css-animated';
import axios from 'axios';

import starOutline from '../../img/staroutline.svg'
import starGold from '../../img/goldstar.svg'
import starGreen from '../../img/greenstar.svg'
import favoriteImg from '../../img/favorite.svg'
import favoriteRedImg from '../../img/favoriteRed.svg'


export class GameView extends React.Component {
    
    constructor() {
        super();

        this.state= {
            rating: null,
            communityRating: null,
            favorite: undefined,
            animateFav: true
        };
    }
    
    unmount = true

    componentDidMount() {
        const { game, favorites } = this.props;
        const component = this
        this.unmount = false
        var search = favorites.find(e => {return e._id === game._id})
        if (search) {
            component.setState({
                favorite: true,
                animateFav: true
            })
        }
        else{
            component.setState({
                favorite: false,
            })
        }
        var token = localStorage.getItem('token')
        axios.get('https://opgamesapi.herokuapp.com/user/ratings/' + game._id, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
        .then(response => {
            if (!this.unmount && response.data[0].UserRating) {
                component.setState({
                    rating: response.data[0].UserRating
                })
            }
        })
        .catch(function (error) {
            component.setState({
                rating: 0
            })
        })
        axios.get('https://opgamesapi.herokuapp.com/ratings/' + game._id, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
        .then(response => {
            var all = document.querySelectorAll('.Cstar')
            var small = document.querySelector('.reviewNum')
            var rating = (response.data.Rating / response.data.TotalRated)

            if (!this.unmount) {
                all.forEach(function(e) {
                    if (e.title <= rating) {
                        e.src = starGreen
                    }
                    else {
                        e.src = starOutline
                    }
                })
                if (response.data.TotalRated) {
                    small.innerHTML = "<br>" + `Based on ${response.data.TotalRated} reviews!`
                }
            }
        })
        .catch(function (error) {
            console.log(error)
        })
    }

    componentDidUpdate() {
        var all = document.querySelectorAll('.star')
        var getRating = this.state.rating

        if (getRating) {
            all.forEach(function(e) {
                if (e.title <= getRating) {
                    e.src = starGold
                }
                else {
                    e.src = starOutline
                }
            })
        }
    }

    componentWillUnmount() {
        this.unmount = true
    }

    changeStars(e, index1) {
        var all = document.querySelectorAll('.star')
        if (index1 && !this.state.rating) {
            all.forEach(function(e) {
                if (e.title <= index1) {
                    e.src = starGold
                }
                else {
                    e.src = starOutline
                }
            })
        }
        if(!index1 && !this.state.rating) {
            all.forEach(e => e.src = starOutline)
        }
    }

        submitRating(e) {        
            const { game } = this.props;
            var token = localStorage.getItem('token')

            axios({method: 'post', url: `https://opgamesapi.herokuapp.com/ratings/${game._id}`, 
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                data: {
                    "rating": e
                }
            })
            .then(response => {
                this.setState({
                    rating: e
                })
            })
            .catch(function (error) {
                console.log(error)
            })
        }

        favoriteHandle(game) {
            var token = localStorage.getItem('token')
            const { updateFavorites} = this.props
            const component = this

            if (this.state.favorite) {
                axios({method: 'delete', url: `https://opgamesapi.herokuapp.com/users/info/games/${game._id}`, 
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                })
                .then(response => {
                    updateFavorites()
                    component.setState({
                        favorite: false,
                    })
                    
                })
                .catch(function (error) {
                    console.log(error)
                })
            }
            else {
                axios({method: 'post', url: `https://opgamesapi.herokuapp.com/users/info/games/${game._id}`, 
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                })
                .then(response => {
                    updateFavorites()
                    component.setState({
                        favorite: true,
                        animateFav: false
                    })
                    component.setState({
                        animateFav: true
                    })
                })
                .catch(function (error) {
                    console.log(error)
                })
            }
        }

    render() {
        const { game, animate, linkTo } = this.props;

        if (!game) return null

        return (
            <Animated className='col-lg-8 mx-auto mt-4' animateOnMount duration={{in:300}} animationIn="slideInUp" animationOut="slideOutDown" isVisible={animate}>
                <Card className="">
                    <Card.Header>
                        {this.state.favorite ? 
                            <Animated className='d-inline-block' duration={{in:900}} style={{height: '25px', width: '35px'}} animationIn="heartBeat" isVisible={this.state.animateFav}>
                                <img onClick={() => this.favoriteHandle(game)} className='' src={favoriteRedImg} height="25" width='35'/> 
                            </Animated> :
                            <img onClick={() => this.favoriteHandle(game)} className='' src={favoriteImg} height="25" width='35'/>}
                        <Button bsPrefix='close' onClick={() => linkTo('/games', 700, false)}>X</Button>
                    </Card.Header>
                <MediaQuery maxDeviceWidth={992} >
                    <Card.Title className='display-4 text-center'>  
                        {game.Name}
                    </Card.Title>
                </MediaQuery>
                    
                <MediaQuery minDeviceWidth={992} >
                    <Card.Title className='display-3 text-center'>{game.Name}</Card.Title>
                </MediaQuery>

                <Card.Body>
                <div className='mt-3 col-lg-6 mr-5 float-lg-left fluid'>
                <Card.Img className=' border border-dark' src={game.Img}></Card.Img>
                    <div className='text-center my-3'>
                        <h5 className='text-center'>Community Ratings</h5>
                        <div className='d-inline-block' onMouseOut={(e) => this.changeStars(e, 0)}>
                            <Card.Img className='d-inline Cstar' title='1' src={starOutline} style={{height: 'auto', width: '5vh', fill: 'blue'}}></Card.Img>
                            <Card.Img className='d-inline Cstar' title='2' src={starOutline} style={{height: 'auto', width: '5vh'}}></Card.Img>
                            <Card.Img className='d-inline Cstar' title='3' src={starOutline} style={{height: 'auto', width: '5vh'}}></Card.Img>
                            <Card.Img className='d-inline Cstar' title='4' src={starOutline} style={{height: 'auto', width: '5vh'}}></Card.Img>
                            <Card.Img className='d-inline Cstar' title='5' src={starOutline} style={{height: 'auto', width: '5vh'}}></Card.Img>
                            <small className="reviewNum"></small>
                        </div>
                        <h5 className='text-center mt-2'>Your Rating</h5>
                        <div className='d-inline-block' onMouseOut={(e) => this.changeStars(e, 0)}>
                            <Card.Img className='d-inline star' title='1' onMouseOver={(e) => this.changeStars(e, 1)} onClick={() => this.submitRating(1)} src={starOutline} style={{height: 'auto', width: '5vh'}}></Card.Img>
                            <Card.Img className='d-inline star' title='2' onMouseOver={(e) => this.changeStars(e, 2)} onClick={() => this.submitRating(2)} src={starOutline} style={{height: 'auto', width: '5vh'}}></Card.Img>
                            <Card.Img className='d-inline star' title='3' onMouseOver={(e) => this.changeStars(e, 3)} onClick={() => this.submitRating(3)} src={starOutline} style={{height: 'auto', width: '5vh'}}></Card.Img>
                            <Card.Img className='d-inline star' title='4' onMouseOver={(e) => this.changeStars(e, 4)} onClick={() => this.submitRating(4)} src={starOutline} style={{height: 'auto', width: '5vh'}}></Card.Img>
                            <Card.Img className='d-inline star' title='5' onMouseOver={(e) => this.changeStars(e, 5)} onClick={() => this.submitRating(5)} src={starOutline} style={{height: 'auto', width: '5vh'}}></Card.Img>
                        </div>
                        
                    </div>
                </div>
                    <ListGroup variant="flush">
                        <ListGroup.Item>{game.Description}</ListGroup.Item>
                        <ListGroup.Item><span className='h5'>Studio: </span>{game.Studio.map(e => e.Name)}</ListGroup.Item>
                        <ListGroup.Item><span className='h5'>Genre: </span>{game.Genre.map(e => e.Name)}</ListGroup.Item>
                        <ListGroup.Item><span className='h5'>Players: </span>{game.Players}</ListGroup.Item>
                    </ListGroup>
                </Card.Body>
                <Button onClick={() => linkTo('/games', 700, false)} className='mx-auto my-3 btn-dark col-4 d-block'>Back</Button>
            </Card>
        </Animated>
        )
    }
}

/*                <Card.Img className='mt-3 game-poster border border-dark' variant="top" src={game.Img}></Card.Img>
            <Card.Body>
                <Card.Title className='display-3'>{game.Name}</Card.Title>
                <Card.Text>
                    <span>{game.Description}</span>
                    <span className='h4'><br/>Studio: </span>
                    <span>{game.Studio.map(e => e.Name)}</span>
                    <span className='h4'>  Genre: </span>
                    <span>{game.Genre.map(e => e.Name)}</span>

                </Card.Text>
                <Link to={`/games`}>
                    <Button>Back</Button>
                </Link>
            </Card.Body>
        </Card>*/
