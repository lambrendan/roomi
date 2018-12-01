import React from 'react';
import { RoomiTable } from "components/Table/RoomiTable.jsx";
import { Button } from 'react-bootstrap'
import axios from "axios";

class Chores extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            value: '',
            chores: [],
            housemates: [],
            assignees: [],
        };
        this.handleOnClick = this.handleOnClick.bind(this);
        this.handleOnChange = this.handleOnChange.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
    }
    componentDidMount(){
        axios.get('/housemates')
        .then( res => {
            console.log(res.data.housemates);
            let housemate_list = res.data.housemates.map(item => item.housemate);
            this.setState({ housemates: housemate_list});
            //console.log(this.state.housemates);
        })
        .catch( err => {
            throw err;
        })
        this.getChores();
    }

    handleOnClick(){
        console.log(this.state.housemates[Math.floor(Math.random()*this.state.housemates.length)]);
        var constants = {
            'choresID': this.state.value,
            'housemate': this.state.housemates[Math.floor(Math.random()*this.state.housemates.length)],
            'isDone': 0,
        }
        axios.post('/chores', constants)
        .then( res => {
            if(res.data.failed == false){
                console.log("added to chores successfully");
            }
            else{
                console.log("failed to post chores");
            }
        })
        .catch( err => {
            throw err;
        })
        document.getElementById('taskInput').value = '';
    }

    getChores(){
        axios.get('/chores')
        .then( res => {
            if(res.data.failed == true){
                console.log("failed");
            }
            else{
                console.log(res.data.chores);
                //let assignees_list = res.data.chores.map(item => item.housemate);
                let chores_list = res.data.chores.map(item => {
                    const data = {
                        'task': item.chore,
                        'assignee': item.housemate,
                    }
                    return data;
                });
                //this.setState({ assignees: assignees_list});
                this.setState({ chores: chores_list});

            }
        })
        .catch( err => {
            throw err;
        })
    }

    handleOnChange(event){
        console.log(event.target.value);
        this.setState({ value: event.target.value });
    }

    render() {
        let heading = ["Task", "", "Assignee"]
        return(
            <div>
                <RoomiTable data={this.state.chores} heading={heading} hasButtons={true}/>
                <input type="text" onChange={this.handleOnChange} id="taskInput"/>
                <Button onClick={this.handleOnClick}>Add Task</Button>
            </div>
        )
    }
}

export default Chores;