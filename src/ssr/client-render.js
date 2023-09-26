import React from "react";
import { BrowserRouter } from "react-router-dom";
import { hydrateRoot } from 'react-dom/client';
import { loadableReady } from '@loadable/component'
import App from '../App';

loadableReady(() => {
    //客户端的组件
    hydrateRoot(document.getElementById('app'),
        <BrowserRouter>
            <App />
        </BrowserRouter>
    )
})

