// @flow
import React, { Component } from "react";
import { Form, Icon, Input, Button, Checkbox, Row, Col } from "antd";
const FormItem = Form.Item;

type Props = {};

class User extends Component<Props> {
  props: Props;

  componentDidMount = () => {
    this.props.form.setFieldsValue({
      usuario: this.props.user.usuario,
      nome: this.props.user.nome
    })
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        if (Object.keys(this.props.user).length == 0) {
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
    let precisa = Object.keys(this.props.user).length == 0
    return (
      <Form onSubmit={this.handleSubmit} className="login-form">
        <FormItem>
          {getFieldDecorator("usuario", {
            rules: [{ required: true, message: "Por favor insira o nome de usuário!" }]
          })(
            <Input
              placeholder="Nome de usuário"
            />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator("nome", {
            rules: [{ required: true, message: "Por favor insira o nome completo do usuário!" }]
          })(
            <Input
              placeholder="Nome"
            />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator("senha", {
            rules: [{ required: precisa, message: "Por favor insira a senha!" }]
          })(
            <Input
              placeholder="Senha"
              type="password"
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

const FormUser = Form.create()(User);
export default FormUser;
