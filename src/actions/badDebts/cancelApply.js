/**
 * Created by liangshuang on 17/12/15.
 */
import { httpApi } from '../../http/reduxRequestMiddleware'

// eslint-disable-next-line import/prefer-default-export
export function cancelApply(queryParam) {
  return {
    [httpApi]: {
      url: '/arc/workFlow/cancelApply',
      options: {
        method: 'POST',
        body: queryParam,
      },
      types: ['UNDOERP_SUCCESS'],
    },
  }
}
