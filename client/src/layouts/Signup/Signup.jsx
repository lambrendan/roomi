import React, { Component } from "react";
import { withRouter } from "react-router-dom"
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import axios from 'axios';
import "./Signup.css";

class Signup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
      first: "",
      last: "",
      error: false,
    };
  }

  validateForm() {
    return this.state.email.length > 0 && this.state.password.length > 6 
    && this.state.first.length > 0 && this.state.last.length > 0;
  }

  getValidationState() {
      if( this.state.error === true ) {
          return 'error';
      }
  }

  handleRegister = event => {
      event.preventDefault();
      const user= {
          "firstName": this.state.first,
          "lastName": this.state.last,
          "email": this.state.email,
          "password": this.state.password
      }
      if( this.validateForm() == true )  {
          axios.post('/signup', user)
          .then( res=> {
              if( res.data.code === 200 ) {
                  this.props.history.push('/');
              }
              else {
                  this.setState({
                      error: true
                  })
              }
          })
          .catch( err=> {
              this.setState({
                  error: true
              });
          })
      }
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
      console.log(this.state);
    return (
            <div className="Signup">
                <form onSubmit={this.handleSubmit}>
                <FormGroup controlId="first" bsSize="large">
                    <ControlLabel>First Name</ControlLabel>
                    <FormControl
                    type="first"
                    value={this.state.first}
                    onChange={this.handleChange}
                    />
                </FormGroup>
                <FormGroup controlId="last" bsSize="large">
                    <ControlLabel>Last Name</ControlLabel>
                    <FormControl
                    autoFocus
                    type="last"
                    value={this.state.last}
                    onChange={this.handleChange}
                    />
                </FormGroup>
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
                    onClick={this.handleRegister}
                >
                    Signup
                </Button>
                <p style={{color: 'red'}}>{this.state.error ? "This Email Already Exists." : ""}</p>
                </form>
            </div>
    );
  }
}
export default withRouter(Signup);