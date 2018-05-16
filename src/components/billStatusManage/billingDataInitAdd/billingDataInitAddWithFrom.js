/**
 * Created by liangshuang on 18/5/14.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { Form, Row, Col, Button, Input, Icon, DatePicker, Select } from 'antd'
import SelectInvokeApi from '../../common/selectInvokeApi'
import moment from 'moment'
const FormItem = Form.Item
const { RangePicker } = DatePicker
const Option = Select.Option
const dateFormat = 'YYYY-MM-DD'

class BillingDataInitAddWithFromCom extends React.Component {
  handleQuery = () => {
    // 验证通过后查询
    const param = this.props.form.getFieldsValue()
  }
  render() {
    const {getFieldDecorator} = this.props.form
    const formItemLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 17 },
    }
    return (
      <div>
        <Form className="ant-search-form">
          <Row gutter={40}>
            <Col span={8} key={1}>
              <FormItem {...formItemLayout} label="项目编码">
                {getFieldDecorator('productNo', {
                  initialValue: '',
                })(<Input/>)}
              </FormItem>
            </Col>
            <Col span={8} key={2}>
              <FormItem {...formItemLayout} label="合同客户名称">
                {getFieldDecorator('custName', {
                  initialValue: '',
                })(<Input/>)}
              </FormItem>
            </Col>
            <Col span={8} key={3}>
              <FormItem {...formItemLayout} label="发票号">
                {getFieldDecorator('billNo', {
                  initialValue: '',
                })(<Input/>)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={40}>
            <Col span={8} key={4}>
              <FormItem {...formItemLayout} label="合同编码">
                {getFieldDecorator('contractNo', {
                  initialValue: '',
                })(<Input/>)}
              </FormItem>
            </Col>
            <Col span={8} key={5}>
              <FormItem {...formItemLayout} label="签约公司">
                {getFieldDecorator('signCompany', {
                  initialValue: '',
                })(<Input/>)}
              </FormItem>
            </Col>
            <Col span={8} key={6}>
              <FormItem {...formItemLayout} label="数据状态">
                {getFieldDecorator('status', {
                  initialValue: 'init',
                })(
                  <Select>
                    <Option value='init'>初始化数据</Option>
                    <Option value='apply'>ARC申请</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={40}>
            <Col span={24} key={7} style={{ textAlign: 'right' }}>
              <Button type="primary" key="search" onClick={this.handleQuery}><Icon type="search" />查询</Button>
            </Col>
          </Row>

        </Form>
      </div>
      )

  }
}
const BillingDataInitAddWithFrom = Form.create()(BillingDataInitAddWithFromCom)

export default BillingDataInitAddWithFrom
