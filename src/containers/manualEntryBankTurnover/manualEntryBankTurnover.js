import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import ManualEntryBankTurnover from '../../components/manualEntryBankTurnover/manualEntryBankTurnover'

const mapStateToProps = state => ({
  user: state.user,
})

const mapDispatchToProps = dispatch => (
  bindActionCreators({
  }, dispatch)
)

// eslint-disable-next-line react/prefer-stateless-function
class ManualEntryBankTurnoverContainer extends React.Component {
  render() {
    return (<ManualEntryBankTurnover {...this.props} />)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ManualEntryBankTurnoverContainer)

