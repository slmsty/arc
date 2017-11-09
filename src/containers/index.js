/* eslint-disable react/prop-types */
import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Index from '../components/index'
import NoMatch from '../components/noMatch/noMatch'
import { getUserInfo } from '../actions/common'

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

const mapStateToProps = state => ({
  user: state.common.user,
  notification: state.common.notification,
})

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    getUserInfo,
  }, dispatch)
)

// eslint-disable-next-line react/prefer-stateless-function
class IndexContainer extends React.Component {
  componentWillMount() {
    this.props.getUserInfo()
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.notification !== nextProps.notification) {
      console.log(nextProps.notification)
    }
  }
  render() {
    //  eslint-disable-next-line
    const { accountId } = this.props.user
    if (!accountId) {
      return null
    }
    return (
      <Router basename={process.env.PUBLIC_URL}>
        <div style={{ height: '100%' }}>
          <Index {...this.props}>
            <Switch>
              <Route exact path="/" component={HomeContainer} />
              <Route exact path="/home" component={HomeContainer} />
              <Route exact path="/receiptManagement" component={HomeContainer} />
              <Route exact path="/receiptManagement/projectReceiptClaim" component={ProjectReceiptClaimContainer} />
              <Route exact path="/receiptManagement/noProjectReceiptClaim" component={NoProjectReceiptClaimContainer} />
              <Route exact path="/receiptManagement/reviewReceiptClaim" component={ReviewReceiptClaimContainer} />
              <Route exact path="/receiptManagement/customerBankLink" component={CustomerBankLinkContainer} />
              <Route exact path="/receiptManagement/contractChange" component={ContractChangeContainer} />
              <Route exact path="/receiptManagement/cbsTurnoverWholenessConfirm" component={CBSTurnoverWholenessConfirm} />
              <Route exact path="/receiptManagement/manualEntryBankTurnover" component={ManualEntryBankTurnover} />
              <Route exact path="/receiptManagement/manualEntryBankTurnover/batchImport" component={BatchImport} />
              <Route exact path="/billedAR/approve" component={BilledARApprove} />
              <Route exact path="/billedAR/confirm" component={BilledARConfirm} />
              <Route exact path="/badDebts/apply" component={BadDebtsApply} />
              <Route exact path="/badDebts/status" component={BadDebtsStatus} />
              <Route component={NoMatch} />
            </Switch>
          </Index>
        </div>
      </Router>)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(IndexContainer)
