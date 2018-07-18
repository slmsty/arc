import React from 'react'
import { Row, Col, Button, Input,Upload, Icon, InputNumber, Modal, message, Table, Form } from 'antd'
import './receiptDetail.less'
import { toThousands } from "../../../util/currency";
import getByteLen from '../../../util/common'
import UrlModalCom from '../../common/getUrlModal'
const TextArea = Input.TextArea
const FormItem = Form.Item;

class ReceiptDetail extends React.Component {
  constructor(props) {
    super(props)
    const appLineItems = props.type === 'myApply' ? props.receiptDetail.appLineList : props.receiptDetail.appLineItems
    this.state = {
      applyLoading: false,
      showContractLink: false,
      appLineItems: appLineItems.map((item, index) => ({
        lineNo: index + 1,
        arBillingId: item.arBillingId,
        fundId: item.fundId,
        receiptType: '收据',
        applyAmount: typeof item.applyAmount !== 'undefined' ? item.applyAmount : item.unApplyAmount,
      })),
    }
    this.columns = [
      {
        title: '付款条件',
        dataIndex: 'paymentTerm',
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
            onChange={(v) => this.handleOnChange(index, v)}
          />
        )
      }, {
        title: '收据类型',
        dataIndex: 'receiptType',
        width: 100,
        render: () => '收据'
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

  handleReceiptAmount = (value) => {
    const total = this.getReceiptAmountTotal(this.state.appLineItems)
    let errors = ''
    if(total === value) {
      errors = [new Error('收据金额与本次申请金额合计不等，请调整')]
    } else {
      errors = ''
    }
    this.props.form.setFields({
      receiptAmount: {
        value: value,
        errors: errors,
      },
    });
  }

  handleApply = () => {
    this.props.form.validateFields((err, values) => {
      let total = 0
      this.state.appLineItems.map(item => {
        total = total + parseFloat(item.applyAmount)
      })
      if(parseFloat(total.toFixed(2)) !== values.receiptAmount) {
        this.props.form.setFields({
          receiptAmount: {
            value: values.receiptAmount,
            errors: [new Error('收据金额与本次申请金额合计不等，请调整')],
          },
        });
        err = true
      }
      if(!err) {
        this.setState({
          applyLoading: true,
        })
        const { comInfo, receiptApplicationId } = this.props.receiptDetail
        const params = {
          ...values,
          billingComInfoId: comInfo.billingComInfoId || '',
          appLineItems: this.state.appLineItems,
          receiptApplicationId: receiptApplicationId || '',
        }
        this.props.receiptApplySave(params).then(res => {
          if(res && res.response && res.response.resultCode === '000000') {
            message.success('收据已申请成功')
            if(this.props.type === 'myApply') {
              this.props.handleQuery()
            }
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

  getReceiptAmountTotal = (dataSource) => {
    let receiptTotal = 0
    dataSource.map(item => {
      receiptTotal = receiptTotal + item.unApplyAmount
    })
    receiptTotal = parseFloat(receiptTotal.toFixed(2))
    return receiptTotal
  }

  custNameValidator = (rule, value, callback) => {
    if(value === '' || typeof value === 'undefined') {
      callback()
      return false
    }
    if(getByteLen(value) < 100) {
      callback()
      return
    }
    callback('不能超过100个字符，请重新填写')
  }

  contentValidator = (rule, value, callback) => {
    if(value === '' || typeof value === 'undefined') {
      callback()
      return false
    } else {
      if(getByteLen(value) < 220) {
        callback()
        return
      }
      callback('收据内容不能超过220个字符')
    }
  }

  render() {
    const { applicationContract, totalApplyAmount, receiptContent, applicantRequest, applicantRequestReason, appLineList, appLineItems } = this.props.receiptDetail
    const { getFieldDecorator } = this.props.form;
    const dataSource = this.props.type === 'myApply' ? appLineList : appLineItems
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
        {
          this.state.showContractLink ?
            <UrlModalCom
              closeModal={() => this.setState({showContractLink: false}) }
              contractUrl={this.props.contractUrl}
            /> : null
        }
        <Row>
          <Col span={14}>
            <Button
              className="scan-document"
              type="primary"
              ghost
              onClick={() => this.setState({ showContractLink: true })}
            >合同审批表及合同扫描件</Button>
          </Col>
        </Row>
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
                <td width="10%">项目代码 :</td><td width="23%">{applicationContract.projectCode}</td>
                <td width="10%">签约公司 :</td><td width="23%">{applicationContract.comName}</td>
                <td width="10%">客户名称 :</td><td width="23%">{applicationContract.custName}</td>
              </tr>
              <tr>
                <td>签约日期 :</td><td>{applicationContract.signDate}</td><td>签约BU :</td><td>{applicationContract.salesBuName}</td><td>立项BU :</td><td>{applicationContract.sbuName}</td>
              </tr>
              <tr>
                <td>项目经理 :</td><td>{applicationContract.projectManager}</td><td>签约区域 :</td><td>{applicationContract.signRegion}</td><td>立项区域 :</td><td>{applicationContract.region}</td>
              </tr>
              <tr>
                <td>销售经理 :</td><td>{applicationContract.saleManager}</td><td>合同总金额 :</td><td>{toThousands(applicationContract.contractAmount)}</td><td>币种 :</td><td>{applicationContract.contractCurrency}</td>
              </tr>
              <tr>
                <td>累计应收帐 :</td><td>{toThousands(applicationContract.oughtMoney)}</td><td>累计已收帐 :</td><td>{toThousands(applicationContract.returnMoney)}</td><td>应收金额 :</td><td>{toThousands(applicationContract.oughtReturnMoney)}</td>
              </tr>
              <tr>
                <td>收款比例 :</td><td>{applicationContract.paymentPercent}</td><td>收款银行 :</td><td>{applicationContract.bank}</td><td>银行账号 :</td><td>{applicationContract.bankAccount}</td>
              </tr>
              </tbody>
            </table>
          </div>
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
                        initialValue: applicantRequest,
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
                        initialValue: applicantRequestReason,
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
                    {getFieldDecorator('receiptAmount', {initialValue: this.props.type === 'myApply' ? totalApplyAmount : this.getReceiptAmountTotal(dataSource)})(
                      <InputNumber
                        style={{width: '150px'}}
                        onChange={this.handleReceiptAmount}
                      />
                    )}
                  </FormItem>
                </td>
              </tr>
              <tr>
                <td>开收据阶段 :</td>
                <td colSpan="3">
                  <Table
                    rowKey={record => record.fundId}
                    rowSelection={null}
                    bordered
                    size="small"
                    columns={this.columns}
                    dataSource={dataSource}
                    pagination={false}
                    footer={() => {
                      let total = 0
                      this.state.appLineItems.map(item => {
                        total = total + parseFloat(item.applyAmount)
                      })
                      return <span>本次申请金额合计：<em style={{color: '#ff8928'}}>{toThousands(parseFloat(total.toFixed(2)))}</em></span>
                    }}
                  />
                </td>
              </tr>
              <tr>
                <td>收据内容 :</td>
                <td colSpan="3">
                  <FormItem>
                    {getFieldDecorator('receiptApplicantConetent', {
                        initialValue: receiptContent,
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
      </Modal>
    )
  }
}

export default Form.create()(ReceiptDetail)
