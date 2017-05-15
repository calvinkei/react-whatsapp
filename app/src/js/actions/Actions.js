import dispatcher from "../dispatcher";

export function login(username) {
  dispatcher.dispatch({
    type: "LOGIN",
    username,
  });
}

export function getConversations(userId) {
  dispatcher.dispatch({
    type: "GET_CONVERSATIONS",
    userId,
  });
}

export function addConversation(userId) {
  dispatcher.dispatch({
    type: "ADD_CONVERSATION",
    userId,
  });
}

export function getContacts() {
  dispatcher.dispatch({
    type: "GET_CONTACTS"
  });
}

export function getMessages(id) {
  dispatcher.dispatch({
    type: "GET_MESSAGES",
    id,
  });
}

export function postMessage(id, msg) {
  dispatcher.dispatch({
    type: "POST_MESSAGE",
    id,
    msg,
  });
}
