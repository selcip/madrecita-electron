import React, { Component } from "react";
import { Form, Icon, Input, Button, notification } from "antd";
import PropTypes from "prop-types";
import axios from "axios";
import { url } from "../../constants";

const FormItem = Form.Item;

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

type Props = {};

class FormLogin extends Component<Props> {
  state = {
    loading: false
  };

  componentDidMount = () => {
    this.props.form.validateFields();
  };

  login = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState({ loading: true });
        axios
          .post(`${url}/auth/local`, {
            identifier: values.username,
            password: values.password
          })
          .then((res) => {
            localStorage.setItem("jwt", res.data.jwt);
            localStorage.setItem("id", res.data.user.id);
            return this.props.redirect();
          })
          .catch(error => {
            notification.open({
              message: "Opps!",
              description: "Usuário ou senha incorretos!",
              icon: <Icon type="close" style={{ color: "red" }} />
            });
            console.log(error);
            this.setState({ loading: false });
          });
        this.setState({ loading: false });
      }
    });
  };

  render() {
    const {
      getFieldDecorator,
      getFieldsError,
      getFieldError,
      isFieldTouched
    } = this.props.form;
    const styles = {
      centralizado: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
      }
    };

    const userNameError =
      isFieldTouched("username") && getFieldError("username");
    const passwordError =
      isFieldTouched("password") && getFieldError("password");

    return (
      <div className="login">
        <Form
          onSubmit={this.login}
          className="login-form"
          style={styles.centralizado}
        >
          <FormItem
            validateStatus={userNameError ? "error" : ""}
            help={userNameError || ""}
          >
            {getFieldDecorator("username", {
              rules: [
                {
                  required: true,
                  message: "Por favor, entre com seu e-mail ou username"
                }
              ]
            })(
              <Input
                prefix={
                  <Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />
                }
                placeholder="Username / E-mail"
              />
            )}
          </FormItem>
          <FormItem
            validateStatus={passwordError ? "error" : ""}
            help={passwordError || ""}
          >
            {getFieldDecorator("password", {
              rules: [
                { required: true, message: "Por favor, ente com sua senha!" }
              ]
            })(
              <Input
                prefix={
                  <Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />
                }
                type="password"
                placeholder="Password"
              />
            )}
          </FormItem>
          <FormItem>
            <Button
              type="primary"
              htmlType="submit"
              loading={this.state.loading}
              disabled={hasErrors(getFieldsError())}
            >
              Login
            </Button>
          </FormItem>
        </Form>
      </div>
    );
  }
}
const WrappedNormalLoginForm = Form.create()(FormLogin);

export default WrappedNormalLoginForm;
