import { EventEmitter } from "events";

import dispatcher from "../dispatcher";

const apiRoute = 'http://localhost:3000/api/';

class Stores extends EventEmitter {

  changeNavTitle(title) {
    this.navTitle = title;
    this.emit("navTitleChanged");
  }

  login(username) {
    fetch(`${apiRoute}user/${username}`).then((response) => {
      return response.json();
    }).then((json) => {
      this.user = json[0];
      this.socket = io(`http://localhost:3000/${this.user.id}`);
      this.socket.on('newMsg', (data) => {
        this.emit("newMsg");
      })
      this.emit("loginSuccess");
    })
  }

  getConversations(userId) {
    fetch(`${apiRoute}conversations/${userId}`).then((response) => {
      return response.json();
    }).then((json) => {
      this.conversations = json;
      this.emit("getConversationsSuccess");
    })
  }

  getMessages(id) {
    fetch(`${apiRoute}messages/${id}/${this.user.id}`).then((response) => {
      return response.json();
    }).then((json) => {
      this.messages = json[0];
      this.emit("getMessagesSuccess");
    })
  }

  getContacts() {
    fetch(`${apiRoute}users`).then((response) => {
      return response.json();
    }).then((json) => {
      this.contacts = json;
      this.emit("getContactsSuccess");
    })
  }

  addConversation(id) {
    fetch(`${apiRoute}conversations/${this.user.id}`, {
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
    fetch(`${apiRoute}messages/${id}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(msg)
    }).then((response) => {
      this.postedMsg = msg;
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
        this.getMessages(action.id);
        break;
      }
      case "POST_MESSAGE": {
        this.postMessage(action.id, action.msg);
        break;
      }
    }
  }

}

const stores = new Stores;
dispatcher.register(stores.handleActions.bind(stores));

export default stores;
