import React from 'react';
import { RoomiTable } from "components/Table/RoomiTable.jsx";
import { Button} from 'react-bootstrap';
import axios from "axios";

class ParkingSchedule extends React.Component {
    constructor(props){
        super(props);
        this.state = {value: '',
            housemates: ''};
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
    getParkingSpots() {
        axios.get('')
    }
    
    getHousemates(){
        axios.get("/housemates")
        .then( res => {
            console.log("success");
            console.log(res.data.housemates);
            const { housemates } = res.data.housemates
            console.log(housemates);
            //this.setState({ housemates: res.data.housemates });
        })
        .catch( err => {
            throw err;
        })
    }
    render() {
        let parking = [ "P20", "P21", "P23"];
        this.getHousemates();
        console.log(this.state.housemates);
        let heading = ["Parking Spot", "Assignee"];
        return(
            <div>
                <RoomiTable data={parking} heading={heading} assignee={this.state.housemates} hasButtons={true}/>
                <input type="text" onChange={this.handleOnChange} id="parkingInput"/>
                <Button onClick={this.handleOnClick}>Add Parking Spot</Button>
            </div>
        )
    }
}

export default ParkingSchedule;