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

class ContractSplitCon extends React.Component {
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
            <Col span={8} key={3}>
              <FormItem {...formItemLayout} label="Sales签约BU">
                {
                  getFieldDecorator('SalessbuInfo')(<SelectSbu/>)
                }
              </FormItem>
            </Col>
          </Row>
          <Row gutter={40}>
            <Col span={8} key={4}>
              <FormItem {...formItemLayout} label="合同名称">
                {
                  getFieldDecorator('contractName')(
                    <Input placeholder="请输入合同名称" />,
                  )
                }
              </FormItem>
            </Col>
            <Col span={8} key={5}>
              <FormItem {...formItemLayout} label="拆分责任人">
                {
                  getFieldDecorator('SplitPeo')(
                    <Input placeholder="请输入拆分责任人" />,
                  )
                }
              </FormItem>
            </Col>
            <Col span={8} key={6}>
              <FormItem {...formItemLayout} label="拆分状态">
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
                    <Option value="31">未拆分合同</Option>
                    <Option value="50">已拆分合同</Option>
                    <Option value="51">全部合同</Option>
                  </Select>,
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={40}>
            <Col span={8} key={7}>
              <FormItem {...formItemLayout} label="合同编码(多)">
                {
                  getFieldDecorator('contractIds')(
                    <MultipleInput
                      placeholder="多合同编码使用英文逗号间隔"
                    />,
                  )
                }
              </FormItem>
            </Col>
            <Col span={8} key={8}>
              <FormItem {...formItemLayout} label="拆分操作人">
                {
                  getFieldDecorator('splitOprationPeo')(
                    <Input placeholder="请输入拆分操作人" />,
                  )
                }
              </FormItem>
            </Col>
            <Col span={8} key={9}>
              <FormItem {...formItemLayout} label="立项BU">
                {
                  getFieldDecorator('lisbuInfo')(<SelectSbu />)
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
ContractSplitCon.propTypes = {
  form: PropTypes.shape({
    getFieldDecorator: PropTypes.func.isRequired,
    getFieldsValue: PropTypes.func.isRequired,
  }).isRequired,
  onQuery: PropTypes.func.isRequired,
}
const ContractSplitConWithForm = Form.create()(ContractSplitCon)

export default ContractSplitConWithForm
