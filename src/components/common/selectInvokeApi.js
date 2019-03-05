/* eslint-disable react/prefer-stateless-function,react/prop-types,max-len,react/require-default-props,no-nested-ternary */
import React from 'react'
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
        options.unshift({ paramValue: 'all', paramValueDesc: '-请选择-' })
      }
      if(this.props.hasAll) {
        options.unshift({ paramValue: 'all', paramValueDesc: '-全部-' })
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
    const { paramCode, optionDisabled, hasAll, value, initialValue, disabled, placeholder } = this.props
    const optionDom = this.state.options ?
      this.state.options.map(option => {
        if(!(optionDisabled && option.paramValue === '0' && paramCode === 'TAX_RATE')) {
          return (
            <Option
              key={option.paramValue ? option.paramValue : 'no_select'}
              value={option.paramValue}
            >{option.paramValueDesc}
            </Option>
          )
        }
      }) : null
    return (
      <Select
        placeholder={placeholder}
        onChange={this.handleChange}
        value={value ? value : (hasAll ? '-全部-' : '-请选择-')}
        disabled={disabled}
        defaultValue={this.props.defaultValue}
      >
        {optionDom}
      </Select>
    )
  }
}
