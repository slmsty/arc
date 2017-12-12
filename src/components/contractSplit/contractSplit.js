/**
 * Created by liangshuang on 17/12/1.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { Button, Table, message } from 'antd'
import ContractSplitWithFrom from './contractSplitWithFrom'
import ContractSplitModal  from './contractSplitModal'

const data = []
for (let i = 0; i < 4; i++) {
  data.push({
    splitStatus: '已拆分',
    contractInnerNo: i + 1,
    projectId: `1000${i}`,
    contractName: '合同名称test',
  })
}
export default class ApplySearchCon extends React.Component {
  state = {
    loading: false,
    contarctSplitModal: false,
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
    this.props.getMyApplyList(this.queryParam).then((res) => {
      this.setState({
        loading: false,
      })
      console.log(this.queryParam)
      message.success('测试成功')
      return
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
   function contractSplitInfo
   */
  contractSplitInfo = () => {
    this.setState({
      contarctSplitModal: true,
    })
    message.success('测试成功')
    return
    this.props.approveSubmit().then((res) => {
      this.setState({
        loading: false,
      })
      if (res && res.response && res.response.resultCode === '000000') {
        message.success('审批成功')
      } else {
        message.error('加载数据失败')
      }
    })
  }
  onSelectChange = (selectedRowKeys, selectedRows) => {
    this.setState({ selectedRowKeys, selectedRows })
  }
  /*
   function closeModalClaim
   关闭详情modal
   */
  closeModalClaim = () => {
    this.setState({
      contarctSplitModal: false,
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
        <ContractSplitWithFrom onQuery={this.handleChangeParam} />
        <br /><br />
        <Button type="primary" onClick={this.contractSplitInfo}>合同拆分</Button>
        <br /><br />
        <ContractSplitModal
          ModalVisible={this.state.contarctSplitModal}
          closeModal={this.closeModalClaim}
          />
        <Table
          rowKey="receiptClaimId"
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
