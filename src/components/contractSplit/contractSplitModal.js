/**
 * Created by liangshuang on 17/12/12.
 */
/**
 * Created by liangshuang on 17/12/8.
 */
import React from 'react'
import SelectSbu from '../common/SelectSbu'
import ContractType from '../common/contractType'
import ContractType1 from '../common/contractType1'
import ProductNo from '../common/productNo'
import MyDtatePicker from '../common/myDatePicker'
import SelectInvokeApi from '../common/selectInvokeApi'
import currency from '../../util/currency'
import GetUrlModal from '../common/getUrlModal'
import _ from 'lodash'
import './contract.less'
import '../billApplication/billDetail.less'
import { Modal, Form, Table, Row, Col, Button, Input, Checkbox, DatePicker, Select, message, InputNumber } from 'antd'

const FormItem = Form.Item
const { TextArea } = Input
const Option = Select.Option

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
    const tableDeatail = _.cloneDeep(props.tableDetail)
    const data = props.data
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
      oldDataSource:_.cloneDeep(props.tableDetail),
      countCatalPrice: 0.00,
      rcontent: '',
      rcontentnum: 0,
      countTaskCost: 0.00,
      countTaskCostData: countTaskCostDataList,
      editFlag: true,
      saveFlag:false,
      controactInfo: props.data,
      initInfo: null,
      assessRatio:data.assessRatio,
      selectCountType:data.revenueCheckout ? data.revenueCheckout : [],
      openUrlModal:false,
      deleteData:[],
      productNoData:[],

    }
  }
  componentDidMount() {
   // 获取产品编码数据与合同类型数据
    const params = {}
    params.keywords = this.props.data.projectNo
    this.props.getProductNo(params).then((res)=>{
      if (res && res.response && res.response.resultCode === '000000') {
        this.setState({
          productNoData:res.response.pageInfo.result,
        })
      }
    })
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
    if(newData[data.indexs].orderListLineId){
      if(this.props.tableDetail[data.indexs][data.columns] !=data.dateString){

        newData[data.indexs].opsStatus = 'modify' //把数据的操作类型改为修改
      }else{
        newData[data.indexs].opsStatus = 'none' //把数据的操作类型改为修改
      }
    }
    newData[data.indexs][data.columns] = data.dateString
    this.setState({
      dataSource: newData,
    })
  }
  // 目录价计算
  calculateListPrice = (newData,data) => {
    const dataInfos = this.props.data
    const contractTotalMoney = dataInfos.contractAmount ? parseFloat(dataInfos.contractAmount) : 0 //  合同总金额
    const solutionMaintain = dataInfos.solutionMaintain ? dataInfos.solutionMaintain : 0 // 软件解决方案保修期
    //let assessRatio = dataInfos.assessRatio ? parseFloat(dataInfos.assessRatio) : 0 // 考核比率
    let assessRatio = this.state.assessRatio ? parseFloat(this.state.assessRatio) : 0 // 考核比率
    const incomeRatio =  parseFloat(parseFloat(solutionMaintain)/12 * 0.05)  // 收入比率
    if(isNaN(assessRatio)){
      assessRatio = 0
    }
    assessRatio = assessRatio/100 // 考核比率为百分数
    let formula = 1
    let formula2 = 1
    if (assessRatio !== 0) {
      if (data.No === '7') {
        formula = (1 + incomeRatio)
        formula2 = (1 - assessRatio)
        newData[data.indexs]['listPrice'] = (parseFloat((contractTotalMoney / formula) * formula2)).toFixed(2)
      }
      if (data.No === '7-K') {
        formula = (1 + incomeRatio)
        formula2 = assessRatio
        newData[data.indexs]['listPrice'] = (parseFloat((contractTotalMoney / formula) * formula2)).toFixed(2)
      }
      if (data.No === '10S') {
        formula = (1 + incomeRatio)
        formula2 = incomeRatio * (1 - assessRatio)
        newData[data.indexs]['listPrice'] = (parseFloat((contractTotalMoney / formula) * formula2)).toFixed(2)
      }
      if (data.No === '10S-K') {
        formula = (1 + incomeRatio)
        formula2 = incomeRatio * assessRatio
        newData[data.indexs]['listPrice'] = (parseFloat((contractTotalMoney / formula) * formula2)).toFixed(2)
      }

    }
    return newData
}
  handleChange = (data) => {

    const newData =_.cloneDeep(this.state.dataSource)
    if(data){
      const indexData = [data.No,data.Name]

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
          this.calculateListPrice(newData,data)
        }
        if(newData[data.indexs].orderListLineId){
          if(newData[data.indexs][data.columns] !=indexData[0]){
            newData[data.indexs].opsStatus = 'modify' //把数据的操作类型改为修改
          }else{
            newData[data.indexs].opsStatus = 'none' //把数据的操作类型改为修改
          }

        }
        newData[data.indexs][data.columns] = indexData
        if (data.columns === 'contractCategory') {
          newData[data.indexs]['taskDesc'] = indexData
        }
      }
      this.inputChange(newData,[data.indexs])
      console.log('indexData',indexData)
      console.log('newData',newData)
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
    let newSelectCountType = []
    selectData = data.split('&')
    const newData = this.state.dataSource.slice(0)
    if(newData[selectData[1]].orderListLineId){
      if(newData[selectData[1]][selectData[2]] !=selectData[0]){
        newData[selectData[1]].opsStatus = 'modify' //把数据的操作类型改为修改
      }else{
        newData[selectData[1]].opsStatus = 'none' //把数据的操作类型改为修改
      }
    }
    newData[selectData[1]][selectData[2]] = selectData[0]
    newData.forEach(item=>{
      if(item.revenueCheckout){
        newSelectCountType.push(item.revenueCheckout)
      }else if (!item.hasOwnProperty('revenueCheckout')) {
        newSelectCountType.push('POC')
      }
    })
    //newSelectCountType.push(this.state.selectCountType)
    let selectDatas = [...new Set([...newSelectCountType])]
    console.log('selectDatas',selectDatas)
    this.setState({
      dataSource: newData,
      selectCountType:selectDatas
    })
  }
  renderColumns = (text, index, column,record) => {
    if(column=="product"){
      // 如果产品编码为空，则取第一个数据为默认值
      if(!text && text != 0) {
        text = this.props.productNoData.length && this.props.productNoData[0].productNo ? this.props.productNoData[0].productNo : '0'
        //this.handleChange({No:text,Name:text,indexs:index,columns:column})
      }
      return ( <ProductNo
        placeholder="产品编码"
        hasEmpty
        onChange={this.handleChange}
        options = {this.state.productNoData}
        value={text}
        indexs={index}
        columns={column}
        disabled={this.state.editFlag}
      />)
    }
    if(column ==='contractCategory'){
      console.log('record',record)
      return(
        <ContractType1
          placeholder="合同类型"
          hasEmpty
          options = {this.state.productNoData}
          onChange={this.handleChange}
          value={text}
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
    const contractAmount = parseFloat(this.props.data.contractAmount)
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
    if(newData[index].orderListLineId){
      if(newData[index][column] !=value){
        newData[index].opsStatus = 'modify' //把数据的操作类型改为修改
      }else{
        newData[index].opsStatus = 'none' //把数据的操作类型改为修改
      }

    }
    newData[index][column] = value
    //newData[index].opsStatus = 'modify'
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
    return parseFloat(value)/100
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
    //newData[index].grossOrder = (parseFloat(newData[index].contractAmountTaxInclude)/(1 + parseFloat(contractTaxRate))).toFixed(2) // Gross Order：等于合同含税额/(1+合同税率)
    newData[index].grossOrder = (parseFloat(newData[index].contractAmountTaxExclude) + parseFloat(newData[index].returnTaxRevenue)).toFixed(2)  //Gross Order = 合同不含税金额+退税额
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
      <Select disabled={this.state.editFlag} onChange={this.handleSelectChange} placeholder="请选择拆分状态" value={text ? `${text}&${index}&${column}` : ''}>
        <Option value=''>请选择</Option>
        <Option value={`POC&${index}&${column}`}>POC</Option>
        <Option value={`RATABLY&${index}&${column}`}>RATABLY</Option>
        <Option value={`FA&${index}&${column}`}>FA</Option>
      </Select>
      /*{<Select disabled={this.state.editFlag} onChange={this.handleSelectChange} placeholder="请选择拆分状态" value={text ? `${text}&${index}&${column}` : `POC&${index}&${column}`}>
        <Option value={`POC&${index}&${column}`}>POC</Option>
        <Option value={`RATABLY&${index}&${column}`}>RATABLY</Option>
        <Option }value={`FA&${index}&${column}`}>FA</Option>
      </Select>*/
    )
  }
  handleAdd = (index, flag) => {
    const newDataSource = this.state.dataSource
    const listPrice = _.cloneDeep(this.props.data.contractAmount);
    const newData = {
      parentOrderListLineId: '',
      opsStatus:'add',
      subRow: false,
      discount: 0,
      returnTaxRate: 0,
      revenueCheckout: "",
      listPrice:listPrice,

    }
    const subParentOrderListLineId = newDataSource.length && newDataSource[index].orderListLineId ? newDataSource[index].orderListLineId : ''
    const newSubData = {
      taskOpration: 'addSub',
      parentKey: index,
      parentOrderListLineId: subParentOrderListLineId,
      opsStatus:'add',
      subRow: true,
      discount: 0,
      returnTaxRate: 0,
      revenueCheckout: "",
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
    let selectCountType = this.state.selectCountType
    //selectCountType.push('POC')
    let newselectCountType = [...new Set(selectCountType)]
    this.setState({
      dataSource: newDataSource,
      selectCountType:newselectCountType,
    })
  }
  // 合同拆分删除数据
  handleMinus = (index) => {
    const newData = this.state.dataSource
    const deleteData = this.state.deleteData.slice(0)
    const parentId = newData[index].orderListLineId
    if(parentId){
      const obj = {orderListLineId:parentId,orderListId:newData[index].orderListId,opsStatus:'delete'}
      deleteData.push(obj)
    }
    newData.splice(index,1)
    let newSelectCountType = []
    newData.forEach(item=>{
      if(item.revenueCheckout){
        newSelectCountType.push(item.revenueCheckout)
      }
    })
    let selectDatas = [...new Set([...newSelectCountType])]
    this.setState({
      dataSource: newData,
      selectCountType:selectDatas,
      deleteData:deleteData
    })
  }
  // 拆分保存接口
  handleOk = () => {
    const coutnData = this.state.dataSource.slice(0)
    const contractAmount = parseFloat(this.props.data.contractAmount)
    let totalListPrice = 0
    coutnData.map((item) => {
      if (!item.parentOrderListLineId || item.parentOrderListLineId === '') {
        totalListPrice += !item || !item.listPrice ? 0 : parseFloat(item.listPrice) // 合计目录价
      }
    })
    if(this.props.data.collectionProject ==='Y'){
      if(Math.abs(totalListPrice.toFixed(2)) > Math.abs(contractAmount)) {
        message.error('目录价之和不能大于合同总金额')
        return
      }
    }else{
      if(totalListPrice != contractAmount) {
        // 如果合同目录价之和与合同总金额差一分钱，则在保存时，将差异的一分钱合到最后一条上
        if ((Math.abs(totalListPrice - contractAmount)).toFixed(2) === "0.01") {
          if(totalListPrice >contractAmount){
            coutnData[coutnData.length - 2].listPrice = coutnData[coutnData.length - 2].listPrice - 0.01
          } else if(totalListPrice < contractAmount){
            coutnData[coutnData.length - 2].listPrice = coutnData[coutnData.length - 2].listPrice + 0.01
          }

          if (coutnData[coutnData.length - 2].orderListLineId) {
            coutnData[coutnData.length - 2].opsStatus = 'modify'
          }
          this.inputChange(coutnData, coutnData.length - 2)

          this.setState({
            dataSource: coutnData
          })
        } else {
          message.error('目录价之和与合同总金额不相等')
          return
        }
    }
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
    if (param.revenueCheckout && param.revenueCheckout.length<=0 || typeof param.revenueCheckout ==='undefined') {
      message.error('收入结算方式不能为空！')
      return
    }
    if (param.projectBuNo === '' || typeof param.projectBuNo ==='undefined' || typeof param.projectBuNoName ==='undefined') {
      message.error('立项BU不能为空！')
      return
    }
    const splitListInfo = coutnData.slice(0,-1)
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
      //i.contractCategory.paramValueDesc =
      if (!i.contractCategory || i.contractCategory.length <=0) {
        message.error('合同类型不能为空！')
        return
      }
      /*if (!i.product || i.product.length <= 0) {
        message.error('产品编码不能为空！')
        return
      }*/
      if (i.product==='' && i.product === 'undefined') {
        message.error('产品编码不能为空！')
        return
      }
      if (!i.revenueCheckout || typeof i.revenueCheckout === "undefined") {
        message.error('结算方式不能为空！')
        return
      }
      if (i.listPrice === '' || typeof i.listPrice === "undefined") {
        message.error('目录价不能为空！')
        return
      }
      if(i.listPrice === 0){
        message.error('目录价不能为 0！')
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
      let product = i.product
      let returnTaxRate = ''
      let contractTaxRate = ''

      if(typeof i.contractCategory ==='string'){
        contractCategory = i.contractCategory
      }else if (i.contractCategory && i.contractCategory.length > 0) {
        contractCategory = i.contractCategory[0]
        i.taskDesc = i.contractCategory[1]
      }
      if(typeof i.product ==='string' || typeof i.product ==='number'){
        product = i.product
      }
      if(Array.isArray(i.product)){
        product = i.product[0]
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
    const deleteData = this.state.deleteData

    newLisfInfo.push(...deleteData)
    // 拼接保存参数
    const postParams = {}
    postParams.splitListInfo = newLisfInfo
    postParams.contractInfo = this.props.data
    if(!postParams.contractInfo.splitedByName){
      postParams.contractInfo.splitedByName = this.props.user
    }
    postParams.contractInfo.recalculate = param.recalculate
    postParams.contractInfo.projectBuNo = param.projectBuNo
    postParams.contractInfo.assessRatio = this.state.assessRatio
    postParams.contractInfo.relatedBuNo = param.relatedBuNo
    postParams.contractInfo.relatedBuNoName = param.relatedBuNoName
    postParams.contractInfo.projectBuNoName = param.projectBuNoName
    postParams.contractInfo.revenueCheckout = revenueCheckout
    postParams.contractInfo.maintainBeginDate = param.maintainBeginDate
    postParams.contractInfo.splitedRemark = this.state.rcontent
    postParams.contractInfo.task1Cost = param.task1Cost
    postParams.contractInfo.task3tCost = param.task3tCost
    postParams.contractInfo.task4tCost = param.task4tCost
    postParams.contractInfo.task5Cost = param.task5Cost
    postParams.contractInfo.task9Cost = param.task9Cost
    postParams.contractInfo.intercompanyCost = param.intercompanyCost
    postParams.contractInfo.subcontractFee = param.subcontractFee

    this.setState({
      saveFlag:true
    })
    console.log('postParams.splitListInfo',postParams.splitListInfo)
    let saveParams = _.cloneDeep(postParams)
    this.props.saveInfo(saveParams).then((res) => {
      this.setState({
        saveFlag:false,
        editFlag:true,
        deleteData:[],
      })
      if (res && res.response && res.response.resultCode === '000000') {
        message.success('保存成功')
        const data = res.response.result[0]
        const dataSource = _.cloneDeep(data.orderListLines).concat({
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
        this.setState({
          dataSource:dataSource
        })
      } else {
        message.error('保存失败')
      }
    })
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
    const countValueData = this.state.countTaskCostData;
    const {collectionProject,contractAmount} = this.props.data;
    const dataSource = this.state.dataSource;
    if(flag === 'task1Cost' && collectionProject==='Y'){
      dataSource.map(item=>{
        if(item.taskOpration != '合计') {
          item.listPrice = parseFloat(contractAmount-v)
        }
      })
    }
    countValueData[flag] = v
    this.setState({
      countTaskCostData:countValueData,
      dataSource:dataSource,
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
      const constractData = this.props.data
      this.props.form.setFieldsValue({
        relatedBuNo: [constractData.relatedBuNo,constractData.relatedBuNoName],
        maintainBeginDate: constractData.maintainBeginDate,
        revenueCheckout: constractData['revenueCheckout'],
        projectBuNo: [constractData.projectBuNo,constractData.projectBuNoName],
        task1Cost: constractData.task1Cost ? constractData.task1Cost : 0 ,
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
  changeAssessRation = (value) =>{
    this.setState({
      assessRatio:value
    })
  }
  blur = () => {
    const NewData = []
    const splitData = this.state.dataSource.slice(0)
    const dataInfos = this.props.data
    const contractTotalMoney = dataInfos.contractAmount ? parseFloat(dataInfos.contractAmount) : 0 //  合同总金额
    const solutionMaintain = dataInfos.solutionMaintain ? dataInfos.solutionMaintain : 0 // 软件解决方案保修期
    //let assessRatio = dataInfos.assessRatio ? parseFloat(dataInfos.assessRatio) : 0 // 考核比率
    let assessRatio = this.state.assessRatio ? parseFloat(this.state.assessRatio) : 0 // 考核比率
    const incomeRatio =  parseFloat(parseFloat(solutionMaintain)/12 * 0.05)  // 收入比率
    if(isNaN(assessRatio)){
      assessRatio = 0
    }
    assessRatio = assessRatio/100 // 考核比率为百分数

    for(let i = 0 ; i < splitData.length; i++) {
      let formula = 1
      let formula2 = 1
      if (splitData[i].contractCategory === '7') {
        formula = (1 + incomeRatio)
        formula2 = (1 - assessRatio)
        splitData[i].listPrice = (parseFloat((contractTotalMoney / formula) * formula2)).toFixed(2)
      }
      if (splitData[i].contractCategory === '7-K') {
        formula = (1 + incomeRatio)
        formula2 = assessRatio
        splitData[i].listPrice = (parseFloat((contractTotalMoney / formula) * formula2)).toFixed(2)
      }
      if (splitData[i].contractCategory === '10S') {
        formula = (1 + incomeRatio)
        formula2 = incomeRatio * (1 - assessRatio)
        splitData[i].listPrice = (parseFloat((contractTotalMoney / formula) * formula2)).toFixed(2)
      }
      if (splitData[i].contractCategory === '10S-K') {
        formula = (1 + incomeRatio)
        formula2 = incomeRatio * assessRatio
        splitData[i].listPrice = (parseFloat((contractTotalMoney / formula) * formula2)).toFixed(2)
      }
      this.inputChange(splitData,i)
  }
  this.setState({
    dataSource:splitData
  })
}
  closeUrlModal = () => {
    this.setState({
      openUrlModal:false
    })
  }
  render() {

    const dataSource = _.cloneDeep(this.state.dataSource.slice(0))
    const constractData = this.props.data
    /*console.log('data.revenueCheckout',constractData.revenueCheckout)
    console.log('this.state.selectCountType',this.state.selectCountType)*/
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
    const coutnData = dataSource
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
      width: 75,
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
                {/*<Button disabled={this.state.editFlag} onClick={() => this.handleAdd(index, '0')}>＋</Button>&nbsp;&nbsp;*/}
                <Button disabled={this.state.editFlag} onClick={() => this.handleMinus(index)}>－</Button>
              </div>
          )
      ),
    }, {
      title: <span>合同类型<em style={{ color: '#FF0000' }}>*</em></span>,
      /*dataIndex: 'contractCategory', taskDesc*/
      dataIndex: 'taskDesc',
      width: 200,
      render: (text, record, index) => record.taskOpration === '合计' ? '' : this.renderColumns(text, index, 'contractCategory',record),
    }, {
      title: <span>产品编码<em style={{ color: '#FF0000' }}>*</em></span>,
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
      title: '合同不含税金额',
      dataIndex: 'contractAmountTaxExclude',
      width: 120,
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
          wrapClassName="modal"
          width={1200}
          maskClosable={false}
          title="合同拆分"
          visible={true}
          onCancel={this.closeModal}
          footer={[
            <Button onClick={this.handleEdit} style={{display:this.state.editFlag ? 'inline-block' : 'none'}} disabled={!this.props.isShowEditBtn}>
              编辑
            </Button>,
            <Button  key="submit" onClick={this.handleOk} disabled={this.state.saveFlag} style={{display:this.state.editFlag ? 'none' : 'inline-block'}}>
              保存
            </Button>,
            <Button  onClick={this.handleReturn} style={{display:this.state.editFlag ? 'none' : 'none'}}>
              还原
            </Button>,
            <Button  key="back" onClick={this.closeModal}>
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
                  {/*<button className="scan-document" type="primary" onClick={()=>this.goDetail(this.props.contractUrl[0] ? this.props.contractUrl[0].url : '')}>合同审批表及合同扫描件</button>*/}
                  <Button
                    className="scan-document"
                    type="primary"
                    ghost
                    onClick={() => {
                      if(this.props.contractUrl.length>0){
                        this.setState({
                          openUrlModal:true
                        })
                      } else {
                        message.warn('暂无合同审批表及合同扫描件')
                        return
                      }
                    }}
                  >合同审批表及合同扫描件</Button>
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
                  A-软件产品：
                </Col>
                <Col span={5} className="contractRowBorderLeft contractRowBorderRight">
                  <div className="contractRowBorderNo" style={{ textAlign: 'left', paddingLeft: '2px' }}>
                    {constractData.aSoftproduct ? currency(constractData.aSoftproduct) : 0}
                  </div>
                </Col>
              </Row>
              <Row className="text-css contractRowBorderLeft contractRowBorderTop">
                <Col span={4} className="contract-bg">
                  B-软件开发：
                </Col>
                <Col span={5} className="contractRowBorderLeft">
                  <div className="contractRowBorderNo" style={{ textAlign: 'left', paddingLeft: '2px' }}>
                    {constractData.bDevelopment ? currency(constractData.bDevelopment) : 0}
                  </div>
                </Col>
                <Col span={3} className="contractRowBorderLeft contract-bg">
                  C-运营：
                </Col>
                <Col span={4} className="contractRowBorderLeft">
                  <div className="contractRowBorderNo" style={{ textAlign: 'left', paddingLeft: '2px' }}>
                    {constractData.cOperation ? currency(constractData.cOperation) : 0}
                  </div>
                </Col>
                <Col span={3} className="contractRowBorderLeft contract-bg">
                  D-第三方：
                </Col>
                <Col span={5} className="contractRowBorderLeft contractRowBorderRight">
                  <div className="contractRowBorderNo" style={{ textAlign: 'left', paddingLeft: '2px' }}>
                    {constractData.dThird ? currency(constractData.dThird) : 0}
                  </div>
                </Col>
              </Row>
              <Row className="text-css contractRowBorderLeft  contractRowBorderTop">
                <Col span={4} className="contract-bg">
                  E-集成及其它服务：
                </Col>
                <Col span={5} className="contractRowBorderLeft">
                  <div className="contractRowBorderNo" style={{ textAlign: 'left', paddingLeft: '2px' }}>
                    {constractData.eIntegration ? currency(constractData.eIntegration) : 0}
                  </div>

                </Col>
                <Col span={3} className="contractRowBorderLeft  contract-bg">
                  F-培训：
                </Col>
                <Col span={4} className="contractRowBorderLeft">
                  <div className="contractRowBorderNo" style={{ textAlign: 'left', paddingLeft: '2px' }}>
                    {constractData.fTraining ? currency(constractData.fTraining) : 0}
                  </div>
                </Col>
                <Col span={3} className="contractRowBorderLeft contract-bg">
                  G-咨询：
                </Col>
                <Col span={5} style={{ textAlign: 'left', paddingLeft: '2px' }} className="contractRowBorderLeft contractRowBorderRight constractInput">
                  {constractData.gConsult ? currency(constractData.gConsult) : 0}
                </Col>
              </Row>
              <Row className="text-css contractRowBorderLeft contractRowBorderTop">
                <Col span={4} className="contract-bg">
                  H-运维：
                </Col>
                <Col span={5} className="contractRowBorderLeft">
                  <div className="contractRowBorderNo" style={{ textAlign: 'left', paddingLeft: '2px' }}>
                    {constractData.hMaintain ? currency(constractData.hMaintain) : 0}
                  </div>
                </Col>
                <Col span={3} className="contractRowBorderLeft contract-bg">
                  软件解决方案保修期：
                </Col>
                <Col span={4} className="contractRowBorderLeft">
                  <div className="contractRowBorderNo" style={{ textAlign: 'left', paddingLeft: '2px' }}>
                    {constractData.solutionMaintain}
                  </div>
                </Col>
                <Col span={3} className="contractRowBorderLeft contract-bg">
                  维护服务开始时间：
                </Col>
                <Col span={5} className="contractRowBorderLeft contractRowBorderRight">
                  {constractData.maintainStartDate}
                </Col>
              </Row>
              <Row className="text-css contractRowBorderLeft contractRowBorderTop">
                <Col span={4} className="contract-bg">
                  维护服务结束时间：
                </Col>
                <Col span={5} className="contractRowBorderLeft">
                  <div className="contractRowBorderNo" style={{ textAlign: 'left', paddingLeft: '2px' }}>
                    {constractData.maintainEndDate}
                  </div>
                </Col>
                <Col span={3} className="contractRowBorderLeft contract-bg">
                  保修期开始时间<em style={{ color: '#FF0000' }}>*</em>：
                </Col>
                <Col span={4} className="contractRowBorderLeft">
                  <div className="contractRowBorderNo" style={{ textAlign: 'left', paddingLeft: '2px' }}>
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
                  </div>
                </Col>
                <Col span={3} className="contractRowBorderLeft contract-bg">
                  合同拆分操作人：
                </Col>
                <Col span={5} className="contractRowBorderLeft contractRowBorderRight" style={{textAlign:'left'}}>
                  {constractData.splitedByName ? (this.state.editFlag ? constractData.splitedByName : this.props.user) : <div style={{display: this.state.editFlag ? 'none' : 'inline-block'}}>{this.props.user}</div>  }
                </Col>
              </Row>


              <Row className="text-css contractRowBorderLeft  contractRowBorderTop">
                <Col span={4} className="contract-bg">
                  关联BU：
                </Col>
                <Col span={5} className="contractRowBorderLeft">
                  <div className="contractRowBorderNo" style={{ textAlign: 'left', paddingLeft: '2px' }}>
                    <FormItem>
                      {
                        getFieldDecorator('relatedBuNo',{initialValue:[constractData.relatedBuNo,constractData.relatedBuNoName]},)(<SelectSbu keyName='contract' disabled={this.state.editFlag} />)
                      }
                    </FormItem>
                  </div>
                </Col>
                <Col span={3} className="contractRowBorderLeft  contract-bg">
                  C-FORM版本GM%：
                </Col>
                <Col span={4} className="contractRowBorderLeft">
                  {constractData.cFormGm}
                </Col>
                <Col span={3} className="contractRowBorderLeft contract-bg">
                  收入结算方式<em style={{ color: '#FF0000' }}>*</em>：
                </Col>
                <Col span={5} className="contractRowBorderLeft contractRowBorderRight constractInput">
                  <div className="contractRowBorderNo" style={{ textAlign: 'left', paddingLeft: '2px' }}>
                    <FormItem>
                      {getFieldDecorator('revenueCheckout', {
                        /*initialValue: constractData['revenueCheckout'] ? constractData['revenueCheckout']: this.state.selectCountType,*/
                       initialValue: this.state.selectCountType,
                      })(
                        <Checkbox.Group disabled={this.state.editFlag}>
                          <Checkbox value="POC">POC</Checkbox>
                          <Checkbox value="RATABLY">RATABLY</Checkbox>
                          <Checkbox value="FA">FA</Checkbox>
                        </Checkbox.Group>
                      )}
                    </FormItem>
                  </div>
                </Col>
              </Row>
              <Row className="text-css contractRowBorder contractRowBorderTop">
                <Col span={4} className="contract-bg">
                  考核比率：
                </Col>
                <Col span={5} className="contractRowBorderLeft">
                  <div className="contractRowBorderNo" style={{ textAlign: 'left', paddingLeft: '2px' }}>
                    <FormItem>
                      {getFieldDecorator('assessRatio', {
                        initialValue: constractData.assessRatio,
                      })(
                        <InputNumber
                          disabled={this.state.editFlag}
                          style={{width:'100%'}}
                          defaultValue={constractData.status==='Y'? this.state.assessRatio : ''}
                          onChange={this.changeAssessRation}
                          formatter={value => `${value}%`}
                          parser={value => value.replace('%', '')}
                          onBlur={this.blur}/>
                      )}
                    </FormItem>
                  </div>
                </Col>
                {/*<Col span={3} className="contractRowBorderLeft  contract-bg">
                  考核比率：
                </Col>
                <Col span={4} className="contractRowBorderLeft contractRowBorderRight">
                  <FormItem>
                    {getFieldDecorator('assessRatio', {
                      initialValue: constractData.assessRatio,
                    })(
                      <InputNumber
                        disabled={this.state.editFlag}
                        style={{width:'100%'}}
                        defaultValue={constractData.status==='Y'? this.state.assessRatio : ''}
                        onChange={this.changeAssessRation}
                        formatter={value => `${value}%`}
                        parser={value => value.replace('%', '')}
                        onBlur={this.blur}/>
                    )}
                  </FormItem>
                </Col>*/}
                {/*<Col span={4} className="contractRowBorderLeft">
                  <InputNumber
                    disabled={this.state.editFlag}
                    style={{width:'100%'}}
                    max="100"
                    min="0"
                    precision="2"
                    defaultValue={constractData.status==='Y'? this.state.assessRatio : ''}
                    onChange={this.changeAssessRation}
                    formatter={value => `${value}%`}
                    parser={value => value.replace('%', '')}
                    onBlur={this.blur}/>
                </Col>*/}
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
                    {constractData.projectDepNoName}
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
                <Col span={3} className="contract-bg ">
                  是否集采项目：
                </Col>
                <Col span={1} className="contractRowBorderLeft">
                  <div className="contractRowBorderNo" style={{ textAlign: 'left', paddingLeft: '2px' }}>
                    {constractData.collectionProject === 'Y'  ? '是' : '否'}
                  </div>
                </Col>
                <Col span={3} className="contractRowBorderLeft contract-bg ">
                  是否复算项目：
                </Col>
                <Col span={2} className="contractRowBorderLeft">
                  <div className="contractRowBorderNo">
                    {/*{constractData.collectionProject === 'Y'  ? '是' : '否'}*/}
                    <FormItem>
                      {
                        getFieldDecorator('recalculate',{initialValue:constractData.recalculate ? constractData.recalculate : 'N'},)(
                          <Select style={{border:'none'}} disabled={this.state.editFlag}>
                            <Option value="Y">是</Option>
                            <Option value="N">否</Option>
                          </Select>
                        )
                      }
                    </FormItem>

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
                dataSource = {this.state.dataSource}
                pagination={false}
              />
              <h2>外购成本预算</h2>
              <br />
              <Row className="text-css contractRowBorderLeft  contractRowBorderTop">
                <Col span={6} className="contract-bg">
                  Task 1 cost(含税成本):
                </Col>
                <Col span={18} className="contractRowBorderLeft contractRowBorderRight">
                  <FormItem>
                    {
                      getFieldDecorator('task1Cost',{initialValue:constractData.task1Cost ? constractData.task1Cost : 0},)(<InputNumber style={{width:'100%'}} formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} parser={value => value.replace(/\$\s?|(,*)/g, '')} className="contractRowBorderNo" onChange={(v)=>this.handleTaskCostChange(v,'task1Cost')} disabled={this.state.editFlag} />)
                    }
                  </FormItem>

                </Col>
              </Row>
              {/*<Row className="text-css contractRowBorderLeft  contractRowBorderTop">
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
              </Row>*/}
              <Row className="text-css contractRowBorderLeft  contractRowBorderTop">
                <Col span={6} className="contract-bg">
                  Task 5 cost(外购硬件设备不含税成本):
                </Col>
                <Col span={4} className="contractRowBorderLeft">
                  <FormItem>
                    {
                      getFieldDecorator('task5Cost',{initialValue:constractData.task5Cost ? constractData.task5Cost : 0},)(<InputNumber style={{width:'100%'}} formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} parser={value => value.replace(/\$\s?|(,*)/g, '')} className="contractRowBorderNo" onChange={(v)=>this.handleTaskCostChange(v,'task5Cost')} disabled={this.state.editFlag} />)
                    }
                  </FormItem>
                </Col>
                <Col span={6} className="contractRowBorderLeft contract-bg">
                  Task 9 cost(外购支持服务不含税成本):
                </Col>
                <Col span={8} className="contractRowBorderLeft contractRowBorderRight">
                  <FormItem>
                    {
                      getFieldDecorator('task9Cost',{initialValue:constractData.task9Cost ? constractData.task9Cost : 0},)(<InputNumber style={{width:'100%'}} formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} parser={value => value.replace(/\$\s?|(,*)/g, '')} className="contractRowBorderNo" onChange={(v)=>this.handleTaskCostChange(v,'task9Cost')} disabled={this.state.editFlag} />)
                    }
                  </FormItem>
                </Col>
              </Row>
              {/*<Row className="text-css contractRowBorderLeft  contractRowBorderTop">
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
              </Row>*/}
              {/*<Row className="text-css contractRowBorderLeft  contractRowBorderTop">
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
              </Row>*/}
              <Row className="text-css contractRowBorder">
                <Col span={6} className="contract-bg">
                  合计：
                </Col>
                <Col span={18} className="contractRowBorderLeft">
                  <Input className="contractRowBorderNo" value={currency(countTaskCost)} />
                </Col>
              </Row>
              <br />
              <br />
              <h2>拆分备注</h2>
              <br />
              <TextArea disabled={this.state.editFlag} rows={4} defaultValue={constractData.splitedRemark}  value={this.state.rcontent} onChange={this.onTextAreaChange} placeholder="根据实际情况录入，且不超过150字符" />
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
                  <Input className="contractRowBorderNo" value={currency((countGrossOrder - this.state.countTaskCostData["task5Cost"]).toFixed(2) )} disabled />
                </Col>
                <Col span={4} className="contractRowBorderLeft">
                  Net Order（Management)：
                </Col>
                <Col span={4} className="contractRowBorderLeft">
                  <Input name="" className="contractRowBorderNo" value={currency((countGrossOrder - (this.state.countTaskCostData["task5Cost"] + this.state.countTaskCostData["task9Cost"])).toFixed(2) )} disabled />
                </Col>
              </Row>
              <br />
              <br />
            </Form>
          </div>
        </Modal>
        {this.state.openUrlModal ?
          <GetUrlModal
            closeModal={this.closeUrlModal}
            contractUrl={this.props.contractUrl}
          />
          : null
        }

      </div>
    )
  }
}
const ContractSplitModalWithForm = Form.create()(ContractSplitModal)

export default ContractSplitModalWithForm
