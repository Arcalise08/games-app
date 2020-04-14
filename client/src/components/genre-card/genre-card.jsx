import React from 'react';
import PropTypes from 'prop-types';
import Card from 'react-bootstrap/Card';
import Animated from 'react-css-animated';

export class GenreCard extends React.Component {
    constructor() {
        super();
        
    }


    render() {
        const{genre, animate, linkTo} = this.props;
        
        return (
            <Animated className='mt-3 col-lg-3 col-md-4 col-xs-6 mx-2' animateOnMount duration={{in:600}} animationIn="fadeInLeft" animationOut="fadeOutLeft" isVisible={animate}>
                <Card onClick={() => linkTo(`/genres/game-search/${genre._id}`, 700, false)}  className="btn h-100">
                    <Card.Body>
                        <Card.Title className='text-center'>{genre.Name}</Card.Title>
                        <Card.Text>{genre.Description}</Card.Text>
                    </Card.Body>
                </Card>
            </Animated>
        );
    }
}

GenreCard.propTypes = {
    genre: PropTypes.shape({
        Name: PropTypes.string.isRequired,
        Description: PropTypes.string.isRequired
    }).isRequired,
};