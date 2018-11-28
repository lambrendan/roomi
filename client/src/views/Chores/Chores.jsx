import React from 'react';
<<<<<<< HEAD
import { RoomiTable } from "components/Table/RoomiTable.jsx";
import { Button } from 'react-bootstrap'
=======
import Sidebar from '../../components/Sidebar/Sidebar';

>>>>>>> master

class Chores extends React.Component {
    handleOnClick(){
        console.log("add task");
    }
    render() {
<<<<<<< HEAD
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
=======
        return(
            <Sidebar {...this.props} />
        );
>>>>>>> master
    }
}

export default Chores;