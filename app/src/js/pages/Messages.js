import React from "react";
import {Card, CardText} from 'material-ui/Card';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import {lightBlack} from 'material-ui/styles/colors';

import * as Actions from "../actions/Actions";
import Stores from "../stores/Stores";


export default class Messages extends React.Component {

  constructor() {
    super();
    this.state = {messages: [], msg: ''};
    this.setMessages = this.setMessages.bind(this);
  }

  setMessages() {
    this.setState({messages: Stores.messages})
  }

  componentWillMount() {
    Actions.getMessages(this.props.params.id);
    Stores.changeNavTitle(Stores.messageUser);
    Stores.on('getMessagesSuccess', this.setMessages);
  }

  componentWillUnmount() {
    Stores.changeNavTitle("React Whatsapp");
    Stores.removeListener('getMessagesSuccess', this.setMessages);
  }

  timeTransform(time) {
    const currentTime = new Date();
    const givenTime = new Date(time);
    if (currentTime.getTime() - givenTime.getTime() < 1000*3600*24){
      return `${("0" +givenTime.getHours()).slice(-2)}:${("0" +givenTime.getMinutes()).slice(-2)}`;
    }else{
      return `${("0" +givenTime.getHours()).slice(-2)}:${("0" +givenTime.getMinutes()).slice(-2)} ${givenTime.getDate()}/${givenTime.getMonth() + 1}/${givenTime.getFullYear()}`
    }
  }

  sendMsg() {
    const currentTime = new Date();
    const messages = this.state.messages.slice();
    const msg = {send_time: currentTime, status: 0, content: this.state.msg, sender: Stores.user.id, conversation: this.props.params.id};
    messages.push(msg);
    Actions.postMessage(this.props.params.id, msg);
    document.getElementById('msgField').value = '';
    this.setState({messages, msg: ''});
    window.setTimeout(() => {window.scrollTo(0,document.body.scrollHeight)}, 200);
  }

  render() {
    const cardStyle = {
      margin: 10,
      display: 'inline-block',
      maxWidth: "70%",
      borderRadius: 10,
      textAlign: "left"
    }

    const cards = this.state.messages.map((msg, key) => (
      <div style={{textAlign: (msg.sender == Stores.user.id ? "right" : "left")}} key={key}>
        <Card style={cardStyle}>
          <CardText style={{padding: "8px 16px 0 16px"}}>
            {msg.content}
            <br />
            <span style={{float: 'right', color: lightBlack, paddingBottom: 8}}>{this.timeTransform(msg.send_time)}</span>
          </CardText>
        </Card>
        <br />
      </div>
    ))
    return (
      <div style={{paddingBottom: 48}}>
        {cards}
        <Card style={{position: 'fixed', bottom: -7, width: "100%"}}>
          <TextField id="msgField" style={{width: "calc(100vw - 88px)"}} onChange={(e) => {this.setState({msg: e.target.value})}} multiLine={true} hintText="Message" inputStyle={{padding: '0 10px'}} hintStyle={{padding: '0 10px'}} />
          <FlatButton label="Send" onClick={() => {this.sendMsg()}} />
        </Card>
      </div>
    );
  }
}
