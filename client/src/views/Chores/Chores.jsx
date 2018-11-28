import React from 'react';
import { RoomiTable } from "components/Table/RoomiTable.jsx";
import { Button } from 'react-bootstrap'

class Chores extends React.Component {
    handleOnClick(){
        console.log("add task");
    }
    render() {
        let task = [ "dishes", "vaccum", "trash"];
        let assignee = ["Bob", "Rob", "Mike"]
        let heading = ["Task", "Assignee"]
        return(
            <div>
                <RoomiTable data={task} heading={heading} assignee={assignee} />
                <input type="text"/>
                <Button onClick={this.handleOnClick}>Add Task</Button>
            </div>
        )
    }
}

export default Chores;