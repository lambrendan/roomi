import React from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';


class Chores extends React.Component {

    render() {
        return(
            <Sidebar {...this.props} />
        );
    }
}

export default Chores;