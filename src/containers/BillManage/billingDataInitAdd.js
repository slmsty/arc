/**
 * Created by liangshuang on 18/5/14.
 */
import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import BillingDataInitAddCom from '../../components/billStatusManage/billingDataInitAdd/billingDataInitAddCom'

const mapStateToProps = state => ({
})
const mapDispatchToProps = dispatch => (
  bindActionCreators({
  }, dispatch)
)
class BillingDataInitAddComContainer extends React.Component {
  render() {
    return (
      <BillingDataInitAddCom />
    )
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(BillingDataInitAddComContainer)
