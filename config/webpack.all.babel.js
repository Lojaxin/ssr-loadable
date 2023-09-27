import path from 'path';
import { merge } from 'webpack-merge';
import defaultConfig from './webpack.base.babel';
import nodeExternals from 'webpack-node-externals';

//用来打包整体服务
const _config = {
    target: 'node',
    entry: {
        main: path.resolve(__dirname, '../index.js'),//main就是chunks.id
    },
    output: {
        path: path.resolve(__dirname, '../public/dist/server'),
        filename: 'main.js',
    },
    //不用打包的模块
    externals: ['@loadable/component', nodeExternals()],
}

export default function (config) {
    return merge(defaultConfig, _config);
};