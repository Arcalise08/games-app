import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert'
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup'
import Animated from 'react-css-animated';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';


export function UserView(props) {
    const [ userInfo, setUserInfo ] = useState('');
    const [ password, setPassword ] = useState('');
    const [ update, setUpdate] = useState(false);
    const [ show, setShow] = useState(false);
    const [ showErr, setShowErr] = useState(false);
    const [ putErr, setPutErr ] = useState('')
    const [ modal, setModal ] = useState(false)
    var token = localStorage.getItem('token');
    var mounted = false;

    const passwordhandle = (event) => {
        event.preventDefault();
        setUpdate(true)
    }

    const submit = (event) => {
        event.preventDefault();
        if (password) { 
        axios({method: 'put', url: `https://opgamesapi.herokuapp.com/users/info`, 
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                data: {
                    "Username" :  userInfo.Username,
                    "Password": password,
                    "Email" : userInfo.Email,
                    "Birthday" : userInfo.Birthday
                }
            })
            .then(response => {
                setShow(true)
                setTimeout(function(){ 
                    props.redirect('/games', 700, false);
                }, 1000);
            })
            .catch(function (error) {
                setPutErr(error)
                setShowErr(true)
                console.log(error)
            })
        }
        else {
            setTimeout(function(){ 
                props.redirect('/games', 700, false); 
                
            }, 500);
        }
    }

    const deleteAcc = (event) => {
        event.preventDefault();
        setModal(false)
        setPutErr('Executing order 66. Goodbye forever account!') 
        setShowErr(true)
        setTimeout(function(){ 
            
            axios({method: 'delete', url: `https://opgamesapi.herokuapp.com/users/info`, 
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
                .then(response => {
                    console.log(response.data)
                    setTimeout(function(){ 
                        props.onLoggedOut()
                    }, 1000);
                })
                .catch(function (error) {
                    setPutErr(error)
                    setShowErr(true)
                    console.log(error)
                })
        }, 1000);
    }
    useEffect(() =>{
        mounted = true
        document.getElementById('main-container').className = "h-100 overflow-hidden"
        axios.get('https://opgamesapi.herokuapp.com/users/info', {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(response => {
            if (mounted) {
                setUserInfo(response.data)
            }
        })
        .catch(function (err) {
            console.log(err);
        })

    return() => {
        document.getElementById('main-container').className = "h-auto overflow-auto"
        mounted = false
    }

},[show])


    return (
        <Animated className='col-lg-6 m-auto' animateOnMount animationIn="fadeInLeft" duration={{in:600}} animationOut="fadeOutLeft" isVisible={props.animate}>
            <Card >
                <Card.Body>
                    <ListGroup variant='flush'>
                        <ListGroup.Item className='text-center'><strong><u>Username</u></strong>
                            <span className='d-block text-center'style={{backgroundColor: 'rgb(216, 216, 214'}}>{userInfo.Username}</span></ListGroup.Item>
                        <ListGroup.Item className='text-center'><strong><u>Password</u></strong>
                        {update ? 
                        <span className='d-block text-center' onClick={passwordhandle} style={{backgroundColor: 'rgb(216, 216, 214'}}><input style={{backgroundColor: 'rgb(216, 216, 214'}} type='password' onChange={e => setPassword(e.target.value)}></input></span> : 
                        <span className='d-block text-center' onClick={passwordhandle} style={{backgroundColor: 'rgb(216, 216, 214'}}>Click to change</span>}</ListGroup.Item>
                        <ListGroup.Item className='text-center'><strong><u>Email</u></strong>
                            <span className='d-block text-center'style={{backgroundColor: 'rgb(216, 216, 214'}}>{userInfo.Email}</span></ListGroup.Item>
                        <ListGroup.Item className='text-center'><strong><u>Birthday</u></strong>
                        <span className='d-block text-center'style={{backgroundColor: 'rgb(216, 216, 214'}}>{userInfo.Birthday}</span></ListGroup.Item>
                    </ListGroup>
                    <Alert show={show} className='mt-2' variant="success" onClose={() => setShow(false)} dismissible>
                        <Alert.Heading className='text-center'>Success!</Alert.Heading>
                        <p className='text-center'>
                            Redirecting you now!
                        </p>
                    </Alert>
                    <Alert show={showErr} className='mt-2' variant="danger" onClose={() => setShowErr(false)} dismissible>
                        <Alert.Heading className='text-center'>Errors!</Alert.Heading>
                        <p className='text-center'>
                            {putErr}
                        </p>
                    </Alert>
                    <Modal show={modal} centered>
                        <Modal.Header closeButton>
                        <Modal.Title >Warning!</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>This will <span style={{color:'red'}}>PERMENANTLY</span> delete your account!</Modal.Body>
                        <Modal.Footer>
                        <Button variant="primary" onClick={() => setModal(false)}>
                            Take me back!
                        </Button>
                        <Button variant="danger" onClick={deleteAcc}>
                            Delete my account!
                        </Button>
                        </Modal.Footer>
                    </Modal>
                    <Button className='mt-3 d-block w-50 mx-auto btn-danger' onClick={() => setModal(true)} variant="primary">Delete Account</Button>
                    <Button className='mt-3 d-block mx-auto btn-dark' onClick={submit} variant="primary">Save</Button>

                </Card.Body>
            </Card>
        </Animated>
    )

}
