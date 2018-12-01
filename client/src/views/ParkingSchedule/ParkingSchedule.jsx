import React from 'react';
import { RoomiTable } from "components/Table/RoomiTable.jsx";
import { Button} from 'react-bootstrap';
import axios from "axios";

class ParkingSchedule extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            value: '',
            housemates: [],
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
        this.addParkingSpots(parkingSpot);
        document.getElementById('parkingInput').value = '';
    }

    addParkingSpots(parkingSpot){
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
    }
    handleOnChange(event){
        console.log(event.target.value);
        this.setState({ value: event.target.value });
    }

    componentDidMount() {
        axios.get('/housemates')
        .then( res => {
            console.log(res.data.housemates);
            let housemate_list = res.data.housemates.map(item => item.housemate);
            this.setState({ housemates: housemate_list});
        })
        .catch( err => {
            throw err;
        })
        this.getParkingSpots();
    }

    getParkingSpots() {
        axios.get('/parking')
        .then( res => {
            var parkingSpots_list = res.data.parking.map(item =>{
                return item.parkingSpot;
            })
            this.setState({ parkingSpots: parkingSpots_list });
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
                <Table bordered> 
                <thead>
                    <tr>
                        {this.headingToColumn()}
                    </tr>
                </thead>
                <tbody>
                    {this.state.parkingSpots.map((item, i) => {
                        return (
                            <tr key={item.parkingSpot+item.housemate}>
                                <td key={item.parkingSpot} onClick={() => this.markChoreAsDone(item.task, item.assignee)}>{item.parkingSpot}</td>
                                <td key={item.housemate}>{item.housemate}</td>
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
                <Button onClick={this.handleOnClick}>Add Task</Button>
            </div>
    }
}

export default ParkingSchedule;