import React from 'react';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

import { Link } from 'react-router-dom';

export class GameCard extends React.Component {
    render() {
        const{game, onClick} = this.props;

        return (
            <Card className="mt-3 col-md-4 col-xs-2 mx-3">
                <Card.Img className='mt-3' variant="top" src={game.Img} style={{height: '20vh'}}></Card.Img>
                <Card.Body>
                    <Card.Title>{game.Name}</Card.Title>
                    <Card.Text>{game.description}</Card.Text>
                    <Link to={`/games/${game._id}`}>
                        <Button variant='link'>More</Button>
                    </Link>
                </Card.Body>
            </Card>
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

