module.exports = {
  publicPath: '/',
  css: {
    loaderOptions: {
      sass: {
        prependData: '@import "@/assets/_variables.scss";'
      }
    }
  },
  devServer: {
    clientLogLevel: 'warning',
    disableHostCheck: true,
    proxy: {
      '^/api': {
        target: 'http://127.0.0.1:5000',
        logLevel: 'debug',
        pathRewrite: {
          '^/api': ''
        }
      },
      '^/static': {
        target: 'http://127.0.0.1:5000',
        logLevel: 'debug'
      }
    },
    watchOptions: {
      ignored: /node_modules/
    }
  }
}
