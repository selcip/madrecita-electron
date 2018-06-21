// @flow
import React, { Component } from "react";
import { Button } from "antd";
import FormLogin from "../components/Login/Formulario";

type Props = {};

export default class LoginPage extends Component<Props> {
  redirect = () => {
    this.props.history.push("/main/users");
  };

  props: Props;

  render() {
    return (
      <div>
        <FormLogin redirect={this.redirect} />
      </div>
    );
  }
}
