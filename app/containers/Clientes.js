// @flow
import React, { Component } from "react";
import {
  Layout,
  Breadcrumb,
  Button,
  Menu,
  Icon,
  Table,
  Input,
  Popconfirm,
  notification,
  Modal,
  Divider
} from "antd";
import axios from "axios";
import { url } from "../constants";
import FormClientes from "../components/Clientes/Formulario";
import moment from "moment";

const { Content } = Layout;

type Props = {};

export default class Clientes extends Component<Props> {
  props: Props;

  state = {
    clientes: {
      data: []
    },
    visible: false,
    selecionado: {},
    loading: false,
    tipo: "Adicionar"
  };

  componentWillMount = () => {
    this.fetchClientes();
  };

  handleCancel = () => {
    this.setState({
      visible: false
    });
  };

  create = cliente => {
    const jwt = localStorage.getItem("jwt");
    const config = {
      headers: { Authorization: "Bearer " + jwt }
    };
    axios
      .post(
        `${url}/clientes`,
        {
          descricao: cliente.descricao,
          telefone: cliente.telefone,
          logradouro: cliente.logradouro,
          observacao: cliente.observacao,
          ativo: cliente.ativo ? 1 : 0,
          bairro: cliente.bairro,
          numero: cliente.numero,
          cidade: cliente.cidade,
          estado: cliente.estado,
          cep: cliente.cep,
          documento: cliente.documento,
          referencia: cliente.referencia,
          aniversario: cliente.aniversario.format("DD/MM/YYYY"),
          email: cliente.email,
          celular: cliente.celular,
          complemento: cliente.complemento,
          edificio: cliente.edificio,
          deleted: 0
        },
        config
      )
      .then(res => {
        notification.open({
          message: "Sucesso!",
          description: `O cliente ${cliente.descricao} foi adicionado`,
          icon: <Icon type="check" style={{ color: "green" }} />
        });
        this.handleCancel();
        this.fetchClientes();
        return;
      })
      .catch(err => {
        notification.open({
          message: "Erro!",
          description: "Erro ao cadastrar o cliente desejado",
          icon: <Icon type="close" style={{ color: "red" }} />
        });
        console.log(err);
      });
  };

  update = cliente => {
    const jwt = localStorage.getItem("jwt");
    const config = {
      headers: { Authorization: "Bearer " + jwt }
    };

    let obj = {
      descricao: cliente.descricao,
      telefone: cliente.telefone,
      logradouro: cliente.logradouro,
      observacao: cliente.observacao,
      ativo: cliente.ativo ? 1 : 0,
      bairro: cliente.bairro,
      numero: cliente.numero,
      cidade: cliente.cidade,
      estado: cliente.estado,
      cep: cliente.cep,
      documento: cliente.documento,
      referencia: cliente.referencia,
      aniversario: cliente.aniversario.format("DD/MM/YYYY"),
      email: cliente.email,
      celular: cliente.celular,
      complemento: cliente.complemento,
      edificio: cliente.edificio,
      deleted: 0
    };

    axios
      .put(`${url}/clientes/${this.state.selecionado.id}`, obj, config)
      .then(res => {
        notification.open({
          message: "Sucesso!",
          description: `O cliente ${cliente.descricao} foi editado`,
          icon: <Icon type="check" style={{ color: "green" }} />
        });
        this.setState({ visible: false, selecionado: {} });
        this.fetchClientes();
        return;
      })
      .catch(err => {
        notification.open({
          message: "Erro!",
          description: "Erro ao editar o cliente desejado",
          icon: <Icon type="close" style={{ color: "red" }} />
        });
        console.log(err);
      });
  };

  fetchClientes = () => {
    const jwt = localStorage.getItem("jwt");
    const config = {
      headers: { Authorization: "Bearer " + jwt }
    };

    this.setState({ loading: true });

    axios
      .get(`${url}/clientes?deleted=0`, config)
      .then(res =>
        this.setState({ clientes: { data: res.data }, loading: false })
      )
      .catch(err => {
        message.error("Erro ao buscar os dados do centro de produção");
        this.setState({ loading: false });
      });
  };

  editModal = clientes => {
    this.setState({ selecionado: clientes, visible: true, tipo: "Editar" });
  };

  addModal = () => {
    this.setState({ selecionado: {}, visible: true, tipo: "Adicionar" });
  };

  deletar = cliente => {
    const jwt = localStorage.getItem("jwt");
    const config = {
      headers: { Authorization: "Bearer " + jwt }
    };

    axios
      .put(`${url}/clientes/${cliente.id}`, { deleted: 1 }, config)
      .then(res => {
        notification.open({
          message: "Exclusão efetuada com sucesso!",
          description: `O usuário ${cliente.descricao} foi removido`,
          icon: <Icon type="check" style={{ color: "green" }} />
        });
        this.fetchClientes();
        return;
      })
      .catch(err => {
        notification.open({
          message: "Erro!",
          description: "Erro ao deletar o cliente desejado",
          icon: <Icon type="close" style={{ color: "red" }} />
        });
        console.log(err);
      });
  };

  render() {
    const { loading, clientes, visible, tipo, selecionado } = this.state;
    const columns = [
      {
        title: "Nome",
        dataIndex: "descricao",
        width: 250,
        key: "descricao"
      },
      {
        title: "Telefone",
        dataIndex: "telefone",
        width: 250,
        key: "telefone"
      },
      {
        title: "Celular",
        dataIndex: "celular",
        width: 250,
        key: "celular"
      },
      {
        title: "CNPJ / CPF",
        dataIndex: "documento",
        width: 250,
        key: "documento"
      },
      {
        title: "Email",
        dataIndex: "email",
        width: 250,
        key: "email"
      },
      {
        title: "Cep",
        dataIndex: "cep",
        width: 250,
        key: "cep"
      },
      {
        title: "Cidade",
        dataIndex: "cidade",
        width: 250,
        key: "cidade"
      },
      {
        title: "Ativo",
        dataIndex: "ativo",
        width: 150,
        key: "ativo",
        render: (text, record) => {
          return <span>{text === 1 ? "Sim" : "Não"}</span>;
        }
      },
      {
        title: "Ações",
        fixed: "right",
        width: 130,
        key: "id",
        dataIndex: "operation",
        render: (text, record) => {
          return (
            <div className="editable-row-operations">
              <span>
                <Popconfirm
                  title="Você tem certeza?"
                  onConfirm={() => this.deletar(record)}
                >
                  <a>Excluir</a>
                </Popconfirm>
                <Divider type="vertical" />
                <a onClick={() => this.editModal(record)}>Editar</a>
              </span>
            </div>
          );
        }
      }
    ];

    return (
      <Content style={{ margin: "0 16px" }}>
        <Breadcrumb style={{ margin: "16px 0" }}>
          <Breadcrumb.Item>Principal</Breadcrumb.Item>
          <Breadcrumb.Item>Usuários</Breadcrumb.Item>
        </Breadcrumb>

        <div style={{ background: "#fff", padding: "1em" }}>
          <div className="table-operations">
            <Button onClick={this.fetchClientes}>Recarregar</Button>
            <Button onClick={this.addModal}>Adicionar</Button>
          </div>
          <Table
            columns={columns}
            loading={loading}
            dataSource={clientes.data}
            rowKey="id"
            scroll={{ x: "160%" }}
          />
        </div>

        <Modal
          visible={visible}
          title={`${tipo} usuário`}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          width={600}
          footer={null}
        >
          {visible && (
            <FormClientes
              cliente={selecionado}
              close={this.handleCancel}
              criar={this.create}
              edit={this.update}
              atualizar={this.fetchClientes}
            />
          )}
        </Modal>
      </Content>
    );
  }
}
