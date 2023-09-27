import React from "react";
import { BrowserRouter } from "react-router-dom";
import { hydrateRoot } from 'react-dom/client';
import { loadableReady } from '@loadable/component'
import App from '../App';
import HomeContext from '../store/home';

loadableReady(() => {
    if (typeof window === 'undefined') return;
    const store = window.__STORE__;

    //客户端的组件
    hydrateRoot(document.getElementById('app'),
        <BrowserRouter>
            <HomeContext.Provider value={store}>
                <App />
            </HomeContext.Provider>
        </BrowserRouter>
    )
})

