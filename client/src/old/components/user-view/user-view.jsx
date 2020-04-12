import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card';

export class UserView extends React.Component {
    render() {
        const { user } = this.props

        return (
            <Card className="mt-3 col-md-4 col-xs-2 mx-3">
            <Card.Body>
                <Card.Title>Username: {user.Username}</Card.Title>
                <Card.Text>Email: {user.Email}</Card.Text>
            </Card.Body>
        </Card>
        )
    }
}