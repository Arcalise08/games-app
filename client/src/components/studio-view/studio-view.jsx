import React from 'react';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Animated from 'react-css-animated';
import ListGroup from 'react-bootstrap/ListGroup'

import Like from '../../img/like.svg'
import Dislike from '../../img/dislike.svg'


import { Link } from 'react-router-dom';

export class StudioView extends React.Component {
    constructor() {
        super();
        
    }


    render() {
        const{studio, animate, linkTo} = this.props;

        return (
            <Animated className='mt-5 col-lg-6 mx-auto' animateOnMount duration={{in:600}} animationIn="fadeInLeft" animationOut="fadeOutLeft" isVisible={animate}>
                <Card className="btn">
                    <Card.Body>
                        <ListGroup>
                            <Card.Title className='text-center'>{studio.Name}</Card.Title>
                                <ListGroup.Item>Founded: {studio.Founded}</ListGroup.Item>

                                <ListGroup.Item>Still operating? : {studio.StillAlive ? 
                                    <img className='mb-1' src={Like} height="20" width='35' /> : 
                                    <img className='mb-1' src={Dislike} height="20" width='35' />}</ListGroup.Item>

                                <ListGroup.Item>{studio.Description}</ListGroup.Item>
                        </ListGroup>
                        <Button onClick={() => linkTo(`/studios/game-search/${studio._id}`, 700, false)} className='col-6 mt-2 btn-dark mx-auto d-block'>View games made by this studio</Button>
                        <Button onClick={() => linkTo(`/studios`, 700, false)} className='col-6 mt-2 btn-dark mx-auto d-block'>Back</Button>
                    </Card.Body>
                </Card>
            </Animated>
        );
    }
}