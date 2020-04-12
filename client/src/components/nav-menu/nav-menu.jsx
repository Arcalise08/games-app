import React from 'react';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton'
import Button from 'react-bootstrap/Button';
import _ from 'lodash';
import { connect } from 'react-redux';
import { setPage, setVisible } from '../../actions/actions';

import Row from 'react-bootstrap/Row'
import MediaQuery from 'react-responsive'

import ddImg from './user.svg'
import searchImg from './search.svg'
import signoutImg from './exit.svg'
import settingImg from './settings.svg'
import adminImg from './lock.svg'
import favoriteImg from './favorite.svg'

export class NavMenu extends React.Component {
    constructor() {
        super();
        this.state = {
            menuExpand: false
        };
        

    }
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
        searchToggle(a) {
            var searchBar = document.querySelector('.searchBar')
            this.props.setVisible(!this.props.visible)
        }


        navDropdown(user, onLoggedOut, linkTo) {

            return (
                <Row>
                    {!_.isEmpty(user) ? 
                        
                        <Button onClick={() => this.searchToggle()} className='mr-2 mt-1 btn-dark' style={{borderColor: 'rgba(255,255,255,.1)'}}><img className='m-auto' style={{filter: 'invert(.4)'}} src={searchImg} height="20" width='35' /></Button> :
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
                    <Navbar.Collapse id="basic-navbar-nav" onEnter={(user) => this.navDropdown(user)}>
                    <Nav>
                        <Nav.Link className='disabled'>Games</Nav.Link>
                        <Nav.Link className='disabled'>Studios</Nav.Link>
                        <Nav.Link className='disabled'>Genres</Nav.Link>
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
                    <MediaQuery maxDeviceWidth={992} >
                        {this.navDropdown(user, onLoggedOut, linkTo)}
                    </MediaQuery>
                    

                        <Navbar.Collapse id="basic-navbar-nav" onEnter={(user) => this.navDropdown(user)}>
                        <Nav>
                            <Nav.Link title="/games" onClick={() => linkTo('/games')} className='menuItem1 active'>Games</Nav.Link>
                            <Nav.Link title="/studios" onClick={() => linkTo('/studios')}  className='menuItem1'>Studios</Nav.Link>
                            <Nav.Link title="/genres" onClick={() => linkTo('/genres')} className='menuItem1'>Genres</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                    <MediaQuery minDeviceWidth={992} >
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