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

/* <Card className="mt-3 col-lg-3 col-md-4 col-xs-6  mx-2">
                    <Card.Body>
                        <Card.Title className='text-center'>{studio.Name}</Card.Title>
                        
                        <Button onClick={() => linkTo(`/studios/${studio._id}`, 700, false)} className='btn-dark mt-5 mx-auto d-block'>More</Button>

                    </Card.Body>
                </Card>

                <Animated className='mx-2 mt-3' animateOnMount duration={{in:600}} animationIn="fadeInLeft" animationOut="fadeOutLeft" isVisible={animate}>
*/