const ExtractTextPlugin = require('mini-css-extract-plugin')
const path = require('path')

module.exports = {
  devServer: {
    port: '8080',
    disableHostCheck: true,
  },
  runtimeCompiler: true,
  chainWebpack: (config) => {
    config.optimization.delete('splitChunks')

    config.output.filename('[name].js')

    config.plugin('extract-css').use(ExtractTextPlugin, [
      {
        filename: '[name].css',
        allChunks: true,
      },
    ])
    // config.module
    // .rule('workers')
    // .test(/\.worker\.js$/i)
    // .use('comlink-loader', { singleton: true })
    // .loader('comlink-loader')
    // .end()
  },
  configureWebpack: {
    output: {
      filename: '[name].js',
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
      extensions: ['.js', '.vue', '.json'],
    },
  },
  lintOnSave: true,
  css: {
    loaderOptions: {
      sass: {
        additionalData: `@import "@/scss/style.scss";`
      },
    },
  },
}
