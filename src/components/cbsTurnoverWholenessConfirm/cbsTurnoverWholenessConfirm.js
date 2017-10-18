/* eslint-disable no-unused-vars,react/prefer-stateless-function */
import React from 'react'
import PropTypes from 'prop-types'
import CBSTurnoverWholenessConfirmSearchWithForm from './cbsTurnoverWholenessConfirmSearch'

export default class CBSTurnoverWholenessConfirm extends React.Component {
  componentDidMount() {
  }
  render() {
    return (
      <CBSTurnoverWholenessConfirmSearchWithForm />
    )
  }
}

CBSTurnoverWholenessConfirm.propTypes = {
  form: PropTypes.shape({
    getFieldDecorator: PropTypes.func.isRequired,
    getFieldValue: PropTypes.func.isRequired,
  }).isRequired,
}
