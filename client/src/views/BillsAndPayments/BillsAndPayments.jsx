import React from 'react';
import ReactDOM from 'react-dom';
import { Tabs, Tab, Table, Panel, Button, Modal, form,
     FormGroup,FormControl, ControlLabel, ButtonGroup, ListGroup,
     DropdownButton, MenuItem, ListGroupItem } from 'react-bootstrap'
import './BillsAndPayments.css';



class BillsAndPayments extends React.Component {
    constructor(props) {
        super(props);
        this.addBill = this.addBill.bind(this);
        this.handleHideModal = this.handleHideModal.bind(this);
        this.handleShowModal = this.handleShowModal.bind(this);
        this.handleBillNameChange = this.handleBillNameChange.bind(this);
        this.handleBillAmountChange = this.handleBillAmountChange.bind(this);
        this.handleBillDueDateChange = this.handleBillDueDateChange.bind(this);

        this.deleteBill = this.deleteBill.bind(this);
        this.handleBillDeletion = this.handleBillDeletion.bind(this);

        this.handleBillPayment = this.handleBillPayment.bind(this);

        this.handleResetBills = this.handleResetBills.bind(this);

        const billArr = [ {name: "one", amount: "30", dueDate: "10/20", paid: false, recurring: true,},
                        {name: "two", amount: "30", dueDate: "10/20", paid: false, recurring: false,},
                        {name: "three", amount: "30", dueDate: "10/20", paid: false, recurring: true,},
                        {name: "four", amount: "30", dueDate: "10/20", paid: false, recurring: false,},
                        {name: "five", amount: "30", dueDate: "10/20", paid: false, recurring: false,},
                        {name: "six", amount: "30", dueDate: "10/20", paid: true, recurring: false,},
                        {name: "seven", amount: "30", dueDate: "10/20", paid: true, recurring: true,},
                        {name: "eight", amount: "20", dueDate: "11/10", paid: true, recurring: false,},
                        {name: "nine", amount: "20", dueDate: "11/10", paid: true, recurring: false,},
                        ];
        this.state = {
            myBillArr: billArr,
            showModal: false,
            showDeleteModal: false,
            formBillName: '',
            formBillAmount: '',
            formBillDueDate: '',
        };

    }

    handleShowModal() {
        this.setState({showModal: true});
    }
    handleHideModal() {
        this.setState({showModal: false});
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

    addBill() {
        const billName = this.state.formBillName;
        const billAmount = this.state.formBillAmount;
        const billDueDate = this.state.formBillDueDate;
        const billEntry = { name: billName, amount: billAmount, dueDate: billDueDate, paid: false };

        let billArr = this.state.myBillArr;
        billArr.push(billEntry);
        this.setState({myBillArr: billArr,
            formBillName: '',
            formBillAmount: '',
            formBillDueDate: '',});
        this.handleHideModal();
    }

    deleteBill() {
        console.log('deletebill');
        this.handleHideDeleteModal();
    }

    handleBillNameChange(e) {
        this.setState({ formBillName: e.target.value });
    }

    handleBillAmountChange(e) {
        this.setState({ formBillAmount: e.target.value });
    }

    handleBillDueDateChange(e) {
        this.setState({ formBillDueDate: e.target.value });
    }

    handleBillDeletion(e) {
        let val = null;
        for(let i of this.state.myBillArr) {
            if (i.name === e.target.text) {
                val = i;
                break;
            }
        }
        let ind = this.state.myBillArr.indexOf(val);
        
        let tempArr = this.state.myBillArr;
        tempArr.splice(ind, 1);
        this.setState({myBillArr: tempArr});
      
    }

    handleBillPayment(e) {
        let val = null;
        for(let i of this.state.myBillArr) {
            if (i.name === e.target.text) {
                val = i;
                break;
            }
        }
        let paidArr = this.state.myBillArr;
        val.paid = true;

        this.setState({ myBillArr: paidArr });

    }

    handleResetBills(e) {
        let tempArr = this.state.myBillArr;
        for(let i = 0; i < tempArr.length; ++i) {
            tempArr[i].paid = false;
        }
        this.setState({myBillArr: tempArr});
    }


    render() {
        return(
            <div>
                <Tabs defaultActiveKey={1}>
                    <Tab eventKey={1} title="THIS MONTH">
                        <div className="customTable">
                            <div className="tableButton">
                                <ButtonGroup vertical>
                                    <Button bsSize="large" onClick={this.handleShowModal} >
                                        Add Bill
                                    </Button>
                                    <DropdownButton bsSize="large" title="Pay Bill">
                                        {this.state.myBillArr.map((bill, index) => {
                                            if (bill.paid === false)
                                                return (<MenuItem key={index} onClick={this.handleBillPayment}>{bill.name}</MenuItem>);
                                        })}
                                    </DropdownButton>
                                    <DropdownButton bsSize="large" title="Remove Bill">
                                        {this.state.myBillArr.map((bill, index) => {
                                            return (<MenuItem key={index} onClick={this.handleBillDeletion}>{bill.name}</MenuItem>);
                                        })}
                                        
                                    </DropdownButton>
                                    <Button bsSize="large" onClick={this.handleResetBills}>Reset Bills</Button>
                                </ButtonGroup>
                            </div>
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
                                    {/* {this.state.myBillArr.map(this.renderBill)} */}
                                    {this.state.myBillArr.map((bill, index) => {
                                        if(bill.paid === false) {
                                            return (
                                                <tr key={index}>
                                                    <td>{bill.name}</td>
                                                    <td>{bill.amount}</td>
                                                    <td>{bill.dueDate}</td>
                                                </tr>
                                            );
                                        }
                                    })
                                    }
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
                                    {/* {this.state.myBillArr.map(this.renderBill)} */}
                                    {this.state.myBillArr.map((bill, index) => {
                                        if(bill.paid === true) {
                                            return (
                                                <tr key={index}>
                                                    <td>{bill.name}</td>
                                                    <td>{bill.amount}</td>
                                                    <td>{bill.dueDate}</td>
                                                </tr>
                                            );
                                        }
                                    })
                                    }
                                </tbody>
                            </Table>
                        </div>
                        
                        <Modal
                            show={this.state.showModal}
                            onHide={this.handleHideModal}
                        >
                            <Modal.Header closeButton>
                                <Modal.Title id="contained-modal-title-lg">
                                Add Bill
                                </Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <div>
                                <form>
                                    <FormGroup
                                    controlId="formBasicText"
                                    >
                                        <ControlLabel>Bill Name</ControlLabel>
                                        <FormControl
                                            type="text"
                                            value={this.state.formBillName}
                                            placeholder="Enter Bill Name"
                                            onChange={this.handleBillNameChange}
                                        />
                                        <ControlLabel>Bill Amount</ControlLabel>
                                        <FormControl
                                            type="text"
                                            value={this.state.formBillAmount}
                                            placeholder="Enter Bill Amount"
                                            onChange={this.handleBillAmountChange}
                                        />
                                        <ControlLabel>Bill Due Date</ControlLabel>
                                        <FormControl
                                            type="text"
                                            value={this.state.formBillDueDate}
                                            placeholder="Enter Bill Name"
                                            onChange={this.handleBillDueDateChange}
                                        />
                                    </FormGroup>
                                </form>
                                </div>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button onClick={this.addBill}>Submit</Button>
                            </Modal.Footer>
                        </Modal>

                    </Tab>
                    <Tab eventKey={2} title="RECURRING">
                        <div className="customTable">
                            <Table bordered>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Amount</th>
                                        <th>Due Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                {this.state.myBillArr.map((bill, index) => {
                                        if(bill.recurring === true) {
                                            return (
                                                <tr key={index}>
                                                    <td>{bill.name}</td>
                                                    <td>{bill.amount}</td>
                                                    <td>{bill.dueDate}</td>
                                                </tr>
                                            );
                                        }
                                    })
                                    }
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