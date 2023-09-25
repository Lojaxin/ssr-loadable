import React from "react";
import { BrowserRouter } from "react-router-dom";
import { hydrateRoot } from 'react-dom/client';
import { loadableReady } from '@loadable/component'
import App from '../pages/App';

loadableReady(() => {
    //客户端的组件
    hydrateRoot(document.getElementById('main'),
        <BrowserRouter>
            <App />
        </BrowserRouter>
    )
})

