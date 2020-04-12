import React from 'react';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';

import { BrowserRouter as Router, Route} from 'react-router-dom';
import { Link } from 'react-router-dom';

export class NavigationBar extends React.Component {
    
    render() {
        const { user, onClick } = this.props;

        return (
            <Navbar collapseOnSelect fixed="top" bg="dark" variant="dark" expand="lg">
            <Navbar.Brand>OPgames</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                <Nav.Link className="active">Games</Nav.Link>
                <Nav.Link className="disabled">Studios</Nav.Link>
                <Nav.Link className="disabled">Genres</Nav.Link>
                </Nav>
                <Nav>
                <Navbar.Brand></Navbar.Brand>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
        );
    }
}
