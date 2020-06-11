import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Animated from 'react-css-animated';
import PropTypes from 'prop-types';

import { GameCard } from './game-card';
import VisibilityFilterInput from './visibility-filter-input';

const mapStateToProps = state => {
    const { visibilityFilter, visible } = state;
    return { visibilityFilter, visible };
};


function GameList(props) {
    const { games, visibilityFilter, visible } = props
    let filteredGames = games;

    if (visibilityFilter !== '') {
        var gamesArr = games
        filteredGames = games.filter(m => m.Name.toLowerCase().includes(visibilityFilter));
    }
    if (!games) return <div className="main-view"/>

    return (
        <div className='h-100 w-100 mt-4 mx-auto'>
                <VisibilityFilterInput visibilityFilter={visibilityFilter} visible={visible}/>
                <div className='row justify-content-center'>
                    <Col xs={10}>
                        <Row>
                            {filteredGames.map(m => <GameCard key={m._id} linkTo={props.linkTo} animate={props.animate} game={m}/>)}
                        </Row>
                    </Col>
                </div>
    </div>
    )
}
GameList.propTypes = {
    games: PropTypes.arrayOf(PropTypes.shape({
        Name: PropTypes.string.isRequired,
        Description: PropTypes.string.isRequired,
        Img: PropTypes.string.isRequired,
    })).isRequired,
};

export default connect(mapStateToProps)(GameList);
