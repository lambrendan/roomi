import React, { Component } from 'react';
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import axios from "axios";
import { withRouter } from 'react-router-dom'

class InitHousehold extends Component {
    constructor(props) {
        super(props);
        this.state = {
            householdName: '',
            householdID: '',
            name: ''
        };
    }

    handleOnClick = (event) => {
        event.preventDefault();
        axios.get("/check")
        .then( res => {
            this.setState({
                name: res.data.user.firstName + " " + res.data.user.lastName
            })
            var constants = {
                'house': this.state.householdName,
                'uID': this.state.householdID,
                'name': this.state.name
            }
            axios.post("/newHouse", constants)
            .then( (res) => {
                if(res.data.failed === false) {
                    this.props.updateHousehold(true);
                    this.props.history.push('/dashboard')
                }
                else{
                    console.log("not a valid household");
                }

            })
            .catch( err => {
                throw err;
            }) 
        })
        .catch( err => {
            throw err;
        })
       

    }

    handleOnChange = (event) =>{
        this.setState({
            [event.target.id]: event.target.value
        });
    }

    validateForm(){
        return this.state.householdName.length > 0 && this.state.householdID.length > 0;
    }

    render() {
        return(
            <div className="CreateHouseHold">
                <form>
                <FormGroup controlId="householdName" bsSize="large">
                    <ControlLabel>Household Name</ControlLabel>
                    <FormControl
                    autoFocus
                    type="text"
                    value={this.state.householdName}
                    onChange={this.handleOnChange}
                    />
                </FormGroup>
                <FormGroup controlId="householdID" bsSize="large">
                    <ControlLabel>Household ID</ControlLabel>
                    <FormControl
                    autoFocus
                    type="text"
                    value={this.state.householdID}
                    onChange={this.handleOnChange}
                    />
                </FormGroup>
                <Button
                    block
                    bsSize="large"
                    disabled={!this.validateForm()}
                    type="submit"
                    onClick={this.handleOnClick}
                >
                    Create Household!
                </Button>
                </form>
            </div>
        )
    }

}

export default withRouter(InitHousehold);