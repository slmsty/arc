/* eslint-disable react/prop-types,max-len */
import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { message } from 'antd'
import Index from '../components/index'
import NoMatch from '../components/noMatch/noMatch'
import { getUserInfo, getPermission } from '../actions/common'


import HomeContainer from '../containers/home/home'
import ProjectReceiptClaimContainer from '../containers/projectReceiptClaim/projectReceiptClaim'
import NoProjectReceiptClaimContainer from '../containers/noProjectReceiptClaim/noProjectReceiptClaim'
import CBSTurnoverWholenessConfirm from '../containers/cbsTurnoverWholenessConfirm/cbsTurnoverWholenessConfirm'
import ManualEntryBankTurnover from '../containers/manualEntryBankTurnover/manualEntryBankTurnover'
import ReviewReceiptClaimContainer from '../containers/reviewReceiptClaim/reviewReceiptClaim'
import CustomerBankLinkContainer from '../containers/customerBankLink/customerBankLink'
import BatchImport from '../containers/manualEntryBankTurnover/batchImport'
import ContractChangeContainer from '../containers/contractChange/contractChange'
import BilledARApprove from './billedAR/Approve'
import BilledARConfirm from './billedAR/Confirm'
import BadDebtsApply from './badDebts/Apply'
import BadDebtsStatus from './badDebts/Status'
import ApplyListContainer from './myApply/applyList'
import ContractSplit from './ContractSplit/contractSplit'
import BillStatusManage from './BillManage/billStatusManage'
import ContractSplitReport from './statementSearch/contractSplitReport'
import OutcomeReceiptReport from './statementSearch/ountcomeReceiptReport'
import BillingApplication from '../containers/billApplication/billApplication'
import Login from '../containers/login/login'
import MyApply from '../containers/myApply/myApplay'
import MailConfig from '../containers/system/mailConfig'
import CustomerTaxInfo from '../containers/system/customerTaxInfo'
import CustomerContent from '../containers/system/customerContent'
import AuthoritySet from "../components/system/authoritySet";
import billingDataInitAdd from './BillManage/billingDataInitAdd'
import ReceiptApply from '../containers/BillManage/receiptApplication'
import MailCcConfig from "./system/mailCcConfig";

const mapStateToProps = state => ({
  user: state.common.user,
  permission: state.common.permission,
  error: state.common.error,
})

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    getUserInfo,
    getPermission,
  }, dispatch)
)


// eslint-disable-next-line react/prefer-stateless-function
class IndexContainer extends React.Component {
  componentWillMount() {
    this.props.getUserInfo()
    this.props.getPermission()
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.error !== nextProps.error) {
      message.error(nextProps.error.message, 5)
    }
  }
  getMenuComponent = (component) => {
    if (component === 'HomeContainer') {
      return HomeContainer
    } else if (component === 'ProjectReceiptClaimContainer') {
      return ProjectReceiptClaimContainer
    } else if (component === 'NoProjectReceiptClaimContainer') {
      return NoProjectReceiptClaimContainer
    } else if (component === 'CBSTurnoverWholenessConfirm') {
      return CBSTurnoverWholenessConfirm
    } else if (component === 'ManualEntryBankTurnover') {
      return ManualEntryBankTurnover
    } else if (component === 'ReviewReceiptClaimContainer') {
      return ReviewReceiptClaimContainer
    } else if (component === 'CustomerBankLinkContainer') {
      return CustomerBankLinkContainer
    } else if (component === 'BatchImport') {
      return BatchImport
    } else if (component === 'ContractChangeContainer') {
      return ContractChangeContainer
    } else if (component === 'BilledARApprove') {
      return BilledARApprove
    } else if (component === 'BilledARConfirm') {
      return BilledARConfirm
    } else if (component === 'BadDebtsApply') {
      return BadDebtsApply
    } else if (component === 'BadDebtsStatus') {
      return BadDebtsStatus
    } else if (component === 'applyListContainer') {
      return ApplyListContainer
    } else if (component === 'ContractSplit') {
      return ContractSplit
    } else if (component === 'BillingApplication') {
      return BillingApplication
    } else if (component === 'BillStatusManage') {
      return BillStatusManage
    } else if(component === 'myApplyContainer'){
      return MyApply
    } else if(component === 'mailConfig'){
      return MailConfig
    } else if(component === 'customerTaxInfo') {
      return CustomerTaxInfo
    } else if(component === 'customerContent') {
      return CustomerContent
    } else if(component === 'AUTH_SET') {
      return AuthoritySet
    } else if (component === 'outcomeReceiptReport') {
      return OutcomeReceiptReport
    } else if (component === 'contractSplitReport') {
      return ContractSplitReport
    } else if (component === 'billingDataInitAdd') {
      return billingDataInitAdd
    } else if (component === 'ReceiptApply') {
      return ReceiptApply
    } else if (component === 'MailCcConfig') {
      return MailCcConfig
    }
  }
  getMenuRoutes = (menus) => {
    if (menus && menus.length > 0) {
      let menuRoutes = []
      menus.forEach((menu) => {
        menuRoutes.push(<Route key={menu.key} exact path={menu.path} component={this.getMenuComponent(menu.component)} />)
        menuRoutes = menuRoutes.concat(this.getMenuRoutes(menu.child))
      })
      return menuRoutes
    }
    return null
  }
  render() {
    //  eslint-disable-next-line
    const { accountId } = this.props.user
    if (!accountId) {
      return null
    }
    const menuRoutes = this.getMenuRoutes(this.props.permission.menu)
    return (
      <Router basename={process.env.PUBLIC_URL}>
        <div style={{ height: '100%' }}>
          <Switch>
            <Index {...this.props}>
              <Switch>
                {menuRoutes}
                <Route component={NoMatch} />
              </Switch>
            </Index>
          </Switch>
        </div>
      </Router>)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(IndexContainer)
