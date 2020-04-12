import React from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

import { Link } from 'react-router-dom';

export class GameView extends React.Component {
    constructor() {
        super();

        this.state= {};
    }

    render() {
        const { game } = this.props;

        if (!game) return null

        return (
            <div className='card mt-2'>
                    <div className="game-view">
                        <img className="game-poster card-img-top d-block" src={game.Img}/>
                        <div className='card-body'>
                            <div className="game-title card-title">
                                <span className="value display-4">{game.Name}</span>
                            </div>
                            <div className='card-text'>
                                <div className="game-description my-3 text-left">
                                    <span className="label"><strong>Description: </strong></span>
                                    <span className="value">{game.Description}</span>
                                </div>

                                <div className="game-genre my-3 text-left">
                                    <span className="label"><strong>Genre: </strong></span>
                                    <span className="value">{game.Genre[0].Name}</span>
                                </div>
                                <div className="game-studio my-3 text-left">
                                    <span className="label"><strong>Studio: </strong></span>
                                    <span className="value">{game.Studio[0].Name}</span>
                                </div>
                                <Link to={`/games`}>
                                    <Button style={{width: '30%'}} className='btn-dark mt-3 mx-auto d-block'>Back</Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
        )
    }
}