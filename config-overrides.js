// eslint-disable-next-line
const { injectBabelPlugin } = require('react-app-rewired')

// eslint-disable-next-line
module.exports = function override(config, env) {
  // eslint-disable-next-line
  config = injectBabelPlugin(['import', { libraryName: 'antd', style: 'css' }], config)
  return config
}
