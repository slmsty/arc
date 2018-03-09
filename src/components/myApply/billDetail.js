import React from 'react'
import { Table, Row, Col } from 'antd'
import { proColumns, billDetailColumns, detailColumns, invoiceLineCols, totalColumns } from '../billApplication/billColumns'
import './billApproveDetail.css'
const showEdit = ['BILLING_RED', 'BILLING_RED_OTHER', 'BILLING_INVALID']

const data = [{
  title: '城建',
  taxRate: '5%',
  tax: '2021',
}, {
  title: '教育',
  taxRate: '8%',
  tax: '12000',
}, {
  title: '所得税',
  taxRate: '10%',
  tax: '3000',
}, {
  title: '合计',
  taxRate: '20%',
  tax: '21000',
}]

class BillDetail extends React.Component  {
  render() {
    const { billingType, billingTypeName, billingDate, billingApplicantRequest, appLineList, comInfo = {}, custInfo = {},
      contractList, outcomeList, billingApplicantRemark, receiptOutcome, fileName, filePath, isAgainInvoice } = this.props.serviceDetail
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
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 12 },
    }
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
        {
          isAgainInvoice === 'false' && showEdit.includes(this.props.applyType) ?
            <Row>
              <Col span={12} key={3}>
                是否收到发票: {receiptOutcome === 'Y' ? '是' : '否'}
              </Col>
              {
                this.props.taskCode === 'tax_vp' ?
                  <Row gutter={40}>
                    <Col span={12} key={1}>
                      AR财务会计是否收到发票: {receiptOutcome === 'Y' ? '是' : '否'}
                    </Col>
                  </Row> : null
              }
            </Row>
            :
            <div>
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
              {
                this.props.applyType === 'BILLING_EXCESS' ?
                  <div className="arc-info">
                    <Table
                      style={{width: '50%'}}
                      rowKey="id"
                      size="small"
                      bordered
                      columns={totalColumns}
                      dataSource={data}
                      pagination={false}
                    />
                  </div> : null
              }
              <div style={{padding: '10px 0'}}>
                <Row gutter={40}>
                  <Col span={24}>
                    备注: {billingApplicantRemark}
                  </Col>
                </Row>
              </div>
              <div style={{padding: '10px 0'}}>
                <Row gutter={40}>
                  <Col span={24}>
                    开票要求: {billingApplicantRequest}
                  </Col>
                </Row>
              </div>
              <div style={{padding: '10px 0'}}>
                <Row gutter={40}>
                  <Col span={24}>
                    附件: <a href="javascript:void(0)" onClick={() => this.props.fileDown({objectId: filePath, objectName: fileName})}>{fileName}</a>
                  </Col>
                </Row>
              </div>
            </div>
        }
      </div>
    )
  }
}

export default BillDetail
