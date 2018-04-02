/* eslint-disable max-len */
import caseReducer from './caseReducer'

const common = {
  user: {
    accountId: '',
    accountName: '',
    orgName: '',
    headIcon: '',
  },
  error: {
    message: '',
    timeTick: new Date().getTime(),
  },
  permission: process.env.NODE_ENV === 'develop_local' ? {
    menu: [
      {
        key: '1',
        path: '/receiptManagement',
        name: '回款管理',
        icon: 'icon-huikuanguanli',
        component: 'HomeContainer',
        child: [
          {
            key: '11',
            path: '/receiptManagement/cbsTurnoverWholenessConfirm',
            name: 'CBS流水完整性确认',
            icon: 'icon-CBS',
            component: 'CBSTurnoverWholenessConfirm',
          },
          {
            key: '12',
            path: '/receiptManagement/manualEntryBankTurnover',
            name: '人工录入银行流水',
            icon: 'icon-rengongluru',
            component: 'ManualEntryBankTurnover',
            child: [
              {
                key: '121',
                path: '/receiptManagement/manualEntryBankTurnover/batchImport',
                name: '批量导入',
                component: 'BatchImport',
              },
            ],
          },
          {
            key: '13',
            path: '/receiptManagement/projectReceiptClaim',
            name: '项目收款认领',
            icon: 'icon-xiangmushoukuan',
            component: 'ProjectReceiptClaimContainer',
          },
          {
            key: '14',
            path: '/receiptManagement/noProjectReceiptClaim',
            name: '订单收款认领',
            icon: 'icon-feixiangmushoukuan',
            component: 'NoProjectReceiptClaimContainer',
          },
          {
            key: '15',
            path: '/receiptManagement/reviewReceiptClaim',
            name: '收款认领复核',
            icon: 'icon-shoukuanrenlingfuhe',
            component: 'ReviewReceiptClaimContainer',
          },
          {
            key: '16',
            path: '/receiptManagement/customerBankLink',
            name: '客户银行帐号关系',
            icon: 'icon-shoukuanrenlingfuhe',
            component: 'CustomerBankLinkContainer',
          },
          {
            key: '17',
            path: '/receiptManagement/contractChange',
            name: '合同变更明细',
            icon: 'icon-xiangmushoukuan',
            component: 'ContractChangeContainer',
          },
        ],
      },
      {
        key: '2',
        path: '/billedAR',
        name: 'Billed AR管理',
        icon: 'icon-BilledAR',
        component: 'HomeContainer',
        child: [
          {
            key: '21',
            path: '/billedAR/approve',
            name: 'Billed AR审定',
            icon: 'icon-BilledAR',
            component: 'BilledARApprove',
          },
          {
            key: '22',
            path: '/billedAR/confirm',
            name: 'Billed AR确认',
            icon: 'icon-BilledAR',
            component: 'BilledARConfirm',
          },
        ],
      },
      {
        key: '3',
        path: '/badDebts',
        name: '坏账管理',
        icon: 'icon-huaizhangguanli',
        component: 'HomeContainer',
        child: [
          {
            key: '31',
            path: '/badDebts/apply',
            name: '坏账划销申请',
            icon: 'icon-BilledAR',
            component: 'BadDebtsApply',
          },
          {
            key: '32',
            path: '/badDebts/status',
            name: '坏账管理状态',
            icon: 'icon-BilledAR',
            component: 'BadDebtsStatus',
          },
        ],
      },
      {
        key: '4',
        path: '/BillManage',
        name: '实际开票管理',
        icon: 'icon-shijikaipiaoguanli',
        component: 'HomeContainer',
        child: [
          /*{
            key: '41',
            path: '/BillManage/ContractSplit',
            name: '合同拆分',
            icon: 'icon-BilledAR',
            component: 'ContractSplit',
          },*/
          {
            key: '42',
            path: '/BillManage/billingApplication',
            name: '开票申请',
            icon: 'icon-BilledAR',
            component: 'BillingApplication',
          },
          {
            key: '43',
            path: '/BillManage/BillStatusManage',
            name: '开票状态管理',
            icon: 'icon-BilledAR',
            component: 'BillStatusManage',
            child:[{component: "billingStatusSendAp", key: "521", name: "开票传送ap", path: "billingStatusSendAp"},
              {component: "billingStatusCancel", key: "522", name: "开票状态撤销", path: "billingStatusCancel"},
            ]
          },
        ],
      },
      {
        key: '5',
        path: '/myApply',
        name: '我的审批',
        icon: 'icon-shijikaipiaoguanli',
        component: 'HomeContainer',
        child: [
          {
            key: '51',
            path: '/myApply/myApply',
            name: '我的申请',
            icon: 'icon-BilledAR',
            component: 'myApplyContainer',
          },
          {
            key: '52',
            path: '/myApply/applyList',
            name: '审批列表',
            icon: 'icon-BilledAR',
            component: 'applyListContainer',
          },
        ],
      },
      {
        key: '6',
        path: '/ContractSplit',
        name: '合同拆分',
        icon: 'icon-BilledAR',
        component: 'ContractSplit',
        /*child: [
          {
            key: '51',
            path: '/ContractSplit/ContractSplit',
            name: '合同拆分',
            icon: 'icon-BilledAR',
            component: 'ContractSplit',
          },
        ],*/
      },
      {
        key: '7',
        path: '/statementSearch/statementList',
        name: '报表查询',
        icon: 'icon-BilledAR',
        component: 'statementSearch',
        /*child: [
          {
            key: '61',
            path: '/statementSearch/statementList',
            name: '报表',
            icon: 'icon-BilledAR',
            component: 'statementSearch',
          },
        ],*/
      },
      {
        key: '8',
        path: '/system',
        name: '系统管理',
        icon: 'icon-system',
        child: [
         {
           key: '61',
           path: '/system/mailConfig',
           name: '邮件配置',
           icon: 'icon-mail',
           component: 'mailConfig',
         },
         ],
      },
    ],
  } : {},
}

function getUserInfo(state, action) {
  return { ...state, user: action.response.data }
}

function getPermission(state, action) {
  if (process.env.NODE_ENV === 'develop_local') {
    return state
  }
  return { ...state, permission: action.response.results }
}

function showFailure(state, action) {
  return { ...state, error: { message: action.response.resultMessage, timeTick: new Date().getTime() } }
}

function showError(state, action) {
  return { ...state, error: { message: action.error.statusText || '系统错误，请联系系统管理员', timeTick: new Date().getTime() } }
}

export default caseReducer(common, {
  GET_USER_INFO_SUCCESS: getUserInfo,
  GET_PERMISSION_SUCCESS: getPermission,
  HTTP_FAILURE: showFailure,
  HTTP_ERROR: showError,
})
