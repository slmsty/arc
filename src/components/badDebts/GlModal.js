import React, {Component} from 'react'
import {Modal, Form, Row, Col, DatePicker } from 'antd'
const FormItem = Form.Item

class GlModal extends Component {
  onOk = (e)=>{
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if(err) return

      this.props.onOk(values.glDate.format('YYYY-MM-DD'))
    });
    this.props.form.resetFields();
  }

  onCancel = ()=>{
    this.props.onCancel();
    this.props.form.resetFields();
  }

  render() {
    const { getFieldDecorator } = this.props.form

    return (<div>
      <Modal
        visible={this.props.visible}
        onOk={this.onOk}
        onCancel={this.onCancel}
        title="请选择GL日期"
      >
        <Form onSubmit={this.onOk}>
          <Row>
            <Col span={16}>
              <FormItem label="GL日期" labelCol={{span: 7}} wrapperCol={{span: 17}}>
                {getFieldDecorator('glDate', {
                  rules: [
                    {required: true, message: '必须输入GL日期'}
                  ]
                })(<DatePicker />)}
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>)
  }
}

export default Form.create()(GlModal)
