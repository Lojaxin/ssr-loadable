## 一.安装必要的依赖
```
yarn add express react react-dom react-router-dom -S
yarn add webpack webpack-cli webpack-merge babel-loader babel-preset-xin @babel/node @babel/cli -D
``` 

## 二.创建必要的文件夹

|- public   //静态文件目录
|- config   //webpack的配置文件
    |-- webpack.base.js', //公共配置文件
    |-- webpack.client.js', //打包客户端代码
|- src      //工作目录
    |-- App.jsx',   //根组件
    |-- pages',     //页面组件
       |   |-- Home.jsx',
       |   |-- index.scss',
       |-- routes',
            |-- client-render.js',
            |-- index.js',
            |-- server-render.js',
|- index.js //node服务文件
|- babel.config.js  babel的配置文件

## 三.开发
> 首先:我们常说的SSR,是指浏览器访问我们的Node服务后,由node服务返回匹配当前url的页面,并返回打包好的client.js,因为剩下的操作都会交由CSR来处理;

-   1.创建服务;

```main.js
import renderHtml from './src/routes/server-render';
import express from 'express';

const app = express();
app.use(express.static('public'));
app.get('*', renderHtml());

app.listen(3000, () => {
    console.log('server is running at http://localhost:3000');
});
```

-   2.创建一个带路由的react页面组件;

```App.jsx
import React, { useEffect } from "react";
import { Link } from "react-router-dom";

export default function (props) {
    const handleClick = () => {
        console.log('handleClick')
    };

    useEffect(() => {
        console.log('useEffect')
    }, [])
    return (
        <div>
            <h1 className="test">Home</h1>
            <img src="/wate.png" alt="" width={200} />
            <button onClick={handleClick}>按钮</button>
            <br />
            <Link to="/some">some 页面</Link>
        </div>
    )

}
```

-   3.编写renderHtml,服务端渲染的核心renderToString

```renderHtml.js

import { renderToString } from 'react-dom/server';

export default function(){
    return (req,res) => {
        const html = renderToString(<App/>)
        res.status(200);
        res.setHeader("Content-Type", "text/html");
        res.send(`
            <!DOCTYPE html>
            <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>ssr</title>
                </head>
                <body>
                    <div id="app">${html}</div>
                </body>
            </html>
        `);
    }
}
```

-   4.因为node环境无法执行ESM的语法,需要babel来进行解析,所以这里使用nodemon来执行

```nodemon.json
{
    "ignore": [
        "pages",
        "public"
    ],
    "execMap": {
        "js": "babel-node",
        "jsx": "babel-node"
    }
}
```
-   5.启动服务,这个时候页面可以正常渲染,但是事件没有了,这就需要我们将代码再 build 一份,水合到返回的html string中;


## 四.水合
-   1.还是使用webpack来进行客户端的build,创建 webpack.client.babel.js( .babel的配置会默认以babel来解析,可以直接使用ESM语法 );
```webpack.client.babel.js
import path from 'path';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';

const production = process.env.NODE_ENV === 'production';

export default {
    mode: production ? 'production' : 'development',
    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'], //引入时可以忽略的后缀
    },
    entry: {
        main: path.resolve(__dirname, '../src/ssr/client-render.js'), //多模块打包的chunks.id
    },
    output: {
        path: path.resolve(__dirname, '../public/dist/web'),
        filename: 'client.js',
        publicPath: `/dist/web/`,//这里的'/'指向的是public文件夹
    },
    devtool: 'cheap-module-source-map',
    plugins: [new CleanWebpackPlugin()],
    module: {
        rules: [
            {
                test: /\.(jpe?g|png|svg|gif|webp)$/,
                type: 'asset/resource',
                generator: {
                    filename: 'public/images/[name].[contenthash:8][ext]'
                }
            },
            {
                test: /\.(t|j)s(x?)$/,
                exclude: [/node_modules/, /bundle/],
                // include: path.resolve(__dirname, '../src'),
                use: [
                    {
                        loader: 'babel-loader'
                    }
                ]
            }]
    }
}
```

```renderHtml.js
 <body>
    <div id="app">${html}</div>
    <script src="/dist/web/client.js">
</body>
```

-   2.模块分割
>   上面的打包出来的客户端文件会把所有的代码都打包进去,如果我们仅仅去访问一个页面,是不需要这些多余的代码,所以模块分割很必要;
yarn add @loadable/server @loadable/component -S && yarn add @loadable/babel-plugin @loadable/webpack-plugin @babel/plugin-syntax-dynamic-import

