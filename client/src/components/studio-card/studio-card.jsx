import React from 'react';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col'


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
    studio: PropTypes.shape({
        Name: PropTypes.string.isRequired,
        Description: PropTypes.string.isRequired,
        Founded: PropTypes.string.isRequired, //This should be a date
        StillAlive: PropTypes.bool.isRequired
    })
};