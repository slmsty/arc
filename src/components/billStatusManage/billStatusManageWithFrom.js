/**
 * Created by liangshuang on 17/12/1.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { Form, Row, Col, Button, Input, Icon, DatePicker, Select } from 'antd'
import moment from 'moment'
import MultipleInput from '../common/multipleInput'
import SelectSbu from '../common/SelectSbu'

const FormItem = Form.Item
const { RangePicker } = DatePicker
const Option = Select.Option
const dateFormat = 'YYYY-MM-DD'

class BillStatusManageWithFormCon extends React.Component {
  state = {
  }
  handleQuery = () => {
    // 验证通过后查询
    const param = this.props.form.getFieldsValue()
    this.props.onQuery(param)
  }
  render() {
    const { getFieldDecorator } = this.props.form
    const formItemLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 17 },
    }
    return (
      <div>
        <Form
          className="ant-search-form"
        >
          <Row gutter={40}>
            <Col span={8} key={1}>
              <FormItem {...formItemLayout} label="收款日期">
                {getFieldDecorator('signDate', {
                  // initialValue: [moment().subtract(1, 'month'), moment()],
                  initialValue: [moment('2017-08-01'), moment()],
                })(<RangePicker
                  allowClear
                  format={dateFormat}
                  ranges={{ 今天: [moment(), moment()], 当月: [moment().startOf('month'), moment().endOf('month')] }}
                />)}
              </FormItem>
            </Col>
            <Col span={8} key={2}>
              <FormItem {...formItemLayout} label="合同客户名称">
                {
                  getFieldDecorator('SalessbuInfo')(<Input />)
                }
              </FormItem>
            </Col>
            <Col span={8} key={3}>
              <FormItem {...formItemLayout} label="项目编码(多)">
                {
                  getFieldDecorator('projectIds')(
                    <MultipleInput
                      placeholder="多项目编码使用英文逗号间隔"
                    />,
                  )
                }
              </FormItem>
            </Col>
          </Row>
          <Row gutter={40}>
            <Col span={8} key={4}>
              <FormItem {...formItemLayout} label="数据状态">
                {getFieldDecorator('Splitstatus', {
                  initialValue: '31',
                })(
                  <Select
                    placeholder="请选择拆分状态"
                    notFoundContent=""
                    defaultActiveFirstOption={false}
                    filterOption={false}
                    onChange={this.handleChange}
                  >
                    <Option value="31">已开票</Option>
                    <Option value="50">回写中</Option>
                    <Option value="51">已回写</Option>
                    <Option value="32">作废中</Option>
                    <Option value="502">已作废</Option>
                    <Option value="512">已传送AP</Option>
                    <Option value="5124">错误</Option>
                    <Option value="514">传送中</Option>
                  </Select>,
                )}
              </FormItem>
            </Col>
            <Col span={8} key={5}>
              <FormItem {...formItemLayout} label="合同编码(多)">
                {
                  getFieldDecorator('projectIds')(
                    <MultipleInput
                      placeholder="多合同编码使用英文逗号间隔"
                    />,
                  )
                }
              </FormItem>
            </Col>
            <Col span={8} key={6}>
              <FormItem {...formItemLayout} label="发票号(多)">
                {
                  getFieldDecorator('projectIds')(
                    <MultipleInput
                      placeholder="多发票号使用英文逗号间隔"
                    />,
                  )
                }
              </FormItem>
            </Col>
          </Row>
          <Row gutter={40}>
            <Col span={24} style={{ textAlign: 'right' }}>
              <Button type="primary" key="search" onClick={this.handleQuery}><Icon type="search" />查询</Button>
            </Col>
          </Row>
        </Form>
      </div>
    )
  }
}
BillStatusManageWithFormCon.propTypes = {
  form: PropTypes.shape({
    getFieldDecorator: PropTypes.func.isRequired,
    getFieldsValue: PropTypes.func.isRequired,
  }).isRequired,
  onQuery: PropTypes.func.isRequired,
}
const BillStatusManageWithForm = Form.create()(BillStatusManageWithFormCon)

export default BillStatusManageWithForm
