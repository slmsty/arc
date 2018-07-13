import React from 'react'
import { Form, Button, Row, Col, Modal, Icon, Input, Select, TreeSelect } from 'antd'
import SelectSbu from '../common/SelectSbu'
import InputSearch from '../billApplication/inputSearch'
import { provinceCols } from "../billApplication/billColumns";
import StaffSearch from './staffSearch'
const FormItem = Form.Item
const TextArea = Input.TextArea
const SHOW_CHILD = TreeSelect.SHOW_CHILD;
const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 15 },
}
const formItemLayout1 = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20},
}
const columns = [
  {
    title: '员工编号',
    dataIndex: 'staffCode',
    width: 100,
  }, {
    title: '员工姓名',
    dataIndex: 'staffName',
    width: 100,
  }, {
    title: '邮箱',
    dataIndex: 'email',
    width: 170,
  },
]
class MailCcConfigAdd extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      value: [''],
      saveLoading: false,
    }
  }

  onChange = (value) => {
    this.setState({ value });
  }

  handleOk = (e) => {
    e.preventDefault();
    const { emailId } = this.props.record
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const province = values.province && values.province.provinceName === '全部' ? 'ALL' : values.province.provinceName
        const params = {
          sbuNo: values.SBU ? values.SBU[0] : '',
          sbuName: values.SBU ? values.SBU[1]: '',
          region: values.region,
          province: province,
          email: values.email.join(','),
          actionType: emailId ? 'EDIT' : 'NEW',
          emailId: emailId ? emailId : '',
        }
        this.setState({
          saveLoading: true
        })
        this.props.saveMailCcConfig(params).then(res => {
          if(res && res.response) {
            this.setState({
              saveLoading: false
            })
          }
        })
      }
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { sbuNo, sbuName, region, email, province} = this.props.record
    return (
      <div>
        <Modal
          width="700px"
          title="添加到款邮件抄送人配置"
          visible={this.props.visible}
          wrapClassName="vertical-center-modal"
          onCancel={() => this.props.onCancel()}
          footer={[
            <Button key="submit" type="primary" loading={this.state.saveLoading} onClick={this.handleOk}>
              {!this.state.saveLoading ? <Icon type="check" /> : '' }保存
            </Button>,
          ]}
        >
          <Form
            className="ant-search-form"
          >
            <Row gutter={30}>
              <Col span={12} key={1}>
                <FormItem {...formItemLayout} label="立项BU">
                  {getFieldDecorator('SBU', {initialValue: sbuNo && sbuName ? [sbuNo, sbuName] : '', rules: [{ required: true, message: '请选择立项BU!' }]})(
                    <SelectSbu />
                  )}
                </FormItem>
              </Col>
              <Col span={12} key={2}>
                <FormItem {...formItemLayout} label="立项区域">
                  {
                    getFieldDecorator('region',{
                      initialValue: region, rules: [{ required: true, message: '请填写立项区域!' }]
                    })(
                      <TreeSelect
                        value={this.state.value}
                        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                        treeData={this.props.regionList}
                        placeholder="请选择立项区域"
                        onChange={this.onChange}
                        showSearch={true}
                        treeNodeFilterProp='label'
                        allowClear={true}
                        searchPlaceholder="根据区域名筛选"
                      />
                    )
                  }
                </FormItem>
              </Col>
            </Row>
            <Row gutter={30}>
              <Col span={12} key={1}>
                <FormItem {...formItemLayout} label="省份">
                  {getFieldDecorator('province', {initialValue: province ? {provinceName: province} : '', rules: [{ required: true, message: '请填写省份!' }]})(
                    <InputSearch
                      url="/arc/common/province/list"
                      columns={provinceCols}
                      label="省份"
                      idKey="provinceName"
                      valueKey="provinceName"
                      showSearch={true}
                    />
                  )}
                </FormItem>
              </Col>
              <Col span={12} key={2}></Col>
            </Row>
            <Row gutter={30}>
              <Col span={23} key={1}>
                <FormItem {...formItemLayout1} label="抄送人">
                  {getFieldDecorator('email', {initialValue: email ? email.split(',') : [], rules: [{ required: true, message: '请选择抄送人!' }]})(
                    <StaffSearch
                      url="/search/addressbook/staff"
                      columns={columns}
                      placeholder="请选择到款邮件抄送人"
                    />
                  )}
                </FormItem>
              </Col>
            </Row>
          </Form>
        </Modal>
      </div>
    )
  }
}

export default Form.create()(MailCcConfigAdd)
