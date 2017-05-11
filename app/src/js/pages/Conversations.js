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

export default class Conversations extends React.Component {

  constructor() {
    super();
    this.state = {conversations: [], searchString: ''};
    this.setConversations = this.setConversations.bind(this);
    Actions.getConversations(Stores.user.id);
  }

  setConversations() {
    this.setState({conversations: Stores.conversations})
  }

  componentWillMount() {
    Stores.on('getConversationsSuccess', this.setConversations);
  }

  componentWillUnmount() {
    Stores.removeListener('getConversationsSuccess', this.setConversations);
  }

  timeTransform(time) {
    const currentTime = new Date();
    const givenTime = new Date(time);
    if (currentTime.getTime() - givenTime.getTime() < 1000*3600*24){
      return `${givenTime.getHours()}:${givenTime.getMinutes()}`;
    }else{
      return `${givenTime.getDate()}/${givenTime.getMonth() + 1}/${givenTime.getFullYear()}`
    }
  }

  navMessages(id, name) {
    Stores.messageUser = name;
    this.props.history.push(`/chat/messages/${id}`);
  }

  render() {
    const listItems = this.state.conversations.filter((conversation) =>
      conversation.username.toLowerCase().includes(this.state.searchString.toLowerCase())
    ).map((conversation, key) => (
      <div key={key}>
        <Divider />
        <ListItem
          primaryText={
            <div>
              <span>{conversation.username}</span>
              {conversation.unread != 0 ? (<Badge badgeContent={conversation.unread} secondary={true} style={{padding: '8px 24px 12px 12px'}} />) : ''}
              <span style={{color: lightBlack, float: 'right', marginTop: conversation.unread != 0 ? 6 : 0}}>{this.timeTransform(conversation.send_time)}</span>
            </div>
          }
          secondaryText={conversation.content}
          leftAvatar={<Avatar src={conversation.profile_pic} />}
          rightIcon={<RightIcon />}
          onClick={() => this.navMessages(conversation.id, conversation.username)}
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
