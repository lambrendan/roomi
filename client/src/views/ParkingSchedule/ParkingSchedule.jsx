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
            parkingSpots: '',
            data: '',

        };
        this.handleOnClick = this.handleOnClick.bind(this);
        this.handleOnChange = this.handleOnChange.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
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

    componentDidMount() {
        console.log("fuck");
        this.getParkingSpots();
        console.log(this.state.housemates);
    }

    getParkingSpots() {
        axios.get('/parking')
        .then( res => {
            let i = 0;
            let parkingSpots = [];
            let houseMates = [];
            console.log(res.data.parking);
            let length = res.data.parking.length;
            while(i < length) {
                const { parkingSpot } = res.data.parking[i];
                const { housemate } = res.data.housemate[i];
                console.log(parkingSpot);
                console.log(housemate);
                parkingSpots.push(parkingSpot);
                houseMates.push(housemate);
                i+=1;
            }
            this.setState({ housemates: houseMates });
            this.setState({ parkingSpots: parkingSpots });
            console.log(houseMates);
        })
        .catch( err => {
            throw err;
        })
    }

    render() {
        console.log(this.state.housemates);
        let task = [ "dishes", "vaccum", "trash"];
        let assignee = ["Bob", "Rob", "Mike"]
        let heading = ["Parking Spot", "", "Assignee"];
        return(
            <div>
                <RoomiTable data={task} heading={heading} assignee={assignee} />
                <input type="text" onChange={this.handleOnChange} id="parkingInput"/>
                <Button onClick={this.handleOnClick}>Add Parking Spot</Button>
            </div>
        )
    }
}

export default ParkingSchedule;