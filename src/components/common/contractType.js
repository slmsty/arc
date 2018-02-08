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
      requestJsonFetch(`/arc/contract/split/contractType`, { method: 'get' }, this.handleCallback)
    }
  }
  showTextValue = () => {
    const options = this.state.options
    const {indexs, columns} = this.props
    const text = this.props.text
    console.log('text',text)
    let value = ''
    if(typeof text ==='string' || typeof text ==='number'){
      value = text
    }else if(text.length > 0){
      value = text[0]
    }
    let  paramValueDesc = ''
    for (let i = 0; i < options.length; i++) {
      if (options[i].paramValue === value ) {
        paramValueDesc = options[i].paramValueDesc
        break;
      }
      let children = options[i].children ? options[i].children : []
      if (children) {
        for (let j = 0; j < children.length; j++) {
          if( children.paramValue === value ) {
            paramValueDesc = children[j].paramValueDesc
            break;
          }
        }
      }
    }
    console.log('paramValueDesc',paramValueDesc)
    return paramValueDesc
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
    this.setState({
      flag: false,
    })
    const options = this.state.options.slice(0)
    let name = ''
    for (let i = 0; i < options.length; i++) {
      if (options[i].paramValue === value ) {
        name = options[i].paramValueDesc
        break;
      }
      let children = options[i].children ? options[i].children : []
      console.log('children',children)
      for (let j = 0; j < children.length; j++) {
        if( children[j].paramValue === value ) {
          name = children[j].paramValueDesc
          break;
        }
      }
    }
    /*this.state.options.map((item)=>{
      if(item.paramValue==value){
        name = item.paramValueDesc
      }
    })*/
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
    const parentCode = this.props.parentCode !=='' ? this.props.parentCode : ''
    /*let parentCodeVal = ''
     if(typeof parentCode ==='string' || typeof parentCode ==='number'){
     parentCodeVal = parentCode
     }else if(parentCode.length > 0){
     parentCodeVal = parentCode[0]
     }*/
    const options = this.state.options.slice(0)
    let optionDoms = []
    if(parentCode){
      let optionParentDoms = options.filter(o=>o.paramValue === parentCode[0])
      optionDoms = optionParentDoms && optionParentDoms[0] ? optionParentDoms[0].children : []
    }else{
      optionDoms = options
    }
    const optionDom = optionDoms ? optionDoms.map(option => <Option key={option.paramValue ? option.paramValueDesc : 'no_select'} value={option.paramValue}>{option.paramValueDesc}</Option>) : null
    console.log('this.props.text',this.props.text,this.props.value)
    return (
      <Select
        style={{zIndex:'0'}}
        id={this.props.id}
        placeholder={this.props.placeholder}
        onChange={this.handleChange}
        value={this.state.flag && (this.props.text || this.props.text === 0)? this.showTextValue() : ((this.props.value && (this.props.value[1] || this.props.value[1] === 0)) ? this.props.value[1] : ((typeof this.props.value ==='string' || typeof this.props.value === 'number') ? (this.props.value === 0 ? "0%" :this.props.value ) :(this.props.initialValue ? this.props.initialValue : 'all')))}
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
