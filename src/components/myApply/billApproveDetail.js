import React from 'react'
import { Table, Form, message, Row, Col, Input, DatePicker, Button, InputNumber, Icon, Select } from 'antd'
import SelectInvokeApi from '../common/selectInvokeApi'
import { proColumns, billDetailColumns, detailColumns, contentCols, taxCategoryCols, normalTypes, invoiceLineCols, totalColumns } from '../billApplication/billColumns'
import SearchAllColumns from '../common/SearchAllColumns'
import requestJsonFetch from '../../http/requestJsonFecth'
import moment from 'moment';
import './billApproveDetail.css'
const FormItem = Form.Item
const TextArea = Input.TextArea
const dateFormat = 'YYYY/MM/DD';
const Option = Select.Option
const showReceive = ['BILLING_RED', 'BILLING_RED_OTHER', 'BILLING_INVALID']
const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 12 },
}
const formItemLayout1 = {
  labelCol: { span: 12 },
  wrapperCol: { span: 8 },
}
const span3ItemLayout = {
  labelCol: { span: 3 },
  wrapperCol: { span: 20 },
}

class BillApproveDetail extends React.Component  {
  constructor(props) {
    super(props)
    const appLineList = props.serviceDetail.appLineList ? props.serviceDetail.appLineList : []
    const dataSource = appLineList.map(detail => ({
        ...detail,
        isParent: 1,
        quantity: detail.quantity ? detail.quantity : 1,
        lineNo: detail.lineNo - 1,
        totalAmount: detail.billingAmount ? detail.billingAmount : 0,
      })
    )
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
    if(this.props.setFormValidate) {
      this.props.setFormValidate(dataSource)
    }
    //AR财务会计&&其他事项开票可修改城建税
    this.isEditTax = props.taskCode === 'ar_finance_account' && props.applyType === 'BILLING_EXCESS'

  }

  handleAdd = (lineNo, arBillingId, contractItemId) => {
    let { count, dataSource } = this.state;
    let newData = {
      lineNo: count,
      groupNo: 1,
      isParent: 0,
      arBillingId,
      contractItemId,
      billingContent: '',
      specificationType: '',
      unit: '',
      quantity: 1,
      unitPrice: 0,
      noRateAmount: 0,
      billingAmount: 0,
      billingTaxRate: 0,
      billingTaxAmount: 0,
      billingAmountExcludeTax: 0,
    };
    if(this.isEditTax) {
      newData = Object.assign(newData, {
        constructionTax: 0,
        educationTax: 0,
        incomeTax: 0,
        addTaxAmount: 0,
      })
    }

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
      const result = dataSource.filter(d => d.isParent === 1 && record.arBillingId === d.arBillingId)[0]
      let total = 0
      dataSource.map(d => {
        if(d.arBillingId === record.arBillingId && d.isParent === 0 && d.lineNo !== index){
          total += (d.billingAmount ? d.billingAmount : 0)
        }
      })
      //校验所有拆分子项的金额必须小于父级含税金额
      const childAmount = total + value
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
    } else if (col === 'prefPolicySign') {
      dataSource[index][col] = value
      dataSource[index]['prefPolicyType'] = ''
    } else {
      dataSource[index][col] = value
    }
    this.setState({
      dataSource: dataSource
    })
    if(this.props.setFormValidate) {
      this.props.setFormValidate(dataSource)
    }
  }

  billingUnify = () => {
    let { selectedRows, currentNo, dataSource } = this.state
    const groupNo = selectedRows[0].groupNo
    if(dataSource.length ===  selectedRows.length) {
      currentNo = 0
    } else {
      const selectNos = selectedRows.map(r => r.lineNo)
      const groupNos = dataSource.filter(d => !selectNos.includes(d.lineNo)).map( r => r.groupNo)
      currentNo = groupNos.length === 0 ? 1 : Math.max(...groupNos)
    }
    selectedRows.map(record => {
      dataSource[record.lineNo]['groupNo'] = currentNo + 1
    })
    this.setState({
      dataSource: dataSource,
      selectedRowKeys: [],
    })
  }

  fieldCheck = (value) => {
    return value === '' || typeof value === 'undefined' || value === 0
  }

  handleOk = (e) => {
    e.preventDefault();
    const { isAgainInvoice } = this.props.serviceDetail
    const isTaxAndFinance = this.props.taskCode === 'tax_auditor' || this.props.taskCode === 'ar_finance_account'
    this.props.form.validateFields((err, values) => {
      if(isAgainInvoice !== 'false') {
        this.state.dataSource.map((record, index) => {
          if(this.props.taskCode === 'ar_admin') {
            if(this.fieldCheck(record.quantity)) {
              message.error(`请填写第${index + 1}行的数量`)
              err = true
            } else if(this.fieldCheck(record.billingAmount)) {
              message.error(`请填写第${index + 1}行的含税金额`)
              err = true
            } else if(record.billingTaxRate === '' || typeof record.billingTaxAmount === 'undefined') {
              message.error(`请填写第${index + 1}行的税率`)
              err = true
            } else if(record.prefPolicySign === '1' && this.fieldCheck(record.prefPolicyType)) {
              message.error(`请填写第${index + 1}行的优惠政策类型`)
              err = true
            }
          } else if(isTaxAndFinance) {
            if(this.fieldCheck(record.billingContent)) {
              message.error(`请填写第${index + 1}行的开票内容`)
              err = true
            } else if(this.fieldCheck(record.quantity)) {
              message.error(`请填写第${index + 1}行的数量`)
              err = true
            } else if(record.unit === '' || typeof record.unit === 'undefined') {
              message.error(`请填写第${index + 1}行单位`)
              err = true
            } else if(this.fieldCheck(record.billingAmount)) {
              message.error(`请填写第${index + 1}行的含税金额`)
              err = true
            } else if(record.billingTaxRate === '' || typeof record.billingTaxAmount === 'undefined') {
              message.error(`请填写第${index + 1}行的税率`)
              err = true
            } else if(this.fieldCheck(record.taxCategoryCode)) {
              message.error(`请填写第${index + 1}行的税收分类编码`)
              err = true
            } else if(this.fieldCheck(record.prefPolicySign)) {
              message.error(`请填写第${index + 1}行的优惠政策`)
              err = true
            } else if(record.prefPolicySign === '1' && this.fieldCheck(record.prefPolicyType)) {
              message.error(`请填写第${index + 1}行的优惠政策类型`)
              err = true
            }
          }
          if(err) {
            return
          }
        })
      }
      if (!err) {
        const params = isAgainInvoice !== 'false' ? {
          ...values,
          billingApplicationId: this.props.serviceDetail.billingApplicationId,
          billingApplicationType: values.billFlow ? values.billFlow : this.props.applyType,
          billingDate: values.billingDate ? values.billingDate.format('YYYY-MM-DD') : '',
          appLineItems: this.state.dataSource.map(record => ({
            ...record,
            lineNo: record.lineNo + 1,
          })),
        } : {
            ...values,
            billingApplicationId: this.props.serviceDetail.billingApplicationId,
            billingApplicationType: this.props.applyType,
          }
        requestJsonFetch('/arc/billingApplication/workFlowEdit', {
            method: 'POST',
            body: params,
          }, (res) => {
            const {resultCode, resultMessage, data} = res
            if (resultCode === '000000') {
              message.success('发票申请详情保存成功!')
              const newSources = this.state.dataSource.map((record, index) => ({
                  ...record,
                  billingAppLineId: data[index]
                })
              )
              this.setState({
                dataSource: newSources
              })
            } else {
              message.error(resultMessage, 5)
            }
          }
        )
      }
    });
  }

  calBillAmountTax = (dataSource, index, billingAmount, billingTaxRate, quantity) => {
    const excludeTax = billingAmount / (1 + parseFloat(billingTaxRate))
    dataSource[index]['billingAmountExcludeTax'] = (billingAmount / (1 + parseFloat(billingTaxRate))).toFixed(2)
    dataSource[index]['unitPrice'] = (excludeTax / (quantity ? quantity : 1)).toFixed(2)
    dataSource[index]['billingTaxAmount'] = (excludeTax * billingTaxRate).toFixed(2)
  }

  getTaxData = () => {
    const { constructionTax, constructionTaxAmount, educationTax, educationTaxAmount, incomeTax, incomeTaxAmount, addTaxAmount, totalTaxAmount } = this.props.serviceDetail.arcBillingTaxInfo
    let constructionTotal = 0
    let educationTotal = 0
    let incomeTotal = 0
    let addTotal = 0
    this.state.dataSource.map(r => {
      constructionTotal += r.constructionTax ? r.constructionTax : 0
      educationTotal += r.educationTax ? r.educationTax : 0
      incomeTotal += r.incomeTax ? r.incomeTax : 0
      addTotal += r.addTaxAmount ? r.addTaxAmount : 0
    })

    return [{
      title: '城建',
      taxRate: constructionTax,
      tax: constructionTotal.toFixed(2),
    }, {
      title: '教育',
      taxRate: educationTax,
      tax: educationTotal.toFixed(2),
    }, {
      title: '所得税',
      taxRate: incomeTax,
      tax: incomeTotal.toFixed(2),
    }, {
      title: '增值税',
      taxRate: '',
      tax: addTotal.toFixed(2),
    }, {
      title: '合计',
      taxRate: '',
      tax: (constructionTotal + educationTotal + incomeTotal + addTotal).toFixed(2),
    }]
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { billingType, billingDate, billingApplicantRequest, comInfo ={}, custInfo = {}, contractList, outcomeList,
      billingApplicantRemark, fileName, filePath, receiptOutcome, receiptOutcomeTaxVp, isAgainInvoice, redOrInvalid, costBearName, costBear } = this.props.serviceDetail
    //是否红冲发票
    const isReceiveInvoice = showReceive.includes(this.props.applyType)
    //AR管理员
    const isArAdmin = this.props.taskCode === 'ar_admin'
    //AR财务会计
    const isArFinanceAccount = this.props.taskCode === 'ar_finance_account'
    //税务审核人
    const isTaxAuditor = this.props.taskCode === 'tax_auditor'
    //项目经理
    const isProManager = this.props.taskCode === 'project_manager'

    const detailData = [
      {
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
    let columns = [
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
      width: 250,
      render: (text, record, index) => (
        <SearchAllColumns
          url="/arc/billingApplication/billingContent/search"
          columns={contentCols}
          label="开票内容"
          width="1000px"
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
          defaultValue={this.state.dataSource[index]['quantity']}
          onChange={(value) => this.handleChange(value, 'quantity', index)} />
      )
    }, {
      title: '单价',
      dataIndex: 'unitPrice',
      width: 100,
      render: (text, record, index) => {
        return (
          <InputNumber
            placeholder="单价"
            value={this.state.dataSource[index]['unitPrice']}
            onChange={(value) => this.handleChange(value, 'unitPrice', index)}
          />
        )
      }
    }, {
      title: '不含税金额',
      dataIndex: 'billingAmountExcludeTax',
      width: 100,
      render: (text, record, index) => {
        return (
          <InputNumber
            placeholder="不含税金额"
            value={this.state.dataSource[index]['billingAmountExcludeTax']}
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
            value={this.state.dataSource[index]['billingTaxAmount']}
            onChange={(value) => this.handleChange(value, 'billingTaxAmount', index)}
          />
        )
      }
    }, {
      title: '税收分类编码',
      dataIndex: 'taxCategoryCode',
      width: 150,
      render: (text, record, index) => {
        return (
          <SearchAllColumns
            url="/arc/billingApplication/taxInfo/search"
            columns={taxCategoryCols}
            label="编码名称"
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
      width: 150,
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
            defaultValue="0"
            value={this.state.dataSource[index]['prefPolicySign']}
            onChange={(v) => this.handleChange(v, 'prefPolicySign', index)}>
            <Option value="1">是</Option>
            <Option value="0">否</Option>
          </Select>
        )
      }
    }, {
      title: '优惠政策类型',
      dataIndex: 'prefPolicyType',
      width: 130,
      render: (text, record, index) => {
        return (
          <Select
            value={this.state.dataSource[index]['prefPolicyType']}
            onChange={(v) => this.handleChange(v, 'prefPolicyType', index)}
            disabled={this.state.dataSource[index]['prefPolicySign'] === '0'}
          >
            <Option value="">-请选择-</Option>
            <Option value="超税负3%即征即退">超税负3%即征即退</Option>
            <Option value="免税">免税</Option>
            <Option value="不征税">不征税</Option>
          </Select>
        )
      }
    }]
    if(this.isEditTax) {
      const taxColumns = [{
        title: '城建税税额',
        dataIndex: 'constructionTax',
        width: 100,
        render: (text, record, index) => {
          return (
            <InputNumber
              value={this.state.dataSource[index]['constructionTax']}
              onChange={(v) => this.handleChange(v, 'constructionTax', index)}
            />
          )
        }
      }, {
        title: '教育税税额',
        dataIndex: 'educationTax',
        width: 100,
        render: (text, record, index) => {
          return (
            <InputNumber
              value={this.state.dataSource[index]['educationTax']}
              onChange={(v) => this.handleChange(v, 'educationTax', index)}
            />
          )
        }
      }, {
        title: '所得税税额',
        dataIndex: 'incomeTax',
        width: 100,
        render: (text, record, index) => {
          return (
            <InputNumber
              value={this.state.dataSource[index]['incomeTax']}
              onChange={(v) => this.handleChange(v, 'incomeTax', index)}
            />
          )
        }
      }, {
        title: '增值税税额',
        dataIndex: 'addTaxAmount',
        width: 100,
        render: (text, record, index) => {
          return (
            <InputNumber
              value={this.state.dataSource[index]['addTaxAmount']}
              onChange={(v) => this.handleChange(v, 'addTaxAmount', index)}
            />
          )
        }
      }]
      columns = columns.concat(taxColumns)
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
        {isAgainInvoice === 'false' && (isArAdmin || isArFinanceAccount || isTaxAuditor)  ?
          <Row gutter={40}>
            {
              showReceive.includes(this.props.applyType) && !isArAdmin ?
                <Col span={8}>
                  <FormItem {...formItemLayout} label="是否收到发票">
                    {
                      getFieldDecorator(isTaxAuditor ? 'receiptOutcomeTaxVp' : 'receiptOutcome',
                        {initialValue: receiptOutcome, rules: [{ required: true, message: '请选择是否收到发票!' }]})(
                        <Select>
                          <Option value="Y">是</Option>
                          <Option value="N">否</Option>
                        </Select>
                      )
                    }
                  </FormItem>
                </Col> : null
            }
            {
              this.props.applyType === 'BILLING_RED' && !isArAdmin ?
                <Col span={8}>
                  <FormItem {...formItemLayout} label="退票类型">
                    {
                      getFieldDecorator('redOrInvalid', {initialValue: redOrInvalid, rules: [{ required: this.props.applyType === 'BILLING_RED' && isArFinanceAccount , message: '请选择退票类型!' }]})(
                        <SelectInvokeApi
                          typeCode="RED_TYPE_SELECT"
                          paramCode="RED_OR_INVALID"
                          placeholder="退票类型"
                          hasEmpty
                          disabled={isTaxAuditor}
                        />
                      )
                    }
                  </FormItem>
                </Col> : null
            }
            {
              isTaxAuditor ?
                <Col span={8}>
                  <FormItem {...formItemLayout} label="AR财务会计是否收到发票">
                    {
                      receiptOutcome === 'Y' ? '是' : '否'
                    }
                  </FormItem>
                </Col>
               : null
            }
          </Row>
          :
          <div>
            <Row gutter={40}>
              {
                this.props.applyType === 'BILLING_EXCESS' ?
                  <Col span={8}>
                    <FormItem {...formItemLayout} label="费用承担者">
                      {
                        isProManager ?
                        getFieldDecorator('costBear',{initialValue: costBear, rules: [{ required: isProManager, message: '请选择费用承担者!' }]})(
                          //项目经理可以修改费用承担者
                            <SelectInvokeApi
                              typeCode="BILLING_APPLICATION"
                              paramCode="COST_BEAR"
                              placeholder="费用承担着"
                              hasEmpty
                            />
                        ): costBearName
                      }
                    </FormItem>
                  </Col> : null
              }
              <Col span={8}>
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
                        disabled={isProManager}
                      />
                    )
                  }
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem {...formItemLayout} label="开票日期">
                  {
                    getFieldDecorator('billingDate', {initialValue: moment(billingDate, dateFormat)})(
                      <DatePicker format="YYYY-MM-DD" disabled={isProManager}/>,
                    )
                  }
                </FormItem>
              </Col>
              {
                isReceiveInvoice && (isArFinanceAccount || isTaxAuditor) ?
                  <Col span={8}>
                    <FormItem {...formItemLayout} label="是否收到发票">
                      {
                        getFieldDecorator(isTaxAuditor ? 'receiptOutcomeTaxVp' : 'receiptOutcome',
                          {initialValue: isTaxAuditor ? receiptOutcomeTaxVp : receiptOutcome, rules: [{ required: isReceiveInvoice, message: '请选择是否收到发票!' }]})(
                          <Select>
                            <Option value="Y">是</Option>
                            <Option value="N">否</Option>
                          </Select>
                        )
                      }
                    </FormItem>
                  </Col> : null
              }
              {
                this.props.isApprove ?
                  <Col span={8}>
                    <FormItem {...formItemLayout} label="开票流程">
                      {
                        getFieldDecorator('billFlow',
                          {initialValue: 'BILLING_CONTRACT', rules: [{ required: this.props.isApprove, message: '请选择开票流程!' }]})(
                          <SelectInvokeApi
                            typeCode="TYPE_SELECT"
                            paramCode="BILLING_APPLICATION_TYPE"
                            placeholder="开票流程"
                            onChange={(v) => this.props.setBillApplicationType(v)}
                            hasEmpty={false}
                          />
                        )
                      }
                    </FormItem>
                  </Col> : null
              }
            </Row>
            {
              <Row gutter={40}>
                {
                  isTaxAuditor && isReceiveInvoice ?
                    <Col span={8}>
                      <FormItem {...formItemLayout1} label="AR财务会计是否收到发票">
                        {
                          receiptOutcome === 'Y' ? '是' : '否'
                        }
                      </FormItem>
                    </Col> : null
                }
                {
                  this.props.applyType === 'BILLING_RED' && (isArFinanceAccount || isTaxAuditor) ?
                    <Col span={8}>
                      <FormItem {...formItemLayout} label="退票类型">
                        {
                          getFieldDecorator('redOrInvalid', {initialValue: redOrInvalid,
                            rules: [{ required: this.props.applyType === 'BILLING_RED' && isArFinanceAccount, message: '请选择退票类型!' }]})(
                            <SelectInvokeApi
                              typeCode="RED_TYPE_SELECT"
                              paramCode="RED_OR_INVALID"
                              placeholder="退票类型"
                              hasEmpty
                              disabled={isTaxAuditor}
                            />
                          )
                        }
                      </FormItem>
                    </Col> : null
                }
              </Row>
            }
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
            {
              isArAdmin || isArFinanceAccount ?
                <div className="add-btns">
                  <Button type="primary" style={{marginLeft: '5px'}} ghost onClick={() => this.billingUnify()}>统一开票</Button>
                </div> : null
            }
            <Table
              rowSelection={rowSelection}
              style={{marginBottom: '10px'}}
              rowKey={record => record.lineNo}
              bordered
              size="small"
              columns={isProManager ? invoiceLineCols : columns}
              pagination={false}
              dataSource={this.state.dataSource}
              scroll={{ x: this.isEditTax ? '2000px' : '1600px' }}
            />
            {
              this.props.applyType === 'BILLING_EXCESS' ?
                <div className="arc-info">
                  <Table
                  style={{width: '70%'}}
                  rowKey="id"
                  size="small"
                  bordered
                  columns={totalColumns}
                  dataSource={this.getTaxData()}
                  pagination={false}
                />
                </div> : null
            }
            <Row gutter={40}>
              <Col span={19}>
                <FormItem {...span3ItemLayout} label="备注">
                  {!isProManager ?
                    getFieldDecorator('billingApplicantRemark', {initialValue: billingApplicantRemark, rules: [{max: 350, message: '备注不能超过350个字符!' }]})(
                      <TextArea placeholder="备注" rows="2" />
                    ) : billingApplicantRemark
                  }
                </FormItem>
              </Col>
            </Row>
            <Row gutter={40}>
              <Col span={19}>
                <FormItem {...span3ItemLayout} label="开票原因及要求">
                  {!isProManager ?
                    getFieldDecorator('billingApplicantRequest', {initialValue: billingApplicantRequest, rules: [{max: 350, message: '开票原因及要求不能超过350个字符!' }]})(
                      <TextArea placeholder="请输入开票原因及要求" rows="2" />
                    ) : billingApplicantRequest
                  }
                </FormItem>
              </Col>
            </Row>
            <Row gutter={40}>
              <Col span={19}>
                <FormItem {...span3ItemLayout} label="附件">
                  <a href="javascript:void(0)" onClick={() => this.props.fileDown({objectId: filePath, objectName: fileName})}>{fileName}</a>
                </FormItem>
              </Col>
            </Row>
          </div>
        }
        {
          !(isArAdmin && isAgainInvoice === 'false') ?
            <div className="add-btns">
              <Button
                type="primary"
                style={{marginLeft: '5px'}}
                ghost
                onClick={(e) => this.handleOk(e)}>
                <Icon type="check" />保存修改
              </Button>
            </div> : null
        }
      </div>
    )
  }
}

export default BillApproveDetail
