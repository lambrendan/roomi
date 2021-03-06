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
            name: '',
            error: false
        };
    }
    
    getValidationState() {
        if( this.state.error === true ) {
            return 'error';
        }
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
            console.log(constants);
            axios.post("/newHouse", constants)
            .then( (res) => {
                console.log(res.data);
                console.log(this.state);
                if(res.data.failed === false) {
                    this.props.updateHousehold(true);
                    this.props.history.push('/dashboard')
                }
                else{
                    this.setState({
                        error: true
                    })
                }

            })
            .catch( err => {
                console.log(err);
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
                <p style={{color: 'red'}}>{this.state.error ? "Error: This Household ID/Household Name already exists": ""}</p>
                </form>
            </div>
        )
    }

}

export default withRouter(InitHousehold);