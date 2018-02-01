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

const EditableCell = ({ value, onChange, column,disable}) => (
  <div style={{ position: 'relative' }}>
    <InputNumber defaultValue={value} onChange={value => onChange(value)} disabled={disable} />
    {column === 'discount' ?
      <span style={{ position: 'absolute', right: '10px', top: '20%' }}>%</span>
      : ''
    }
  </div>
)
class ContractSplitModal extends React.Component{
  constructor(props) {
    super(props)
    this.state = {
      dataSource: [
        ...props.tableDetail,
        {
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
        }
      ],
      countCatalPrice: 0.00,
      rcontent: '',
      rcontentnum: 0,
      countTaskCost: 0.00,
      countTaskCostData: {},
      editFlag: true,
    }
  }
  /*componentWillReceiveProps(nextProps) {
    if (this.props.data !== nextProps.data) {
      const constractData = nextProps.data
      console.log('constractData',constractData)
     this.setState({
       dataSource: tableData,
     })
     }
  }*/
  selectDateChange = (data) => {
    const newData = [...this.state.dataSource]
    newData[data.indexs][data.columns] = data.dateString
    this.setState({
      dataSource: newData,
    })
  }
  handleChange = (data) => {
    const newData = [...this.state.dataSource]
    if(newData.collectionProject && data.columns==='contractCategory'){
      if(data.No !=="ARC_PRD_1"){
        message.error('集采项目只能拆分Task1')
        return
      }
    }
    if(data){
      const indexData = data.No && data.Name ? [data.No,data.Name] : ''
      if(data.columns){
        newData[data.indexs][data.columns] = indexData
      }
      this.inputChange(newData,[data.indexs])
      this.setState({
        dataSource: newData,
      })
    }
  }
  canCel = (index,column) => {
    const newData = [...this.state.dataSource]
    newData[index][column] = ''
    this.setState({
      dataSource: newData,
    })
  }
  handleSelectChange = (data) => {
    let selectData = []
    selectData = data.key.split('&')
    const newData = [...this.state.dataSource]
    newData[selectData[1]][selectData[2]] = selectData[0]
    this.setState({
      dataSource: newData,
    })
  }
  test = (data) => {
    console.log('test',data)
  }
  renderColumns = (text, index, column,record) => {
    console.log('record',record,column)
    if(column=="product"){
      return <ProductLine onCancel={()=>this.canCel(index,column)} text={text ? text : ''} onChange={this.handleChange} valueName={record['productName'] ? record['productName'] : ''} value={record[column]}  indexs={index} columns={column} />
    }
    if(column ==='contractCategory'){
      return(
        <ContractType
          typeCode="BILLED_SPLIT"
          paramCode="STATUS"
          hasEmpty
          onChange={this.handleChange}
          value={record[column]}
          text={text ? text : ''}
          indexs={index}
          columns={column}
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
          text={text ? text : ''}
          indexs={index}
          columns={column}
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
    const newData = [...this.state.dataSource]
    const contractAmount = parseFloat(this.props.data[0].contractAmount)
    if(column==='listPrice'){
      if(typeof value !== "number"){
        message.error('请输入数字类型的数')
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
    this.inputChange(newData,index)
    this.setState({
      dataSource: newData,
    })
  }
  inputChange = (newData,index) => {
    const contractTaxRate = newData[index].contractTaxRate && newData[index].contractTaxRate[1] ? percent(newData[index].contractTaxRate[1]) : '0'
    const returnTaxRate = newData[index].returnTaxRate && newData[index].returnTaxRate[1] ? percent(newData[index].returnTaxRate[1]) : '0'
    const discount = newData[index].discount  ? newData[index].discount : "0"
    const listPrice = newData[index].listPrice ? newData[index].listPrice : "0"
    console.log('listPrice',listPrice)
    newData[index].discountedPrice = (parseFloat(listPrice) * (1 - parseFloat(discount) * 0.01)).toFixed(2) // 折后合同额根据目录价和折扣计算出来
    newData[index].contractAmountTaxInclude = (parseFloat(listPrice) * (1 - parseFloat(discount) * 0.01)).toFixed(2) // 合同含税额：等于折后合同额
    newData[index].contractAmountTaxExclude = (parseFloat(newData[index].contractAmountTaxInclude) / (1 + parseFloat(contractTaxRate))).toFixed(2) // 合同不含税额 根据合同含税额和合同税率计算出合同不含税额
    newData[index].returnTaxRevenue = (parseFloat(newData[index].contractAmountTaxInclude) / (1 + parseFloat(contractTaxRate)) * (parseFloat(returnTaxRate))).toFixed(2) // 退税收入含税额：等于合同含税额/(1+合同税率)*(退税率)
    newData[index].grossOrder = (parseFloat(newData[index].contractAmountTaxExclude) + parseFloat(newData[index].returnTaxRevenue)).toFixed(2) // Gross Order：等于合同含税额/(1+合同税率)
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
      <Select labelInValue onChange={this.handleSelectChange} placeholder="请选择拆分状态" defaultValue={{ key: text ? `${text}&${index}&${column}` : `POC&${index}&${column}` }}>
        <Option value={`POC&${index}&${column}`}>POC</Option>
        <Option value={`RATABLY&${index}&${column}`}>RATABLY</Option>
        <Option value={`FA&${index}&${column}`}>FA</Option>
      </Select>
    )
  }
  handleAdd = (index, flag) => {
    const newDataSource = this.state.dataSource.slice(0)
    console.log('addnewDataSource',newDataSource)
    const newData = {
      parentOrderListLineId: '',
      orderListLineId: '110'+new Date().getTime(),
      subRow: false,
    }
    const subParentOrderListLineId = this.state.dataSource.length && this.state.dataSource[index].orderListLineId ? this.state.dataSource[index].orderListLineId : ''
    const newSubData = {
      taskOpration: 'addSub',
      parentKey: index,
      parentOrderListLineId: subParentOrderListLineId,
      orderListLineId: '110'+new Date().getTime(),
      subRow: true,
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
    console.log('indexArray',indexArray)
    console.log('max',max)
    // flag == 0 为增加子行
    if (flag === '0') {
      if(max){
        newDataSource.splice(parseInt(max) + 1, 0, newSubData)
      }else{
        newDataSource.splice(parseInt(index) + 1, 0, newSubData)
      }
      console.info('add sub', newDataSource)
    }

    if (flag === '1') {
      newDataSource.splice(-1, 0, newData)
      console.info('add main',newDataSource)
    }

    console.log('___________________________',newDataSource)

    // return
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
    const coutnData = this.state.dataSource
    const contractAmount = parseFloat(this.props.data[0].contractAmount)
    let totalListPrice = 0
    coutnData.map((item) => {
      if (item.taskOpration !== 'addSub') {
        totalListPrice += !item || !item.listPrice ? 0 : parseFloat(item.listPrice) // 合计目录价
      }
    })
    console.log('totalListPrice',totalListPrice)
    console.log('contractAmount',contractAmount)
    if(Math.abs(totalListPrice) > Math.abs(contractAmount)) {
      message.error('目录价之和不能大于合同总金额')
      return
    }

    const param = this.props.form.getFieldsValue()
    console.log('param',param)
    const relatedBuNoName = param && param.relatedBuNo ? param.relatedBuNo[1] : ''
    const projectBuNoName = param && param.projectBuNo ? param.projectBuNo[1] : ''

    param.projectBuNo = param && param.projectBuNo ? param.projectBuNo[0] : ''
    param.relatedBuNo = param && param.relatedBuNo ? param.relatedBuNo[0] : ''
    param.relatedBuNoName = relatedBuNoName
    param.projectBuNoName = projectBuNoName
    if (param.projectBuNo === '') {
      message.error('立项BU不能为空！')
      return
    }
    if (param.relatedBuNo === '') {
      message.error('关联BU不能为空！')
      return
    }
    const splitListInfo = this.state.dataSource.slice(0,-1)
    console.log('dele',splitListInfo.slice(0))
    //return
    //splitListInfo.pop()
    let length = splitListInfo.length
    for(let i = 0; i< length; i++){
      let parentPrice = splitListInfo[i].listPrice
      let parentId = splitListInfo[i].orderListLineId
      let subPrice = 0
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

    /*if (splitListInfo) {
      message.error('请对数据进行拆分！')
      return
    }*/
    const newLisfInfo = []
    let j = 1
    for(let i of splitListInfo) {
      console.log('i',i)
      let contractCategory = ''
      let product = ''
      let returnTaxRate = ''
      let contractTaxRate = ''
      if(typeof i.contractCategory ==='string'){
        contractCategory = i.contractCategory
      }else if (i.contractCategory.length > 0) {
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
      }else if (i.contractTaxRate.length > 0) {
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


    console.log('newLisfInfo',newLisfInfo)
    let msg = ''
    const postParams = {}
    /*splitListInfo.map((item,index)=>{
      item.product = item.product && item.product[1] ? item.product[1]:(item.product ? item.product : '')
      item.returnTaxRate = item.returnTaxRate && item.returnTaxRate[0] ? item.returnTaxRate[0] : ''
      item.contractTaxRate = item.contractTaxRate && item.contractTaxRate[0] ? item.contractTaxRate[0] : ''
      item.contractCategory = item.contractCategory && item.contractCategory[0] ? item.contractCategory[0] : (item.contractCategory ? item.contractCategory : '')
      console.log('item',item)
      if (item.product === '') {
        msg +="产品线不能为空 "
        message.error('产品线不能为空！')
        return
      }
      if (item.contractCategory === '') {
        msg +="合同类型不能为空 "
        message.error('合同类型不能为空！')
        return
      }
      if (item.revenueCheckout === '') {
        msg +="结算方式不能为空 "
        message.error('结算方式不能为空！')
        return
      }
      if (item.listPrice === '') {
        msg +="目录价不能为空 "
        message.error('目录价不能为空！')
        return
      }
      if (item.discount === '') {
        msg +="折扣不能为空 "
        message.error('折扣不能为空！')
        return
      }
      /!*if (item.returnTaxRate === '') {
        msg +="退税率不能为空 "
        message.error('退税率不能为空！')
        return
      }*!/
    })*/

    /*if(!!msg){
      return
    }*/
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
    postParams.splitListInfo = newLisfInfo
    if(this.props.data[0].orderListLines){
      delete this.props.data[0].orderListLines
    }
    postParams.contractInfo = this.props.data[0]
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
    if (param.maintainBeginDate === '') {
      message.error('保修开始时间不能为空！')
      return
    }
    if (revenueCheckout === '') {
      message.error('收入结算方式不能为空！')
      return
    }
    console.log('postParams',postParams)
    this.props.saveInfo(postParams)
    this.closeModal()
  }
  closeModal = () => {
    this.setState({
      dataSource: [],
    },()=>{
      this.props.closeModal()
    })
  }

  handleTaskCostChange = (e,flag) =>{
    const currentValue = e.target.value
    const countValueData = this.state.countTaskCostData
    countValueData[flag] = currentValue
    this.setState({
      countTaskCostData:countValueData,
    })
  }
  handleEdit = () => {
    const editFlag = this.state.editFlag
    this.setState({
      editFlag: !editFlag,
    })
  }
  render() {
    const dataSource = this.state.dataSource
    console.log('render',dataSource)
    const constractDatas = this.props.data
    const constractData = constractDatas[0]
    console.log('tableData',dataSource)
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
    const coutnData = [...this.state.dataSource]
    coutnData.map((item) => {
      if (item.taskOpration !== 'addSub') {
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
                <Button onClick={() => this.handleMinus(index)}>－</Button>
              </div>
              :
              <div>
                <Button onClick={() => this.handleAdd(index, '0')}>＋</Button>&nbsp;&nbsp;
                <Button onClick={() => this.handleMinus(index)}>－</Button>
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
      width: 150,
      render: (text, record, index) => record.taskOpration === '合计' ? '' : this.renderColumns(text, index, 'product',record),
    }, {
      title: <span>结算方式<em style={{ color: '#FF0000' }}>*</em></span>,
      dataIndex: 'revenueCheckout',
      width: 100,
      render: (text, record, index) => record.taskOpration === '合计' ? '' : this.renderSelect(text, index, 'revenueCheckout'),
    }, {
      title: <span>目录价<em style={{ color: '#FF0000' }}>*</em></span>,
      dataIndex: 'listPrice',
      width: 150,
      render: (text, record, index) => record.taskOpration === '合计' ? currency(countCatalPrice) : this.renderInputColumns(text, index, 'listPrice'),
    }, {
      title: <span>折扣<em style={{ color: '#FF0000' }}>*</em></span>,
      dataIndex: 'discount',
      width: 150,
      render: (text, record, index) => record.taskOpration === '合计' ? '' : this.renderInputColumns(text, index, 'discount'),
    }, {
      title: '折后目录价',
      dataIndex: 'discountedPrice',
      width: 150,
      render: (text, record, index) => record.taskOpration === '合计' ? currency(discountCatalPrice) : text,
    }, {
      title: '合同含税额',
      dataIndex: 'contractAmountTaxInclude',
      width: 100,
      render: (text, record, index) => record.taskOpration === '合计' ? currency(discountCatalPrice) : text,
    }, {
      title: '合同税率',
      dataIndex: 'contractTaxRate',
      width: 150,
      render: (text, record, index) => record.taskOpration === '合计' ? '' : this.renderColumns(text, index, 'contractTaxRate',record),
    }, {
      title: '合同不含税额',
      dataIndex: 'contractAmountTaxExclude',
      width: 150,
      render: (text, record, index) => record.taskOpration === '合计' ? currency(countsalePeo) : text,
    }, {
      title: <span>退税率<em style={{ color: '#FF0000' }}>*</em></span>,
      dataIndex: 'returnTaxRate',
      width: 150,
      render: (text, record, index) => record.taskOpration === '合计' ? '' : this.renderColumns(text, index, 'returnTaxRate',record),
    }, {
      title: '退税额',
      dataIndex: 'returnTaxRevenue',
      width: 200,
      render: (text, record, index) => record.taskOpration === '合计' ? currency(countcontractType1) : text,
    }, {
      title: 'Gross Order',
      dataIndex: 'grossOrder',
      width: 100,
      render: (text, record, index) => record.taskOpration === '合计' ? currency(countGrossOrder) : text,
    }, {
      title: <span>服务期起始</span>,
      dataIndex: 'serviceStartDate',
      width: 200,
      render: (text, record, index) => {
        return (
          record.taskOpration === '合计' ? '' :
          <MyDtatePicker value={this.state.dataSource[index]['serviceStartDate']} onChange={this.selectDateChange} indexs={index} columns='serviceStartDate'  />
        )
      }
    }, {
      title: <span>服务期结束</span>,
      dataIndex: 'serviceEndDate',
      width: 200,
      render: (text, record, index) => {
        return (
          record.taskOpration === '合计' ? '' :
          <MyDtatePicker value={this.state.dataSource[index]['serviceEndDate']} onChange={this.selectDateChange} indexs={index} columns='serviceEndDate' />
        )
      }
    },
    ]
    return (
      <div>
        <Modal
          width={1024}
          title="合同拆分"
          visible={true}
          onCancel={this.closeModal}
          footer={[
            <Button onClick={this.handleEdit}>
              编辑
            </Button>,
            <Button key="submit" onClick={this.handleOk}>
              保存
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
                  <button>合同审批表及合同扫描件</button>
                </Col>
              </Row>
              <br />
              <Row className="contractRowBorder text-css">
                <Col span={4} className="contract-bg">
                  合同名称：
                </Col>
                <Col span={20} className="contractRowBorderLeft">
                  <div className="contractRowBorderNo" style={{ textAlign: 'left', paddingLeft: '2px' }}>
                    {constractData.contractName}
                  </div>
                </Col>
              </Row>
              <Row className="text-css contractRowBorderLeft contractRowBorderRight contractRowBorderBottom">
                <Col span={4} className="contract-bg">
                  合同编码：
                </Col>
                <Col span={5} className="contractRowBorderLeft">
                  <div className="contractRowBorderNo" style={{ textAlign: 'left', paddingLeft: '2px' }}>
                    {constractData.contractNo}
                  </div>
                </Col>
                <Col span={3} className="contractRowBorderLeft contract-bg">
                  签约公司：
                </Col>
                <Col span={4} className="contractRowBorderLeft">
                  <div className="contractRowBorderNo" style={{ textAlign: 'left', paddingLeft: '2px' }}>
                    {constractData.companyName}
                  </div>
                </Col>
                <Col span={3} className="contractRowBorderLeft contract-bg">
                  签约日期：
                </Col>
                <Col span={5} className="contractRowBorderLeft">
                  <div className="contractRowBorderNo" style={{ textAlign: 'left', paddingLeft: '2px' }}>
                    {constractData.contractDate}
                  </div>
                </Col>
              </Row>
              <Row className="text-css contractRowBorderLeft contractRowBorderRight contract-bg">
                <Col span={4}>
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
                <Col span={5} className="contractRowBorderLeft">
                  <div className="contractRowBorderNo" style={{ textAlign: 'left', paddingLeft: '2px' }}>
                    {constractData.aThirdProduct ? constractData.aThirdProduct : 0}
                  </div>
                </Col>
              </Row>
              <Row className="text-css contractRowBorderLeft contractRowBorderRight contractRowBorderTop">
                <Col span={4} className="contract-bg">
                  B-集成服务：
                </Col>
                <Col span={5} className="contractRowBorderLeft">
                  <div className="contractRowBorderNo" style={{ textAlign: 'left', paddingLeft: '2px' }}>
                    {constractData.bIntegration ? constractData.bIntegration : 0}
                  </div>
                </Col>
                <Col span={3} className="contractRowBorderLeft contract-bg">
                  C-软件解决方案：
                </Col>
                <Col span={4} className="contractRowBorderLeft">
                  <div className="contractRowBorderNo" style={{ textAlign: 'left', paddingLeft: '2px' }}>
                    {constractData.cSolution}
                  </div>
                </Col>
                <Col span={3} className="contractRowBorderLeft contract-bg">
                  D-培训：
                </Col>
                <Col span={5} className="contractRowBorderLeft">
                  <div className="contractRowBorderNo" style={{ textAlign: 'left', paddingLeft: '2px' }}>
                    {constractData.dTraining ? constractData.dTraining : 0}
                  </div>
                </Col>
              </Row>
              <Row className="text-css contractRowBorderLeft contractRowBorderRight contractRowBorderTop">
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
                <Col span={5} className="contractRowBorderLeft">
                  <div className="contractRowBorderNo" style={{ textAlign: 'left', paddingLeft: '2px' }}>
                    {constractData.maintainEndDate}
                  </div>
                </Col>
              </Row>
              <Row className="text-css contractRowBorderLeft contractRowBorderRight contractRowBorderTop">
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
                      />
                    )}
                  </FormItem>
                </Col>
                <Col span={3} className="contractRowBorderLeft contract-bg">
                  合同拆分操作人：
                </Col>
                <Col span={4} className="contractRowBorderLeft">
                  <div className="contractRowBorderNo" style={{ textAlign: 'left', paddingLeft: '2px' }}>
                    {constractData.splitedByName}
                  </div>
                </Col>
                <Col span={2} className="contractRowBorderLeft contract-bg">
                  关联BU<em style={{ color: '#FF0000' }}>*</em>：
                </Col>
                <Col span={2} className="contractRowBorderLeft">
                  <FormItem>
                    {
                      getFieldDecorator('relatedBuNo',{initialValue:[constractData.relatedBuNo,constractData.relatedBuNoName]},)(<SelectSbu disabled={this.state.editFlag} />)
                    }
                  </FormItem>
                </Col>
                <Col span={2} className="contractRowBorderLeft contract-bg">
                  考核比率：
                </Col>
                <Col span={2} className="contractRowBorderLeft">
                  <div className="contractRowBorderNo">
                    {constractData.assessRatio}
                  </div>
                </Col>
              </Row>
              <Row className="text-css contractRowBorder">
                <Col span={4} className="contract-bg">
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
                <Col span={12} className="contractRowBorderLeft" style={{ textAlign: 'left'}}>
                  <FormItem>
                    {getFieldDecorator('revenueCheckout', {
                      initialValue: constractData['revenueCheckout'],
                    })(
                      <Checkbox.Group>
                        <Checkbox value="POC">POC</Checkbox>
                        <Checkbox value="RATABLY">RATABLY</Checkbox>
                        <Checkbox value="FA">FA</Checkbox>
                      </Checkbox.Group>
                    )}
                  </FormItem>
                </Col>
              </Row>
              <br />
              <br />
              <h2>项目信息</h2>
              <br />
              <Row className="text-css contractRowBorderLeft contractRowBorderRight contractRowBorderTop">
                <Col span={4} className="contract-bg">
                  项目编码：
                </Col>
                <Col span={5} className="contractRowBorderLeft">
                  <div className="contractRowBorderNo" style={{ textAlign: 'left', paddingLeft: '2px' }}>
                    {constractData.projectNo}
                  </div>
                </Col>
                <Col span={3} className="contractRowBorderLeft contract-bg">
                  项目立项部门：
                </Col>
                <Col span={4} className="contractRowBorderLeft">
                  <div className="contractRowBorderNo" style={{ textAlign: 'left', paddingLeft: '2px' }}>
                    {constractData.projectDeptNo}
                  </div>
                </Col>
                <Col span={3} className="contractRowBorderLeft contract-bg">
                  项目经理：
                </Col>
                <Col span={5} className="contractRowBorderLeft">
                  <div className="contractRowBorderNo" style={{ textAlign: 'left', paddingLeft: '2px' }}>
                    {constractData.projectManager}
                  </div>
                </Col>
              </Row>
              <Row className="text-css contractRowBorder">
                <Col span={4} className="contract-bg">
                  是否集采项目：
                </Col>
                <Col span={5} className="contractRowBorderLeft">
                  <div className="contractRowBorderNo" style={{ textAlign: 'left', paddingLeft: '2px' }}>
                    {constractData.collectionProject}
                  </div>
                </Col>
                <Col span={3} className="contractRowBorderLeft contract-bg">
                  立项BU<em style={{ color: '#FF0000' }}>*</em>：
                </Col>
                <Col span={4} className="contractRowBorderLeft">
                  <FormItem>
                    {
                      getFieldDecorator('projectBuNo',{initialValue:[constractData.projectBuNo,constractData.projectBuNoName]},)(<SelectSbu disabled={this.state.editFlag} />)
                    }
                  </FormItem>
                </Col>
                <Col span={3} className="contractRowBorderLeft contract-bg">
                  Sales签约BU：
                </Col>
                <Col span={5} className="contractRowBorderLeft">
                  <div className="contractRowBorderNo" style={{ textAlign: 'left', paddingLeft: '2px' }}>
                    {constractData.salesBuNo}
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
                  <Button onClick={() => this.handleAdd('0', '1')}>新增</Button>
                </Col>
              </Row>
              <br />
              <Table
                bordered
                columns={columns}
                size="middle"
                scroll={{ x: '2200px' }}
                dataSource = {dataSource}
                pagination={false}
              />
              <h2>外购成本预算</h2>
              <br />
              <Row className="text-css contractRowBorderLeft contractRowBorderRight contractRowBorderTop">
                <Col span={5} className="contract-bg">
                  Task 1 cost(成本)：
                </Col>
                <Col span={19} className="contractRowBorderLeft">
                  <FormItem>
                    {
                      getFieldDecorator('task1Cost',{initialValue:constractData.task1tCost},)(<Input className="contractRowBorderNo" onChange={(e)=>this.handleTaskCostChange(e,'task1Cost')} disabled={this.state.editFlag} />)
                    }
                  </FormItem>

                </Col>
              </Row>
              <Row className="text-css contractRowBorderLeft contractRowBorderRight contractRowBorderTop">
                <Col span={5} className="contract-bg">
                  Task 3T cost(第三方软件成本)：
                </Col>
                <Col span={5} className="contractRowBorderLeft">
                  <FormItem>
                    {
                      getFieldDecorator('task3tCost',{initialValue:constractData.task3tCost},)(<Input className="contractRowBorderNo" onChange={(e)=>this.handleTaskCostChange(e,'task3tCost')} disabled={this.state.editFlag} />)
                    }
                  </FormItem>

                </Col>
                <Col span={5} className="contractRowBorderLeft contract-bg">
                  Task 4T cost(第三方软件支持成本)：
                </Col>
                <Col span={9} className="contractRowBorderLeft">
                  <FormItem>
                    {
                      getFieldDecorator('task4tCost',{initialValue:constractData.task4tCost},)(<Input className="contractRowBorderNo" onChange={(e)=>this.handleTaskCostChange(e,'task4tCost')} disabled={this.state.editFlag} />)
                    }
                  </FormItem>
                </Col>
              </Row>
              <Row className="text-css contractRowBorderLeft contractRowBorderRight contractRowBorderTop">
                <Col span={5} className="contract-bg">
                  Task 5 cost(外购硬件设备成本)：
                </Col>
                <Col span={5} className="contractRowBorderLeft">
                  <FormItem>
                    {
                      getFieldDecorator('task5Cost',{initialValue:constractData.task5Cost},)(<Input className="contractRowBorderNo" onChange={(e)=>this.handleTaskCostChange(e,'task5Cost')} disabled={this.state.editFlag} />)
                    }
                  </FormItem>
                </Col>
                <Col span={5} className="contractRowBorderLeft contract-bg">
                  Task 9 cost(外购支持服务成本)：
                </Col>
                <Col span={9} className="contractRowBorderLeft">
                  <FormItem>
                    {
                      getFieldDecorator('task9Cost',{initialValue:constractData.task9Cost},)(<Input className="contractRowBorderNo" onChange={(e)=>this.handleTaskCostChange(e,'task9Cost')} disabled={this.state.editFlag} />)
                    }
                  </FormItem>
                </Col>
              </Row>
              <Row className="text-css contractRowBorderLeft contractRowBorderRight contractRowBorderTop">
                <Col span={5} className="contract-bg">
                  关联公司成本：
                </Col>
                <Col span={19} className="contractRowBorderLeft">
                  <FormItem>
                    {
                      getFieldDecorator('intercompanyCost',{initialValue:constractData.intercompanyCost},)(<Input className="contractRowBorderNo" onChange={(e)=>this.handleTaskCostChange(e,'intercompanyCost')} disabled={this.state.editFlag} />)
                    }
                  </FormItem>
                </Col>
              </Row>
              <Row className="text-css contractRowBorderLeft contractRowBorderRight contractRowBorderTop">
                <Col span={5} className="contract-bg">
                  关联分包费：
                </Col>
                <Col span={19} className="contractRowBorderLeft">
                  <FormItem>
                    {
                      getFieldDecorator('subcontractFee',{initialValue:constractData.subcontractFee},)(<Input className="contractRowBorderNo" onChange={(e)=>this.handleTaskCostChange(e,'subcontractFee')} disabled={this.state.editFlag}/>)
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
              <TextArea rows={4} defaultValue={constractData.subcontractFee}  value={this.state.rcontent} onChange={this.onTextAreaChange} placeholder="根据实际情况录入，且不超过150字符" />
              <br />
              <br />
              <h2>Order</h2>
              <Row className="text-css contractRowBorder">
                <Col span={4}>
                  Gross Order：
                </Col>
                <Col span={4} className="contractRowBorderLeft contractRowBorderRight">
                  <Input className="contractRowBorderNo" value={currency(countGrossOrder)} disabled />
                </Col>
                <Col span={4}>
                  Net Order(Legal)：
                </Col>
                <Col span={4} className="contractRowBorderLeft contractRowBorderRight">
                  <Input className="contractRowBorderNo" value={currency(countGrossOrder)} disabled />
                </Col>
                <Col span={4}>
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
