import React, { useEffect, useState } from 'react';
import './css/App.css';
import { Col, Container, Image, ListGroup, Row } from 'react-bootstrap';
import style from './css/swap.module.css';
import { useDispatch } from 'react-redux';
import { SCREEN, updateScreen } from '../features/pick-screen/screen-picker';
import { getToken, getTopTokens, getTopTradedPair, Pair, Token } from '../graphql';
import { numberWithCommas } from '../utils';
import { updateToken } from '../features/pick-token/token-picker';
import { ArrowLeft, ArrowRight } from 'react-bootstrap-icons';

function Dashboard() {
  const dispatch = useDispatch();
  

  const [pagePair, setPagePair] = useState<number>(1);
  const [topPairs, setTopPairs] = useState<Pair[]>([]);
  const [pageToken, setPageToken] = useState<number>(1);
  const [topTokens, setTopTokens] = useState<Token[]>([]);

  async function handleChoosePair(event: any) {
    dispatch(updateToken({
        id: 0,
        token: await getToken(topPairs[event].token0)
    }))
    dispatch(updateToken({
        id: 1,
        token: await getToken(topPairs[event].token1)
    }))
    dispatch(updateScreen(SCREEN.APP_SCREEN))
  }

  async function handleChooseToken(event: any) {
    dispatch(updateToken({
        id: 0,
        token: await getToken('tether')
    }))
    dispatch(updateToken({
        id: 1,
        token: await getToken(topTokens[event].id)
    }))
    dispatch(updateScreen(SCREEN.APP_SCREEN))
  }

  useEffect(() => {
      async function getPairs() {
        setTopPairs(await getTopTradedPair(pagePair));
      }
      getPairs();
  }, [pagePair])

  useEffect(() => {
    async function getTokens() {
        setTopTokens(await getTopTokens(pageToken));
    }
    getTokens();
  }, [pageToken])

  function getPairList() {
      return topPairs.map((pair, index) => 
        <ListGroup.Item key={pair.id} className={style['pair-container']} eventKey={index}>
            <Row style={{maxHeight: "100%"}} >
                <Col xs={2} style={{fontSize: "22px"}} className={style['cell-border']}>
                    <div className={style['number-cell']}>
                        {(10 * (pagePair - 1) + index + 1)}
                    </div>
                </Col>
                <Col xs={1} className={style['cell-border']}>
                    <div className={`${style['center-image-container']}`}>
                        <Image className={style['center-image']} src={pair.icon0} style={{ maxWidth: "30px", width: "30px" }} >

                        </Image>
                    </div>
                </Col>
                <Col xs={1}>
                    <div className={`${style['center-image-container']}`}>
                        <Image className={style['center-image']} src={pair.icon1} style={{ maxWidth: "30px", width: "30px" }} >

                        </Image>
                    </div>
                </Col>
                <Col xs={5} style={{fontSize: "22px"}} className={style['cell-border']}>
                    <div>
                        {'$' + numberWithCommas(pair.totalVolumeRecorded, true)}
                    </div>
                </Col>
                <Col xs={3} style={{fontSize: "22px"}} className={style['cell-border']}>
                    <div>
                        {'$' + numberWithCommas(pair.marketCap, true)}
                    </div>
                </Col>
            </Row>
        </ListGroup.Item>
      )
  }

  function getTokenList() {
    return topTokens.map((token, index) => 
        <ListGroup.Item key={index} className={style['pair-container']} eventKey={index}>
            <Row style={{maxHeight: "100%"}} >
                <Col xs={2} style={{fontSize: "22px"}} className={style['cell-border']}>
                    <div className={style['number-cell']}>
                        {10 * (pageToken - 1) + index + 1}
                    </div>
                </Col>
                <Col xs={2} className={style['cell-border']}>
                    <div className={`${style['center-image-container']}`}>
                        <Image className={style['center-image']} src={token.iconURL} style={{ maxWidth: "30px", width: "30px" }} >

                        </Image>
                    </div>
                </Col>
                <Col xs={5} style={{fontSize: "22px"}} className={style['cell-border']}>
                    <div>
                        {'$' + numberWithCommas(token.price * token.totalSupply, true)}
                    </div>
                </Col>
                <Col xs={3} style={{fontSize: "22px"}} className={style['cell-border']}>
                    <div>
                        {'$' + numberWithCommas(token.price, true)}
                    </div>
                </Col>
            </Row>
        </ListGroup.Item>
    )
  }

  return (    
    <div className="App">
    <header className="App-header">
    <div>
      <Image className={`${style['uni-logo']} ${style['arrow']}`} onClick={() => {dispatch(updateScreen(SCREEN.APP_SCREEN))}} src='https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Uniswap_Logo.svg/1026px-Uniswap_Logo.svg.png?'>
      </Image>
        <Container>
            <Row>
            <Col xs={6} >
                <div className={style['token-pair-list']}>
                    <Row xs={1} className={style['no-padding']}>
                        <div style={{fontSize: "25px", marginTop: "1%"}}>
                            TOP TRADING PAIRS
                        </div>
                    </Row>

                    <Row style={{maxHeight: "100%"}}>
                        <Col xs={2} style={{fontSize: "22px"}} className={style['no-padding']}>
                            <div className={style['number-cell']}>
                                ID
                            </div>
                        </Col>
                        <Col xs={2}className={style['no-padding']}>
                            <div className={`${style['center-image-container']}`} style={{fontSize: "22px"}}>
                                {'Pair'}
                            </div>
                        </Col>
                        <Col xs={5} style={{fontSize: "22px"}} className={style['no-padding']}>
                            <div>
                                {'Trading volume'}
                            </div>
                        </Col>
                        <Col xs={3} style={{fontSize: "22px"}} className={style['no-padding']}>
                            <div>
                                {'Marketcap'}
                            </div>
                        </Col>
                    </Row>
                    <Row style={{borderTop: "3px", borderBottom: "0px", borderColor: "#282c34", borderStyle: "solid", height: "10px"}}>
                        
                    </Row>
                    <Row>
                        <div>
                            <ListGroup onSelect={(e) => handleChoosePair(e)}>
                                {getPairList()}        
                            </ListGroup>
                        </div>
                    </Row>
                </div>
                <div>
                    <Row>
                        <Col xs={4}>
                        </Col>
                        <Col xs={1}>
                            <ArrowLeft className={style['arrow']} onClick={() => {setPagePair(Math.max(1, pagePair - 1))}} />
                        </Col>
                        <Col xs={1}>
                            {pagePair}
                        </Col>
                        <Col xs={1} className={style['no-padding']}>
                            <ArrowRight className={style['arrow']} onClick={() => {setPagePair(pagePair + 1 )}}/>
                        </Col>
                        <Col xs={4}>
                        
                        </Col>
                    </Row>
                </div>
            </Col>

            <Col xs={6}>
                <div className={style['token-pair-list']}>
                    <Row xs={1}>
                        <div style={{fontSize: "25px", marginTop: "1%"}}>
                            TOP MARKETCAP TOKENS
                        </div>
                    </Row>
                    <Row style={{maxHeight: "100%"}}>
                        <Col xs={2} style={{fontSize: "22px"}}>
                            <div className={style['number-cell']}>
                                ID
                            </div>
                        </Col>
                        <Col xs={2}>
                            <div className={`${style['center-image-container']}`} style={{fontSize: "22px"}}>
                                {'Token'}
                            </div>
                        </Col>
                        <Col xs={5} style={{fontSize: "22px"}}>
                            <div>
                                {'Marketcap'}
                            </div>
                        </Col>
                        <Col xs={3} style={{fontSize: "22px"}}>
                            <div>
                                {'Price'}
                            </div>
                        </Col>
                    </Row>

                    <Row style={{borderTop: "3px", borderBottom: "0px", borderColor: "#282c34", borderStyle: "solid", height: "10px"}}>
                        
                    </Row>
                    <Row>
                        <div>
                            <ListGroup onSelect={(e) => handleChooseToken(e)}>
                                {getTokenList()}        
                            </ListGroup>
                        </div>
                    </Row>
                </div>
                <div>
                    <Row>
                        <Col xs={4}>
                        </Col>
                        <Col xs={1}>
                            <ArrowLeft className={style['arrow']} onClick={() => {setPageToken(Math.max(1, pageToken - 1))}} />
                        </Col>
                        <Col xs={1}>
                            {pageToken}
                        </Col>
                        <Col xs={1} className={style['no-padding']}>
                            <ArrowRight className={style['arrow']} onClick={() => {setPageToken(pageToken + 1 )}}/>
                        </Col>
                        <Col xs={4}>
                        
                        </Col>
                    </Row>
                </div>
            </Col>
        </Row>
        </Container>
      
    </div>
    </header>        
  </div>
  );
}

export default Dashboard;
