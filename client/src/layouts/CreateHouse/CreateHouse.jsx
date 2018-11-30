import React, { Component } from 'react';
import initHouseIndexRoutes from '../../routes/joinCreateHouse.jsx'
import { Navbar, Nav, NavItem } from "react-bootstrap";
import { LinkContainer } from 'react-router-bootstrap';
import { Switch, Route, withRouter } from 'react-router-dom'; 
import axios from 'axios';
import "./CreateHouse.css"

class CreateHouse extends Component {
    constructor(props) {
        super(props);
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
        return(
            <div className="App container">
                    <Navbar fluid collapseOnSelect>
                        <Navbar.Collapse>
                            <Nav pullLeft>
                                <LinkContainer to="/createHouse">
                                    <NavItem>
                                        Create A Household
                                    </NavItem>
                                </LinkContainer>
                            </Nav>
                            <Nav>
                                <LinkContainer to="/joinHouse">
                                    <NavItem>
                                        Join A Household
                                    </NavItem>
                                </LinkContainer>
                            </Nav>
                            <Nav pullRight>
                                <NavItem onClick={this.onClickLogout}>
                                    Logout
                                </NavItem>
                            </Nav>
                        </Navbar.Collapse>
                    </Navbar>
                    <Switch>
                        {initHouseIndexRoutes.map((prop, key) => {
                            return <Route path={prop.path} render={(props) => (<prop.component {...this.props} updateUser = {this.props.updateUser}/>)} key={key} />;
                        })}
                    </Switch>
            </div>
        )
    }

}

export default withRouter(CreateHouse);