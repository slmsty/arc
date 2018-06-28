import React from 'react'
import { Row, Col, Button, Input,Upload, Icon, InputNumber, Modal, message, Table, Form } from 'antd'
import './receiptDetail.less'
import { toThousands } from "../../../util/currency";
import getByteLen from '../../../util/common'
const TextArea = Input.TextArea
const FormItem = Form.Item;

class ReceiptDetail extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      applyLoading: false,
      appLineItems: props.receiptDetail.appLineItems.map(item => ({
        arBillingId: item.arBillingId,
        fundId: item.fundId,
        receiptType: '直接收据',
        applyAmount: item.unApplyAmount ,
      })),
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
        render: (text, record) => record.paymentAmount > 0 ? toThousands(record.paymentAmount) : text
      }, {
        title: '百分比',
        dataIndex: 'paymentPercent',
        width: 90,
      }, {
        title: '未申请收据金额',
        dataIndex: 'unApplyAmount',
        width: 120,
        render: (text, record) => record.unApplyAmount > 0 ? toThousands(record.unApplyAmount) : text
      }, {
        title: '本次申请金额',
        dataIndex: 'applyAmount',
        width: 150,
        render: (text, record, index) => (
          <InputNumber
            value={this.state.appLineItems[index].applyAmount}
            style={{width: '150px'}}
            max={record.unApplyAmount}
            onChange={(v) => this.handleOnChange(index, v)}
          />
        )
      }, {
        title: '收据类型',
        dataIndex: 'receiptType',
        width: 100,
        render: () => '直接收据'
      },
    ]
  }

  handleOnChange = (index, value) => {
    let { appLineItems } = this.state
    appLineItems[index].applyAmount = value
    this.setState({
      appLineItems: appLineItems,
    })
  }

  handleApply = () => {
    this.props.form.validateFields((err, values) => {
      if(!err) {
        this.setState({
          applyLoading: true,
        })
        const params = {
          ...values,
          billingComInfoId: this.props.receiptDetail.comInfo.billingComInfoId || '',
          appLineItems: this.state.appLineItems,
        }

        this.props.receiptApplySave(params).then(res => {
          if(res && res.response && res.response.resultCode === '000000') {
            message.success('收据已申请成功')
            this.setState({
              applyLoading: false,
            })
            this.props.onCancel(true)
          } else {
            this.setState({
              applyLoading: false,
            })
          }
        })
      }
    })
  }
  custNameValidator = (rule, value, callback) => {
    if(getByteLen(value) < 100) {
      callback()
      return
    }
    callback('不能超过100个字符，请重新填写')
  }

  contentValidator = (rule, value, callback) => {
    if(getByteLen(value) < 220) {
      callback()
      return
    }
    callback('收据内容不能超过220个字符')
  }

  render() {
    const { appLineItems, applicationContract, comInfo } = this.props.receiptDetail
    const { getFieldDecorator } = this.props.form;
    let receiptTotal = 0
    appLineItems.map(item => {
      receiptTotal = receiptTotal + item.unApplyAmount
    })
    return (
      <Modal
        title="收据申请详情"
        width="1000px"
        style={{ top: 20 }}
        visible={true}
        wrapClassName="vertical-center-modal"
        footer={[
          <Button key="submit" type="primary" loading={this.state.applyLoading} onClick={this.handleApply}>
            {!this.state.applyLoading ? <Icon type="check" /> : ''}申请
          </Button>,
        ]}
        onCancel={() => this.props.onCancel()}
        maskClosable={false}
      >
      <div className="receipt">
        <div className="contract">
          <h1>合同基本信息 <Button
            className="scan-document"
            style={{float: 'right'}}
            type="primary"
            ghost
            onClick={() => this.setState({ showContractLink: true })}
          >合同审批表及合同扫描件</Button></h1>
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
                    <FormItem>
                      {getFieldDecorator('receiptApplicantRequest',
                        {
                          rules: [
                            { validator: this.custNameValidator }
                          ]
                        }
                      )(
                        <Input />
                      )}
                    </FormItem>
                  </td>
                  <td width="15%">客户名称特殊要求理由 :</td>
                  <td width="35%">
                    <FormItem>
                      {getFieldDecorator('receiptApplicantRequestReason',
                        {
                          rules: [
                            { validator: this.custNameValidator }
                          ]
                        }
                      )(
                        <Input />
                      )}
                    </FormItem>
                  </td>
                </tr>
                <tr>
                  <td>收据金额 :</td>
                  <td colSpan="3">
                    <FormItem>
                      {getFieldDecorator('receiptAmount', {initialValue: receiptTotal})(
                        <InputNumber
                          style={{width: '150px'}}
                        />
                      )}
                    </FormItem>
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
                      dataSource={appLineItems}
                      pagination={false}
                      footer={() => {
                        let total = 0
                        this.state.appLineItems.map(item => {
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
                    <FormItem>
                      {getFieldDecorator('receiptApplicantConetent', {
                          rules: [
                            { validator: this.contentValidator }
                          ]
                        }
                      )(
                        <TextArea  rows={3}/>
                      )}
                    </FormItem>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      </Modal>
    )
  }
}

export default Form.create()(ReceiptDetail)
