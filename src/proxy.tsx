import React, { useLayoutEffect } from 'react';
import { RootStateOrAny, useDispatch, useSelector } from 'react-redux';
import { SCREEN, updateScreen } from './features/pick-screen/screen-picker';
import App from './screens/App';
import Login from './screens/login';
import SignUp from './screens/signup';
import { refereshToken } from './graphql';
import Dashboard from './screens/dashboard';

function Proxy() {
    const dispatch = useDispatch();
    const screen = useSelector((state: RootStateOrAny) => state.screen);

    useLayoutEffect(() => {
        async function fetchToken() {
            const token = localStorage.getItem("token");
            if (token) {
                const newToken = await refereshToken(token);
                if (newToken !== "") {
                    localStorage.setItem(
                        "token",
                        newToken
                    );
                    if (screen === SCREEN.LOGIN_SCREEN || screen === SCREEN.SIGNUP_SCREEN) {
                        dispatch(updateScreen(SCREEN.APP_SCREEN));
                    }
                } else {
                    localStorage.removeItem("token");
                }
            }
        }
        fetchToken();
    });

    switch(screen) {
        case SCREEN.LOGIN_SCREEN:
            return <Login/>
        case SCREEN.SIGNUP_SCREEN:
            return <SignUp/>
        case SCREEN.DASHBOARD_SCREEN:
            return <Dashboard/>
        case SCREEN.APP_SCREEN:
                return <App/>
        default:
            return <></>
    }
}

export default Proxy;