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
      requestJsonFetch(`/arc/sysparam/get/${this.props.typeCode}/${this.props.paramCode}`, { method: 'get' }, this.handleCallback)
    }
  }
  showTextValue = () => {
    const options = this.state.options
    const {indexs, columns} = this.props
    const text = this.props.text
    let value = ''
    if(typeof text ==='string' || typeof text ==='number'){
      value = text
    }else if(text.length > 0){
      value = text[0]
    }
    const result = options.filter(o => o.paramValue == value)
    const paramValue = result.length ? result[0].paramValue : ''
    const paramValueDesc = result.length ? result[0].paramValueDesc : ''
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
    let showVaule = ''
    if(this.state.flag && (this.props.text || this.props.text === 0)){
      showVaule = this.showTextValue()
    } else if(this.props.value && (this.props.value[1] || this.props.value[1] === 0)){
      showVaule = this.props.value[1]
    } else if(this.props.value === 0) {
      showVaule = "0%"
    } else if(this.props.initialValue){
      showVaule = this.props.initialValue
    }
    const optionDom = this.state.options ? this.state.options.map(option => <Option key={option.paramValue ? option.paramValueDesc : 'no_select'} value={option.paramValue}>{option.paramValueDesc}</Option>) : null
    return (
      <Select
        style={{zIndex:'0'}}
        id={this.props.id}
        placeholder={this.props.placeholder}
        onChange={this.handleChange}
        value={this.state.flag && (this.props.text || this.props.text === 0)? this.showTextValue() : ((this.props.value && (this.props.value[1] || this.props.value[1] === 0)) ? this.props.value[1] : ((typeof this.props.value ==='string' || typeof this.props.value === 'number') ? (this.props.value === 0 ? "0%" :this.props.value ) :(this.props.initialValue ? this.props.initialValue : 'all')))}
        //value={showVaule || showVaule === 0 ? showVaule : 'all'}
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
