import React from "react";
import ReactDOM from "react-dom";
import { Router, Route, IndexRoute, hashHistory } from "react-router";
// import injectTapEventPlugin from 'react-tap-event-plugin';
// injectTapEventPlugin();

import Login from "./pages/Login";
import Messages from "./pages/Messages";
import Layout from "./pages/Layout";
import Conversations from "./pages/Conversations";
import Contacts from "./pages/Contacts";

const app = document.getElementById('app');

ReactDOM.render(
  <Router history={hashHistory}>
    <Route path="/">
      <IndexRoute component={Login}></IndexRoute>
    </Route>
    <Route path="/chat" component={Layout}>
      <Route path="contacts" component={Contacts}></Route>
      <Route path="conversations" component={Conversations}></Route>
      <Route path="messages/:id" component={Messages}></Route>
    </Route>
  </Router>,
app);
