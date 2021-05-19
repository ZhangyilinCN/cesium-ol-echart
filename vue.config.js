// vue.config.js
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  configureWebpack: config => {
    const cwp = new CopyWebpackPlugin([
      // {
      //   from: './public/lib',
      //   to: 'js/lib',
      //   toType: 'dir'
      // },
    ]);
    config.plugins.push(cwp);
  },
  devServer: {
    open: true,
    // port: 8801, // 自定义修改8080端口
    proxy: {
      '/audio': {
        target: 'http://192.168.43.105:9202',
        changeOrigin: true
      }
    }
  },
  publicPath: './',
}