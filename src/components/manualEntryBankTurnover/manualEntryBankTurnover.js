/* eslint-disable no-unused-vars,react/prefer-stateless-function */
import React from 'react'
import PropTypes from 'prop-types'
import ManualEntryBankTurnoverSearchWithForm from './manualEntryBankTurnoverSearch'

export default class ManualEntryBankTurnover extends React.Component {
  componentDidMount() {
  }
  render() {
    return (
      <ManualEntryBankTurnoverSearchWithForm />
    )
  }
}

ManualEntryBankTurnover.propTypes = {
  form: PropTypes.shape({
    getFieldDecorator: PropTypes.func.isRequired,
    getFieldValue: PropTypes.func.isRequired,
  }).isRequired,
}
