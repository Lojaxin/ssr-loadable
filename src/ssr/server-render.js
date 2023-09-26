
import React from 'react';
import path from 'path';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { ChunkExtractor } from '@loadable/server'
import App from '../App';

// 服务端渲染方法
export default function () {

    let statsFile = path.resolve(__dirname, '../../public/dist/web/loadable-stats.json');
    statsFile = statsFile.replace('public/public', 'public');
    return async (req, res) => {
        if (req.originalUrl?.includes('.')) {
            return res.send('');
        }
        // 创建一个渲染上下文
        const context = { name: 'zs' };

        // 创建一个 ChunkExtractor，在渲染过程中收集需要的代码块
        const extractor = new ChunkExtractor({ statsFile })

        const jsx = extractor.collectChunks(
            <StaticRouter location={req.url} context={context}>
                <App />
            </StaticRouter>
        )

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
                    <textarea id="ssrCommonData" style="display:none;">
                        <-- 注入 context 数据到客户端 -->
                        ${JSON.stringify(context)}
                    </textarea>
                    ${extractor.getScriptTags()}
                </body>
            </html>
        `);
    }
}