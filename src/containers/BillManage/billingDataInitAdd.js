/**
 * Created by liangshuang on 18/5/14.
 */
import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as actions from '../../actions/billStatusManage/billDataInitAdd'
import BillingDataInitAddCom from '../../components/billStatusManage/billingDataInitAdd/billingDataInitAddCom'

const mapStateToProps = state => ({
  billInitData:state.billInitData
})
const mapDispatchToProps = dispatch => (
  bindActionCreators({
    ...actions
  }, dispatch)
)
class BillingDataInitAddComContainer extends React.Component {
  render() {
    return (
      <BillingDataInitAddCom {...this.props} />
    )
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(BillingDataInitAddComContainer)
