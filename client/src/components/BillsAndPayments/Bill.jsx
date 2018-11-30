import React from 'react';
import { Label, Panel } from 'react-bootstrap';

class Bill extends React.Component {
    
    render() {
        return(
            <div>
                <Panel>
                    <div>
                    {this.props.name}: ${this.props.amount}
                    </div>
                    <div>due: {this.props.dueDate}</div>
                </Panel>
            </div>
        );
    }
}

export default Bill;