import React from 'react';
<<<<<<< HEAD
import { RoomiTable } from "components/Table/RoomiTable.jsx";
import { Button} from 'react-bootstrap';
=======
import Sidebar from '../../components/Sidebar/Sidebar';

>>>>>>> master

class ParkingSchedule extends React.Component {
    constructor(props){
        super(props);
        this.state = {value: ''};
        this.handleOnClick = this.handleOnClick.bind(this);
        this.handleOnChange = this.handleOnChange.bind(this);
    }
    handleOnClick(){
        document.getElementById('parkingInput').value = '';
    }
    handleOnChange(event){
        console.log(event.target.value);
        this.setState({ value: event.target.value });
    }
    render() {
<<<<<<< HEAD
        let parking = [ "P20", "P21", "P23"];
        let assignee = ["Bob", "Rob", "Mike"];
        let heading = ["Parking Spot", "Assignee"];
        return(
            <div>
                <RoomiTable data={parking} heading={heading} assignee={assignee} hasButtons={true}/>
                <input type="text" onChange={this.handleOnChange} id="parkingInput"/>
                <Button onClick={this.handleOnClick}>Add Parking Spot</Button>
            </div>
        )
=======
        return(
            <Sidebar {...this.props} />
        );
>>>>>>> master
    }
}

export default ParkingSchedule;