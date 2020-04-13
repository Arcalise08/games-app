import React from 'react';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Animated from 'react-css-animated';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import { Link } from 'react-router-dom';

export class GameCard extends React.Component {
    constructor() {
        super();
        
    }

    render() {
        const{game, animate, linkTo} = this.props;

        return (
            <Animated className='mt-3 col-lg-3 col-md-4 col-sm-6 col-xs-8' animateOnMount duration={{in:600}} animationIn="fadeInLeft" animationOut="fadeOutRight" isVisible={animate}>
                <Card className="h-100">
                    <Card.Img className='mt-3 border fluid cardImg ' variant="top" src={game.Img} ></Card.Img>
                    <Card.Body>
                        <Card.Title className='text-center col'>{game.Name}</Card.Title>
                    </Card.Body>
                    <Card.Footer>
                        <Button onClick={() => linkTo(`/games/${game._id}`, 700, false)} className='btn-dark d-block mx-auto col-6'>More</Button>
                    </Card.Footer>
                </Card>
            </Animated>
        );
    }
}

GameCard.propTypes = {
    game: PropTypes.shape({
        Name: PropTypes.string.isRequired,
        Description: PropTypes.string.isRequired,
        Img: PropTypes.string.isRequired,
    Genre: PropTypes.arrayOf(PropTypes.shape({
        Name: PropTypes.string.isRequired,
        Description: PropTypes.string.isRequired
    })),
    Studio: PropTypes.arrayOf(PropTypes.shape({
        Name: PropTypes.string.isRequired,
        Description: PropTypes.string.isRequired,
        Founded: PropTypes.string.isRequired, //This should be a date
        StillAlive: PropTypes.bool.isRequired

    }))
    }).isRequired,
};

