import React from 'react'
import { Table, Row, Col } from 'antd'
import { proColumns, billDetailColumns, detailColumns } from '../billApplication/billColumns'
import './billApproveDetail.css'

class BillDetail extends React.Component  {
  render() {
    const { billingType, billingDate, billingApplicantRequest, appLineList, comInfo, custInfo, contractList, outcomeList, billingApplicantRemark, receiptOutcome } = this.props.serviceDetail
    const detailData = [{
      title: '购买方',
      customerName: custInfo.billingCustName,
      taxPayer: custInfo.taxpayerIdentificationNumber,
      address: custInfo.addressPhoneNumber,
      bankAccount: custInfo.bankBankAccount,
    }, {
      title: '销售方',
      customerName: comInfo.billingComName,
      taxPayer: comInfo.taxpayerIdentificationNumber,
      address: comInfo.addressPhoneNumber,
      bankAccount: comInfo.bankBankAccount
    }]
    const columns = [{
      title: '组号',
      dataIndex: 'groupNo',
      width: 50,
      fixed: 'left',
    }, {
      title: '开票内容',
      dataIndex: 'billingContent',
      width: 250,
    }, {
      title: '规格型号',
      dataIndex: 'specificationType',
      width: 100,
    }, {
      title: '单位',
      dataIndex: 'unit',
      width: 80,
    }, {
      title: '数量',
      dataIndex: 'quantity',
      width: 70,
    }, {
      title: '单价',
      dataIndex: 'unitPrice',
      width: 100,
    }, {
      title: '不含税金额',
      dataIndex: 'billingAmountExcludeTax',
      width: 100,
    }, {
      title: '含税金额',
      dataIndex: 'billingAmount',
      width: 100,
    }, {
      title: '税率',
      dataIndex: 'billingTaxRate',
      width: 100,
    }, {
      title: '税额',
      dataIndex: 'billingTaxAmount',
      width: 100,
    }, {
      title: '税收分类编码',
      dataIndex: 'taxCategoryCode',
      width: 120,
    }, {
      title: '税收分类名称',
      dataIndex: 'taxCategoryName',
      width: 120,
    }, {
      title: '优惠政策',
      dataIndex: 'prefPolicySign',
      width: 100,
    }, {
      title: '优惠政策类型',
      dataIndex: 'prefPolicyType',
      width: 100,
    }]
    return (
      <div>
        <div className="infoPanel">
          <h1>项目信息</h1>
          <Table
            rowKey="receiptClaimId"
            columns={proColumns}
            bordered
            size="small"
            scroll={{ x: '1480px' }}
            dataSource={contractList}
            pagination={false}
          />
        </div>
        <div className="infoPanel">
          <h1>开票结果详情</h1>
          <Table
            rowKey="receiptClaimId"
            columns={billDetailColumns}
            bordered
            size="small"
            scroll={{ x: '1580px' }}
            dataSource={outcomeList}
            pagination={false}
          />
        </div>
        <Row gutter={40}>
          <Col span={8} key={1}>
              开票类型 :{billingType}
          </Col>
          <Col span={8} key={2}>
            开票日期: {billingDate}
          </Col>
          {
            this.props.applyType === 'BILLING_RED' ?
              <Col span={8} key={2}>
                是否收到发票: {receiptOutcome}
              </Col> : null
          }
        </Row>
        <div style={{margin: '10px 0'}}>
          <Table
            rowKey="id"
            size="small"
            bordered
            columns={detailColumns}
            dataSource={detailData}
            pagination={false}
          />
        </div>
        <Table
          style={{marginBottom: '10px'}}
          rowKey={record => record.lineNo}
          bordered
          size="small"
          columns={columns}
          pagination={false}
          dataSource={appLineList}
          scroll={{ x: '1500px' }}
        />
        <Row gutter={40}>
          <Col span={24}>
            备注: {billingApplicantRemark}
          </Col>
        </Row>
        <Row gutter={40}>
          <Col span={24}>
            开票要求: {billingApplicantRequest}
          </Col>
        </Row>
      </div>
    )
  }
}

export default BillDetail
