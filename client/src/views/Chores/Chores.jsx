import React from 'react';
import { RoomiTable } from "components/Table/RoomiTable.jsx";
import { Button } from 'react-bootstrap'
import axios from "axios";

class Chores extends React.Component {
    handleOnClick(){
        var constants = {
            'chores': this.state.value,
            'done': false,
        }
        axios.post('/chores', constants);
    }

    handleOnChange(event){
        console.log(event.target.value);
        this.setState({ value: event.target.value });
    }
    render() {
        let task = [ "dishes", "vaccum", "trash"];
        let assignee = ["Bob", "Rob", "Mike"]
        let heading = ["Task", "Assignee"]
        return(
            <div>
                <RoomiTable data={task} heading={heading} assignee={assignee} />
                <input type="text" onChange={this.handleOnChange} id="taskInput"/>
                <Button onClick={this.handleOnClick}>Add Task</Button>
            </div>
        )
    }
}

export default Chores;