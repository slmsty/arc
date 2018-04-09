import React from 'react'
import { Table, Button, Form, Row, Col, Input, Icon } from 'antd'
import ContentAdd from './contentAdd'

const FormItem = Form.Item
const columns = [
  {
    title: '客户名称',
    dataIndex: 'custName',
    width: 300,
  }, {
    title: '开票客户名称',
    dataIndex: 'billCustName',
    width: 300,
  }, {
    title: '纳税人识别码',
    dataIndex: 'taxCode',
    width: 150,
  }, {
    title: '纳税人地址、电话',
    dataIndex: 'address',
    width: 200,
  }, {
    title: '开户行及账号',
    dataIndex: 'account',
    width: 200,
  }, {
    title: '状态',
    dataIndex: 'status',
    width: 150,
  }, {
    title: '操作',
    dataIndex: 'status',
    width: 100,
    render: () => {
      return <a>修改</a>
    }
  },
]
const formItemLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 14 },
}
class CustomerTaxInfo extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showAdd: false,
    }
  }

  render() {
    const { isLoading, result=[] } = this.props
    const { getFieldDecorator } = this.props.form
    return (
      <div>
        <Form
          className="ant-search-form"
        >
          <Row gutter={10}>
            <Col span={8} key={1}>
              <FormItem {...formItemLayout} label="客户名称">
                {getFieldDecorator('custName')(
                  <Input placeholder="客户名称"/>
                )}
              </FormItem>
            </Col>
            <Col span={8} key={2} style={{ textAlign: 'left' }}>
              <Button type="primary" key="search" onClick={() => this.handleQuery()}><Icon type="search" />查询</Button>
            </Col>
          </Row>
        </Form>
        <div style={{margin: '10px 0'}}>
          <Button type="primary" onClick={() => this.setState({showAdd: true})} ghost>新增</Button>
        </div>
        <Table
          loading={isLoading}
          rowKey={record => record.key}
          bordered
          columns={columns}
          dataSource={result}
        />
        <ContentAdd
          visible={this.state.showAdd}
          onCancel={() => this.setState({showAdd: false})}
        />
      </div>
    )
  }
}

export default Form.create() (CustomerTaxInfo)
