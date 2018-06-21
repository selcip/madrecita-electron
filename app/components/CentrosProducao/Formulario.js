// @flow
import React, { Component } from "react";
import {
  Form,
  Icon,
  Input,
  Button,
  Checkbox,
  Row,
  Col,
  DatePicker,
  message
} from "antd";
import moment from "moment";
import axios from "axios";
const FormItem = Form.Item;
const { TextArea } = Input;

type Props = {};

class CentrosProducao extends Component<Props> {
  props: Props;

  componentDidMount = () => {
    this.props.form.setFieldsValue({
      descricao: this.props.centrosProducao.descricao,
      produtivo: this.props.centrosProducao.produtivo ? 1 : 0
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        if (Object.keys(this.props.centrosProducao).length === 0) {
          this.props.criar(values);
          console.log(values);
        } else {
          this.props.edit(values);
        }
        this.props.form.resetFields();
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;

    return (
      <Form onSubmit={this.handleSubmit} className="login-form">
        <FormItem>
          {getFieldDecorator("produtivo")(<Checkbox>Produtivo</Checkbox>)}
        </FormItem>
        <FormItem label="Nome">
          {getFieldDecorator("descricao", {
            rules: [
              {
                required: true,
                message: "Por favor insira o nome do centro de produção!"
              }
            ]
          })(<Input placeholder="Nome" />)}
        </FormItem>
        <Row>
          <Col span={24} style={{ textAlign: "right" }}>
            <Button
              type="secondary"
              htmlType="button"
              className="login-form-button"
              onClick={this.props.close}
            >
              Cancelar
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              style={{ marginLeft: 5 }}
              className="login-form-button"
            >
              Concluir
            </Button>
          </Col>
        </Row>
      </Form>
    );
  }
}

const FormCentrosProducao = Form.create()(CentrosProducao);
export default FormCentrosProducao;
