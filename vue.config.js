const webpack = require('webpack')
module.exports = {
  configureWebpack: {
    plugins: [
      new webpack.ProvidePlugin({
        d3: 'd3',
        axios: 'axios'
      })
    ]
  },
  chainWebpack: config => {
    let result = config.module.rule('svg')
    result.uses.clear()
    result.use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
    config.plugins.add
    return config
  }
}