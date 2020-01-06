
const Terser = require('terser-webpack-plugin')

module.exports = {
  lintOnSave: process.env.NODE_ENV !== 'production',
  publicPath: '/',
  runtimeCompiler: true,
  productionSourceMap: false,
  configureWebpack: {
    optimization: {
      minimizer: [
        new Terser({
          test: /\.m?js$/
        })
      ],
      splitChunks: {
        cacheGroups: {
          vue: {
            name: 'vue',
            test: /[\\/]node_modules[\\/](vue|vue-router|vuex)[\\/]/,
            chunks: 'all',
            priority: 1,
            reuseExistingChunk: true,
            enforce: true
          }
        }
      }
    }
  }
}