/**
 * Created by liangshuang on 17/12/1.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { Button, Table, message, Modal } from 'antd'
import BillStatusManageWithFrom from './billStatusManageWithFrom'
import ItemInfo from './noApplyInfo'
import DetailModal from './calcelDetail'

export default class BillStatusCon extends React.Component {
  state = {
    loading: false,
    contarctSplitModal: false,
    noApplyInfoVisitable: false,
    noApplyInfoData: '',
    selectedRowKeys: '',
    selectedRows: {},
    billResultSelectedRowKeys: '',
    billResultSelectedRows: {},
    detailVisible: false,
    detail: '',
    tableHeight: '',
    calcelModalVisitable: false,
  }
  componentWillMount() {
    const screenHeight = window.screen.height
    // 屏幕高-header高64-margin8-padding12-查询条件div147.5-按钮56-翻页160
    const tableHeight = screenHeight - 8 - 12 - 147.5 - 56 - 160
    this.setState({ tableHeight })
  }
  componentWillReceiveProps(nextProps) {
    /* if (this.props.contactSplitData.myContractRefresh !== nextProps.contactSplitData.myContractRefresh) {
      this.handleQuery()
    } */
  }
  queryParam = {
    pageInfo: {
      pageNo: 1,
      pageSize: 10,
    },
    beginDate: '',
    endDate: '',
    status: '',
    cutomer: '',
    projectCode: '',
    contractCode: '',
    invoiceCode: '',
  }
  handleQuery = () => {
    this.setState({
      loading: true,
    })
    const param = {
      pageInfo: {
        pageNo: 1,
        pageSize: 10,
      },
      status: 'BILLING_NEW',
    }
    this.props.getBillStatusList(param).then((res) => {
      this.setState({
        loading: false,
      })
      if (res && res.response && res.response.resultCode === '000000') {
        console.log('数据查询成功')
      } else {
        message.error('加载数据失败')
      }
    })
  }
  handleChangeParam = (param) => {
    this.queryParam = { ...this.queryParam, ...param }
    this.handleQuery()
  }
  handleChangePage = (page) => {
    this.queryParam.pageInfo.pageNo = page
    this.handleQuery()
  }
  handleChangeSize = (current, size) => {
    this.queryParam.pageInfo.pageNo = current
    this.queryParam.pageInfo.pageSize = size
    this.handleQuery()
  }
  onSelectChange = (selectedRowKeys, selectedRows) => {
    this.setState({ selectedRowKeys, selectedRows }, () => {
      if (this.state.selectedRows.length > 0) {
        let billingApplicationId = this.state.selectedRows[0].billingApplicationId
        let param = {}
        param.applicationId = billingApplicationId
        this.props.getBillStatusDetail(param).then((res) => {
          if (res && res.response && res.response.resultCode === '000000') {
          } else {
            message.error('申请单详细信息查询失败')
          }
        })
        this.props.getBillStatusContractDetail(param).then((res) => {
          if (res && res.response && res.response.resultCode === '000000') {
          } else {
            message.error('申请单合同信息查询失败')
          }
        })
        this.props.getBillStatusBillResult(param).then((res) => {
          if (res && res.response && res.response.resultCode === '000000') {
          } else {
            message.error('开票结果查询失败')
          }
        })
      }
    })
  }
  onBillResultSelectChange = (selectedRowKeys, selectedRows) => {
    this.setState({
      billResultSelectedRowKeys: selectedRowKeys,
      billResultSelectedRows: selectedRows,
    })
  }
  NoApplycloseModalClaim = () => {
    this.setState({
      noApplyInfoVisitable: false,
      noApplyInfoData: '',
    })
  }
  showApplyInfo = (record) => {
    this.setState({
      noApplyInfoVisitable: true,
      noApplyInfoData: record,
    })
    const paramsData = {}
    paramsData.arcFlowId = record.arcFlowId
    paramsData.processInstanceId = record.processInstanceId
    paramsData.businessKey = record.businessKey
    paramsData.taskId = record.taskId
    /* this.props.myApplyInfo(paramsData).then((res) => {
     if (res && res.response && res.response.resultCode === '000000') {
     this.setState({
     noApplyInfoVisitable: true,
     noApplyInfoData: record,
     })
     } else {
     message.error(res.response.resultMessage)
     }
     }) */
  }
  // 撤销
  cancelHandle = () => {
    if (this.state.selectedRowKeys.length === 0) {
      message.error('请选择要撤销的数据')
      return
    }
    if (this.state.selectedRowKeys.length > 1) {
      message.error('一次只能撤销一条数据')
      return
    }
    const that = this
    Modal.confirm({
      title: '操作确认',
      content: `您确认要将所选择的${that.state.selectedRowKeys.length}条数据作废吗`,
      okText: '是',
      cancelText: '否',
      onOk() {
        const changeParam = {
          receiptClaimIds: that.state.selectedRowKeys,
          claimType: 'order',
        }
        console.log(that.state.selectedRows)
      },
    })
  }
  // 传送AP
  sendAp = () => {
    if (this.state.selectedRowKeys.length === 0) {
      message.error('请选择要传送AP的数据')
      return
    }
    const that = this
    let successMsg = `传送成功${this.state.selectedRowKeys.length}条数据`
    let failMsg = `${this.state.selectedRowKeys.length}条数据传送失败，且提示失败原因`
    Modal.info({
      content: failMsg,
    })
  }
  // 作废
  disableItem = (record) => {
    if (this.state.billResultSelectedRowKeys.length === 0) {
      message.error('请选择要作废的数据')
      return
    }
    if (this.state.billResultSelectedRowKeys.length > 1) {
      message.error('一次只能作废一条数据')
      return
    }
    this.setState({
      calcelModalVisitable: true,
    })
  }
  // 关闭作废modal
  closeDisableModal = () => {
    this.setState({
      calcelModalVisitable: false,
    })
  }
  // 查看详情
  showDetail = (record) => {
    this.setState({
      detailVisible: true,
      detail: record,
    })
  }
  render() {
    const billApprovecolumns = [{
      title: '数据状态',
      dataIndex: 'status',
      width: 80,
      textAlign: 'center',
      fixed: 'left',
    }, {
      title: '申请单编号',
      dataIndex: 'billingApplicationId',
      width: 200,
      render: (text, record) => (
        <a href='javascript:;' onClick={() => this.showApplyInfo(record)}>{text}</a>
      ),
    }, {
      title: '开票公司',
      dataIndex: 'company',
      width: 150,
    }, {
      title: '提前开票原因',
      dataIndex: 'preInvoiceReason',
      width: 150,
    }, {
      title: '预计回款日期',
      dataIndex: 'preReceiveDate',
      width: 150,
    }, {
      title: '开票要求',
      dataIndex: 'invoiceRequire',
      width: 150,
    }, {
      title: '开票客户名称',
      dataIndex: 'invoiceCustomer',
      width: 150,
    }, {
      title: '纳税人识别号',
      dataIndex: 'taxIdentifyCode',
      width: 150,
    }, {
      title: '开票日期',
      dataIndex: 'invoiceDate',
      width: 150,
    }, {
      title: '备注',
      dataIndex: 'remark',
      width: 100,
    }, {
      title: '创建提示',
      dataIndex: 'errorMessage',
      width: 100,
    },
    ]
    const billApproveInfoColumns = [
      {
        title: '开票行号',
        dataIndex: 'lineNo',
        width: 100,
      }, {
        title: '开票内容',
        dataIndex: 'billingContent',
        width: 100,
      },
      {
        title: '规格型号',
        dataIndex: 'specificationType',
        width: 100,
      },
      {
        title: '单位',
        dataIndex: 'unit',
        width: 100,
      },
      {
        title: '数量',
        dataIndex: 'quantity',
        width: 100,
      },
      {
        title: '单价',
        dataIndex: 'unitPrice',
        width: 100,
      },
      {
        title: '开票金额',
        dataIndex: 'billingAmount',
        width: 100,
      },
      {
        title: '开票税率',
        dataIndex: 'billingTaxRate',
        width: 100,
      },
      {
        title: '开票税额',
        dataIndex: 'billingTaxAmount',
        width: 100,
      },
    ]
    const billApproveItemColumns = [
      {
        title: '项目编码',
        dataIndex: 'projectCode',
        width: 100,
      },
      {
        title: '签约公司',
        dataIndex: 'company',
        width: 100,
      },
      {
        title: '合同编码',
        dataIndex: 'contractCode',
        width: 100,
      },
      {
        title: '付款条件',
        dataIndex: 'paymentTerm',
        width: 100,
      },
      {
        title: '付款条款',
        dataIndex: 'paymentName',
        width: 100,
      },
      {
        title: '付款阶段',
        dataIndex: 'paymentPhrases',
        width: 100,
      },
      {
        title: '付款金额',
        dataIndex: 'paymentAmount',
        width: 100,
      },
      {
        title: 'Billed AR金额',
        dataIndex: 'arAmount',
        width: 100,
      },
      {
        title: '已开票金额',
        dataIndex: 'invoiceAmount',
        width: 100,
      },
    ]
    const billApproveResultcolumns = [
      {
        title: '数据状态',
        dataIndex: 'status',
        width: 100,
      },
      {
        title: '发票号码',
        dataIndex: 'invoiceNumber',
        width: 100,
      },
      {
        title: '签约公司',
        dataIndex: 'invoiceCompany',
        width: 100,
      },
      {
        title: '开票客户名称',
        dataIndex: 'invoiceCustomer',
        width: 100,
      },
      {
        title: '发票类型',
        dataIndex: 'invoiceType',
        width: 100,
      },
      {
        title: '发票代码',
        dataIndex: 'invoiceCode',
        width: 100,
      },
      {
        title: '开票日期',
        dataIndex: 'invoiceDate',
        width: 100,
      },
      {
        title: '含税金额',
        dataIndex: 'taxIncludeAmount',
        width: 100,
      },
      {
        title: '税率',
        dataIndex: 'taxRate',
        width: 100,
      },
      {
        title: '不含税金额',
        dataIndex: 'taxExcludeAmount',
        width: 100,
      },
      {
        title: '操作',
        dataIndex: 'oprateion',
        width: 100,
        fixed: 'right',
        render:(text, record) => (
          <div>
            <Button onClick={() => this.disableItem(record)}>作废</Button>
          </div>
        )
      },
    ]
    const { selectedRowKeys } = this.state
    const rowSelection = {
      selectedRowKeys,
      type: 'radio',
      onChange: this.onSelectChange,
    }
    const pagination = {
      current: 1,
      total: 10,
      pageSize: 10,
      // current: this.props.myApply.getMyApplyList.pageNo,
      // total: this.props.myApply.getMyApplyList.count,
      // pageSize: this.props.myApply.getMyApplyList.pageSize,
      onChange: this.handleChangePage,
      showSizeChanger: true,
      onShowSizeChange: this.handleChangeSize,

    }
    const billResultRowSelection = {
      type: 'checkBox',
      onChange: this.onBillResultSelectChange,
    }
    return (
      <div>
        <BillStatusManageWithFrom onQuery={this.handleChangeParam} />
        <Button onClick={this.sendAp}>传送AP</Button>&nbsp;&nbsp;
        <Button onClick={this.cancelHandle}>撤销</Button>
        <br /><br />
        <h2>开票审批</h2>
        <br />
        <Table
          rowKey="receiptClaimId"
          rowSelection={rowSelection}
          pagination={pagination}
          bordered
          columns={billApprovecolumns}
          size="small"
          scroll={{ x: '1530px', y: this.state.tableHeight }}
          loading={this.state.loading}
          dataSource={this.props.billStatusManage.getBillStatusManageList.result}
        />
        <h2>开票申请详情</h2>
        <br />
        {this.props.billStatusManage.getBillStatusDetailList.length > 0 && this.state.selectedRows.length > 0 ?
          <div>
            <Table
              rowKey="receiptClaimId"
              bordered
              columns={billApproveInfoColumns}
              size="small"
              scroll={{ x: '900px', y: this.state.tableHeight }}
              loading={this.state.loading}
              dataSource={this.props.billStatusManage.getBillStatusDetailList}
            />
            <br />
          </div>
          : ''
        }
        <h2>对应项目条款</h2>
        <br />
        {this.props.billStatusManage.getBillStatusContractDetailList.length > 0 && this.state.selectedRows.length > 0 ?
          <div>
            <Table
              rowKey="receiptClaimId"
              bordered
              columns={billApproveItemColumns}
              size="small"
              scroll={{ x: '900px', y: this.state.tableHeight }}
              loading={this.state.loading}
              dataSource={this.props.billStatusManage.getBillStatusContractDetailList}
            />
            <br />
          </div>
          : ''
        }
        <h2>开票结果</h2>
        <br />
        {this.props.billStatusManage.getBillStatusBillResultList.length > 0 && this.state.selectedRows.length > 0 ?
          <Table
            rowKey="receiptClaimId"
            rowSelection={billResultRowSelection}
            bordered
            columns={billApproveResultcolumns}
            size="small"
            scroll={{ x: '1100px', y: this.state.tableHeight }}
            loading={this.state.loading}
            dataSource={this.props.billStatusManage.getBillStatusBillResultList}
          />
          : ''
        }
        <DetailModal
          visible={this.state.calcelModalVisitable}
          onOk={this.closeDisableModal}
          onCancel={this.closeDisableModal}
          data={this.state.billResultSelectedRows}
        />

      </div>
    )
  }
}
BillStatusCon.propTypes = {
  /*getBillStatusList: PropTypes.func.isRequired,
  getBillStatusManageList: PropTypes.shape({
    getBillStatusManageList: PropTypes.number.isRequired,
  }).isRequired,*/
}
