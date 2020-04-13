import React from 'react';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Animated from 'react-css-animated';


import { Link } from 'react-router-dom';

export class UserCard extends React.Component {
    constructor() {
        super();
        
    }


    render() {
        const{user, animate, linkTo} = this.props;
        
        return (
            <Animated className='mt-3 col-lg-3 col-md-4 col-xs-6 mx-2' animateOnMount duration={{in:600}} animationIn="fadeInLeft" animationOut="fadeOutLeft" isVisible={animate}>
                <Card onClick={() => linkTo(`/genres/game-search/${user._id}`, 700, false)}  className="btn h-100">
                    <Card.Body>
                        <Card.Title className='text-center'>{user.Username}</Card.Title>
                        <Card.Text>{user.Email}</Card.Text>
                    </Card.Body>
                </Card>
            </Animated>
        );
    }
}