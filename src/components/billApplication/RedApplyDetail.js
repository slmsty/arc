import React from 'react'
import currency from '../../util/currency'
import SelectInvokeApi from '../common/selectInvokeApi'
import SelectSearch from '../billApplication/selectSearch'
import moment from 'moment'
import { Modal, Row, Col, Button, Input, Form, Table, message, Select, DatePicker, InputNumber } from 'antd'
import { detailColumns } from '../billApplication/billColumns'
import '../billApplication/billDetail.less'
import { normalTypes } from '../billApplication/billColumns'
const { TextArea } = Input
const Option = Select.Option
const FormItem = Form.Item

const contentCols = [{
  title: '内容名称',
  dataIndex: 'billingContentName',
  width: 200,
}, {
  title: '内容',
  dataIndex: 'billingRecordId',
  width: 200,
}]

class RedApplyDetail extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedRowKeys: '',
      selectedRows: '',
      count: 1,
      disableDis: true,
      showApplyDetail: true,
      contentData: [],
      invoiceRequire: '',
      remark: '',
      dataSource: [],
      currentNo: 1,
      totalAmount: 0,
    }
  }

  componentWillMount() {
    let data = []
    this.props.DetailList.map((item, index) => {
      data.push({
        lineNo: index,
        isParent: 1,
        arBillingId: item.arBillingId,
        contractItemId: item.contractItemId,
        billingContent: item.billingContent,
        specificationType: item.specificationType,
        unit: item.unit,
        quantity: item.quantity,
        unitPrice: item.billingAmount ? item.billingAmount : 0,
        billingAmountExcludeTax: item.billingAmount ? item.billingAmount : 0,
        billingAmount: item.billingAmount ? item.billingAmount : 0,
        totalAmount: item.billingAmount ? item.billingAmount : 0,
        billingTaxRate: item.billingTaxRate ? item.billingTaxRate : 0,
        billingTaxAmount: item.billingTaxAmount ? item.billingTaxAmount : 0,
      })
    })
    this.setState({ dataSource: data, count: data.length })
  }

  handleAdd = (lineNo, arBillingId, contractItemId) => {
    let { count, dataSource } = this.state;
    const newData = {
      lineNo: count,
      isParent: 0,
      arBillingId,
      contractItemId,
      billingContent: '',
      specificationType: '',
      unit: '',
      quantity: 1,
      unitPrice: 0,
      noRateAmount: 0,
      billingAmountExcludeTax: 0,
      billingAmount: 0,
      billingTaxRate: 0,
      billingTaxAmount: 0,
    };
    const data = dataSource.filter(r=> r.arBillingId === arBillingId)
    dataSource.splice(lineNo + data.length, 0, newData)
    const source = dataSource.map((record, index) => ({
        ...record,
        lineNo: index,
      }
    ))
    this.setState({
      dataSource: source,
      count: count + 1,
    });
  }

  handleDelete = (record) => {
    let dataSource = [...this.state.dataSource];
    this.state.dataSource.map((item, index) => {
      if(record.arBillingId === item.arBillingId && item.isParent === 1) {
        const amount = dataSource[item.lineNo]['billingAmount']
        dataSource[item.lineNo]['billingAmount'] = parseFloat(record.billingAmount) + parseFloat(amount)
      }
    })

    dataSource.splice(record.lineNo, 1)
    const newSource = dataSource.map((record, index) => ({
      ...record,
      lineNo: index,
    }))
    this.setState({ dataSource: newSource });
  }

  handleChange = (value, col, index, record) => {
    let dataSource = this.state.dataSource
    if(col === 'billingContent') {
      dataSource[index][col] = value[1]
    } else if(col === 'billingAmount') {
      //发票拆分子记录输入金额后，从新计算携带数据的金额
      const result = dataSource.filter(d => d.isParent === 1 && record.arBillingId === d.arBillingId)[0]
      let total = 0
      dataSource.map(d => {
        if(d.arBillingId === record.arBillingId && d.isParent === 0 && d.lineNo !== index){
          total += (d.billingAmount ? d.billingAmount : 0)
        }
      })
      //校验所有拆分子项的金额必须小于父级含税金额
      const childAmount = total + value
      /*if(normalTypes.includes(this.props.billType) && childAmount >= result.totalAmount) {
       message.error('拆分子项的金额合计必须小于拆分前含税金额')
       return false
       } else {
       if(result.totalAmount !== 0 && record.isParent!== 1 && childAmount >= result.totalAmount) {
       message.error('拆分子项的金额合计必须小于拆分前含税金额')
       return false
       }
       }*/
      dataSource[result.lineNo][col] = result.totalAmount - childAmount
      const parent = this.state.dataSource[result.lineNo]
      this.calBillAmountTax(dataSource, result.lineNo, parent.billingAmount, parent.billingTaxRate, parent.quantity)
      dataSource[index][col] = value
      const { billingAmount, billingTaxRate, quantity } = this.state.dataSource[index]
      this.calBillAmountTax(dataSource, index, billingAmount, billingTaxRate, quantity)
      //未大签、红冲、其他开票含税金额为0, 手动输入金额后并赋值给总金额
      if(record.isParent === 1 && !normalTypes.includes(this.props.billType)) {
        dataSource[result.lineNo].totalAmount = value
      }
    } else if (col === 'billingTaxRate') {
      const { billingAmount, quantity} = this.state.dataSource[index]
      this.calBillAmountTax(dataSource, index, billingAmount, value, quantity)
      dataSource[index][col] = value
    } else if (col === 'quantity') {
      dataSource[index][col] = value
      const { billingAmountExcludeTax } = this.state.dataSource[index]
      dataSource[index]['unitPrice'] = (billingAmountExcludeTax / (value ? value : 1)).toFixed(2)
    } else {
      dataSource[index][col] = value
    }
    this.setState({
      dataSource: dataSource
    })
  }

  billingUnify = () => {
    let { selectedRows, currentNo, dataSource } = this.state
    console.log(selectedRows, currentNo, dataSource)
    //判断是否存在不一致组号
    const groupNo = selectedRows[0].groupNo
    selectedRows.map(record => {
      if(dataSource[record.lineNo]['groupNo'] !== groupNo || dataSource[record.lineNo]['groupNo'] === 1) {
        currentNo = 1
      }
    })
    selectedRows.map((record, index) => {
      dataSource[record.lineNo]['groupNo'] = currentNo
    })
    this.setState({
      dataSource: dataSource,
      selectedRowKeys: [],
      currentNo: currentNo + 1,
    })
  }


  // 作废重新申请开票
  handleOk = (e) => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const params={
          applicationId: this.props.data[0].applicationId,
          outcomeId: this.props.data[0].outcomeId,
          ...values,
          invoiceDate: values.invoiceDate ? values.invoiceDate.format('YYYY-MM-DD') : '',
          appLineItems: values.isAgainInvoice === 'true' ? this.state.dataSource : '',
        }
        this.props.disableApprove(params)
      }
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { comInfo, custInfo, appLineItems } = this.props.redApplyDetail
    const formItemLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 12 },
    }
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
    const rowSelection = {
      type: 'checkbox',
      onChange: (selectedRowKeys, selectedRows) => {
        this.setState({
          selectedRows,
          selectedRowKeys
        })
      },
      selectedRowKeys: this.state.selectedRowKeys,
    }
    const columns = [
      {
        title: '操作',
        dataIndex: 'action',
        width: 60,
        fixed: 'left',
        render: (text, record, index) => (
          <div>
            {
              record.isParent === 1 ?
                <Button type="primary" ghost onClick={() => this.handleAdd(record.lineNo, record.arBillingId, record.contractItemId)}>+</Button>
                : null
            }
            {
              record.isParent === 0 ?
                <Button type="primary" ghost onClick={() => this.handleDelete(record)}>-</Button>
                : null
            }
          </div>
        )
      }, {
        title: '组号',
        dataIndex: 'groupNo',
        width: 50,
        fixed: 'left',
      }, {
        title: '开票内容',
        dataIndex: 'billingContent',
        width: 200,
        render: (text, record, index) => (
          <SelectSearch
            url="/arc/billingApplication/billingContent/search"
            columns={contentCols}
            label="开票内容"
            width="1000px"
            idKey="billingRecordId"
            valueKey="billingContentName"
            value={['', this.state.dataSource[index]['billingContent']]}
            onChange={(v) => this.handleChange(v, 'billingContent', index)}
          />
        )
      }, {
        title: '规格型号',
        dataIndex: 'specificationType',
        width: 100,
        render: (text, record, index) => (
          <Input placeholder="规格型号" value={this.state.dataSource[index]['specificationType']} onChange={(e) => this.handleChange(e.target.value, 'specificationType', index)}/>
        )
      }, {
        title: '单位',
        dataIndex: 'unit',
        width: 80,
        render: (text, record, index) => (
          <Input placeholder="单位" value={this.state.dataSource[index]['unit']}  onChange={(e) => this.handleChange(e.target.value, 'unit', index)} />
        )
      }, {
        title: '数量',
        dataIndex: 'quantity',
        width: 70,
        render: (text, record, index) => (
          <InputNumber
            placeholder="数量"
            defaultValue="1"
            min={0}
            value={this.state.dataSource[index]['quantity']}
            onChange={(value) => this.handleChange(value, 'quantity', index)} />
        )
      }, {
        title: '单价',
        dataIndex: 'unitPrice',
        width: 100,
        render: (text, record, index) => (
          <InputNumber
            placeholder="单价"
            min={0}
            value={this.state.dataSource[index]['unitPrice']}
            onChange={(value) => this.handleChange(value, 'unitPrice', index)}
          />
        )
      }, {
        title: '不含税金额',
        dataIndex: 'billingAmountExcludeTax',
        width: 100,
        render: (text, record, index) => (
          <InputNumber
            placeholder="不含税金额"
            min={0}
            value={this.state.dataSource[index].billingAmountExcludeTax}
            onChange={(value) => this.handleChange(value, 'billingAmountExcludeTax', index, record)}/>
        )
      }, {
        title: '含税金额',
        dataIndex: 'billingAmount',
        width: 100,
        render: (text, record, index) => (
          <InputNumber
            placeholder="含税金额"
            min={0}
            defaultValue={record.billingAmount}
            value={this.state.dataSource[index]['billingAmount']}
            onChange={(value) => this.handleChange(value, 'billingAmount', index, record)}/>
        )
      }, {
        title: '税率',
        dataIndex: 'billingTaxRate',
        width: 100,
        render: (text, record, index) => (
          <SelectInvokeApi
            typeCode="BILLING_APPLICATION"
            paramCode="TAX_RATE"
            placeholder="税率"
            hasEmpty={false}
            value={`${this.state.dataSource[index]['billingTaxRate']}`}
            onChange={(v) => this.handleChange(v, 'billingTaxRate', index)}
          />
        )
      }, {
        title: '税额',
        dataIndex: 'billingTaxAmount',
        width: 100,
        render: (text, record, index) => (
          <InputNumber
            placeholder="税额"
            min={0}
            value={this.state.dataSource[index]['billingTaxAmount']}
            onChange={(value) => this.handleChange(value, 'billingTaxAmount', index)}
          />
        )
      }]
    const formItemLayout1 = {
      labelCol: { span: 3 },
      wrapperCol: { span: 21 },
    }
    const formItemLayout2 = {
      labelCol: { span: 7 },
      wrapperCol: { span: 16 },
    }
    return (
      <div>
        <Modal
          width={1024}
          title="发票红冲申请详情"
          visible={}
          onCancel={this.props.onCancel}
          footer={
            <div>
              <Button type="primary" ghost onClick={this.handleOk}>
                开票
              </Button>
            </div>
          }
        >
          <Form>
            <Row gutter={40}>
              <Col span={8} key={1}>
                <FormItem {...formItemLayout} label="是否重新开票:">
                  {getFieldDecorator('isAgainInvoice',{
                    initialValue: 'true',
                  })(
                    <Select onChange={(v) => this.setState({showApplyDetail: v === 'true' ? true : false })}>
                      <Option value="true">是</Option>
                      <Option value="false">否</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={40}>
              <Col span={8} key={2}>
                <FormItem {...formItemLayout} label="开票类型">
                  {
                    getFieldDecorator('invoiceType',{
                      initialValue: '',
                    })(
                      <SelectInvokeApi
                        typeCode="BILLING_APPLICATION"
                        paramCode="BILLING_TYPE"
                        placeholder="开票类型"
                        hasEmpty
                      />
                    )
                  }
                </FormItem>
              </Col>
              <Col span={8} key={3}>
                <FormItem {...formItemLayout} label="开票日期">
                  {
                    getFieldDecorator('invoiceDate',{
                      initialValue: moment(),
                    })(
                      <DatePicker format="YYYY-MM-DD"/>,
                    )
                  }
                </FormItem>
              </Col>
            </Row>
            <br />
            {
              this.state.showApplyDetail ?
                <div>
                  <Table
                    rowKey="receiptClaimId"
                    columns={detailColumns}
                    pagination={false}
                    bordered
                    size="small"
                    scroll={{x: '750px'}}
                    dataSource={detailData}
                  />
                  <div className="add-btns">
                    <Button type="primary" style={{marginLeft: '5px'}} ghost onClick={() => this.billingUnify()}>统一开票</Button>
                  </div>
                  <Table
                    rowSelection={rowSelection}
                    style={{marginBottom: '10px'}}
                    rowKey="lineNo"
                    bordered
                    size="small"
                    columns={columns}
                    pagination={false}
                    dataSource={this.state.dataSource}
                    scroll={{ x: 1160 }}
                  />
                  <Row gutter={40}>
                    <Col span={14}>
                      <FormItem {...formItemLayout1} label="发票备注">
                        {
                          getFieldDecorator('remark',{
                            initialValue: this.props.applyData[0].remark,
                          })(
                            <TextArea placeholder="请输入发票备注" rows="2" />
                          )
                        }
                      </FormItem>
                    </Col>
                  </Row>
                  <Row gutter={40}>
                    <Col span={14}>
                      <FormItem {...formItemLayout1} label="开票要求">
                        {
                          getFieldDecorator('invoiceRequire', {initialValue: this.props.applyData[0].invoiceRequire, rules: [{max: 350, message: '开票要求不能超过350个字符!' }]})(
                            <TextArea placeholder="请输入开票要求" rows="2" />
                          )
                        }
                      </FormItem>
                    </Col>
                  </Row>
                  <h3 className="sent-info">寄件信息</h3>
                  <Row gutter={40}>
                    <Col span={8} key={1}>
                      <FormItem {...formItemLayout2} label="收件人">
                        {getFieldDecorator('emsReceiver')(
                          <Input placeholder="收件人"/>
                        )}
                      </FormItem>
                    </Col>
                    <Col span={8} key={2}>
                      <FormItem {...formItemLayout2} label="收件人公司">
                        {
                          getFieldDecorator('emsCompanyName', {
                            initialValue: ''
                          })(
                            <Input placeholder="收件人公司"/>
                          )
                        }
                      </FormItem>
                    </Col>
                    <Col span={8} key={3}>
                      <FormItem {...formItemLayout2} label="收件人电话">
                        {
                          getFieldDecorator('emsTelephone')(
                            <Input placeholder="收件人电话"/>,
                          )
                        }
                      </FormItem>
                    </Col>
                  </Row>
                  <Row gutter={40}>
                    <Col span={8} key={1}>
                      <FormItem {...formItemLayout2} label="收件人城市">
                        {getFieldDecorator('emsCity')(
                          <Input placeholder="收件人城市"/>
                        )}
                      </FormItem>
                    </Col>
                    <Col span={8} key={2}>
                      <FormItem {...formItemLayout2} label="收件人详细地址">
                        {
                          getFieldDecorator('emsAddress', {
                            initialValue: ''
                          })(
                            <Input placeholder="收件人详细地址"/>
                          )
                        }
                      </FormItem>
                    </Col>
                  </Row>
                  <Row gutter={40}>
                    <Col span={8} key={1}>
                      <FormItem {...formItemLayout2} label="E-mail">
                        {getFieldDecorator('custEmail', {
                          initialValue: this.props.currentUser.email, rules: [{
                            type: 'email', message: '请输入正确的E-mail!',
                          }, { required: true, message: '请填写E-mail!' }]
                        })(
                          <Input placeholder="E-mail"/>
                        )}
                      </FormItem>
                    </Col>
                  </Row>
                </div>
                : null
            }
          </Form>
        </Modal>
      </div>
    )
  }
}

export default Form.create()(RedApplyDetail)
