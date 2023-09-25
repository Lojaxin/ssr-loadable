module.exports = function (api) {
    const isWebpack = api.caller(caller => Boolean(caller && caller.name === 'babel-loader'));
    console.log('%c [ isWebpack ]-6', 'font-size:13px; background:pink; color:#bf2c9f;', isWebpack)
    return {
        presets: ['babel-preset-xin'],
        plugins: ['@babel/plugin-syntax-dynamic-import', '@loadable/babel-plugin']
    };
}
