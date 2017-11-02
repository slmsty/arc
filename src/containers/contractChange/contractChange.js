import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { getContractChangeList } from '../../actions/contractChange'
import ContractChange from '../../components/contractChange/contractChange'

const mapStateToProps = state => ({
  contractChangeList: state.contractChange.contractChangeList,
})

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    getContractChangeList,
  }, dispatch)
)

// eslint-disable-next-line react/prefer-stateless-function
class ContractChangeContainer extends React.Component {
  render() {
    return (<ContractChange {...this.props} />)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ContractChangeContainer)

