/**
 * Created by liangshuang on 18/3/23.
 */
/**
 * Created by liangshuang on 17/11/10.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { Table, Button, message, Modal, Form, Row, Col, DatePicker } from 'antd'
class UrlModalCom extends React.Component {
  render() {
    return (
      <Modal
        width={600}
        visible={true}
        onOk={this.props.closeModal}
        onCancel={this.props.closeModal}
        title=""
        footer={false}
      >
        <h3>{`该合同有${this.props.contractUrl.length}条审批记录:`}</h3>
        <ul style={{minHeight:'150px',marginTop:'20px'}}>
          {this.props.contractUrl.map(item=>{
            return(
              <li><a href={item.url}>{item.contractName}</a></li>
            )
          })}
        </ul>
      </Modal>
    )
  }
}

export default UrlModalCom
