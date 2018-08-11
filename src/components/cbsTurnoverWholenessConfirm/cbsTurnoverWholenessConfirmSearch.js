/* eslint-disable no-unused-vars,react/prefer-stateless-function */
import React from 'react'
import PropTypes from 'prop-types'
import { Form, Row, Col, Input, Button, DatePicker, Select, message, InputNumber } from 'antd'
import moment from 'moment'

import SelectInvokeApi from '../common/selectInvokeApi'
import SelectCustomerWithForm from '../common/selectCustomer'
import SelectReceiptMethodWithForm from '../common/selectReceiptMethod'

const { RangePicker } = DatePicker
const FormItem = Form.Item
const { Option } = Select
const dateFormat = 'YYYY-MM-DD'
const reg = /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/

class CBSTurnoverWholenessConfirmSearch extends React.Component {
  componentDidMount() {
    this.handleQuery()
  }
  handleQuery = (e) => {
    if (e) e.preventDefault()
    const param = this.props.form.getFieldsValue()

    if (param.receiptAmountFrom && (isNaN(param.receiptAmountFrom) || !reg.test(param.receiptAmountFrom))) {
      message.error('最小金额不能输入非数值内容。')
      return
    }

    if (param.receiptAmountTo && (isNaN(param.receiptAmountTo) || !reg.test(param.receiptAmountTo))) {
      message.error('最小金额不能输入非数值内容。')
      return
    }

    if (param.receiptAmountFrom && param.receiptAmountTo && parseFloat(param.receiptAmountFrom, 10) > parseFloat(param.receiptAmountTo, 10)) {
      message.error('最小金额不能大于最大金额，请修改。')
      return
    }

    param.receiptDateStart = param.receiptDate.length ? param.receiptDate[0].format(dateFormat) : ''
    param.receiptDateEnd = param.receiptDate.length ? param.receiptDate[1].format(dateFormat) : ''
    param.receiptAmountFrom = param.receiptAmountFrom ? param.receiptAmountFrom.trim() : ''
    param.receiptAmountTo = param.receiptAmountTo ? param.receiptAmountTo.trim() : ''
    param.companyName = param.companyName ? param.companyName.trim() : ''
    param.receiptBankAccountName = param.receiptBankAccountName ? param.receiptBankAccountName.trim() : ''
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
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
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
                  /*initialValue: [moment().subtract(1, 'day'), moment()],*/
                  initialValue: [moment().startOf('month'), moment().endOf('month')],
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
                <Col span={14}>
                  <FormItem {...formItemLayout} label="金额" labelCol={{ span: 10 }} wrapperCol={{ span: 14 }}>
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
          </Row>
          <Row gutter={40}>
            <Col span={8}>
              <FormItem {...formItemLayout} label="公司">
                {getFieldDecorator('companyName')(<Input />)}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem {...formItemLayout} label="收款银行">
                {getFieldDecorator('receiptBankAccountName')(<Input />)}
              </FormItem>
            </Col>
            <Col span={8} style={{ textAlign: 'right' }}>
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
