import React, {Component} from 'react'
import requestJsonFetch from '../../http/requestJsonFecth'
import {Form, Input, Modal, message} from 'antd';
const FormItem = Form.Item;
const TextArea = Input.TextArea;

class BDModal extends Component{
  onCancel = ()=>{
    this.props.onCancel();
    this.props.form.resetFields();
  }

  postEdit = (body, callback)=>{
    requestJsonFetch(
      '/arc/badDebt/apply/save',
      {
        method: 'POST',
        body
      },
      callback
    )
  }

  onOk = ()=>{
    this.props.form.validateFields((err, values) => {
      if(err) return

      let body = {
        badDebtApplySave: {
          contractItemId: this.props.o.contractItemId,
          badDebtProvisionAmount: this.props.o.badDebtProvisionAmount,
          erpGlDate: this.props.o.erpGlDate,
          custId: this.props.o.custId,
          badDebtAmount: values.badDebtAmount,
          applicantRemark: values.applicantRemark,
        }
      }

      this.postEdit(body, response=>{
        if(response.resultCode === '000000'){
          body.badDebtApplySave.badDebtId = response.data;
          this.props.onOk(body.badDebtApplySave);
          this.props.form.resetFields();
        }else{
          message.error(response.resultMessage);
        }
      })
    });
  }

  render(){
    console.log(this.props.o)
    const {getFieldDecorator} = this.props.form;
    const {visible, o} = this.props;

    return (
      <Modal
        title="编辑"
        visible={visible}
        onCancel={this.onCancel}
        onOk={this.onOk}>
        <Form>
          <FormItem label="GL已提坏账准备金额">
            {
              getFieldDecorator('badDebtProvisionAmount', {
                initialValue: o.badDebtProvisionAmount
              })(
                <Input disabled />
              )
            }
          </FormItem>
          <FormItem label="Billed AR金额">
            {
              getFieldDecorator('billedArAmount', {
                initialValue: o.billedArAmount
              })(
                <Input disabled />
              )
            }
          </FormItem>
          <FormItem label="坏账划销金额">
            {
              getFieldDecorator('badDebtAmount', {
                initialValue: o.badDebtAmount,
                rules: [
                  {required: true, message: '必须输入坏账划销金额'}
                ]
              })(
                <Input />
              )
            }
          </FormItem>
          <FormItem label="备注">
            {
              getFieldDecorator('applicantRemark', {
                initialValue: o.applicantRemark
              })(
                <TextArea rows={4} />
              )
            }
          </FormItem>
        </Form>
      </Modal>
    )
  }
}

export default Form.create()(BDModal)
