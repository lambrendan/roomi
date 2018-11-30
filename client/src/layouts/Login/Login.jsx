import React, { Component } from "react";
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import { withRouter } from 'react-router-dom' 
import axios from 'axios';
import "./Login.css";

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
      error: false
    };
  }

  getValidationState() {
    if( this.state.error === true ) {
        return 'error';
    }
}

  handleOnClick = event =>{
    event.preventDefault();
    var constants = {
      'email': this.state.email,
      'password': this.state.password 
    }
    axios.post("/signin", constants)
    .then( (res) => {
      axios.get("/auth")
      .then(res => {
        if( res.data.success === true ) {
          this.props.updateUser( true );
          this.props.history.push("/createHouse")
        }
        else {
          this.setState({
            error: true
          })
        }
      })
      .catch(err => {
        this.setState({
          error: true
        })
      })
    })
    .catch( err => {
      this.setState({
        error: true
      })
    }) 
  }

  validateForm() {
    return this.state.email.length > 0 && this.state.password.length > 0;
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  handleSubmit = event => {
    event.preventDefault();
  }

  render() {
    return (
            <div className="Login">
                <form onSubmit={this.handleSubmit}>
                <FormGroup validationState={this.getValidationState()} controlId="email" bsSize="large">
                    <ControlLabel>Email</ControlLabel>
                    <FormControl
                    autoFocus
                    type="email"
                    value={this.state.email}
                    onChange={this.handleChange}
                    />
                </FormGroup>
                <FormGroup controlId="password" bsSize="large">
                    <ControlLabel>Password</ControlLabel>
                    <FormControl
                    value={this.state.password}
                    onChange={this.handleChange}
                    type="password"
                    />
                </FormGroup>
                <Button
                    block
                    bsSize="large"
                    disabled={!this.validateForm()}
                    type="submit"
                    onClick={this.handleOnClick}
                >
                    Login
                </Button>
                <p style={{color: 'red'}}>{this.state.error ? "Wrong Credentials. Try Again!" : ""}</p>
                </form>
            </div>
    
    );
  }
}
export default withRouter(Login);