/**
 * Created by liangshuang on 17/12/1.
 */
import React from 'react'
import { Button, Table, message } from 'antd'
import ApplySearchConWithForm from './applyListWithSearch'
import ApplyInfoModal from './applyInfo'
import NoApplyInfo from './noApplyInfo'

export default class ApplySearchCon extends React.Component {
  state = {
    infoVisitable: false,
    loading: false,
    applyData: '',
    noApplyInfoVisitable: false,
    noApplyInfoData: '',
  }
  componentDidMount() {
    this.handleQuery()
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.myApply.myapplyListRefresh !== nextProps.myApply.myapplyListRefresh) {
      this.handleQuery()
    }
  }
  queryParam = {
    pageInfo: {
      pageNo: 1,
      pageSize: 10,
    },
    businessKey: '',
    applyPersonKeyword: '',
    applyDate: 'ALL',
    status: 'approve',
  }
  handleQuery = () => {
    this.setState({
      loading: true,
    })
    this.props.getMyApplyList(this.queryParam).then((res) => {
      this.setState({
        loading: false,
      })
      if (res && res.response && res.response.resultCode === '000000') {
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
  /*
   function approveClick
   */
  approveClick = (record) => {
    const paramsData = {}
    paramsData.arcFlowId = record.arcFlowId
    paramsData.processInstanceId = record.processInstanceId
    paramsData.businessKey = record.businessKey
    paramsData.taskId = record.taskId
    this.props.myApplyInfo(paramsData).then((res) => {
      if (res && res.response && res.response.resultCode === '000000') {
        this.setState({
          infoVisitable: true,
          applyData: record,
        })
        this.props.getContractUrl(res.response.data.serviceDetail.contractId)
      } else {
        message.error(res.response.resultMessage, 5)
      }
    })
  }

  /*
   function closeModalClaim
   关闭详情modal
   */
  closeModalClaim = () => {
    this.setState({
      infoVisitable: false,
      applyData: '',
    })
  }
  showApplyInfo = (record) => {
    const paramsData = {}
    paramsData.arcFlowId = record.arcFlowId
    paramsData.processInstanceId = record.processInstanceId
    paramsData.businessKey = record.businessKey
    paramsData.taskId = record.taskId
    this.props.myApplyInfo(paramsData).then((res) => {
      if (res && res.response && res.response.resultCode === '000000') {
        this.setState({
          noApplyInfoVisitable: true,
          noApplyInfoData: record,
        })
        this.props.getContractUrl(res.response.data.serviceDetail.contractId)
      }
    })
  }
  NoApplycloseModalClaim = () => {
    this.setState({
      noApplyInfoVisitable: false,
      noApplyInfoData: '',
    })
  }
  render() {
    const columns = [{
      title: '申请单编号',
      dataIndex: 'businessKey',
      width: 100,
      render: (text, record) => (
        <a href="javascript:void(0);" onClick={() => this.showApplyInfo(record)}>{text}</a>
      ),
    }, {
      title: '审批状态',
      dataIndex: 'statusName',
      width: 80,
    }, {
      title: '申请单类型',
      dataIndex: 'modelName',
      width: 150,
    }, {
      title: '申请信息',
      dataIndex: 'applyInfo',
      width: 350,
    }, {
      title: '审批结果',
      dataIndex: 'approveType',
      width: 100,
    }, {
      title: '审批意见',
      dataIndex: 'approveRemark',
      width: 300,
    }, {
      title: '申请人',
      dataIndex: 'applyPersonName',
      width: 100,
    }, {
      title: '申请时间',
      dataIndex: 'applyDate',
      width: 140,
    }, {
      title: '审批时间',
      dataIndex: 'approveDate',
      width: 140,
    }, {
      title: '操作',
      dataIndex: 'opration',
      width: 80,
      fixed: 'right',
      render: (text, record, index) => (
        <div style={{ fontWeight: 'bold', textAlign: 'center' }}>
          {/* disabled={record.statusName === '审批中' ? 'false' : 'true'} */}
          <Button type="primary" ghost disabled={record.statusName === '审批中' ? false : true} onClick={() => this.approveClick(record)}>审批</Button>
        </div>
      ),
    },
    ]
    const { pageNo, count, pageSize } = this.props.myApply.getMyApplyList
    const pagination = {
      current: pageNo,
      total: count,
      showTotal: (total) => (`共 ${total} 条`),
      pageSize: pageSize,
      onChange: this.handleChangePage,
      showSizeChanger: true,
      onShowSizeChange: this.handleChangeSize,

    }
    const { billSaveSuccess, applicationIds } = this.props.myApply
    return (
      <div>
        <ApplySearchConWithForm onQuery={this.handleChangeParam} loading={this.state.loading} />
        {
          this.state.infoVisitable ?
            <ApplyInfoModal
              infoVisitable={this.state.infoVisitable}
              closeClaim={this.closeModalClaim}
              approveComfirm={this.props.approveSubmit}
              approveReject={this.props.approveReject}
              applyData={this.state.applyData}
              applyInfoData={this.props.myApply.getMyApplyInfo}
              billApplySave={this.props.billApproveSave}
              billSaveSuccess={billSaveSuccess}
              applicationIds={applicationIds}
              getContractUrl={this.props.getContractUrl}
              contractUrl={this.props.contractUrl}
              fileDown={this.props.fileDown}
            /> : null
        }
        {
          this.state.noApplyInfoVisitable ?
            <NoApplyInfo
              infoVisitable={this.state.noApplyInfoVisitable}
              closeClaim={this.NoApplycloseModalClaim}
              applyData={this.state.noApplyInfoData}
              applyInfoData={this.props.myApply.getMyApplyInfo}
              fileDown={this.props.fileDown}
              getContractUrl={this.props.getContractUrl}
              contractUrl={this.props.contractUrl}
            /> : null
        }
        <br /><br />
        <Table
          rowKey="processInstanceId"
          pagination={pagination}
          bordered
          columns={columns}
          size="small"
          scroll={{ x: '1610px' }}
          loading={this.state.loading}
          dataSource={this.props.myApply.getMyApplyList.result}
        />
      </div>
    )
  }
}
