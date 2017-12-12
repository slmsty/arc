/**
 * Created by liangshuang on 17/12/1.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { Button, Row, Col, Form, Radio, DatePicker, Input, Icon } from 'antd'
import moment from 'moment'
import MultipleInput from '../common/multipleInput'
import SelectCustomerWithForm from '../common/selectCustomer'

const FormItem = Form.Item
const RadioButton = Radio.Button
const RadioGroup = Radio.Group
const dateFormat = 'YYYY-MM-DD'

class StatementListCom extends React.Component {
  state = {
    infoVisitable: false,
    loading: false,
    applyData: '',
    stateType: '',
  }
  queryParms = () => {
    const param = this.props.form.getFieldsValue()
    console.log(param)
  }
  changeStateSearch = (_value) => {
    this.setState({
      stateType: _value,
    })
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
                  initialValue: '0',
                })(
                  <RadioGroup size="middle" name="statementType">
                    <RadioButton value="0" style={{ borderRadius: '4px' }} onClick={this.changeStateSearch.bind(this, '0')}>billed AR信息查询表</RadioButton>
                    <RadioButton value="1" style={{ marginLeft: '20px', borderRadius: '4px' }} onClick={this.changeStateSearch.bind(this, '1')}>发票及收款信息查询表</RadioButton>
                    <RadioButton value="2" style={{ marginLeft: '20px', borderRadius: '4px' }} onClick={this.changeStateSearch.bind(this, '2')}>发票信息查询表</RadioButton>
                    <RadioButton value="3" style={{ marginLeft: '20px', borderRadius: '4px' }} onClick={this.changeStateSearch.bind(this, '3')}>转包项目表</RadioButton>
                  </RadioGroup>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={40}>
            <Col span={24} key={2} offset={2}>
              <FormItem {...formItemLayout}>
                {getFieldDecorator('statementType')(
                  <RadioGroup size="middle" name="statementType">
                    <RadioButton value="4" style={{ borderRadius: '4px' }} onClick={this.changeStateSearch.bind(this, '4')}>应收账款询证函报表</RadioButton>
                    <RadioButton value="5" style={{ marginLeft: '20px', borderRadius: '4px' }} onClick={this.changeStateSearch.bind(this, '5')}>项目综合信息查询报表</RadioButton>
                    <RadioButton value="6" style={{ marginLeft: '20px', borderRadius: '4px' }} onClick={this.changeStateSearch.bind(this, '6')}>收款信息查询表</RadioButton>
                  </RadioGroup>
                )}
              </FormItem>
            </Col>
          </Row>
          <div style={{ display: this.state.stateType === '6' ? 'block' : 'none' }}>
            <Row gutter={40}>
              <Col span={8}>
                <FormItem {...formItemLayoutChild} label="项目编码(多)">
                  {
                    getFieldDecorator('projectIds')(
                      <MultipleInput
                        placeholder="多项目编码使用英文逗号间隔"
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
                <FormItem {...formItemLayoutChild} label="收款日期">
                  {getFieldDecorator('reciptDate', {
                    initialValue: moment(),
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
                <FormItem {...formItemLayoutChild} label="币种">
                  {getFieldDecorator('receiptCurrency')(
                    <Input
                      placeholder="请输入币种"
                    />,
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem {...formItemLayoutChild} label="收款金额">
                  {getFieldDecorator('receiptAmount')(
                    <Input
                      placeholder="请输入收款金额"
                    />,
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem {...formItemLayoutChild} label="收款编码">
                  {getFieldDecorator('receiptId')(
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
                  {getFieldDecorator('contractNo')(
                    <Input
                      placeholder="请输入合同编码"
                    />,
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={40}>
              <Col span={24} style={{ textAlign: 'right' }}>
                <Button type="primary" key="search" onClick={this.queryParms}><Icon type="search" />查询</Button>
              </Col>
            </Row>
          </div>
          <div style={{ display: this.state.stateType === '2' ? 'block' : 'none' }}>
            <Row gutter={40}>
              <Col span={8}>
                <FormItem {...formItemLayoutChild} label="项目编码(多)">
                  {
                    getFieldDecorator('projectIds')(
                      <MultipleInput
                        placeholder="多项目编码使用英文逗号间隔"
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
                    initialValue: moment(),
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
                <FormItem {...formItemLayoutChild} label="币种">
                  {getFieldDecorator('receiptCurrency')(
                    <Input
                      placeholder="请输入币种"
                    />,
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem {...formItemLayoutChild} label="开票金额">
                  {getFieldDecorator('billedAmount')(
                    <Input
                      placeholder="请输入开票金额"
                    />,
                  )}
                </FormItem>
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
              <Col span={24} style={{ textAlign: 'right' }}>
                <Button type="primary" key="search" onClick={this.queryParms}><Icon type="search" />查询</Button>
              </Col>
            </Row>
          </div>
          <div style={{ display: this.state.stateType === '1' ? 'block' : 'none' }}>
            <Row gutter={40}>
              <Col span={8}>
                <FormItem {...formItemLayoutChild} label="项目编码(多)">
                  {
                    getFieldDecorator('projectIds')(
                      <MultipleInput
                        placeholder="多项目编码使用英文逗号间隔"
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
                    initialValue: moment(),
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
                  {getFieldDecorator('contractNo')(
                    <Input
                      placeholder="请输入合同编码"
                    />,
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={40}>
              <Col span={24} style={{ textAlign: 'right' }}>
                <Button type="primary" key="search" onClick={this.queryParms}><Icon type="search" />查询</Button>
              </Col>
            </Row>
          </div>
          <div style={{ display: this.state.stateType === '3' ? 'block' : 'none' }}>
            <Row gutter={40}>
              <Col span={8}>
                <FormItem {...formItemLayoutChild} label="项目编码(多)">
                  {
                    getFieldDecorator('projectIds')(
                      <MultipleInput
                        placeholder="多项目编码使用英文逗号间隔"
                      />,
                    )
                  }
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem {...formItemLayoutChild} label="截止日期">
                  {getFieldDecorator('billedDate', {
                    initialValue: moment(),
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
                  {getFieldDecorator('contractNo')(
                    <Input
                      placeholder="请输入合同编码"
                    />,
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={40}>
              <Col span={24} style={{ textAlign: 'right' }}>
                <Button type="primary" key="search" onClick={this.queryParms}><Icon type="search" />查询</Button>
              </Col>
            </Row>
          </div>
          <div style={{ display: this.state.stateType === '4' ? 'block' : 'none' }}>
            <Row gutter={40}>
              <Col span={8}>
                <FormItem {...formItemLayoutChild} label="项目编码(多)">
                  {
                    getFieldDecorator('projectIds')(
                      <MultipleInput
                        placeholder="多项目编码使用英文逗号间隔"
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
                <FormItem {...formItemLayoutChild} label="截止日期">
                  {getFieldDecorator('billedDate', {
                    initialValue: moment(),
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
                  {getFieldDecorator('contractNo')(
                    <Input
                      placeholder="请输入合同编码"
                    />,
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={40}>
              <Col span={24} style={{ textAlign: 'right' }}>
                <Button type="primary" key="search" onClick={this.queryParms}><Icon type="search" />查询</Button>
              </Col>
            </Row>
          </div>
          <div style={{ display: this.state.stateType === '5' ? 'block' : 'none' }}>
            <Row gutter={40}>
              <Col span={8}>
                <FormItem {...formItemLayoutChild} label="项目编码(多)">
                  {
                    getFieldDecorator('projectIds')(
                      <MultipleInput
                        placeholder="多项目编码使用英文逗号间隔"
                      />,
                    )
                  }
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem {...formItemLayoutChild} label="币种">
                  {getFieldDecorator('receiptCurrency')(
                    <Input
                      placeholder="请输入币种"
                    />,
                  )}
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
              <Col span={24} style={{ textAlign: 'right' }}>
                <Button type="primary" key="search" onClick={this.queryParms}><Icon type="search" />查询</Button>
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
