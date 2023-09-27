import path from 'path';
import LoadablePlugin from '@loadable/webpack-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';

const production = process.env.NODE_ENV === 'production';

export default {
    mode: production ? 'production' : 'development',
    resolve: {
        alias: {
            Src: path.resolve(__dirname, '../src'),
        },
        extensions: ['.js', '.jsx', '.ts', '.tsx'], //引入时可以忽略的后缀
    },
    devtool: 'cheap-module-source-map',
    plugins: [new CleanWebpackPlugin(), new LoadablePlugin()],
    module: {
        rules: [
            // {
            //     test: /\.s?css$/,
            //     exclude: /node_moduels/,
            //     // include: path.resolve(__dirname, '../src'),
            //     //loader的执行顺序是从右到左,从下到上
            //     use: ['style-loader', 'css-loader', 'sass-loader']
            // },
            {
                test: /\.module\.s?css$/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            modules: {
                                localIdentName: '[name]__[local]--[hash:base64:5]',
                            },
                        },
                    },
                    'sass-loader',
                ],
            },
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