import React from 'react';
import { Button,
    FormGroup,FormControl, ControlLabel, ButtonGroup, Form, ListGroup,
    DropdownButton, MenuItem, ListGroupItem } from 'react-bootstrap';
import styles from './Polls.css';
import axios from 'axios';

class Polls extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            value: '',
            currentMsg: '',
        }
        this.handleOnClickChange = this.handleOnClickChange.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.handleOnChange = this.handleOnChange.bind(this);
    }
    handleOnClickChange(){
        this.setState({ currentMsg: this.state.value});
        const data = {
            currentMsg: this.state.value,
        }
        axios.post('/reminders', data)
        .then(res => {
            if(res.data.failed === false){
                console.log("successively update reminders table");
            }
            else{
                console.log("failed to update reminders tables");
            }
        })
        .catch( err =>{
            throw err;
        })
        this.setState({ value: ''})
    }

    handleOnChange(event){
        this.setState({ value: event.target.value });
    }

    componentDidMount(){
        axios.get('/reminders')
        .then( res => {
            if(res.data.failed === false){
                console.log(res.data.currentMsg);
            }
            else{
                console.log("failed to get reminders");
            }
        })
        .catch( err =>{
            throw err;
        })
    }
    render() {
        return(
        <div>
            <div>
                <ControlLabel>Current Reminder: {this.state.currentMsg}</ControlLabel>
            </div>
            <ControlLabel>Change Reminder</ControlLabel>
            <Form inline> 
                <FormGroup controlID='formBasicText'>
                    <FormControl
                        type="text"
                        value={this.state.value}
                        placeholder="Enter Reminder"
                        onChange={this.handleOnChange}
                        id='newReminder' 
                        style={styles}
                    /> {' '}
                    <Button onClick={this.handleOnClickChange} >Submit</Button>
                </FormGroup>
            </Form>
        </div>
        );
    }
}

export default Polls;