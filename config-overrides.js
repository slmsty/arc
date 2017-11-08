/* eslint-disable import/no-extraneous-dependencies,no-unused-vars,no-param-reassign */
const { injectBabelPlugin } = require('react-app-rewired')
const rewireLess = require('react-app-rewire-less')

module.exports = function override(config, env) {
  config = injectBabelPlugin(['import', { libraryName: 'antd', style: true }], config)
  config = rewireLess(config, env, {
    modifyVars: { '@primary-color': '#F4A034' },
  })
  return config
}
