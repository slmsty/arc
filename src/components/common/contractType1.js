/* eslint-disable react/prefer-stateless-function,react/prop-types,max-len,react/require-default-props,no-nested-ternary */
import React from 'react'
import PropTypes from 'prop-types'
import { Select } from 'antd'

import requestJsonFetch from '../../http/requestJsonFecth'

const Option = Select.Option
const testOption = [
  {
    paramCode: "STATUS",
    paramValue: "TASK-9",
    paramValueDesc: "A:Task 9(外购支持服务)",
    primaryKey: "BILLED_SPLIT.STATUS",
    typeCode: "BILLED_SPLIT",
    children:[
      {
        paramCode: "STATUS",
        paramValue: "TASK 9-K",
        paramValueDesc: "TASK 9-K",
        primaryKey: "BILLED_SPLIT.STATUS",
        typeCode: "BILLED_SPLIT",
      },
      {
        paramCode: "STATUS",
        paramValue: "TASK 9-P",
        paramValueDesc: "TASK 9-P",
        primaryKey: "BILLED_SPLIT.STATUS",
        typeCode: "BILLED_SPLIT",
      },
      {
        paramCode: "STATUS",
        paramValue: "TASK 9-P1",
        paramValueDesc: "TASK 9-P1",
        primaryKey: "BILLED_SPLIT.STATUS",
        typeCode: "BILLED_SPLIT",
      }
    ]
  },
  {
    paramCode: "STATUS",
    paramValue: "Task-11",
    paramValueDesc: "B:Task 11(增值服务)",
    primaryKey: "BILLED_SPLIT.STATUS",
    typeCode: "BILLED_SPLIT",
    children:[
      {}
    ]
  },
  {
    paramCode: "STATUS",
    paramValue: "TASK",
    paramValueDesc: "TASK (7 10S 7-K 10S-K)",
    primaryKey: "BILLED_SPLIT.STATUS",
    typeCode: "BILLED_SPLIT",
    children:[
      {
        paramCode: "STATUS",
        paramValue: "TASK7",
        paramValueDesc: "TASK 7",
        primaryKey: "BILLED_SPLIT.STATUS",
        typeCode: "BILLED_SPLIT",
      },
      {
        paramCode: "STATUS",
        paramValue: "TASK7-K",
        paramValueDesc: "TASK 7-K",
        primaryKey: "BILLED_SPLIT.STATUS",
        typeCode: "BILLED_SPLIT",
      },
      {
        paramCode: "STATUS",
        paramValue: "TASK10",
        paramValueDesc: "TASK 10",
        primaryKey: "BILLED_SPLIT.STATUS",
        typeCode: "BILLED_SPLIT",
      },
      {
        paramCode: "STATUS",
        paramValue: "TASK10-K",
        paramValueDesc: "TASK 10-K",
        primaryKey: "BILLED_SPLIT.STATUS",
        typeCode: "BILLED_SPLIT",
      }
    ]
  },

]

export default class SelectInvokeApi extends React.Component {
  state = {
    options: [],
    selectValue: '',
    flag: true,
  }
  componentDidMount() {
    if (this.props.typeCode && this.props.paramCode) {
      requestJsonFetch(`/arc/sysparam/get/${this.props.typeCode}/${this.props.paramCode}`, { method: 'get' }, this.handleCallback)
    }else {
      /*requestJsonFetch(`/arc/contract/split/contractType`, { method: 'get' }, this.handleCallback)*/
      let callBack = ''
      if(this.props.type){
        callBack = this.productCallBack
      }else{
        callBack = this.contractHandleCallback
      }
      requestJsonFetch(`/arc/common/task/prd/list`, { method: 'post',body:{keywords:this.props.keywords} }, callBack)
    }
  }
  showTextValue = () => {
    const options = this.state.options
    const {value,type} = this.props
    let  paramValueDesc = ''
    if(type==='product'){
      return value
    }
    if(value){
      if(typeof value ==='string'|| typeof value ==='number'){
        for (let i = 0; i < options.length; i++){
          if (options[i].paramValue == value ) {
            paramValueDesc = `${value}(${options[i].paramValueDesc})`
            break;
          }
        }
      }else if(value.length>0){
        paramValueDesc = `${value[0]}(${value[1]})`
      }
    }

    return paramValueDesc
  }
  productCallBack = (response) =>{
    if (response.resultCode === '000000') {
      const options = response.pageInfo.result
      let value = []
      options.map(option=>{
        value.push(option.productNo ? option.productNo : "0")
      })
      let optionsValue = [...new Set(value)]
      let selectOptions = []
      for(let i=0;i <optionsValue.length;i++){
        selectOptions.push({ paramValue: optionsValue[i], paramValueDesc: optionsValue[i] })
      }
      if (this.props.hasEmpty) {
        selectOptions.unshift({ paramValue: '请选择', paramValueDesc: '请选择' })
      }
      this.setState({
        options:selectOptions
      })
    }
  }

  contractHandleCallback = (response) => {
    if (response.resultCode === '000000') {
      const options = response.pageInfo.result
      if (this.props.hasEmpty) {
        options.unshift({ paramValue: 'all', paramValueDesc: '请选择' })
      }
      this.setState({
        options
      })
    }
  }

  handleCallback = (response) => {
    if (response.resultCode === '000000') {
      const options = response.data
      if (this.props.hasEmpty) {
        options.unshift({ paramValue: 'all', paramValueDesc: '请选择' })
      }
      this.setState({
        options
      })
    }
  }
  handleChange = (value) => {
    const options = this.state.options.slice(0)
    let name = ''
    for (let i = 0; i < options.length; i++) {
      if (options[i].paramValue == value ) {
        name = options[i].paramValueDesc
        break;
      }
      let children = options[i].children ? options[i].children : []
      for (let j = 0; j < children.length; j++) {
        if( children[j].paramValue == value ) {
          name = children[j].paramValueDesc
          break;
        }
      }
    }
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
    const parentCode = this.props.parentCode ? this.props.parentCode : []
    let parentCodeVal = ''
     if(typeof parentCode ==='string' || typeof parentCode ==='number'){
     parentCodeVal = parentCode
     }else if(parentCode.length > 0){
     parentCodeVal = parentCode[0]
     }
    const options = this.state.options.slice(0)
    console.log('options',options)
    let optionDoms = []
    if(parentCodeVal){
      let optionParentDoms = options.filter(o=>o.paramValue === parentCodeVal)
      optionDoms = optionParentDoms && optionParentDoms[0] ? optionParentDoms[0].children : []
    }else{
      optionDoms = options
    }
    const selectValue = optionDoms ? optionDoms.map(option => <Option key={option.paramValue ? option.paramValueDesc : 'no_select'} value={option.paramValue}>{option.paramValue ==='all' ? '' :option.paramValue}({option.paramValueDesc})</Option>) : null
    const productValue = optionDoms ? optionDoms.map(option => <Option key={option.paramValue ? option.paramValueDesc : 'no_select'} value={option.paramValue}>{option.paramValue}</Option>) : null
    const optionDom = this.props.type==='product' ? productValue : selectValue

    return (
      <Select
        style={{zIndex:'0'}}
        id={this.props.id}
        placeholder={this.props.placeholder}
        onChange={this.handleChange}
        value={this.showTextValue()}
        //value={this.state.flag && (this.props.text || this.props.text === 0)? this.showTextValue() : ((this.props.value && (this.props.value[1] || this.props.value[1] === 0)) ? this.props.value[1] : ((typeof this.props.value ==='string' || typeof this.props.value === 'number') ? (this.props.value === 0 ? "0%" :this.props.value ) :(this.props.initialValue ? this.props.initialValue : '请选择')))}
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
