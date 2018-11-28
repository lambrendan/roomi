import React, { Component } from 'react';
import initHouseIndexRoutes from '../../routes/joinCreateHouse.jsx'
import { Navbar, Nav, NavItem } from "react-bootstrap";
import { LinkContainer } from 'react-router-bootstrap';
import { Switch, Route } from 'react-router-dom'; 
import "./CreateHouse.css"

class CreateHouse extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <div className="App container">
                    <Navbar fluid collapseOnSelect>
                        <Navbar.Collapse>
                            <Nav pullLeft>
                                <LinkContainer to="/init/createHouse">
                                    <NavItem>
                                        Join A Household
                                    </NavItem>
                                </LinkContainer>
                            </Nav>
                            <Nav pullRight>
                                <LinkContainer to="/init/joinHouse">
                                    <NavItem>
                                        Create A Household
                                    </NavItem>
                                </LinkContainer>
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

export default CreateHouse;