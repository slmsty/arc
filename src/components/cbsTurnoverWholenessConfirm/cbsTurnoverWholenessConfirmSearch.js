/* eslint-disable no-unused-vars,react/prefer-stateless-function */
import React from 'react'
import PropTypes from 'prop-types'
import { Form, Row, Col, Input, Button, DatePicker, Select } from 'antd'
import moment from 'moment'

import SelectInvokeApi from '../common/selectInvokeApi'
import SelectCustomerWithForm from '../common/selectCustomer'
import SelectReceiptMethodWithForm from '../common/selectReceiptMethod'

const { RangePicker } = DatePicker
const FormItem = Form.Item
const { Option } = Select
const dateFormat = 'YYYY-MM-DD'

class CBSTurnoverWholenessConfirmSearch extends React.Component {
  componentDidMount() {
    this.handleQuery()
  }
  handleQuery = (e) => {
    if (e) e.preventDefault()
    const param = this.props.form.getFieldsValue()
    param.receiptDateStart = param.receiptDate.length ? param.receiptDate[0].format(dateFormat) : ''
    param.receiptDateEnd = param.receiptDate.length ? param.receiptDate[1].format(dateFormat) : ''
    delete param.receiptDate
    param.custId = param.customer && param.customer.length ? param.customer[0] : null
    delete param.customer
    this.props.query(param)
  }
  handleChange = (value) => {
    this.props.changeStatus(value)
  }
  render() {
    const { getFieldDecorator } = this.props.form
    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 19 },
    }
    return (
      <div>
        <Form
          className="ant-search-form"
          onSubmit={this.handleQuery}
        >
          <Row gutter={40}>
            <Col span={8} key={1}>
              <FormItem {...formItemLayout} label="收款日期">
                {getFieldDecorator('receiptDate', {
                  initialValue: [moment('2017-08-01'), moment()],
                })(<RangePicker
                  allowClear
                  format={dateFormat}
                  ranges={{ 今天: [moment(), moment()], 当月: [moment().startOf('month'), moment().endOf('month')] }}
                />)}
              </FormItem>
            </Col>
            <Col span={8} key={2}>
              <FormItem {...formItemLayout} label="客户名称">
                {getFieldDecorator('customer')(<SelectCustomerWithForm />)}
              </FormItem>
            </Col>
            <Col span={8} key={3}>
              <FormItem {...formItemLayout} label="数据状态">
                {getFieldDecorator('status', {
                  initialValue: '10',
                })(<Select onChange={this.handleChange}>
                  <Option value="10">新建</Option>
                  <Option value="20">出纳待确认</Option>
                  <Option value="11">无需认款</Option>
                  <Option value="30">会计退回</Option>
                 </Select>)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={40}>
            <Col span={8} key={5}>
              <FormItem {...formItemLayout} label="收款方法">
                {getFieldDecorator('receiptMethodId')(<SelectReceiptMethodWithForm />)}
              </FormItem>
            </Col>
            <Col span={8} key={6}>
              <FormItem {...formItemLayout} label="银行交易类型">
                {getFieldDecorator('transactionType', {
                  initialValue: 'RECEIPT',
                })(<SelectInvokeApi
                  id="sourceType"
                  typeCode="ARC_RECEIPT_CLAIM"
                  paramCode="TRANSACTION_TYPE"
                  placeholder="请选择银行交易类型"
                />)}
              </FormItem>
            </Col>
            <Col span={8} key={7}>
              <Row>
                <Col span={13}>
                  <FormItem {...formItemLayout} label="金额" labelCol={{ span: 9 }} wrapperCol={{ span: 15 }}>
                    {getFieldDecorator('receiptAmountFrom')(<Input />)}
                  </FormItem>
                </Col>
                <Col span={2}><div style={{ textAlign: 'center' }}>～</div></Col>
                <Col span={9}>
                  <FormItem {...formItemLayout} wrapperCol={{ span: 24 }}>
                    {getFieldDecorator('receiptAmountTo')(<Input />)}
                  </FormItem>
                </Col>
              </Row>
            </Col>
          </Row>
          <Row gutter={40}>
            <Col span={8}>
              <FormItem {...formItemLayout} label="公司">
                {getFieldDecorator('companyName')(<Input />)}
              </FormItem>
            </Col>
            <Col span={8} offset={8} style={{ textAlign: 'right' }}>
              <Button type="primary" htmlType="submit">查询</Button>
            </Col>
          </Row>
        </Form>
      </div>
    )
  }
}

CBSTurnoverWholenessConfirmSearch.propTypes = {
  form: PropTypes.shape({
    getFieldDecorator: PropTypes.func.isRequired,
    getFieldsValue: PropTypes.func.isRequired,
  }).isRequired,
  query: PropTypes.func.isRequired,
  changeStatus: PropTypes.func.isRequired,
}

const CBSTurnoverWholenessConfirmSearchWithForm = Form.create()(CBSTurnoverWholenessConfirmSearch)

export default CBSTurnoverWholenessConfirmSearchWithForm
