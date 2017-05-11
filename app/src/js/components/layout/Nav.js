import React from "react";
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import LeftIcon from 'material-ui/svg-icons/hardware/keyboard-arrow-left';

import Stores from '../../stores/Stores'

export default class Nav extends React.Component {

  constructor() {
    super();
    this.state = {navTitle: 'React Whatsapp'}
    this.changeNavTitle = this.changeNavTitle.bind(this);
  }

  componentWillMount() {
    Stores.on('navTitleChanged', this.changeNavTitle);
  }

  componentWillUnmount() {
    Stores.removeListener("navTitleChanged", this.changeNavTitle);
  }

  changeNavTitle() {
    this.setState({navTitle: Stores.navTitle});
  }

  render() {
    return (
      <AppBar
        style={{position: "fixed", top: 0}}
        title={this.state.navTitle}
        iconElementLeft={
          <IconButton onClick={this.props.history.goBack}>
            <LeftIcon />
          </IconButton>
        }
      />
    );
  }

}
