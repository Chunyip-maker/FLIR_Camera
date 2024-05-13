const proxy = require('http-proxy-middleware')
module.exports = function (app) {
  app.use(
    proxy('/api1', {
      target: 'http://203.101.230.232:6001',
      changeOrigin: true,
      pathRewite: { '^api1': '' },
    })
    // proxy('/api2', {
    //   target: 'http://203.101.230.232:6001',
    //   changeOrigin: true,
    //   pathRewite: { '^api1': '' },
    // })
  )
}
