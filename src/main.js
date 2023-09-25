import path from 'path';
import React from 'react';
import express from 'express';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { ChunkExtractor } from '@loadable/server';

class Launcher {
    constructor(opts) {
        this.options = opts;    //初始化配置
        this.props = {};    //启动时需要的配置
        this.middlewares = [];
    }
    start(config) {
        this.props = config;

        // console.dir(process.env, { depth: 1 });
        //根据当前环境判断是否服务端渲染
        const isBrowser = process.env.BROWSER ?? false;
        if (this.options.ssr && !isBrowser) {
            //SSR
            return this.ssr();
        } else {
            //CSR

        }
    }
    ssr() {
        const server = express();
        // const webpack = require('webpack')
        // //获取webpack
        // this.webpackConfig = getWebpackConfig('node');
        // const compiler = webpack(this.webpackConfig);
        //如果需要修改内存中的文件，可以使用webpack-dev-middleware
        //const webpackDevMiddleware = require('webpack-dev-middleware')

        this.middlewares.forEach(middleware => {
            server.use(middleware);
        });

        const nodeStats = path.resolve(
            __dirname,
            '../public/dist/node/loadable-stats.json',
        )

        const webStats = path.resolve(
            __dirname,
            '../public/dist/web/loadable-stats.json',
        )

        server.get("*", (req, res) => {

            const context = { name: 'ssr' }
            // 创建一个 ChunkExtractor，在渲染过程中收集需要的代码块
            const nodeExtractor = new ChunkExtractor({ statsFile: nodeStats })
            const webExtractor = new ChunkExtractor({ statsFile: webStats })

            const { default: App } = nodeExtractor.requireEntrypoint()

            const jsx = webExtractor.collectChunks(
                <StaticRouter location={req.url} context={context}>
                    <App />
                </StaticRouter>
            );
            const html = renderToString(jsx);
            res.set('content-type', 'text/html')
            res.send(`
                <!DOCTYPE html>
                <html>
                    <head>
                    ${webExtractor.getLinkTags()}
                    ${webExtractor.getStyleTags()}
                    </head>
                    <body>
                    <div id="main">${html}</div>
                    ${webExtractor.getScriptTags()}
                    </body>
                </html>
                `)
        });
        server.listen(3000, () => console.log('server render at http://localhost:3000'));
    }
    //支持扩展中间件
    use(middleware) {
        this.middlewares.push(middleware);
    }
};

const app = new Launcher({ ssr: true });

app.use(express.static(path.join(process.cwd(), 'public')));

app.start();