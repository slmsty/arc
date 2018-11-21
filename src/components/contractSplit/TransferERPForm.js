/**
 * Created by liangshuang on 17/12/1.
 */
import React from 'react'
import PropTypes from 'prop-types'
import {Button, Row, Col, Form, Radio, DatePicker, Input, Icon, Select} from 'antd'
import moment from 'moment'
import MultipleInput from '../common/multipleInput'
import SelectRadioApi from  '../common/selectRadioApi'
import SelectSbu from '../common/SelectSbu'
import SelectCustomerWithForm from '../common/selectCustomer'
import SelectOperator from '../common/selectOperator'

const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const dateFormat = 'YYYY-MM-DD';
const {RangePicker} = DatePicker;
const Option = Select.Option;
class TransferERPForm extends React.Component {
  state = {
    infoVisitable: false,
    loading: false,
    excelDis: false,
    applyData: '',
    stateType: '',
  };

  // 查询接口
  queryParms = () => {
    const params = this.props.form.getFieldsValue();
    params.signDateStart = params.signDate && params.signDate.length ? params.signDate[0].format(dateFormat) : '';
    params.signDateEnd = params.signDate && params.signDate.length ? params.signDate[1].format(dateFormat) : '';
    params.buId = params.buId ? params.buId[0] : '';
    params.isReport = 'N';
    params.projectNo = params.projectNo ? params.projectNo.trim() : '';
    params.contractNo = params.contractNo ? params.contractNo.trim() : '';
    params.contractName = params.contractName ? params.contractName.trim() : '';
    params.signCompany = params.signCompany ? params.signCompany.trim() : '';
    params.splitBy = params.splitBy && params.splitBy[0] ? params.splitBy[0] : '';
    delete params.signDate;
    this.props.queryParms(params)
  };
  //导出
  exportParams = () => {
    const params = this.props.form.getFieldsValue();
    params.signDateStart = params.signDate && params.signDate.length ? params.signDate[0].format(dateFormat) : '';
    params.signDateEnd = params.signDate && params.signDate.length ? params.signDate[1].format(dateFormat) : '';
    params.buId = params.buId ? params.buId[0] : '';
    params.isReport = 'N';
    params.projectNo = params.projectNo ? params.projectNo.trim() : '';
    params.contractNo = params.contractNo ? params.contractNo.trim() : '';
    params.contractName = params.contractName ? params.contractName.trim() : '';
    params.signCompany = params.signCompany ? params.signCompany.trim() : '';
    delete params.signDate;
    this.props.exportParams(params)
  };
  handleRadioChange = (e) => {
    this.setState({
      stateType: e.target.value,
    });
    this.props.showCols(e.target.value)
  };

  render() {
    const {getFieldDecorator} = this.props.form;
    const formItemLayoutChild = {
      labelCol: {span: 7},
      wrapperCol: {span: 17},
    };
    return (
      <div>
        <Form
          className="ant-search-form"
        >
          <div>
            <Row gutter={40}>
              <Col span={8}>
                <FormItem {...formItemLayoutChild} label="项目编码">
                  {
                    getFieldDecorator('projectNo')(
                      <Input
                        placeholder="请输入项目编码"
                      />,
                    )
                  }
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem {...formItemLayoutChild} label="合同编码">
                  {
                    getFieldDecorator('contractNo')(
                      <Input
                        placeholder="请输入合同编码"
                      />,
                    )
                  }
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem {...formItemLayoutChild} label="合同名称">
                  {getFieldDecorator('contractName')(
                    <Input
                      placeholder="请输入合同名称"
                    />,
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={40}>
              <Col span={8}>
                <FormItem {...formItemLayoutChild} label="签约日期">
                  {getFieldDecorator('signDate', {
                    //initialValue: [moment('2017-08-01'), moment()],
                  })(<RangePicker
                    allowClear
                    format={dateFormat}
                    ranges={{今天: [moment(), moment()], 当月: [moment().startOf('month'), moment().endOf('month')]}}
                  />)}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem {...formItemLayoutChild} label="立项BU">
                  {
                    getFieldDecorator('buId')(<SelectSbu keyName="contract"/>)
                  }
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem {...formItemLayoutChild} label="是否采集项目">
                  {
                    getFieldDecorator('collectionProject', {
                      initialValue: 'ALL'
                    })(
                      <Select>
                        <Option value="ALL">全部</Option>
                        <Option value="Y">是</Option>
                        <Option value="N">否</Option>
                      </Select>
                    )
                  }
                </FormItem>
              </Col>
            </Row>
            <Row gutter={40}>
              <Col span={8}>
                <FormItem {...formItemLayoutChild} label="传ERP状态">
                  {
                    getFieldDecorator('erpStatus', {
                      initialValue: 'ALL'
                    })(
                      <Select>
                        <Option value="ALL">全部</Option>
                        <Option value="UNCOMPLETE">未传送</Option>
                        <Option value="PROCESSING">PA处理中</Option>
                        <Option value="PROCESSED">已传送PA</Option>
                        <Option value="ERROR">传送PA失败</Option>
                      </Select>
                    )
                  }
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem {...formItemLayoutChild} label="签约公司">
                  {getFieldDecorator('signCompany')(
                    <Input
                      placeholder="请输入签约公司"
                    />,
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem {...formItemLayoutChild} label="拆分操作人">
                  {
                    getFieldDecorator('splitBy')(
                      <SelectOperator
                        placeholder="请输入拆分操作人"
                      />,
                    )
                  }
                </FormItem>
              </Col>
            </Row>
            <Row gutter={40}>
              <Col span={8} style={{textAlign: 'right'}}>
                <Button type="primary" key="search" onClick={this.queryParms}><Icon type="search"/>查询</Button>
                <Button style={{marginLeft: '10px'}} type="primary" key="export" loading={this.state.excelDis}
                        onClick={this.exportParams}>导出Excel</Button>
              </Col>
            </Row>
          </div>
        </Form>
      </div>
    )
  }
}
const ERPWithFromWithForm = Form.create()(TransferERPForm);

export default ERPWithFromWithForm
