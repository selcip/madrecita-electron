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
import socketIOClient from "socket.io-client";
import { url } from "../constants";
import FormUnidade from "../components/Unidades/Formulario";

const { Content } = Layout;
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

type Props = {};

export default class Unidades extends Component<Props> {
  props: Props;

  state = {
    unidades: {
      data: []
    },
    pagination: {
      current: 1,
      total: 1,
      pageSize: 10
    },
    visible: false,
    selecionado: {},
    loading: false,
    tipo: "Adicionar"
  };

  componentWillMount = () => {
    this.fetchUnidades();
  };

  handleCancel = () => {
    this.setState({
      visible: false
    });
  };

  create = unidade => {
    const jwt = localStorage.getItem("jwt");
    const config = {
      headers: { Authorization: "Bearer " + jwt }
    };

    axios
      .post(
        `${url}/unidades`,
        {
          descricao: unidade.descricao,
          abreviacao: unidade.abreviacao
        },
        config
      )
      .then(res => {
        notification.open({
          message: "Sucesso!",
          description: `A unidade ${unidade.descricao}(${
            unidade.abreviacao
          }) foi adicionada`,
          icon: <Icon type="check" style={{ color: "green" }} />
        });
        this.handleCancel();
        this.fetchUnidades();
        return;
      })
      .catch(err => {
        notification.open({
          message: "Erro!",
          description: "Erro ao cadastrar a unidade desejado",
          icon: <Icon type="close" style={{ color: "red" }} />
        });
        console.log(err);
      });
  };

  update = unidade => {
    const jwt = localStorage.getItem("jwt");
    const config = {
      headers: { Authorization: "Bearer " + jwt }
    };

    let obj = {
      descricao: unidade.descricao,
      abreviacao: unidade.abreviacao
    };

    axios
      .put(`${url}/unidades/${this.state.selecionado.id}`, obj, config)
      .then(res => {
        notification.open({
          message: "Sucesso!",
          description: `A unidade ${unidade.descricao}(${
            unidade.abreviacao
          }) foi alterada`,
          icon: <Icon type="check" style={{ color: "green" }} />
        });
        this.setState({ visible: false, selecionado: {} });
        this.fetchUnidades();
        return;
      })
      .catch(err => {
        notification.open({
          message: "Erro!",
          description: "Erro ao cadastrar a unidade desejado",
          icon: <Icon type="close" style={{ color: "red" }} />
        });
        console.log(err);
      });
  };

  fetchUnidades = () => {
    const jwt = localStorage.getItem("jwt");
    const config = {
      headers: { Authorization: "Bearer " + jwt }
    };

    this.setState({ loading: true });

    axios
      .get(`${url}/unidades?deleted=0`, config)
      .then(res =>
        this.setState({ unidades: { data: res.data }, loading: false })
      )
      .catch(err => {
        notification.open({
          message: "Erro!",
          description: "Erro ao cadastrar a unidade desejado",
          icon: <Icon type="close" style={{ color: "red" }} />
        });
        this.setState({ loading: false });
        console.log(err);
      });
  };

  editModal = unidade => {
    this.setState({ selecionado: unidade, visible: true, tipo: "Editar" });
  };

  addModal = () => {
    this.setState({ selecionado: {}, visible: true, tipo: "Adicionar" });
  };

  deletar = unidade => {
    const jwt = localStorage.getItem("jwt");
    const config = {
      headers: { Authorization: "Bearer " + jwt }
    };

    axios
      .put(
        `${url}/unidades/${unidade.id}`,
        {
          deleted: 1
        },
        config
      )
      .then(res => {
        notification.open({
          message: "Exclusão efetuada com sucesso!",
          description: `A unidade ${unidade.descricao}(${
            unidade.abreviacao
          }) foi removida`,
          icon: <Icon type="check" style={{ color: "green" }} />
        });
        this.fetchUnidades();
        return;
      })
      .catch(err => {
        notification.open({
          message: "Erro!",
          description: "Erro ao cadastrar a unidade desejado",
          icon: <Icon type="close" style={{ color: "red" }} />
        });
        console.log(err);
      });
  };

  render() {
    const {
      loading,
      unidades,
      visible,
      tipo,
      selecionado,
      pagination
    } = this.state;
    const columns = [
      {
        title: "Descrição",
        dataIndex: "descricao",
        key: "descricao"
      },
      {
        title: "Abreviação",
        dataIndex: "abreviacao",
        key: "abreviacao"
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
          <Breadcrumb.Item>Unidades</Breadcrumb.Item>
        </Breadcrumb>

        <div style={{ background: "#fff", padding: "1em" }}>
          <div className="table-operations">
            <Button onClick={this.fetchUnidades}>Recarregar</Button>
            <Button onClick={this.addModal}>Adicionar</Button>
          </div>
          <Table
            columns={columns}
            loading={loading}
            dataSource={unidades.data}
            rowKey="id"
          />
        </div>

        <Modal
          visible={visible}
          title={`${tipo} unidade`}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          width={350}
          footer={null}
        >
          {visible && (
            <FormUnidade
              unidade={selecionado}
              close={this.handleCancel}
              criar={this.create}
              edit={this.update}
              atualizar={this.fetchUnidades}
            />
          )}
        </Modal>
      </Content>
    );
  }
}
