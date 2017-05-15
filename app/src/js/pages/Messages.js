import React from "react";
import {Card, CardText} from 'material-ui/Card';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import {lightBlack, lightBlue300} from 'material-ui/styles/colors';
import Tick from 'material-ui/svg-icons/navigation/check';

import * as Actions from "../actions/Actions";
import Stores from "../stores/Stores";


export default class Messages extends React.Component {

  constructor() {
    super();
    this.state = {messages: [], msg: ''};
    this.setMessages = this.setMessages.bind(this);
    this.postSuccess = this.postSuccess.bind(this);
  }

  setMessages() {
    this.setState({messages: Stores.messages ? Stores.messages : []});
    window.setTimeout(() => {window.scrollTo(0,document.body.scrollHeight)}, 200);
  }

  postSuccess() {
    const messages = this.state.messages.slice();
    messages[messages.indexOf(Stores.postedMsg)].status = 1;
    console.log(Stores.postedMsg, messages, messages.indexOf(Stores.postedMsg));
    this.setState({messages});
  }

  componentWillMount() {
    Actions.getMessages(this.props.params.id);
    Stores.changeNavTitle(Stores.messageUser);
    Stores.on('getMessagesSuccess', this.setMessages);
    Stores.on('postMessageSuccess', this.postSuccess);
  }

  componentWillUnmount() {
    Stores.changeNavTitle("React Whatsapp");
    Stores.removeListener('getMessagesSuccess', this.setMessages);
    Stores.removeListener('postMessageSuccess', this.postSuccess);
  }

  timeTransform(time) {
    const currentTime = new Date();
    const givenTime = new Date(time);
    if (!time){
      return '';
    }else if (currentTime.getTime() - givenTime.getTime() < 1000*3600*24){
      return `${("0" +givenTime.getHours()).slice(-2)}:${("0" +givenTime.getMinutes()).slice(-2)}`;
    }else{
      return `${("0" +givenTime.getHours()).slice(-2)}:${("0" +givenTime.getMinutes()).slice(-2)} ${givenTime.getDate()}/${givenTime.getMonth() + 1}/${givenTime.getFullYear()}`
    }
  }

  sendMsg() {
    const currentTime = new Date();
    const messages = this.state.messages.slice();
    const msg = {send_time: currentTime, status: 1, content: this.state.msg, sender: Stores.user.id, conversation: this.props.params.id};
    messages.push(msg);
    Actions.postMessage(this.props.params.id, msg);
    messages[messages.indexOf(msg)].status = 0;
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

    const cards = this.state.messages.sort((a, b) => {return new Date(a.send_time) - new Date(b.send_time)}).map((msg, key) => (
      <div style={{textAlign: (msg.sender == Stores.user.id ? "right" : "left")}} key={key}>
        <Card style={cardStyle}>
          <CardText style={{padding: "8px 16px 0 16px"}}>
            {msg.content}
            <br />
            <span style={{float: 'right', color: lightBlack, paddingBottom: 8}}>
              <span style={{display: 'inline-block', verticalAlign: 'middle', marginRight: 10}}>{this.timeTransform(msg.send_time)}</span>
              <Tick style={{width: 16, height: 16, verticalAlign: 'middle', display: msg.sender  == Stores.user.id ? 'inline-block' : 'none'}} color={msg.status > 1 ? lightBlue300 : lightBlack} />
              <Tick style={{marginLeft: -5, width: 16, height: 16, verticalAlign: 'middle', display: (msg.sender  == Stores.user.id && msg.status > 0) ? 'inline-block' : 'none'}} color={msg.status > 1 ? lightBlue300 : lightBlack} />
            </span>
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
