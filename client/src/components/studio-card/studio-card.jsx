import React from 'react';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Animated from 'react-css-animated';
import ListGroup from 'react-bootstrap/ListGroup'
import Col from 'react-bootstrap/Col'

import { Link } from 'react-router-dom';

export class StudioCard extends React.Component {
    constructor() {
        super();
        
    }


    render() {
        const{studio, animate, linkTo} = this.props;

        return (  
                <Col as={Button} className='m-1 col-lg-5 col-md btn-light' onClick={() => linkTo(`/studios/${studio._id}`, 700, false)}>
                    
                    {studio.Name}
                </Col>                        
        );
    }
}

StudioCard.propTypes = {
    studio: PropTypes.arrayOf(PropTypes.shape({
        Name: PropTypes.string.isRequired,
        Description: PropTypes.string.isRequired,
        Founded: PropTypes.string.isRequired, //This should be a date
        StillAlive: PropTypes.bool.isRequired
    }))
};