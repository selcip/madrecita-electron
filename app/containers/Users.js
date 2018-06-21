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
import FormUser from "../components/Usuarios/Formulario";

const { Content } = Layout;

type Props = {};

export default class Unidades extends Component<Props> {
  props: Props;

  state = {
    users: {
      data: []
    },
    visible: false,
    selecionado: {},
    loading: false,
    tipo: "Adicionar"
  };

  componentWillMount = () => {
    this.fetchUsers();
  };

  handleCancel = () => {
    this.setState({
      visible: false
    });
  };

  create = user => {
    const jwt = localStorage.getItem("jwt");
    const config = {
      headers: { Authorization: "Bearer " + jwt }
    };

    axios
      .post(
        `${url}/usuarios`,
        {
          usuario: user.usuario,
          nome: user.nome,
          senha: user.senha
        },
        config
      )
      .then(res => {
        notification.open({
          message: "Sucesso!",
          description: `O usuário ${user.nome} foi adicionado`,
          icon: <Icon type="check" style={{ color: "green" }} />
        });
        this.handleCancel();
        this.fetchUsers();
        return;
      })
      .catch(err => {
        notification.open({
          message: "Erro!",
          description: "Erro ao cadastrar o usuário desejado",
          icon: <Icon type="close" style={{ color: "red" }} />
        });
        console.log(err);
      });
  };

  update = user => {
    const jwt = localStorage.getItem("jwt");
    const config = {
      headers: { Authorization: "Bearer " + jwt }
    };

    let obj = {
      nome: user.nome,
      usuario: user.usuario
    };

    if (user.senha != "") {
      obj["senha"] = user.senha;
    }

    axios
      .put(`${url}/usuarios/${this.state.selecionado.id}`, obj, config)
      .then(res => {
        notification.open({
          message: "Sucesso!",
          description: `O usuário ${user.nome} foi editado`,
          icon: <Icon type="check" style={{ color: "green" }} />
        });
        this.setState({ visible: false, selecionado: {} });
        this.fetchUsers();
        return;
      })
      .catch(err => {
        notification.open({
          message: "Erro!",
          description: "Erro ao cadastrar o usuário desejado",
          icon: <Icon type="close" style={{ color: "red" }} />
        });
        console.log(err);
      });
  };

  fetchUsers = () => {
    const jwt = localStorage.getItem("jwt");
    const config = {
      headers: { Authorization: "Bearer " + jwt }
    };

    this.setState({ loading: true });

    axios
      .get(`${url}/usuarios?deleted=0`, config)
      .then(res => this.setState({ users: { data: res.data }, loading: false }))
      .catch(err => {
        notification.open({
          message: "Erro!",
          description: "Erro ao cadastrar o usuário desejado",
          icon: <Icon type="close" style={{ color: "red" }} />
        });
        this.setState({ loading: false });
        console.log(err);
      });
  };

  editModal = user => {
    this.setState({ selecionado: user, visible: true, tipo: "Editar" });
  };

  addModal = () => {
    this.setState({ selecionado: {}, visible: true, tipo: "Adicionar" });
  };

  deletar = user => {
    const jwt = localStorage.getItem("jwt");
    const config = {
      headers: { Authorization: "Bearer " + jwt }
    };

    axios
      .put(`${url}/usuarios/${user.id}`, {
        deleted: 1
      }, config)
      .then(res => {
        notification.open({
          message: "Exclusão efetuada com sucesso!",
          description: `O usuário ${user.nome} foi removido`,
          icon: <Icon type="check" style={{ color: "green" }} />
        });
        this.fetchUsers();
        return;
      })
      .catch(err => {
        notification.open({
          message: "Erro!",
          description: "Erro ao cadastrar o usuário desejado",
          icon: <Icon type="close" style={{ color: "red" }} />
        });
        console.log(err);
      });
  };

  render() {
    const { loading, users, visible, tipo, selecionado } = this.state;
    const columns = [
      {
        title: "Nome de usuário",
        dataIndex: "usuario",
        key: "usuario"
      },
      {
        title: "Nome",
        dataIndex: "nome",
        key: "nome"
      },
      {
        title: "",
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
            <Button onClick={this.fetchUsers}>Recarregar</Button>
            <Button onClick={this.addModal}>Adicionar</Button>
          </div>
          <Table
            columns={columns}
            loading={loading}
            dataSource={users.data}
            rowKey="id"
          />
        </div>

        <Modal
          visible={visible}
          title={`${tipo} usuário`}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          width={350}
          footer={null}
        >
          {visible && (
            <FormUser
              user={selecionado}
              close={this.handleCancel}
              criar={this.create}
              edit={this.update}
              atualizar={this.fetchUsers}
            />
          )}
        </Modal>
      </Content>
    );
  }
}
