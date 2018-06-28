/**
 * Created by liangshuang on 18/5/28.
 */
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
    requestJsonFetch('/arc/report/currency/list', { method: 'post' }, this.handleCallback)
  }
  handleCallback = (response) => {
    if (response.resultCode === '000000') {
      const optionArray = response.currencyList
      let options = []
      optionArray.forEach((item)=>{
        options.push({paramValue:item,paramValueDesc:item})
      })

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
        value={this.props.value ? this.props.value : (this.props.initialValue ? this.props.initialValue : (this.props.hasAll ? '全部' : '请选择'))}
        disabled={this.props.disabled}
      >
        {optionDom}
      </Select>
    )
  }
}
