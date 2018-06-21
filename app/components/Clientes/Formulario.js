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

class Clientes extends Component<Props> {
  props: Props;

  componentDidMount = () => {
    this.props.form.setFieldsValue({
      descricao: this.props.cliente.descricao,
      telefone: this.props.cliente.telefone,
      logradouro: this.props.cliente.logradouro,
      bairro: this.props.cliente.bairro,
      numero: this.props.cliente.numero,
      observacao: this.props.cliente.observacao,
      ativo: this.props.cliente.ativo === 1 ? true : false,
      cidade: this.props.cliente.cidade,
      estado: this.props.cliente.estado,
      cep: this.props.cliente.cep,
      documento: this.props.cliente.documento,
      referencia: this.props.cliente.referencia,
      aniversario: moment(this.props.cliente.aniversario, "DD/MM/YYYY"),
      email: this.props.cliente.email,
      celular: this.props.cliente.celular,
      complemento: this.props.cliente.complemento,
      edificio: this.props.cliente.edificio,
      deleted: 0
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        if (Object.keys(this.props.cliente).length === 0) {
          this.props.criar(values);
        } else {
          this.props.edit(values);
        }
        this.props.form.resetFields();
      }
    });
  };

  getAddress = e => {
    if (e.target.value.toString().length > 7) {
      const url = `http://viacep.com.br/ws/${e.target.value}/json/`;

      axios
        .get(url)
        .then(res => {
          this.props.form.setFieldsValue({
            logradouro: res.data.logradouro,
            bairro: res.data.bairro,
            cidade: res.data.localidade,
            estado: res.data.uf,
            complemento: res.data.complemento
          });
        })
        .catch(err => {
          message.error(`Cep não encontrado`);
          console.log(err);
        });
    }
  };

  phoneMask = e => {
    let x = e.target.value
      .replace(/\D/g, "")
      .match(/(\d{0,2})(\d{0,4})(\d{0,4})/);
    e.target.value = !x[2]
      ? x[1]
      : "(" + x[1] + ") " + x[2] + (x[3] ? "-" + x[3] : "");
  };

  cellMask = e => {
    let x = e.target.value
      .replace(/\D/g, "")
      .match(/(\d{0,2})(\d{0,5})(\d{0,4})/);
    e.target.value = !x[2]
      ? x[1]
      : "(" + x[1] + ") " + x[2] + (x[3] ? "-" + x[3] : "");
  };

  render() {
    const { getFieldDecorator } = this.props.form;

    return (
      <Form onSubmit={this.handleSubmit} className="login-form">
        <FormItem>
          {getFieldDecorator("ativo")(<Checkbox>Ativo</Checkbox>)}
        </FormItem>
        <FormItem label="Nome">
          {getFieldDecorator("descricao", {
            rules: [
              { required: true, message: "Por favor insira o nome do cliente!" }
            ]
          })(<Input placeholder="Nome" />)}
        </FormItem>
        <Row gutter={16}>
          <Col span={8}>
            <FormItem label="Telefone">
              {getFieldDecorator("telefone", {
                rules: [
                  { required: true, message: "Por favor insira o telefone!" }
                ]
              })(<Input placeholder="Telefone" onChange={this.phoneMask} />)}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="Celular">
              {getFieldDecorator("celular", {
                rules: [
                  { required: true, message: "Por favor insira o celular!" }
                ]
              })(<Input placeholder="Celular" onChange={this.cellMask} />)}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="CNPJ / CPF">
              {getFieldDecorator("documento", {
                rules: [
                  { required: true, message: "Por favor insira o cnpj ou cpf!" }
                ]
              })(<Input placeholder="CNPJ / CPF" type="number" />)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <FormItem label="Email">
              {getFieldDecorator("email", {
                rules: [
                  { required: true, message: "Por favor insira o email!" }
                ]
              })(<Input placeholder="Email" type="email" />)}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="Aniversário">
              {getFieldDecorator("aniversario", {
                rules: [
                  {
                    required: true,
                    message: "Entre com a aniversario"
                  }
                ]
              })(
                <DatePicker
                  placeholder="Aniversário"
                  format="DD/MM/YYYY"
                  style={{ width: "100%" }}
                />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={8}>
            <FormItem label="Cep">
              {getFieldDecorator("cep", {
                rules: [{ required: true, message: "Por favor insira o cep!" }]
              })(
                <Input
                  placeholder="Cep"
                  type="number"
                  onChange={this.getAddress}
                />
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem label="Cidade">
              {getFieldDecorator("cidade", {
                rules: [
                  { required: true, message: "Por favor insira a cidade!" }
                ]
              })(<Input placeholder="Cidade" />)}
            </FormItem>
          </Col>
          <Col span={4}>
            <FormItem label="Estado">
              {getFieldDecorator("estado", {
                rules: [
                  { required: true, message: "Por favor insira o estado!" }
                ]
              })(<Input placeholder="Estado" />)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <FormItem label="Logradouro">
              {getFieldDecorator("logradouro", {
                rules: [
                  { required: true, message: "Por favor insira o logradouro!" }
                ]
              })(<Input placeholder="Logradouro" />)}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="Bairro">
              {getFieldDecorator("bairro", {
                rules: [
                  { required: true, message: "Por favor insira o bairro!" }
                ]
              })(<Input placeholder="Bairro" />)}
            </FormItem>
          </Col>
          <Col span={4}>
            <FormItem label="Número">
              {getFieldDecorator("numero", {
                rules: [
                  { required: true, message: "Por favor insira o número!" }
                ]
              })(<Input placeholder="Número" type="number" />)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <FormItem label="Referência">
              {getFieldDecorator("referencia", {
                rules: [
                  { required: true, message: "Por favor insira a referência!" }
                ]
              })(<Input placeholder="Referência" />)}
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem label="Complemento">
              {getFieldDecorator("complemento")(
                <Input placeholder="Complemento" />
              )}
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem label="Edifício">
              {getFieldDecorator("edificio")(<Input placeholder="Edifício" />)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <FormItem label="Observação">
              {getFieldDecorator("observacao")(
                <TextArea
                  placeholder="Observação"
                  autosize={{ minRows: 3, maxRows: 6 }}
                />
              )}
            </FormItem>
          </Col>
        </Row>
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

const FormClientes = Form.create()(Clientes);
export default FormClientes;
