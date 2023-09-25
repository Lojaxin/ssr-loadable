import React from 'react';
import Home from './pages/Home';

const routers = [{
    path: '/',
    exact: true,
    element: <Home />,
    onMouted: async () => {
        return '1234'
    }
}, {
    path: '/some',
    element: <div>WOrld</div>
}]

export default routers;