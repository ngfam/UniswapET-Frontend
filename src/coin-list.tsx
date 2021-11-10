import React, { useEffect, useState } from "react";
import { Form, Dropdown, Col, Row, Image, Container } from "react-bootstrap";
import { useDispatch, useSelector, RootStateOrAny } from "react-redux";
import './App.css';
import { updateToken } from "./features/pick-token/token-picker";
import { getTokenSearchList, Token } from "./graphql";
import style from './swap.module.css';

export const CoinSelector = (props: any) => {

    const [tokenDropdown, setTokenDropDown] = useState(false);
    const [tokenData, setTokenData] = useState< Token[] >([]);
    const [searchText, setSearchText] = useState("");

    const tokens = useSelector((state: RootStateOrAny) => state.token.tokens);
    const dispatch = useDispatch();


    useEffect(() => {
        async function fetchTokenList(): Promise<void> {
            const tokenList = await getTokenSearchList(searchText);
            setTokenData(tokenList);
        }
        fetchTokenList();
    }, [tokenDropdown, searchText]) 

    function handleSelectToken(event: any) {
        dispatch(updateToken({
            id: props.tokenId,
            token: tokenData[event]
        }))
    }

    function getTokenListDropdown() {
        return tokenData?.map((token, index) => 
            <div key={token.id}>
                <Dropdown.Item eventKey={index} className={`${style['dropdown-item']} ${style['no-padding']}`} >
                    <Container>
                        <Row>
                        <Col xs={4} className={style['no-padding']}>
                            <Image src={token.iconURL} className={style['dropdown-icon']}/>
                        </Col>
                        <Col xs={8} className={`${style['no-padding']} ${style['dropdown-token-name']}`}>
                            {token.name}            
                        </Col>
                        </Row>
                    </Container>
                </Dropdown.Item>
            </div>
        )
    }

    return (

        <Col className={`${style['center-column']}`} xs={6}>
            {
                tokenDropdown && 
                <Form.Group controlId='swapFrom.controlTokenId' className={`${style['no-padding']}`}>
                    <Form.Control className={`${style['token-search']}`} type='text' placeholder={tokens[props.tokenId].name} autoFocus={true} onChange={event => setSearchText(event.target.value)}>

                    </Form.Control>
                </Form.Group>
            }
            <Dropdown className={`${style['dropdown']}`} show={tokenDropdown} onClick={ () => setTokenDropDown(!tokenDropdown) } onSelect={handleSelectToken}>
                {
                    !tokenDropdown && 
                    <Container>
                        <Row className={`${style['token-icon-div']}`}>
                            <Col xs={4}>
                                <div className={`${style['icon-container']}`}>
                                <Image src={tokens[props.tokenId].iconURL} className={`${style['icon']}`}>

                                </Image>
                                </div>
                            </Col>

                            <Col xs={8} className={`${style['token-name']}`}>
                                {tokens[props.tokenId].name}
                            </Col>                  
                        </Row>
                    </Container>
                }
                <Dropdown.Menu className={`${style['dropdown-menu']}`}>
                    {getTokenListDropdown()}
                </Dropdown.Menu>
            </Dropdown>
        </Col>
    );

}


export default CoinSelector;