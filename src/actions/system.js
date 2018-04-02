import { httpApi } from '../http/reduxRequestMiddleware'
/**
 * 获取邮件配置
 * @returns {{}}
 */
export function getMailConfig() {
  return {
    [httpApi]: {
      url: '/arc/sysManage/getMailConfig',
      options: {
        method: 'GET',
      },
      types: ['GET_MAIL_CONFIG_SUCCESS'],
    },
  }
}
/**
 * 报错邮件配置
 * @param params
 * @returns {{}}
 */
export function saveMailConfig(params) {
  return {
    [httpApi]: {
      url: '/arc/sysManage/saveMailConfig',
      options: {
        method: 'POST',
        body: params,
      },
      types: ['SAVE_MAIL_CONFIG_SUCCESS'],
    },
  }
}


