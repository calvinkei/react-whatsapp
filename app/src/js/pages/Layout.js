import React from "react";
import { Link } from "react-router";
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import Nav from "../components/layout/Nav";

export default class Layout extends React.Component {
  render() {
    return (
      <MuiThemeProvider>
        <div style={{paddingTop: 64}}>
          <Nav history={this.props.history} />
          {this.props.children}
        </div>
      </MuiThemeProvider>

    );
  }
}
