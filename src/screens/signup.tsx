import React, { useState } from 'react';
import '../App.css';
import { Button, Col, Form, Image, Row, Spinner } from 'react-bootstrap';
import style from '../swap.module.css';
import { useDispatch } from 'react-redux';
import { SCREEN, updateScreen } from '../features/pick-screen/screen-picker';
import { signup } from '../graphql';

function SignUp() {
  const dispatch = useDispatch();
  const [signingUp, setSigningUp] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  async function handleSignUp(): Promise<void> {
    setSigningUp(true);
    if (username === "" || password === "") {
      alert("Username and password should not be empty");
      setSigningUp(false);
      return;
    }
    if (password !== password2) {
      alert("Wrong password confirmation");
      setSigningUp(false);
      return;
    }

    const success = await signup(username, password);
    if (success) {
      dispatch(updateScreen(SCREEN.APP_SCREEN));
    }

    setSigningUp(false);
  }

  return (    
    <div className="App">
      <header className="App-header">
      <div>
        <Image className={`${style['uni-logo']}`} src='https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Uniswap_Logo.svg/1026px-Uniswap_Logo.svg.png?'>
        </Image>

        <Form className={`${style['signup-container']}`}>
            <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
              <Form.Label column sm="4">
                Username
              </Form.Label>
              <Col sm="8">
                <Form.Control placeholder="Username" className={`${style['login-input']}`} onChange={(e) => {setUsername(e.target.value)}}/>
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3" controlId="formPlaintextPassword">
              <Form.Label column sm="4">
                Password
              </Form.Label>
              <Col sm="8">
                  <Form.Control type="password" placeholder="Password" className={`${style['login-input']}`} onChange={(e) => {setPassword(e.target.value)}}/>
            </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3" controlId="formPlaintextConfirmPassword">
              <Form.Label column sm="4">
                Confirm Password
              </Form.Label>
              <Col sm="8">
                  <Form.Control type="password" placeholder="Confirm password" className={`${style['login-input']}`} onChange={(e) => {setPassword2(e.target.value)}}/>
            </Col>
            </Form.Group>
            
        </Form>
        <Row>
          <Col sm={5}/>
          <Col sm={1}>
          <Button onClick={async() => {await handleSignUp()}}>
              Sign Up
          </Button>
          {signingUp && <Spinner animation="border" role="status"/>}
          </Col>
          <Col sm={2}>
          <Button onClick={() => { dispatch(updateScreen(SCREEN.LOGIN_SCREEN)) }}>
            Already had an account?
          </Button>
          </Col>
        </Row>

      </div>
      </header>


        
    </div>
  );
}

export default SignUp;
