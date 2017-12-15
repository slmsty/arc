/**
 * Created by liangshuang on 17/12/1.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { Form, Row, Col, Button, Input, Icon, Radio } from 'antd'

const FormItem = Form.Item
const RadioButton = Radio.Button
const RadioGroup = Radio.Group

class ApplySearchCon extends React.Component {
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
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    }
    return (
      <div>
        <Form
          className="ant-search-form"
        >
          <Row gutter={40}>
            <Col span={10} key={1}>
              <FormItem {...formItemLayout} label="申请单号">
                {getFieldDecorator('businessKey')(<Input onPressEnter={this.handleQuery} />)}
              </FormItem>
            </Col>
            <Col span={10} key={2}>
              <FormItem {...formItemLayout} label="申请人">
                {getFieldDecorator('applyPersonKeyword')(<Input placeholder="姓名／工号／NT" onPressEnter={this.handleQuery} />)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={40}>
            <Col span={10} key={3}>
              <FormItem {...formItemLayout} label="申请时间">
                {getFieldDecorator('applyDate', {
                  initialValue: 'ALL',
                })(
                  <RadioGroup size="large" style={{ width: '330px' }}>
                    <RadioButton value="ALL" style={{ borderRadius: '4px' }}>全部</RadioButton>
                    <RadioButton value="WEEK" style={{ marginLeft: '10px', borderRadius: '4px' }}>近一周</RadioButton>
                    <RadioButton value="MONTH" style={{ marginLeft: '10px', borderRadius: '4px' }}>近一个月</RadioButton>
                    <RadioButton value="YEAR" style={{ marginLeft: '10px', borderRadius: '4px' }}>近一年</RadioButton>
                  </RadioGroup>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={40}>
            <Col span={10} key={4}>
              <FormItem {...formItemLayout} label="申请状态">
                {getFieldDecorator('status', {
                  initialValue: 'ALL',
                })(
                  <RadioGroup size="large" style={{ width: '330px' }}>
                    <RadioButton value="ALL" style={{ borderRadius: '4px' }}>全部</RadioButton>
                    <RadioButton value="approve" style={{ marginLeft: '10px', borderRadius: '4px' }}>审批中</RadioButton>
                    <RadioButton value="finish" style={{ marginLeft: '10px', borderRadius: '4px' }}>审批完成</RadioButton>
                    <RadioButton value="reject" style={{ marginLeft: '10px', borderRadius: '4px' }}>驳回</RadioButton>
                  </RadioGroup>
                )}
              </FormItem>
            </Col>
            <Col span={10} style={{ textAlign: 'right' }}>
              <Button type="primary" key="search" onClick={this.handleQuery} disabled={this.props.loading}><Icon type="search" />查询</Button>
            </Col>
          </Row>
        </Form>
      </div>
    )
  }
}
ApplySearchCon.propTypes = {
  form: PropTypes.shape({
    getFieldDecorator: PropTypes.func.isRequired,
    getFieldsValue: PropTypes.func.isRequired,
  }).isRequired,
  onQuery: PropTypes.func.isRequired,
}
const ApplySearchConWithForm = Form.create()(ApplySearchCon)

export default ApplySearchConWithForm
