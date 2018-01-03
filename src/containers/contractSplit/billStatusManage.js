/**
 * Created by liangshuang on 17/12/1.
 */
import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import BillStatusManage from '../../components/billStatusManage/billStatusManage'
import { getContractList, saveContractSplitInfo } from '../../actions/contractSplit'

const mapStateToProps = state => ({
  myApply: state.myApply,
})
const mapDispatchToProps = dispatch => (
  bindActionCreators({
    getContractList,
    saveContractSplitInfo,
  }, dispatch)
)
// eslint-disable-next-line react/prefer-stateless-function
class BillStatusManageContainer extends React.Component {
  render() {
    return (
      <BillStatusManage {...this.props} />
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BillStatusManageContainer)

