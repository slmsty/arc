import React from 'react'
import { Table, Row, Col } from 'antd'
import { proColumns, billDetailColumns, detailColumns, invoiceLineCols } from '../billApplication/billColumns'
import './billApproveDetail.css'

class BillDetail extends React.Component  {
  render() {
    const { billingType, billingTypeName, billingDate, billingApplicantRequest, appLineList, comInfo, custInfo, contractList, outcomeList, billingApplicantRemark, receiptOutcome, fileName, filePath } = this.props.serviceDetail
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
    return (
      <div>
        <div className="infoPanel">
          <h1>项目信息</h1>
          <Table
            rowKey="receiptClaimId"
            columns={proColumns}
            bordered
            size="small"
            scroll={{ x: '1570px' }}
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
              开票类型 :{billingTypeName}
          </Col>
          <Col span={8} key={2}>
            开票日期: {billingDate}
          </Col>
          {
            this.props.applyType === 'BILLING_RED' || this.props.applyType === 'BILLING_INVALID' ?
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
          columns={invoiceLineCols}
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
        <Row gutter={40}>
          <Col span={24}>
            附件: <a href="javascript:void(0)" onClick={() => this.props.fileDown({objectId: filePath, objectName: fileName})}>{fileName}</a>
          </Col>
        </Row>
      </div>
    )
  }
}

export default BillDetail
