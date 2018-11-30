import React, { Component } from 'react';
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import axios from "axios";
import { style } from "./JoinHousehold.css";
import { withRouter } from 'react-router-dom';


class JoinHousehold extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            householdID: '',
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
                name: res.data.user.firstName + " "+ res.data.user.lastName
            })
            var constants = {
                'uID': this.state.householdID,
                'name': this.state.name
            }
            axios.post("/joinHouse", constants)
            .then( (res) => {
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
        return this.state.householdID.length > 0;
    }

    render() {
        const { error } = this.state;
        return(
            <div className="JoinHouseHold">
                <form>
                <FormGroup validationState={this.getValidationState()} controlId="householdID" bsSize="large">
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
                <p style={{color: 'red'}}>{this.state.error ? "Wrong Household ID" : ""}</p>
                </form>
            </div>
        )
    }

}

export default withRouter(JoinHousehold);