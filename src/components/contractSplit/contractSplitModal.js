/**
 * Created by liangshuang on 17/12/12.
 */
/**
 * Created by liangshuang on 17/12/8.
 */
import React from 'react'
import PropTypes from 'prop-types'
import SelectSbu from '../common/SelectSbu'
import ContractType from '../common/contractType'
import ProductLine from '../common/productLine'
import MyDtatePicker from '../common/myDatePicker'
import SelectInvokeApi from '../common/selectInvokeApi'
import currency from '../../util/currency'
import percent from '../../util/percent'
import _ from 'lodash'
import './contract.less'
import { Modal, Form, Table, Row, Col, Button, Input, Checkbox, DatePicker, Select, message, InputNumber } from 'antd'

const FormItem = Form.Item
const { TextArea } = Input
const Option = Select.Option
let tableData = [{
  taskOpration: '合计',
  contractCategory: 0,
  product: 0,
  revenueCheckout: 0,
  listPrice: 0,
  discount: 0,
  discountedPrice: 0,
  contractAmountTaxInclude: 0,
  contractTaxRate: 0,
  contractAmountTaxExclude: 0,
  returnTaxRate: 0,
  returnTaxRevenue: 0,
  grossOrder: 0,
  serviceStartDate: 0,
  serviceEndDate: 0,
}]

const EditableCell = ({onChange, column, value,disable}) => {

  return(<div style={{ position: 'relative' }}>
    {
      column === 'discount' ?
      <InputNumber style={{marginRight: '0px'}} formatter={value => `${value}%`} parser={value => value.replace('%', '')} value={value || value=== 0 ? value : ''} onChange={onChange} disabled={disable} />
    :<InputNumber style={{marginRight: '0px'}} value={value || value=== 0 ? value : ''} onChange={onChange} disabled={disable} />
    }

  </div>)
}

class ContractSplitModal extends React.Component{
  constructor(props) {
    super(props)
    const tableDeatail = _.cloneDeep(props.tableDetail.slice(0))
    const data = props.data[0]
    let countTaskCostDataList = {
      task1Cost: data.task1Cost ? data.task1Cost : 0,
      task3tCost: data.task3tCost ? data.task3tCost : 0,
      task4tCost: data.task4tCost ? data.task4tCost : 0,
      task5Cost: data.task5Cost ? data.task5Cost : 0,
      task9Cost: data.task9Cost ? data.task9Cost : 0,
      intercompanyCost: data.intercompanyCost ? data.intercompanyCost : 0,
      subcontractFee: data.subcontractFee ? data.subcontractFee : 0,
    }
    const dataSource = tableDeatail.concat({
      taskOpration: '合计',
      contractCategory: 0,
      product: 0,
      revenueCheckout: 0,
      listPrice: 0,
      discount: 0,
      discountedPrice: 0,
      contractAmountTaxInclude: 0,
      contractTaxRate: 0,
      contractAmountTaxExclude: 0,
      returnTaxRate: 0,
      returnTaxRevenue: 0,
      grossOrder: 0,
      serviceStartDate: 0,
      serviceEndDate: 0,
    })
    this.state = {
      dataSource: dataSource.slice(0),
      oldDataSource:_.cloneDeep(dataSource.slice(0)),
      countCatalPrice: 0.00,
      rcontent: '',
      rcontentnum: 0,
      countTaskCost: 0.00,
      countTaskCostData: countTaskCostDataList,
      editFlag: true,
      controactInfo: props.data[0],
      initInfo: null,
    }
  }
  getTableWidth = (colum)=> {
    let width = 0
    colum.map((item,idnex)=>{
      width += parseFloat(item.width)
    })
    return width
  }
  selectDateChange = (data) => {
    const newData = this.state.dataSource.slice(0)
    newData[data.indexs][data.columns] = data.dateString
    this.setState({
      dataSource: newData,
    })
  }
  handleChange = (data) => {
    const newData =this.state.dataSource.slice(0)
    if(this.props.data[0].collectionProject == 'Y' && data.columns==='contractCategory'){
      if(data.No !=="ARC_PRD_1" && data.No !=="ARC_PRD_1-K" ){
        message.error('集采项目只能拆分Task1')
        newData[data.indexs]['contractCategory'] = ''
        return
      }
    }

    if(data){
      const indexData = data.No && data.Name ? [data.No,data.Name] : ''

      if(data.columns){
        if(data.columns === 'contractCategory'){
          // 当父拆分数据改变时 清空子拆分数据的合同类型的数据
          // 当前的合同类型的父拆分数据的id
          const orderListLineId = newData[data.indexs].orderListLineId ? newData[data.indexs].orderListLineId : 0
          newData.map((item,index)=>{
            if(item.parentOrderListLineId === orderListLineId){
              item.contractCategory = ''
            }
          })
          const dataInfos = this.props.data[0]
          const contractTotalMoney = dataInfos.contractAmount ? parseFloat(dataInfos.contractAmount) : 0 //  合同总金额
          const solutionMaintain = dataInfos.solutionMaintain ? dataInfos.solutionMaintain : 0 // 软件解决方案保修期
          let assessRatio = dataInfos.assessRatio ? parseFloat(dataInfos.assessRatio) : 0 // 考核比率
          const incomeRatio =  parseFloat(parseFloat(solutionMaintain)/12 * 0.05)  // 收入比率
          if(isNaN(assessRatio)){
            assessRatio = 0
          }
          assessRatio = assessRatio/100 // 考核比率为百分数
          let formula = 1
          let formula2 = 1
          if (assessRatio !== 0) {
            if (data.No === 'ARC_PRD_7') {
              formula = (1 + incomeRatio)
              formula2 = (1 - assessRatio)
              newData[data.indexs]['listPrice'] = (parseFloat((contractTotalMoney / formula) * formula2)).toFixed(2)
            }
            if (data.No === 'ARC_PRD_7-K') {
              formula = (1 + incomeRatio)
              formula2 = assessRatio
              newData[data.indexs]['listPrice'] = (parseFloat((contractTotalMoney / formula) * formula2)).toFixed(2)
            }
            if (data.No === 'ARC_PRD_TASK_10') {
              formula = (1 + incomeRatio)
              formula2 = incomeRatio * (1 - assessRatio)
              newData[data.indexs]['listPrice'] = (parseFloat((contractTotalMoney / formula) * formula2)).toFixed(2)
            }
            if (data.No === 'ARC_PRD_TASK_10_K') {
              formula = (1 + incomeRatio)
              formula2 = incomeRatio * assessRatio
              newData[data.indexs]['listPrice'] = (parseFloat((contractTotalMoney / formula) * formula2)).toFixed(2)
            }
          }
        }
        newData[data.indexs][data.columns] = indexData
      }
      this.inputChange(newData,[data.indexs])
      this.setState({
        dataSource: newData,
      })
    }
  }
  canCel = (index,column) => {
    const newData = this.state.dataSource.slice(0)
    newData[index][column] = ''
    this.setState({
      dataSource: newData,
    })
  }
  handleSelectChange = (data) => {
    let selectData = []
    selectData = data.split('&')
    const newData = this.state.dataSource.slice(0)
    newData[selectData[1]][selectData[2]] = selectData[0]
    this.setState({
      dataSource: newData,
    })
  }
  renderColumns = (text, index, column,record) => {
    if(column=="product"){
      return <ProductLine disabled={this.state.editFlag} onCancel={()=>this.canCel(index,column)} text={text ? text : ''} onChange={this.handleChange} valueName={record['productName'] ? record['productName'] : ''} value={record.product}  indexs={index} columns={column} />
    }
    if(column ==='contractCategory'){
      const parentOrderListLineId = record.parentOrderListLineId ? record.parentOrderListLineId : ''
      let parentCode = ''
      if (parentOrderListLineId !== '') {
        const dataSource = this.state.dataSource.slice(0)
        let parentContractCategory = []
        parentContractCategory = dataSource.filter(o=> o.orderListLineId && o.orderListLineId === parentOrderListLineId)
        parentCode = parentContractCategory && parentContractCategory[0].contractCategory ? parentContractCategory[0].contractCategory : ''
      }

      return(
        <ContractType
          parentCode={parentCode}
          hasEmpty
          onChange={this.handleChange}
          value={record[column]}
          text={text ? text : ''}
          indexs={index}
          columns={column}
          disabled={this.state.editFlag}
        />
      )
    }
    if(column ==="returnTaxRate"){
      return(
        <ContractType
          typeCode="BILLED_SPLIT"
          paramCode="RETURN_CONTRACT_TAX"
          hasEmpty
          onChange={this.handleChange}
          value={this.state.dataSource[index][column]}
          text={text ? text : ''}
          indexs={index}
          columns={column}
          disabled={this.state.editFlag}
        />
      )
    }
    if(column ==='contractTaxRate'){
      return(
        <ContractType
          typeCode='BILLED_SPLIT'
          paramCode='CONTRACT_TAX'
          hasEmpty
          onChange={this.handleChange}
          value={this.state.dataSource[index][column]}
          text={text ? text : 0}
          indexs={index}
          columns={column}
          disabled={this.state.editFlag}
        />
      )
    }
  }
  renderInputColumns(text, index, column) {
    return (
      <EditableCell
        column={column}
        value={text ? text : 0}
        onChange={value => this.handleInputChange(value, index, column)}
        disable={this.state.editFlag}
      />
    )
  }
  handleInputChange = (value, index, column) => {
    let newData = this.state.dataSource.slice(0)
    const contractAmount = parseFloat(this.props.data[0].contractAmount)
    if(column==='discount') {
      if(parseFloat(value) < 0){
        message.error('折扣不能为负数')
        return
    }
      if(contractAmount < 0 && parseFloat(value) > 0){
        message.error('合同总金额为负数，目录价不能为正数')
        return
      }
      if(contractAmount > 0 && parseFloat(value) < 0){
        message.error('合同总金额为正数，目录价不能为负数')
        return
      }

    }
    newData[index][column] = value
    newData = this.inputChange(newData,index)
    this.setState({
      dataSource: newData,
    })
  }
  checkType = (string) => {
    let value = 0
    if(string){
      if(typeof string ==='string' || typeof text ==='number'){
        value = string ? string : 0
      }else if(string.length > 0){
        value = string[1] ? string[1] : 0
      }
    }
    return value
  }
  inputChange = (newData,index) => {

    const contractTaxRate = this.checkType(newData[index].contractTaxRate)
    const returnTaxRate = this.checkType(newData[index].returnTaxRate)

    const discount = newData[index].discount  ? newData[index].discount : 0
    const listPrice = newData[index].listPrice ? newData[index].listPrice : 0
    newData[index].discountedPrice = (parseFloat(listPrice) * (1 - parseFloat(discount) * 0.01)).toFixed(2) // 折后合同额根据目录价和折扣计算出来
    newData[index].contractAmountTaxInclude = (parseFloat(listPrice) * (1 - parseFloat(discount) * 0.01)).toFixed(2) // 合同含税额：等于折后合同额
    newData[index].contractAmountTaxExclude = (parseFloat(newData[index].contractAmountTaxInclude) / (1 + parseFloat(contractTaxRate))).toFixed(2) // 合同不含税额 根据合同含税额和合同税率计算出合同不含税额
    newData[index].returnTaxRevenue = (parseFloat(newData[index].contractAmountTaxInclude) / (1 + parseFloat(contractTaxRate)) * (parseFloat(returnTaxRate))).toFixed(2) // 退税收入含税额：等于合同含税额/(1+合同税率)*(退税率)
    newData[index].grossOrder = (parseFloat(newData[index].contractAmountTaxInclude)/(1 + parseFloat(contractTaxRate))).toFixed(2) // Gross Order：等于合同含税额/(1+合同税率)

    return newData
  }
  onTextAreaChange = (event) => {
    let getValue = event.target.value
    let len = getValue.length
    let maxLenght = 150
    if (len > maxLenght) {
      getValue = getValue.substring(0, maxLenght)
    }
    this.setState({
      rcontent: getValue,
      rcontentnum: len,
    })
  }
  renderSelect = (text, index, column) => {
    return (
      <Select disabled={this.state.editFlag} onChange={this.handleSelectChange} placeholder="请选择拆分状态" value={text ? `${text}&${index}&${column}` : `POC&${index}&${column}`}>
        <Option value={`POC&${index}&${column}`}>POC</Option>
        <Option value={`RATABLY&${index}&${column}`}>RATABLY</Option>
        <Option value={`FA&${index}&${column}`}>FA</Option>
      </Select>
    )
  }
  handleAdd = (index, flag) => {
    const newDataSource = this.state.dataSource
    const newData = {
      parentOrderListLineId: '',
      orderListLineId: '110'+new Date().getTime(),
      subRow: false,
      discount: 0,
      returnTaxRate: 0,
      revenueCheckout: "POC",

    }
    const subParentOrderListLineId = newDataSource.length && newDataSource[index].orderListLineId ? newDataSource[index].orderListLineId : ''
    const newSubData = {
      taskOpration: 'addSub',
      parentKey: index,
      parentOrderListLineId: subParentOrderListLineId,
      orderListLineId: '110'+new Date().getTime(),
      subRow: true,
      discount: 0,
      returnTaxRate: 0,
      revenueCheckout: "POC",
    }
    const indexArray = []
      newDataSource.map((item,index)=>{
      if(item.parentOrderListLineId && item.parentOrderListLineId === subParentOrderListLineId){
        indexArray.push(index)
      }
    })
    let max = indexArray[0];

    for(var i=1;i<indexArray.length;i++){

      if(max<indexArray[i])max=indexArray[i];

    }
    // flag == 0 为增加子行
    if (flag === '0') {
      if(max){
        newDataSource.splice(parseInt(max) + 1, 0, newSubData)
      }else{
        newDataSource.splice(parseInt(index) + 1, 0, newSubData)
      }
    }

    if (flag === '1') {
      newDataSource.splice(-1, 0, newData)
    }
    this.setState({
      dataSource: newDataSource,
    })
  }
  // 合同拆分删除数据
  handleMinus = (index) => {
    const newData = this.state.dataSource
    const parentId = newData[index].orderListLineId
    for(let i = 0, flag = true ; i < newData.length ; flag ? i++ : i) {
      if (newData[i] && newData[i].parentOrderListLineId === parentId) {
        newData.splice(i,1)
        flag = false
      }else {
        flag = true
      }
    }
    newData.splice(index,1)
    this.setState({
      dataSource: newData,
    })
  }
  // 拆分保存接口
  handleOk = () => {
    const coutnData = this.state.dataSource.slice(0)
    const contractAmount = parseFloat(this.props.data[0].contractAmount)
    let totalListPrice = 0
    coutnData.map((item) => {
      if (!item.parentOrderListLineId || item.parentOrderListLineId === '') {
        totalListPrice += !item || !item.listPrice ? 0 : parseFloat(item.listPrice) // 合计目录价
      }
    })
    if(Math.abs(totalListPrice) > Math.abs(contractAmount)) {
      message.error('目录价之和不能大于合同总金额')
      return
    }

    const param = this.props.form.getFieldsValue()
    const relatedBuNoName = param && param.relatedBuNo ? param.relatedBuNo[1] : ''
    const projectBuNoName = param && param.projectBuNo ? param.projectBuNo[1] : ''

    param.projectBuNo = param && param.projectBuNo ? param.projectBuNo[0] : ''
    param.relatedBuNo = param && param.relatedBuNo ? param.relatedBuNo[0] : ''
    param.relatedBuNoName = relatedBuNoName
    param.projectBuNoName = projectBuNoName

    if (param.maintainBeginDate === '' || typeof param.maintainBeginDate ==='undefined') {
      message.error('保修开始时间不能为空！')
      return
    }
    if (param.relatedBuNo === '' || typeof param.relatedBuNo ==='undefined') {
      message.error('关联BU不能为空！')
      return
    }
    if (param.revenueCheckout && param.revenueCheckout.length<=0 || typeof param.revenueCheckout ==='undefined') {
      message.error('收入结算方式不能为空！')
      return
    }
    if (param.projectBuNo === '' || typeof param.projectBuNo ==='undefined' || typeof param.projectBuNoName ==='undefined') {
      message.error('立项BU不能为空！')
      return
    }
    const splitListInfo = this.state.dataSource.slice(0,-1)
    if (splitListInfo.length <=0) {
      message.error('请对数据进行拆分！')
      return
    }
    // 校验父级目录价与子级目录价之和是否相等
    let length = splitListInfo.length
    for(let i = 0; i< length; i++){
      let parentPrice = splitListInfo[i].listPrice
      let parentId = splitListInfo[i].orderListLineId
      let subPrice = 0  // 累加子级目录价
      let flag = true
      for(let j=i;j<length;j++){
        if(splitListInfo[j].parentOrderListLineId==parentId){
          subPrice =parseFloat(splitListInfo[j].listPrice) + parseFloat(subPrice)
          flag = false
        }
      }
      if(!flag && parentPrice != subPrice){
        message.error(`父级目录价与子级目录价之和不相等`)
        return
      }
    }

    const newLisfInfo = []
    let j = 1
    for(let i of splitListInfo) {
      if (!i.contractCategory || i.contractCategory.length <=0) {
        message.error('合同类型不能为空！')
        return
      }
      if (!i.product || i.product.length <= 0) {
        message.error('产品线不能为空！')
        return
      }
      if (!i.revenueCheckout || typeof i.revenueCheckout === "undefined") {
        message.error('结算方式不能为空！')
        return
      }
      if (i.listPrice === '' || typeof i.listPrice === "undefined") {
        message.error('目录价不能为空3！')
        return
      }
      if (i.discount === '' || typeof i.discount === "undefined") {
        message.error('折扣不能为空！')
        return
      }
      if (i.returnTaxRate === '' || typeof i.returnTaxRate === "undefined") {
        message.error('退税率不能为空！')
        return
      }

      let contractCategory = ''
      let product = ''
      let returnTaxRate = ''
      let contractTaxRate = ''
      if(typeof i.contractCategory ==='string'){
        contractCategory = i.contractCategory
      }else if (i.contractCategory && i.contractCategory.length > 0) {
        contractCategory = i.contractCategory[0]
      }
      if(typeof i.product ==='string' || typeof i.product ==='number'){
        product = i.product
      }else if (i.product.length > 0) {
        product = i.product[1]
      }
      if(typeof i.returnTaxRate ==='string' || typeof i.returnTaxRate ==='number'){
        returnTaxRate = i.returnTaxRate
      }else if (i.returnTaxRate.length > 0) {
        returnTaxRate = i.returnTaxRate[0]
      }
      if(typeof i.contractTaxRate ==='string' || typeof i.contractTaxRate ==='number'){
        contractTaxRate = i.contractTaxRate
      }else if (i.contractTaxRate && i.contractTaxRate.length > 0) {
        contractTaxRate = i.contractTaxRate[0]
      }
      newLisfInfo.push({
        ...i,
        product,
        returnTaxRate,
        contractTaxRate,
        contractCategory,
        orderKey: j++,
      })
    }
    // 对结算方式进行拼接转换
    let revenueCheckout = ''
     if(param.revenueCheckout){
       param.revenueCheckout.map((item,index)=>{
         if(revenueCheckout===''){
           revenueCheckout +=item
         }else{
           revenueCheckout +=','+item
         }
       })
     }
    if(this.props.data[0].orderListLines){
      delete this.props.data[0].orderListLines
    }
    // 拼接保存参数
    const postParams = {}
    postParams.splitListInfo = newLisfInfo
    postParams.contractInfo = this.props.data[0]
    if(!postParams.contractInfo.splitedByName){
      postParams.contractInfo.splitedByName = this.props.user
    }
    postParams.contractInfo.projectBuNo = param.projectBuNo
    postParams.contractInfo.relatedBuNo = param.relatedBuNo
    postParams.contractInfo.relatedBuNoName = param.relatedBuNoName
    postParams.contractInfo.projectBuNoName = param.projectBuNoName
    postParams.contractInfo.revenueCheckout = revenueCheckout
    postParams.contractInfo.maintainBeginDate = param.maintainBeginDate
    postParams.contractInfo.splitedRemark = this.state.rcontent
    postParams.contractInfo.task1tCost = param.task1tCost
    postParams.contractInfo.task3tCost = param.task3tCost
    postParams.contractInfo.task4tCost = param.task4tCost
    postParams.contractInfo.task5Cost = param.task5Cost
    postParams.contractInfo.task9Cost = param.task9Cost
    postParams.contractInfo.intercompanyCost = param.intercompanyCost
    postParams.contractInfo.subcontractFee = param.subcontractFee

    this.props.saveInfo(postParams)
    this.closeModal()
  }
  closeModal = () => {
    this.setState({
      dataSource: [],
    })
    this.props.closeModal()
  }
  chk = (currentValue) => {
  let patrn = /^(\-|\+)?\d+(\.\d+)?$/
    if(!patrn.test(currentValue)){
      return false
    }else{
      return true
    }
  }
  handleTaskCostChange = (v,flag) =>{
    const countValueData = this.state.countTaskCostData
    countValueData[flag] = v
    this.setState({
      countTaskCostData:countValueData,
    })
  }
  handleEdit = () => {
    this.setState({
      editFlag: false,
    })
  }
  handleReturn = () => {
    this.setState({
      dataSource:_.cloneDeep(this.state.oldDataSource.slice(0)),
    },()=>{
      const constractData = this.props.data[0]
      this.props.form.setFieldsValue({
        relatedBuNo: [constractData.relatedBuNo,constractData.relatedBuNoName],
        maintainBeginDate: constractData.maintainBeginDate,
        revenueCheckout: constractData['revenueCheckout'],
        projectBuNo: [constractData.projectBuNo,constractData.projectBuNoName],
        task1Cost: constractData.task1tCost ? constractData.task1tCost : 0 ,
        task3tCost: constractData.task3tCost ? constractData.task3tCost : 0,
        task4tCost: constractData.task4tCost ? constractData.task4tCost : 0,
        task5Cost: constractData.task5Cost ? constractData.task5Cost : 0,
        task9Cost: constractData.task9Cost ? constractData.task9Cost : 0,
        intercompanyCost: constractData.intercompanyCost ? constractData.intercompanyCost : 0,
        subcontractFee: constractData.subcontractFee,
      });
    })

  }
  goDetail = (url) => {
    if(url){
      window.open(url)
    }else{
      message.error('获取链接地址失败')
    }
  }
  render() {
    const dataSource = _.cloneDeep(this.state.dataSource.slice(0))
    const constractDatas = this.props.data
    const constractData = constractDatas[0]
    let countCatalPrice = 0 // 合计目录价 catalogue
    let discountCatalPrice = 0 // 折后目录价
    let countsalePeo = 0 // 合同不含税额
    let countcontractType1 = 0 // 退税收入含税额
    let countGrossOrder = 0 // GrossOrder
    let countTaskCost = 0;
    const countTaskCostData = this.state.countTaskCostData
    for(let i in countTaskCostData){
      countTaskCost +=parseFloat(countTaskCostData[i])
    }
    const coutnData = this.state.dataSource.slice(0)
    coutnData.map((item) => {
      if (!item.parentOrderListLineId || item.parentOrderListLineId === '') {
        countCatalPrice += !item || !item.listPrice ? 0 : parseFloat(item.listPrice) // 合计目录价
        discountCatalPrice += !item || !item.discountedPrice ? 0 : parseFloat(item.discountedPrice) // 折后目录价
        countsalePeo += !item || !item.contractAmountTaxExclude ? 0 : parseFloat(item.contractAmountTaxExclude) // 合同不含税额
        countcontractType1 += !item || !item.returnTaxRevenue ? 0 : parseFloat(item.returnTaxRevenue) // 退税收入含税额
        countGrossOrder += !item || !item.grossOrder ? 0 : parseFloat(item.grossOrder) // GrossOrder
      }
    })
    const { getFieldDecorator } = this.props.form
    const columns = [{
      title: 'Task操作',
      dataIndex: 'taskOpration',
      width: 120,
      textAlign: 'center',
      fixed: 'left',
      render: (text, record, index) => (
        text === '合计' ? text :
          (
            (text === 'addSub' || record.parentOrderListLineId) ?
              <div style={{textAlign:'right',paddingRight: '8px'}}>
                <Button disabled={this.state.editFlag} onClick={() => this.handleMinus(index)}>－</Button>
              </div>
              :
              <div>
                <Button disabled={this.state.editFlag} onClick={() => this.handleAdd(index, '0')}>＋</Button>&nbsp;&nbsp;
                <Button disabled={this.state.editFlag} onClick={() => this.handleMinus(index)}>－</Button>
              </div>
          )
      ),
    }, {
      title: <span>合同类型<em style={{ color: '#FF0000' }}>*</em></span>,
      dataIndex: 'contractCategory',
      width: 200,
      render: (text, record, index) => record.taskOpration === '合计' ? '' : this.renderColumns(text, index, 'contractCategory',record),
    }, {
      title: <span>产品线<em style={{ color: '#FF0000' }}>*</em></span>,
      dataIndex: 'product',
      width: 200,
      render: (text, record, index) => record.taskOpration === '合计' ? '' : this.renderColumns(text, index, 'product',record),
    }, {
      title: <span>结算方式<em style={{ color: '#FF0000' }}>*</em></span>,
      dataIndex: 'revenueCheckout',
      width: 100,
      render: (text, record, index) => record.taskOpration === '合计' ? '' : this.renderSelect(text, index, 'revenueCheckout'),
    }, {
      title: <span>目录价<em style={{ color: '#FF0000' }}>*</em></span>,
      dataIndex: 'listPrice',
      width: 80,
      render: (text, record, index) => record.taskOpration === '合计' ? currency(countCatalPrice) : this.renderInputColumns(text, index, 'listPrice'),
    }, {
      title: <span>折扣<em style={{ color: '#FF0000' }}>*</em></span>,
      dataIndex: 'discount',
      width: 80,
      render: (text, record, index) => record.taskOpration === '合计' ? '' : this.renderInputColumns(text, index, 'discount'),
    }, {
      title: '折后目录价',
      dataIndex: 'discountedPrice',
      width: 100,
      render: (text, record, index) => record.taskOpration === '合计' ? currency(discountCatalPrice) : currency(text),
    }, {
      title: '合同含税额',
      dataIndex: 'contractAmountTaxInclude',
      width: 100,
      render: (text, record, index) => record.taskOpration === '合计' ? currency(discountCatalPrice) : currency(text),
    }, {
      title: '合同税率',
      dataIndex: 'contractTaxRate',
      width: 80,
      render: (text, record, index) => record.taskOpration === '合计' ? '' : this.renderColumns(text, index, 'contractTaxRate',record),
    }, {
      title: '合同不含税额',
      dataIndex: 'contractAmountTaxExclude',
      width: 100,
      render: (text, record, index) => record.taskOpration === '合计' ? currency(countsalePeo) : currency(text),
    }, {
      title: <span>退税率<em style={{ color: '#FF0000' }}>*</em></span>,
      dataIndex: 'returnTaxRate',
      width: 80,
      render: (text, record, index) => record.taskOpration === '合计' ? '' : this.renderColumns(text, index, 'returnTaxRate',record),
    }, {
      title: '退税额',
      dataIndex: 'returnTaxRevenue',
      width: 100,
      render: (text, record, index) => record.taskOpration === '合计' ? currency(countcontractType1) : currency(text),
    }, {
      title: 'Gross Order',
      dataIndex: 'grossOrder',
      width: 100,
      render: (text, record, index) => record.taskOpration === '合计' ? currency(countGrossOrder) : currency(text),
    }, {
      title: <span>服务期起始</span>,
      dataIndex: 'serviceStartDate',
      width: 120,
      render: (text, record, index) => {
        return (
          record.taskOpration === '合计' ? '' :
          <MyDtatePicker disabled={this.state.editFlag} value={this.state.dataSource[index]['serviceStartDate']} onChange={this.selectDateChange} indexs={index} columns='serviceStartDate'  />
        )
      }
    }, {
      title: <span>服务期结束</span>,
      dataIndex: 'serviceEndDate',
      width: 120,
      render: (text, record, index) => {
        return (
          record.taskOpration === '合计' ? '' :
          <MyDtatePicker disabled={this.state.editFlag} value={this.state.dataSource[index]['serviceEndDate']} onChange={this.selectDateChange} indexs={index} columns='serviceEndDate' />
        )
      }
    },
    ]
    return (
      <div>
        <Modal
          width={1024}
          maskClosable={false}
          title="合同拆分"
          visible={true}
          onCancel={this.closeModal}
          footer={[
            <Button onClick={this.handleEdit} style={{display:this.state.editFlag ? 'inline-block' : 'none'}}>
              编辑
            </Button>,
            <Button key="submit" onClick={this.handleOk} style={{display:this.state.editFlag ? 'none' : 'inline-block'}}>
              保存
            </Button>,
            <Button onClick={this.handleReturn} style={{display:this.state.editFlag ? 'none' : 'inline-block'}}>
              还原
            </Button>,
            <Button key="back" onClick={this.closeModal}>
              取消
            </Button>,
          ]}
        >
          <div>
            <Form>
              <Row>
                <Col span={4}>
                  <h2>合同OrderList信息</h2>
                </Col>
                <Col span={4}>
                  <button onClick={()=>this.goDetail(this.props.contractUrl[0] ? this.props.contractUrl[0].url : '')}>合同审批表及合同扫描件</button>
                </Col>
              </Row>
              <br />
              <Row className="contractRowBorder text-css">
                <Col span={4} className="contract-bg">
                  合同名称：
                </Col>
                <Col span={20} className="contractRowBorderLeft">
                  <div className="contractRowBorderNo" style={{ textAlign: 'left', paddingLeft: '2px' }} title={constractData.contractName}>
                    {constractData.contractName}
                  </div>
                </Col>
              </Row>
              <Row className="text-css contractRowBorderLeft contractRowBorderBottom">
                <Col span={4} className="contract-bg">
                  合同编码：
                </Col>
                <Col span={5} className="contractRowBorderLeft">
                  <div className="contractRowBorderNo" style={{ textAlign: 'left', paddingLeft: '2px' }} title={constractData.contractNo}>
                    {constractData.contractNo}
                  </div>
                </Col>
                <Col span={3} className="contractRowBorderLeft contract-bg">
                  签约公司：
                </Col>
                <Col span={4} className="contractRowBorderLeft">
                  <div className="contractRowBorderNo" style={{ textAlign: 'left', paddingLeft: '2px' }} title={constractData.companyName}>
                    {constractData.companyName}
                  </div>
                </Col>
                <Col span={3} className="contractRowBorderLeft contract-bg">
                  签约日期：
                </Col>
                <Col span={5} className="contractRowBorderLeft contractRowBorderRight">
                  <div className="contractRowBorderNo" style={{ textAlign: 'left', paddingLeft: '2px' }}>
                    {constractData.contractDate}
                  </div>
                </Col>
              </Row>
              <Row className="text-css contractRowBorderLeft">
                <Col span={4} className='contract-bg'>
                  合同币种：
                </Col>
                <Col span={5} className="contractRowBorderLeft">
                  <div className="contractRowBorderNo" style={{ textAlign: 'left', paddingLeft: '2px' }}>
                    {constractData.contractCurrency}
                  </div>
                </Col>
                <Col span={3} className="contractRowBorderLeft contract-bg">
                  合同总金额：
                </Col>
                <Col span={4} className="contractRowBorderLeft">
                  <div className="contractRowBorderNo" style={{ textAlign: 'left', paddingLeft: '2px' }}>
                    {currency(constractData.contractAmount)}
                  </div>
                </Col>
                <Col span={3} className="contractRowBorderLeft contract-bg">
                  A-第三方产品：
                </Col>
                <Col span={5} className="contractRowBorderLeft contractRowBorderRight">
                  <div className="contractRowBorderNo" style={{ textAlign: 'left', paddingLeft: '2px' }}>
                    {constractData.aThirdProduct ? currency(constractData.aThirdProduct) : 0}
                  </div>
                </Col>
              </Row>
              <Row className="text-css contractRowBorderLeft contractRowBorderTop">
                <Col span={4} className="contract-bg">
                  B-集成服务：
                </Col>
                <Col span={5} className="contractRowBorderLeft">
                  <div className="contractRowBorderNo" style={{ textAlign: 'left', paddingLeft: '2px' }}>
                    {constractData.bIntegration ? currency(constractData.bIntegration) : 0}
                  </div>
                </Col>
                <Col span={3} className="contractRowBorderLeft contract-bg">
                  C-软件解决方案：
                </Col>
                <Col span={4} className="contractRowBorderLeft">
                  <div className="contractRowBorderNo" style={{ textAlign: 'left', paddingLeft: '2px' }}>
                    {constractData.cSolution ? currency(constractData.cSolution) : 0}
                  </div>
                </Col>
                <Col span={3} className="contractRowBorderLeft contract-bg">
                  D-培训：
                </Col>
                <Col span={5} className="contractRowBorderLeft contractRowBorderRight">
                  <div className="contractRowBorderNo" style={{ textAlign: 'left', paddingLeft: '2px' }}>
                    {constractData.dTraining ? currency(constractData.dTraining) : 0}
                  </div>
                </Col>
              </Row>
              <Row className="text-css contractRowBorderLeft contractRowBorderTop">
                <Col span={4} className="contract-bg">
                  软件解决方案保修期：
                </Col>
                <Col span={5} className="contractRowBorderLeft">
                  <div className="contractRowBorderNo" style={{ textAlign: 'left', paddingLeft: '2px' }}>
                    {constractData.solutionMaintain}
                  </div>
                </Col>
                <Col span={3} className="contractRowBorderLeft contract-bg">
                  维护服务开始时间：
                </Col>
                <Col span={4} className="contractRowBorderLeft">
                  <div className="contractRowBorderNo" style={{ textAlign: 'left', paddingLeft: '2px' }}>
                    {constractData.maintainStartDate}
                  </div>
                </Col>
                <Col span={3} className="contractRowBorderLeft contract-bg">
                  维护服务结束时间：
                </Col>
                <Col span={5} className="contractRowBorderLeft contractRowBorderRight">
                  <div className="contractRowBorderNo" style={{ textAlign: 'left', paddingLeft: '2px' }}>
                    {constractData.maintainEndDate}
                  </div>
                </Col>
              </Row>
              <Row className="text-css contractRowBorderLeft  contractRowBorderTop">
                <Col span={4} className="contract-bg">
                  保修期开始时间<em style={{ color: '#FF0000' }}>*</em>：
                </Col>
                <Col span={5} className="contractRowBorderLeft">
                  <FormItem>
                    {getFieldDecorator('maintainBeginDate', {
                      initialValue: constractData.maintainBeginDate,
                    })(
                      <SelectInvokeApi
                        placeholder="请选择保修期开始时间"
                        paramCode="MAINTAIN_TIME"
                        typeCode="BILLED_SPLIT"
                        disabled={this.state.editFlag}
                      />
                    )}
                  </FormItem>
                </Col>
                <Col span={3} className="contractRowBorderLeft  contract-bg">
                  合同拆分操作人：
                </Col>
                <Col span={4} className="contractRowBorderLeft">
                  <div className="contractRowBorderNo" style={{ textAlign: 'left', paddingLeft: '2px' }}>
                    {constractData.splitedByName ? (this.state.editFlag ? constractData.splitedByName : this.props.user) : <div style={{display: this.state.editFlag ? 'none' : 'inline-block'}}>{this.props.user}</div>  }
                  </div>
                </Col>
                <Col span={3} className="contractRowBorderLeft contract-bg">
                  关联BU<em style={{ color: '#FF0000' }}>*</em>：
                </Col>
                <Col span={5} className="contractRowBorderLeft contractRowBorderRight constractInput">
                  <FormItem>
                    {
                      getFieldDecorator('relatedBuNo',{initialValue:[constractData.relatedBuNo,constractData.relatedBuNoName]},)(<SelectSbu keyName='contract' disabled={this.state.editFlag} />)
                    }
                  </FormItem>
                </Col>
              </Row>
              <Row className="text-css contractRowBorder">
                <Col span={4} className="contract-bg ">
                  C-FORM版本GM%：
                </Col>
                <Col span={5} className="contractRowBorderLeft">
                  <div className="contractRowBorderNo" style={{ textAlign: 'left', paddingLeft: '2px' }}>
                    {constractData.cFormGm}
                  </div>
                </Col>
                <Col span={3} className="contractRowBorderLeft contract-bg">
                  收入结算方式<em style={{ color: '#FF0000' }}>*</em>：
                </Col>
                <Col span={7} className="contractRowBorderLeft" style={{ textAlign: 'left',paddingLeft: '2px'}}>
                  <FormItem>
                    {getFieldDecorator('revenueCheckout', {
                      initialValue: constractData['revenueCheckout'],
                    })(
                      <Checkbox.Group disabled={this.state.editFlag}>
                        <Checkbox value="POC">POC</Checkbox>
                        <Checkbox value="RATABLY">RATABLY</Checkbox>
                        <Checkbox value="FA">FA</Checkbox>
                      </Checkbox.Group>
                    )}
                  </FormItem>
                </Col>
                <Col span={2} className="contractRowBorderLeft contract-bg" style={{left:'1px'}}>
                  考核比率：
                </Col>
                <Col span={3} className="contractRowBorderLeft">
                  <div className="contractRowBorderNo">
                    {constractData.assessRatio}
                  </div>
                </Col>
              </Row>
              <br />
              <br />
              <h2>项目信息</h2>
              <br />
              <Row className="text-css contractRowBorderLeft  contractRowBorderTop contractRowBorderRight">
                <Col span={4} className="contract-bg">
                  项目编码：
                </Col>
                <Col span={5} className="contractRowBorderLeft">
                  <div className="contractRowBorderNo" style={{ textAlign: 'left', paddingLeft: '2px' }} title={constractData.projectNo}>
                    {constractData.projectNo}
                  </div>
                </Col>
                <Col span={3} className="contractRowBorderLeft  contract-bg">
                  项目立项部门：
                </Col>
                <Col span={4} className="contractRowBorderLeft">
                  <div className="contractRowBorderNo" style={{ textAlign: 'left', paddingLeft: '2px' }}>
                    {constractData.projectDeptNo}
                  </div>
                </Col>
                <Col span={3} className="contractRowBorderLeft  contract-bg">
                  项目经理：
                </Col>
                <Col span={5} className="contractRowBorderLeft">
                  <div className="contractRowBorderNo" style={{ textAlign: 'left', paddingLeft: '2px' }}>
                    {constractData.projectManager}
                  </div>
                </Col>
              </Row>
              <Row className="text-css contractRowBorder">
                <Col span={4} className="contract-bg ">
                  是否集采项目：
                </Col>
                <Col span={5} className="contractRowBorderLeft">
                  <div className="contractRowBorderNo" style={{ textAlign: 'left', paddingLeft: '2px' }}>
                    {constractData.collectionProject === 'Y'  ? '是' : '否'}
                  </div>
                </Col>
                <Col span={3} className="contractRowBorderLeft contract-bg">
                  立项BU<em style={{ color: '#FF0000' }}>*</em>：
                </Col>
                <Col span={4} className="contractRowBorderLeft constractInput">
                  <FormItem>
                    {
                      getFieldDecorator('projectBuNo',{initialValue:[constractData.projectBuNo,constractData.projectBuNoName]},)(<SelectSbu height="20px" keyName='contract' disabled={this.state.editFlag} />)
                    }
                  </FormItem>
                </Col>
                <Col span={3} className="contractRowBorderLeft contract-bg">
                  Sales签约BU：
                </Col>
                <Col span={5} className="contractRowBorderLeft">
                  <div className="contractRowBorderNo" style={{ textAlign: 'left', paddingLeft: '2px' }}>
                    {constractData.salesBuNo}:{constractData.salesBuNoName}
                  </div>
                </Col>
              </Row>
              <br />
              <br />
              <Row>
                <Col span={2}>
                  <h2>合同拆分</h2>
                </Col>
                <Col>
                  <Button disabled={this.state.editFlag} onClick={() => this.handleAdd('0', '1')}>新增</Button>
                </Col>
              </Row>
              <br />
              <Table
                bordered
                columns={columns}
                size="middle"
                scroll={{ x: this.getTableWidth(columns) }}
                dataSource = {dataSource}
                pagination={false}
              />
              <h2>外购成本预算</h2>
              <br />
              <Row className="text-css contractRowBorderLeft  contractRowBorderTop">
                <Col span={5} className="contract-bg">
                  Task 1 cost(成本)：
                </Col>
                <Col span={19} className="contractRowBorderLeft contractRowBorderRight">
                  <FormItem>
                    {
                      getFieldDecorator('task1Cost',{
                        initialValue:constractData.task1tCost ? currency(constractData.task1tCost) : 0
                      },)(<InputNumber style={{width:'100%'}} className="contractRowBorderNo" onChange={(v)=>this.handleTaskCostChange(v,'task1Cost')} disabled={this.state.editFlag} />)
                    }
                  </FormItem>

                </Col>
              </Row>
              <Row className="text-css contractRowBorderLeft  contractRowBorderTop">
                <Col span={5} className="contract-bg">
                  Task 3T cost(第三方软件成本)：
                </Col>
                <Col span={5} className="contractRowBorderLeft">
                  <FormItem>
                    {
                      getFieldDecorator('task3tCost',{initialValue:constractData.task3tCost ? currency(constractData.task3tCost) : 0 },)(<InputNumber style={{width:'100%'}} className="contractRowBorderNo" onChange={(v)=>this.handleTaskCostChange(v,'task3tCost')} disabled={this.state.editFlag} />)
                    }
                  </FormItem>

                </Col>
                <Col span={5} className="contractRowBorderLeft contract-bg">
                  Task 4T cost(第三方软件支持成本)：
                </Col>
                <Col span={9} className="contractRowBorderLeft contractRowBorderRight">
                  <FormItem>
                    {
                      getFieldDecorator('task4tCost',{initialValue:constractData.task4tCost ? currency(constractData.task4tCost) : 0},)(<InputNumber style={{width:'100%'}} className="contractRowBorderNo" onChange={(v)=>this.handleTaskCostChange(v,'task4tCost')} disabled={this.state.editFlag} />)
                    }
                  </FormItem>
                </Col>
              </Row>
              <Row className="text-css contractRowBorderLeft  contractRowBorderTop">
                <Col span={5} className="contract-bg">
                  Task 5 cost(外购硬件设备成本)：
                </Col>
                <Col span={5} className="contractRowBorderLeft">
                  <FormItem>
                    {
                      getFieldDecorator('task5Cost',{initialValue:constractData.task5Cost ? currency(constractData.task5Cost) : 0},)(<InputNumber style={{width:'100%'}} className="contractRowBorderNo" onChange={(v)=>this.handleTaskCostChange(v,'task5Cost')} disabled={this.state.editFlag} />)
                    }
                  </FormItem>
                </Col>
                <Col span={5} className="contractRowBorderLeft contract-bg">
                  Task 9 cost(外购支持服务成本)：
                </Col>
                <Col span={9} className="contractRowBorderLeft contractRowBorderRight">
                  <FormItem>
                    {
                      getFieldDecorator('task9Cost',{initialValue:constractData.task9Cost ? currency(constractData.task9Cost) : 0},)(<InputNumber style={{width:'100%'}} className="contractRowBorderNo" onChange={(v)=>this.handleTaskCostChange(v,'task9Cost')} disabled={this.state.editFlag} />)
                    }
                  </FormItem>
                </Col>
              </Row>
              <Row className="text-css contractRowBorderLeft  contractRowBorderTop">
                <Col span={5} className="contract-bg">
                  关联公司成本：
                </Col>
                <Col span={19} className="contractRowBorderLeft contractRowBorderRight">
                  <FormItem>
                    {
                      getFieldDecorator('intercompanyCost',{initialValue:constractData.intercompanyCost ? currency(constractData.intercompanyCost) : 0},)(<InputNumber style={{width:'100%'}} className="contractRowBorderNo" onChange={(v)=>this.handleTaskCostChange(v,'intercompanyCost')} disabled={this.state.editFlag} />)
                    }
                  </FormItem>
                </Col>
              </Row>
              <Row className="text-css contractRowBorderLeft  contractRowBorderTop">
                <Col span={5} className="contract-bg">
                  关联分包费：
                </Col>
                <Col span={19} className="contractRowBorderLeft contractRowBorderRight">
                  <FormItem>
                    {
                      getFieldDecorator('subcontractFee',{initialValue:constractData.subcontractFee ? currency(constractData.subcontractFee) : 0},)(<InputNumber style={{width:'100%'}} className="contractRowBorderNo" onChange={(v)=>this.handleTaskCostChange(v,'subcontractFee')} disabled={this.state.editFlag}/>)
                    }
                  </FormItem>
                </Col>
              </Row>
              <Row className="text-css contractRowBorder">
                <Col span={5} className="contract-bg">
                  合计：
                </Col>
                <Col span={19} className="contractRowBorderLeft">
                  <Input className="contractRowBorderNo" value={currency(countTaskCost)} />
                </Col>
              </Row>
              <br />
              <br />
              <h2>拆分备注</h2>
              <br />
              <TextArea disabled={this.state.editFlag} rows={4} defaultValue={constractData.subcontractFee}  value={this.state.rcontent} onChange={this.onTextAreaChange} placeholder="根据实际情况录入，且不超过150字符" />
              <br />
              <br />
              <h2>Order</h2>
              <Row className="text-css contractRowBorder">
                <Col span={4}>
                  Gross Order：
                </Col>
                <Col span={4} className="contractRowBorderLeft ">
                  <Input className="contractRowBorderNo" value={currency(countGrossOrder)} disabled />
                </Col>
                <Col span={4} className="contractRowBorderLeft">
                  Net Order(Legal)：
                </Col>
                <Col span={4} className="contractRowBorderLeft">
                  <Input className="contractRowBorderNo" value={currency(countGrossOrder)} disabled />
                </Col>
                <Col span={4} className="contractRowBorderLeft">
                  Net Order（Management)：
                </Col>
                <Col span={4} className="contractRowBorderLeft">
                  <Input name="" className="contractRowBorderNo" value={currency(countGrossOrder)} disabled />
                </Col>
              </Row>
              <br />
              <br />
            </Form>
          </div>
        </Modal>
      </div>
    )
  }
}
const ContractSplitModalWithForm = Form.create()(ContractSplitModal)

export default ContractSplitModalWithForm
