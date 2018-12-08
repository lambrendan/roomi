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
        this.reshuffle = this.reshuffle.bind(this);
        this.getChores = this.getChores.bind(this);
        this.getChoresAgain = this.getChoresAgain.bind(this);
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
        let housemateToCheck = "";
        let queue = this.state.queue;
        if(this.state.housemates_with_chores.size === 0) {
            housemateToCheck = housemates[Math.floor(Math.random() * housemates.length)];
            let housemateSet = new Set();
            housemateSet.add(housemateToCheck);
            this.setState({housemates_with_chores : housemateSet});
            queue = queue.filter( housemate => !housemateSet.has(housemate));
            queue.push(housemateToCheck);
            this.setState({queue: queue});
            console.log(queue);
        }
        else{
            housemateToCheck = queue.shift();
            queue.push(housemateToCheck);
            console.log(queue);
            this.setState({queue: queue});
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
                this.setState({ chores_assignees: choresArr});
                console.log(choresArr);
                console.log("added to chores successfully");
                this.getChoresAgain();
                //this.setState({value : ''});
            }
            else{
                console.log("failed to post chores");
            }
        })
        .catch( err => {
            throw err;
        })
        document.getElementById('taskInput').value = '';
        this.setState({value : ''});
    }

    getChoresAgain(){
        axios.get('/chores')
        .then( res => {
            if(res.data.failed == true){
                console.log("failed");
            }
            else{
                //let assignees_list = res.data.chores.map(item => item.housemate);
                let chores_assignees_list = res.data.chores.map(item => {
                    const data = {
                        'chore': item.chore,
                        'housemate': item.housemate,
                        'isDone': item.isDone,
                    }
                    return data;
                });
                console.log(chores_assignees_list);
                this.setState({ chores_assignees: chores_assignees_list });
                var housematesHasChores = new Set(chores_assignees_list.map(item => item.assignee));
                this.setState({ housemates_with_chores: housematesHasChores});
                let isDone = chores_assignees_list.map( item => item.isDone);
                this.setState({isDone: isDone});
                this.mapBackgroundColor();
            }
        })
        .catch( err => {
            throw err;
        })
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
                        'chore': item.chore,
                        'housemate': item.housemate,
                        'isDone': item.isDone,
                    }
                    return data;
                });
                this.setState({ chores_assignees: chores_assignees_list });
                var housematesHasChores = new Set(chores_assignees_list.map(item => item.housemate));
                this.setState({ housemates_with_chores: housematesHasChores});
                let isDone = chores_assignees_list.map( item => item.isDone);
                this.setState({isDone: isDone});
                var noChores = [...this.state.housemates].filter( housemate => !this.state.housemates_with_chores.has(housemate));
                housematesHasChores = [...housematesHasChores];
                var correctQueueOrder = noChores.concat(housematesHasChores);
                this.setState({ queue: correctQueueOrder});
                this.mapBackgroundColor();
                console.log(correctQueueOrder);
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
                let tempQueue = this.state.queue.filter(housemate => !(body.housemate === housemate));
                tempQueue.unshift(body.housemate);
                this.setState({queue: tempQueue});
                //this.mapBackgroundColor();

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
                        this.mapBackgroundColor();
                        //this.reshuffle();
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
        let count = 0;
        for(let i of this.state.isDone){
            if(i === 1){
                count += 1;
            }
        }
        if(count === this.state.isDone.length && this.state.isDone.length != 0){
            this.reshuffle();
            let newBg = this.state.isDone.map( item => {
                if(item === 0){
                    return "#FFFFFF";
                }
                else{
                    return "#8CC152";
                }
            })
            setTimeout(
                function() {
                    this.setState({ background: newBg });
                }
                .bind(this),
                500
            );

        }
    }

    reshuffle() {
            let choresAssignment = [];
            let i = 0;
            var housematequeue = this.state.queue;
            let choresAssignments = this.state.chores_assignees;
            let length = this.state.chores_assignees.length;
            if(this.state.chores_assignees.length < this.state.housemates_with_chores.size){
                length = this.state.housemates_with_chores.size;
            }
            if(this.state.chores_assignees.length === this.state.housemates.size){
                let temp = housematequeue.shift();
                housematequeue.push(temp);
                this.setState({queue: housematequeue});
                console.log("wow");
            }
            else if(this.state.chores_assignees.length % this.state.housemates.size === 0){
                let temp = housematequeue.shift();
                housematequeue.push(temp);
                this.setState({queue: housematequeue});
                console.log("yes");
            }
            //ar housemates_with_parking_old = [...this.state.housemates_with_parking];
            while(choresAssignment.length < length){
                let housemateNew = housematequeue.shift();
                let done = choresAssignments[i].isDone;
                if(done === 0){
                    done = 1;
                }
                else{
                    done = 0;
                }
                const data = {
                    "chore": choresAssignments[i].chore,
                    "housemate": housemateNew,
                    "isDone": done,
                }
                choresAssignment.push(data);
                housematequeue.push(housemateNew);
                this.setState({queue: housematequeue});
                this.setState({ chores_assignees: choresAssignment});
                let tempIsDone = this.state.isDone;
                tempIsDone[i] = 0;
                this.setState({isDone: tempIsDone});
                i+=1;
            }
            //console.log(parkingAssignment);
            choresAssignment.map( data => {
                axios.post('/shuffleChores', data)
                .then( res => {
                    if(res.data.failed === false){
                        console.log("success reshuffling");

                    }
                    else{
                        console.log("failed to reassign parking")
                    }
                })
                .catch( err => {
                    console.log("failed");
                    throw err;
                })
                return data;
            })
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
                            <tr key={item.chore+item.housemate} style={{backgroundColor: this.state.background[i]}}>
                                <td key={"chore" + i} onClick={() => this.markChoreAsDone(item.chore, item.housemate)}>{item.chore}</td>
                                <td key={"housemate" + i}>{item.housemate}</td>
                                <td>
                                    <Button onClick={ () => this.deleteChore(item.chore, item.housemate)}>Delete</Button>
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