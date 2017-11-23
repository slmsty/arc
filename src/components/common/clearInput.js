/* eslint-disable react/prefer-stateless-function,react/prop-types */
import React from 'react'
import { Input, Icon } from 'antd'

export default class ClearInput extends React.Component {
  handleChange = (values) => {
    this.props.onChange(values)
  }
  handleEmitEmpty = () => {
    this.props.onChange('')
  }
  render() {
    const suffix = this.props.value ? <Icon type="close-circle" onClick={this.handleEmitEmpty} /> : null
    return (
      <Input
        placeholder={this.props.placeholder}
        value={this.props.value}
        suffix={suffix}
        onChange={this.handleChange}
        onPressEnter={this.props.onPressEnter}
      />
    )
  }
}
