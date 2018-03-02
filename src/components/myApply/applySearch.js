/**
 * Created by liangshuang on 17/12/1.
 */
import React from 'react'
import PropTypes from 'prop-types'
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
      } else {
        message.error(res.response.resultMessage)
      }
    })
  }
  /*
   function applyComfirm
   审批同意
   */
  applyComfirm = (param) => {
    this.props.approveSubmit(param).then((res) => {
      this.setState({
        loading: false,
        infoVisitable: false,
        applyData: '',
      })
      if (res && res.response && res.response.resultCode === '000000') {
        message.success('审批成功')
      } else {
        message.error(res.response.resultMessage)
      }
    })
  }
  /*
   function applyReject
   审批驳回
   */
  applyReject = (param) => {
    this.props.approveReject(param).then((res) => {
      this.setState({
        loading: false,
        infoVisitable: false,
        applyData: '',
      })
      if (res && res.response && res.response.resultCode === '000000') {
        message.success('驳回成功')
      } else {
        message.error(res.response.resultMessage)
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
      width: 120,
      render: (text, record) => (
        <a href='javascript:;' onClick={() => this.showApplyInfo(record)}>{text}</a>
      ),
    }, {
      title: '审批状态',
      dataIndex: 'statusName',
      width: 100,
    }, {
      title: '申请单类型',
      dataIndex: 'modelName',
      width: 120,
    }, {
      title: '申请信息',
      dataIndex: 'applyInfo',
      width: 300,
    }, {
      title: '审批结果',
      dataIndex: 'approveType',
      width: 150,
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
          <Button disabled={record.statusName === '审批中' ? false : true} onClick={() => this.approveClick(record)}>审批</Button>
        </div>
      ),
    },
    ]
    const pagination = {
      current: this.props.myApply.getMyApplyList.pageNo,
      total: this.props.myApply.getMyApplyList.count,
      pageSize: this.props.myApply.getMyApplyList.pageSize,
      onChange: this.handleChangePage,
      showSizeChanger: true,
      onShowSizeChange: this.handleChangeSize,

    }
    const { billSaveSuccess } = this.props.myApply
    return (
      <div>
        <ApplySearchConWithForm onQuery={this.handleChangeParam} loading={this.state.loading} />
        {
          this.state.infoVisitable ?
            <ApplyInfoModal
              infoVisitable={this.state.infoVisitable}
              closeClaim={this.closeModalClaim}
              applyComfirm={this.applyComfirm}
              applyReject={this.applyReject}
              applyData={this.state.applyData}
              applyInfoData={this.props.myApply.getMyApplyInfo}
              billApplySave={this.props.billApplySave}
              billSaveSuccess={billSaveSuccess}
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
            /> : null
        }
        <br /><br />
        <Table
          rowKey="getMyApplyList"
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
ApplySearchCon.propTypes = {
  getMyApplyList: PropTypes.func.isRequired,
  approveSubmit: PropTypes.func.isRequired,
  approveReject: PropTypes.func.isRequired,
  myApplyInfo: PropTypes.func.isRequired,
  myApply: PropTypes.shape({
    myapplyListRefresh: PropTypes.number.isRequired,
    getMyApplyList: PropTypes.object.isRequired,
    getMyApplyInfo: PropTypes.object.isRequired,
  }).isRequired,
}
