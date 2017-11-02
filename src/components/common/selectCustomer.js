/* eslint-disable react/prefer-stateless-function,react/prop-types */
import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Form, Row, Col, Button, Input, Table, Icon, message } from 'antd'

import requestJsonFetch from '../../http/requestJsonFecth'

const FormItem = Form.Item
const Search = Input.Search

class SelectCustomer extends React.Component {
  state = {
    visible: false,
    customerName: '',
    pageNo: 1,
    pageSize: 10,
    total: 1,
    customerList: [],
    selectedRowKeys: [],
    selectedRows: [],
  }
  onSelectChange = (selectedRowKeys, selectedRows) => {
    this.setState({ selectedRowKeys, selectedRows })
  }
  columns = [{
    title: '客户名称',
    dataIndex: 'customerName',
    width: 200,
  }, {
    title: '客户编号',
    dataIndex: 'customerNumber',
    width: 200,
  },
  ]
  handleOk = () => {
    if (this.state.selectedRows.length === 0) {
      message.error('请选择客户')
      return
    }
    this.setState({
      customerName: this.state.selectedRows[0].customerName,
    })
    this.props.onChange(this.state.selectedRows[0].customerId)
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
    requestJsonFetch('/arc/common/customer_name/list', param, this.handleCallback)
  }
  handleCallback = (response) => {
    if (response.resultCode === '000000') {
      this.setState({
        pageNo: response.pageInfo.pageNo,
        total: response.pageInfo.pageCount,
        customerList: response.pageInfo.result,
      })
    }
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
    return (
      <div>
        <Search
          style={{ height: 30 }}
          placeholder="客户名称"
          value={this.props.value ? this.state.customerName : ''}
          onSearch={() => this.setState({ visible: true })}
          onClick={() => this.setState({ visible: true })}
        />
        <Modal
          title="选择客户"
          style={{ top: 20 }}
          visible={visible}
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
                  {getFieldDecorator('keywords')(
                    <Input
                      placeholder="请输入关键字"
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
            rowKey="customerId"
            columns={this.columns}
            rowSelection={rowSelection}
            bordered
            size="middle"
            dataSource={this.state.customerList}
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

SelectCustomer.propTypes = {
  form: PropTypes.shape({
    getFieldDecorator: PropTypes.func.isRequired,
    getFieldValue: PropTypes.func.isRequired,
  }).isRequired,
  value: PropTypes.string,
}

const SelectCustomerWithForm = Form.create()(SelectCustomer)

export default SelectCustomerWithForm
