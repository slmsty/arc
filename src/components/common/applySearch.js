/**
 * Created by liangshuang on 17/12/1.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Form, Row, Col, Button, Input, Table, Icon, message } from 'antd'
const FormItem = Form.Item
class ApplySearchCon extends React.Component {
  handleQuery = () => {
    // 验证通过后查询
    const param = this.props.form.getFieldsValue()
    console.log(param)
   // this.props.onQuery(param)
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
                {getFieldDecorator('applayNum')(<Input onPressEnter={this.handleQuery} />)}
              </FormItem>
            </Col>
            <Col span={10} key={2}>
              <FormItem {...formItemLayout} label="申请人">
                {getFieldDecorator('applayCount')(<Input placeholder="姓名／工号／NT" onPressEnter={this.handleQuery} />)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={40}>
            <Col span={10} key={3}>
              <FormItem {...formItemLayout} label="申请时间">
                {getFieldDecorator('applayTime')(
                  <div style={{ width: '330px' }}>
                    <Button value="1" type="primary">全部</Button>&nbsp;&nbsp;&nbsp;&nbsp;
                    <Button value="2">近一周</Button>&nbsp;&nbsp;&nbsp;&nbsp;
                    <Button value="3">近一个月</Button>&nbsp;&nbsp;&nbsp;&nbsp;
                    <Button value="4">近一年</Button>
                  </div>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={40}>
            <Col span={10} key={4}>
              <FormItem {...formItemLayout} label="申请状态">
                {getFieldDecorator('applayStatus')(
                  <div style={{ width: '330px' }}>
                    <Button type="primary">全部</Button>&nbsp;&nbsp;&nbsp;&nbsp;
                    <Button>审批中</Button>&nbsp;&nbsp;&nbsp;&nbsp;
                    <Button>审批完成</Button>&nbsp;&nbsp;&nbsp;&nbsp;
                    <Button>驳回</Button>
                  </div>
                )}
              </FormItem>
            </Col>
            <Col span={10} style={{ textAlign: 'right' }}>
              <Button type="primary" key="search" onClick={this.handleQuery}><Icon type="search" />查询</Button>
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
    getFieldValue: PropTypes.func.isRequired,
    setFieldsValue: PropTypes.func.isRequired,
  }).isRequired,
  onQuery: PropTypes.func.isRequired,
}
const ApplySearchConWithForm = Form.create()(ApplySearchCon)

export default ApplySearchConWithForm
