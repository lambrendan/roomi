import React from 'react';
import { Table, Button } from "react-bootstrap";
import axios from "axios";

class Chores extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            value: '',
            chores_assignees: [],
            housemates: new Set(),
            assignees: [],
            heading: [],
            isDone: [],
            housemates_with_chores: new Set(),
            queue: [],
        };
        this.handleOnClick = this.handleOnClick.bind(this);
        this.handleOnChange = this.handleOnChange.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
    }
    componentDidMount(){
        axios.get('/housemates')
        .then( res => {
            let housemate_list = res.data.housemates.map(item => item.housemate);
            this.setState({ housemates: new Set(housemate_list)});
            //console.log(this.state.housemates);
        })
        .catch( err => {
            throw err;
        })
        this.getChores();
        this.mapBackgroundColor();
    }

    handleOnClick(){
        const housemates = Array.from(this.state.housemates);
        let housemateToCheck = housemates[Math.floor(Math.random() * housemates.length)];
        if(this.state.housemates.size !== this.state.housemates_with_chores.size) {
            //housemateToCheck = housemates[Math.floor(Math.random() * housemates.length)];
            while(this.state.housemates_with_chores.has(housemateToCheck)){
                housemateToCheck = housemates[Math.floor(Math.random() * housemates.length)];
            }
        }
        var constants = {
            'choresID': this.state.value,
            'housemate': housemateToCheck,
            'isDone': 0,
        }
        axios.post('/chores', constants)
        .then( res => {
            if(res.data.failed == false){
                let choresArr = this.state.chores_assignees;
                choresArr.push(constants);
                this.setState({ chores_assignees_list: choresArr});
                console.log("added to chores successfully");
                this.getChores();
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
                //let assignees_list = res.data.chores.map(item => item.housemate);
                let chores_assignees_list = res.data.chores.map(item => {
                    const data = {
                        'task': item.chore,
                        'assignee': item.housemate,
                        'isDone': item.isDone,
                    }
                    return data;
                });
                //this.setState({ assignees: assignees_list});
                this.setState({ chores_assignees: chores_assignees_list});
                var housematesHasChores = chores_assignees_list.map(item => item.housemate);
                this.setState({ housemates_with_chores: new Set(housematesHasChores)});
                let isDone = chores_assignees_list.map( item => item.isDone);
                this.setState({isDone: isDone});
                console.log(chores_assignees_list);
                this.mapBackgroundColor();
            }
        })
        .catch( err => {
            throw err;
        })
    }

    handleOnChange(event){
        this.setState({ value: event.target.value });
    }

    deleteChore(chore, housemate){
        const body = {
            chore: chore,
            housemate: housemate,
        }
        axios.post('/deleteChore', body)
        .then( res => {
            if( res.data.failed === false ) {
                let val = null;
                for(let i of this.state.chores_assignees) {
                    if (i.task === res.data.task && i.assignee === res.data.assignee) {
                        val = i;
                        break;
                    }
                }
                let ind = this.state.chores_assignees.indexOf(val);   
                let tempArr = this.state.chores_assignees;
                tempArr.splice(ind, 1);
                this.setState({chores_assignees: tempArr});
                let tempSet = this.state.housemates_with_chores;
                tempSet.delete(body.housemate);
                this.setState({housemates_with_chores: tempSet});
                let newIsDone = tempArr.map(item => item.isDone);
                this.setState({isDone: newIsDone});
                this.mapBackgroundColor();
            }
            else{
                console.log("failed to delete chore");
            }
        })
        .catch( err => {
            throw err;
        })
    }
    
    markChoreAsDone(chore, housemate){
        const body = {
            chore: chore,
            housemate: housemate,
        }
        axios.post('/choreIsDone', body)
        .then( res => {
            if(res.data.failed === false){
                const constants = {
                    chore: chore,
                    housemate: housemate,
                    isDone: !res.data.isDone,
                }
                axios.post('/markChore', constants)
                .then( res => {
                    if( res.data.failed === false ) {
                       console.log("success marking chore");
                        this.getChores();
                    }
                })
                .catch( err => {
                    throw err;
                })
            }
        })
        .catch( err => {
            throw err;
        })
    }
    
    headingToColumn(){
        return ["Task", "Assignee"].map((item, i) =>{
            return <th key={i}>{item}</th>
        })
    }

    mapBackgroundColor(){
        var backgroundColors = this.state.isDone.map( item => {
            if(item === 0){
                return "#FFFFFF";
            }
            else{
                return "#8CC152";
            }
        })
        this.setState({ background: backgroundColors });
        this.reshuffle();
    }

    reshuffle(){
        let count = 0;
        for(let i of this.state.isDone){
            if(i === 1){
                count += 1;
            }
        }
        if(count === this.state.isDone.length && this.state.isDone.length != 0){
            this.setState( {housemates_with_chores: new Set()});
            var newTasks = this.state.chores_assignees.map(item =>{
                const housemates = Array.from(this.state.housemates);
                let housemateToCheck = housemates[Math.floor(Math.random() * housemates.length)];
                if(this.state.housemates.size !== this.state.housemates_with_chores.size) {
                    //housemateToCheck = housemates[Math.floor(Math.random() * housemates.length)];
                    while(this.state.housemates_with_chores.has(housemateToCheck)){
                        housemateToCheck = housemates[Math.floor(Math.random() * housemates.length)];
                    }
                }
                var newAssignee = housemateToCheck;
                let housematesChoresSet = this.state.housemates_with_chores;
                housematesChoresSet.add(newAssignee);
                this.setState({ housemates_with_chores: housematesChoresSet});
                const data = {
                    "task": item.task,
                    "assignee": newAssignee,
                    "isDone": 0,
                }
                const body = {
                    "chore": item.task,
                    "housemate": newAssignee,
                    "isDone": 0,
                }
                axios.post('/updateChores', body)
                .then( res => {
                    if(res.data.failed == false){
                        console.log("success reassigning");
                    }
                    else{
                        console.log("failed to reassign");
                    }
                })
                .catch( err => {
                    throw err;
                })
                return data;
            })
            this.setState({chores_assignees: newTasks});
            var newIsDone = newTasks.map(item => item.isDone);
            this.setState({isDone: newIsDone});
            alert("Reassigning Chores!");
            this.mapBackgroundColor();
            console.log("reshuffled");
        }
    }

    render() {
        return(
            <div>
                <Table bordered> 
                <thead>
                    <tr>
                        {this.headingToColumn()}
                    </tr>
                </thead>
                <tbody>
                    {this.state.chores_assignees.map((item, i) => {
                        return (
                            <tr key={item.task+item.assignee} style={{backgroundColor: this.state.background[i]}}>
                                <td key={"chore" + i} onClick={() => this.markChoreAsDone(item.task, item.assignee)}>{item.task}</td>
                                <td key={"housemate" + i}>{item.assignee}</td>
                                <td>
                                    <Button onClick={ () => this.deleteChore(item.task, item.assignee)}>Delete</Button>
                                </td>
                            </tr>
                        )
                    })
                }
                </tbody>
            </Table>
                <input type="text" onChange={this.handleOnChange} id="taskInput"/>
                <Button onClick={this.handleOnClick} disabled={this.state.value.length === 0 ? true : false}>Add Task</Button>
            </div>
        )
    }
}

export default Chores;