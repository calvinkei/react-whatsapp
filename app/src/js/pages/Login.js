import React from "react";
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

import Stores from '../stores/Stores';
import * as Actions from '../actions/Actions';

export default class Login extends React.Component {
  constructor() {
    super();
    this.state = {username: '', errorMsg: ''};
    this.loginSuccess = this.loginSuccess.bind(this);
    this.loginFail = this.loginFail.bind(this);
  }
  componentWillMount() {
    Stores.on("loginSuccess", this.loginSuccess);
    Stores.on("loginFail", this.loginFail);
  }
  componentWillUnmount() {
    Stores.removeListener("loginSuccess", this.loginSuccess);
    Stores.removeListener("loginFail", this.loginFail);
  }
  login() {
    Actions.login(this.state.username);
  }
  loginSuccess() {
    this.props.history.push('/chat/conversations');
  }
  loginFail() {
    this.setState({errorMsg: Stores.errorMsg});
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
          <TextField hintText="Username" errorText={this.state.errorMsg} onChange={(e) => {this.setState({username: e.target.value})}} />
          <br /><br />
          <RaisedButton label="Log in" primary={true} style={{width: 256}} onClick={() => {this.login()}} />
        </div>
      </MuiThemeProvider>
    );
  }
}
