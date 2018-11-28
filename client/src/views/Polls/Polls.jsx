import React from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';


class Polls extends React.Component {

    render() {
        return(
            <Sidebar {...this.props} />
        );
    }
}

export default Polls;