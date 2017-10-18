/* eslint-disable no-unused-vars,react/prefer-stateless-function */
import React from 'react'
import PropTypes from 'prop-types'
import ManualEntryBankTurnoverSearchWithForm from './manualEntryBankTurnoverSearch'

export default class ManualEntryBankTurnover extends React.Component {
  componentDidMount() {
    this.props.setTitle('CBS流水完整性确认 CBS Turnover Wholeness Confirm')
  }
  render() {
    return (
      <ManualEntryBankTurnoverSearchWithForm />
    )
  }
}

ManualEntryBankTurnover.propTypes = {
  setTitle: PropTypes.func.isRequired,
}
