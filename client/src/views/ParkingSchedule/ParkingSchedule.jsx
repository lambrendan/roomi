import React from 'react';
import { Table, Button} from 'react-bootstrap';
import axios from "axios";

class ParkingSchedule extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            value: '',
            all_housemates: new Set(), //set
            parkingAssignments: [],
            data: '',
            housemates_with_parking: new Set(), //set

        };
        this.handleOnClick = this.handleOnClick.bind(this);
        this.handleOnChange = this.handleOnChange.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
    }
    headingToColumn(){
        return ["", "Task", "Assignee"].map((item, i) =>{
            return <th key={i}>{item}</th>
        })
    }
    handleOnClick(){
        const housemates = Array.from(this.state.all_housemates);
        let housemateToCheck = housemates[Math.floor(Math.random() * housemates.length)];
        if(this.state.all_housemates.size !== this.state.housemates_with_parking.size) {
            //housemateToCheck = housemates[Math.floor(Math.random() * housemates.length)];
            while(this.state.housemates_with_parking.has(housemateToCheck)){
                housemateToCheck = housemates[Math.floor(Math.random() * housemates.length)];
            }
        }
        console.log(housemateToCheck);
        var parkingSpot = {
            'parkingSpot': this.state.value,
            'housemate': housemateToCheck,
        }
        axios.post('/parking', parkingSpot)
        .then( res => {
            if(res.data.failed === false) {
                console.log("success adding parking");
                let parkingArr = this.state.parkingAssignments;
                parkingArr.push(parkingSpot);
                this.setState({ parkingAssignment: parkingArr});
                this.getParkingSpots();
            }
            else{
                console.log("failed");
            }
        })
        .catch( err => {
            throw err;
        })
        document.getElementById('parkingInput').value = '';
        this.setState({ value : ''});
    }

    handleOnChange(event){
        console.log(event.target.value);
        this.setState({ value: event.target.value });
    }

    componentDidMount() {
        axios.get('/housemates')
        .then( res => {
            let housemate_list = res.data.housemates.map(item => item.housemate);
            this.setState({ all_housemates: new Set(housemate_list)});
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
                const data = {
                    "parkingSpot": item.parkingSpot,
                    "housemate": item.housemate,
                }
                return data;
            })
            this.setState({ parkingAssignments: parkingSpots_list });
            var housematesHasParking = parkingSpots_list.map(item => item.housemate);
            this.setState({ housemates_with_parking: new Set(housematesHasParking)});
        })
        .catch( err => {
            throw err;
        })
    }

    deleteParking(parkingSpot, housemate){
        const body = {
            parkingSpot: parkingSpot,
            housemate: housemate,
        }
        axios.post('/deleteParking', body)
        .then( res => {
            if( res.data.failed === false ) {
                let val = null;
                console.log(res.data);
                for(let i of this.state.parkingAssignments) {
                    if (i.parkingSpot === body.parkingSpot) {
                        val = i;
                        break;
                    }
                }
                let ind = this.state.parkingAssignments.indexOf(val);   
                let tempArr = this.state.parkingAssignments;
                tempArr.splice(ind, 1);
                this.setState({parkingAssignments: tempArr});
                let tempSet = this.state.housemates_with_parking;
                tempSet.delete(body.housemate);
                this.setState({housemates_with_parking: tempSet});

            }
            else{
                console.log("failed to delete parking spot");
            }
        })
        .catch( err => {
            throw err;
        })
    }
    roundRobin(){
        if(this.state.housemates_with_parking.size < this.state.parkingAssignments.length){

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
                    {this.state.parkingAssignments.map((item, i) => {
                        return (
                            <tr key={item.parkingSpot+item.housemate}>
                                <td>
                                    <Button onClick={ () => this.deleteParking(item.parkingSpot, item.housemate)}>Delete</Button>
                                </td>
                                <td key={item.parkingSpot}>{item.parkingSpot}</td>
                                <td key={item.housemate}>{item.housemate}</td>
                            </tr>
                        )
                    })
                }
                </tbody>
            </Table>
                <input type="text" onChange={this.handleOnChange} id="parkingInput"/>
                <Button onClick={this.handleOnClick} disabled={this.state.value.length === 0 ? true : false}>Add Task</Button>
                <Button onClick={this.roundRobin}>Shuffle Parking Assignments></Button>
            </div>
        )
    }
}

export default ParkingSchedule;