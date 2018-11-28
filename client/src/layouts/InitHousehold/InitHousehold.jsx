import React, { Component } from 'react';
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import axios from "axios";

class InitHousehold extends Component {
    constructor(props) {
        super(props);
        this.state = {
            householdName: '',
            householdID: '',
        };
    }

    handleOnClick = (event) => {
        event.preventDefault();
        var constants = {
            'house': this.state.householdName,
            'uID': this.state.householdID
        }
        axios.post("/newHouse", constants)
        .then( (res) => {
            this.props.hasHousehold(true);
            console.log("yep");
        })
        .catch( err => {
            this.setState({error: "Error: Not a valid household"});
        }) 
        console.log("whoops");

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

export default InitHousehold;