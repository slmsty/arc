/**
 * Created by liangshuang on 17/12/1.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { Button, Table, message } from 'antd'
import ApplySearchConWithForm from './applyListWithSearch'
import ApplyInfoModal from './applyInfo'

export default class ApplySearchCon extends React.Component {
  state = {
    infoVisitable: false,
    loading: false,
    applyData: '',
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
    applyDate: '',
    status: '',
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
        console.log(res)
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
  approveClick = (_record) => {
    this.setState({
      infoVisitable: true,
      applyData: _record,
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
      message.success('测试审批成功')
      return
      if (res && res.response && res.response.resultCode === '000000') {
        message.success('审批成功')
      } else {
        message.error('加载数据失败')
      }
    })
  }
  /*
   function applyReject
   审批驳回
   */
  applyReject = () => {
    this.setState({
      infoVisitable: false,
      applyData: '',
    })
    message.success('测试驳回成功')
    return
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
  render() {

    const columns = [{
      title: '序号',
      dataIndex: 'Num',
      width: 50,
      textAlign: 'center',
      fixed: 'left',
    }, {
      title: '申请单编号',
      dataIndex: 'businessKey',
      width: 200,
    }, {
      title: '审批状态',
      dataIndex: 'statusName',
      width: 100,
    }, {
      title: '申请单类型',
      dataIndex: 'modelName',
      width: 100,
    }, {
      title: '申请信息',
      dataIndex: 'applyInfo',
      width: 250,
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
      width: 150,
    }, {
      title: '审批时间',
      dataIndex: 'approveDate',
      width: 150,
    }, {
      title: '操作',
      dataIndex: 'opration',
      width: 80,
      fixed: 'right',
      render: (text, record, index) => (
        <div style={{ fontWeight: 'bold', textAlign: 'center' }}>
          <Button onClick={() => this.approveClick(record)}>审批</Button>
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
    const { selectedRowKeys } = this.state
    return (
      <div>
        <ApplySearchConWithForm onQuery={this.handleChangeParam} />
        <ApplyInfoModal
          infoVisitable={this.state.infoVisitable}
          closeClaim={this.closeModalClaim}
          applyComfirm={this.applyComfirm}
          applyReject={this.applyReject}
          applyData={this.state.applyData}
        />
        <br /><br />
        <Table
          rowKey="id"
          pagination={pagination}
          bordered
          columns={columns}
          size="middle"
          scroll={{ x: '1630px' }}
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
  myApply: PropTypes.shape({
    myapplyListRefresh: PropTypes.number.isRequired,
  }).isRequired,
}
