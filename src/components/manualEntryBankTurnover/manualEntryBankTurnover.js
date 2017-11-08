/* eslint-disable no-unused-vars,react/prefer-stateless-function */
import React from 'react'
import { Table, Button, message, Icon } from 'antd'
import PropTypes from 'prop-types'
import moment from 'moment'
import ManualEntryBankTurnoverSearchWithForm from './manualEntryBankTurnoverSearch'
import EditManualEntryBankTurnoverDataWithForm from './editManualEntryBankTurnoverData'

const dateFormat = 'YYYY-MM-DD'

export default class ManualEntryBankTurnover extends React.Component {
  state = {
    selectedRowKeys: [],
    editVisible: false,
    editKey: -1,
  }
  componentDidMount() {
    this.handleQuery()
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

    if (this.props.manualEntryBankTurnoverBatchConfirmResult !== nextProps.manualEntryBankTurnoverBatchConfirmResult) {
      message.info('确认成功XX条数据。')
      this.handleQuery(true)
    }

    if (this.props.manualEntryBankTurnoverBatchDeleteResult !== nextProps.manualEntryBankTurnoverBatchDeleteResult) {
      message.info('成功删除XX数据。')
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
  handleEdit = (key) => {
    this.setState({ editKey: key, editVisible: true })
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
      this.props.deleteBatchManualEntryBankTurnover({ receiptActions: this.state.selectedRowKeys.map(item => ({ receiptClaimId: item, remark: '' })) })
    }
  }
  handleBatchConfirm = () => {
    if (!this.state.selectedRowKeys.length) {
      message.error('请选择想要批量确认的数据。')
    } else {
      this.props.confirmBatchManualEntryBankTurnover({ receiptActions: this.state.selectedRowKeys.map(item => ({ receiptClaimId: item, remark: '' })) })
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
            dataIndex: 'statusDesc',
            key: 'statusDesc',
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
            dataIndex: 'receiptAmount',
            key: 'receiptAmount',
            width: 100,
            render: (text, row, index) => (<div style={{ textAlign: 'right' }}>{text}</div>),
          }, {
            title: '客户名称',
            dataIndex: 'custName',
            key: 'custName',
            width: 300,
          }, {
            title: '流水分类',
            dataIndex: 'claimTypeDesc',
            key: 'claimTypeDesc',
            width: 100,
          }, {
            title: '备注',
            dataIndex: 'cashierApproveMessage',
            key: 'cashierApproveMessage',
            width: 100,
          }, {
            title: '操作',
            dataIndex: 'ope',
            key: 'ope',
            width: 60,
            textAlign: 'center',
            fixed: 'right',
            render: (text, record) => (
              <div style={{ fontWeight: 'bold' }}>
                <Icon type="edit" onClick={() => this.handleEdit(record.receiptClaimId)} />&nbsp;&nbsp;&nbsp;&nbsp;
                <Icon type="delete" onClick={() => this.handleDelete(record.receiptClaimId)} />
              </div>
              ),
          }]}
          dataSource={this.props.manualEntryBankTurnoverList.pageInfo.result}
          bordered
          rowKey="receiptClaimId"
          size="middle"
          pagination={pagination}
          scroll={{ x: '1875px' }}
        />
        <EditManualEntryBankTurnoverDataWithForm
          onConfirm={this.handleEditConfirm}
          onCancel={this.handleEditCancel}
          visible={this.state.editVisible}
          editKey={this.state.editKey}
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
  manualEntryBankTurnoverList: PropTypes.shape({
    pageInfo: PropTypes.shape({
      pageNo: PropTypes.number.isRequired,
      count: PropTypes.number.isRequired,
      result: PropTypes.array.isRequired,
    }).isRequired,
  }).isRequired,
  manualEntryBankTurnoverConfirmResult: PropTypes.number.isRequired,
  manualEntryBankTurnoverDeleteResult: PropTypes.number.isRequired,
  manualEntryBankTurnoverBatchConfirmResult: PropTypes.number.isRequired,
  manualEntryBankTurnoverBatchDeleteResult: PropTypes.number.isRequired,
}
