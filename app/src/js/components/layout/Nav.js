import React from "react";
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import {white} from 'material-ui/styles/colors'
import LeftIcon from 'material-ui/svg-icons/hardware/keyboard-arrow-left';

import Stores from '../../stores/Stores'

export default class Nav extends React.Component {

  constructor() {
    super();
    this.state = {navTitle: 'React Whatsapp', unread: 0, willShowUnread: false};
    this.changeNavTitle = this.changeNavTitle.bind(this);
    this.updateUnread = this.updateUnread.bind(this);
    this.willShowUnread = this.willShowUnread.bind(this);
  }

  componentWillMount() {
    Stores.on('navTitleChanged', this.changeNavTitle);
    Stores.on('getConversationsSuccess', this.updateUnread);
    Stores.on('getMessagesSuccess', this.updateUnread);
    Stores.on('newMsg', this.updateUnread);
    Stores.on('toggleUnread', this.willShowUnread);
  }

  componentWillUnmount() {
    Stores.removeListener("navTitleChanged", this.changeNavTitle);
    Stores.removeListener('getConversationsSuccess', this.updateUnread);
    Stores.removeListener('getMessagesSuccess', this.updateUnread);
    Stores.removeListener('newMsg', this.updateUnread);
    Stores.removeListener('toggleUnread', this.willShowUnread);
  }

  updateUnread() {
    this.setState({unread: Stores.unreadConversations});
  }

  willShowUnread() {
    window.setTimeout(() => {
      this.setState({willShowUnread: Stores.willShowUnread});
    }, 100);
  }

  changeNavTitle() {
    this.setState({navTitle: Stores.navTitle});
  }

  render() {
    const spanStyle = {
      position: 'absolute',
      top: '24px',
      left: '42px',
      fontSize: '14px',
      color: 'white',
      display: this.state.willShowUnread ? 'block' : 'none'
    }
    return (
      <AppBar
        style={{position: "fixed", top: 0}}
        title={this.state.navTitle}
        iconElementLeft={
          <div>
            <IconButton onClick={this.props.history.goBack}>
              <LeftIcon color={white} />
            </IconButton>
            <span style={spanStyle}>{this.state.unread > 0 ? this.state.unread : ''}</span>
          </div>

        }
      />
    );
  }

}
