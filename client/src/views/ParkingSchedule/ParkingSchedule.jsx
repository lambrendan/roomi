import React from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';


class ParkingSchedule extends React.Component {

    render() {
        return(
            <Sidebar {...this.props} />
        );
    }
}

export default ParkingSchedule;