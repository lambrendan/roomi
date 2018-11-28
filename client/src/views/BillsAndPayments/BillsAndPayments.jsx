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


        return(
            <div>
                <Tabs defaultActiveKey={1}>
                    <Tab eventKey={1} title="THIS MONTH">
                    <div className="customTable">
                        <Table responsive bordered striped>
                            <thead>
                                <tr>
                                    <th>Remaining</th>
                                    <th>Paid</th>
                                </tr>
                            </thead>
                            <tbody>
                                <td>
                                    <Table bordered >
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Amount Due</th>
                                            <th>Due Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.myReqArray.map(this.renderBill)}
                                    </tbody>
                                    </Table>
                                </td>
                                <td>
                                    <Table bordered striped>
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Amount Due</th>
                                            <th>Due Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.myPaidArray.map(this.renderBill)}
                                        {this.state.myPaidArray.map(this.renderBill)}
                                    </tbody>
                                    </Table>
                                </td>
                            </tbody>
                        </Table>
                    </div>
                    </Tab>
                    <Tab eventKey={2} title="RECURRING">
                        <div className="customTable">
                            <Table bordered striped>
                                <thead>
                                    <tr>
                                        <th>Title 1</th>
                                        <th>Title 2</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <td>
                                        <Bill name="One" amount="20" dueDate="11/20" />
                                        <Bill name="Two" amount="20" dueDate="11/20" />
                                        <Bill name="Three" amount="20" dueDate="11/20" />
                                    </td>
                                    <td>
                                        <Bill name="Four" amount="20" dueDate="11/20" />
                                        <Bill name="Five" amount="20" dueDate="11/20" />
                                        <Bill name="Six" amount="20" dueDate="11/20" />
                                        <Bill name="Seven" amount="20" dueDate="11/20" />
                                        <Bill name="Seven" amount="20" dueDate="11/20" />
                                        <Bill name="Seven" amount="20" dueDate="11/20" />
                                        <Bill name="Seven" amount="20" dueDate="11/20" />
                                        <Bill name="Seven" amount="20" dueDate="11/20" />
                                        <Bill name="Seven" amount="20" dueDate="11/20" />
                                    </td>
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