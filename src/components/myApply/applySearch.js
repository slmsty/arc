/**
 * Created by liangshuang on 17/12/1.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { Form, Row, Col, Button, Input, Table, Icon, Radio, message } from 'antd'
import ApplySearchConWithForm from './applyListWithSearch'

const FormItem = Form.Item
const RadioButton = Radio.Button
const RadioGroup = Radio.Group
const data = []
for (let i = 0; i < 4; i++) {
  data.push({
    key: i,
    Num: i + 1,
    applyNo: `1000${i}`,
    applyStatus: '审批中',
  })
}
export default class ApplySearchCon extends React.Component {
  state = {
    loading: false,
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
   function approveClick
   */
  approveClick = (_record) => {
    message.success('测试成功')
    return
    this.props.approveSubmit(_record).then((res) => {
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
  render() {
    const columns = [{
      title: '序号',
      dataIndex: 'Num',
      width: 50,
      textAlign: 'center',
      fixed: 'left',
    }, {
      title: '申请单编号',
      dataIndex: 'applyNo',
      width: 200,
    }, {
      title: '审批状态',
      dataIndex: 'applyStatus',
      width: 100,
    }, {
      title: '申请单类型',
      dataIndex: 'applyType',
      width: 100,
    }, {
      title: '申请信息',
      dataIndex: 'applyNews',
      width: 250,
    }, {
      title: '审批结果',
      dataIndex: 'applyResult',
      width: 150,
    }, {
      title: '审批意见',
      dataIndex: 'applyOpinion',
      width: 300,
    }, {
      title: '申请人',
      dataIndex: 'applyPeo',
      width: 100,
    }, {
      title: '申请时间',
      dataIndex: 'applyTime',
      width: 150,
    }, {
      title: '审批时间',
      dataIndex: 'approveTime',
      width: 150,
    }, {
      title: '操作',
      dataIndex: 'opration',
      width: 80,
      fixed: 'right',
      render: (text, record, index) => (
        <div style={{ fontWeight: 'bold', textAlign: 'center' }}>
          <Button onClick={this.approveClick.bind(this, record)}>审批</Button>
        </div>
      ),
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
    return (
      <div>
        <ApplySearchConWithForm onQuery={this.handleChangeParam} />
        <br /><br />
        <Table
          rowKey="receiptClaimId"
          pagination={pagination}
          bordered
          columns={columns}
          size="middle"
          scroll={{ x: '1630px' }}
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
