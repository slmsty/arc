import React from 'react'
import { Input, Table, Button, Row, Col, Upload, message } from 'antd'
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
  width: 200,
  fixed: 'left',
}, {
  title: '银行流水号',
  dataIndex: 'bankTransactionNo',
  key: 'bankTransactionNo',
  width: 150,
}, {
  title: '付款方式',
  dataIndex: 'custPayMethod',
  key: 'custPayMethod',
  width: 100,
}, {
  title: '对方户名',
  dataIndex: 'payCustName',
  key: 'payCustName',
  width: 300,
}, {
  title: '对方银行类型',
  dataIndex: 'payBankName',
  key: 'payBankName',
  width: 300,
}, {
  title: '对方银行账号',
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
  render: text => (<div style={{ textAlign: 'right' }}>{text ? text.toFixed(2) : '0.00'}</div>),
}, {
  title: '客户名称',
  dataIndex: 'erpCustName',
  key: 'erpCustName',
  width: 300,
}, {
  title: '流水分类',
  dataIndex: 'claimTypeName',
  key: 'claimTypeName',
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
    successTableHeight: '',
    failureTableHeight: '',
  }
  componentWillMount() {
    this.props.initData()
    const screenHeight = window.screen.height
    // 屏幕高-header高64-margin8-padding12-查询条件div168-按钮56-翻页160
    const successTableHeight = (screenHeight - 230) / 2 - 133
    this.setState({ successTableHeight })

    const failureTableHeight = successTableHeight - 10
    this.setState({ failureTableHeight })
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
    window.open(`${process.env.REACT_APP_GATEWAY}v1.0.0/arc/receiptclaim/manual/exportFailure/${this.state.batchNo}`, '_blank')
  }

  render() {
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
              <Col span={22}><Button type="primary" icon="download" onClick={() => { window.open(`${process.env.REACT_APP_GATEWAY}v1.0.0/file/inner/download/FFE75B01A6FC4ED6BC510B297AA99D68`, '_blank') }}>下载模板</Button></Col>
            </Row>
          </Col>
        </Row>
        <br /><br />
        <div style={{ fontWeight: 'bold', padding: '5px 0' }}>传送成功数据：&nbsp;&nbsp;<span style={{ color: '#f00' }}>{ this.props.successResult.count }</span></div>
        <Table
          columns={successColumns}
          dataSource={this.props.successResult.result}
          bordered
          size="small"
          pagination={successPagination}
          scroll={{ x: '1950px', y: this.state.successTableHeight }}
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
          size="small"
          pagination={failurePagination}
          scroll={{ x: '1950px', y: this.state.failureTableHeight }}
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
  initData: PropTypes.func.isRequired,
}
