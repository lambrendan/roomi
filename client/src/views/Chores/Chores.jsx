import React from 'react';
import { Table, Button } from "react-bootstrap";
import axios from "axios";
import shuffle from 'shuffle-array';

class Chores extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            value: '',
            chores_assignees: [],
            housemates: [],
            possibleAssigned: [],
            background: []
        };
        this.handleOnClick = this.handleOnClick.bind(this);
        this.handleOnChange = this.handleOnChange.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
    }
    componentDidMount(){
        axios.get('/housemates')
        .then( res => {
            axios.get('/chores')
            .then( resTwo => {
                if(resTwo.data.failed == true){
                    console.log("failed");
                }
                else{
                    let chores_assignees_list = resTwo.data.chores.map(item => {
                        const data = {
                            'task': item.chore,
                            'assignee': item.housemate,
                            'isDone': item.isDone,
                        }
                        return data;
                    });
                    var backgroundColors = chores_assignees_list.map( item => {
                        if(item.isDone === 0){
                            return "#FFFFFF";
                        }
                        else{
                            return "#8CC152";
                        }
                    })
                    let housemate_list = res.data.housemates.map(item =>item.housemate);
                    let orderRoommates = shuffle( housemate_list, {'copy': true})
                    this.setState({
                        housemates: housemate_list,
                        chores_assignees: chores_assignees_list,
                        possibleAssigned: orderRoommates,
                        background: backgroundColors
                    });
                    console.log(this.state);
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

    handleOnClick(){
        const housemates = this.state.housemates
        if( this.state.possibleAssigned === undefined || this.state.possibleAssigned.length === 0) {
            let orderRoommates = shuffle( housemates, {'copy': true})
            this.setState({ possibleAssigned: orderRoommates }, () => {
                let currArray = this.state.possibleAssigned;
                var constants = {
                    'choresID': this.state.value,
                    'housemate': currArray.pop(),
                    'isDone': 0,
                }
                var stateObject = {
                    'task': constants.choresID,
                    'assignee': constants.housemate,
                    'isDone': constants.isDone
                }
                axios.post('/chores', constants)
                .then( res => {
                    if(res.data.failed == false){
                        this.getChores();
                        // let choresArr = this.state.chores_assignees;
                        // choresArr.push(stateObject);
                        // let bg = this.state.background;
                        // let white = "#FFFFFF";
                        // bg.push( white );
                        // this.setState({ chores_assignees: choresArr, background: bg});
                    }
                    else{
                        console.log("failed to post chores");
                    }
                })
                .catch( err => {
                    throw err;
                })
                document.getElementById('taskInput').value = '';
            })
        }
        else {
            let currArray = this.state.possibleAssigned;
            var constants = {
                'choresID': this.state.value,
                'housemate': currArray.pop(),
                'isDone': 0,
            }
            var stateObject = {
                'task': constants.choresID,
                'assignee': constants.housemate,
                'isDone': constants.isDone
            }
            axios.post('/chores', constants)
            .then( res => {
                if(res.data.failed == false){
                    this.getChores();
                    // let choresArr = this.state.chores_assignees;
                    // choresArr.push(stateObject);
                    // let bg = this.state.background;
                    // let white = "#FFFFFF";
                    // bg.push( white )
                    // this.setState({ chores_assignees: choresArr, background: bg});
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
        // let orderRoommates = shuffle( housemates, {'copy': true})
        // console.log(orderRoommates);
        // console.log(housemates);
        // let housemateToCheck = housemates[Math.floor(Math.random() * housemates.length)];
        // // if(this.state.housemates.size !== this.state.housemates_with_chores.size) {
        // //     //housemateToCheck = housemates[Math.floor(Math.random() * housemates.length)];
        // //     while(this.state.housemates_with_chores.has(housemateToCheck)){
        // //         housemateToCheck = housemates[Math.floor(Math.random() * housemates.length)];
        // //     }
        // // }
        // var constants = {
        //     'choresID': this.state.value,
        //     'housemate': housemateToCheck,
        //     'isDone': 0,
        // }
        // axios.post('/chores', constants)
        // .then( res => {
        //     if(res.data.failed == false){
        //         let choresArr = this.state.chores_assignees;
        //         choresArr.push(constants);
        //         this.setState({ chores_assignees_list: choresArr});
        //         this.getChores();
        //     }
        //     else{
        //         console.log("failed to post chores");
        //     }
        // })
        // .catch( err => {
        //     throw err;
        // })
        // document.getElementById('taskInput').value = '';
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
                var backgroundColors = chores_assignees_list.map( item => {
                    if(item.isDone === 0){
                        return "#FFFFFF";
                    }
                    else{
                        return "#8CC152";
                    }
                })
                this.setState({ chores_assignees: chores_assignees_list, background: backgroundColors});

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
                this.getChores();
                // let val = null;
                // for(let i of this.state.chores_assignees) {
                //     if (i.task === res.data.task && i.assignee === res.data.assignee) {
                //         val = i;
                //         break;
                //     }
                // }
                // let ind = this.state.chores_assignees.indexOf(val);   
                // let tempArr = this.state.chores_assignees;
                // tempArr.splice(ind, 1);
                // this.setState({chores_assignees: tempArr});
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
        var backgroundColors = this.state.chores_assignees.map( item => {
            if(item.isDone === 0){
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
                        console.log(item);
                        return (
                            <tr key={item.task+item.assignee} style={{backgroundColor: this.state.background[i]}}>
                                <td key={"chore"} onClick={() => this.markChoreAsDone(item.task, item.assignee)}>{item.task}</td>
                                <td key={"housemate"}>{item.assignee}</td>
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