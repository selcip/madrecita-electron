import React from "react";
import { render } from "react-dom";
import { LocaleProvider } from "antd";
import pt_BR from "antd/lib/locale-provider/pt_BR";
import "moment/locale/pt-br";
import { AppContainer } from "react-hot-loader";
import Root from "./containers/Root";
import { configureStore, history } from "./store/configureStore";
import "./app.global.scss";

const store = configureStore();

render(
  <LocaleProvider locale={pt_BR}>
    <AppContainer>
      <Root store={store} history={history} />
    </AppContainer>
  </LocaleProvider>,
  document.getElementById("root")
);

if (module.hot) {
  module.hot.accept("./containers/Root", () => {
    const NextRoot = require("./containers/Root"); // eslint-disable-line global-require
    render(
      <LocaleProvider locale={pt_BR}>
        <AppContainer>
          <NextRoot store={store} history={history} />
        </AppContainer>
      </LocaleProvider>,
      document.getElementById("root")
    );
  });
}
