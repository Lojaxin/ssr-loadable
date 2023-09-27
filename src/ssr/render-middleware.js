
import React from 'react';
import path from 'path';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { ChunkExtractor } from '@loadable/server';
// import App from '../App';
import routes from '../routes';
import HomeContext from '../store/home';

// 服务端渲染方法
export default function () {

    let statsFile = path.resolve(__dirname, '../../public/dist/web/loadable-stats.json');
    statsFile = statsFile.replace('public/public', 'public');

    console.log('--------', process.env.CUSTOM_ENV)
    if (process.env.CUSTOM_ENV === 'production') {
        console.log('生产环境')
    }

    return async (req, res) => {
        if (req.originalUrl?.includes('.')) {
            return res.send('');
        }

        // 创建一个渲染上下文
        const context = {};
        //引入routes文件,根据路由获取数据然后注入到context中
        const matchRouter = routes.find(item => item.path === req.url);
        if (matchRouter && matchRouter.onMouted) {
            const result = await matchRouter.onMouted();
            context[matchRouter.name] = result;
        }

        // 创建一个 ChunkExtractor，在渲染过程中收集需要的代码块
        const extractor = new ChunkExtractor({ statsFile });

        const { default: App } = extractor.requireEntrypoint();

        const jsx = extractor.collectChunks(
            <StaticRouter location={req.url} context={context}>
                <HomeContext.Provider value={context}>
                    <App />
                </HomeContext.Provider>
            </StaticRouter>
        )
        if (context.url) {
            return res.redirect(context.url);
        }
        const html = renderToString(jsx);

        res.status(200);
        res.setHeader("Content-Type", "text/html");
        res.send(`
            <!DOCTYPE html>
            <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>ssr</title>
                    ${extractor.getLinkTags()}
                    ${extractor.getStyleTags()}
                </head>
                <body>
                    <div id="app">${html}</div>
                    <script type="text/javascript" charSet="utf-8">
                        window.__STORE__ = ${JSON.stringify(context)}
                    </script>
                    ${extractor.getScriptTags()}
                </body>
            </html>
        `);
    }
}