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
  message,
  Modal,
  Divider
} from "antd";
import axios from "axios";
import { url } from "../constants";
import FormCentrosProducao from "../components/CentrosProducao/Formulario";

const { Content } = Layout;

type Props = {};

export default class CentrosProducao extends Component<Proos> {
  props: props;

  state = {
    centrosProducao: {
      data: []
    },
    visible: false,
    selecionado: {},
    loading: false,
    tipo: "Adicionar"
  };

  componentWillMount = () => {
    this.fetchCentrosProducao();
  };

  fetchCentrosProducao = e => {
    const jwt = localStorage.getItem("jwt");
    const config = {
      headers: { Authorization: "Bearer " + jwt }
    };

    this.setState({ loading: true });

    axios
      .get(`${url}/centrosproducao?deleted=0`, config)
      .then(res =>
        this.setState({ centrosProducao: { data: res.data }, loading: false })
      )
      .catch(err => {
        message.error("Erro ao buscar os dados do centro de produção");
        this.setState({ loading: false });
      });
  };

  addModal = () => {
    this.setState({ selecionado: {}, visible: true, tipo: "Adicionar" });
  };

  create = centrosProducao => {
    const jwt = localStorage.getItem("jwt");
    const config = {
      headers: { Authorization: "Bearer " + jwt }
    };
    console.log(centrosProducao);
    axios
      .post(
        `${url}/centrosproducao`,
        {
          descricao: centrosProducao.descricao,
          produtivo: centrosProducao.produtivo ? 1 : 0
        },
        config
      )
      .then(res => {
        notification.open({
          message: "Sucesso!",
          description: `O centro de produção ${
            centrosProducao.descricao
          } foi adicionado`,
          icon: <Icon type="check" style={{ color: "green" }} />
        });
        this.handleCancel();
        this.fetchCentrosProducao();
        return;
      })
      .catch(err => {
        notification.open({
          message: "Erro!",
          description: "Erro ao cadastrar o centro de produção desejado",
          icon: <Icon type="close" style={{ color: "red" }} />
        });
        this.setState({ loading: false });
        console.log(error);
      });
  };

  deletar = centroProducao => {
    const jwt = localStorage.getItem("jwt");
    const config = {
      headers: { Authorization: "Bearer " + jwt }
    };

    axios
      .put(
        `${url}/centrosproducao/${centroProducao.id}`,
        { deleted: 1 },
        config
      )
      .then(res => {
        notification.open({
          message: "Exclusão efetuada com sucesso!",
          description: `O centro de produção ${
            centroProducao.descricao
          } foi removido`,
          icon: <Icon type="check" style={{ color: "green" }} />
        });
        this.fetchCentrosProducao();
        return;
      })
      .catch(err => {
        notification.open({
          message: "Erro!",
          description: "Erro ao editar o centro de produção",
          icon: <Icon type="close" style={{ color: "red" }} />
        });
        console.log(err);
      });
  };

  update = centroProducao => {
    const jwt = localStorage.getItem("jwt");
    const config = {
      headers: { Authorization: "Bearer " + jwt }
    };

    let obj = {
      descricao: centroProducao.descricao,
      produtivo: centroProducao.produtivo ? 1 : 0
    };

    axios
      .put(`${url}/centrosproducao/${this.state.selecionado.id}`, obj, config)
      .then(res => {
        notification.open({
          message: "Sucesso!",
          description: `O centro de produção ${
            centroProducao.descricao
          } foi editado`,
          icon: <Icon type="check" style={{ color: "green" }} />
        });
        this.setState({ visible: false, selecionado: {} });
        this.fetchCentrosProducao();
        return;
      })
      .catch(err => {
        notification.open({
          message: "Erro!",
          description: "Erro ao cadastrar o centro de producao desejado",
          icon: <Icon type="close" style={{ color: "red" }} />
        });
        console.log(err);
      });
  };

  handleCancel = () => {
    this.setState({
      visible: false
    });
  };

  editModal = clientes => {
    this.setState({ selecionado: clientes, visible: true, tipo: "Editar" });
  };

  addModal = () => {
    this.setState({ selecionado: {}, visible: true, tipo: "Adicionar" });
  };

  render() {
    const { loading, centrosProducao, visible, tipo, selecionado } = this.state;

    const columns = [
      {
        title: "Nome do centro de procução",
        dataIndex: "descricao",
        key: "descricao"
      },
      {
        title: "Produtivo",
        dataIndex: "produtivo",
        key: "produtivo",
        render: (text, record) => {
          return <span>{text === 1 ? "Sim" : "Não"}</span>;
        }
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
          <Breadcrumb.Item>Centros de produção</Breadcrumb.Item>
        </Breadcrumb>

        <div style={{ background: "#fff", padding: "1em" }}>
          <div className="table-operations">
            <Button onClick={this.fetchCentrosProducao}>Recarregar</Button>
            <Button onClick={this.addModal}>Adicionar</Button>
          </div>
          <Table
            columns={columns}
            loading={loading}
            dataSource={centrosProducao.data}
            rowKey="id"
            pagination={true}
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
            <FormCentrosProducao
              centrosProducao={selecionado}
              close={this.handleCancel}
              criar={this.create}
              edit={this.update}
              atualizar={this.fetchCentrosProducao}
            />
          )}
        </Modal>
      </Content>
    );
  }
}
