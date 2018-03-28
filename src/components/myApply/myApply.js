/**
 * Created by liangshuang on 18/3/21.
 */
import React from 'react'
import { Button, Table, message, Modal } from 'antd'
import ApplySearchConWithForm from './applyListWithSearch'
import NoApplyInfo from './noApplyInfo'
import MyApplyEdit from './myApplyEdit'
import BillDetail from '../billApplication/billDetail'
import { redTypes } from '../billApplication/billColumns'
const confirm = Modal.confirm;

export default class MyApplyCon extends React.Component {
  state = {
    infoVisitable: false,
    loading: false,
    applyData: '',
    noApplyInfoVisitable: false,
    noApplyInfoData: '',
    editVisitable:false
  }

  componentDidMount() {
    this.handleQuery()
  }

  componentWillReceiveProps(nextProps) {
    if(this.props.billSaveSuccess !== nextProps.billSaveSuccess && nextProps.billSaveSuccess) {
      message.success('申请成功，已重新发起审批流程')
      this.setState({editVisitable: false})
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
    status: 'approve',
  }
  handleQuery = () => {
    this.setState({
      loading: true,
    })
    this.props.myApplyList(this.queryParam).then((res) => {
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
          editVisitable: true,
          applyData: record,
        })
        this.props.getContractUrl(res.response.data.serviceDetail.contractId)
      }
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
  // 撤销
  cancelItem = (record) => {
    const that = this
    Modal.confirm({
      title: '操作确认',
      content: `您确认要将所选择的数据撤销吗`,
      okText: '是',
      cancelText: '否',
      onOk() {
        const changeParam = {
          businessKey: record.businessKey,
        }
        that.props.cancelApply(changeParam).then((res)=>{
          if (res && res.response && res.response.resultCode === '000000') {
            message.success('撤销成功')
            that.handleQuery()
          } else {
            message.error(res.response.resultMessage)
          }
        })
      },
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
          <Button type="primary" ghost style={{display:record.statusName === '审批中' ? 'block' : 'none' }} onClick={() => this.cancelItem(record)}>撤销</Button>
          <Button type="primary" ghost style={{display:record.statusName === '驳回' || record.statusName === '撤销' ? 'block' : 'none' }} onClick={() => this.approveClick(record)}>编辑</Button>
        </div>
      ),
    },
    ]
    const pagination = {
      current: this.props.myApplyPage.pageNo,
      total: this.props.myApplyPage.count,
      pageSize: this.props.myApplyPage.pageSize,
      onChange: this.handleChangePage,
      showSizeChanger: true,
      onShowSizeChange: this.handleChangeSize,
    }
    const { billApplySave, billApplyCheck, currentUser, contractUrl, myApplyPage, myApplyDetail, billApproveSave } = this.props
    const { serviceDetail, serviceType} = myApplyDetail
    const isBackBill = redTypes.includes(serviceType)
    return (
      <div>
        <ApplySearchConWithForm
          type="myApply"
          onQuery={this.handleChangeParam}
          loading={this.state.loading}
        />
        {
          this.state.editVisitable ?
            <BillDetail
              onCancel={() => this.setState({editVisitable: false})}
              detail={serviceDetail}
              billType={serviceType}
              billApplySave={billApproveSave}
              billApplyCheck={billApplyCheck}
              currentUser={currentUser}
              contractUrl={contractUrl}
              isRed={isBackBill}
              type="myApply"
            /> : null
        }
        {
          this.state.noApplyInfoVisitable ?
            <NoApplyInfo
              infoVisitable={this.state.noApplyInfoVisitable}
              closeClaim={this.NoApplycloseModalClaim}
              applyData={this.state.noApplyInfoData}
              applyInfoData={myApplyDetail}
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
          dataSource={myApplyPage.result}
        />
      </div>
    )
  }
}
