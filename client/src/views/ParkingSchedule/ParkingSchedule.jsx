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
            queue: [],
            parkingSpots: [],
        };
        this.handleOnClick = this.handleOnClick.bind(this);
        this.handleOnChange = this.handleOnChange.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.roundRobin = this.roundRobin.bind(this);
        this.getParkingSpots = this.getParkingSpots.bind(this);
    }
    headingToColumn(){
        return ["", "Parking Spot", "Assignee"].map((item, i) =>{
            return <th key={i}>{item}</th>
        })
    }
    handleOnClick(){
        const housemates = Array.from(this.state.all_housemates);
        let housemateToCheck = "";
        let queue = this.state.queue;
        console.log(queue);
        /*if(this.state.parkingAssignments.length % this.state.all_housemates.size === 0){
            let temp = queue.shift();
            queue.push(temp);
            this.setState({queue: queue});
            console.log("yes");
        }*/
        if(this.state.housemates_with_parking.size === 0) {
            housemateToCheck = housemates[Math.floor(Math.random() * housemates.length)];
            let housemateSet = new Set();
            this.setState({housemates_with_parking : housemateSet});
            queue = queue.filter( housemate => !housemateSet.has(housemate));
            queue.push(housemateToCheck);
            this.setState({queue: queue});
        }
        else{
            housemateToCheck = queue.shift();
            queue.push(housemateToCheck);
            this.setState({queue: queue});
        }
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
                let parkingList = this.state.parkingSpots;
                parkingList.push(parkingSpot.parkingSpot);
                this.setState({ parkingSpots: parkingList });
                this.setState({ parkingAssignment: parkingArr});
                //this.getParkingSpots();
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
            var housematesHasParking = new Set(parkingSpots_list.map(item => item.housemate));
            this.setState({ housemates_with_parking: new Set(housematesHasParking)});
            var parkingSpots = parkingSpots_list.map(item => item.parkingSpot);
            this.setState({ parkingSpots: parkingSpots});
            var noParking = [...this.state.all_housemates].filter( housemate => !this.state.housemates_with_parking.has(housemate));
            housematesHasParking = [...housematesHasParking];
            var correctQueueOrder = noParking.concat(housematesHasParking);
            this.setState({ queue: correctQueueOrder});
        
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
                //console.log(res.data);
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
                let tempQueue = this.state.queue.filter(housemate => !(body.housemate === housemate));
                tempQueue.unshift(body.housemate);
                this.setState({queue: tempQueue});
            }
            else{
                console.log("failed to delete parking spot");
            }
        })
        .catch( err => {
            throw err;
        })
    }

    roundRobin() {
        setInterval(() => {
            let parkingAssignment = [];
            let i = 0;
            var housematequeue = this.state.queue;
            let parkingAssignments = this.state.parkingAssignments;
            let length = this.state.parkingAssignments.length;
            if(this.state.parkingAssignments.length < this.state.housemates_with_parking.size){
                length = this.state.housemates_with_parking.size;
            }
            if(this.state.parkingAssignments.length === this.state.all_housemates.size){
                let temp = housematequeue.shift();
                housematequeue.push(temp);
                this.setState({queue: housematequeue});
                //console.log("yes");
            }
            //ar housemates_with_parking_old = [...this.state.housemates_with_parking];
            while(parkingAssignment.length < length){
                let housemateNew = housematequeue.shift();
                const data = {
                    parkingSpot: parkingAssignments[i].parkingSpot,
                    housemate: housemateNew,
                }
                parkingAssignment.push(data);
                housematequeue.push(housemateNew);
                this.setState({queue: housematequeue});
                this.setState({ parkingAssignments: parkingAssignment});
                i+=1;
            }
            //console.log(parkingAssignment);
            parkingAssignment.map( data => {
                axios.post('/shuffleParking', data)
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
        }, 10000);
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
                <Button onClick={this.handleOnClick} disabled={this.state.value.length === 0 ? true : false}>Add Parking Spot</Button>
                <Button onClick={this.roundRobin}>Shuffle Parking Assignments></Button>
            </div>
        )
    }
}

export default ParkingSchedule;