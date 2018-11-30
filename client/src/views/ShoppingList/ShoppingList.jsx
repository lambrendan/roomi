import React from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';


class ShoppingList extends React.Component {
    constructor(props) {
        super(props);
        const itemsNeeded = [
            {name: "apples"},
            {name: "bananas"},
            {name: "soap"},
            {name: "laundry detergent"},
            {name: "salad"}
        ];

        this.state = {
            itemsList: itemsNeeded,
        };

    }
    render() {
        return (
            <div>
                
            </div>
        );
    }
}

export default ShoppingList;