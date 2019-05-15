// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path')

module.exports = {
  build: {
    env: require('./prod.env'),
    index: path.resolve(__dirname, '../html/index.html'),//dist ago配置入口文件
    assetsRoot: path.resolve(__dirname, '../html'),//dist ago//
    assetsSubDirectory: 'static',//配置非入口文件的文件夹名
    assetsPublicPath: '/html/',//配置公共根目录
    productionSourceMap: false,//是否生成源文件指引
    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,//是否Gzip压缩
    productionGzipExtensions: ['js', 'css'],
    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report` 以这种方式打包可生成文件分析图表
    // Set to `true` or `false` to always turn it on or off
     // bundleAnalyzerReport:true,
    bundleAnalyzerReport: process.env.npm_config_report//代码分析配置
  },
  dev: {
    env: require('./dev.env'),
    port: 8888,//本地环境端口号
    autoOpenBrowser: true,//是否自动打开浏览器
    assetsSubDirectory: 'static',//文件生成的公共目录
    assetsPublicPath: '/',
    proxyTable: {},
    // CSS Sourcemaps off by default because relative paths are "buggy"
    // with this option, according to the CSS-Loader README
    // (https://github.com/webpack/css-loader#sourcemaps)
    // In our experience, they generally work as expected,
    // just be aware of this issue when enabling this option.
    cssSourceMap: false//是否显示css源文件的指引
  }
}
