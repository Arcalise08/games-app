import React from 'react';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton'
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import _ from 'lodash';
import { connect } from 'react-redux';
import { setPage, setVisible } from '../actions/actions';

import Row from 'react-bootstrap/Row'
import MediaQuery from 'react-responsive'

import ddImg from './user.svg'
import searchImg from './search.svg'
import signoutImg from './exit.svg'
import settingImg from './settings.svg'
import adminImg from './lock.svg'
import favoriteImg from './favorite.svg'

/**
 * @module NavMenu
 * @description The view rendered for navigation.
 * */
export class NavMenu extends React.Component {
    constructor() {
        super();
        this.state = {
            menuExpand: false
        };


    }
    /**
     * @method componentDidMount
     * @description on mount, checks active link and sets navigation button to match active link.
     * */
        componentDidMount() {
            let currentComponent = this;
            var path = this.props.location
            var all = document.querySelectorAll('.menuItem1')
            var a = false
            setTimeout(function(){
                if (path)
                all.forEach(function(e) {
                    if (e.title === path) {
                        e.classList.add("active")
                    }

                    else {
                        e.classList.remove("active")
                    }
                })
            },100)
        }
    /**
     * @method componentDidUpdate
     * @description on update, checks if active link has changed(this component only updates on link switching)
     * then sets active navigation button to active navigation link.
     * */
        componentDidUpdate() {
            let currentComponent = this;
            var path = this.props.location
            var all = document.querySelectorAll('.menuItem1')

            setTimeout(function(){
                currentComponent.props.setPage(path)

                all.forEach(function(e) {
                    if (e.title === path) {
                        e.classList.add("active")
                    }

                    else {
                        e.classList.remove("active")
                    }
                })
            },100)
        }


    /**
     * @function navToggle
     * @description toggles the expansion of the nav menu.
     * */
        navToggle(value) {
            if (value) {
                this.setState({
                    menuExpand: !this.state.menuExpand
                })

            }
            if (!value) {
                this.setState({
                    menuExpand: false
                })
            }
        }
    /**
     * @function search toggle
     * @description toggles the search bar active.
     * */
        searchToggle(a) {
            if(this.props.location === '/games') {
                document.getElementById('searchBar').classList.toggle('d-none')
                this.props.setVisible(!this.props.visible)
            }
        }


        navDropdown(user, onLoggedOut, linkTo) {

            return (
                <Row>
                    {!_.isEmpty(user) ?

                        <Button onClick={() => this.searchToggle()} className='mr-2 mt-1 btn-dark' style={{borderColor: 'rgba(255,255,255,.1)'}}><img className='m-auto' style={{filter: 'invert(.6)'}} src={searchImg} height="20" width='35' /></Button> :
                        null
                    }
                        <Navbar.Toggle className='mr-2 mt-1' aria-controls="basic-navbar-nav"/>

                        <Dropdown className='mr-2 mt-1' style={{border: '1px solid rgba(255,255,255,.1)'}}>
                    {!_.isEmpty(user) ?

                        <DropdownButton className='' bsPrefix="dropbar-toggler btn btn-img" onClick={() => this.navToggle(false)} alignRight variant='img' title={<img  src={ddImg} style={{filter: 'invert(.4)'}} height='35' width='35'/>}>

                            <Dropdown.Header >Logged in as: <strong>{user.Username}</strong> </Dropdown.Header>
                            <Dropdown.Divider></Dropdown.Divider>
                            <Dropdown.Item onClick={() => linkTo('/user')}>Profile<img className='mb-1' src={settingImg} height="20" width='35' /></Dropdown.Item>
                            <Dropdown.Item onClick={() => linkTo('/user/favorites')}>Favorites<img className='mb-1' src={favoriteImg} height="20" width='35' /></Dropdown.Item>
                            {user.Access === 3 ?
                            <Dropdown.Item onClick={() => linkTo('/admin')}>Admin<img src={adminImg} height="20" width='35' /></Dropdown.Item>:
                            null}

                            <Dropdown.Item onClick={ onLoggedOut}>Log out<img src={signoutImg} height="20" width='35' /></Dropdown.Item>
                        </DropdownButton> :

                        <DropdownButton className='' bsPrefix="dropbar-toggler btn btn-img" onClick={() => this.navToggle(false)} alignRight variant='img' title={<img src={ddImg} style={{filter: 'invert(.4)'}} height='35' width='35'/>}>
                            <Dropdown.Item onClick={() => linkTo("/login")}>Login</Dropdown.Item>
                            <Dropdown.Item onClick={() => linkTo("/register")}>Register</Dropdown.Item>
                        </DropdownButton>}
                    </Dropdown>

                </Row>
            )
        }

        render() {

            const { user, onLoggedOut, linkTo, location, page } = this.props
            if (_.isEmpty(user)) {
                return (
                    <Navbar collapseOnSelect={true} expanded={this.state.menuExpand} onChange={() => this.something} onToggle={() => this.navToggle(true)} fixed="top" bg="dark" variant="dark" expand="lg">
                        <Navbar.Brand className='navBrand' onClick={() => linkTo('/games')}>OPgames</Navbar.Brand>
                        <MediaQuery maxDeviceWidth={992} >
                            {this.navDropdown(user, onLoggedOut, linkTo)}
                        </MediaQuery>
                    <Navbar.Collapse className='mt-1' id="basic-navbar-nav" onEnter={(user) => this.navDropdown(user)}>
                    <Nav>
                        <Row className='ml-1'>

                            <Nav.Item as={Button} disabled={true} variant={'outline-light'} className='border-0'>Games</Nav.Item>
                            <Nav.Item as={Button} disabled={true} variant={'outline-light'} className='border-0'>Studios</Nav.Item>
                            <Nav.Item as={Button} disabled={true} variant={'outline-light'} className='border-0'>Genres</Nav.Item>
                        </Row>

                    </Nav>
                    </Navbar.Collapse>
                    <MediaQuery minDeviceWidth={992} >
                        {this.navDropdown(user, onLoggedOut, linkTo)}
                    </MediaQuery>
                </Navbar>
                )
            }
            return(
                <Navbar collapseOnSelect={true} expanded={this.state.menuExpand} onChange={() => this.something} onToggle={() => this.navToggle(true)} fixed="top" bg="dark" variant="dark" expand="lg">
                    <Navbar.Brand className='navBrand' onClick={() => linkTo('/games')}>OPgames</Navbar.Brand>
                    <MediaQuery maxWidth={992} >
                        {this.navDropdown(user, onLoggedOut, linkTo)}
                    </MediaQuery>


                        <Navbar.Collapse id="basic-navbar-nav" onEnter={(user) => this.navDropdown(user)}>
                        <Nav>
                            <Row className='ml-1 mt-2'>
                                <Nav.Item as={Button} variant={'outline-light'} title="/games" onClick={() =>  {this.navToggle(false);linkTo('/games')}} className='menuItem1 active border-0'>Games</Nav.Item>
                                <Nav.Item as={Button} variant={'outline-light'} title="/studios" onClick={() => {this.navToggle(false);linkTo('/studios')}}  className='menuItem1 border-0'>Studios</Nav.Item>
                                <Nav.Item as={Button} variant={'outline-light'} title="/genres" onClick={() => {this.navToggle(false);linkTo('/genres')}} className='menuItem1 border-0'>Genres</Nav.Item>
                            </Row>
                        </Nav>
                    </Navbar.Collapse>
                    <MediaQuery minWidth={992}>
                        {this.navDropdown(user, onLoggedOut, linkTo)}
                        </MediaQuery>



                </Navbar>

            )
    }
}

let mapStateToProps = state => {
    return {
        page: state.page,
        visible: state.visible
    }
}
export default connect(mapStateToProps, { setPage, setVisible } )(NavMenu);
