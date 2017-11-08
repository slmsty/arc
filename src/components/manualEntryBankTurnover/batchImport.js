/* eslint-disable no-unused-vars,react/prefer-stateless-function */
import React from 'react'
import { Input, Table, Button, notification, Row, Col, Upload, message } from 'antd'
import PropTypes from 'prop-types'

const successColumns = [{
  title: '收款日期',
  dataIndex: 'receiptDate',
  key: 'receiptDate',
  width: 90,
  fixed: 'left',
}, {
  title: '收款方法',
  dataIndex: 'receiptMethodName',
  key: 'receiptMethodName',
  width: 100,
  fixed: 'left',
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

export default class BatchImport extends React.Component {
  state = {
    fileList: [],
    batchNo: '',
  }
  handleDataChanged = (batchNo) => {
    this.setState({ batchNo })
    this.props.getImportResultData({
      pageInfo: {
        pageNo: 1,
        pageSize: 10,
      },
      batchNo,
      status: 'success',
    })

    this.props.getImportResultData({
      pageInfo: {
        pageNo: 1,
        pageSize: 10,
      },
      batchNo,
      status: 'failure',
    })
  }
  handleSuccessTableChange = (pagination) => {
    this.props.getImportResultData({
      pageInfo: {
        pageNo: pagination.current,
        pageSize: pagination.pageSize,
      },
      batchNo: this.state.batchNo,
      status: 'success',
    })
  }
  handleFailureTableChange = (pagination) => {
    this.props.getImportResultData({
      pageInfo: {
        pageNo: pagination.current,
        pageSize: pagination.pageSize,
      },
      batchNo: this.state.batchNo,
      status: 'failure',
    })
  }
  handleChange = (info) => {
    if (info.file.status === 'done') {
      if (info.file.response.resultCode !== '000000') {
        message.error(info.file.response.resultMessage)
      } else {
        this.handleDataChanged(info.file.response.data)
      }
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} 文件上传时发生系统错误。`)
    }
  }
  handleDownloadErrorData = () => {
    window.open(`${process.env.REACT_APP_GATEWAY}../s3/file/v1/bfa219086df7408ebcdb556c7fec12f1/knowledge/FFE75B01A6FC4ED6BC510B297AA99D68.xlsx`, '_blank')
  }

  render() {
    this.props.failureResult.result = []
    this.props.successResult.result = []
    const props = {
      action: `${process.env.REACT_APP_GATEWAY}v1.0.0/arc/receiptclaim/manual/import`,
      onChange: this.handleChange,
      multiple: false,
      showUploadList: false,
      beforeUpload: (file) => {
        this.setState(({ fileList }) => ({
          fileList: [...fileList, file],
        }))
      },
    }
    const successPagination = {
      current: this.props.successResult.pageNo,
      total: this.props.successResult.count,
      onChange: this.handleSuccessTableChange,
    }

    const failurePagination = {
      current: this.props.failureResult.pageNo,
      total: this.props.failureResult.count,
      onChange: this.handleFailureTableChange,
    }

    return (
      <div>
        <Row>
          <Col span={24}>
            注：可通过“下载模板”获取Excel表格，星号“<span style={{ color: '#f00' }}>*</span>”表示必填的信息列。
          </Col>
        </Row>
        <br />
        <Row gutter={10}>
          <Col span={24} offset={1}>
            <Row gutter={10}>
              <Col span={2}><span>文件位置：</span></Col>
              <Col span={8}><Input disabled value={this.state.fileList.length ? this.state.fileList[0].name : ''} /></Col>
              <Col span={14}>
                <Upload {...props} headers={{ Authorization: sessionStorage.getItem('token') }}>
                  <Button type="primary">导入</Button>
                </Upload>
              </Col>
            </Row>
          </Col>
        </Row>
        <br />
        <Row>
          <Col span={24} offset={1}>
            <Row>
              <Col span={2}><span>模板下载：</span></Col>
              <Col span={22}><Button type="primary" icon="download" onClick={() => { window.open('about:blank', '_blank') }}>下载模板</Button></Col>
            </Row>
          </Col>
        </Row>
        <br /><br />
        <div style={{ fontWeight: 'bold', padding: '5px 0' }}>传送成功数据：&nbsp;&nbsp;<span style={{ color: '#f00' }}>{ this.props.successResult.count }</span></div>
        <Table
          columns={successColumns}
          dataSource={this.props.successResult.result}
          bordered
          size="middle"
          pagination={successPagination}
          scroll={{ x: '1875px' }}
          rowKey="index"
        />
        <br />
        <div style={{ fontWeight: 'bold', padding: '5px 0' }}>
          传送失败数据：&nbsp;&nbsp;<span style={{ color: '#f00' }}>{ this.props.failureResult.count }</span>&nbsp;&nbsp;&nbsp;&nbsp;
          <Button type="danger" disabled={this.props.failureResult.count === 0} onClick={this.handleDownloadErrorData}>下载错误数据</Button>
        </div>
        <Table
          columns={failureColumns}
          dataSource={this.props.failureResult.result}
          bordered
          size="middle"
          pagination={failurePagination}
          scroll={{ x: '1875px' }}
          rowKey="index"
        />
      </div>
    )
  }
}

BatchImport.propTypes = {
  successResult: PropTypes.shape({
    pageNo: PropTypes.number.isRequired,
    count: PropTypes.number.isRequired,
    result: PropTypes.array.isRequired,
  }).isRequired,
  failureResult: PropTypes.shape({
    pageNo: PropTypes.number.isRequired,
    count: PropTypes.number.isRequired,
    result: PropTypes.array.isRequired,
  }).isRequired,
  getImportResultData: PropTypes.func.isRequired,
}
