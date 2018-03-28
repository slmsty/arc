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
import SelectCustomerWithForm from '../common/selectCustomer'

const FormItem = Form.Item
const RadioButton = Radio.Button
const RadioGroup = Radio.Group
const dateFormat = 'YYYY-MM-DD'
const { RangePicker } = DatePicker
const Option = Select.Option;
const testoptions = [
  {
    paramCode: "APPLY_TYPE",
    paramValue: "100",
    paramValueDesc: "收款信息查询表",
    primaryKey: "WORK_FLOW.APPLY_TYPE",
    typeCode: "WORK_FLOW",
  },
  {
    paramCode: "APPLY_TYPE",
    paramValue: "1001",
    paramValueDesc: "发票信息查询表",
    primaryKey: "WORK_FLOW.APPLY_TYPE",
    typeCode: "WORK_FLOW",
  },
  {
    paramCode: "APPLY_TYPE",
    paramValue: "1002",
    paramValueDesc: "发票及收款信息查询表",
    primaryKey: "WORK_FLOW.APPLY_TYPE",
    typeCode: "WORK_FLOW",
  },
  {
    paramCode: "APPLY_TYPE",
    paramValue: "1003",
    paramValueDesc: "应收账款询证函报表",
    primaryKey: "WORK_FLOW.APPLY_TYPE",
    typeCode: "WORK_FLOW",
  },
  {
    paramCode: "APPLY_TYPE",
    paramValue: "1004",
    paramValueDesc: "项目综合信息查询报表",
    primaryKey: "WORK_FLOW.APPLY_TYPE",
    typeCode: "WORK_FLOW",
  },
  {
    paramCode: "APPLY_TYPE",
    paramValue: "1005",
    paramValueDesc: "整体合同内容查询",
    primaryKey: "WORK_FLOW.APPLY_TYPE",
    typeCode: "WORK_FLOW",
  },
  {
    paramCode: "APPLY_TYPE",
    paramValue: "1006",
    paramValueDesc: "转包项目表",
    primaryKey: "WORK_FLOW.APPLY_TYPE",
    typeCode: "WORK_FLOW",
  },
  {
    paramCode: "APPLY_TYPE",
    paramValue: "1007",
    paramValueDesc: "合同拆分查询表",
    primaryKey: "WORK_FLOW.APPLY_TYPE",
    typeCode: "WORK_FLOW",
  },
]
class StatementListCom extends React.Component {
  state = {
    infoVisitable: false,
    loading: false,
    applyData: '',
    stateType: 'receiptInfoReport',
  }
  excel = (type)=>{
    this.props.excel()
  }
  // 查询接口
  queryParms = (statement) => {
    const params = this.props.form.getFieldsValue()
    const param = {}
      //收款信息查询表
    if(statement ==='receipt_claim'){
      param.projectNo = params.projectNo
      param.contractNo = params.contractNo
      param.signDateStart = params.receiptDate && params.receiptDate.length ? params.receiptDate[0].format(dateFormat) : ''
      param.receiptDateEnd = params.receiptDate && params.receiptDate.length ? params.receiptDate[1].format(dateFormat) : ''
      param.receiptCurrency = params.receiptCurrency
      param.claimAmountMin = params.claimAmountMin
      param.claimAmountMax = params.claimAmountMax
      param.signCompany = params.signCompany
      param.paymentName = params.paymentName
      param.contractName = params.contractName
      param.isReport = 'Y'
      param.pageInfo =  {
        pageNo: 1,
        pageSize: 10,
      },
      this.props.queryParms(param,'receipt_claim')
    }
    //合同拆分查询表
    if(statement==='contract_search'){
      param.projectNo = params.projectNo
      param.custName = params.custName ? params.custName[1] : ''
      param.signDateStart = params.signDate && params.signDate.length ? params.signDate[0].format(dateFormat) : ''
      param.signDateEnd = params.signDate && params.signDate.length ? params.signDate[1].format(dateFormat) : ''
      param.contractName = params.contractName
      param.buId = params.buId
      param.collectionProject = params.collectionProject
      param.isOrderList = params.isOrderList
      param.companyId = params.companyId
      param.contractNo = params.contractNo
      param.isReport = 'Y'
      param.pageInfo =  {
        pageNo: 1,
          pageSize: 10,
      },
      this.props.queryParms(param,'contract_search')
    }
    this.props.form.resetFields()

  }
  // 根据value来展示不用的表单查询
  handleRadioChange = (e) => {
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
                      <MultipleInput
                        placeholder="项目编码"
                      />,
                    )
                  }
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem {...formItemLayoutChild} label="客户名称">
                  {getFieldDecorator('custName')(
                    <SelectCustomerWithForm />,
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
                  {getFieldDecorator('receiptCurrency')(
                    <Select>
                      <Option value="USD">USD</Option>
                      <Option value="CNY">CNY</Option>
                    </Select>
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
                <FormItem {...formItemLayoutChild} label="合同编码(多)">
                  {
                    getFieldDecorator('contractNo')(
                      <MultipleInput
                        placeholder="多合同编码使用英文逗号间隔"
                      />,
                    )
                  }
                </FormItem>
              </Col>
              <Col span={16} style={{ textAlign: 'right' }}>
                <Button type="primary" key="search" onClick={()=>this.queryParms('receipt_claim')}><Icon type="search" />查询</Button>
                {/*<Button type="primary" key="search1" onClick={()=>this.excel('receipt_claim')}><Icon type="search" />导出EXCEL</Button>*/}
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
                    <SelectCustomerWithForm />,
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem {...formItemLayoutChild} label="开票日期">
                  {getFieldDecorator('billedDate', {
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
                  {getFieldDecorator('receiptCurrency')(
                    <Select>
                      <Option value="USD">USD</Option>
                      <Option value="CNY">CNY</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <Row>
                  <Col span={14}>
                    <FormItem {...formItemLayout} label="收款金额" labelCol={{ span: 10 }} wrapperCol={{ span: 14 }}>
                      {getFieldDecorator('receiptAmountFrom')(<Input />)}
                    </FormItem>
                  </Col>
                  <Col span={2}><div style={{ textAlign: 'center' }}>～</div></Col>
                  <Col span={8}>
                    <FormItem {...formItemLayout} wrapperCol={{ span: 24 }}>
                      {getFieldDecorator('receiptAmountTo')(<Input />)}
                    </FormItem>
                  </Col>
                </Row>
              </Col>
              <Col span={8}>
                <FormItem {...formItemLayoutChild} label="发票号">
                  {getFieldDecorator('billedId')(
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
                <FormItem {...formItemLayoutChild} label="合同编码(多)">
                  {
                    getFieldDecorator('contractNo')(
                      <MultipleInput
                        placeholder="多合同编码使用英文逗号间隔"
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
                    <SelectCustomerWithForm />,
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
                <FormItem {...formItemLayoutChild} label="合同编码(多)">
                  {
                    getFieldDecorator('contractNo')(
                      <MultipleInput
                        placeholder="多合同编码使用英文逗号间隔"
                      />,
                    )
                  }
                </FormItem>
              </Col>
            </Row>
            <Row gutter={40}>
              <Col span={24} style={{ textAlign: 'right' }}>
                <Button type="primary" key="search" onClick={this.queryParms}><Icon type="search" />查询</Button>
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
                  {getFieldDecorator('custId')(
                    <SelectCustomerWithForm />,
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
                <FormItem {...formItemLayoutChild} label="合同编码(多)">
                  {
                    getFieldDecorator('contractNo')(
                      <MultipleInput
                        placeholder="多合同编码使用英文逗号间隔"
                      />,
                    )
                  }
                </FormItem>
              </Col>
            </Row>
            <Row gutter={40}>
              <Col span={24} style={{ textAlign: 'right' }}>
                <Button type="primary" key="search" onClick={this.queryParms}><Icon type="search" />查询</Button>
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
                  {getFieldDecorator('custId')(
                    <SelectCustomerWithForm />,
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem {...formItemLayoutChild} label="币种">
                  {getFieldDecorator('receiptCurrency')(
                    <Select>
                      <Option value="USD">USD</Option>
                      <Option value="CNY">CNY</Option>
                    </Select>
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
                <FormItem {...formItemLayoutChild} label="合同编码(多)">
                  {
                    getFieldDecorator('contractNo')(
                      <MultipleInput
                        placeholder="多合同编码使用英文逗号间隔"
                      />,
                    )
                  }
                </FormItem>
              </Col>
              <Col span={8} style={{ textAlign: 'right' }}>
                <Button type="primary" key="search" onClick={this.queryParms}><Icon type="search" />查询</Button>
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
                    getFieldDecorator('projectBuNo')(<SelectSbu keyName="contract"/>)
                  }
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem {...formItemLayoutChild} label="立项区域">
                  {
                    getFieldDecorator('projectBuEara')(<SelectSbu keyName="contract"/>)
                  }
                </FormItem>
              </Col>
            </Row>
            <Row gutter={40}>
              <Col span={8}>
                <FormItem {...formItemLayoutChild} label="销售经理">
                  {
                    getFieldDecorator('saleMan')(<Input />)
                  }
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem {...formItemLayoutChild} label="项目经理">
                  {
                    getFieldDecorator('projectMan')(<Input />)
                  }
                </FormItem>
              </Col>
              <Col span={8} style={{ textAlign: 'right' }}>
                <Button type="primary" key="search" onClick={this.queryParms}><Icon type="search" />查询</Button>
                <Button style={{marginLeft:'20px'}} type="primary" onClick={this.queryParms}>导出Excel</Button>
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
                      getFieldDecorator('isOrderList',{
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
                    {getFieldDecorator('companyId')(
                      <Input
                        placeholder="请输入签约公司"
                      />,
                    )}
                  </FormItem>
                </Col>
                <Col span={8} style={{ textAlign: 'right' }}>
                  <Button type="primary" key="search" onClick={()=>this.queryParms('contract_search')}><Icon type="search" />查询</Button>
                  {/*<Button style={{marginLeft:'10px'}} type="primary" onClick={this.queryParms}>导出Excel</Button>*/}
                </Col>
              </Row>

          </div>
          {/*
           转包项目表
           end-------------------
           */}
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
