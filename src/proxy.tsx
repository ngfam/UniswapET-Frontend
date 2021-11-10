import React, { useLayoutEffect } from 'react';
import { RootStateOrAny, useDispatch, useSelector } from 'react-redux';
import { SCREEN, updateScreen } from './features/pick-screen/screen-picker';
import App from './App';
import Login from './screens/login';
import SignUp from './screens/signup';
import { refereshToken } from './graphql';

function Proxy() {
    const dispatch = useDispatch();
    const screen = useSelector((state: RootStateOrAny) => state.screen);

    useLayoutEffect(() => {
        async function fetchToken() {
            const token = localStorage.getItem("token");
            if (token) {
                localStorage.setItem(
                    "token",
                    await refereshToken(token)
                );
                if (screen === SCREEN.LOGIN_SCREEN || screen === SCREEN.SIGNUP_SCREEN) {
                    dispatch(updateScreen(SCREEN.APP_SCREEN));
                }
            }
        }
        fetchToken();
    });

    switch(screen) {
        case SCREEN.APP_SCREEN:
            return <App/>
        case SCREEN.LOGIN_SCREEN:
            return <Login/>
        case SCREEN.SIGNUP_SCREEN:
            return <SignUp/>
        default:
            return <></>
    }
}

export default Proxy;