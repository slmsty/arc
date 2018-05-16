/**
 * Created by liangshuang on 18/5/14.
 */
import React from 'react'
import {Table} from 'antd'
import {billingDataInitColumns} from '../billStatusCols'
import BillingDataInitAddWithFrom from './billingDataInitAddWithFrom'

class BillingDataInitAddCom extends React.Component {
  getWidth = (billingDataInitColumns) => {
    let width = 0
    billingDataInitColumns.map((item,index) => {
      width += parseFloat(item.width)
    })
    return width

  }
  render() {
    return (
      <div>
        <BillingDataInitAddWithFrom />
        <br />
        <Table
          bordered
          columns={billingDataInitColumns}
          size="small"
          scroll={{ x:this.getWidth(billingDataInitColumns) }}
          pagination={false}
        />
      </div>
    )
  }
}
export default BillingDataInitAddCom
