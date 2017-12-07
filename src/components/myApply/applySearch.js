/**
 * Created by liangshuang on 17/12/1.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { Button, Table, message } from 'antd'
import ApplySearchConWithForm from './applyListWithSearch'
import ApplyInfoModal from './applyInfo'

const data = []
for (let i = 0; i < 4; i++) {
  data.push({
    splitStatus: '已拆分合同',
    contractInnerNo: i + 1,
    projectId: i + 1,
    contractName: '合同名称',
  })
}
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
    applayNum: '',
    applayCount: '',
    applayTime: '',
    applayStatus: '',
  }
  handleQuery = () => {
    this.setState({
      loading: true,
    })
    console.log(this.queryParam)
    message.success('测试成功')
    return
    this.props.getMyApplyList(this.queryParam).then((res) => {
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
  /*
   function approveClick
   */
  approveClick = (_record) => {
    this.setState({
      infoVisitable: true,
      applyData: _record,
    })
  }
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
  applyReject = () => {
    this.setState({
      infoVisitable: false,
      applyData: '',
    })
    message.success('测试驳回成功')
    return
  }
  closeModalClaim = () => {
    this.setState({
      infoVisitable: false,
      applyData: '',
    })
  }
  render() {
    const columns = [{
      title: '拆分状态',
      dataIndex: 'splitStatus',
      width: 150,
      textAlign: 'center',
      fixed: 'left',
    }, {
      title: '合同内部编码',
      dataIndex: 'contractInnerNo',
      width: 200,
    }, {
      title: '项目编码',
      dataIndex: 'projectId',
      width: 150,
    }, {
      title: '合同名称',
      dataIndex: 'contractName',
      width: 200,
    }, {
      title: '合同编码',
      dataIndex: 'contractNo',
      width: 150,
    }, {
      title: '合同金额',
      dataIndex: 'contractMoney',
      width: 150,
      render: (text, record, index) => (text ? text.toFixed(2) : text),
    }, {
      title: '签约日期',
      dataIndex: 'signDate',
      width: 150,
    }, {
      title: 'Sale签约BU',
      dataIndex: 'SaleBU',
      width: 100,
    }, {
      title: '立项BU',
      dataIndex: 'projectBU',
      width: 150,
    }, {
      title: '销售人员',
      dataIndex: 'salePeo',
      width: 150,
    }, {
      title: '合同生效日',
      dataIndex: 'contractDate',
      width: 150,
    }, {
      title: '合同种类',
      dataIndex: 'contractType',
      width: 100,
    }, {
      title: '币种',
      dataIndex: 'currentMoney',
      width: 100,
    },
    ]
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
    const { selectedRowKeys } = this.state
    const rowSelection = {
      selectedRowKeys,
      type: 'checkBox',
      // onChange: this.onSelectChange,
    }
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
          rowSelection={rowSelection}
          pagination={pagination}
          bordered
          columns={columns}
          size="middle"
          scroll={{ x: '1900px' }}
          loading={this.state.loading}
          dataSource={data}
          // dataSource={this.props.myApply.getMyApplyList.result}
        />
      </div>
    )
  }
}
ApplySearchCon.propTypes = {
  getMyApplyList: PropTypes.func.isRequired,
  approveSubmit: PropTypes.func.isRequired,
  myApply: PropTypes.shape({
    myapplyListRefresh: PropTypes.number.isRequired,
  }).isRequired,
}
