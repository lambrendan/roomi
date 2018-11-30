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
        var data = this.props.data;
        var assignee = this.props.assignee;
        let row_list = []
        let index = 0;
        while(index < data.length){
           let row = (
                <tr>
                    <td>{data[index]}</td>
                    <Button onClick={this.handleOnClickDelete}>Delete</Button>
                    <td>{assignee[index]}</td>
                    <Button onClick={this.handleOnClickDelete}>Delete</Button>
                    
                </tr>
               );
            row_list.push(row);
            index += 1;
        }
        return row_list;
    }
    //removes an entry
    handleOnClickDelete(){
        console.log("Delete")
    }
    //create a row that does have buttons on each row
    dataToRowButton() {
        var data = this.props.data;
        var assignee = this.props.assignee;
        let row_list = []
        let index = 0;
        while(index < data.length){
            let row = (
                <tr>
                    <td>
                        {data[index]} 
                        <Button onClick={this.handleOnClickDelete}>Delete</Button>
                    </td>
                    <td>
                        {assignee[index]}
                        <Button onClick={this.handleOnClickDelete}>Delete</Button>
                    </td>
                </tr>
               );
            row_list.push(row);
            index += 1;
        }
        return row_list;
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