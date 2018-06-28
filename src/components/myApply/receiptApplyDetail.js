import React from 'react'
import { Row, Col, Button, Input, Icon, InputNumber, Modal, Table } from 'antd'
import '../billStatusManage/receiptApplication/receiptDetail.less'
import { toThousands } from "../../util/currency";

class ReceiptApplyDetail extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      applyLoading: false,
    }
    this.columns = [
      {
        title: '付款条件',
        dataIndex: 'paymentName',
        width: 120,
      }, {
        title: '金额',
        dataIndex: 'paymentAmount',
        width: 110,
      }, {
        title: '百分比',
        dataIndex: 'paymentPercent',
        width: 90,
      }, {
        title: '未申请收据金额',
        dataIndex: 'unApplyAmount',
        width: 120,
      }, {
        title: '本次申请金额',
        dataIndex: 'applyAmount',
        width: 150,
      }, {
        title: '收据类型',
        dataIndex: 'receiptType',
        width: 100,
      },
    ]
  }

  render() {
    const { appLineList, applicationContract = {}, totalApplyAmount, applicantRequest, applicantRequestReason, receiptApplicantConetent } = this.props.serviceDetail

    return (
      <div className="receipt">
        <div className="contract">
          <h1>合同基本信息</h1>
          <table>
            <tbody>
            <tr>
              <td>合同编码 :</td><td colSpan="5">{applicationContract.contractCode}</td>
            </tr>
            <tr>
              <td>项目名称 :</td><td colSpan="5">{applicationContract.projectName}</td>
            </tr>
            <tr>
              <td>合同名称 :</td><td colSpan="5">{applicationContract.contractName}</td>
            </tr>
            <tr>
              <td width="10%">项目代码 :</td><td width="23%">{applicationContract.projectCode}</td><td width="10%">签约公司 :</td><td width="23%">{applicationContract.comName}</td>
              <td width="10%">客户名称 :</td><td width="23%">{applicationContract.custName}</td>
            </tr>
            <tr>
              <td>签约日期 :</td><td>{applicationContract.signDate}</td><td>签约BU :</td><td>{applicationContract.salesBuName}</td><td>立项BU :</td><td>{applicationContract.sbuName}</td>
            </tr>
            <tr>
              <td>项目经理 :</td><td>{applicationContract.projectManager}</td><td>签约区域 :</td><td>{applicationContract.signRegion}</td><td>立项区域 :</td><td>{applicationContract.region}</td>
            </tr>
            <tr>
              <td>销售经理 :</td><td>{applicationContract.saleManager}</td><td>合同总金额 :</td><td>{applicationContract.contractAmount}</td><td>币种 :</td><td>{applicationContract.contractCurrency}</td>
            </tr>
            <tr>
              <td>累计应收帐 :</td><td>{applicationContract.oughtMoney}</td><td>累计已收帐 :</td><td>{applicationContract.returnMoney}</td><td>应收金额 :</td><td>{applicationContract.oughtReturnMoney}</td>
            </tr>
            <tr>
              <td>收款比例 :</td><td>{applicationContract.paymentPercent}</td><td>收款银行 :</td><td>{applicationContract.bank}</td><td>银行账号 :</td><td>{applicationContract.bankAccount}</td>
            </tr>
            </tbody>
          </table>
          <div className="contract">
            <h1>收据申请信息</h1>
            <table>
              <tbody>
              <tr>
                <td width="15%">客户名称特殊要求 :</td>
                <td width="35%">
                  {applicantRequest}
                </td>
                <td width="15%">客户名称特殊要求理由 :</td>
                <td width="35%">
                  {applicantRequestReason}
                </td>
              </tr>
              <tr>
                <td>收据金额 :</td>
                <td colSpan="3">
                  {totalApplyAmount}
                </td>
              </tr>
              <tr>
                <td>开发收据阶段 :</td>
                <td colSpan="3">
                  <Table
                    rowKey={record => record.fundId}
                    rowSelection={null}
                    bordered
                    size="small"
                    columns={this.columns}
                    dataSource={appLineList}
                    pagination={false}
                    footer={() => {
                      let total = 0
                      appLineList.map(item => {
                        total = total + parseFloat(item.applyAmount)
                      })
                      return <span>本次申请金额合计：<em style={{color: 'blue'}}>{toThousands(total)}</em></span>
                    }}
                  />
                </td>
              </tr>
              <tr>
                <td>收据内容 :</td>
                <td colSpan="3">
                  {receiptApplicantConetent}
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }
}

export default ReceiptApplyDetail
