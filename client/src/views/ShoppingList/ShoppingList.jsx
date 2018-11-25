import React from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';


class ShoppingList extends React.Component {

    render() {
        return(
            <Sidebar {...this.props} />
        );
    }
}

export default ShoppingList;