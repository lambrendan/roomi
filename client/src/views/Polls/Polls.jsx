import React from 'react';
import { Button,
    FormGroup,FormControl, ControlLabel, Form } from 'react-bootstrap';
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
        if(this.state.currentMsg.length === 0){
            axios.post('/insertReminders', data)
            .then(res => {
                if(res.data.failed === false){
                    console.log(res.data);
                    console.log("successively insert into reminders table");
                }
                else{
                    console.log("failed to insert into reminders tables");
                }
            })
            .catch( err =>{
                throw err;
            })
        }
        else{
            axios.post('/reminders', data)
            .then(res => {
                if(res.data.failed === false){
                    console.log(res.data);
                    console.log("successively update reminders table");
                }
                else{
                    console.log("failed to update reminders tables");
                }
            })
            .catch( err =>{
                throw err;
            })
        }
        this.setState({ value: ''})
    }

    handleOnChange(event){
        this.setState({ value: event.target.value });
    }

    componentDidMount(){
        axios.get('/reminders')
        .then( res => {
            if(res.data.failed === false){
                if( res.data.currentMsg[0] === undefined ) {
                    this.setState({
                      currentMsg: "Welcome to Roomi!",
                    })
                  }
                  else {
                    this.setState({ 
                      currentMsg: res.data.currentMsg[0].reminders,
                    });
                  } 
                this.props.updateMessage(this.state.currentMsg);
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
                <FormGroup controlid='formBasicText'>
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