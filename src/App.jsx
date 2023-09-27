import React from 'react';
import { Route, Routes } from 'react-router-dom';
import routers from './routes';

function App(props) {
    console.log('%c [ Appprops ]-6', 'font-size:13px; background:pink; color:#bf2c9f;', props)
    return (
        <div>
            <h1>React SSR Layout</h1>
            <Routes >
                {
                    routers.map(router => (
                        <Route key={router.path} path={router.path} exact={router.exact} element={router.element} />
                    ))
                }
            </Routes>
        </div>
    )
}

export default App;