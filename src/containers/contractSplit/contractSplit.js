/**
 * Created by liangshuang on 17/12/1.
 */
import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import ContractSplit from '../../components/contractSplit/contractSplit'
import { getMyApplyList, approveSubmit } from '../../actions/myApply'

const mapStateToProps = state => ({
  myApply: state.myApply,
})
const mapDispatchToProps = dispatch => (
  bindActionCreators({
    getMyApplyList,
    approveSubmit,
  }, dispatch)
)
// eslint-disable-next-line react/prefer-stateless-function
class ContractSplitContainer extends React.Component {
  render() {
    return (
      <ContractSplit {...this.props} />
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ContractSplitContainer)

