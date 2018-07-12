import React from 'react'
import { Form, Row, Col, Button, Input, Icon, Select, Card, message } from 'antd'
import StaffSearch from './staffSearch'
const FormItem = Form.Item
const formItemLayout = {
  labelCol: { span: 2 },
  wrapperCol: { span: 22 },
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
class MailConfig extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      askContractTo: [],
      askContractCc:[],
    }
  }

  componentDidMount() {
    this.props.getMailConfig()
  }

  handleSave = () => {
    this.props.form.validateFields((err, values) => {
      this.props.saveMailConfig(values).then(res => {
        if(res && res.response && res.response.resultCode === '000000') {
          message.success('邮件配置保存成功!')
        }
      })
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { askContractTo, askContractCc } = this.props.mailConfig
    return (
      <div>
        <Form className="ant-search-form">
          <Card title="未确认到款邮件">
            <Row gutter={10}>
              <Col span={18} key={1}>
                <FormItem {...formItemLayout} label="收件人">
                  {getFieldDecorator('askContractTo', {initialValue: askContractTo,})(
                    <StaffSearch
                      url="/search/addressbook/staff"
                      columns={columns}
                      placeholder="请选择未确认到款收件人"
                      value={this.state.askContractTo}
                      onChange={(v) => this.setState({askContractTo: v})}
                    />
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={10}>
              <Col span={18} key={2}>
                <FormItem {...formItemLayout} label="抄送人">
                  {
                    getFieldDecorator('askContractCc',{
                      initialValue: askContractCc,
                    })(
                      <StaffSearch
                        url="/search/addressbook/staff"
                        columns={columns}
                        placeholder="请选择未确认到款抄送人"
                        value={this.state.askContractCc}
                        onChange={(v) => this.setState({askContractCc: v})}
                      />
                    )
                  }
                </FormItem>
              </Col>
            </Row>
          </Card>
          <Row gutter={40}>
            <Col span={24} key={1} style={{ textAlign: 'left', padding: '20px 30px' }}>
              <Button type="primary" key="search" onClick={() => this.handleSave()}><Icon type="check" />保存</Button>
            </Col>
          </Row>
        </Form>
      </div>
    )
  }
}

export default Form.create()(MailConfig)
