import React from 'react'
import { Button, Row, Col, Table, Modal, Icon, message } from 'antd'
import BigSignAuditDetail from './bigSignAuditDetail'
import BigSignAuditForm from './bigSignAuditForm'

const billApproveColumns = [
  {
    title: '数据状态',
    dataIndex: 'statusName',
    width: 120,
    textAlign: 'center',
    fixed: 'left',
  }, {
    title: '开票申请分类',
    dataIndex: 'billingApplicationTypeName',
    width: 180,
  }, {
    title: '申请单编号',
    dataIndex: 'billingApplicationId',
    width: 150,
  }, {
    title: '开票公司',
    dataIndex: 'comName',
    width: 300,
  }, {
    title: '开票要求',
    dataIndex: 'billingApplicantRequest',
    width: 300,
  }, {
    title: '开票客户名称',
    dataIndex: 'custName',
    width: 300,
  }, {
    title: '开票申请日期',
    dataIndex: 'billingApplicantDate',
    width: 130,
  }, {
    title: '开票日期',
    dataIndex: 'billingDate',
    width: 130,
  }, {
    title: '备注',
    dataIndex: 'remark',
    width: 300,
  }, {
    title: '创建提示',
    dataIndex: 'errorMessage',
    width: 100,
  },
]
class BigSignAudit extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      dataSource: [],
      loading: false,
      selectedRows: [],
      showApproveDetail: false,
    }
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.billStartSuccess && this.props.billStartSuccess !== nextProps.billStartSuccess) {
      message.success('发起审核流程成功!')
      this.props.searchContractBilling()
    }
  }

  getBillInfo = () => {
    this.setState({showApproveDetail: true})
    this.props.getApplicationDetail(this.state.selectedRows[0].billingApplicationId)
  }

  render() {
    const rowSelection = {
      type: 'radio',
      onChange: (selectedRowKeys, selectedRows) => {
        this.setState({
          selectedRows,
        })
      },
    }
    const { searchLoading, billContracts, billStartWorkFlow, billApplySave, applicationInfo } = this.props
    return (
      <Modal
        title="开票审核"
        width="1100px"
        style={{ top: 20 }}
        visible={true}
        footer={false}
        wrapClassName="vertical-center-modal"
        onCancel={() => this.props.onCancel()}
      >
        <BigSignAuditForm />
        <div style={{margin: '10px 0',}}>
          <Button type="primary" ghost onClick={() => this.getBillInfo()}>编辑</Button>
        </div>
        <Table
          loading={searchLoading}
          rowSelection={rowSelection}
          style={{marginBottom: '10px'}}
          rowKey="billingApplicationId"
          bordered
          size="small"
          columns={billApproveColumns}
          pagination={false}
          dataSource={billContracts}
          scroll={{ x: 2000 }}
        />
        {
          this.state.showApproveDetail ?
            <BigSignAuditDetail
              onCancel={() => this.setState({showApproveDetail: false})}
              applicationInfo={applicationInfo}
              billApplySave={billApplySave}
              billStartWorkFlow={billStartWorkFlow}
            /> : null
        }
      </Modal>
    )
  }
}

export default BigSignAudit
