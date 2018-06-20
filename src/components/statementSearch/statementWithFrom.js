/**
 * Created by liangshuang on 17/12/1.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { Button, Row, Col, Form, Radio, DatePicker, Input, Icon, Select } from 'antd'
import moment from 'moment'
import MultipleInput from '../common/multipleInput'
import SelectRadioApi from  '../common/selectRadioApi'
import SelectSbu from '../common/SelectSbu'
import SelectOperator from '../common/selectOperator'
import SelectCurrent from '../common/selectCurrent'
import StaffInfo from '../common/staffInfo'
import SelectCustomerWithForm from '../common/selectCustomer'

const FormItem = Form.Item
const RadioButton = Radio.Button
const RadioGroup = Radio.Group
const dateFormat = 'YYYY-MM-DD'
const { RangePicker,MonthPicker } = DatePicker
const Option = Select.Option;

class StatementListCom extends React.Component {
  state = {
    infoVisitable: false,
    loading: false,
    applyData: '',
    stateType: '',
    excelDis:false,
    askContractTo:[],
    param:{}
  }
  excel = (type)=>{
    this.setState({
      excelDis: true,
    })
    let param = {}
    const params = this.props.form.getFieldsValue()
    if (type==='split') {
      param = {
        contractSplit:  {
          ...params,
          signDateStart: params.signDate && params.signDate.length ? params.signDate[0].format(dateFormat) : '',
          signDateEnd: params.signDate && params.signDate.length ? params.signDate[1].format(dateFormat) : '',
          buId: params.buId ? params.buId[0] : '',
          isReport: 'Y',
        }
      }
    } else if (type==='order') {
      param = {
        projectOrder: {
          ...params,
          signDateStart: params.signDate && params.signDate.length ? params.signDate[0].format(dateFormat) : '',
          signDateEnd: params.signDate && params.signDate.length ? params.signDate[1].format(dateFormat) : '',
          salesBu: params.salesBu && params.salesBu.length ? params.salesBu[0] : '',
          projectBu: params.projectBu && params.projectBu.length ? params.projectBu[0] : '',
          projectManager: params.projectManager && params.projectManager.length ? params.projectManager[0] : ''
        }
      }
    } else if (type==='summarize') {
      param = {
        orderSummarize: {
          ...params,
          startTime: params.signDate && params.signDate.length ? params.signDate[0].format(dateFormat) : '',
          endTime: params.signDate && params.signDate.length ? params.signDate[1].format(dateFormat) : '',
          bu: params.bu && params.bu.length ? params.bu[0] : '',
        }
      }
    } else if (type==='receipt_claim') {
      param = {
        receiptClaim: {
          ...params,
          receiptDateStart: params.receiptDate && params.receiptDate.length ? params.receiptDate[0].format(dateFormat) : '',
          receiptDateEnd: params.receiptDate && params.receiptDate.length ? params.receiptDate[1].format(dateFormat) : '',
          isReport: 'Y',
        }
      }
    } else if (type==='outcomeInfoReport') {
      param = {
        invoice: {
          ...params,
          billingDateStart: params.billingDate && params.billingDate.length ? params.billingDate[0].format(dateFormat) : '',
          billingDateEnd: params.billingDate && params.billingDate.length ? params.billingDate[1].format(dateFormat) : '',
        }
      }
    } else if (type==='receiptAccountReport') {
      param = {
        confirReq: {
          ...params
        }
      }
    } else if (type==='projectInfoReport') {
      param = {
        project: {
          ...params,
          billingDateStart: params.billingDate && params.billingDate.length ? params.billingDate[0].format(dateFormat) : '',
          billingDateEnd: params.billingDate && params.billingDate.length ? params.billingDate[1].format(dateFormat) : '',
        }
      }
    } else if (type==='contractInfoReport') {
      param = {
        contract: {
          ...params,
          signDateStart: params.signDate && params.signDate.length ? params.signDate[0].format(dateFormat) : '',
          signDateEnd: params.signDate && params.signDate.length ? params.signDate[1].format(dateFormat) : '',
          region: params.region && params.region.lenght ? params.region[0] : '',
          projectManager: params.projectManager && params.projectManager.length ? params.projectManager[0] : '',
          projectBu: params.projectBu && params.projectBu.length ? params.projectBu[0] : '',
        }
      }
    } else if (type==='outcomeDetailReport') {
      param = {
        invoiceDetail: {
          ...params,
          billingDateStart: params.billingDate && params.billingDate.length ? params.billingDate[0].format(dateFormat) : '',
          billingDateEnd: params.billingDate && params.billingDate.length ? params.billingDate[1].format(dateFormat) : '',
        }
      }
    } else if (type==='outcomeTotalReport') {
      param = {
        billingMonth: {
          ...params,
          projectBu: params.projectBu ? params.projectBu[0] : '',
          billingMonth: params.billingMonth.format("YYYY-MM")
        }
      }
    }
    if (type==='unContractOutcomeDataAdd') {
      param = {
        unsignedBilling: {
          ...params,
          billingDateStart: params.billingDate && params.billingDate.length ? params.billingDate[0].format(dateFormat) : '',
          billingDateEnd: params.billingDate && params.billingDate.length ? params.billingDate[1].format(dateFormat) : ''
        }
      }
    }
    this.props.getExcel(param, type).then(res => {
      if(res) {
        this.setState({
          excelDis: false,
        })
      }
    })
  }
  // 查询接口
  queryParms = (statement) => {
    const params = this.props.form.getFieldsValue()
      //收款信息查询表
    if(statement === 'receiptInfoReport'){
      let param = {}
      param.projectNo = params.projectNo
      param.contractNo = params.contractNo
      param.receiptDateStart = params.receiptDate && params.receiptDate.length ? params.receiptDate[0].format(dateFormat) : ''
      param.receiptDateEnd = params.receiptDate && params.receiptDate.length ? params.receiptDate[1].format(dateFormat) : ''
      param.receiptCurrency = params.receiptCurrency
      param.claimAmountMin = params.claimAmountMin
      param.claimAmountMax = params.claimAmountMax
      param.signCompany = params.signCompany
      param.paymentName = params.paymentName
      param.contractName = params.contractName
      param.custName = params.custName
      param.receiptNo = params.receiptNo
      param.glDateStart = params.glDate && params.glDate.length ? params.glDate[0].format(dateFormat) : ''
      param.glDateEnd = params.glDate && params.glDate.length ? params.glDate[1].format(dateFormat) : ''
      param.isReport = 'Y'
      param.status = params.status
      param.currency = params.currency
      this.setState({
        param
      })
      this.props.queryParms(param,'receiptInfoReport')
    }
    //合同拆分查询表
    if(statement==='contractSplitReport'){
      let param = {}
      param.projectNo = params.projectNo
      param.signDateStart = params.signDate && params.signDate.length ? params.signDate[0].format(dateFormat) : ''
      param.signDateEnd = params.signDate && params.signDate.length ? params.signDate[1].format(dateFormat) : ''
      param.contractName = params.contractName
      param.buId = params.buId ? params.buId[0] : ''
      param.collectionProject = params.collectionProject
      param.isProdect = params.isProdect
      param.signCompany = params.signCompany
      param.contractNo = params.contractNo
      param.isReport = 'Y'
      this.setState({
        param
      })
      this.props.queryParms(param,'contractSplitReport')
    }
    // 发票明细表
    if(statement==='outcomeDetailReport'){
      let param = {}
      param.projectNo = params.projectNo
      param.billingDateStart = params.billingDate && params.billingDate.length ? params.billingDate[0].format(dateFormat) : ''
      param.billingDateEnd = params.billingDate && params.billingDate.length ? params.billingDate[1].format(dateFormat) : ''
      param.contractName = params.contractName
      param.invoiceNumber = params.invoiceNumber
      param.contractNo = params.contractNo
      param.contractName = params.contractName
      param.custName = params.custName
      param.signCompany = params.signCompany

      this.setState({
        param
      })
      this.props.queryParms(param,'outcomeDetailReport')
    }

    // 发票汇总表
    if(statement==='outcomeTotalReport'){
      let param = {}
      param.projectNo = params.projectNo
      param.projectDept = params.projectDept
      param.projectBu = params.projectBu ? params.projectBu[0] : ''
      param.billingMonth = params.billingMonth.format("YYYY-MM")
      this.setState({
        param
      })
      this.props.queryParms(param,'outcomeTotalReport')
    }
    // 未大签提前开票数据补充表
    if(statement==='unContractOutcomeDataAdd'){
      let param = {}
      param.billingDateStart = params.billingDate && params.billingDate.length ? params.billingDate[0].format(dateFormat) : ''
      param.billingDateEnd = params.billingDate && params.billingDate.length ? params.billingDate[1].format(dateFormat) : ''
      param.projectNo = params.projectNo
      param.contractNo = params.contractNo
      param.contractName = params.contractName
      param.custName = params.custName
      param.invoiceNumber = params.invoiceNumber
      param.signCompany = params.signCompany

      this.setState({
        param
      })
      this.props.queryParms(param,'unContractOutcomeDataAdd')
    }
    // 项目Order明细表
    if(statement==='projectOrderDetailReport'){
      let param = {}
      param.signDateStart = params.signDate && params.signDate.length ? params.signDate[0].format(dateFormat) : ''
      param.signDateEnd = params.signDate && params.signDate.length ? params.signDate[1].format(dateFormat) : ''
      param.projectNo = params.projectNo
      param.contractNo = params.contractNo
      param.contractName = params.contractName
      param.signCompany = params.signCompany
      param.salesBu = params.salesBu && params.salesBu.length ? params.salesBu[0] : ''
      param.projectBu = params.projectBu && params.projectBu.length ? params.projectBu[0] : ''
      param.projectManager = params.projectManager && params.projectManager.length ? params.projectManager[0] : ''
      param.currency = params.currency1
      this.setState({
        param
      })
      this.props.queryParms(param,'projectOrderDetailReport')
    }
    // 项目Order汇总表
    if(statement==='projectOrderTotalReport'){
      let param = {}
      param.startTime = params.signDate && params.signDate.length ? params.signDate[0].format(dateFormat) : ''
      param.endTime = params.signDate && params.signDate.length ? params.signDate[1].format(dateFormat) : ''

      param.signCompany = params.signCompany
      param.buType = params.buType

      param.bu = params.bu && params.bu.length ? params.bu[0] : ''

      this.setState({
        param
      })
      this.props.queryParms(param,'projectOrderTotalReport')
    }
    // 整体合同内容查询
    if (statement === 'contractInfoReport') {
      let param = {}
      param.signDateStart = params.signDate && params.signDate.length ? params.signDate[0].format(dateFormat) : ''
      param.signDateEnd = params.signDate && params.signDate.length ? params.signDate[1].format(dateFormat) : ''
      param.region = params.region && params.region.lenght ? params.region[0] : ''
      param.projectNo = params.projectNo
      param.salesManager = params.salesManager
      param.contractNo = params.contractNo
      param.contractName = params.contractName
      param.projectManager = params.projectManager && params.projectManager.length ? params.projectManager[0] : ''
      param.projectBu = params.projectBu && params.projectBu.length ? params.projectBu[0] : ''

      this.setState({
        param
      })
      this.props.queryParms(param,'contractInfoReport')
    }

    // 项目综合信息查询报表
    if (statement === 'projectInfoReport') {
      let param = {}

      param.projectNo = params.projectNo
      param.custName = params.custName
      param.billingDateStart = params.billingDate && params.billingDate.length ? params.billingDate[0].format(dateFormat) : ''
      param.billingDateEnd = params.billingDate && params.billingDate.length ? params.billingDate[1].format(dateFormat) : ''
      param.currency = params.currency
      param.contractName = params.contractName
      param.contractNo = params.contractNo
      this.setState({
        param
      })
      this.props.queryParms(param,'projectInfoReport')
    }

    // 发票信息查询表
    if (statement === 'outcomeInfoReport') {
      let param = {}
      param.projectNo = params.projectNo
      param.custName = params.custName
      param.billingDateStart = params.billingDate && params.billingDate.length ? params.billingDate[0].format(dateFormat) : ''
      param.billingDateEnd = params.billingDate && params.billingDate.length ? params.billingDate[1].format(dateFormat) : ''
      param.currency = params.currency
      param.signCompany = params.signCompany
      param.invoiceNumber = params.invoiceNumber
      param.billingAmountMin = params.billingAmountMin
      param.billingAmountMax = params.billingAmountMax
      param.paymentName = params.paymentName
      param.contractNo = params.contractNo
      param.contractName = params.contractName
      this.setState({
        param
      })
      this.props.queryParms(param,'outcomeInfoReport')
    }

    // 应收账款询证函报表
    if (statement === 'receiptAccountReport') {
      let param = {}
      param.projectNo = params.projectNo
      param.contarctNo = params.contarctNo
      param.signCompany = params.signCompany
      param.contarctName = params.contarctName
      param.deadline = params.deadline
      param.custName = params.custName

      this.setState({
        param
      })
      this.props.queryParms(param,'receiptAccountReport')
    }

    // 整体合同内容查询表
    if (statement === 'contractInfoReport') {
      let param = {}
      param.projectNo = params.projectNo
      param.contarctNo = params.contarctNo
      param.signDateStart = params.contractName
      param.signDateEnd = params.signDate && params.signDate.length ? params.signDate[0].format(dateFormat) : ''
      param.endTime = params.signDate && params.signDate.length ? params.signDate[1].format(dateFormat) : ''
      param.projectBu = params.projectBu
      param.region = params.region
      param.salesManager = params.salesManager
      param.personId = params.projectManager && params.projectManager.length ? params.projectManager[0] : ''
      this.setState({
        param
      })
      this.props.queryParms(param,'contractInfoReport')
    }
    //this.props.form.resetFields()
  }

  // 根据value来展示不用的表单查询
  handleRadioChange = (e) => {
    // 如果切换了表，则清空查询数据
    this.props.form.resetFields()
    this.setState({
      stateType:e.target.value,
    })
    this.props.showCols(e.target.value)
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const formItemLayout = {
      labelCol: { span: 2 },
      wrapperCol: { span: 22 },
    }
    const formItemLayoutChild = {
      labelCol: { span: 7 },
      wrapperCol: { span: 17 },
    }
    return (
      <div>
        <Form
          className="ant-search-form"
        >
          <Row gutter={40}>
            <Col span={24} key={1}>
              <FormItem {...formItemLayout} label="报表类型">
                {getFieldDecorator('statementType', {
                  initialValue: this.props.currencyType,
                })(
                  <SelectRadioApi
                    reportType={this.props.reportType}
                    typeCode="STATEMENT"
                    paramCode="APPLY_TYPE"
                    onChange={(e)=>this.handleRadioChange(e)}
                    options=''
                    selected = {this.state.stateType}
                  />
                )}
              </FormItem>
            </Col>
          </Row>
          {/*
          收款信息查询表
          start-------------------
          */}
          <div style={{ display: this.state.stateType === 'receiptInfoReport' ? 'block' : 'none' }}>
            <Row gutter={40}>
              <Col span={8}>
                <FormItem {...formItemLayoutChild} label="项目编码">
                  {
                    getFieldDecorator('projectNo')(
                      <Input
                        placeholder="项目编码"
                      />,
                    )
                  }
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem {...formItemLayoutChild} label="客户名称">
                  {getFieldDecorator('custName')(
                    <Input />,
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem {...formItemLayoutChild} label="收款日期">
                  {getFieldDecorator('receiptDate', {
                    //initialValue: [moment('2017-08-01'), moment()],
                  })(<RangePicker
                    allowClear
                    format={dateFormat}
                    ranges={{ 今天: [moment(), moment()], 当月: [moment().startOf('month'), moment().endOf('month')] }}
                  />)}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={40}>
              <Col span={8}>
                <FormItem {...formItemLayoutChild} label="币种">
                  {getFieldDecorator('currency',{
                  })(
                    <SelectCurrent hasAll />
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <Row>
                  <Col span={14}>
                    <FormItem {...formItemLayout} label="收款金额" labelCol={{ span: 10 }} wrapperCol={{ span: 14 }}>
                      {getFieldDecorator('claimAmountMin')(<Input />)}
                    </FormItem>
                  </Col>
                  <Col span={2}><div style={{ textAlign: 'center' }}>～</div></Col>
                  <Col span={8}>
                    <FormItem {...formItemLayout} wrapperCol={{ span: 24 }}>
                      {getFieldDecorator('claimAmountMax')(<Input />)}
                    </FormItem>
                  </Col>
                </Row>
              </Col>
              <Col span={8}>
                <FormItem {...formItemLayoutChild} label="收款编码">
                  {getFieldDecorator('receiptNo')(
                    <Input
                      placeholder="请输入收款编码"
                    />,
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={40}>
              <Col span={8}>
                <FormItem {...formItemLayoutChild} label="签约公司">
                  {getFieldDecorator('signCompany')(
                    <Input
                      placeholder="请输入签约公司"
                    />,
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem {...formItemLayoutChild} label="付款条款">
                  {getFieldDecorator('paymentName')(
                    <Input
                      placeholder="请输入付款条款"
                    />,
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem {...formItemLayoutChild} label="合同名称">
                  {getFieldDecorator('contractName')(
                    <Input
                      placeholder="请输入合同名称"
                    />,
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={40}>
              <Col span={8}>
                <FormItem {...formItemLayoutChild} label="合同编码">
                  {
                    getFieldDecorator('contractNo')(
                      <Input
                        placeholder="合同编码"
                      />,
                    )
                  }
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem {...formItemLayoutChild} label="数据状态">
                  {getFieldDecorator('status',{
                    initialValue: '',
                  })(
                    <Select>
                      <Option value="">全部</Option>
                      <Option value="51">已经传送AR</Option>
                      <Option value="60">暂挂</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem {...formItemLayoutChild} label="GL日期">
                  {getFieldDecorator('glDate', {
                    //initialValue: [moment('2017-08-01'), moment()],
                  })(<RangePicker
                    allowClear
                    format={dateFormat}
                    ranges={{ 今天: [moment(), moment()], 当月: [moment().startOf('month'), moment().endOf('month')] }}
                  />)}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={40}>
              <Col span={24} style={{ textAlign: 'right' }}>
                <Button type="primary" key="search" onClick={()=>this.queryParms('receiptInfoReport')}><Icon type="search" />查询</Button>
                <Button style={{marginLeft:'10px'}} type="primary" loading={this.state.excelDis} onClick={()=>this.excel('receipt_claim')}>导出EXCEL</Button>
              </Col>
            </Row>
          </div>
          {/*
           收款信息查询表
           end-------------------
           */}
          {/*
           发票信息查询表
           start-------------------
           */}
          <div style={{ display: this.state.stateType === 'outcomeInfoReport' ? 'block' : 'none' }}>
            <Row gutter={40}>
              <Col span={8}>
                <FormItem {...formItemLayoutChild} label="项目编码">
                  {
                    getFieldDecorator('projectNo')(
                      <Input
                        placeholder="项目编码"
                      />,
                    )
                  }
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem {...formItemLayoutChild} label="客户名称">
                  {getFieldDecorator('custName')(
                    <Input />,
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem {...formItemLayoutChild} label="开票日期">
                  {getFieldDecorator('billingDate', {
                    //initialValue: [moment('2017-08-01'), moment()],
                  })(<RangePicker
                    allowClear
                    format={dateFormat}
                    ranges={{ 今天: [moment(), moment()], 当月: [moment().startOf('month'), moment().endOf('month')] }}
                  />)}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={40}>
              <Col span={8}>
                <FormItem {...formItemLayoutChild} label="币种">
                  {getFieldDecorator('currency',{
                  })(
                    <SelectCurrent hasAll />
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <Row>
                  <Col span={14}>
                    <FormItem {...formItemLayout} label="开票金额" labelCol={{ span: 10 }} wrapperCol={{ span: 14 }}>
                      {getFieldDecorator('billingAmountMin')(<Input />)}
                    </FormItem>
                  </Col>
                  <Col span={2}><div style={{ textAlign: 'center' }}>～</div></Col>
                  <Col span={8}>
                    <FormItem {...formItemLayout} wrapperCol={{ span: 24 }}>
                      {getFieldDecorator('billingAmountMax')(<Input />)}
                    </FormItem>
                  </Col>
                </Row>
              </Col>
              <Col span={8}>
                <FormItem {...formItemLayoutChild} label="发票号">
                  {getFieldDecorator('invoiceNumber')(
                    <Input
                      placeholder="请输入发票号"
                    />,
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={40}>
              <Col span={8}>
                <FormItem {...formItemLayoutChild} label="签约公司">
                  {getFieldDecorator('signCompany')(
                    <Input
                      placeholder="请输入签约公司"
                    />,
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem {...formItemLayoutChild} label="付款条款">
                  {getFieldDecorator('paymentName')(
                    <Input
                      placeholder="请输入付款条款"
                    />,
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem {...formItemLayoutChild} label="合同名称">
                  {getFieldDecorator('contractName')(
                    <Input
                      placeholder="请输入合同名称"
                    />,
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={40}>
              <Col span={8}>
                <FormItem {...formItemLayoutChild} label="合同编码">
                  {
                    getFieldDecorator('contractNo')(
                      <Input
                        placeholder="合同编码"
                      />,
                    )
                  }
                </FormItem>
              </Col>
              <Col span={16} style={{ textAlign: 'right' }}>
                <Button type="primary" key="search" onClick={()=>this.queryParms('outcomeInfoReport')}><Icon type="search" />查询</Button>
                <Button style={{marginLeft:'10px'}} type="primary" loading={this.state.excelDis} onClick={()=>this.excel('outcomeInfoReport')}>导出EXCEL</Button>
              </Col>
            </Row>
          </div>
          {/*
           发票信息查询表
           end-------------------
           */}
          {/*
           发票及收款信息查询表
           start-------------------
           */}
          <div style={{ display: this.state.stateType === 'outcomeReceiptInfoReport' ? 'block' : 'none' }}>
            <Row gutter={40}>
              <Col span={8}>
                <FormItem {...formItemLayoutChild} label="项目编码">
                  {
                    getFieldDecorator('projectNo')(
                      <MultipleInput
                        placeholder="项目编码"
                      />,
                    )
                  }
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem {...formItemLayoutChild} label="客户名称">
                  {getFieldDecorator('custId')(
                    <Input />,
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem {...formItemLayoutChild} label="收款截止日期">
                  {getFieldDecorator('billedDate', {
                    //initialValue: moment(),
                  })(
                    <DatePicker
                      format={dateFormat}
                    />,
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={40}>
              <Col span={8}>
                <FormItem {...formItemLayoutChild} label="签约公司">
                  {getFieldDecorator('signCompany')(
                    <Input
                      placeholder="请输入签约公司"
                    />,
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem {...formItemLayoutChild} label="合同名称">
                  {getFieldDecorator('contractName')(
                    <Input
                      placeholder="请输入合同名称"
                    />,
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem {...formItemLayoutChild} label="合同编码">
                  {
                    getFieldDecorator('contractNo')(
                      <Input
                        placeholder="合同编码"
                      />,
                    )
                  }
                </FormItem>
              </Col>
            </Row>
            <Row gutter={40}>
              <Col span={24} style={{ textAlign: 'right' }}>
                <Button type="primary" key="search" onClick={()=>this.queryParms('outcomeInfoReport')}><Icon type="search" />查询</Button>
                <Button type="primary" style={{marginLeft: '10px'}} loading={this.state.excelDis} onClick={()=>this.excel('outcomeInfoReport')}>导出EXCEL</Button>
              </Col>
            </Row>
          </div>
          {/*
           发票及收款信息查询表
           end-------------------
           */}
          {/*
           应收账款询证函报表
           start-------------------
           */}
          <div style={{ display: this.state.stateType === 'receiptAccountReport' ? 'block' : 'none' }}>
            <Row gutter={40}>
              <Col span={8}>
                <FormItem {...formItemLayoutChild} label="项目编码">
                  {
                    getFieldDecorator('projectNo')(
                      <Input
                        placeholder="项目编码"
                      />,
                    )
                  }
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem {...formItemLayoutChild} label="客户名称">
                  {getFieldDecorator('custName')(
                    <Input />,
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem {...formItemLayoutChild} label="收款截止日期">
                  {getFieldDecorator('deadline', {
                    //initialValue: moment(),
                  })(
                    <DatePicker
                      format={dateFormat}
                    />,
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={40}>
              <Col span={8}>
                <FormItem {...formItemLayoutChild} label="签约公司">
                  {getFieldDecorator('signCompany')(
                    <Input
                      placeholder="请输入签约公司"
                    />,
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem {...formItemLayoutChild} label="合同名称">
                  {getFieldDecorator('contractName')(
                    <Input
                      placeholder="请输入合同名称"
                    />,
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem {...formItemLayoutChild} label="合同编码">
                  {
                    getFieldDecorator('contractNo')(
                      <MultipleInput
                        placeholder="合同编码"
                      />,
                    )
                  }
                </FormItem>
              </Col>
            </Row>
            <Row gutter={40}>
              <Col span={24} style={{ textAlign: 'right' }}>
                <Button type="primary" key="search" onClick={()=>this.queryParms('receiptAccountReport')}><Icon type="search" />查询</Button>
                <Button style={{marginLeft:'10px'}} type="primary" loading={this.state.excelDis} onClick={()=>this.excel('receiptAccountReport')}>导出EXCEL</Button>
              </Col>
            </Row>
          </div>
          {/*
           应收账款询证函报表
           end-------------------
           */}
          {/*
           项目综合信息查询报表
           start-------------------
           */}
          <div style={{ display: this.state.stateType === 'projectInfoReport' ? 'block' : 'none' }}>
            <Row gutter={40}>
              <Col span={8}>
                <FormItem {...formItemLayoutChild} label="项目编码">
                  {
                    getFieldDecorator('projectNo')(
                      <Input
                        placeholder="项目编码"
                      />,
                    )
                  }
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem {...formItemLayoutChild} label="客户名称">
                  {getFieldDecorator('custName')(
                    <Input />,
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem {...formItemLayoutChild} label="币种">
                  {getFieldDecorator('currency',{
                  })(
                    <SelectCurrent hasAll />
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={40}>
              <Col span={8}>
                <FormItem {...formItemLayoutChild} label="合同名称">
                  {getFieldDecorator('contractName')(
                    <Input
                      placeholder="请输入合同名称"
                    />,
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem {...formItemLayoutChild} label="合同编码">
                  {
                    getFieldDecorator('contractNo')(
                      <Input
                        placeholder="合同编码"
                      />,
                    )
                  }
                </FormItem>
              </Col>
              <Col span={8} style={{ textAlign: 'right' }}>
                <Button type="primary" key="search" onClick={()=>this.queryParms('projectInfoReport')}><Icon type="search" />查询</Button>
                <Button style={{marginLeft:'10px'}} type="primary" loading={this.state.excelDis} onClick={()=>this.excel('projectInfoReport')}>导出EXCEL</Button>
              </Col>
            </Row>
          </div>
          {/*
           项目综合信息查询报表
           end-------------------
           */}
          {/*
           整体合同内容查询
           start-------------------
           */}
          <div style={{ display: this.state.stateType === 'contractInfoReport' ? 'block' : 'none' }}>
            <Row gutter={40}>
              <Col span={8}>
                <FormItem {...formItemLayoutChild} label="项目编码">
                  {
                    getFieldDecorator('projectNo')(
                      <Input
                        placeholder="项目编码"
                      />,
                    )
                  }
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem {...formItemLayoutChild} label="合同编码">
                  {
                    getFieldDecorator('contractNo')(
                      <Input
                        placeholder="合同编码"
                      />,
                    )
                  }
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem {...formItemLayoutChild} label="合同名称">
                  {getFieldDecorator('contractName')(
                    <Input
                      placeholder="请输入合同名称"
                    />,
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={40}>
              <Col span={8}>
                <FormItem {...formItemLayoutChild} label="签约日期">
                  {getFieldDecorator('signDate', {
                    //initialValue: [moment('2017-08-01'), moment()],
                  })(<RangePicker
                    allowClear
                    format={dateFormat}
                    ranges={{ 今天: [moment(), moment()], 当月: [moment().startOf('month'), moment().endOf('month')] }}
                  />)}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem {...formItemLayoutChild} label="立项部门">
                  {
                    getFieldDecorator('projectBu')(<SelectSbu keyName="contract"/>)
                  }
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem {...formItemLayoutChild} label="立项区域">
                  {
                    getFieldDecorator('region')(<SelectSbu keyName="contract"/>)
                  }
                </FormItem>
              </Col>
            </Row>
            <Row gutter={40}>
              <Col span={8}>
                <FormItem {...formItemLayoutChild} label="销售经理">
                  {
                    getFieldDecorator('salesManager')(<Input />)
                  }
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem {...formItemLayoutChild} label="项目经理">
                  {
                    getFieldDecorator('projectManager')(
                      <StaffInfo />
                    )
                  }
                </FormItem>
              </Col>
              <Col span={8} style={{ textAlign: 'right' }}>
                <Button type="primary" key="search" onClick={()=>this.queryParms('contractInfoReport')}><Icon type="search" />查询</Button>
                <Button style={{marginLeft:'10px'}} type="primary" loading={this.state.excelDis} onClick={()=>this.excel('contractInfoReport')}>导出EXCEL</Button>

              </Col>
            </Row>
          </div>
          {/*
           整体合同内容查询
           end-------------------
           */}
          {/*
           转包项目表
           start-------------------
           */}
          <div style={{ display: this.state.stateType === 'outProjectInfoReport' ? 'block' : 'none' }}>
            <Row gutter={40}>
              <Col span={8}>
                <FormItem {...formItemLayoutChild} label="项目编码">
                  {
                    getFieldDecorator('projectNo')(
                      <Input
                        placeholder="项目编码"
                      />,
                    )
                  }
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem {...formItemLayoutChild} label="截止日期">
                  {getFieldDecorator('billedDate', {
                    //initialValue: moment(),
                  })(
                    <DatePicker
                      format={dateFormat}
                    />,
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem {...formItemLayoutChild} label="合同名称">
                  {getFieldDecorator('contractName')(
                    <Input
                      placeholder="请输入合同名称"
                    />,
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={40}>
              <Col span={8}>
                <FormItem {...formItemLayoutChild} label="合同编码">
                  {
                    getFieldDecorator('contractNo')(
                      <Input
                        placeholder="合同编码"
                      />,
                    )
                  }
                </FormItem>
              </Col>
              <Col span={16} style={{ textAlign: 'right' }}>
                <Button type="primary" key="search" onClick={this.queryParms}><Icon type="search" />查询</Button>
              </Col>
            </Row>
          </div>
          {/*
           转包项目表
           end-------------------
           */}
          {/*
           合同拆分查询表
           start-------------------
           */}
          <div style={{ display: this.state.stateType === 'contractSplitReport' ? 'block' : 'none' }}>
            <Row gutter={40}>
              <Col span={8}>
                <FormItem {...formItemLayoutChild} label="项目编码">
                  {
                    getFieldDecorator('projectNo')(
                      <Input
                        placeholder="项目编码"
                      />,
                    )
                  }
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem {...formItemLayoutChild} label="合同编码">
                  {
                    getFieldDecorator('contractNo')(
                      <Input
                        placeholder="合同编码"
                      />,
                    )
                  }
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem {...formItemLayoutChild} label="合同名称">
                  {getFieldDecorator('contractName')(
                    <Input
                      placeholder="请输入合同名称"
                    />,
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={40}>
              <Col span={8}>
                <FormItem {...formItemLayoutChild} label="签约日期">
                  {getFieldDecorator('signDate', {
                    //initialValue: [moment('2017-08-01'), moment()],
                  })(<RangePicker
                    allowClear
                    format={dateFormat}
                    ranges={{ 今天: [moment(), moment()], 当月: [moment().startOf('month'), moment().endOf('month')] }}
                  />)}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem {...formItemLayoutChild} label="立项BU">
                  {
                    getFieldDecorator('buId')(<SelectSbu keyName="contract"/>)
                  }
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem {...formItemLayoutChild} label="是否采集项目">
                  {
                    getFieldDecorator('collectionProject',{
                      initialValue:'ALL'
                    })(
                      <Select>
                        <Option value="ALL">全部</Option>
                        <Option value="Y">是</Option>
                        <Option value="N">否</Option>
                      </Select>
                    )
                  }
                </FormItem>
              </Col>
            </Row>
              <Row gutter={40}>
                <Col span={8}>
                  <FormItem {...formItemLayoutChild} label="是否拆分">
                    {
                      getFieldDecorator('isProdect',{
                        initialValue:'ALL'
                      })(
                        <Select>
                          <Option value="ALL">全部</Option>
                          <Option value="Y">是</Option>
                          <Option value="N">否</Option>
                        </Select>
                      )
                    }
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem {...formItemLayoutChild} label="签约公司">
                    {getFieldDecorator('signCompany')(
                      <Input
                        placeholder="请输入签约公司"
                      />,
                    )}
                  </FormItem>
                </Col>
                <Col span={8} style={{ textAlign: 'right' }}>
                  <Button type="primary" key="search" onClick={()=>this.queryParms('contractSplitReport')}><Icon type="search" />查询</Button>
                  <Button style={{marginLeft:'10px'}} type="primary" loading={this.state.excelDis} onClick={()=>this.excel('split')}>导出Excel</Button>
                  </Col>
              </Row>

          </div>
          {/*
           合同拆分查询表
           end-------------------
           */}
           {/*发票明细表*/}
          <div style={{ display: this.state.stateType === 'outcomeDetailReport' ? 'block' : 'none' }}>
            <Row gutter={40}>
              <Col span={8}>
                <FormItem {...formItemLayoutChild} label="项目编码">
                  {
                    getFieldDecorator('projectNo')(
                      <Input
                        placeholder="项目编码"
                      />,
                    )
                  }
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem {...formItemLayoutChild} label="合同编码">
                  {
                    getFieldDecorator('contractNo')(
                      <Input
                        placeholder="合同编码"
                      />,
                    )
                  }
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem {...formItemLayoutChild} label="合同名称">
                  {getFieldDecorator('contractName')(
                    <Input
                      placeholder="请输入合同名称"
                    />,
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={40}>
              <Col span={8}>
                <FormItem {...formItemLayoutChild} label="客户名称">
                  {getFieldDecorator('custName')(
                    <Input
                      placeholder="请输入客户名称"
                    />,
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem {...formItemLayoutChild} label="开票日期">
                  {getFieldDecorator('billingDate', {
                    //initialValue: [moment('2017-08-01'), moment()],
                  })(<RangePicker
                    allowClear
                    format={dateFormat}
                    ranges={{ 今天: [moment(), moment()], 当月: [moment().startOf('month'), moment().endOf('month')] }}
                  />)}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem {...formItemLayoutChild} label="发票号">
                  {
                    getFieldDecorator('invoiceNumber')(
                      <Input
                      placeholder="请输入发票号"
                    />,)
                  }
                </FormItem>
              </Col>
            </Row>
            <Row gutter={40}>
              <Col span={8}>
                <FormItem {...formItemLayoutChild} label="签约公司">
                  {getFieldDecorator('signCompany')(
                    <Input
                      placeholder="请输入签约公司"
                    />,
                  )}
                </FormItem>
              </Col>
              <Col span={16} style={{ textAlign: 'right' }}>
                <Button type="primary" key="search" onClick={()=>this.queryParms('outcomeDetailReport')}><Icon type="search" />查询</Button>
                <Button style={{marginLeft:'10px'}} type="primary" loading={this.state.excelDis} onClick={()=>this.excel('outcomeDetailReport')}>导出Excel</Button>
              </Col>
            </Row>

          </div>

          {/*发票汇总表*/}
          <div style={{ display: this.state.stateType === 'outcomeTotalReport' ? 'block' : 'none' }}>
            <Row gutter={40}>
              <Col span={8}>
                <FormItem {...formItemLayoutChild} label="项目编码">
                  {
                    getFieldDecorator('projectNo')(
                      <Input
                        placeholder="项目编码"
                      />,
                    )
                  }
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem {...formItemLayoutChild} label="立项部门">
                  {
                    getFieldDecorator('projectDept')(
                      <Input
                        placeholder="立项部门"
                      />,
                    )
                  }
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem {...formItemLayoutChild} label="立项BU">
                  {
                    getFieldDecorator('projectBu')(<SelectSbu keyName="contract"/>)
                  }
                </FormItem>
              </Col>
            </Row>
            <Row gutter={40}>
              <Col span={8}>
                <FormItem {...formItemLayoutChild} label="开票月份">
                  {getFieldDecorator('billingMonth', {
                    initialValue: moment(),
                  })(
                    <MonthPicker
                      format={"YYYY-MM"}
                    />,
                  )}
                </FormItem>
              </Col>
              <Col span={16} style={{ textAlign: 'right' }}>
                <Button type="primary" key="search" onClick={()=>this.queryParms('outcomeTotalReport')}><Icon type="search" />查询</Button>
                <Button style={{marginLeft:'10px'}} type="primary" loading={this.state.excelDis} onClick={()=>this.excel('outcomeTotalReport')}>导出Excel</Button>
              </Col>
            </Row>

          </div>
          {/*未大签提前开票数据补充表*/}
          <div style={{ display: this.state.stateType === 'unContractOutcomeDataAdd' ? 'block' : 'none' }}>
            <Row gutter={40}>
              <Col span={8}>
                <FormItem {...formItemLayoutChild} label="开票日期">
                  {getFieldDecorator('billingDate', {
                    //initialValue: [moment('2017-08-01'), moment()],
                  })(<RangePicker
                    allowClear
                    format={dateFormat}
                    ranges={{ 今天: [moment(), moment()], 当月: [moment().startOf('month'), moment().endOf('month')] }}
                  />)}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem {...formItemLayoutChild} label="项目编码">
                  {
                    getFieldDecorator('projectNo')(
                      <Input
                        placeholder="项目编码"
                      />,
                    )
                  }
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem {...formItemLayoutChild} label="合同编码">
                  {getFieldDecorator('contractNo')(
                    <Input
                      placeholder="请输入合同编码"
                    />,
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={40}>
              <Col span={8}>
                <FormItem {...formItemLayoutChild} label="合同名称">
                  {
                    getFieldDecorator('contractName')(
                      <Input
                        placeholder="合同名称"
                      />,
                    )
                  }
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem {...formItemLayoutChild} label="客户名称">
                  {
                    getFieldDecorator('custName')(
                      <Input
                        placeholder="客户名称"
                      />,
                    )
                  }
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem {...formItemLayoutChild} label="发票号">
                  {getFieldDecorator('invoiceNumber')(
                    <Input
                      placeholder="发票号"
                    />,
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={40}>
              <Col span={8}>
                <FormItem {...formItemLayoutChild} label="签约公司">
                  {
                    getFieldDecorator('signCompany')(
                      <Input
                        placeholder="签约公司"
                      />,
                    )
                  }
                </FormItem>
              </Col>
              <Col span={16} style={{ textAlign: 'right' }}>
                <Button type="primary" key="search" onClick={()=>this.queryParms('unContractOutcomeDataAdd')}><Icon type="search" />查询</Button>
                <Button style={{marginLeft:'10px'}} type="primary" loading={this.state.excelDis} onClick={()=>this.excel('unContractOutcomeDataAdd')}>导出Excel</Button>
              </Col>
            </Row>

          </div>
          {/*项目Order明细表*/}
          <div style={{ display: this.state.stateType === 'projectOrderDetailReport' ? 'block' : 'none' }}>
            <Row gutter={40}>
              <Col span={8}>
                <FormItem {...formItemLayoutChild} label="签约日期">
                  {getFieldDecorator('signDate', {
                    //initialValue: [moment('2017-08-01'), moment()],
                  })(<RangePicker
                    allowClear
                    format={dateFormat}
                    ranges={{ 今天: [moment(), moment()], 当月: [moment().startOf('month'), moment().endOf('month')] }}
                  />)}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem {...formItemLayoutChild} label="项目编码">
                  {
                    getFieldDecorator('projectNo')(
                      <Input
                        placeholder="项目编码"
                      />,
                    )
                  }
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem {...formItemLayoutChild} label="签约公司">
                  {getFieldDecorator('signCompany')(
                    <Input
                      placeholder="签约公司"
                    />,
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={40}>
              <Col span={8}>
                <FormItem {...formItemLayoutChild} label="Sales签约BU">
                  {
                    getFieldDecorator('salesBu')(<SelectSbu keyName="contract"/>)
                  }
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem {...formItemLayoutChild} label="合同名称">
                  {
                    getFieldDecorator('contractName')(
                      <Input
                        placeholder="合同名称"
                      />,
                    )
                  }
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem {...formItemLayoutChild} label="立项BU">
                  {
                    getFieldDecorator('projectBu')(<SelectSbu keyName="contract"/>)
                  }
                </FormItem>
              </Col>
            </Row>
            <Row gutter={40}>
              <Col span={8}>
                <FormItem {...formItemLayoutChild} label="合同编码">
                  {
                    getFieldDecorator('contractNo')(
                      <Input
                        placeholder="合同编码"
                      />,
                    )
                  }
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem {...formItemLayoutChild} label="项目经理">
                  {
                    getFieldDecorator('projectManager')(
                      <StaffInfo />
                    )
                  }
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem {...formItemLayoutChild} label="币种">
                  {getFieldDecorator('currency1',{
                    initialValue: 'ORIGINAL',
                  })(
                    <Select>
                      <Option value=''>全部</Option>
                      <Option value='ORIGINAL'>原币</Option>
                      <Option value='USD'>美元</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={40}>

              <Col span={24} style={{ textAlign: 'right' }}>
                <Button type="primary" key="search" onClick={()=>this.queryParms('projectOrderDetailReport')}><Icon type="search" />查询</Button>
                <Button style={{marginLeft:'10px'}} type="primary" loading={this.state.excelDis} onClick={()=>this.excel('order')}>导出Excel</Button>
              </Col>
            </Row>

          </div>

          {/*项目Order汇总表*/}
          <div style={{ display: this.state.stateType === 'projectOrderTotalReport' ? 'block' : 'none' }}>
            <Row gutter={40}>
              <Col span={8}>
                <FormItem {...formItemLayoutChild} label="日期">
                  {getFieldDecorator('signDate', {
                    //initialValue: [moment('2017-08-01'), moment()],
                  })(<RangePicker
                    allowClear
                    format={dateFormat}
                    ranges={{ 今天: [moment(), moment()], 当月: [moment().startOf('month'), moment().endOf('month')] }}
                  />)}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem {...formItemLayoutChild} label="BU类型">
                  {getFieldDecorator('buType',{
                    initialValue: 'PROJECT',
                  })(
                    <Select>
                      <Option value="PROJECT">立项BU</Option>
                      <Option value="SALES">销售BU</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem {...formItemLayoutChild} label="BU">
                  {
                    getFieldDecorator('bu')(<SelectSbu keyName="contract"/>)
                  }
                </FormItem>
              </Col>
            </Row>
            <Row gutter={40}>
              <Col span={8}>
                <FormItem {...formItemLayoutChild} label="签约公司">
                  {getFieldDecorator('signCompany')(
                    <Input
                      placeholder="签约公司"
                    />,
                  )}
                </FormItem>
              </Col>
              <Col span={16} style={{ textAlign: 'right' }}>
                <Button type="primary" key="search" onClick={()=>this.queryParms('projectOrderTotalReport')}><Icon type="search" />查询</Button>
                <Button style={{marginLeft:'10px'}} loading={this.state.excelDis} type="primary" onClick={()=>this.excel('summarize')}>导出Excel</Button>
              </Col>
            </Row>

          </div>
        </Form>
      </div>
    )
  }
}
StatementListCom.propTypes = {
  form: PropTypes.shape({
    getFieldDecorator: PropTypes.func.isRequired,
    getFieldsValue: PropTypes.func.isRequired,
  }).isRequired,
}
const StatementListComWithForm = Form.create()(StatementListCom)

export default StatementListComWithForm
