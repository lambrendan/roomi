import React from 'react';
import { Tabs, Tab, Table, Panel } from 'react-bootstrap'
import Sidebar from '../../components/Sidebar/Sidebar';
import Bill from '../../components/BillsAndPayments/Bill';
import './BillsAndPayments.css';



class BillsAndPayments extends React.Component {
    constructor(props) {
        super(props);
        const reqArr = [ {name: "one", amount: "30", dueDate: "10/20"},
                        {name: "one", amount: "30", dueDate: "10/20"},
                        {name: "one", amount: "30", dueDate: "10/20"},
                        {name: "one", amount: "30", dueDate: "10/20"},
                        {name: "one", amount: "30", dueDate: "10/20"},
                        {name: "one", amount: "30", dueDate: "10/20"},
                        {name: "one", amount: "30", dueDate: "10/20"},
                    ];
        const paidArr = [ {name: "two", amount: "20", dueDate: "11/10"},
                          {name: "two", amount: "20", dueDate: "11/10"},
                        ]
        this.state = {
            myReqArray: reqArr,
            myPaidArray: paidArr,
        };

    }


    renderBill(bill, index) {
        return (
            <tr key={index}>
                <td>{bill.name}</td>
                <td>{bill.amount}</td>
                <td>{bill.dueDate}</td>
            </tr>
        )
    }

    render() {

        
        return(
            <div>
                <Tabs defaultActiveKey={1}>
                    <Tab eventKey={1} title="THIS MONTH">
                        <div className="customTable">
                            <Table responsive bordered>
                                <thead>
                                    <tr>
                                        <th colSpan="3">Remaining</th>
                                    </tr>
                                    <tr>
                                        <th>Name</th>
                                        <th>Amount</th>
                                        <th>Due Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.myReqArray.map(this.renderBill)}
                                </tbody>
                            </Table>
                            <Table responsive bordered>
                                <thead>
                                    <tr>
                                        <th colSpan="3">Paid</th>
                                    </tr>
                                    <tr>
                                        <th>Name</th>
                                        <th>Amount</th>
                                        <th>Due Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.myPaidArray.map(this.renderBill)}
                                </tbody>
                            </Table>
                        </div>
                    </Tab>
                    <Tab eventKey={2} title="RECURRING">
                        <div className="customTable">
                            <Table bordered striped>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Amount</th>
                                        <th>Due Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.myPaidArray.map(this.renderBill)}
                                </tbody>
                            </Table>
                        </div>
                    </Tab>
                    <Tab eventKey={3} title="YOUR HOUSEHOLD">
                        Table holding this Household's payments.
                    </Tab>
                </Tabs>
            </div>
        );
    }
}

export default BillsAndPayments;