import React from 'react'
import { Table, Form, message, Row, Col, Input, DatePicker, Button, InputNumber, Icon, Select } from 'antd'
import SelectInvokeApi from '../common/selectInvokeApi'
import { proColumns, billDetailColumns, detailColumns, contentCols, contentOnlyCols, taxCategoryCols, totalColumns, clientCols, comCols, receiveInvoice } from '../billApplication/billColumns'
import SearchAllColumns from '../common/SearchAllColumns'
import requestJsonFetch from '../../http/requestJsonFecth'
import moment from 'moment';
import InputSearch from '../billApplication/inputSearch'
import MultipleInput from '../common/multipleInput'
import './billApproveDetail.less'
import { toThousands } from "../../util/currency";
import getByteLen, {checkEmail} from "../../util/common";
const FormItem = Form.Item
const TextArea = Input.TextArea
const dateFormat = 'YYYY/MM/DD';
const Option = Select.Option
const showReceive = ['BILLING_RED', 'BILLING_RED_OTHER']
const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 12 },
}
const formItemLayout1 = {
  labelCol: { span: 12 },
  wrapperCol: { span: 8 },
}
const formItemLayout2 = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
}
const span3ItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
}

class BillApproveDetail extends React.Component  {
  constructor(props) {
    super(props)
    const appLineList = props.serviceDetail.appLineList ? props.serviceDetail.appLineList : []
    const { custInfo, comInfo } = props.serviceDetail
    const dataSource = appLineList.map(detail => ({
        ...detail,
        lineNo: detail.lineNo - 1,
        totalAmount: detail.billingAmount ? detail.billingAmount : 0,
        prefPolicySign: props.taskCode === 'ar_finance_account' && detail.billingTaxRate === 0 ? '1' : detail.prefPolicySign
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
      saveLoading: false,
      custInfo: custInfo,
      comInfo: comInfo,
    }
    if(this.props.setFormValidate) {
      this.props.setFormValidate({
        serviceDetail: dataSource,
        custInfo: custInfo,
        comInfo: comInfo,
      })
    }
    //AR财务会计&&其他事项开票可修改城建税
    this.isEditTax = props.taskCode === 'ar_finance_account' && props.applyType === 'BILLING_EXCESS'
  }

  handleAdd = (lineNo, arBillingId, contractItemId) => {
    let { count, dataSource } = this.state;
    let newData = {
      lineNo: count,
      groupNo: 1,
      isParent: '0',
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
      prefPolicySign: this.props.taskCode === 'ar_finance_account' ? '1' : '',
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
    let parentIndex = 0
    this.state.dataSource.map((item, index) => {
      if(record.arBillingId === item.arBillingId && item.isParent === '1') {
        parentIndex = item.lineNo
        const amount = dataSource[item.lineNo]['billingAmount']
        dataSource[item.lineNo]['billingAmount'] = parseFloat(record.billingAmount) + parseFloat(amount)
      }
    })
    const { billingTaxRate, quantity, billingAmount } = dataSource[parentIndex]
    this.calBillAmountTax(dataSource, parentIndex, billingAmount, billingTaxRate, quantity)
    dataSource.splice(record.lineNo, 1)
    const newSource = dataSource.map((record, index) => ({
      ...record,
      lineNo: index,
    }))
    this.setState({ dataSource: newSource });
    if(this.props.setFormValidate) {
      this.props.setFormValidate({
        serviceDetail: dataSource,
        custInfo: this.state.custInfo,
        comInfo: this.state.comInfo,
      })
    }
  }
  /**
   * 改动变化原则
   * 1、不含税金额 = 含税金额 / (1 + 税率)，
   * 2、单价 = 不含税金额 / 数量
   * 3、税额 = 不含税金额 * 税率
   * @param value
   * @param col
   * @param index
   * @param record
   */
  handleChange = (value, col, index, record) => {
    let dataSource = this.state.dataSource
    if(col === 'billingContent') {
      dataSource[index][col] = value.billingContentName ? value.billingContentName : ''
      dataSource[index]['billingRecordId'] = value.billingRecordId ? value.billingRecordId : ''
      dataSource[index]['taxCategoryCode'] = value.taxCategoryCode ? value.taxCategoryCode : ''
      dataSource[index]['taxCategoryName'] = value.taxCategoryName ? value.taxCategoryName : ''
      if(!(parseFloat(dataSource[index]['billingTaxRate']) === 0 && this.props.taskCode === 'ar_finance_account')) {
        dataSource[index]['prefPolicySign'] = value.prefPolicySign ? value.prefPolicySign : ''
        dataSource[index]['prefPolicyType'] = value.prefPolicyContent ? value.prefPolicyContent : ''
      }
    } else if (col === 'taxCategoryCode') {
      dataSource[index][col] = value.taxCategoryCode ? value.taxCategoryCode : ''
      dataSource[index]['taxCategoryName'] = value.taxCategoryName ? value.taxCategoryName : ''
      dataSource[index]['prefPolicySign'] = value.prefPolicySign ? value.prefPolicySign : ''
      dataSource[index]['prefPolicyType'] = value.prefPolicySign === '1' ? value.prefPolicyType : ''
    } else if(col === 'billingAmount') {//含税金额
      const { billingAmount, billingTaxRate, quantity } = this.state.dataSource[index]
      if(record.isParent === '1') {//操作的记录为父节点
        dataSource[index]['billingAmount'] = value
        dataSource[index]['totalAmount'] = value
        this.calBillAmountTax(dataSource, index, value, billingTaxRate, quantity)
      } else {
        const result = dataSource.filter(d => d.isParent === '1' && record.arBillingId === d.arBillingId)[0]
        let total = 0
        //1、计算子节点金额总和
        dataSource.map(d => {
          if(d.arBillingId === record.arBillingId && d.isParent === '0' && d.lineNo !== index){
            total += (d.billingAmount ? d.billingAmount : 0)
          }
        })
        const childAmount = total + value
        //2、父节点金额重新计算
        dataSource[result.lineNo]['billingAmount'] = result.totalAmount - childAmount
        const parent = this.state.dataSource[result.lineNo]
        this.calBillAmountTax(dataSource, result.lineNo, parent.billingAmount, parent.billingTaxRate, parent.quantity)
        //3、子节点金额重新计算
        dataSource[index]['billingAmount'] = value
        this.calBillAmountTax(dataSource, index, value, billingTaxRate, quantity)
      }
    } else if (col === 'billingTaxRate') {//税率
      const { billingAmount, quantity} = this.state.dataSource[index]
      this.calBillAmountTax(dataSource, index, billingAmount, value, quantity)
      dataSource[index][col] = value
      //税率为0时，优惠政策为是
      if(this.props.taskCode === 'ar_finance_account' && value === '0') {
        dataSource[index]['prefPolicySign'] = '1'
      }
    } else if (col === 'quantity') {//数量
      dataSource[index][col] = value
      const { unitPrice } = dataSource[index]
      const { billingAmountExcludeTax } = this.state.dataSource[index]
      dataSource[index]['unitPrice'] = value ? (billingAmountExcludeTax / value).toFixed(2) : unitPrice

    }else if (col === 'unitPrice') {//单价
      dataSource[index][col] = value
      const { billingAmountExcludeTax, quantity } = this.state.dataSource[index]
      if(value) {
        const newQuantity = (billingAmountExcludeTax / value).toFixed(5)
        dataSource[index]['quantity'] = parseFloat(newQuantity)
      }
    } else if (col === 'billingTaxAmount') {//含税金额
      const { billingAmount, quantity } = this.state.dataSource[index]
      if(value > billingAmount) {
        message.error('含税金额不能大于含税金额')
        return
      } else {
        dataSource[index][col] = value
      }
      dataSource[index]['billingAmountExcludeTax'] = billingAmount - value
      dataSource[index]['unitPrice'] = ((billingAmount - value) / quantity).toFixed(2)

    } else if (col === 'billingAmountExcludeTax') {//不含税金额

      const { billingAmount, quantity } = this.state.dataSource[index]
      //如果修改的不含税金额大于含税金额，提示
      if(value > billingAmount) {
        message.error('不含税金额不能大于含税金额')
        return
      } else {
        dataSource[index][col] = value
      }
      dataSource[index].billingTaxAmount = (billingAmount - value).toFixed(2)
      dataSource[index].unitPrice = (value / quantity).toFixed(2)

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
      this.props.setFormValidate({
        serviceDetail: dataSource,
        custInfo: this.state.custInfo,
        comInfo: this.state.comInfo,
      })
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
    if(this.props.setFormValidate) {
      this.props.setFormValidate({
        serviceDetail: dataSource,
        custInfo: this.state.custInfo,
        comInfo: this.state.comInfo,
      })
    }
  }

  fieldCheck = (value) => {
    return value === '' || typeof value === 'undefined' || value === 0
  }

  handleOk = (e) => {
    e.preventDefault();
    const { isAgainInvoice } = this.props.serviceDetail
    const isTaxAndFinance = this.props.taskCode === 'tax_auditor' || this.props.taskCode === 'ar_finance_account'
    this.props.form.validateFields((err, values) => {
      if(this.props.taskCode === 'ar_admin' || this.props.isArAdminRole) {
        const invalidEmail =  Array.isArray(values.receiptEmail) ? values.receiptEmail.filter(email => !checkEmail(email)) : []
        if(invalidEmail.length > 0) {
          this.props.form.setFields({
            receiptEmail: {
              value: values.receiptEmail,
              errors: [new Error(`邮箱${invalidEmail.join(',')}格式有误，请重新输入`)],
            },
          });
          err = true
        }
      }
      if(isAgainInvoice !== 'false') {
        let map = new Map()
        for(let i = 0; i< this.state.dataSource.length; i++) {
          const record = this.state.dataSource[i]
          if(this.props.taskCode === 'ar_admin') {
            if(this.fieldCheck(record.billingAmount)) {
              message.warning(`请填写第${i + 1}行的含税金额`)
              err = true
              break
            } else if(record.billingTaxRate === '' || typeof record.billingTaxAmount === 'undefined') {
              message.warning(`请填写第${i + 1}行的税率`)
              err = true
              break
            } else if(record.prefPolicySign === '1' && this.fieldCheck(record.prefPolicyType)) {
              message.warning(`请填写第${i + 1}行的优惠政策类型`)
              err = true
              break
            }
          } else if(isTaxAndFinance) {
            if(this.props.taskCode !== 'tax_auditor' && this.fieldCheck(record.billingContent)) {
              message.warning(`请填写第${i + 1}行的开票内容`)
              err = true
              break
            } else if(this.fieldCheck(record.billingAmount)) {
              message.warning(`请填写第${i + 1}行的含税金额`)
              err = true
              break
            } else if(record.billingTaxRate === '' || typeof record.billingTaxAmount === 'undefined') {
              message.warning(`请填写第${i + 1}行的税率`)
              err = true
              break
            } else if(this.fieldCheck(record.taxCategoryCode)) {
              message.warning(`请填写第${i + 1}行的税收分类编码`)
              err = true
              break
            } else if(this.fieldCheck(record.prefPolicySign)) {
              message.warning(`请填写第${i + 1}行的优惠政策`)
              err = true
              break
            } else if(record.prefPolicySign === '1' && this.fieldCheck(record.prefPolicyType)) {
              message.warning(`请填写第${i + 1}行的优惠政策类型`)
              err = true
              break
            }
            //税率容差控制 税率为0不能修改税额和不含税金额
            const excludeTaxAmount = record.billingAmount / (1 + parseFloat(record.billingTaxRate))
            const taxAmount = parseFloat((record.billingAmount - excludeTaxAmount).toFixed(2))
            const taxTolerance = parseFloat((taxAmount - record.billingTaxAmount).toFixed(2))
            if(parseFloat(record.billingTaxRate) === 0) {
              if(Math.abs(taxTolerance) > 0) {
                message.warning(`第【${i + 1}】行税率为0%，税额只能为0，请调整!`)
                err = true
                break
              }
            } else {
              if(Math.abs(taxTolerance) > 0.06) {
                message.warning(`第【${i + 1}】行不含税金额或者税额容差超过6分钱，请调整！`)
                err = true
                break
              }
            }
            let sumAmount = map.get(record.groupNo) || 0
            map.set(record.groupNo, taxTolerance + sumAmount)
          }
        }
        if(isTaxAndFinance) {
          for(let [key, value] of map) {
            if(Math.abs(value) > 0.62) {
              message.warning(`组号【${key}】发票不含税金额合计或者税额合计容差超过0.62分钱，请调整`)
              err = true
              break;
            }
          }
        }
      }
      if(err) {
        return false
      }
      if (!err) {
        this.setState({
          saveLoading: true,
        })
        const params = isAgainInvoice !== 'false' ? {
          ...values,
          billingCustInfoId: this.state.custInfo.billingCustInfoId,
          billingComInfoId: this.state.comInfo.billingComInfoId,
          billingApplicationId: this.props.serviceDetail.billingApplicationId,
          billingApplicationType: values.billFlow ? values.billFlow : this.props.applyType,
          billingDate: values.billingDate ? values.billingDate.format('YYYY-MM-DD') : '',
          billingApplicantRemark: values.billingApplicantRemark ? values.billingApplicantRemark.trim() : '',
          billingApplicantRequest: values.billingApplicantRequest ? values.billingApplicantRequest.trim() : '',
          appLineItems: this.state.dataSource.map(record => ({
            ...record,
            lineNo: record.lineNo + 1,
          })),
          receiptEmail: values.receiptEmail.length > 0 ? values.receiptEmail.join(',') : '',
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
                dataSource: newSources,
                saveLoading: false,
              })
            } else {
              message.error(resultMessage, 5)
              this.setState({
                saveLoading: false,
              })
            }
          }
        )
      }
    });
  }

  calBillAmountTax = (dataSource, index, billingAmount, billingTaxRate, quantity) => {
    const excludeTax = billingAmount / (1 + parseFloat(billingTaxRate))
    dataSource[index]['billingAmountExcludeTax'] = excludeTax.toFixed(2)
    dataSource[index]['unitPrice'] = (excludeTax / (quantity || 1)).toFixed(2)
    dataSource[index]['billingTaxAmount'] = (excludeTax * billingTaxRate).toFixed(2)
  }

  handleCompanyChange = (v, index) => {
    if(index === 0) {
      this.setState({
        custInfo: v
      })
    } else {
      this.setState({
        comInfo: v
      })
    }
    if(this.props.setFormValidate) {
      this.props.setFormValidate({
        serviceDetail: this.state.dataSource,
        custInfo: index === 0 ? v : this.state.custInfo,
        comInfo: index === 1 ? v : this.state.comInfo,
      })
    }
  }

  getTaxData = () => {
    const { constructionTax, educationTax, incomeTax } = this.props.serviceDetail.arcBillingTaxInfo
    let constructionTotal = 0
    let educationTotal = 0
    let incomeTotal = 0
    let addTotal = 0
    this.state.dataSource.map(r => {
      constructionTotal += r.constructionTax ? parseFloat(r.constructionTax) : 0
      educationTotal += r.educationTax ? parseFloat(r.educationTax) : 0
      incomeTotal += r.incomeTax ? parseFloat(r.incomeTax) : 0
      addTotal += r.addTaxAmount ? parseFloat(r.addTaxAmount) : 0
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

  getCustInfoColumns = () => {
    return [{
      title: '',
      dataIndex: 'title',
      width: 50,
      float: 'left',
    }, {
      title: '客户名称',
      dataIndex: 'customerName',
      width: 200,
      float: 'left',
      render: (text, record, index) => (
        index === 0 ?
          <InputSearch
            width='700px'
            url="/arc/billingApplication/custom/search"
            columns={clientCols}
            label="客户名称"
            idKey="billingCustInfoId"
            valueKey="custName"
            showSearch={true}
            value={this.state.custInfo}
            onChange={(v) => this.handleCompanyChange(v, index)}
          /> :
          <InputSearch
            width='800px'
            url="/arc/billingApplication/company/search"
            columns={comCols}
            label="公司名称"
            idKey="billingComInfoId"
            valueKey="comName"
            showSearch={true}
            value={this.state.comInfo}
            onChange={(v) => this.handleCompanyChange(v, index)}
          />
      )
    }, {
      title: '纳税人识别码',
      dataIndex: 'taxPayer',
      width: 100,
    }, {
      title: '地址电话',
      dataIndex: 'address',
      width: 200,
    }, {
      title: '开户行及账号',
      dataIndex: 'bankAccount',
      width: 180,
    }]
  }

  getProManagerColumns = () => {
    const invoiceLineCols = [{
      title: '组号',
      dataIndex: 'groupNo',
      width: 50,
      fixed: 'left',
      render: (text) =>
        text === '合计' ? <span style={{fontWeight: 'bold', color: '#ff8928'}}>{text}</span> : text
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
      render: (text, record) => (
        record.groupNo === '合计' ? <span style={{color: '#ff8928'}}>{toThousands(record.billingAmountExcludeTax)}</span> : text
      )
    }, {
      title: '含税金额',
      dataIndex: 'billingAmount',
      width: 100,
      render: (text, record) => (
        record.groupNo === '合计' ? <span style={{color: '#ff8928'}}>{toThousands(record.billingAmount)}</span> : text
      )
    }, {
      title: '税率',
      dataIndex: 'billingTaxRate',
      width: 100,
      render: (text) => typeof text !== 'undefined' ? (`${text * 100}%`) : ''
    }, {
      title: '税额',
      dataIndex: 'billingTaxAmount',
      width: 100,
      render: (text, record) => (
        record.groupNo === '合计' ? <span style={{color: '#ff8928'}}>{toThousands(record.billingTaxAmount)}</span> : text
      )
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
      render: (text) => {
        if(text === '0') {
          return '否'
        } else if (text === '1') {
          return '是'
        } else {
          return ''
        }
      }
    }, {
      title: '优惠政策类型',
      dataIndex: 'prefPolicyType',
      width: 100,
    }]
    return invoiceLineCols
  }

  getTotalAmount = (dataSource) => {
    let amountTotal = 0
    let totalExtraAmount = 0
    let totalTaxAmount = 0
    dataSource.map(item => {
      amountTotal = amountTotal + parseFloat(item.billingAmount)
      totalExtraAmount = totalExtraAmount + parseFloat(item.billingAmountExcludeTax)
      totalTaxAmount = totalTaxAmount + parseFloat(item.billingTaxAmount)
    })
    return {amountTotal, totalExtraAmount, totalTaxAmount}
  }

  remarkValidator = (rule, value, callback) => {
    if(value === '' || typeof value === 'undefined') {
      callback()
      return false
    }
    if(getByteLen(value) <= 220) {
      callback()
      return
    }
    callback('不能超过220个字符，请重新填写')
  }

  render() {
    let appLineItems = this.state.dataSource
    const { getFieldDecorator } = this.props.form
    const { billingType, billingDate, billingApplicantRequest, contractList, outcomeList,
      billingApplicantRemark, fileName, filePath, receiptOutcome, receiptOutcomeTaxVp, isAgainInvoice,
      redOrInvalid, costBearName, costBear, expressReceiptName, expressReceiptPhone,
      expressReceiptCompany, expressReceiptCity,expressReceiptAddress, receiptEmail } = this.props.serviceDetail
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

    const isARAdminShow = isArAdmin && isAgainInvoice === 'false'
    const { custInfo, comInfo } = this.state
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
      getCheckboxProps:(record) => {
        if(record.action === '合计') {
          return { disabled: true }
        } else {
          return ''
        }
      }
    }
    let columns = [
      {
        title: '操作',
        dataIndex: 'action',
        width: 60,
        fixed: 'left',
        render: (text, record, index) => (
          text === '合计' ? <span style={{fontWeight: 'bold', color: '#ff8928'}}>合计</span> :
            <div>
              {
                record.isParent === '1' ?
                  <Button type="primary" ghost onClick={() => this.handleAdd(record.lineNo, record.arBillingId, record.contractItemId)}>+</Button>
                  : null
              }
              {
                record.isParent === '0' ?
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
        render: (text, record) => (
          record.action === '合计' ? "" : text
        )
      }, {
        title: '开票内容',
        dataIndex: 'billingContent',
        width: 250,
        render: (text, record, index) => (
          record.action === '合计' ? '' :
            <SearchAllColumns
              url="/arc/billingApplication/billingContent/search"
              columns={(isArFinanceAccount || isTaxAuditor) ? contentCols : contentOnlyCols}
              label="开票内容"
              width={(isArFinanceAccount || isTaxAuditor) ? '1000px' : ''}
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
          record.action === '合计' ? '' :
            <Input
              placeholder="规格型号"
              value={this.state.dataSource[index]['specificationType']}
              onChange={(e) => this.handleChange(e.target.value, 'specificationType', index)}
            />
        )
      }, {
        title: '单位',
        dataIndex: 'unit',
        width: 80,
        render: (text, record, index) => (
          record.action === '合计' ? '' :
            <Input
              placeholder="单位"
              value={this.state.dataSource[index]['unit']}
              onChange={(e) => this.handleChange(e.target.value, 'unit', index)}
            />
        )
      }, {
        title: '数量',
        dataIndex: 'quantity',
        width: 100,
        render: (text, record, index) => (
          record.action === '合计' ? '' :
            <Input
              placeholder="数量"
              value={this.state.dataSource[index]['quantity']}
              onChange={(e) => this.handleChange(e.target.value, 'quantity', index)} />
        )
      }, {
        title: '单价',
        dataIndex: 'unitPrice',
        width: 100,
        render: (text, record, index) => (
          record.action === '合计' ? '' :
            <InputNumber
              placeholder="单价"
              value={this.state.dataSource[index]['unitPrice']}
              onChange={(value) => this.handleChange(value, 'unitPrice', index)}
            />
        )
      }, {
        title: '不含税金额',
        dataIndex: 'billingAmountExcludeTax',
        width: 100,
        render: (text, record, index) => (
          record.action === '合计' ? <span style={{color: '#ff8927'}}>{text}</span> :
            <InputNumber
              placeholder="不含税金额"
              value={this.state.dataSource[index]['billingAmountExcludeTax']}
              onChange={(value) => this.handleChange(value, 'billingAmountExcludeTax', index, record)}/>
        )
      }, {
        title: '含税金额',
        dataIndex: 'billingAmount',
        width: 100,
        render: (text, record, index) => (
          record.action === '合计' ? <span style={{color: '#ff8927'}}>{text}</span> :
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
          record.action === '合计' ? '' :
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
          //const { billingAmount, billingTaxRate} = this.state.dataSource[index]
          //const unitPrice = billingAmount / (1 + parseFloat(billingTaxRate))
          return (
            record.action === '合计' ? <span style={{color: '#ff8927'}}>{text}</span> :
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
            record.action === '合计' ? '' :
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
            record.action === '合计' ? '' :
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
            record.action === '合计' ? '' :
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
        width: 130,
        render: (text, record, index) => {
          return (
            record.action === '合计' ? '' :
              <Select
                value={this.state.dataSource[index]['prefPolicyType']}
                onChange={(v) => this.handleChange(v, 'prefPolicyType', index)}
                disabled={this.state.dataSource[index]['prefPolicySign'] === '0'}
              >
                <Option value="">-请选择-</Option>
                <Option value="免税">免税</Option>
                <Option value="不征税">不征税</Option>
                <Option value="普通零税率">普通零税率</Option>
                <Option value="超税负3%即征即退">超税负3%即征即退</Option>
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
            record.action === '合计' ? '' :
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
            record.action === '合计' ? '' :
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
            record.action === '合计' ? '' :
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
            record.action === '合计' ? '' :
              <InputNumber
                value={this.state.dataSource[index]['addTaxAmount']}
                onChange={(v) => this.handleChange(v, 'addTaxAmount', index)}
              />
          )
        }
      }]
      columns = columns.concat(taxColumns)
    }

    const { totalExtraAmount, amountTotal, totalTaxAmount } = this.getTotalAmount(appLineItems)
    appLineItems = appLineItems.concat(isProManager ? {
      groupNo: '合计',
      billingAmountExcludeTax: toThousands(parseFloat(totalExtraAmount.toFixed(2))),
      billingAmount: toThousands(parseFloat(amountTotal.toFixed(2))),
      billingTaxAmount: toThousands(parseFloat(totalTaxAmount.toFixed(2))),
    } : {
      action: '合计',
      billingAmountExcludeTax: toThousands(parseFloat(totalExtraAmount.toFixed(2))),
      billingAmount: toThousands(parseFloat(amountTotal.toFixed(2))),
      billingTaxAmount: toThousands(parseFloat(totalTaxAmount.toFixed(2))),
    })
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
          <div>
            <Row gutter={40}>
              {
                showReceive.includes(this.props.applyType) && !isArAdmin ?
                  <Col span={8}>
                    <FormItem {...formItemLayout} label="是否收到发票">
                      {
                        getFieldDecorator(isTaxAuditor ? 'receiptOutcomeTaxVp' : 'receiptOutcome',
                          {initialValue: receiptOutcome, rules: [{ required: true, message: '请选择是否收到发票!' }]})(
                          <Select>
                            <Option value="">-请选择-</Option>
                            <Option value="Y">是</Option>
                            <Option value="N">否</Option>
                            <Option value="B">无需收票</Option>
                          </Select>
                        )
                      }
                    </FormItem>
                  </Col> : null
              }
              {
                showReceive.includes(this.props.applyType) && !isArAdmin ?
                  <Col span={8}>
                    <FormItem {...formItemLayout} label="退票类型">
                      {
                        getFieldDecorator('redOrInvalid', {initialValue: redOrInvalid, rules: [{ required: showReceive.includes(this.props.applyType) && isArFinanceAccount , message: '请选择退票类型!' }]})(
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
                isTaxAuditor && this.props.applyType === 'BILLING_RED' ?
                  <Col span={8}>
                    <FormItem {...formItemLayout1} label="AR财务会计是否收到发票">
                      {receiveInvoice[receiptOutcome]}
                    </FormItem>
                  </Col>
                  : null
              }
            </Row>
            <Row gutter={40}>
              <Col span={19}>
                <FormItem {...span3ItemLayout} label="附件">
                  <a href="javascript:void(0)" onClick={() => this.props.fileDown({objectId: filePath, objectName: fileName})}>{fileName}</a>
                </FormItem>
              </Col>
            </Row>
            <Row gutter={40}>
              <Col span={19}>
                <FormItem {...span3ItemLayout} label="开票原因及要求">
                  {billingApplicantRequest}
                </FormItem>
              </Col>
            </Row>
          </div>
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
                      initialValue: billingType, rules: [{ required: isArFinanceAccount, message: '请选择开票类型!' }]
                    })(
                      <SelectInvokeApi
                        typeCode="BILLING_APPLICATION"
                        paramCode="BILLING_TYPE"
                        placeholder="开票类型"
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
                            <Option value="B">无需收票</Option>
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
                  isTaxAuditor && this.props.applyType === 'BILLING_RED' ?
                    <Col span={8}>
                      <FormItem {...formItemLayout1} label="AR财务会计是否收到发票">
                        {
                          receiveInvoice[receiptOutcome]
                        }
                      </FormItem>
                    </Col> : null
                }
                {
                  showReceive.includes(this.props.applyType) && (isArFinanceAccount || isTaxAuditor) ?
                    <Col span={8}>
                      <FormItem {...formItemLayout1} label="退票类型">
                        {
                          getFieldDecorator('redOrInvalid', {initialValue: redOrInvalid,
                            rules: [{ required: showReceive.includes(this.props.applyType) && isArFinanceAccount, message: '请选择退票类型!' }]})(
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
                columns={(isArAdmin || isArFinanceAccount || this.props.isBigSign) ? this.getCustInfoColumns() : detailColumns}
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
              rowSelection={ isArAdmin || isArFinanceAccount ? rowSelection : null}
              style={{marginBottom: '10px'}}
              rowKey={record => record.lineNo}
              bordered
              size="small"
              columns={isProManager ? this.getProManagerColumns() : columns}
              pagination={false}
              dataSource={appLineItems}
              scroll={{ x: this.isEditTax ? '2030px' : isProManager ? '1500px': '1690px' }}
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
                <FormItem {...span3ItemLayout} label="发票备注">
                  {
                    getFieldDecorator('billingApplicantRemark', {
                      initialValue: billingApplicantRemark,
                      rules: [{validator: this.remarkValidator}]})(
                      <TextArea rows="2" disabled={isProManager}/>
                    )
                  }
                </FormItem>
              </Col>
            </Row>
            <Row gutter={40}>
              <Col span={19}>
                <FormItem {...span3ItemLayout} label="开票原因及要求">
                  {
                    getFieldDecorator('billingApplicantRequest', {initialValue: billingApplicantRequest, rules: [{max: 350, message: '开票原因及要求不能超过350字符!' }]})(
                      <TextArea rows="2" disabled={isProManager}/>
                    )
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
            <h3 className="sent-info">寄件信息</h3>
            <Row gutter={40}>
              <Col span={8} key={1}>
                <FormItem {...formItemLayout2} label="收件人">
                  {getFieldDecorator('expressReceiptName', {
                    initialValue: expressReceiptName,
                    rules:[{ max: 10, message: '收件人不能超过10个汉字!' }]})(
                    <Input  disabled={!(isArAdmin || this.props.isArAdminRole)}/>
                  )}
                </FormItem>
              </Col>
              <Col span={8} key={2}>
                <FormItem {...formItemLayout2} label="收件人公司">
                  {
                    getFieldDecorator('expressReceiptCompany', {
                      initialValue: expressReceiptCompany,
                      rules:[{ max: 16, message: '收件人公司不能超过20个汉字!' }]})(
                      <Input disabled={!(isArAdmin || this.props.isArAdminRole)}/>
                    )
                  }
                </FormItem>
              </Col>
              <Col span={8} key={3}>
                <FormItem {...formItemLayout2} label="收件人电话">
                  {
                    getFieldDecorator('expressReceiptPhone', {
                      initialValue: expressReceiptPhone,
                      rules:[{ max: 16, message: '收件人电话不能超过20个字符!' }]})(
                      <Input disabled={!(isArAdmin || this.props.isArAdminRole)}/>,
                    )
                  }
                </FormItem>
              </Col>
            </Row>
            <Row gutter={40}>
              <Col span={8} key={1}>
                <FormItem {...formItemLayout2} label="收件人城市">
                  {getFieldDecorator('expressReceiptCity', {
                    initialValue: expressReceiptCity,
                    rules:[{ max: 16, message: '收件人城市不能超过20个汉字!' }]})(
                    <Input disabled={!(isArAdmin || this.props.isArAdminRole)}/>
                  )}
                </FormItem>
              </Col>
              <Col span={8} key={2}>
                <FormItem {...formItemLayout2} label="收件人详细地址">
                  {
                    getFieldDecorator('expressReceiptAddress', {
                      initialValue: expressReceiptAddress,
                      rules:[{ max: 32, message: '收件人详细地址不能超过30个汉字!' }]})(
                      <Input disabled={!(isArAdmin || this.props.isArAdminRole)}/>
                    )
                  }
                </FormItem>
              </Col>
            </Row>
            <Row gutter={40}>
              <Col span={14} key={1}>
                <FormItem {...span3ItemLayout} label="E-mail">
                  {getFieldDecorator('receiptEmail', {
                    initialValue: receiptEmail ? receiptEmail.split(',') : [],
                    rules: [{ required: true, message: '请填写E-mail!' }]
                  })(
                    <MultipleInput placeholder="填写多个E-mail请用英文逗号分隔" disabled={!(isArAdmin || this.props.isArAdminRole)}/>
                  )}
                </FormItem>
              </Col>
            </Row>
          </div>
        }
        {
          this.props.showSave && !isARAdminShow ?
            <div className="add-btns">
              <Button
                type="primary"
                style={{marginLeft: '5px'}}
                ghost
                loading={this.state.saveLoading}
                onClick={(e) => this.handleOk(e)}>
                {!this.state.saveLoading ? <Icon type="check" /> : ''}保存修改
              </Button>
            </div> : null
        }
      </div>
    )
  }
}

export default BillApproveDetail
