/**
 * Created by liangshuang on 17/12/6.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Row, Col, Button, Input, Divider } from 'antd'

const { TextArea } = Input
export default class ApplyInfoModal extends React.Component {
  applyComfirm = () => {
    this.props.applyComfirm('')
    // message.success('审批成功')
  }
  applyReject = () => {
    this.props.applyReject('')
    // message.success('驳回成功')
  }
  render() {
    return (
      <div>
        <Modal
          width={1024}
          title="审批详情"
          visible={this.props.infoVisitable}
          onCancel={this.props.closeClaim}
          footer={[
            <Button key="submit" type="primary" onClick={this.applyComfirm}>
              同意
            </Button>,
            <Button type="primary" key="reset" onClick={this.applyReject}>
              驳回
            </Button>,
          ]}
        >
          <h2>申请人信息</h2>
          <br />
          <Row>
            <Col style={{ textAlign: 'right' }} span={3} key={1}>申请人：</Col>
            <Col span={5} key={2}>张欣</Col>
            <Col style={{ textAlign: 'right' }} span={3} key={3}>申请人部门：</Col>
            <Col span={5} key={4}>CFO Accounting</Col>
          </Row>
          <Row>
            <Col style={{ textAlign: 'right' }} span={3} key={5}>联系电话：</Col>
            <Col span={5} key={6}>18310586898</Col>
            <Col style={{ textAlign: 'right' }} span={3} key={7}>邮箱地址：</Col>
            <Col span={5} key={8}>zhangxin19@asiainfo.com</Col>
          </Row>
          <br />
          <hr style={{ borderTop: '1px solid #d9d9d9' }} />
          <br />
          <h2>坏账划销申请</h2>
          <br />
          <br />
          <hr style={{ borderTop: '1px solid #d9d9d9' }} />
          <br />
          <h2>审批意见</h2>
          <br />
          <Row>
            <Col style={{ textAlign: 'left' }} span={4}>一级审批（上级经理）：</Col>
            <Col span={5}>姚世棋</Col>
            <Col style={{ textAlign: 'right' }} span={3}>审批结果：</Col>
            <Col span={4}>同意</Col>
            <Col style={{ textAlign: 'right' }} span={3}>审批时间：</Col>
            <Col span={5}>2017-07-26 14:20:45</Col>
          </Row>
          <Row>
            <Col style={{ textAlign: 'left' }} span={4}>审批意见：</Col>
            <Row>
              <Col style={{ textAlign: 'left' }} span={24}>
                &nbsp;&nbsp;同意
              </Col>
            </Row>
          </Row>
          <br />
          <h3 style={{ color: '#F4A034' }}>审批意见</h3>
          <Row>
            <Col style={{ textAlign: 'left' }} span={24}>
              <TextArea rows={5} placeholder="请输入审批意见"></TextArea>
            </Col>
          </Row>
        </Modal>
      </div>
    )
  }
}
