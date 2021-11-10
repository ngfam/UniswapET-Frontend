import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import { Button, Col, Container, Form, Image, Row, Spinner } from 'react-bootstrap';
import style from './swap.module.css';
import { RootStateOrAny, useSelector } from 'react-redux';
import CoinSelector from './coin-list';
import { getExchangeRate, getUserBalance, swap } from './graphql';

function App() {
  const [inAmount, setInAmount] = useState<number>(0)
  const [outAmount, setOutAmount] = useState<number>(0)
  const [inBalance, setInBalance] = useState<number>(0)
  const [outBalance, setOutBalance] = useState<number>(0)
  const [isSwapping, setIsSwapping] = useState<boolean>(false);
  const [counter, setCounter] = useState<number>(0);

  const inRef = useRef(null);
  const outRef = useRef(null);
  const tokens = useSelector((state: RootStateOrAny) => state.token.tokens);

  useEffect(() => {
    async function updateInBalance() {
      setInBalance(await getUserBalance(tokens[0].id));
    }
    updateInBalance();
  }, [counter, tokens]) 

  useEffect(() => {
    async function updateOutBalance() {
      setOutBalance(await getUserBalance(tokens[1].id));
    }
    updateOutBalance();
  }, [counter, tokens]) 

  function getInAmountUSD() {
    return (inAmount * tokens[0].price).toFixed(2)
  }

  function getOutAmountUSD() {
    return (outAmount * tokens[1].price).toFixed(2)
  }

  async function handleInAmountChange(event: any) {
    event.preventDefault();
    let eventValue = 0;
    if (event.target.value.length > 0) {
      eventValue = parseFloat(event.target.value);
    }
    setInAmount(eventValue);
    let value = await getExchangeRate(tokens[0].id, tokens[1].id, eventValue);
    setOutAmount(value);
    const elem = document.getElementById('swapFrom.controlOutTokenAmount');
    elem?.setAttribute('value', value.toFixed(2).toString());
  }

  async function handleOutAmountChange(event: any) {
    event.preventDefault();
    let eventValue = 0;
    if (event.target.value.length > 0) {
      eventValue = parseFloat(event.target.value);
    }
    setOutAmount(eventValue);
    let value = await getExchangeRate(tokens[0].id, tokens[1].id, 1);
    value = eventValue * 1/value;
    setInAmount(value);
    const elem = document.getElementById('swapFrom.controlInTokenAmount');
    elem?.setAttribute('value', value.toFixed(2).toString());
  }

  async function handleSwap() {
    setIsSwapping(true);
    await swap(tokens[0].id, tokens[1].id, inAmount);
    setIsSwapping(false);
    setCounter(counter + 1);
  }

  return (    
    <div className="App">
      <header className="App-header">
      <div>
        <Image className={`${style['uni-logo']}`} src='https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Uniswap_Logo.svg/1026px-Uniswap_Logo.svg.png?'>
        </Image>
      </div>

      <Form>
        <Container className={`${style['swap-container']} ${style['swap-box']}`}>
            <Row style={{
              height: 50
            }}>
              <Col xs={3}>
                <div className={`${style['top-left-text']}`}>
                  Swap
                </div>
              </Col>
              <Col xs={9} >
                <div className={`${style['top-right-text']}`}>
                  Balance: {inBalance.toFixed(2)} {" "} {tokens[0].name}
                </div>
              </Col>
            </Row>
            <Row className={`${style['input-box']}`}>
              <CoinSelector tokenId={0}/>
              <Col xs={6} className={`${style['center-column']} ${style['no-padding']}`} >
                <Row className={`${style['input-row']} ${style['no-padding']}`}>
                  <Form.Group controlId='swapFrom.controlInTokenAmount' className={`${style['no-padding']}`}>
                    <Form.Control className={`${style['token-amount']}`} ref={inRef} type='number' placeholder='0.0' step={0.001} onChange={async(event) => {await handleInAmountChange(event);}}>
                    </Form.Control>
                  </Form.Group>
                </Row> 
                 <Row >
                  <div className={`${style['value-row']}`}> 
                      ~ {getInAmountUSD()}$
                  </div>
                </Row>          
              </Col>
            </Row>
            <div style={{height: 10}} id='placeholder'/>
            <Row className={`${style['input-box']}`}>
              <CoinSelector tokenId={1}/>
              <Col xs={6} className={`${style['center-column']} ${style['no-padding']}`} >
                <Row className={`${style['input-row']} ${style['no-padding']}`}>
                  <Form.Group controlId='swapFrom.controlOutTokenAmount' className={`${style['no-padding']}`}>
                    <Form.Control className={`${style['token-amount']}`} ref={outRef} type='number' placeholder='0.0' step={0.001} onChange={async(event) => {await handleOutAmountChange(event);}}>
                    </Form.Control>
                  </Form.Group>
                </Row> 
                 <Row >
                  <div className={`${style['value-row']}`}> 
                      ~ {getOutAmountUSD()}$
                  </div>
                </Row>          
              </Col>
            </Row>

            <Row style={{height: 50, fontSize: 14}} id="bottom-balance">
              <Col>
                <div style={{marginTop: "1%", textAlign: "right", marginRight: "1%"}}>
                  Balance: {outBalance.toFixed(2)} {" "} {tokens[1].name}
                </div>
              </Col>
            </Row>
        </Container>

        <div style={{height: 10}} id='placeholder'/>
        <Button onClick={() => {handleSwap(); }}>
          SWAP
        </Button>
        {isSwapping && <Spinner animation='border'/>}
      </Form>
      </header>
    </div>
  );
}

export default App;
