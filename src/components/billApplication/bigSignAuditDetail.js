import React from 'react'
import { Button, Row, Col, Table, Modal, Icon, Form } from 'antd'
import BillApproveDetail from '../myApply/billApproveDetail'
import './bigSignAuditDetail.less'

class BigSignAuditDetail extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      dataSource: [],
      loading: false,
      selectedRows: [],
      showApproveDetail: false,
      billType: 'BILLING_CONTRACT',
    }
  }

  billStartWorkFlow = (billingApplicationId) => {
    this.props.form.validateFields((err, values) => {
      if(!err) {
        const params = {
          billingApplicationId,
          billingApplicationType: this.state.billType,
        }
        this.props.billStartWorkFlow(params)
        this.props.onCancel()
      }
    })
  }

  setBillApplicationType = (type) => {
    this.setState({
      billType: type,
    })
  }

  render() {
    const rowSelection = {
      type: 'checkbox',
      onChange: (selectedRowKeys, selectedRows) => {
        this.setState({
          selectedRows,
        })
      },
    }
    const { applyPersonName, applyPersonPhone, applyPersonDept, applyPersonEmail, serviceType, serviceTypeName, serviceDetail } = this.props.applicationInfo
    return (
      <Modal
        title="审核详情"
        width="1100px"
        style={{ top: 20 }}
        visible={true}
        wrapClassName="vertical-center-modal"
        onCancel={() => this.props.onCancel()}
        footer={[
          <Button key="submit" type="primary" onClick={() => this.billStartWorkFlow(serviceDetail.billingApplicationId)}>
            {<Icon type="check" />}发起审批
          </Button>,
        ]}
      >
        <Form>
          <div>
            <h3 className="bill-title">申请人信息</h3>
            <Row gutter={30}>
              <Col span={3}>申请人: </Col><Col span={9}>{applyPersonName}</Col>
              <Col span={3}>申请人部门:</Col><Col span={9}>{applyPersonDept}</Col>
            </Row>
            <Row gutter={30}>
              <Col span={3}>联系电话:</Col><Col span={9}>{applyPersonPhone}</Col>
              <Col span={3}>邮箱地址:</Col><Col span={9}>{applyPersonEmail}</Col>
            </Row>
          </div>
          <div>
            <h3 className="bill-title">{serviceTypeName}详情</h3>
            <BillApproveDetail
              serviceDetail={serviceDetail}
              applyType={serviceType}
              billApplySave={this.props.billApplySave}
              isApprove={true}
              setBillApplicationType={this.setBillApplicationType}
              form={this.props.form}
            />
          </div>
        </Form>
      </Modal>
    )
  }
}

export default Form.create()(BigSignAuditDetail)
