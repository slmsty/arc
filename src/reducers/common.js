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
        icon: 'icon-billedarguanli',
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
        icon: 'icon-kaipiaoguanli',
        component: 'HomeContainer',
        child: [
          {
            key: '41',
            path: '/BillManage/billingApplication',
            name: '开票申请',
            icon: 'icon-kaipiaoshenqing',
            component: 'BillingApplication',
          },
          {
            key: '42',
            path: '/BillManage/BillStatusManage',
            name: '开票状态管理',
            icon: 'icon-kaipiaozhuangtai',
            component: 'BillStatusManage',
            child:[{component: "billingStatusSendAp", key: "421", name: "传送ap", path: "billingStatusSendAp"},
              {component: "billingStatusCancel", key: "422", name: "撤销", path: "billingStatusCancel"},
            ]
          },
        ],
      },
      {
        key: '5',
        path: '/myApply',
        name: '我的审批',
        icon: 'icon-shenpixiangguan',
        component: 'HomeContainer',
        child: [
          {
            key: '51',
            path: '/myApply/myApply',
            name: '我的申请',
            icon: 'icon-wodeshenpi',
            component: 'myApplyContainer',
          },
          {
            key: '52',
            path: '/myApply/applyList',
            name: '审批列表',
            icon: 'icon-shenpiliebiao',
            component: 'applyListContainer',
          },
        ],
      },
      {
        key: '6',
        path: '/ContractSplit',
        name: '合同拆分',
        icon: 'icon-hetongchaifen',
        component: 'ContractSplit',
        child: [
          {
            key: '61',
            path: '/ContractSplit/ContractSplit',
            name: '合同拆分',
            icon: 'icon-hetongchaifen',
            component: 'ContractSplit',
            child:[{component: "splitSendErp", key: "611", name: "传送erp", path: "splitSendErp"},
              {component: "splitEdit", key: "612", name: "拆分编辑", path: "splitEdit"},
            ]
          },
        ],
      },
      {
        key: '7',
        path: '/statementSearch/statementList',
        name: '报表查询',
        icon: 'icon-BilledAR',
        component: 'statementSearch',
        child: [
          {
            key: '71',
            path: '/statementSearch/outcomeReceiptReport',
            name: '发票与回款',
            icon: 'icon-BilledAR',
            component: 'outcomeReceiptReport',
          },
          {
            key: '72',
            path: '/statementSearch/contractSplitReport',
            name: '合同拆分',
            icon: 'icon-BilledAR',
            component: 'contractSplitReport',
          },
        ],
      },
      {
        key: '8',
        path: '/system',
        name: '系统管理',
        icon: 'icon-xitongguanli',
        child: [
         {
           key: '81',
           path: '/system/mailConfig',
           name: '邮件配置',
           icon: 'icon-youjianpeizhi',
           component: 'mailConfig',
         },
          {
            key: '82',
            path: '/system/taxInfo',
            name: '客户纳税信息',
            icon: 'icon-xitongguanli',
            component: 'customerTaxInfo',
          },
          {
            key: '83',
            path: '/system/content',
            name: '客户开票内容及税收分类编码',
            icon: 'icon-xitongguanli',
            component: 'customerContent',
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
  /*if (process.env.NODE_ENV === 'develop_local') {
    return state
  }*/
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
