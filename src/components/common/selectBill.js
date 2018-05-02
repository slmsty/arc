/* eslint-disable react/prefer-stateless-function,react/prop-types,max-len,react/require-default-props */
import React from 'react'
import { Modal, Form, Button, Table, Input, Icon, message } from 'antd'

import requestJsonFetch from '../../http/requestJsonFecth'

class SelectBill extends React.Component {
  state = {
    visible: false,
    pageNo: 1,
    pageSize: 10,
    total: 1,
    receiptClaimList: [],
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
    this.handleQuery()
  }
  onSelectChange = (selectedRowKeys, selectedRows) => {
    this.setState({ selectedRowKeys, selectedRows })
  }
  columns = [{
    title: '收款方法名称',
    dataIndex: 'erpReceiptMethodName',
    width: 100,
  }, {
    title: '客户付款方法',
    dataIndex: 'custPayMethod',
    width: 100,
  }, {
    title: '银行流水号',
    dataIndex: 'bankTransactionNo',
    width: 100,
  }, {
    title: '金额',
    dataIndex: 'receiptAmount',
    width: 100,
    render: text => (<div style={{ textAlign: 'right' }}>{text ? text.toFixed(2) : '0.00'}</div>),
  }, {
    title: '解付状态',
    dataIndex: 'paidStatusName',
    width: 100,
  }]
  handleOk = () => {
    if (this.state.selectedRows.length === 0) {
      message.error('请选择票据')
      return
    }
    this.props.onChange([this.state.selectedRows[0].receiptClaimId, this.state.selectedRows[0].bankTransactionNo, this.state.selectedRows[0].receiptAmount])
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
    const param = {
      method: 'POST',
      body: {
        pageInfo: {
          pageNo: pageNo || 1,
          pageSize: this.state.pageSize,
        },
      },
    }
    this.setState({ loading: true })
    requestJsonFetch('/arc/receiptclaim/relatedBillSearch', param, this.handleCallback)
  }
  handleCallback = (response) => {
    if (response.resultCode === '000000') {
      this.setState({
        pageNo: response.pageInfo.pageNo,
        total: response.pageInfo.count,
        receiptClaimList: response.pageInfo.result,
        firstLoad: false,
      })
    }
    this.setState({ loading: false })
  }
  handleEmitEmpty = () => {
    this.props.onChange(['', '', ''])
  }
  render() {
    const { visible } = this.state
    const { selectedRowKeys } = this.state
    const rowSelection = {
      type: 'radio',
      hideDefaultSelections: true,
      selectedRowKeys,
      onChange: this.onSelectChange,
    }
    const pagination = {
      pageSize: this.state.pageSize,
      current: this.state.pageNo,
      total: this.state.total,
      onChange: this.handleChangePage,
      size: 'small',
    }
    const suffix = this.props.disabled ? (this.props.value && this.props.value[1]) :
      ((this.props.value && this.props.value[1]) ? <Icon type="close-circle" onClick={this.handleEmitEmpty} /> : <Icon type="search" onClick={() => this.setState({ visible: true })} />)
    return (
      <div>
        <Input
          placeholder="相关票据"
          value={this.props.value && this.props.value[1] !== undefined ? this.props.value[1] : ''}
          suffix={suffix}
          onClick={() => this.setState({ visible: true })}
          disabled={this.props.disabled}
        />
        <Modal
          title="选择票据"
          style={{ top: 20 }}
          width={700}
          visible={visible}
          wrapClassName="vertical-center-modal"
          onCancel={this.handleCancel}
          footer={[
            <Button key="submit" type="primary" onClick={this.handleOk}>
              <Icon type="check" />选择票据
            </Button>,
          ]}
        >
          <Table
            rowKey={record => record.receiptClaimId}
            columns={this.columns}
            rowSelection={rowSelection}
            bordered
            size="middle"
            dataSource={this.state.receiptClaimList}
            loading={this.state.loading}
            locale={{
              emptyText: this.state.firstLoad ? '' : '没有符合条件的票据',
            }}
            pagination={pagination}
          />
        </Modal>
      </div>
    )
  }
}

const SelectBillDialog = Form.create()(SelectBill)

export default SelectBillDialog
