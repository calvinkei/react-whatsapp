import { EventEmitter } from "events";

import dispatcher from "../dispatcher";

class Stores extends EventEmitter {

  apiRoute = 'http://localhost:3000/api/';
  socketIoRoute = 'http://localhost:3000/';

  constructor() {
    super();
    if(window.localStorage['user'] && !this.user){
      try{
        this.user = JSON.parse(window.localStorage['user']);
      }catch(e) {
        window.localStorage.removeItem('user');
      }
    }
  }

  changeNavTitle(title) {
    this.navTitle = title;
    this.emit("navTitleChanged");
  }

  login(username) {
    fetch(`${this.apiRoute}user/${username}`).then((response) => {
      return response.json();
    }).then((json) => {
      if(json[0]){
        window.localStorage['user'] = JSON.stringify(json[0]);
        this.user = json[0];
        this.socket = io.connect(`${this.socketIoRoute}${json[0].id}`, {'multiplex': false});
        this.socket.on('newMsg', (data) => {
          this.newMsg = data;
          const conversations = this.conversations.slice();
          for (let i = 0; i < conversations.length; i++){
            if (conversations[i].id == data.conversation){
              conversations[i].unread++;
              if (conversations[i].unread == 1){
                this.unreadConversations++;
              }
              conversations[i].send_time = data.send_time;
              conversations[i].content = data.content;
            }
          }
          this.conversations = conversations.sort((a, b) => {return new Date(b.send_time) - new Date(a.send_time)});
          this.emit("newMsg");
        });
        this.socket.on('read', (data) => {
          this.readMessages = data;
          this.emit("msgRead");
        });
        this.emit("loginSuccess");
      }else{
        this.errorMsg = `User doesn't exist`;
        this.emit("loginFail");
      }
    })
  }

  getConversations(userId) {
    fetch(`${this.apiRoute}conversations/${userId}`).then((response) => {
      return response.json();
    }).then((json) => {
      this.conversations = json;
      this.unreadConversations = 0;
      for(let i = 0; i < this.conversations.length; i++){
        this.unreadConversations = this.unreadConversations + (this.conversations[i].unread > 0 ? 1 : 0);
      }
      this.emit("getConversationsSuccess");
    })
  }

  getMessages(id, from, noOfMsg) {
    fetch(`${this.apiRoute}messages/${id}/${this.user.id}/${from}/${noOfMsg}`).then((response) => {
      return response.json();
    }).then((json) => {
      this.messages = json;
      if(this.conversations){
        for(let i = 0; i < this.conversations.length; i++){
          if (this.conversations[i].id == id){
            if (this.conversations[i].unread > 0){
              this.unreadConversations--;
              this.conversations[i].unread = 0;
            }
            break;
          }
        }
      }
      this.emit("getMessagesSuccess");
    })
  }

  getContacts() {
    fetch(`${this.apiRoute}users`).then((response) => {
      return response.json();
    }).then((json) => {
      this.contacts = json;
      this.emit("getContactsSuccess");
    })
  }

  addConversation(id) {
    fetch(`${this.apiRoute}conversations/${this.user.id}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({user: id})
    }).then((response) => {
      return response.json();
    }).then((json) => {
      this.newConversationId = json.id;
      this.emit("addConversationSuccess");
    })
  }

  postMessage(id, msg) {
    fetch(`${this.apiRoute}messages/${id}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(msg)
    }).then((response) => {
      return response.json();
    }).then((json) => {
      this.postedMsg = msg;
      this.postedMsgId = json.id;
      console.log(json);
      this.emit("postMessageSuccess");
    })
  }

  handleActions(action) {
    switch(action.type) {
      case "LOGIN": {
        this.login(action.username);
        break;
      }
      case "GET_CONVERSATIONS": {
        this.getConversations(action.userId);
        break;
      }
      case "GET_CONTACTS": {
        this.getContacts();
        break;
      }
      case "ADD_CONVERSATION": {
        this.addConversation(action.userId);
        break;
      }
      case "GET_MESSAGES": {
        this.getMessages(action.id, action.from, action.noOfMsg);
        break;
      }
      case "POST_MESSAGE": {
        this.postMessage(action.id, action.msg);
        break;
      }
      case "TOGGLE_UNREAD": {
        this.willShowUnread = action.yes;
        this.emit('toggleUnread');
        break;
      }
    }
  }

}

const stores = new Stores;
dispatcher.register(stores.handleActions.bind(stores));

export default stores;
