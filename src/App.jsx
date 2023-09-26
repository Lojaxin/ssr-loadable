import React from 'react';
import { Route, Routes } from 'react-router-dom';
import routers from './routes';

export default function App() {
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