import React from 'react';
import { RoomiTable } from "components/Table/RoomiTable.jsx";
import { Button} from 'react-bootstrap';
import axios from "axios";

class ParkingSchedule extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            value: '',
            housemates: '',
            parkingSpots: ''
        };
        this.handleOnClick = this.handleOnClick.bind(this);
        this.handleOnChange = this.handleOnChange.bind(this);
    }
    handleOnClick(){
        var parkingSpot = {
            'parkingID': this.state.value,
            'housemate': null,
        }
        axios.post('/parking', parkingSpot)
        .then( res => {
            if(res.data.failed === false) {
                console.log("success");
            }
            else{
                console.log("failed");
            }
        })
        .catch( err => {
            throw err;
        })
        document.getElementById('parkingInput').value = '';
    }
    handleOnChange(event){
        console.log(event.target.value);
        this.setState({ value: event.target.value });
    }

    getParkingSpots() {
        axios.get('/parking')
        .then( res => {
            console.log("success");
            console.log(res.data.housemates);
            let i = 0;
            let parkingSpots = [];
            while(i < res.data.parkingSpots.length) {
                i+=1;
            }
            //this.setState({ housemates: res.data.housemates });
        })
        .catch( err => {
            throw err;
        })
    }
    
    getHousemates(){
        axios.get("/housemates")
        .then( res => {
            let i = 0;
            let housemates = [];
            while(i < res.data.housemates.length) {
                housemates.push(res.data.housemates[i].housemate);
                i+=1;
            }
            this.setState({ housemates: housemates });
        })
        .catch( err => {
            throw err;
        })
    }
    render() {
        let parking = [ "P20", "P21", "P23"];
        //this.getHousemates();
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