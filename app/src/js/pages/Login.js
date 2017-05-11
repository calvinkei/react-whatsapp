import React from "react";
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

import Stores from '../stores/Stores';
import * as Actions from '../actions/Actions';

export default class Login extends React.Component {
  constructor() {
    super();
    this.state = {username: ''};
    this.loginSuccess = this.loginSuccess.bind(this);
  }
  componentWillMount() {
    Stores.on("loginSuccess", this.loginSuccess);
  }
  componentWillUnmount() {
    Stores.removeListener("loginSuccess", this.loginSuccess);
  }
  login() {
    Actions.login(this.state.username);
  }
  loginSuccess() {
    this.props.history.push('/chat/conversations');
  }
  render() {
    const containerStyle = {
      textAlign: "center",
      marginTop: "15%"
    }
    return (
      <MuiThemeProvider>
        <div style={containerStyle}>
          <h1 style={{fontWeight: 300, letterSpacing: 3}}>React Whatsapp</h1>
          <TextField hintText="Username" onChange={(e) => {this.setState({username: e.target.value})}} />
          <br /><br />
          <RaisedButton label="Log in" primary={true} style={{width: 256}} onClick={() => {this.login()}} />
        </div>
      </MuiThemeProvider>
    );
  }
}
