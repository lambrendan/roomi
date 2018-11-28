import React from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';

class BillsAndPayments extends React.Component {

    render() {
        return(
            <Sidebar {...this.props} />
        );
    }
}

export default BillsAndPayments;