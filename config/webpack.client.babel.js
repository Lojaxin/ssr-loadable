import path from 'path';
import { merge } from 'webpack-merge';
import defaultConfig from './webpack.base.babel';

const clientConfig = {
    entry: {
        main: path.resolve(__dirname, '../src/ssr/client-render.js')
    },
    output: {
        path: path.resolve(__dirname, '../public/dist/web'),
        filename: 'client.js',
        publicPath: `/dist/web/`,//这里的'/'指向的是public文件夹
    },
}

module.exports = function ({ development }) {
    return merge(defaultConfig, clientConfig);
};