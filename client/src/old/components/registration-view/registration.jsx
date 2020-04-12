import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col'
import axios from 'axios';

export function RegisterView(props) {
    const [ username, setUsername ] = useState('');
    const [ password, setPassword ] = useState('');
    const [ email, setEmail ] = useState('');
    const [ birthday, setBirthday ] = useState('');



    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('https://opgamesapi.herokuapp.com/users', {
            Username: username,
            Password: password,
            Email: email,
            Birthday: birthday
        })
        .then(response => {
            const data = response.data;
            console.log(data);
            window.open('/', '_self');
        })
        .catch(e => {
            console.log('error registering user')
        });
        
    };

        return (
            <Form className='p-3'>
                <h1 className='text-center mb-5'>Register</h1>
            <Form.Row>
                <Form.Group as={Col} controlId="formGridUsername">
                <Form.Label>Username</Form.Label>
                <Form.Control type="email" placeholder="Enter Username" onChange={e => setUsername(e.target.value)} />
                </Form.Group>

                <Form.Group as={Col} controlId="formGridPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
                </Form.Group>
            </Form.Row>

            <Form.Group controlId="formGridEmail">
                <Form.Label>Email Address</Form.Label>
                <Form.Control placeholder="Enter Email" onChange={e => setEmail(e.target.value)} />
            </Form.Group>

            <Form.Group controlId="formGridBirthday">
                <Form.Label>Birthday</Form.Label>
                <Form.Control placeholder="Enter Birthday ex 01/05/1992" onChange={e => setBirthday(e.target.value)} />
            </Form.Group>
            <small>Form validation needed later</small>
            <Button className='d-block mx-auto mt-2' onClick={handleSubmit} variant="primary" type="submit">
                Submit
            </Button>
            </Form>
        );
    }

