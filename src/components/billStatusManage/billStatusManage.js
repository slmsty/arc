/**
 * Created by liangshuang on 17/12/1.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { Button, Table, message, Modal } from 'antd'
import BillStatusManageWithFrom from './billStatusManageWithFrom'
import ItemInfo from './noApplyInfo'

const data = []
for (let i = 0; i < 4; i++) {
  data.push({
    splitStatus: '已审批',
    contractInnerNo: i + 1,
    projectId: `1000${i}`,
    contractName: '合同名称test',
    tableHeight: '',
  })
}
export default class BillStatusCon extends React.Component {
  state = {
    loading: false,
    contarctSplitModal: false,
    noApplyInfoVisitable: false,
    noApplyInfoData: '',
    selectedRowKeys: '',
    selectedRows: '',
  }
  componentWillMount() {
    const screenHeight = window.screen.height
    // 屏幕高-header高64-margin8-padding12-查询条件div147.5-按钮56-翻页160
    const tableHeight = screenHeight - 8 - 12 - 147.5 - 56 - 160
    this.setState({ tableHeight })
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.contactSplitData.myContractRefresh !== nextProps.contactSplitData.myContractRefresh) {
      this.handleQuery()
    }
  }
  queryParam = {
    pageInfo: {
      pageNo: 1,
      pageSize: 10,
    },
    applayNum: '',
    applayCount: '',
    applayTime: '',
    applayStatus: '',
  }
  handleQuery = () => {
    this.setState({
      loading: true,
    })
    this.props.getContractList(this.queryParam).then((res) => {
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
    this.setState({ selectedRowKeys, selectedRows })
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
  disableItem = () => {
    if (this.state.selectedRowKeys.length === 0) {
      message.error('请选择要作废的数据')
      return
    }
    if (this.state.selectedRowKeys.length > 1) {
      message.error('一次只能作废一条数据')
      return
    }
    const that = this
    let successMsg = `传送成功${this.state.selectedRowKeys.length}条数据`
    let failMsg = `${this.state.selectedRowKeys.length}条数据传送失败，且提示失败原因`
    Modal.info({
      content: failMsg,
    })
  }
  render() {
    const columns = [{
      title: '数据状态',
      dataIndex: 'splitStatus',
      width: 150,
      textAlign: 'center',
      fixed: 'left',
    }, {
      title: '申请单编号',
      dataIndex: 'contractInnerNo',
      width: 200,
      render: (text, record) => (
        <a href='javascript:;' onClick={() => this.showApplyInfo(record)}>{text}</a>
      ),
    }, {
      title: '签约公司',
      dataIndex: 'projectId',
      width: 150,
    }, {
      title: '客户名称',
      dataIndex: 'contractName',
      width: 200,
    }, {
      title: '发票号',
      dataIndex: 'contractNo',
      width: 150,
    }, {
      title: '开票客户名称',
      dataIndex: 'contractMoney',
      width: 150,
    }, {
      title: '开票日期',
      dataIndex: 'signDate',
      width: 150,
    }, {
      title: '开票内容',
      dataIndex: 'SaleBU',
      width: 100,
    }, {
      title: '规格型号',
      dataIndex: 'projectBU',
      width: 150,
    }, {
      title: '单位',
      dataIndex: 'salePeo',
      width: 150,
    }, {
      title: '数量',
      dataIndex: 'contractDate',
      width: 150,
    }, {
      title: '单价',
      dataIndex: 'contractType',
      width: 100,
    }, {
      title: '开票金额',
      dataIndex: 'currentMoney1',
      width: 100,
    }, {
      title: '开票税率',
      dataIndex: 'currentMoney2',
      width: 100,
    }, {
      title: '开票税额',
      dataIndex: 'currentMoney3',
      width: 100,
    }, {
      title: '备注',
      dataIndex: 'currentMoney4',
      width: 100,
    }, {
      title: '创建提示',
      dataIndex: 'currentMoney5',
      width: 100,
    },
    ]
    const { selectedRowKeys } = this.state
    const rowSelection = {
      selectedRowKeys,
      type: 'checkBox',
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
    return (
      <div>
        <BillStatusManageWithFrom onQuery={this.handleChangeParam} />
        <Button onClick={this.disableItem}>作废</Button> &nbsp;&nbsp;
        <Button onClick={this.sendAp}>传送AP</Button>&nbsp;&nbsp;
        <Button onClick={this.cancelHandle}>撤销</Button>
        <br /><br />
        <Table
          rowKey="receiptClaimId"
          rowSelection={rowSelection}
          pagination={pagination}
          bordered
          columns={columns}
          size="small"
          scroll={{ x: '2400px', y: this.state.tableHeight }}
          loading={this.state.loading}
          dataSource={data}
          // dataSource={this.props.myApply.getMyApplyList.result}
        />
        <ItemInfo
          infoVisitable={this.state.noApplyInfoVisitable}
          closeClaim={this.NoApplycloseModalClaim}
          applyData={this.state.noApplyInfoData}
          applyInfoData={this.props.myApply.getMyApplyInfo}
        />
      </div>
    )
  }
}
BillStatusCon.propTypes = {
  getContractList: PropTypes.func.isRequired,
  saveContractSplitInfo: PropTypes.func.isRequired,
  contactSplitData: PropTypes.shape({
    myContractRefresh: PropTypes.number.isRequired,
  }).isRequired,
}
