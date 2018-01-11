import React from 'react'
import { Modal, Form, Row, Col, Button, Input, Table, Icon, message } from 'antd'

import requestJsonFetch from '../../http/requestJsonFecth'

const FormItem = Form.Item
const columns = [{
    title: '客户名称',
    dataIndex: 'custName',
    width: 200,
  }, {
    title: '客户编号',
    dataIndex: 'custId',
    width: 200,
  }
]

class SelectClient extends React.Component {
  state = {
    visible: false,
    pageNo: 1,
    pageSize: 10,
    total: 1,
    customerList: [],
    selectedRowKeys: [],
    selectedRows: [],
    loading: false,
    firstLoad: true,
  }

  componentWillMount() {
    if (this.props.initialValue) {
      this.props.onChange(this.props.initialValue)
    }
  }

  componentDidMount() {
    if (this.props.defaultQueryParam) {
      this.handleQuery()
    }
  }

  onSelectChange = (selectedRowKeys, selectedRows) => {
    this.setState({ selectedRowKeys, selectedRows })
  }

  handleOk = () => {
    if (this.state.selectedRows.length === 0) {
      message.error('请选择客户')
      return
    }
    this.props.onChange(this.state.selectedRows[0].custName)
    this.handleCancel()
  }

  handleCancel = () => {
    this.setState({
      visible: false,
      selectedRowKeys: [],
      selectedRows: [],
    })
  }

  handleChangePage = (page) => {
    this.handleQueryFetch(page)
  }

  handleQuery = () => {
    this.setState({ selectedRowKeys: [], selectedRows: [] })
    this.handleQueryFetch(1)
  }

  handleQueryFetch= (pageNo) => {
    const keywords = this.props.form.getFieldValue('keywords')
    const param = {
      method: 'POST',
      body: {
        pageInfo: {
          pageNo: pageNo || 1,
          pageSize: this.state.pageSize,
        },
        keywords,
      },
    }
    this.setState({ loading: true })
    requestJsonFetch('/arc/billingApplication/custom/search', param, this.handleCallback)
  }

  handleCallback = (response) => {
    console.log(response)
    if (response.resultCode === '000000') {
      this.setState({
        pageNo: response.pageInfo.pageNo,
        total: response.pageInfo.count,
        customerList: response.pageInfo.result,
        firstLoad: false,
      })
    }
    this.setState({ loading: false })
  }

  handleEmitEmpty = () => {
    this.props.onChange('')
  }

  render() {
    const { visible } = this.state
    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 19 },
    }
    const { getFieldDecorator } = this.props.form
    const { selectedRowKeys } = this.state
    const rowSelection = {
      type: 'radio',
      hideDefaultSelections: true,
      selectedRowKeys,
      onChange: this.onSelectChange,
    }
    const suffix = (this.props.value) ? <Icon type="close-circle" onClick={this.handleEmitEmpty} /> : <Icon type="search" onClick={() => this.setState({ visible: true })} />
    return (
      <div>
        <Input
          placeholder="客户名称"
          value={this.props.value}
          suffix={suffix}
          onClick={() => this.setState({ visible: true })}
        />
        <Modal
          title="选择客户"
          style={{ top: 20 }}
          visible={visible}
          wrapClassName="vertical-center-modal"
          onCancel={this.handleCancel}
          footer={[
            <Button key="submit" type="primary" onClick={this.handleOk}>
              <Icon type="check" />选择客户
            </Button>,
          ]}
        >
          <Form
            className="ant-search-form"
          >
            <Row>
              <Col span={16} key={1}>
                <FormItem {...formItemLayout} label="客户名称">
                  {getFieldDecorator('keywords', {
                    initialValue: this.props.defaultQueryParam,
                  })(
                    <Input
                      onPressEnter={this.handleQuery}
                      placeholder="请输入客户关键字"
                    />,
                  )}
                </FormItem>
              </Col>
              <Col span={1} key={2} />
              <Col span={7} key={3}>
                <Button type="primary" icon="search" htmlType="submit" onClick={this.handleQuery}>查询</Button>
              </Col>
            </Row>
          </Form>

          <Table
            rowKey="custId"
            columns={columns}
            rowSelection={rowSelection}
            bordered
            size="middle"
            dataSource={this.state.customerList}
            loading={this.state.loading}
            locale={{
              emptyText: this.state.firstLoad ? '' : '没有符合条件的客户',
            }}
            pagination={{
              current: this.state.pageNo,
              onChange: this.handleChangePage,
              total: this.state.total,
              size: 'small',
            }}
          />
        </Modal>
      </div>
    )
  }
}

export default Form.create()(SelectClient)
