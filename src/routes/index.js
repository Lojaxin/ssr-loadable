import React from 'react';
import { Link } from 'react-router-dom';
import Home from '../pages/Home';

const routers = [{
    path: '/',
    name: 'home',
    exact: true,
    element: <Home />,
    onMouted: async () => {
        return '1234'
    }
}, {
    path: '/some',
    name: 'some',
    element: <div>WOrld <Link to="/">回首页</Link></div>
}]

export default routers;
