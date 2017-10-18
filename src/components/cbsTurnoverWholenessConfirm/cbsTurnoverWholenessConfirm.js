/* eslint-disable no-unused-vars,react/prefer-stateless-function */
import React from 'react'
import PropTypes from 'prop-types'
import CBSTurnoverWholenessConfirmSearchWithForm from './cbsTurnoverWholenessConfirmSearch'

export default class CBSTurnoverWholenessConfirm extends React.Component {
  componentDidMount() {
    this.props.setTitle('CBS流水完整性确认 CBS Turnover Wholeness Confirm')
  }
  render() {
    return (
      <CBSTurnoverWholenessConfirmSearchWithForm />
    )
  }
}

CBSTurnoverWholenessConfirm.propTypes = {
  setTitle: PropTypes.func.isRequired,
}
