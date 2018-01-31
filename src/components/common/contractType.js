/* eslint-disable react/prefer-stateless-function,react/prop-types,max-len,react/require-default-props,no-nested-ternary */
import React from 'react'
import PropTypes from 'prop-types'
import { Select } from 'antd'

import requestJsonFetch from '../../http/requestJsonFecth'

const Option = Select.Option

export default class SelectInvokeApi extends React.Component {
  state = {
    options: [],
    selectValue: '',
    flag: true,
  }
  componentDidMount() {
    if (this.props.typeCode && this.props.paramCode) {
      console.log(this.props.paramCode)
      requestJsonFetch(`/arc/sysparam/get/${this.props.typeCode}/${this.props.paramCode}`, { method: 'get' }, this.handleCallback)
    }
  }
  showTextValue = () => {
    console.log(88)
    const options = this.state.options
    const result = options.filter(o => o.paramValue === this.props.text)
    return result.length ? result[0].paramValueDesc : ''
  }

  handleCallback = (response) => {
    if (response.resultCode === '000000') {
      const options = response.data
      if (this.props.hasEmpty) {
        options.unshift({ paramValue: 'all', paramValueDesc: '请选择' })
      }
      this.setState({
        options,
      })
    }
  }
  handleChange = (value) => {
    this.setState({
      flag: false,
    })
    let name = ''
    this.state.options.map((item)=>{
      if(item.paramValue==value){
        name = item.paramValueDesc
      }
    })
    const {indexs, columns} = this.props
    if (value === 'all') {
      this.props.onChange('')
    } else {
      this.props.onChange({
        No: value,
        Name:name,
        indexs: indexs,
        columns: columns,
      })
      // this.props.onChange(value)
    }
  }
  render() {
    const optionDom = this.state.options ? this.state.options.map(option => <Option key={option.paramValue ? option.paramValueDesc : 'no_select'} value={option.paramValue}>{option.paramValueDesc}</Option>) : null
    return (
      <Select
        id={this.props.id}
        placeholder={this.props.placeholder}
        onChange={this.handleChange}
        //value={this.state.selectValue ? this.state.selectValue : (this.props.initialValue ? this.props.initialValue : 'all')}
        value={this.state.flag && this.props.text ? this.showTextValue() : (this.props.value && this.props.value[1] ? this.props.value[1] : (this.props.initialValue ? this.props.initialValue : 'all'))}
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
}
