/**
 * Created by liangshuang on 17/11/10.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { Table, Button, message, Modal, Form, Row, Col, DatePicker } from 'antd'
import moment from 'moment'

const FormItem = Form.Item
const dateFormat = 'YYYY-MM-DD'
const formItemLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 17 },
}
class DateModalCom extends React.Component {
  // const param = this.props.form.getFieldsValue()
  handleQuery = () => {
    // 验证通过后查询
    const param = this.props.form.getFieldsValue()
    this.props.selectOk(param.glDate.format(dateFormat))
  }
  render() {
    const { getFieldDecorator } = this.props.form
    return (<div>
      {/* 弹出传送ARglDatemodal */}
      <Modal
        visible={this.props.glDateModal}
        // onOk={this.props.selectOk}
        onOk={this.handleQuery}
        onCancel={this.props.selectCancel}
        title="请选择GL日期"
      >
        <Form
          className="ant-search-form"
        >
          <Row gutter={40}>
            <Col span={16} key={1}>
              <FormItem {...formItemLayout} label="收款日期">
                {getFieldDecorator('glDate', {
                  initialValue: moment().subtract(1, 'day'),
                })(<DatePicker
                  allowClear
                  format={dateFormat}
                />)}
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>)
  }
}
DateModalCom.propTypes = {
  form: PropTypes.shape({
    getFieldDecorator: PropTypes.func.isRequired,
    getFieldsValue: PropTypes.func.isRequired,
  }).isRequired,
  selectOk: PropTypes.func.isRequired,
  selectCancel: PropTypes.func.isRequired,
}
const DateModalComForm = Form.create()(DateModalCom)

export default DateModalComForm
