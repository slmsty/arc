/* eslint-disable react/prefer-stateless-function,react/prop-types,react/require-default-props */
import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Form, Row, Col, Button, Input, Table, Icon, message } from 'antd'

import requestJsonFetch from '../../http/requestJsonFecth'

const FormItem = Form.Item
const Search = Input.Search

class SelectReceiptMethod extends React.Component {
  state = {
    visible: false,
    methodName: '',
    pageNo: 1,
    pageSize: 10,
    total: 1,
    methodList: [],
    selectedRowKeys: [],
    selectedRows: [],
  }
  onSelectChange = (selectedRowKeys, selectedRows) => {
    this.setState({ selectedRowKeys, selectedRows })
  }
  columns = [{
    title: '收款方法',
    dataIndex: 'receiptMethodName',
    width: 100,
  }, {
    title: '银行账号',
    dataIndex: 'receiptBankAccountNum',
    width: 100,
  }, {
    title: '所属公司',
    dataIndex: 'companyName',
    width: 100,
  }, {
    title: '所属BG',
    dataIndex: 'bgName',
    width: 100,
  },
  ]
  handleOk = () => {
    if (this.state.selectedRows.length === 0) {
      message.error('请选择收款方法')
      return
    }
    this.setState({
      methodName: this.state.selectedRows[0].receiptMethodName,
    })
    this.props.onChange(this.state.selectedRows[0].receiptMethodId)
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
    requestJsonFetch('/arc/common/receipt_method/list', param, this.handleCallback)
  }
  handleCallback = (response) => {
    if (response.resultCode === '000000') {
      this.setState({
        pageNo: response.pageInfo.pageNo,
        total: response.pageInfo.pageCount,
        methodList: response.pageInfo.result,
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
          placeholder="收款方法"
          value={this.props.value ? this.state.methodName : ''}
          onSearch={() => this.setState({ visible: true })}
          onClick={() => this.setState({ visible: true })}
        />
        <Modal
          title="选择收款方法"
          style={{ top: 20 }}
          visible={visible}
          onCancel={this.handleCancel}
          footer={[
            <Button key="submit" type="primary" onClick={this.handleOk}>
              <Icon type="check" />选择收款方法
            </Button>,
          ]}
        >
          <Form
            className="ant-search-form"
          >
            <Row>
              <Col span={16} key={1}>
                <FormItem {...formItemLayout} label="收款方法">
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
            rowKey="receiptMethodId"
            columns={this.columns}
            rowSelection={rowSelection}
            bordered
            size="middle"
            dataSource={this.state.methodList}
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

SelectReceiptMethod.propTypes = {
  form: PropTypes.shape({
    getFieldDecorator: PropTypes.func.isRequired,
    getFieldValue: PropTypes.func.isRequired,
  }).isRequired,
  value: PropTypes.string,
}

const SelectReceiptMethodWithForm = Form.create()(SelectReceiptMethod)

export default SelectReceiptMethodWithForm
