/**
 * Created by liangshuang on 17/12/1.
 */
import React from 'react'
import PropTypes from 'prop-types'
import currency from '../../util/currency'
import { reciptMoneyInfoCols, billInfocomCols, billAndReciptMoneyCols, shouldReciptCols, projectTotalCols, totalContractContentColumns, turnProColumns } from './statementColumns'
import { Table, Row, Col, Form, Radio, DatePicker, Input, Icon } from 'antd'

import StatementWithFrom from './statementWithFrom'
export default class StatementListIndex extends React.Component {
  state = {
    infoVisitable: false,
    loading: false,
    applyData: '',
    currencyType: '100',
  }
  componentDidMount(){
  }
  // 查询接口
  queryParms = (param) => {
    this.props.getStatementList(param)

  }
  // 获取展示列
  getApplyColumns = () =>{
    let width = 0
    const type = this.state.currencyType
    if(type==='100'){
      //  获取宽度width
      reciptMoneyInfoCols.map((item,idnex)=>{
        width += parseFloat(item.width)
      })
      return [width,reciptMoneyInfoCols,'收款汇总金额']
    } else if(type==='1001'){
      billInfocomCols.map((item,idnex)=>{
        width += parseFloat(item.width)
      })
      return [width,billInfocomCols,'发票汇总金额']
    } else if(type==='1002'){
      billAndReciptMoneyCols.map((item,idnex)=>{
        width += parseFloat(item.width)
      })
      return [width,billAndReciptMoneyCols,'收款汇总金额','发票汇总金额']
    } else if(type==='1003'){
      shouldReciptCols.map((item,idnex)=>{
        width += parseFloat(item.width)
      })
      return [width,shouldReciptCols]
    } else if(type==='1004'){
      projectTotalCols.map((item,idnex)=>{
        width += parseFloat(item.width)
      })
      return [width,projectTotalCols,'收款汇总金额','发票汇总金额']
    } else if(type==='1005'){
      totalContractContentColumns.map((item,idnex)=>{
        width += parseFloat(item.width)
      })
      return [width,totalContractContentColumns]
    } else if(type==='1006'){
      turnProColumns.map((item,idnex)=>{
        width += parseFloat(item.width)
      })
      return [width,turnProColumns]
    } else {
      reciptMoneyInfoCols.map((item,idnex)=>{
        width += parseFloat(item.width)
      })
      return [width,reciptMoneyInfoCols,'收款汇总金额']
    }
  }
  // 展示查询列表回调方法
  showCols = (type) => {
    this.setState({
      currencyType: type,
    })
  }
  render() {
    return (
      <div>
        <StatementWithFrom showCols={this.showCols} />
        <Row  style={{ lineHeight: '28px' }}>
          <Col span={24} style={{ textAlign: 'right', verticalAlign: 'middle', fontWeight: 'bold' }}>
            {
              this.getApplyColumns()[2] ?
                <div>
                  <span>{this.getApplyColumns()[2]}：</span><span className="primary-color" style={{ color: '#F4A034' }}></span>
                  {this.getApplyColumns()[3] ?
                    <span><span>{this.getApplyColumns()[3]}：</span> < span className = "primary-color" style={{ color: '#F4A034' }}></span></span>
                    :''
                  }
                </div>
                : ''
            }

          </Col>
        </Row>
        <Table
          columns={this.getApplyColumns()[1]}
          bordered
          size="middle"
          scroll={{ x: this.getApplyColumns()[0] }}
        />
      </div>
    )
  }
}
