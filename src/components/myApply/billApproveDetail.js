import React from 'react'
import { Table, Form, message, Row, Col, Input, DatePicker, Button, InputNumber, Icon, Select } from 'antd'
import SelectInvokeApi from '../common/selectInvokeApi'
import { proColumns, billDetailColumns, detailColumns, contentCols, taxCategoryCols } from '../billApplication/billColumns'
import SearchAllColumns from '../common/SearchAllColumns'
import moment from 'moment';
import './billApproveDetail.css'
const FormItem = Form.Item
const TextArea = Input.TextArea
const dateFormat = 'YYYY/MM/DD';
const Option = Select.Option

class BillApproveDetail extends React.Component  {
  constructor(props) {
    super(props)
    const dataSource = props.serviceDetail.appLineList.map(detail => ({
      ...detail,
      isParent: 1,
      lineNo: detail.lineNo - 1,
      })
    )
    console.log(dataSource)
    this.state = {
      dataSource: dataSource,
      count: 1,
      content: '',
      taxRate: '',
      selectedRowKeys: [],
      selectedRows: [],
      currentNo: 1,
      totalAmount: 0,
    }
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
      quantity: '',
      unitPrice: 0,
      noRateAmount: 0,
      billingAmount: 0,
      billingTaxRate: 0,
      billingTaxAmount: 0,
    };
    this.state.dataSource.map((record, index) => {
      if(record.lineNo === lineNo){
        dataSource.splice(index + 1, 0, newData)
      }
    })
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
      if(item.lineNo === record.lineNo) {
        dataSource.splice(index, 1)
      }
    })
    const newSource = dataSource.map((record, index) => ({
      ...record,
      lineNo: index,
    }))
    this.setState({ dataSource: newSource });
  }
  handleChange = (value, col, index, record) => {
    console.log(value)
    let dataSource = this.state.dataSource
    if(col === 'billingContent') {
      dataSource[index][col] = value.billingContentName
      dataSource[index]['taxCategoryCode'] = value.taxCategoryCode
      dataSource[index]['taxCategoryName'] = value.taxCategoryName
      dataSource[index]['prefPolicySign'] = value.prefPolicySign
      dataSource[index]['prefPolicyType'] = value.prefPolicyContent
    } else if (col === 'taxCategoryCode') {
      dataSource[index][col] = value.taxCategoryCode
      dataSource[index]['taxCategoryName'] = value.taxCategoryName
      dataSource[index]['prefPolicySign'] = value.prefPolicySign
      dataSource[index]['prefPolicyType'] = value.prefPolicyType
    } else if(col === 'billingAmount') {
      //发票拆分子记录输入金额后，从新计算携带数据的金额
      const result = dataSource.filter(d => d.isParent === 1 && record.arBillingId === d.arBillingId)[0]
      console.log(index, result.lineNo)
      if(value >= result.billingAmount) {
        message.warn(`拆分金额必须小于拆分前金额`)
        return
      }
      let total = 0
      dataSource.map(d => {
        if(d.arBillingId === record.arBillingId && d.isParent === 0 && d.lineNo !== index){
          total += d.billingAmount ? d.billingAmount : 0
        }
      })
      dataSource[result.lineNo][col] = result.totalAmount - total - value
      dataSource[index][col] = value
    } else {
      dataSource[index][col] = value
    }
    this.setState({
      dataSource: dataSource
    })
  }

  billingUnify = () => {
    let { selectedRows, currentNo, dataSource } = this.state
    //判断是否存在不一致组号
    const groupNo = selectedRows[0].groupNo
    selectedRows.map(record => {
      if(dataSource[record.lineNo]['groupNo'] !== groupNo) {
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
  handleOk = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const params = {
          ...values,
          billingApplicationType: this.props.applyType,
          billingDate: values.billingDate ? values.billingDate.format('YYYY-MM-DD') : '',
          appLineItems: this.state.dataSource.map(record => ({
            ...record,
            lineNo: record.lineNo + 1,
          }))
        }
        console.log(params)
        this.props.billApplySave(params)
      }
    });
  }
  render() {
    const { getFieldDecorator } = this.props.form
    const formItemLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 12 },
    }
    const span3ItemLayout = {
      labelCol: { span: 2 },
      wrapperCol: { span: 20 },
    }
    const { billingType, billingDate, billingApplicantRequest, appLineList, comInfo, custInfo, contractList, outcomeList, billingApplicantRemark } = this.props.serviceDetail
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
    const columns = [{
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
      width: 250,
      render: (text, record, index) => (
        <SearchAllColumns
          url="/arc/billingApplication/billingContent/search"
          columns={contentCols}
          label="开票内容"
          idKey="billingRecordId"
          valueKey="billingContentName"
          value={this.state.dataSource[index]['billingContent']}
          onChange={(v) => this.handleChange(v, 'billingContent', index)}
        />
      )
    }, {
      title: '规格型号',
      dataIndex: 'specificationType',
      width: 100,
      render: (text, record, index) => (
        <Input placeholder="规格型号" defaultValue={this.state.dataSource[index]['specificationType']} onChange={(e) => this.handleChange(e.target.value, 'specificationType', index)}/>
      )
    }, {
      title: '单位',
      dataIndex: 'unit',
      width: 80,
      render: (text, record, index) => (
        <Input placeholder="单位" defaultValue={this.state.dataSource[index]['unit']} onChange={(e) => this.handleChange(e.target.value, 'unit', index)} />
      )
    }, {
      title: '数量',
      dataIndex: 'quantity',
      width: 70,
      render: (text, record, index) => (
        <InputNumber
          placeholder="数量"
          defaultValue="1"
          onChange={(value) => this.handleChange(value, 'quantity', index)} />
      )
    }, {
      title: '单价',
      dataIndex: 'unitPrice',
      width: 100,
      render: (text, record, index) => {
        const { billingAmount, billingTaxRate, quantity} = this.state.dataSource[index]
        return (
          <InputNumber
            placeholder="单价"
            value={billingTaxRate ? (billingAmount / (1 + parseFloat(billingTaxRate)) / (quantity ? quantity : 1)).toFixed(2) : 0}
            onChange={(value) => this.handleChange(value, 'unitPrice', index)}
          />
        )
      }
    }, {
      title: '不含税金额',
      dataIndex: 'billingAmountExcludeTax',
      width: 100,
      render: (text, record, index) => {
        const { billingAmount, billingTaxRate } = this.state.dataSource[index]
        return (
          <InputNumber
            placeholder="不含税金额"
            value={billingTaxRate ? (billingAmount / (1 + parseFloat(billingTaxRate))).toFixed(2) : 0}
            onChange={(value) => this.handleChange(value, 'billingAmountExcludeTax', index, record)}/>
        )
      }
    }, {
      title: '含税金额',
      dataIndex: 'billingAmount',
      width: 100,
      render: (text, record, index) => (
        <InputNumber
          placeholder="含税金额"
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
          hasEmpty
          value={`${this.state.dataSource[index]['billingTaxRate']}`}
          onChange={(v) => this.handleChange(v, 'billingTaxRate', index)}
        />
      )
    }, {
      title: '税额',
      dataIndex: 'billingTaxAmount',
      width: 100,
      render: (text, record, index) => {
        const { billingAmount, billingTaxRate} = this.state.dataSource[index]
        const unitPrice = billingAmount / (1 + parseFloat(billingTaxRate))
        return (
          <InputNumber
            placeholder="税额"
            value={(unitPrice * billingTaxRate).toFixed(2)}
            onChange={(value) => this.handleChange(value, 'billingTaxAmount', index)}
          />
        )
      }
    }, {
      title: '税收分类编码',
      dataIndex: 'taxCategoryCode',
      width: 120,
      render: (text, record, index) => {
        return (
          <SearchAllColumns
            url="/arc/billingApplication/taxInfo/search"
            columns={taxCategoryCols}
            label="税收分类编码"
            idKey="taxCategoryCode"
            valueKey="taxCategoryCode"
            value={this.state.dataSource[index]['taxCategoryCode']}
            onChange={(v) => this.handleChange(v, 'taxCategoryCode', index)}
          />
        )
      }
    }, {
      title: '税收分类名称',
      dataIndex: 'taxCategoryName',
      width: 120,
      render: (text, record, index) => {
        return (
          <Input
            value={this.state.dataSource[index]['taxCategoryName']}
            onChange={(e) => this.handleChange(e.target.value, 'taxCategoryName', index)}
          />
        )
      }
    }, {
      title: '优惠政策',
      dataIndex: 'prefPolicySign',
      width: 100,
      render: (text, record, index) => {
        return (
          <Select
            value={this.state.dataSource[index]['prefPolicySign']}
            onChange={(v) => this.handleChange(v, 'prefPolicySign', index)}>
            <Option value="">-请选择-</Option>
            <Option value="1">是</Option>
            <Option value="0">否</Option>
          </Select>
        )
      }
    }, {
      title: '优惠政策类型',
      dataIndex: 'prefPolicyType',
      width: 100,
      render: (text, record, index) => {
        return (
          <Select
            value={this.state.dataSource[index]['prefPolicyType']}
            onChange={(v) => this.handleChange(v, 'prefPolicyType', index)}
          >
            <Option value="">-请选择-</Option>
            <Option value="超税负3%即征即退">超税负3%即征即退</Option>
            <Option value="免税">免税</Option>
            <Option value="不征税">不征税</Option>
          </Select>
        )
      }
    }]
    return (
      <div>
        <Form
          className="ant-search-form"
        >
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
              <FormItem {...formItemLayout} label="开票类型">
                {
                  getFieldDecorator('billingType', {
                    initialValue: billingType
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
            <Col span={8} key={2}>
              <FormItem {...formItemLayout} label="开票日期">
                {
                  getFieldDecorator('billingDate', {initialValue: moment(billingDate, dateFormat)})(
                    <DatePicker format="YYYY-MM-DD"/>,
                  )
                }
              </FormItem>
            </Col>
            {
              this.props.applyType === 'BILLING_RED' ?
                <Col span={8} key={2}>
                  <FormItem {...formItemLayout} label="是否收到发票">
                    {
                      getFieldDecorator('receiptOutcome', {initialValue: ''})(
                        <Select>
                          <Option value="Y">是</Option>
                          <Option value="N">否</Option>
                        </Select>
                      )
                    }
                  </FormItem>
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
          <div className="add-btns">
            <Button type="primary" style={{marginLeft: '5px'}} ghost onClick={() => this.billingUnify()}>统一开票</Button>
          </div>
          <Table
            rowSelection={rowSelection}
            style={{marginBottom: '10px'}}
            rowKey={record => record.lineNo}
            bordered
            size="small"
            columns={columns}
            pagination={false}
            dataSource={this.state.dataSource}
            scroll={{ x: '1500px' }}
          />
          <Row gutter={40}>
            <Col span={24}>
              <FormItem {...span3ItemLayout} label="备注">
                {
                  getFieldDecorator('billingApplicantRemark', {initialValue: billingApplicantRemark, rules: [{max: 350, message: '备注不能超过350个字符!' }]})(
                    <TextArea placeholder="备注" rows="2" />
                  )
                }
              </FormItem>
            </Col>
          </Row>
          <Row gutter={40}>
            <Col span={24}>
              <FormItem {...span3ItemLayout} label="开票要求">
                {
                  getFieldDecorator('billingApplicantRequest', {initialValue: billingApplicantRequest, rules: [{max: 350, message: '开票要求不能超过350个字符!' }]})(
                    <TextArea placeholder="请输入开票要求" rows="2" />
                  )
                }
              </FormItem>
            </Col>
          </Row>
          <div className="add-btns">
            <Button
              type="primary"
              style={{marginLeft: '5px'}}
              ghost
              onClick={(e) => this.handleOk(e)}>
              <Icon type="check" />保存修改
            </Button>
          </div>
        </Form>
      </div>
    )
  }
}

export default Form.create()(BillApproveDetail)