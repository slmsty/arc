/* eslint-disable no-unused-vars,react/prefer-stateless-function */
import React from 'react'
import PropTypes from 'prop-types'
import ProjectReceiptClaimSearchWithForm from './projectReceiptClaimSearch'

export default class ProjectReceiptClaim extends React.Component {
  componentDidMount() {
    this.props.setTitle('项目收款认领 Receipt Claim')
  }
  render() {
    return (
      <ProjectReceiptClaimSearchWithForm />
    )
  }
}

ProjectReceiptClaim.propTypes = {
  setTitle: PropTypes.func.isRequired,
}
