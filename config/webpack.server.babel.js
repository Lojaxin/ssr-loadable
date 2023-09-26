import path from 'path';
import { merge } from 'webpack-merge';
import defaultConfig from './webpack.base.babel';
import nodeExternals from 'webpack-node-externals';

const serverConfig = {
    target: 'node',
    entry: {
        main: path.resolve(__dirname, '../index.js'),//main就是loadable-stats.json中的chunks.id
    },
    output: {
        path: path.resolve(__dirname, '../public/dist/node'),
        filename: 'main.js',
        publicPath: `/dist/web/`,//这里的'/'指向的是public文件夹
        libraryTarget: 'commonjs2'
    },
    //不用打包的模块
    externals: ['@loadable/component', nodeExternals()],
}

export default function (config) {
    return merge(defaultConfig, serverConfig);
};