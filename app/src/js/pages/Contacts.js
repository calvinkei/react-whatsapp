import React from "react";
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';
import Avatar from 'material-ui/Avatar';
import Badge from 'material-ui/Badge';
import TextField from 'material-ui/TextField';
import RightIcon from 'material-ui/svg-icons/hardware/keyboard-arrow-right';
import {lightBlack} from 'material-ui/styles/colors';

import Stores from '../stores/Stores';
import * as Actions from '../actions/Actions';

export default class Contacts extends React.Component {

  constructor() {
    super();
    this.state = {contacts: [], searchString: ''};
    this.setContacts = this.setContacts.bind(this);
    this.navMessages = this.navMessages.bind(this);
    Actions.getContacts();
  }

  setContacts() {
    this.setState({contacts: Stores.contacts})
  }

  componentWillMount() {
    Stores.on('getContactsSuccess', this.setContacts);
    Stores.on('addConversationSuccess', this.navMessages);
  }

  componentWillUnmount() {
    Stores.removeListener('getContactsSuccess', this.setContacts);
    Stores.removeListener('addConversationSuccess', this.navMessages);
  }

  navMessages() {
    this.props.history.push(`/chat/messages/${Stores.newConversationId}`);
  }

  render() {
    const listItems = this.state.contacts.filter((contact) =>
      contact.username.toLowerCase().includes(this.state.searchString.toLowerCase()) && contact.id != Stores.user.id
    ).map((contact, key) => (
      <div key={key}>
        <Divider />
        <ListItem
          primaryText={
            <div>
              <span>{contact.username}</span>
            </div>
          }
          leftAvatar={<Avatar src={contact.profile_pic} />}
          rightIcon={<RightIcon />}
          onClick={() => {
            Stores.messageUser = contact.username;
            Actions.addConversation(contact.id);
          }}
        />
      </div>
    ))
    return (
      <List>
        <TextField style={{marginBottom: -8}} inputStyle={{padding: '0 10px'}} hintStyle={{padding: '0 10px'}} fullWidth={true} hintText='Search' onChange={(e) => {this.setState({searchString: e.target.value})}} />
        {listItems}
        <Divider />
      </List>
    );
  }
}
