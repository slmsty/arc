/* eslint-disable no-unused-vars,react/prefer-stateless-function */
import React from 'react'
import { Input, Table, Button, notification, Row, Col, Upload } from 'antd'
import PropTypes from 'prop-types'

const successColumns = [{
  title: '收款日期',
  dataIndex: 'receiptDate',
  key: 'receiptDate',
  width: 90,
}, {
  title: '收款方法',
  dataIndex: 'receiptMethodName',
  key: 'receiptMethodName',
  width: 100,
}, {
  title: '银行流水号',
  dataIndex: 'bankTransactionNo',
  key: 'bankTransactionNo',
  width: 150,
}, {
  title: '客户付款方式',
  dataIndex: 'custPayMethod',
  key: 'custPayMethod',
  width: 100,
}, {
  title: '付款客户名称',
  dataIndex: 'payCustName',
  key: 'payCustName',
  width: 300,
}, {
  title: '客户付款银行',
  dataIndex: 'payBankName',
  key: 'payBankName',
  width: 300,
}, {
  title: '客户付款银行账号',
  dataIndex: 'payBankAccount',
  key: 'payBankAccount',
  width: 150,
}, {
  title: '币种',
  dataIndex: 'currency',
  key: 'currency',
  width: 45,
}, {
  title: '金额',
  dataIndex: 'amount',
  key: 'amount',
  width: 100,
}, {
  title: '客户名称',
  dataIndex: 'erpCustName',
  key: 'erpCustName',
  width: 300,
}, {
  title: '流水分类',
  dataIndex: 'claimType',
  key: 'claimType',
  width: 100,
}, {
  title: '备注',
  dataIndex: 'remark',
  key: 'remark',
  width: 100,
}]

const failureColumns = successColumns.concat([{
  title: '提示',
  dataIndex: 'error',
  key: 'error',
  width: 100,
}])

const openNotificationWithIcon = (msg) => {
  notification.error({
    message: '错误',
    description: msg,
  })
}

export default class BatchImport extends React.Component {
  state = {
    successLoading: false,
    failureLoading: false,
    fileList: [],
    batchNo: '',
  }

  handleDataChanged = (batchNo) => {
    this.state.batchNo = batchNo
    this.props.getImportResultData({
      pageInfo: {
        pageNo: 1,
        pageSize: 10,
      },
      batchNo,
      status: 1,
    })

    this.props.getImportResultData({
      pageInfo: {
        pageNo: 1,
        pageSize: 10,
      },
      batchNo,
      status: 0,
    })
  }
  handleSuccessTableChange = (pagination) => {
    this.props.getImportResultData({
      pageInfo: {
        pageNo: pagination.current,
        pageSize: pagination.pageSize,
      },
      batchNo: this.state.batchNo,
      status: 1,
    })
  }
  handleFailureTableChange = (pagination) => {
    this.props.getImportResultData({
      pageInfo: {
        pageNo: pagination.current,
        pageSize: pagination.pageSize,
      },
      batchNo: this.state.batchNo,
      status: 0,
    })
  }
  handleChange = (info) => {
    if (info.resultCode !== '000000') {
      openNotificationWithIcon(info.resultMessage)
    } else {
      this.handleDataChanged(info.data)
    }
  }

  successPagination = {
    current: this.props.successResult.pageNo,
    total: this.props.successResult.count,
    onchange: this.handleSuccessTableChange,
  }

  failurePagination = {
    current: this.props.failureResult.pageNo,
    total: this.props.failureResult.count,
    onChange: this.handleFailureTableChange,
  }

  render() {
    const {
      successLoading, failureLoading, fileList, batchNo,
    } = this.state

    const props = {
      action: 'v1.0.0/arc/receiptclaim/manual/import',
      onChange: this.handleChange,
      multiple: false,
    }

    return (
      <div>
        <Row gutter={40}>
          <Col span={24}>
            注：可通过“下载模板”获取Excel表格，星号“<span style={{ color: 'f00' }}>*</span>”表示必填的信息列。
          </Col>
        </Row>
        <Row>
          <Col span={24} offset={2}>
            <Row align="middle">
              <Col span={2}><span>文件位置：</span></Col>
              <Col span={8}><Input disabled value={this.state.fileList.length ? this.state.fileList[0].name : ''} /></Col>
              <Col span={14}>
                <Upload {...props} fileList={this.state.fileList}>
                  <Button type="primary">导入</Button>
                </Upload>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row>
          <Col span={24} offset={2}>
            <Row>
              <Col span={2}><span>模板下载：</span></Col>
              <Col span={22}><Button type="primary" icon="download" onClick={() => { window.open('about:blank', '_blank') }}>下载模板</Button></Col>
            </Row>
          </Col>
        </Row>
        <br /><br />
        <div style={{ fontWeight: 'bold' }}>传送失败数据：&nbsp;&nbsp;<span style={{ color: '#f00' }}>{ this.props.successResult.count }</span></div>
        <Table
          columns={successColumns}
          dataSource={this.props.successResult.result}
          bordered
          size="middle"
          pagination={this.successPagination}
          scroll={{ x: '1875px' }}
          loading={this.state.loading}
        />
        <br />
        <div style={{ fontWeight: 'bold' }}>传送失败数据：&nbsp;&nbsp;<span style={{ color: '#f00' }}>{ this.props.failureResult.count }</span></div>
        <Table
          columns={failureColumns}
          dataSource={this.props.failureResult.result}
          bordered
          size="middle"
          pagination={this.failurePagination}
          scroll={{ x: '1875px' }}
          loading={this.state.loading}
        />
      </div>
    )
  }
}

BatchImport.propTypes = {
  successResult: PropTypes.shape({
    pageNo: PropTypes.string.isRequired,
    count: PropTypes.number.isRequired,
    result: PropTypes.array.isRequired,
  }).isRequired,
  failureResult: PropTypes.shape({
    pageNo: PropTypes.string.isRequired,
    count: PropTypes.number.isRequired,
    result: PropTypes.array.isRequired,
  }).isRequired,
  getImportResultData: PropTypes.func.isRequired,
}
