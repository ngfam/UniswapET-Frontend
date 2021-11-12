import React, { useState } from 'react';
import './css/App.css';
import { Button, Col, Form, Image, Row, Spinner } from 'react-bootstrap';
import style from './css/swap.module.css';
import { useDispatch } from 'react-redux';
import { SCREEN, updateScreen } from '../features/pick-screen/screen-picker';
import { login } from '../graphql';

function Login() {
  const dispatch = useDispatch();

  const [loggingIn, setLoggingIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(): Promise<void> {
    setLoggingIn(true);
    const success = await login(username, password);
    if (success) {
      dispatch(updateScreen(SCREEN.APP_SCREEN));
    }
    setLoggingIn(false);
  }

  return (    
    <div className="App">
      <header className="App-header">
      <div>
        <Image className={`${style['uni-logo']}`} src='https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Uniswap_Logo.svg/1026px-Uniswap_Logo.svg.png?'>
        </Image>

        <Form className={`${style['login-container']}`} onSubmit={async() => {await handleSubmit()}}>
          <Form.Group as={Row} className="mb-3" controlId="formPlaintextUsername">
              <Form.Label column sm="3">
                Username
              </Form.Label>
              <Col sm="9">
                <Form.Control placeholder="Username" className={`${style['login-input']}`} onChange={(e) => {setUsername(e.target.value)}}/>
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3" controlId="formPlaintextPassword">
              <Form.Label column sm="3">
                Password
              </Form.Label>
              <Col sm="9">
                  <Form.Control type="password" placeholder="Password" className={`${style['login-input']}`} onChange={(e) => {setPassword(e.target.value)}}/>
            </Col>
          </Form.Group>
        </Form>
        <Row>
          <Col sm={5}/>
          <Col sm={1}>
          <Button onClick={async() => {await handleSubmit()}}>
              Log in
          </Button>
          {loggingIn && <Spinner animation="border" role="status"/>}
          </Col>
          <Col sm={2}>
          <Button onClick={() => { dispatch(updateScreen(SCREEN.SIGNUP_SCREEN)) }}>
            Or sign up one
          </Button>
          </Col>
        </Row>
      </div>
      </header>        
    </div>
  );
}

export default Login;
