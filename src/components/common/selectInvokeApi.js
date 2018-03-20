/* eslint-disable react/prefer-stateless-function,react/prop-types,max-len,react/require-default-props,no-nested-ternary */
import React from 'react'
import PropTypes from 'prop-types'
import { Select } from 'antd'

import requestJsonFetch from '../../http/requestJsonFecth'

const Option = Select.Option

export default class SelectInvokeApi extends React.Component {
  state = {
    options: [],
  }
  componentDidMount() {
    if (this.props.typeCode && this.props.paramCode) {
      requestJsonFetch(`/arc/sysparam/get/${this.props.typeCode}/${this.props.paramCode}`, { method: 'get' }, this.handleCallback)
    }
  }
  handleCallback = (response) => {
    if (response.resultCode === '000000') {
      const options = response.data
      if (this.props.hasEmpty) {
        options.unshift({ paramValue: 'all', paramValueDesc: '请选择' })
      }
      if(this.props.hasAll) {
        options.unshift({ paramValue: 'all', paramValueDesc: '全部' })
      }
      this.setState({
        options,
      })
    }
  }
  handleChange = (value) => {
    if (value === 'all') {
      this.props.onChange('')
    } else {
      this.props.onChange(value)
    }
  }
  render() {
    const optionDom = this.state.options ? this.state.options.map(option => <Option key={option.paramValue ? option.paramValue : 'no_select'} value={option.paramValue}>{option.paramValueDesc}</Option>) : null
    return (
      <Select
        placeholder={this.props.placeholder}
        onChange={this.handleChange}
        value={this.props.value ? this.props.value : (this.props.initialValue ? this.props.initialValue : '请选择')}
        disabled={this.props.disabled}
      >
        {optionDom}
      </Select>
    )
  }
}

SelectInvokeApi.propTypes = {
  placeholder: PropTypes.string.isRequired,
  typeCode: PropTypes.string.isRequired,
  paramCode: PropTypes.string.isRequired,
  value: PropTypes.string,
  initialValue: PropTypes.string,
  hasEmpty: PropTypes.bool,
  hasAll: PropTypes.bool,
}
