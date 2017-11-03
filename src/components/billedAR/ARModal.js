import React, {Component} from 'react'
import moment from 'moment';
import {Form, DatePicker, Input, Modal} from 'antd';
const FormItem = Form.Item;
const TextArea = Input.TextArea;

class ARModal extends Component{
  onCancel = ()=>{
    this.props.onCancel();
    this.props.form.resetFields();
  }

  onOk = ()=>{
    this.props.form.validateFields((err, {key6, key7, key8}) => {
      if(err) return

      this.props.onOk({
        key6: key6.format('YYYY-MM-DD'),
        key7: key7.format('YYYY-MM-DD'),
        key8
      });
      this.props.form.resetFields();
    });
  }

  render(){
    const {getFieldDecorator} = this.props.form;
    const {visible, onCancel, key6, key7, key8} = this.props;

    console.log(key6, key7, key8)

    return (
      <Modal
        title="AR编辑"
        visible={visible}
        onCancel={this.onCancel}
        onOk={this.onOk}>
          <Form>
            <FormItem label="Billed AR日期">
              {
                getFieldDecorator('key6', {
                  initialValue: key6 ? moment(key6) : null,
                  rules: [
                    {required: true, message: '必须选择Billed AR日期'}
                  ]
                })(
                  <DatePicker />
                )
              }
            </FormItem>
            <FormItem label="GL日期">
              {
                getFieldDecorator('key7', {
                  initialValue: key7 ? moment(key7) : null,
                  rules: [
                    {required: true, message: '必须选择GL日期'}
                  ]
                })(
                  <DatePicker />
                )
              }
            </FormItem>
            <FormItem label="备注">
              {
                getFieldDecorator('key8', {initialValue: key8})(
                  <TextArea rows={4} />
                )
              }
            </FormItem>
          </Form>
      </Modal>
    )
  }
}

export default Form.create()(ARModal)
