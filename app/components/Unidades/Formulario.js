// @flow
import React, { Component } from "react";
import { Form, Icon, Input, Button, Checkbox, Row, Col } from "antd";
const FormItem = Form.Item;

type Props = {};

class Unidades extends Component<Props> {
  props: Props;

  componentDidMount = () => {
    this.props.form.setFieldsValue({
      descricao: this.props.unidade.descricao,
      abreviacao: this.props.unidade.abreviacao
    })
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        if (Object.keys(this.props.unidade).length == 0) {
          this.props.criar(values)
        } else {
          this.props.edit(values)
        }
        this.props.form.resetFields()
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit} className="login-form">
        <FormItem label="Descrição">
          {getFieldDecorator("descricao", {
            rules: [{ required: true, message: "Por favor insira a descrição da unidade!" }]
          })(
            <Input
              placeholder="Descrição da unidade"
            />
          )}
        </FormItem>
        <FormItem label="Unidade">
          {getFieldDecorator("abreviacao", {
            rules: [{ required: true, message: "Por favor insira a abreviação da unidade!" }]
          })(
            <Input
              placeholder="kg, g, mg, l"
            />
          )}
        </FormItem>
        <Row>
          <Col span={24} style={{ textAlign: 'right' }}>
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
              style={{marginLeft: 5}}
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

const FormUnidade = Form.create()(Unidades);
export default FormUnidade;
