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
    this.state = {messages: [], msg: '', isScrollUp: false, scrollHeight: 0};
    this.setMessages = this.setMessages.bind(this);
    this.postSuccess = this.postSuccess.bind(this);
    this.updateMsg = this.updateMsg.bind(this);
    this.msgRead = this.msgRead.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
  }

  setMessages() {
    const prevScrollHeight = document.body.scrollHeight;
    const messages = [...this.state.messages.slice(), ...Stores.messages];
    messages.sort((a, b) => {return new Date(a.send_time) - new Date(b.send_time)});
    this.setState({messages});
    if(!this.state.isScrollUp){
      window.scrollTo(0, document.body.scrollHeight);
    }else if(Stores.messages.length > 0){
      window.scrollTo(0, document.body.scrollHeight - this.state.scrollHeight);
      this.setState({isScrollUp: false});
    }else{
      this.setState({isScrollUp: false});
    }
  }

  postSuccess() {
    const messages = this.state.messages.slice();
    messages[messages.indexOf(Stores.postedMsg)].status = 1;
    messages[messages.indexOf(Stores.postedMsg)].id = Stores.postedMsgId;
    this.setState({messages});
  }

  updateMsg() {
    Actions.getMessages(this.props.params.id, 0, 1);
  }

  msgRead() {
    if(this.props.params.id == Stores.readMessages.conversation){
      const messages = this.state.messages.slice();
      for(let i = messages.length - 1; i >= 0; i--){
        if (Stores.readMessages.messages.map((e) => e.id).indexOf(messages[i].id) >= 0){
          messages[i].status = 2;
          Stores.readMessages.messages.splice(Stores.readMessages.messages.indexOf(messages[i].id), 1);
          if (Stores.readMessages.messages.length <= 0){
            break;
          }
        }
      }
      this.setState({messages});
    }
  }

  handleScroll() {
    if(document.body.scrollHeight > window.innerHeight && document.body.scrollTop == 0){
      this.setState({isScrollUp: true, scrollHeight: document.body.scrollHeight});
      Actions.getMessages(this.props.params.id, this.state.messages.length, 20);
    }
  }

  componentWillMount() {
    Actions.getMessages(this.props.params.id, 0, 20);
    Stores.changeNavTitle(Stores.messageUser);
    Stores.on('getMessagesSuccess', this.setMessages);
    Stores.on('postMessageSuccess', this.postSuccess);
    Stores.on('newMsg', this.updateMsg);
    Stores.on('msgRead', this.msgRead);
    document.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    Stores.changeNavTitle("React Whatsapp");
    Stores.removeListener('getMessagesSuccess', this.setMessages);
    Stores.removeListener('postMessageSuccess', this.postSuccess);
    Stores.removeListener('newMsg', this.updateMsg);
    Stores.removeListener('msgRead', this.msgRead);
    document.removeEventListener('scroll', this.handleScroll);
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

    const cards = this.state.messages.map((msg, key) => (
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
