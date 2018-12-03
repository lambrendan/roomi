import React, { Component } from "react";
import { NavItem, Nav, NavDropdown, MenuItem } from "react-bootstrap";
import axios from "axios";
import { withRouter } from 'react-router-dom'

class HeaderLinks extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: true
    }
  }

  onClickLogout = () => {
    axios.post("/logout")
    .then( res=> {
      this.props.updateUser(false);
      this.props.history.push("/")
    })
    .catch( err=> {
      throw err;
    })
  }

  render() {
    return (
      <div>
        <Nav pullRight>
          <NavItem eventKey={3} onClick={this.onClickLogout}>
            Log out
          </NavItem>
        </Nav>
      </div>
    );
  }
}

export default withRouter(HeaderLinks);
