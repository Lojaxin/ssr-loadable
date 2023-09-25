//根据不同环境，返回不同的webpack配置
import path from 'path';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import nodeExternals from 'webpack-node-externals'
import LoadablePlugin from '@loadable/webpack-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import { merge } from 'webpack-merge';

const production = process.env.NODE_ENV === 'production';

const defaultConfig = {
    resolve: {
        alias: {
            Src: path.resolve(__dirname, '../src'),
        },
        extensions: ['.js', '.jsx', '.ts', '.tsx'], //引入时可以忽略的后缀
    },
    plugins: [
        new CleanWebpackPlugin({
            cleanOnceBeforeBuildPatterns: ['images/*']
        }),
        new LoadablePlugin(),
        new MiniCssExtractPlugin()
    ],
    module: {
        rules: [
            {
                test: /\.(jpe?g|png|svg|gif|webp)$/,
                type: 'asset/resource',
                generator: {
                    filename: 'images/[name].[contenthash:8][ext]'
                }
            },
            {
                test: /\.s?css$/,
                exclude: /node_moduels/,
                //loader的执行顺序是从右到左,从下到上
                use: [
                    'style-loader',
                    'css-loader',
                    'sass-loader'
                ]
            }
        ],
    },
    optimization: {
        moduleIds: 'named',
        chunkIds: 'named',
    },
}

function getWebpackConfig(target) {
    const isNode = target === 'node';
    return merge(defaultConfig, {
        name: target,
        target,
        mode: production ? 'production' : 'development',
        externals: isNode ? ['@loadable/component', nodeExternals()] : undefined,
        devtool: 'cheap-module-source-map',
        entry: `./src/ssr/${isNode ? 'server' : 'client'}.js`,//多模块打包,key就是chunks的id,不写的话默认是main
        output: {
            path: path.join(__dirname, 'public/dist', target),
            // filename: production ? '[name]-bundle-[chunkhash:8].js' : '[name].js',
            filename: '[name].js',
            publicPath: `/dist/${target}/`,//这里的'/'指向的是public文件夹
            libraryTarget: isNode ? 'commonjs2' : undefined
        },
        module: {
            rules: [
                {
                    test: /\.(t|j)s(x?)$/,
                    exclude: /node_modules/,
                    // include: path.resolve(__dirname, '../src'),
                    use: [
                        {
                            loader: 'babel-loader',
                            options: {
                                caller: { target },
                            }
                        }
                    ]
                }
            ]
        }
    })
}

export default [getWebpackConfig('web'), getWebpackConfig('node')];