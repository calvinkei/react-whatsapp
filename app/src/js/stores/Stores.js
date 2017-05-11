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
    fetch(`${apiRoute}messages/${id}`).then((response) => {
      return response.json();
    }).then((json) => {
      this.messages = json;
      this.emit("getMessagesSuccess");
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
      return response.json();
    }).then((json) => {
      this.posted = json;
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
