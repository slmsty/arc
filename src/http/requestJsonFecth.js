import requestJson from './requestJson'

function requestJsonFetch(url, options, callback) {
  const httpRequestJson = requestJson(process.env.REACT_APP_GATEWAY)
  httpRequestJson(url, options).then((response) => {
    callback(response)
  }).catch(() => {
    callback({ resultCode: -1 })
  })
}

export default requestJsonFetch
