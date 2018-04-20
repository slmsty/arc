/* eslint-disable no-unused-vars,react/prefer-stateless-function */
import React from 'react'
import { Table, Button, message, Icon, Popconfirm, Upload, Modal } from 'antd'
import PropTypes from 'prop-types'
import moment from 'moment'
import currency from '../../util/currency'
import ManualEntryBankTurnoverSearchWithForm from './manualEntryBankTurnoverSearch'
import EditManualEntryBankTurnoverDataWithForm from './editManualEntryBankTurnoverData'

const dateFormat = 'YYYY-MM-DD'
const confirm = Modal.confirm

export default class ManualEntryBankTurnover extends React.Component {
  state = {
    selectedRowKeys: [],
    editVisible: false,
    editKey: -1,
    tableHeight: '',
  }
  componentWillMount() {
    const screenHeight = window.screen.height
    // 屏幕高-header高64-margin8-padding12-查询条件div168-按钮56-翻页160
    const tableHeight = screenHeight - 64 - 8 - 12 - 81 - 28 - 18 - 21 - 32
    this.setState({ tableHeight })
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.manualEntryBankTurnoverConfirmResult !== nextProps.manualEntryBankTurnoverConfirmResult) {
      message.info('保存成功。')
      this.setState({ editVisible: false })
      this.handleQuery(true)
    }

    if (this.props.manualEntryBankTurnoverDeleteResult !== nextProps.manualEntryBankTurnoverDeleteResult) {
      message.info('数据已经删除成功！')
      this.handleQuery(true)
    }

    if (this.props.manualEntryBankTurnoverBatchConfirmResult.time !== nextProps.manualEntryBankTurnoverBatchConfirmResult.time) {
      const result = nextProps.manualEntryBankTurnoverBatchConfirmResult
      let msg = result.data.successNum ? `确认成功${result.data.successNum}条数据` : ''
      msg = msg.length ? `${msg}，` : ''
      msg = result.data.failureNum ? `${msg}确认失败${result.data.failureNum}条数据` : msg
      message.info(msg)
      this.handleQuery(true)
    }

    if (this.props.manualEntryBankTurnoverBatchDeleteResult !== nextProps.manualEntryBankTurnoverBatchDeleteResult) {
      message.info(`成功删除${this.state.selectedRowKeys.length}条数据。`)
      this.handleQuery(true)
    }

    if (this.props.deleteAttachmentResult !== nextProps.deleteAttachmentResult) {
      message.info('成功删除附件。')
      this.handleQuery(true)
    }
  }
  queryParam = {
    pageInfo: {
      pageNo: 1,
      pageSize: 10,
    },
    receiptDateStart: '',
    receiptDateEnd: '',
    custId: '',
    receiptMethodId: '10',
    sourceType: 'manual',
    status: '',
  }
  handleSelectChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys })
  }
  handleChangeParam = (param) => {
    this.queryParam = { ...this.queryParam, ...param }
    this.handleQuery(true)
  }
  handleQuery = (isReset) => {
    if (isReset) {
      this.queryParam.pageInfo = {
        pageNo: 1,
        pageSize: 10,
      }
    }
    this.setState({ selectedRowKeys: [] })
    this.props.getManualEntryBankTurnoverList(this.queryParam)
  }
  handleEdit = (record) => {
    if ((record.custPayMethod === 'bank_acceptance' || record.custPayMethod === 'trade_acceptance') &&
      (!record.filePath || record.filePath.length === 0)) {
      message.error('请先上传附件后再进行编辑。')
    } else {
      this.props.initEditData(record.receiptClaimId)
      this.setState({ editKey: record.receiptClaimId, editVisible: true })
    }
  }
  handleDelete = (key) => {
    const param = {
      receiptAction: {
        receiptClaimId: key,
        remark: '',
      },
    }
    this.props.deleteManualEntryBankTurnover(param)
  }
  handleBatchDelete = () => {
    if (!this.state.selectedRowKeys.length) {
      message.error('请选择想要批量删除的数据。')
    } else {
      confirm({
        title: '您确定要删除选中的记录吗？',
        content: '',
        okText: '是',
        okType: 'danger',
        cancelText: '否',
        onOk: () => {
          this.props.deleteBatchManualEntryBankTurnover({ receiptActions: this.state.selectedRowKeys.map(item => ({ receiptClaimId: item, remark: '' })) })
        },
      })
    }
  }
  handleBatchConfirm = () => {
    if (!this.state.selectedRowKeys.length) {
      message.error('请选择想要批量确认的数据。')
    } else {
      let hasError = false
      this.props.manualEntryBankTurnoverList.pageInfo.result.forEach((item) => {
        if (this.state.selectedRowKeys.indexOf(item.receiptClaimId) >= 0) {
          if ((item.custPayMethod === 'bank_acceptance' || item.custPayMethod === 'trade_acceptance') && (!item.filePath || item.filePath.length === 0)) {
            message.error('付款方式为“银行承兑汇票”或“商业承兑汇票”时，请上传附件后再进行确认。')
            hasError = true
            return false
          }
        }
        return true
      })

      if (!hasError) {
        this.props.confirmBatchManualEntryBankTurnover({ receiptActions: this.state.selectedRowKeys.map(item => ({ receiptClaimId: item, remark: '' })) })
      }
    }
  }
  handleEditConfirm = (confirmList) => {
    this.props.confirmManualEntryBankTurnover({ manualReceiptConfirmInfo: confirmList })
  }
  handleEditCancel = () => {
    this.setState({ editVisible: false })
  }
  handleChangePage = (page) => {
    this.queryParam.pageInfo.pageNo = page
    this.handleQuery()
  }
  handleUploaded = (info) => {
    if (info.file.status === 'done') {
      if (info.file.response.resultCode !== '000000') {
        message.error(info.file.response.resultMessage)
      } else {
        message.info('附件上传成功。')
        this.handleQuery(true)
      }
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} 附件上传时发生系统错误。`)
    }
  }
  handleFileDownload = (filepath, filename) => {
    this.props.fileDown(filepath, filename)
  }
  handleDeleteFile = (receiptClaimId) => {
    this.props.deleteAttachment(receiptClaimId)
  }
  render() {
    const { selectedRowKeys } = this.state
    const rowSelection = {
      type: 'checkBox',
      selectedRowKeys,
      onChange: this.handleSelectChange,
    }
    const pagination = {
      current: this.props.manualEntryBankTurnoverList.pageInfo.pageNo || 1,
      onChange: this.handleChangePage,
      total: this.props.manualEntryBankTurnoverList.pageInfo.count,
    }
    return (
      <div>
        <ManualEntryBankTurnoverSearchWithForm
          query={this.handleChangeParam}
        />
        <Button type="default" onClick={() => { this.props.history.push('/receiptManagement/manualEntryBankTurnover/batchImport') }}>批量导入</Button>&nbsp;&nbsp;
        <Button type="default" onClick={this.handleBatchDelete}>删除</Button>&nbsp;&nbsp;
        <Button type="primary" onClick={this.handleBatchConfirm}>确认</Button>
        <br /><br />
        <Table
          rowSelection={rowSelection}
          columns={[{
            title: '数据状态',
            dataIndex: 'statusName',
            key: 'statusName',
            width: 80,
            fixed: 'left',
          }, {
            title: '收款日期',
            dataIndex: 'receiptDate',
            key: 'receiptDate',
            width: 90,
            render: (text, row, index) => moment(text).format(dateFormat),
          }, {
            title: '收款方法',
            dataIndex: 'erpReceiptMethodName',
            key: 'erpReceiptMethodName',
            width: 100,
          }, {
            title: '银行流水号',
            dataIndex: 'bankTransactionNo',
            key: 'bankTransactionNo',
            width: 150,
          }, {
            title: '付款方式',
            dataIndex: 'custPayMethodName',
            key: 'custPayMethodName',
            width: 100,
          }, {
            title: '相关票据',
            dataIndex: 'relatedBill',
            key: 'relatedBill',
            width: 100,
          }, {
            title: '解付状态',
            dataIndex: 'paidStatusName',
            key: 'paidStatusName',
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
            dataIndex: 'receiptCurrency',
            key: 'receiptCurrency',
            width: 45,
          }, {
            title: '金额',
            dataIndex: 'receiptAmount',
            key: 'receiptAmount',
            width: 100,
            render: text => (<div style={{ textAlign: 'right' }}>{text ? currency(text) : currency(0)}</div>),
          }, {
            title: '客户名称',
            dataIndex: 'custName',
            key: 'custName',
            width: 300,
          }, {
            title: '流水分类',
            dataIndex: 'claimTypeName',
            key: 'claimTypeName',
            width: 100,
          }, {
            title: '附件',
            dataIndex: 'attachment',
            key: 'attachment',
            width: 200,
            render: (text, record) => (
              record.filePath ?
                <span>
                  <a href="javascript:void(0)" onClick={() => this.handleFileDownload(record.filePath, record.fileName)}>{record.fileName}</a>&nbsp;
                  <Icon type="close-circle" onClick={() => this.handleDeleteFile(record.receiptClaimId)} />
                </span> :
                ''
            ),
          }, {
            title: '备注',
            dataIndex: 'cashierApproveMessage',
            key: 'cashierApproveMessage',
            width: 100,
          }, {
            title: '操作',
            dataIndex: 'ope',
            key: 'ope',
            width: 80,
            textAlign: 'center',
            fixed: 'right',
            render: (text, record) => (
              <div style={{ fontWeight: 'bold' }}>
                <Icon type="edit" onClick={() => this.handleEdit(record)} />&nbsp;&nbsp;&nbsp;&nbsp;
                <Popconfirm title="您确定要删除这条记录吗？" onConfirm={() => this.handleDelete(record.receiptClaimId)} okText="是" cancelText="否">
                  <Icon type="delete" />
                </Popconfirm>&nbsp;&nbsp;&nbsp;&nbsp;
                <Upload
                  action={`${process.env.REACT_APP_GATEWAY}v1.0.0/arc/receiptclaim/uploadAttachment`}
                  data={{ receiptClaimId: record.receiptClaimId }}
                  multiple={false}
                  showUploadList={false}
                  headers={{ Authorization: sessionStorage.getItem('token') }}
                  onChange={this.handleUploaded}
                >
                  <Icon type="upload" />
                </Upload>
              </div>
              ),
          }]}
          dataSource={this.props.manualEntryBankTurnoverList.pageInfo.result}
          bordered
          rowKey="receiptClaimId"
          size="small"
          pagination={pagination}
          scroll={{ x: '2295px', y: this.state.tableHeight }}
        />
        <EditManualEntryBankTurnoverDataWithForm
          onConfirm={this.handleEditConfirm}
          onCancel={this.handleEditCancel}
          visible={this.state.editVisible}
          editKey={this.state.editKey}
          initData={this.props.initSingleReceiptResult}
        />
      </div>
    )
  }
}

ManualEntryBankTurnover.propTypes = {
  getManualEntryBankTurnoverList: PropTypes.func.isRequired,
  confirmManualEntryBankTurnover: PropTypes.func.isRequired,
  deleteManualEntryBankTurnover: PropTypes.func.isRequired,
  confirmBatchManualEntryBankTurnover: PropTypes.func.isRequired,
  deleteBatchManualEntryBankTurnover: PropTypes.func.isRequired,
  fileDown: PropTypes.func.isRequired,
  manualEntryBankTurnoverList: PropTypes.shape({
    pageInfo: PropTypes.shape({
      pageNo: PropTypes.number.isRequired,
      count: PropTypes.number.isRequired,
      result: PropTypes.array.isRequired,
    }).isRequired,
  }).isRequired,
  manualEntryBankTurnoverConfirmResult: PropTypes.number.isRequired,
  manualEntryBankTurnoverDeleteResult: PropTypes.number.isRequired,
  deleteAttachmentResult: PropTypes.number.isRequired,
  manualEntryBankTurnoverBatchConfirmResult: PropTypes.shape({
    data: PropTypes.shape({
      successNum: PropTypes.number.isRequired,
      failureNum: PropTypes.number.isRequired,
    }).isRequired,
    time: PropTypes.number.isRequired,
  }).isRequired,
  manualEntryBankTurnoverBatchDeleteResult: PropTypes.number.isRequired,
  initEditData: PropTypes.func.isRequired,
  deleteAttachment: PropTypes.func.isRequired,
  initSingleReceiptResult: PropTypes.shape().isRequired,
}
