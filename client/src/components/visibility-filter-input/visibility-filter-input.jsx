import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Animated from 'react-css-animated';

import Form from 'react-bootstrap/Form';

import { setFilter, setVisible } from '../../actions/actions';

function VisibilityFilterInput(props) {
    const { visible } = props
    useEffect(() => {
        return () => {
            props.setFilter('')
            props.setVisible(false)
    };
}, []);

    return (
        <Animated className='mx-auto col-lg-6' duration={{in:600}} animationIn="fadeInDown" animationOut="fadeOutUp" isVisible={visible}>
            <Form.Control
                className='d-none'
                id='searchBar'
                onChange={e => props.setFilter(e.target.value.toLowerCase()) }
                value={props.VisibilityFilter}
                placeholder='search'
                />
            </Animated>
    )
}

export default connect(null, { setFilter, setVisible })(VisibilityFilterInput)