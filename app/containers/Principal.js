// @flow
import React, { Component } from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { Layout, Menu, Breadcrumb, Icon, Button, Dropdown } from "antd";

import Users from "./Users";
import Clientes from "./Clientes";
import Unidades from "./Unidades";
import CentrosProducao from "./CentrosProducao";

const { Header, Content, Footer, Sider } = Layout;
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

type Props = {};

export default class Main extends Component<Props> {
  props: Props;

  state = {
    collapsed: false,
    teste: 1
  };

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed
    });
  };

  logOut = () => {
    localStorage.clear();
    this.props.history.push("/");
  };

  render() {
    const menu = (
      <Menu>
        <Menu.Item>
          <a role="button" onClick={this.logOut}>
            Sair
          </a>
        </Menu.Item>
      </Menu>
    );

    return (
      <Layout style={{ minHeight: "100vh" }} id="main">
        <Sider trigger={null} collapsed={this.state.collapsed}>
          <div className="logo" />
          <Menu theme="dark" defaultSelectedKeys={["1"]} mode="vertical">
            <Menu.Item key="1">
              <Link to="/main/user">
                <Icon type="user" />
                <span>Usuários</span>
              </Link>
            </Menu.Item>
            <Menu.Item key="2">
              <Link to="/main/clientes">
                <Icon type="pie-chart" />
                <span>Clientes</span>
              </Link>
            </Menu.Item>
            <Menu.Item key="3">
              <Link to="/main/unidades">
              </Link>
                <Icon type="pie-chart" />
                <span>Unidades</span>
            </Menu.Item>
            <Menu.Item key="4">
              <Link to="/main/centros-producao">
                <Icon type="pie-chart" />
                <span>Centros Produtivos</span>
              </Link>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout>
          <Header className="header" style={{ background: "#fff", padding: 0 }}>
            <Icon
              className="trigger"
              type={this.state.collapsed ? "menu-unfold" : "menu-fold"}
              onClick={this.toggle}
            />
            <Dropdown overlay={menu}>
              <a role="button" style={{ float: "right" }}>
                <Icon type="user" style={{ width: "32px", height: "32px" }} />
                <Icon type="down" style={{ width: "32px", height: "32px" }} />
              </a>
            </Dropdown>
            {/* <Menu mode="horizontal">
              <SubMenu
                title={
                  <span>
                    <Icon type="setting" />Navigation Three - Submenu
                  </span>
                }
                style={{ lineHeight: "64px", float: "right" }}
              >
                <MenuItemGroup title="Item 1">
                  <Menu.Item key="setting:1">Option 1</Menu.Item>
                  <Menu.Item key="setting:2">Option 2</Menu.Item>
                </MenuItemGroup>
                <MenuItemGroup title="Item 2">
                  <Menu.Item key="setting:3">Option 3</Menu.Item>
                  <Menu.Item key="setting:4">Option 4</Menu.Item>
                </MenuItemGroup>
              </SubMenu>
            </Menu> */}
          </Header>
          <Content style={{ margin: "0 16px" }}>
            <Route exact path="/main/user" component={Users} />
            <Route exact path="/main/clientes" component={Clientes} />
            <Route exact path="/main/unidades" component={Unidades} />
            <Route
              exact
              path="/main/centros-producao"
              component={CentrosProducao}
            />
          </Content>
          <Footer style={{ textAlign: "center" }}>
            Ant Design ©2016 Created by Ant UED
          </Footer>
        </Layout>
      </Layout>
    );
  }
}
