import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert'
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Animated from 'react-css-animated';
import Collapse from 'react-bootstrap/Collapse'
import ButtonGroup from 'react-bootstrap/ButtonGroup'

import axios from 'axios';



export function AdminView(props) {
    const [ items, setItems] = useState(false);
    const [ games, setGames] = useState(false);
    const [ genre, setGenre] = useState(false);
    const [ studio, setStudio] = useState(false);
    const [ show, setShow] = useState(false);
    const [ msg, setMsg] = useState(undefined)
    const [ error, setError] = useState(undefined)
    const [ showResult, setShowResult] = useState(false)
    const [ showError, setShowError] = useState(false)
    const [ errorResult, setErrorResult] = useState(false)
    const [ update, setUpdate] = useState(undefined) //Call to update genres/studios/games

    //Submit states
    const [ name, setName ] = useState('');
    const [ value, setValue ] = useState('');
    const [ value2, setValue2 ] = useState('');
    const [ value3, setValue3 ] = useState('');
    const [ value4, setValue4 ] = useState('');
    const [ value5, setValue5 ] = useState('');

    var mounted = true
    var msg1 = 'This functionality has not been implimented yet! Sorry!'
    var msg2 = 'The jedi will be destroyed!'
    var token = localStorage.getItem('token');
    var ezCounter = 1
    const handleBtn = (event) => {
        setShow(false)
        {event.target.title === '66' ? 
            setMsg(msg2) :
            setMsg(msg1)
    }   
        setShow(true)
        
    }

    const submitInfo = (type) => {
        if (type === 'Genre') {
            axios({method: 'post', url: `https://opgamesapi.herokuapp.com/admin/genres`, 
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    data: {
                        "Name" :  name,
                        "Description": value,

                    }
                })
                .then(response => {
                    setShow(true)
                    setShowResult(response.data)
                    props.update()
                    setTimeout(function(){ 
                        setUpdate(ezCounter + 1)
                        createItems('Create Items')
                        setShow(false)
                    }, 1000);
                })
                .catch(function (e) {
                    console.log(e.response)
                    const listErr = e.response.data.errors.map((msg) => <li key={msg.value}>{msg.msg}</li>)
                    setShowError(true)
                    setErrorResult(listErr)
                })
            }
        if (type === 'Studio') {
            axios({method: 'post', url: `https://opgamesapi.herokuapp.com/admin/studios`, 
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    data: {
                        "Name" :  name,
                        "Description": value,
                        "Founded": value2,
                        "StillAlive": value3

                    }
                })
                .then(response => {
                    setShow(true)
                    setShowResult(response.data)
                    props.update()
                    setTimeout(function(){ 
                        setUpdate(ezCounter + 1)
                        createItems('Create Items')
                        setShow(false)
                    }, 1000);
                })
                .catch(function (e) {
                    console.log(e.response)
                    const listErr = e.response.data.errors.map((msg) => <li key={msg.value}>{msg.msg}</li>)
                    setShowError(true)
                    setErrorResult(listErr)
                })
            }
        if (type === 'Game') {
            axios({method: 'post', url: `https://opgamesapi.herokuapp.com/admin/games`, 
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    data: {
                        "Name" :  name,
                        "Description": value,
                        "Img": value2,
                        "Genre": [value3],
                        "Studio": value4,
                        "Players":value5

                    }
                })
                .then(response => {
                    setShow(true)
                    setShowResult(response.data)
                    props.update()
                    setTimeout(function(){ 
                        setUpdate(ezCounter + 1)
                        createItems('Create Items')
                        setShow(false)
                    }, 1000);
                })
                .catch(function (e) {
                    console.log(e.response)
                    const listErr = e.response.data.errors.map((msg) => <li key={msg.value}>{msg.msg}</li>)
                    setShowError(true)
                    setErrorResult(listErr)
                })
            }

    }
    useEffect(() =>{
        mounted = true
        document.getElementById('main-container').className = "h-100 overflow-hidden"
        
        //get studio as options
        var studiosArr = []
        props.studios.forEach(e => {
            var studioTemp = [
                <option key={e._id}>{e.Name}</option>
            ]
            studiosArr.push(studioTemp)
        })
        if (studiosArr.length === props.studios.length) {
            setStudio(studiosArr)
        }
        //get genres as options
        var genreArr = []
        props.genres.forEach(e => {
            var genreTemp = [
                <option key={e._id}>{e.Name}</option>
            ]
            genreArr.push(genreTemp)
        })
        if (genreArr.length === props.genres.length) {
            setGenre(genreArr)
        }

    return() => {
        document.getElementById('main-container').className = "h-auto overflow-auto"
        mounted = false
    }

},[update])

    const createItems = (event) => {
        props.redirect(false, 700, true)
        setTimeout(function(){ 
            setItems(event)
        }, 700);
        
    }



    
    if (items === 'Create Items') 
        return (
            <Animated className='col mt-5' animateOnMount animationIn="fadeInLeft" duration={{in:600}} animationOut="fadeOutLeft" isVisible={props.animate}>
                <div>
                    <Row>
                        <Button onClick={() => createItems('Create Game')} className='col-8 mx-auto btn-dark my-1'>Create Game</Button>
                    </Row>
                    <Row>
                        <Button onClick={() => createItems('Create Studio')} className='col-8 mx-auto btn-dark my-1'>Create Studio</Button>
                    </Row>                
                    <Row>
                        <Button onClick={() => createItems('Create Genre')} className='col-8 mx-auto btn-dark my-1'>Create Genre</Button>
                    </Row>
                    <Row>
                        <Button onClick={() => createItems(null)} className='col-4 mx-auto btn-dark my-2'>Back</Button>
                    </Row>
                </div>
            </Animated>
        )
    if (items === 'Create Game')
        return (
            <Animated className='col mt-5' animateOnMount animationIn="fadeInLeft" duration={{in:600}} animationOut="fadeOutLeft" isVisible={props.animate}>
                <h4 className='text-center'>Create Game</h4>
                <Form>
                    <Form.Group controlId="exampleForm.ControlInput1">
                        <Form.Label>Name</Form.Label>
                        <Form.Control type="text" placeholder="Game Name" onChange={(e) => setName(e.target.value)} />
                    </Form.Group>

                    <Form.Group controlId="exampleForm.ControlTextarea1">
                        <Form.Label>Description</Form.Label>
                        <Form.Control as="textarea" rows="3" onChange={(e) => setValue(e.target.value)}/>
                    </Form.Group>

                    <Form.Group controlId="exampleForm.ControlTextarea1">
                        <Form.Label>Image Link</Form.Label>
                        <Form.Control as="textarea" rows="1" onChange={(e) => setValue2(e.target.value)}/>
                    </Form.Group>

                    <Form.Group controlId="exampleForm.ControlSelect1">
                        <Form.Label>Studio</Form.Label>
                        <Form.Control as="select" onChange={(e) => setValue4(e.target.value)}>
                            <option></option>
                            {studio}
                        </Form.Control>
                    </Form.Group>
                    <Form.Group controlId="exampleForm.ControlSelect2">
                        <Form.Label>Genre</Form.Label>
                        <Form.Control as="select" multiple onChange={(e) => setValue3(e.target.value)}>
                            {genre}
                        </Form.Control>
                    </Form.Group>
                    <Form.Group controlId="exampleForm.ControlInput1">
                        <Form.Label>Number of local players</Form.Label>
                        <Form.Control type="number" placeholder="1" onChange={(e) => setValue5(e.target.value)}/>
                    </Form.Group>
                    <Row className='justify-content-center'>
                            <Button onClick={() => createItems('Create Items')} className='col-4 mx-2' variant='dark'>Back</Button>
                            <Button onClick={() => submitInfo('Game')} className='col-4 mx-2' variant='dark'>Submit</Button>
                    </Row>
                    {showError ?
                        <Alert show={showError} className='mt-2' variant="danger" onClose={() => setShow(false)} dismissible>
                            <Alert.Heading>Uh-Oh!</Alert.Heading>
                            {errorResult}
                        </Alert> :
                        <Alert show={show} className='mt-2' variant="success" onClose={() => setShow(false)} dismissible>
                            <Alert.Heading>Successfully created item</Alert.Heading>
                            
                        </Alert>}
                </Form>
            </Animated>
        )
    if (items === 'Create Genre')
        return (
            <Animated className='col mt-5' animateOnMount animationIn="fadeInLeft" duration={{in:600}} animationOut="fadeOutLeft" isVisible={props.animate}>
                <h4 className='text-center'>Create Genre</h4>
                <Form>
                    <Form.Group controlId="exampleForm.ControlInput1">
                        <Form.Label>Name</Form.Label>
                        <Form.Control type="text" placeholder="Genre Name" onChange={(e) => setName(e.target.value)} />
                    </Form.Group>

                    <Form.Group controlId="exampleForm.ControlTextarea1">
                        <Form.Label>Description</Form.Label>
                        <Form.Control as="textarea" rows="3" onChange={(e) => setValue(e.target.value)}/>
                    </Form.Group>

                    <Row className='justify-content-center'>
                            <Button onClick={() => createItems('Create Items')} className='col-4 mx-2' variant='dark'>Back</Button>
                            <Button className='col-4 mx-2' onClick={() => submitInfo('Genre')} variant='dark'>Submit</Button>
                    </Row>
                </Form>
                {showError ?
                <Alert show={showError} className='mt-2' variant="danger" onClose={() => setShow(false)} dismissible>
                <Alert.Heading>Uh-Oh!</Alert.Heading>
                    {errorResult}
                </Alert> :
                <Alert show={show} className='mt-2' variant="success" onClose={() => setShow(false)} dismissible>
                <Alert.Heading>Successfully created item</Alert.Heading>
                    
                </Alert>}
            </Animated>
    )
    if (items === 'Create Studio')
        return (
            <Animated className='col mt-5' animateOnMount animationIn="fadeInLeft" duration={{in:600}} animationOut="fadeOutLeft" isVisible={props.animate}>
                <h4 className='text-center'>Create Studio</h4>
                <Form>
                    <Form.Group controlId="exampleForm.ControlInput1">
                        <Form.Label>Name</Form.Label>
                        <Form.Control type="text" placeholder="Studio Name" onChange={(e) => setName(e.target.value)} />
                    </Form.Group>

                    <Form.Group controlId="exampleForm.ControlTextarea1">
                        <Form.Label>Description</Form.Label>
                        <Form.Control as="textarea" rows="3" onChange={(e) => setValue(e.target.value)}/>
                    </Form.Group>
                    <Form.Group controlId="exampleForm.ControlTextarea1">
                        <Form.Label>Year Founded</Form.Label>
                        <Form.Control type='number' placeholder='2000' onChange={(e) => setValue2(e.target.value)}/>
                    </Form.Group>
                    <Form.Group controlId="exampleForm.ControlTextarea1">
                        <Form.Label>Still Around Today?</Form.Label>
                        <Form.Control as="select" onChange={(e) => {e.target.value === "Yup!" ? setValue3(true) : setValue3(false) }}>
                            <option></option>
                            <option>Yup!</option>
                            <option>Nope!</option>
                        </Form.Control>
                    </Form.Group>

                    <Row className='justify-content-center'>
                            <Button onClick={() => createItems('Create Items')} className='col-4 mx-2' variant='dark'>Back</Button>
                            <Button onClick={() => submitInfo('Studio')} className='col-4 mx-2' variant='dark'>Submit</Button>
                    </Row>
                    {showError ?
                        <Alert show={showError} className='mt-2' variant="danger" onClose={() => setShow(false)} dismissible>
                            <Alert.Heading>Uh-Oh!</Alert.Heading>
                            {errorResult}
                        </Alert> :
                        <Alert show={show} className='mt-2' variant="success" onClose={() => setShow(false)} dismissible>
                            <Alert.Heading>Successfully created item</Alert.Heading>
                            
                        </Alert>}
                </Form>
            </Animated>
)
    return (
        <Animated className='col' animateOnMount animationIn="fadeInLeft" duration={{in:600}} animationOut="fadeOutLeft" isVisible={props.animate}>
            <ButtonGroup className='d-block my-3 col mx-auto' aria-label="Basic example">
            <Alert show={show} className='mt-2' variant="danger" onClose={() => setShow(false)} dismissible>
                <Alert.Heading>Uh-Oh!</Alert.Heading>
                {msg}
            </Alert>
                <h4 className='text-center'><u>Admin Functions</u></h4>
                <Row>
                    <Button className='col-8 mx-auto my-1' onClick={handleBtn} variant="danger">Manage Users</Button>
                </Row>
                <Row>
                    <Button className='col-8 mx-auto my-1' onClick={handleBtn} variant="danger">Edit Games</Button>
                </Row>
                <Row>
                    <Button className='col-8 mx-auto my-1' onClick={() => createItems('Create Items')} variant="success">Create New Item</Button>
                </Row>
                <Row>
                    <Button className='col-8 mx-auto my-1' onClick={handleBtn} title='66' variant="danger">Initiate Order 66</Button>
                </Row>
            </ButtonGroup>
        </Animated>
    )
}
