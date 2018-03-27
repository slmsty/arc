/**
 * Created by liangshuang on 17/12/1.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { Form, Row, Col, Button, Input, Icon, DatePicker, Select } from 'antd'
import moment from 'moment'
import MultipleInput from '../common/multipleInput'
import SelectSbu from '../common/SelectSbu'
import SelectOperator from '../common/selectOperator'

const FormItem = Form.Item
const { RangePicker } = DatePicker
const Option = Select.Option
const dateFormat = 'YYYY-MM-DD'

class ContractSplitCon extends React.Component {
  state = {
    showRecaule:false,
  }
  handleQuery = () => {
    // 验证通过后查询
    const param = this.props.form.getFieldsValue()
    param.contractDateStart = param.signDate && param.signDate.length ? param.signDate[0].format(dateFormat) : ''
    param.contractDateEnd = param.signDate && param.signDate.length ? param.signDate[1].format(dateFormat) : ''
    param.projectBuNo = param.projectBuNo && param.projectBuNo ? param.projectBuNo[0] : ''
    param.salesBuNo = param.salesBuNo && param.salesBuNo ? param.salesBuNo[0] : ''
    param.operator = param.operator && param.operator[1] ? param.operator[1] : ''
    delete param.signDate
    this.props.onQuery(param)
  }
  handleChange = (e) => {
    if(e==='Y'){
      this.setState({
        showRecaule:true,
      })
    }else{
      this.setState({
        showRecaule:false,
      })
    }
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
              <FormItem {...formItemLayout} label="签约日期">
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
              <FormItem {...formItemLayout} label="项目编码">
                {
                  getFieldDecorator('projectNo')(
                    <Input
                      placeholder="项目编码"
                      onPressEnter={this.handleQuery}
                    />,
                  )
                }
              </FormItem>
            </Col>
            <Col span={8} key={3}>
              <FormItem {...formItemLayout} label="Sales签约BU">
                {
                  getFieldDecorator('salesBuNo')(<SelectSbu keyName="contract"/>)
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
              <FormItem {...formItemLayout} label="立项BU">
                {
                  getFieldDecorator('projectBuNo')(<SelectSbu keyName="contract"/>)
                }
              </FormItem>
            </Col>
            <Col span={8} key={6}>
              <FormItem {...formItemLayout} label="拆分状态">
                {getFieldDecorator('status', {
                  initialValue: 'N',
                })(
                  <Select
                    placeholder="请选择拆分状态"
                    notFoundContent=""
                    defaultActiveFirstOption={false}
                    filterOption={false}
                    onChange={this.handleChange}
                  >
                    <Option value="N">未拆分合同</Option>
                    <Option value="Y">已拆分合同</Option>
                    <Option value="A">全部合同</Option>
                  </Select>,
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={40}>
            <Col span={8} key={7}>
              <FormItem {...formItemLayout} label="合同编码">
                {
                  getFieldDecorator('contractNo')(
                    <Input
                      placeholder="合同编码"
                      onPressEnter={this.handleQuery}
                    />,
                  )
                }
              </FormItem>
            </Col>
            <Col span={8} key={8}>
              <FormItem {...formItemLayout} label="拆分操作人">
                {
                  getFieldDecorator('operator')(
                    <SelectOperator
                      placeholder="请输入拆分操作人"
                    />,
                  )
                }
              </FormItem>
            </Col>
            <Col span={8} style={{ textAlign: 'right' }}>
              <FormItem {...formItemLayout} label="区域">
                {
                  getFieldDecorator('region')(
                    <Input/>,
                  )
                }
              </FormItem>
            </Col>
          </Row>
          <Row gutter={40}>
            <Col span={8} style={{display:this.state.showRecaule ? 'block' : 'none'}}>
              <FormItem {...formItemLayout} label="是否复算项目">
                {getFieldDecorator('recalculate', {
                  initialValue: ' ',
                })(
                  <Select
                    placeholder="请选择拆分状态"
                    onChange={this.handleChange}
                  >
                    <Option value="">全部</Option>
                    <Option value="Y">是</Option>
                    <Option value="N">否</Option>
                  </Select>,
                )}
              </FormItem>
            </Col>
            <Col span={this.state.showRecaule ? '16' : '24'} style={{ textAlign: 'right' }}>
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
