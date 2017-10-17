import httpRequestJson from './index'

function requestJsonFetch(url, options, callback) {
  httpRequestJson(url, options).then((response) => {
    callback(response)
  }).catch(() => {
    callback({ resultCode: -1 })
  })
}

export default requestJsonFetch
