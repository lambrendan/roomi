import React from "react";
import { Table, Button } from "react-bootstrap";
export class RoomiTable extends React.Component {
    headingToColumn(){
        return this.props.heading.map((item, i) =>{
            return <th key={i}>{item}</th>
        })
    }
    //create a row that does not have buttons on each row
    dataToRow() {
        return this.props.data.map((item, i) => {
            return (
                <tr>
                    <td key={"task" + i}>{item.task}</td>
                    <td key={"assignee" + i}>{item.assignee}</td>
                </tr>
            )
        });
    }
    //removes an entry
    handleOnClickDelete(index){
        console.log(index);
    }
    //create a row that does have buttons on each row
    dataToRowButton() {
        return this.props.data.map((item, i) => {
            return (
                <tr key={item.task+item.assignee+i}>
                    <td>{item.task}</td>
                    <td>{item.assignee}</td>
                    <td>
                        <Button onClick={this.props.delete}>Delete</Button>
                    </td>
                </tr>
            )
        });
    }

    render() {
        return (
            <Table bordered> 
                <thead>
                    <tr>
                        {this.headingToColumn()}
                    </tr>
                </thead>
                <tbody>
                    {this.props.hasButtons ? this.dataToRowButton() : this.dataToRow()}
                </tbody>
            </Table>
        );
    }
}

export default RoomiTable;