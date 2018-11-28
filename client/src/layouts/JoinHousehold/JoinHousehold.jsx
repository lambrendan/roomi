import React, { Component } from 'react';
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import axios from "axios";
import { style } from "./JoinHousehold.css";


class JoinHousehold extends Component {
    constructor(props) {
        super(props);
        this.state = {
            householdName: '',
            householdID: '',
            error: '',
        };
       
    }
    
    handleOnClick = (event) => {
        event.preventDefault();
        var constants = {
            'house': this.state.householdName,
            'uID': this.state.householdID
        }
        axios.post("/joinHouse", constants)
        .then( (res) => {
            if(res.data.success === true) {
                this.props.hasHousehold(true);
                console.log(this.props);
            }
            else{
                console.log("not a valid household");
            }
        })
        .catch( err => {
            this.setState({error: "Error: Not a valid household"});
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
        const { error } = this.state;
        return(
            <div className="JoinHouseHold">
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
                    Join Household!
                </Button>
                <p className="errorMsg" style={style}>{error}</p>
                </form>
            </div>
        )
    }

}

export default JoinHousehold;