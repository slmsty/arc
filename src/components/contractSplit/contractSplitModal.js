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
import { Modal, Form, Table, Row, Col, Button, Input, Checkbox, DatePicker, Select } from 'antd'

const FormItem = Form.Item
const { TextArea } = Input
const Option = Select.Option
const tableData = [{
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
const EditableCell = ({ value, onChange, column }) => (
  <div style={{ position: 'relative' }}>
    <Input value={value} onChange={e => onChange(e.target.value)} />
    {column === 'discount' ?
      <span style={{ position: 'absolute', right: '10px', top: '20%' }}>%</span>
      : ''
    }
  </div>
)

class ContractSplitModal extends React.Component{
  state = {
    dataSource: tableData,
    countCatalPrice: 0.00,
    rcontent: '',
    rcontentnum: 0,
    countTaskCost: 0.00,
    countTaskCostData: {},
  }
  selectDateChange = (data) => {
    const newData = [...this.state.dataSource]
    newData[data.indexs][data.columns] = data.dateString
    this.setState({
      dataSource: newData,
    })
  }
  handleChange = (data) => {
    console.log(data)
    if(data){
      const newData = [...this.state.dataSource]
      const indexData = data.No && data.Name ? data.Name : ''
      if(data.columns){
        newData[data.indexs][data.columns] = indexData
      }
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
  renderColumns = (text, index, column) => {
    if(column=="product"){
      return <ProductLine onCancel={()=>this.canCel(index,column)} onChange={this.handleChange} value={this.state.dataSource[index][column]}  indexs={index} columns={column} />
    }
    if(column =='contractCategory'){
      return(
        <ContractType
          typeCode="BILLED_SPLIT"
          paramCode="STATUS"
          placeholder="合同类型"
          hasEmpty
          onChange={this.handleChange}
          value={this.state.dataSource[index][column]}
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
      />
    )
  }
  handleInputChange = (value, index, column) => {
    const newData = [...this.state.dataSource]
    newData[index][column] = value
    if (!newData[index].listPrice || !newData[index].discount) {
      newData[index].discountedPrice = 0 // 折后合同额
      newData[index].contractAmountTaxInclude = 0 // 合同含税额
      newData[index].contractAmountTaxExclude = 0  // 合同不含税额
      newData[index].returnTaxRevenue = 0 // 退税收入含税额
      newData[index].GrossOrder = 0 // 退税收入含税额
    } else {
      newData[index].discountedPrice = (parseFloat(newData[index].listPrice) * (1 - parseFloat(newData[index].discount) * 0.01)).toFixed(2) // 折后合同额根据目录价和折扣计算出来
      newData[index].contractAmountTaxInclude = (parseFloat(newData[index].listPrice) * (1 - parseFloat(newData[index].discount) * 0.01)).toFixed(2) // 合同含税额：等于折后合同额
      newData[index].contractAmountTaxExclude = (parseFloat(newData[index].contractAmountTaxInclude) / (1 + 0.18)).toFixed(2) // 合同不含税额 根据合同含税额和合同税率计算出合同不含税额
      newData[index].returnTaxRevenue = (parseFloat(newData[index].contractAmountTaxInclude) / (1 + 0.18) * (parseFloat(newData[index].returnTaxRate))).toFixed(2) // 退税收入含税额：等于合同含税额/(1+合同税率)*(退税率)
      newData[index].GrossOrder = (parseFloat(newData[index].contractAmountTaxInclude) / (1 + 0.18)).toFixed(2) // Gross Order：等于合同含税额/(1+合同税率)
    }
    this.setState({
      dataSource: newData,
    })
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
      <Select labelInValue onChange={this.handleSelectChange} placeholder="请选择拆分状态" defaultValue={{ key: `POC&${index}&${column}` }}>
        <Option value={`POC&${index}&${column}`}>POC</Option>
        <Option value={`RATABLY&${index}&${column}`}>RATABLY</Option>
        <Option value={`FA&${index}&${column}`}>FA</Option>
      </Select>
    )
  }
  closeClaim = () => {
    this.props.closeModal()
  }
  handleAdd = (index, flag) => {
    const newData = {
      parentOrderListLineId: '',
      orderListLineId: '110'+new Date().getTime(),
      subRow: false,
    }
    const subParentOrderListLineId = this.state.dataSource[index].orderListLineId
    const newSubData = {
      taskOpration: 'addSub',
      parentKey: index,
      parentOrderListLineId: subParentOrderListLineId,
      orderListLineId: '110'+new Date().getTime(),
      subRow: true,
    }
    // flag == 0 为增加子行
    if (flag === '0') {
      tableData.splice(Number(index) + 1, 0, newSubData)
    }
    if (flag === '1') {
      tableData.splice(-1, 0, newData)
    }
    this.setState({
      dataSource: tableData,
    })
  }
  handleMinus = (index) => {
    this.state.dataSource.splice(index, 1)
    const newData = this.state.dataSource
    this.setState({
      data: newData,
    })
  }
  handleOk = () => {
    const param = this.props.form.getFieldsValue()
    param.projectBuNo = param && param.projectBuNo ? param.projectBuNo[1] : ''
    param.relatedBuNo = param && param.relatedBuNo ? param.relatedBuNo[1] : ''
    const splitListInfo = this.state.dataSource
    const postParams = {}
    postParams.splitListInfo = splitListInfo
    postParams.contractInfo = this.props.data
    postParams.contractInfo.projectBuNo = param.projectBuNo
    postParams.contractInfo.relatedBuNo = param.relatedBuNo
    postParams.contractInfo.revenueCheckout = param.revenueCheckout
    postParams.contractInfo.maintainBeginDate = param.maintainBeginDate
    postParams.contractInfo.splitedRemark = this.state.rcontent
    postParams.contractInfo.task3tCost = param.task3tCost
    postParams.contractInfo.task4tCost = param.task4tCost
    postParams.contractInfo.task5Cost = param.task5Cost
    postParams.contractInfo.task9Cost = param.task9Cost
    postParams.contractInfo.intercompanyCost = param.intercompanyCost
    postParams.contractInfo.subcontractFee = param.subcontractFee
    console.log('param',postParams)
    this.props.saveInfo(postParams)
  }
  handleTaskCostChange = (e,flag) =>{
    console.log(e.target.value)
    console.log(flag)
    const currentValue = e.target.value
    const countValueData = this.state.countTaskCostData
    countValueData[flag] = currentValue
    this.setState({
      countTaskCostData:countValueData,
    })

  }
  render() {
    const constractData = this.props.data
    let countCatalPrice = 0 // 合计目录价 catalogue
    let discountCatalPrice = 0 // 折后目录价
    let countsalePeo = 0 // 合同不含税额
    let countcontractType1 = 0 // 退税收入含税额
    let countGrossOrder = 0 // GrossOrder
    let countTaskCost = 0;
    const countTaskCostData = this.state.countTaskCostData
    console.log(this.state.countTaskCostData)
    console.log(countTaskCostData)
    for(let i in countTaskCostData){
      countTaskCost +=parseFloat(countTaskCostData[i])
    }
    console.log(countTaskCost)
    const coutnData = [...this.state.dataSource]
    coutnData.map((item) => {
      if (item.taskOpration !== 'addSub') {
        countCatalPrice += !item || !item.listPrice ? 0 : parseFloat(item.listPrice) // 合计目录价
        discountCatalPrice += !item || !item.discountedPrice ? 0 : parseFloat(item.discountedPrice) // 折后目录价
        countsalePeo += !item || !item.contractAmountTaxExclude ? 0 : parseFloat(item.contractAmountTaxExclude) // 合同不含税额
        countcontractType1 += !item || !item.returnTaxRevenue ? 0 : parseFloat(item.returnTaxRevenue) // 退税收入含税额
        countGrossOrder += !item || !item.GrossOrder ? 0 : parseFloat(item.GrossOrder) // GrossOrder
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
            text === 'addSub' ?
              <div>
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
      render: (text, record, index) => record.taskOpration === '合计' ? '' : this.renderColumns(text, index, 'contractCategory'),
    }, {
      title: <span>产品线<em style={{ color: '#FF0000' }}>*</em></span>,
      dataIndex: 'product',
      width: 150,
      render: (text, record, index) => record.taskOpration === '合计' ? '' : this.renderColumns(text, index, 'product'),
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
      render: (text, record, index) => record.taskOpration === '合计' ? '' : (text ? text : 0.18),
    }, {
      title: '合同不含税额',
      dataIndex: 'contractAmountTaxExclude',
      width: 150,
      render: (text, record, index) => record.taskOpration === '合计' ? currency(countsalePeo) : text,
    }, {
      title: <span>退税率<em style={{ color: '#FF0000' }}>*</em></span>,
      dataIndex: 'returnTaxRate',
      width: 150,
      render: (text, record, index) => record.taskOpration === '合计' ? '' : this.renderInputColumns(text, index, 'returnTaxRate'),
    }, {
      title: '退税收入含税额',
      dataIndex: 'returnTaxRevenue',
      width: 200,
      render: (text, record, index) => record.taskOpration === '合计' ? currency(countcontractType1) : text,
    }, {
      title: 'Gross Order',
      dataIndex: 'GrossOrder',
      width: 100,
      render: (text, record, index) => record.taskOpration === '合计' ? currency(countGrossOrder) : text,
    }, {
      title: <span>服务期起始<em style={{ color: '#FF0000' }}>*</em></span>,
      dataIndex: 'serviceStartDate',
      width: 200,
      render: (text, record, index) => {
        return (
          record.taskOpration === '合计' ? '' :
          <MyDtatePicker onChange={this.selectDateChange} indexs={index} columns='serviceStartDate' />
        )
      }
    }, {
      title: <span>服务期结束<em style={{ color: '#FF0000' }}>*</em></span>,
      dataIndex: 'serviceEndDate',
      width: 200,
      render: (text, record, index) => {
        return (
          record.taskOpration === '合计' ? '' :
          <MyDtatePicker onChange={this.selectDateChange} indexs={index} columns='serviceEndDate' />
        )
      }
    },
    ]
    return (
      <div>
        <Modal
          width={1024}
          title="合同拆分"
          visible={this.props.ModalVisible}
          onCancel={this.closeClaim}
          footer={[
            <Button key="submit" onClick={this.handleOk}>
              保存
            </Button>,
            <Button key="back" onClick={this.handleOk}>
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
                <Col span={4}>
                  合同名称：
                </Col>
                <Col span={20} className="contractRowBorderLeft">
                  <Input className="contractRowBorderNo" style={{ textAlign: 'left', paddingLeft: '2px' }} value={constractData.contractName} disabled />
                </Col>
              </Row>
              <Row className="text-css contractRowBorderLeft contractRowBorderRight contractRowBorderBottom">
                <Col span={4}>
                  合同编码：
                </Col>
                <Col span={5} className="contractRowBorderLeft">
                  <Input className="contractRowBorderNo" style={{ textAlign: 'left', paddingLeft: '2px' }} value={constractData.contractNo} disabled />
                </Col>
                <Col span={3} className="contractRowBorderLeft">
                  签约公司：
                </Col>
                <Col span={12} className="contractRowBorderLeft">
                  <Input className="contractRowBorderNo" style={{ textAlign: 'left', paddingLeft: '2px' }} value={constractData.companyName} disabled  />
                </Col>
              </Row>
              <Row className="text-css contractRowBorderLeft contractRowBorderRight">
                <Col span={4}>
                  签约日期：
                </Col>
                <Col span={5} className="contractRowBorderLeft">
                  <Input className="contractRowBorderNo" style={{ textAlign: 'left', paddingLeft: '2px' }} value={constractData.contractDate} disabled />
                </Col>
                <Col span={3} className="contractRowBorderLeft">
                  合同总金额：
                </Col>
                <Col span={4} className="contractRowBorderLeft">
                  <Input className="contractRowBorderNo" style={{ textAlign: 'left', paddingLeft: '2px' }} value={currency(constractData.contractAmount)} disabled />
                </Col>
                <Col span={3} className="contractRowBorderLeft">
                  A-第三方产品：
                </Col>
                <Col span={5} className="contractRowBorderLeft">
                  <Input className="contractRowBorderNo" style={{ textAlign: 'left', paddingLeft: '2px' }} value={constractData.aThirdProduct} disabled />
                </Col>
              </Row>
              <Row className="text-css contractRowBorderLeft contractRowBorderRight contractRowBorderTop">
                <Col span={4}>
                  B-集成服务：
                </Col>
                <Col span={5} className="contractRowBorderLeft">
                  <Input className="contractRowBorderNo" style={{ textAlign: 'left', paddingLeft: '2px' }} value={constractData.bIntegration} disabled />
                </Col>
                <Col span={3} className="contractRowBorderLeft">
                  C-软件解决方案：
                </Col>
                <Col span={4} className="contractRowBorderLeft">
                  <Input className="contractRowBorderNo" style={{ textAlign: 'left', paddingLeft: '2px' }} value={constractData.cSolution} disabled />
                </Col>
                <Col span={3} className="contractRowBorderLeft">
                  D-培训：
                </Col>
                <Col span={5} className="contractRowBorderLeft">
                  <Input className="contractRowBorderNo" style={{ textAlign: 'left', paddingLeft: '2px' }} value={constractData.dTraining} disabled />
                </Col>
              </Row>
              <Row className="text-css contractRowBorderLeft contractRowBorderRight contractRowBorderTop">
                <Col span={4}>
                  软件解决方案保修期：
                </Col>
                <Col span={5} className="contractRowBorderLeft">
                  <Input className="contractRowBorderNo" style={{ textAlign: 'left', paddingLeft: '2px' }} value={constractData.solutionMaintain} disabled />
                </Col>
                <Col span={3} className="contractRowBorderLeft">
                  维护服务开始时间：
                </Col>
                <Col span={4} className="contractRowBorderLeft">
                  <Input className="contractRowBorderNo" style={{ textAlign: 'left', paddingLeft: '2px' }} value={constractData.maintainStartDate} disabled />
                </Col>
                <Col span={3} className="contractRowBorderLeft">
                  维护服务结束时间：
                </Col>
                <Col span={5} className="contractRowBorderLeft">
                  <Input className="contractRowBorderNo" style={{ textAlign: 'left', paddingLeft: '2px' }} value={constractData.maintainEndDate} disabled />
                </Col>
              </Row>
              <Row className="text-css contractRowBorderLeft contractRowBorderRight contractRowBorderTop">
                <Col span={4}>
                  保修期开始时间<em style={{ color: '#FF0000' }}>*</em>：
                </Col>
                <Col span={5} className="contractRowBorderLeft">
                  <FormItem>
                    {getFieldDecorator('maintainBeginDate', {
                      initialValue: 'MAINTAIN_TIME_1',
                    })(
                      <SelectInvokeApi
                        placeholder="请选择保修期开始时间"
                        paramCode="MAINTAIN_TIME"
                        typeCode="BILLED_SPLIT"
                      />
                    )}
                  </FormItem>
                </Col>
                <Col span={3} className="contractRowBorderLeft">
                  合同拆分操作人：
                </Col>
                <Col span={4} className="contractRowBorderLeft">
                  <Input className="contractRowBorderNo" style={{ textAlign: 'left', paddingLeft: '2px' }} value={constractData.splitedByName} disabled />
                </Col>
                <Col span={2} className="contractRowBorderLeft">
                  关联BU<em style={{ color: '#FF0000' }}>*</em>：
                </Col>
                <Col span={2} className="contractRowBorderLeft">
                  <FormItem>
                    {
                      getFieldDecorator('relatedBuNo')(<SelectSbu />)
                    }
                  </FormItem>
                </Col>
                <Col span={2} className="contractRowBorderLeft">
                  考核比率：
                </Col>
                <Col span={2} className="contractRowBorderLeft">
                  <Input className="contractRowBorderNo" value={constractData.assessRatio} disabled/>
                </Col>
              </Row>
              <Row className="text-css contractRowBorder">
                <Col span={4}>
                  C-FORM版本GM%：
                </Col>
                <Col span={5} className="contractRowBorderLeft">
                  <Input className="contractRowBorderNo" style={{ textAlign: 'left', paddingLeft: '2px' }} value={constractData.cFormGm} disabled />
                </Col>
                <Col span={3} className="contractRowBorderLeft">
                  收入结算方式<em style={{ color: '#FF0000' }}>*</em>：
                </Col>
                <Col span={12} className="contractRowBorderLeft" style={{ textAlign: 'left'}}>
                  <FormItem>
                    {getFieldDecorator('revenueCheckout', {
                      initialValue: 'RATABLY',
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
                <Col span={4}>
                  项目编码：
                </Col>
                <Col span={5} className="contractRowBorderLeft">
                  <Input className="contractRowBorderNo" style={{ textAlign: 'left', paddingLeft: '2px' }} value={constractData.projectNo} disabled />
                </Col>
                <Col span={3} className="contractRowBorderLeft">
                  项目立项部门：
                </Col>
                <Col span={4} className="contractRowBorderLeft">
                  <Input className="contractRowBorderNo" style={{ textAlign: 'left', paddingLeft: '2px' }} value={constractData.projectDeptNo} disabled />
                </Col>
                <Col span={3} className="contractRowBorderLeft">
                  项目经理：
                </Col>
                <Col span={5} className="contractRowBorderLeft">
                  <Input className="contractRowBorderNo" style={{ textAlign: 'left', paddingLeft: '2px' }} value={constractData.projectManager} disabled />
                </Col>
              </Row>
              <Row className="text-css contractRowBorder">
                <Col span={4}>
                  是否集采项目：
                </Col>
                <Col span={5} className="contractRowBorderLeft">
                  <Input className="contractRowBorderNo" style={{ textAlign: 'left', paddingLeft: '2px' }} value={constractData.collectionProject} disabled />
                </Col>
                <Col span={3} className="contractRowBorderLeft">
                  立项BU<em style={{ color: '#FF0000' }}>*</em>：
                </Col>
                <Col span={4} className="contractRowBorderLeft">
                  <FormItem>
                    {
                      getFieldDecorator('projectBuNo')(<SelectSbu />)
                    }
                  </FormItem>
                </Col>
                <Col span={3} className="contractRowBorderLeft">
                  Sales签约BU：
                </Col>
                <Col span={5} className="contractRowBorderLeft">
                  <Input className="contractRowBorderNo" style={{ textAlign: 'left', paddingLeft: '2px' }} value={constractData.salesBuNo} disabled />
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
                dataSource={this.state.dataSource}
              />
              <h2>外购成本预算</h2>
              <br />
              <Row className="text-css contractRowBorderLeft contractRowBorderRight contractRowBorderTop">
                <Col span={5}>
                  Task 3T cost(第三方软件成本)：
                </Col>
                <Col span={5} className="contractRowBorderLeft">
                  <FormItem>
                    {
                      getFieldDecorator('task3tCost')(<Input className="contractRowBorderNo" onChange={(e)=>this.handleTaskCostChange(e,'task3tCost')} />)
                    }
                  </FormItem>

                </Col>
                <Col span={5} className="contractRowBorderLeft">
                  Task 4T cost(第三方软件支持成本)：
                </Col>
                <Col span={9} className="contractRowBorderLeft">
                  <FormItem>
                    {
                      getFieldDecorator('task4tCost')(<Input className="contractRowBorderNo" onChange={(e)=>this.handleTaskCostChange(e,'task4tCost')} />)
                    }
                  </FormItem>
                </Col>
              </Row>
              <Row className="text-css contractRowBorderLeft contractRowBorderRight contractRowBorderTop">
                <Col span={5}>
                  Task 5 cost(外购硬件设备成本)：
                </Col>
                <Col span={5} className="contractRowBorderLeft">
                  <FormItem>
                    {
                      getFieldDecorator('task5Cost')(<Input className="contractRowBorderNo" onChange={(e)=>this.handleTaskCostChange(e,'task5Cost')} />)
                    }
                  </FormItem>
                </Col>
                <Col span={5} className="contractRowBorderLeft">
                  Task 9 cost(外购支持服务成本)：
                </Col>
                <Col span={9} className="contractRowBorderLeft">
                  <FormItem>
                    {
                      getFieldDecorator('task9Cost')(<Input className="contractRowBorderNo" onChange={(e)=>this.handleTaskCostChange(e,'task9Cost')} />)
                    }
                  </FormItem>
                </Col>
              </Row>
              <Row className="text-css contractRowBorderLeft contractRowBorderRight contractRowBorderTop">
                <Col span={5}>
                  关联公司成本：
                </Col>
                <Col span={19} className="contractRowBorderLeft">
                  <FormItem>
                    {
                      getFieldDecorator('intercompanyCost')(<Input className="contractRowBorderNo" onChange={(e)=>this.handleTaskCostChange(e,'intercompanyCost')} />)
                    }
                  </FormItem>
                </Col>
              </Row>
              <Row className="text-css contractRowBorderLeft contractRowBorderRight contractRowBorderTop">
                <Col span={5}>
                  关联分包费：
                </Col>
                <Col span={19} className="contractRowBorderLeft">
                  <FormItem>
                    {
                      getFieldDecorator('subcontractFee')(<Input className="contractRowBorderNo" onChange={(e)=>this.handleTaskCostChange(e,'subcontractFee')} />)
                    }
                  </FormItem>
                </Col>
              </Row>
              <Row className="text-css contractRowBorder">
                <Col span={5}>
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
              <TextArea rows={4} value={this.state.rcontent} onChange={this.onTextAreaChange} placeholder="根据实际情况录入，且不超过150字符" />
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
