/* eslint-disable max-params */
import requestJson from './requestJson'

function requestJsonFetch(url, options, callback) {
  const httpRequestJson = requestJson(process.env.REACT_APP_GATEWAY)
  httpRequestJson(url, options).then((response) => {
    callback(response)
  }).catch(() => {
    // callback(this, { resultCode: -1, message: error })
  })
}

export default requestJsonFetch
