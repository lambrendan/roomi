import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { Navbar, Nav, NavItem } from "react-bootstrap";
import { LinkContainer } from 'react-router-bootstrap';
import AuthRoutes from "../../AuthRoutes.jsx"
import "./Initial.css";


class Initial extends Component {
    constructor( props ) {
        super(props);
    }

    render() {
        console.log(this.props)
        return( 
            <div className="App container">
                <Navbar fluid collapseOnSelect>
                    <Navbar.Header>
                        <Navbar.Brand>
                            <Link to="/">Roomi</Link>
                        </Navbar.Brand>
                        <Navbar.Toggle />
                    </Navbar.Header>
                    <Navbar.Collapse>
                        <Nav pullRight>
                        <LinkContainer to="/signup">
                            <NavItem>
                                Signup
                            </NavItem>
                        </LinkContainer>
                        <LinkContainer to="/login">
                            <NavItem>
                                Login
                            </NavItem>
                        </LinkContainer>
                         </Nav>
                     </Navbar.Collapse>
                </Navbar>
                <AuthRoutes {...this.props} updateUser = {this.props.updateUser}/>
            </div>
        )
    }
}
export default Initial;